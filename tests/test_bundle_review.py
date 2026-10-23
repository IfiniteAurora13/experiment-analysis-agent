from __future__ import annotations

import csv
import io
import json

import pytest

from examples.review_bundles import encode_csv, make_bundle
from experimentos.intake import inspect_bundle, snapshot_id
from experimentos.review import ReviewWorkspace, decide


def change_json(files, filename, **fields):
    changed = dict(files)
    value = json.loads(changed[filename])
    value.update(fields)
    changed[filename] = json.dumps(value, ensure_ascii=False).encode()
    return changed


def confirmed_card(files=None, workspace=None):
    files = files or make_bundle()
    workspace = workspace or ReviewWorkspace()
    workspace.confirm(files, by="合成数据负责人", expected_snapshot=snapshot_id(files))
    return workspace.evaluate(files)


def test_user_level_denominator_mean_and_unbiased_variance_have_independent_gold():
    inspection = inspect_bundle(make_bundle(n=20))

    assert inspection.valid
    cvr, gmv = inspection.request.metrics
    assert cvr.control_n == cvr.treatment_n == 20
    assert (cvr.control_successes, cvr.treatment_successes) == (2, 3)
    assert gmv.control_value == pytest.approx(0.1)
    assert gmv.treatment_value == pytest.approx(0.1005)
    assert gmv.control_var == pytest.approx(1.8 / 19)
    assert gmv.treatment_var == pytest.approx(1.144695 / 19)


def test_duplicate_records_are_explicit_and_do_not_change_metrics():
    clean = inspect_bundle(make_bundle())
    duplicates = inspect_bundle(make_bundle("duplicates"))

    assert duplicates.valid
    fields = ("control_n", "treatment_n", "control_successes", "treatment_successes", "control_value", "treatment_value", "control_var", "treatment_var")
    assert all(tuple(getattr(a, key) for key in fields) == tuple(getattr(b, key) for key in fields)
               for a, b in zip(clean.request.metrics, duplicates.request.metrics))
    assert duplicates.counts["duplicate_orders"] == 1
    assert duplicates.counts["duplicate_assignments"] == 1
    assert {issue.code for issue in duplicates.issues} == {"DEDUPLICATED_ORDERS", "DEDUPLICATED_ASSIGNMENTS"}


@pytest.mark.parametrize("scenario,code", [
    ("cross_group", "CROSS_GROUP_USER"), ("order_conflict", "ORDER_CONFLICT"),
    ("missing_definition", "MISSING_DEFINITION"), ("missing_watermark", "MISSING_WATERMARK"),
    ("immature", "DATA_NOT_MATURE"), ("orphan_order", "ORPHAN_ORDER"),
    ("mixed_snapshot", "SNAPSHOT_MISMATCH"), ("posthoc_policy", "POSTHOC_POLICY"),
])
def test_dirty_bundle_stops_before_statistics(scenario, code):
    class MustNotRun:
        def run(self, request):
            pytest.fail("Blocked or unconfirmed data must not reach statistics")

    workspace = ReviewWorkspace(orchestrator=MustNotRun())
    card = workspace.evaluate(make_bundle(scenario))

    assert card.status == "BLOCKED"
    assert card.report is None
    assert code in {issue["code"] for issue in card.inspection["issues"]}
    assert card.owner and card.next_action


def test_unconfirmed_data_never_reaches_statistics():
    class MustNotRun:
        def run(self, request):
            pytest.fail("No statistics before definition confirmation")

    card = ReviewWorkspace(orchestrator=MustNotRun()).evaluate(make_bundle())
    assert card.status == "NEEDS_CONFIRMATION"
    assert card.report is None


def test_extreme_date_returns_repairable_issue_instead_of_crashing():
    files = change_json(make_bundle(), "contract.json", enrollment_end="9999-12-31T00:00:00+00:00")
    card = ReviewWorkspace().evaluate(files)
    assert card.status == "BLOCKED"
    assert card.report is None
    assert card.inspection["issues"][0]["code"] == "INVALID_PERIOD"
    assert card.owner == "数据负责人"


def test_window_endpoint_is_excluded_and_late_orders_are_included():
    clean = inspect_bundle(make_bundle())
    outside = inspect_bundle(make_bundle("outside_window"))
    late = inspect_bundle(make_bundle("late_arrival"))

    assert outside.counts["excluded_orders"] == 1
    assert outside.request.metrics[0].control_successes == clean.request.metrics[0].control_successes
    assert late.counts["late_arriving_orders"] == 1
    assert late.request.metrics[0].control_successes == clean.request.metrics[0].control_successes + 1
    assert late.request.metrics[1].control_value == pytest.approx(clean.request.metrics[1].control_value + 1 / 2000)


@pytest.mark.parametrize("scenario,status", [
    ("clean", "REVIEW_READY"), ("duplicates", "REVIEW_READY"),
    ("srm", "BLOCKED"), ("guardrail_harm", "DO_NOT_SHIP"),
    ("guardrail_uncertain", "INCONCLUSIVE"), ("learning", "LEARNING_ONLY"),
])
def test_confirmed_bundle_uses_intent_and_predeclared_loss_margin(scenario, status):
    card = confirmed_card(make_bundle(scenario))

    assert card.status == status
    assert card.report.report_scope["source"] == "csv_bundle"
    assert card.confirmation["snapshot_id"] == card.snapshot_id
    assert "建议小流量灰度" not in card.markdown()


def test_changed_data_invalidates_confirmation_and_old_review(tmp_path):
    store = tmp_path / "ledger.json"
    workspace = ReviewWorkspace(store)
    files = make_bundle()
    original = confirmed_card(files, workspace)
    workspace.record_human_review(snapshot=original.snapshot_id, by="合成业务负责人")
    updated = change_json(files, "manifest.json", snapshot_at="2026-09-16T13:00:00+08:00")

    changed = workspace.evaluate(updated)

    assert changed.status == "NEEDS_CONFIRMATION"
    assert changed.snapshot_id != original.snapshot_id
    assert workspace.state["versions"][-1]["state"] == "SUPERSEDED"
    assert workspace.state["current"].get("reviewed_card_id") is None
    with pytest.raises(ValueError, match="旧确认"):
        workspace.confirm(updated, by="负责人", expected_snapshot=original.snapshot_id)
    restored = ReviewWorkspace(store).evaluate(updated)
    assert restored.status == "NEEDS_CONFIRMATION"


def test_withdrawal_clears_confirmation_and_requires_new_review(tmp_path):
    files = make_bundle()
    workspace = ReviewWorkspace(tmp_path / "ledger.json")
    original = confirmed_card(files, workspace)

    workspace.withdraw(snapshot=original.snapshot_id, by="负责人", reason="发现源表定义需复核")

    assert workspace.state["versions"][-1]["state"] == "WITHDRAWN"
    assert workspace.evaluate(files).status == "NEEDS_CONFIRMATION"
    with pytest.raises(ValueError):
        workspace.record_human_review(snapshot=original.snapshot_id, by="负责人")
    assert all(not event.get("release_executed", False) for event in workspace.state["events"])


def test_zero_orders_only_valid_after_complete_watermark_and_confirmation():
    files = make_bundle()
    files["orders.csv"] = files["orders.csv"].splitlines(keepends=True)[0]

    assert ReviewWorkspace().evaluate(files).status == "NEEDS_CONFIRMATION"
    card = confirmed_card(files)
    assert card.status == "BLOCKED"
    assert any(issue.name == "转化指标正态近似不适用" for issue in card.report.quality_issues)
    assert all(metric.control_value == metric.treatment_value == 0 for metric in card.report.metric_results)
    immature = change_json(files, "manifest.json", orders_complete_through="2026-09-10T00:00:00+08:00")
    assert ReviewWorkspace().evaluate(immature).status == "BLOCKED"


@pytest.mark.parametrize("amount", ["NaN", "Infinity", "-1", "1.001", "abc", "1000000001"])
def test_invalid_amount_is_a_product_error(amount):
    files = make_bundle()
    rows = list(csv.DictReader(io.StringIO(files["orders.csv"].decode())))
    rows[0]["paid_amount"] = amount
    files["orders.csv"] = encode_csv(rows, list(rows[0]))

    inspection = inspect_bundle(files)
    assert not inspection.valid
    assert inspection.issues[0].code == "INVALID_AMOUNT"


def test_missing_and_empty_file_have_different_versions():
    assert snapshot_id({}) != snapshot_id({"orders.csv": b""})


def test_multiple_orders_are_aggregated_at_the_randomisation_unit():
    files = make_bundle(n=20)
    rows = list(csv.DictReader(io.StringIO(files["orders.csv"].decode())))
    rows.extend([{**rows[0], "order_id": "extra-1"}, {**rows[0], "order_id": "extra-2"}])
    files["orders.csv"] = encode_csv(rows, list(rows[0]))

    inspection = inspect_bundle(files)

    assert inspection.request.metrics[0].control_successes == 2
    assert inspection.request.metrics[1].control_value == pytest.approx(0.2)
    assert inspection.request.metrics[1].control_var == pytest.approx(9.2 / 19)


@pytest.mark.parametrize("low,high,status", [
    (-0.015, -0.005, "REVIEW_READY"),  # Significant loss can be within the predeclared margin.
    (-0.02, 0.01, "INCONCLUSIVE"),
    (-0.04, -0.02, "INCONCLUSIVE"),
    (-0.04, -0.0201, "DO_NOT_SHIP"),
])
def test_guardrail_ci_boundary_has_three_distinct_outcomes(low, high, status):
    card = confirmed_card()
    guard = card.report.metric_results[1]
    guard.ci_low, guard.ci_high = low, high
    guard.significant = high < 0

    assert decide(card.report, {"intent": "conversion_guarded", "max_gmv_loss_per_user": "0.02"})["status"] == status


def test_local_human_review_is_bound_to_card_and_survives_reload(tmp_path):
    store = tmp_path / "ledger.json"
    files = make_bundle()
    workspace = ReviewWorkspace(store)
    card = confirmed_card(files, workspace)
    workspace.record_human_review(snapshot=card.snapshot_id, by="演示业务负责人")

    reloaded = ReviewWorkspace(store).evaluate(files)

    assert reloaded.human_review["card_id"] == card.card_id
    assert "演示业务负责人" in reloaded.markdown()


@pytest.mark.parametrize("scenario", ["srm", "guardrail_harm", "guardrail_uncertain", "learning"])
def test_local_human_review_cannot_override_nonready_decision(scenario):
    workspace = ReviewWorkspace()
    card = confirmed_card(make_bundle(scenario), workspace)
    with pytest.raises(ValueError):
        workspace.record_human_review(snapshot=card.snapshot_id, by="负责人")
