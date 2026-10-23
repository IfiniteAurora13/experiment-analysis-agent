from __future__ import annotations

import json
from pathlib import Path

import pytest

from experimentos.agent.guardrails import GuardrailEngine
from experimentos.agent.narrator import LLMNarrator
from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.analysis.quality_checks import QualityChecker
from experimentos.analysis.result_validation import ResultValidator
from experimentos.analysis.segmentation import SegmentAnalyzer
from experimentos.models import ExperimentRequest
from experimentos.skills.quality_check import QualityCheckSkill
from experimentos.tools.stats_engine import StatsEngine


POSITIVE_RELEASE = "建议小流量灰度或继续推进发布评审"


def valid_request(*, segments: bool = False) -> ExperimentRequest:
    payload = json.loads(Path("examples/product_detail_release.json").read_text())
    payload["metrics"][1]["treatment_value"] = payload["metrics"][1]["control_value"]
    if not segments:
        payload.pop("segments", None)
    return ExperimentRequest.from_dict(payload)


def fail(*args, **kwargs):
    raise RuntimeError("injected offline failure")


def test_failed_quality_check_blocks_positive_recommendation(monkeypatch):
    monkeypatch.setattr(QualityChecker, "run", fail)
    report = ExperimentOrchestrator().run(valid_request())

    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}
    assert report.status == "DONE_WITH_CONCERNS"
    assert report.review_gate.status == "BLOCKED"
    assert report.review_gate.checks["quality_check"] == "UNKNOWN"
    assert report.metric_results  # Preserve calculations for troubleshooting.
    assert report.review_gate.owner
    assert "重跑" in report.review_gate.next_action
    assert not any(t.tool_name == "make_recommendation" for t in report.agent_trace)


def test_successful_mandatory_checks_allow_review():
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.status == "READY"
    assert set(report.review_gate.checks.values()) == {"PASS"}
    assert POSITIVE_RELEASE in {item.label for item in report.recommendations}
    stages = [event.stage for event in report.workflow_trace]
    assert stages.index("result_validation") < stages.index("skill:release_recommendation")


def test_skipped_quality_check_is_unknown_not_passed(monkeypatch):
    monkeypatch.setattr(QualityCheckSkill, "can_handle", lambda *args: False)
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.checks["quality_check"] == "UNKNOWN"
    assert report.review_gate.status == "BLOCKED"
    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}


def test_optional_segment_failure_preserves_verified_overall_review(monkeypatch):
    monkeypatch.setattr(SegmentAnalyzer, "run", fail)
    report = ExperimentOrchestrator().run(valid_request(segments=True))

    assert report.review_gate.status == "READY"
    assert report.status == "DONE_WITH_CONCERNS"
    assert report.segment_findings == []
    assert report.metric_results
    assert POSITIVE_RELEASE in {item.label for item in report.recommendations}


def test_result_validation_failure_blocks_before_recommendation(monkeypatch):
    original = StatsEngine.analyze_metrics

    def corrupt_result(self, metrics, alpha):
        results = original(self, metrics, alpha)
        results[0].p_value = 1.5
        return results

    monkeypatch.setattr(StatsEngine, "analyze_metrics", corrupt_result)
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.checks["result_validation"] == "FAIL"
    assert report.review_gate.status == "BLOCKED"
    assert not any(t.tool_name == "make_recommendation" for t in report.agent_trace)
    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}


def test_validator_error_returns_handoff_instead_of_crashing(monkeypatch):
    monkeypatch.setattr(ResultValidator, "validate", fail)
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.checks["result_validation"] == "UNKNOWN"
    assert report.review_gate.status == "BLOCKED"
    assert report.status == "DONE_WITH_CONCERNS"


def test_missing_guardrail_result_blocks_review(monkeypatch):
    original = StatsEngine.analyze_metrics

    def omit_guardrail(self, metrics, alpha):
        return original(self, metrics, alpha)[:1]

    monkeypatch.setattr(StatsEngine, "analyze_metrics", omit_guardrail)
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.checks["metric_analysis"] == "FAIL"
    assert report.review_gate.status == "BLOCKED"
    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}


def test_recommendation_error_does_not_leave_review_ready(monkeypatch):
    monkeypatch.setattr(GuardrailEngine, "recommend", fail)
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.status == "BLOCKED"
    assert report.recommendations
    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}


def test_budget_skipping_release_still_returns_explicit_handoff(monkeypatch):
    monkeypatch.setattr("experimentos.agent.orchestrator.derive_tool_budget", lambda *args: 2)
    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.status == "BLOCKED"
    assert report.status == "DONE_WITH_CONCERNS"
    assert report.recommendations
    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}


def test_blocked_report_uses_template_without_calling_narrative_model(monkeypatch):
    monkeypatch.setattr(QualityChecker, "run", fail)
    report = ExperimentOrchestrator().run(valid_request())

    class MisleadingModel:
        def complete(self, *args):
            pytest.fail("A blocked review must not be rewritten by the model")

    rendered = LLMNarrator(MisleadingModel()).render_markdown(report)
    assert "复核状态：BLOCKED" in rendered
    assert "接管角色" in rendered
    assert "重跑" in rendered
    assert POSITIVE_RELEASE not in rendered
    assert "仅用于排障" in rendered
    assert "## 合理推断" not in rendered
    assert "## 待验证假设" not in rendered


@pytest.mark.parametrize("target,method,value", [
    (QualityChecker, "run", None),
    (QualityChecker, "run", [{"unexpected": "shape"}]),
    (StatsEngine, "analyze_metrics", None),
    (StatsEngine, "analyze_metrics", [{"unexpected": "shape"}]),
    (ResultValidator, "validate", None),
])
def test_malformed_mandatory_tool_output_returns_handoff(monkeypatch, target, method, value):
    monkeypatch.setattr(target, method, lambda *args, **kwargs: value)

    report = ExperimentOrchestrator().run(valid_request())

    assert report.review_gate.status == "BLOCKED"
    assert report.status == "DONE_WITH_CONCERNS"
    assert POSITIVE_RELEASE not in {item.label for item in report.recommendations}
    assert not any(t.tool_name == "make_recommendation" for t in report.agent_trace)
