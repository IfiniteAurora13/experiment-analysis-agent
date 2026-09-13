from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.models import ExperimentRequest


def test_needs_context_when_required_inputs_missing():
    request = ExperimentRequest.from_dict(
        {
            "question": "帮我看下这个实验要不要发布",
            "context": {"name": "推荐位改版"},
            "metrics": [],
        }
    )
    report = ExperimentOrchestrator().run(request)
    assert report.status == "NEEDS_CONTEXT"
    assert "实验目标" in report.missing_inputs


def test_basic_recap_produces_done_report():
    request = ExperimentRequest.from_dict(
        {
            "question": "请帮我复盘这个实验，并给出是否建议发布",
            "context": {
                "objective": "提升点击率",
                "control_name": "A",
                "treatment_name": "B",
                "start_date": "2026-09-01",
                "end_date": "2026-09-09",
                "alpha": 0.05
            },
            "metrics": [
                {
                    "name": "CTR",
                    "kind": "conversion",
                    "role": "core",
                    "direction": "increase",
                    "control_n": 10000,
                    "treatment_n": 10000,
                    "control_successes": 1000,
                    "treatment_successes": 1200
                }
            ]
        }
    )
    report = ExperimentOrchestrator().run(request)
    assert report.status in {"DONE", "DONE_WITH_CONCERNS"}
    assert report.metric_results
    assert report.recommendations


def test_warns_when_data_source_cannot_be_materialized(tmp_path):
    request = ExperimentRequest.from_dict(
        {
            "question": "请帮我复盘这个实验，并给出是否建议发布",
            "context": {
                "objective": "提升点击率",
                "control_name": "A",
                "treatment_name": "B",
                "start_date": "2026-09-01",
                "end_date": "2026-09-09",
                "alpha": 0.05
            },
            "data_source": {
                "kind": "duckdb",
                "database_path": str(tmp_path / "missing_demo.duckdb"),
                "metric_specs_path": "metric_specs/basic_metrics.yaml",
                "segment_specs_path": "metric_specs/basic_segments.yaml"
            }
        }
    )
    report = ExperimentOrchestrator().run(request)
    assert report.status == "NEEDS_CONTEXT"
    assert report.warnings


def test_libra_fixture_can_flow_from_registry_to_report_analysis():
    request = ExperimentRequest.from_dict(
        {
            "question": "请基于 Libra report 复盘这个实验，并给出是否建议发布",
            "context": {
                "objective": "提升点击率与下游转化",
                "control_name": "base",
                "treatment_name": "test",
                "start_date": "2026-09-01",
                "end_date": "2026-09-09",
                "alpha": 0.05
            },
            "data_source": {
                "provider": "libra",
                "kind": "libra",
                "app_id": 1001,
                "vregion": "demo-region",
                "flight_id": 10001,
                "metric_group_id": 9001,
                "report_fixture_path": "examples/libra_report_fixture.json",
                "metric_specs_path": "metric_specs/libra_metrics.yaml"
            }
        }
    )
    report = ExperimentOrchestrator().run(request)
    assert report.status == "DONE_WITH_CONCERNS"
    assert report.metric_results
    assert report.report_scope["flight_id"] == 10001
    assert any(item.name == "CTR" and item.statistical_source == "libra_platform" for item in report.metric_results)
    assert any(item.label == "不建议发布" for item in report.recommendations)
