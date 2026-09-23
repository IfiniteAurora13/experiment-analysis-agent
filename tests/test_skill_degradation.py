from __future__ import annotations

from experimentos.agent.executor import AgentExecutor
from experimentos.agent.guardrails import GuardrailEngine
from experimentos.agent.orchestrator import ExperimentOrchestrator, derive_tool_budget
from experimentos.analysis.quality_checks import QualityChecker
from experimentos.models import ExperimentRequest, ExperimentState, QualityIssue


def _conversion_request_without_successes() -> ExperimentRequest:
    return ExperimentRequest.from_dict(
        {
            "question": "请复盘这个实验，并给出是否建议发布",
            "context": {
                "objective": "提升点击率",
                "control_name": "A",
                "treatment_name": "B",
                "start_date": "2026-09-01",
                "end_date": "2026-09-09",
                "alpha": 0.05,
            },
            "metrics": [
                {
                    "name": "CTR",
                    "kind": "conversion",
                    "role": "core",
                    "direction": "increase",
                    "control_n": 10000,
                    "treatment_n": 10000,
                }
            ],
        }
    )


def _valid_conversion_request() -> ExperimentRequest:
    request = _conversion_request_without_successes()
    request.metrics[0].control_successes = 1000
    request.metrics[0].treatment_successes = 1150
    return request


def test_skill_failure_degrades_to_done_with_concerns():
    report = ExperimentOrchestrator().run(_conversion_request_without_successes())

    assert report.status == "DONE_WITH_CONCERNS"
    assert report.metric_results == []
    assert any("experiment_recap" in warning and "失败" in warning for warning in report.warnings)
    assert any(
        event.stage == "skill:experiment_recap" and event.status == "error"
        for event in report.workflow_trace
    )
    assert any(
        trace.tool_name == "analyze_metric" and trace.status == "error"
        for trace in report.agent_trace
    )
    assert any(item.label == "暂缓发布结论" for item in report.recommendations)
    assert report.selected_skills == ["quality_check", "experiment_recap", "release_recommendation"]
    assert report.workflow_trace[-1].stage == "report_generation"
    assert "不完整" in report.summary


def test_guardrail_without_metric_results_is_conservative():
    recs = GuardrailEngine().recommend([], [])
    assert [item.label for item in recs] == ["暂缓发布结论"]
    assert recs[0].reason

    severe = GuardrailEngine().recommend(
        [],
        [QualityIssue(name="SRM 风险", severity="high", impact="x", recommendation="y")],
    )
    assert [item.label for item in severe] == ["暂停业务结论解读"]


def test_bad_date_formats_yield_quality_issue_not_crash():
    checker = QualityChecker()

    bad_format = ExperimentRequest.from_dict(
        {"question": "q", "context": {"start_date": "2026/09/01", "end_date": "2026/09/09"}}
    )
    assert [issue.name for issue in checker._check_duration(bad_format)] == ["实验起止时间格式异常"]

    flipped = ExperimentRequest.from_dict(
        {"question": "q", "context": {"start_date": "2026-09-10", "end_date": "2026-09-01"}}
    )
    names = [issue.name for issue in checker._check_duration(flipped)]
    assert "实验结束时间早于开始时间" in names
    assert "实验时长偏短" not in names


def test_tool_budget_grows_with_planned_tools():
    assert derive_tool_budget(["check_quality", "analyze_metric", "make_recommendation"]) == 5
    assert derive_tool_budget(
        ["get_experiment_report", "check_quality", "analyze_metric", "analyze_segment", "make_recommendation"]
    ) == 7
    assert derive_tool_budget(["analyze_metric"], current_budget=10) == 10


def test_executor_stops_on_budget_without_error_cascade():
    orchestrator = ExperimentOrchestrator()
    state = ExperimentState(request=_valid_conversion_request())
    state.task_type = "experiment_recap"
    state.planned_skills = ["quality_check", "experiment_recap", "release_recommendation"]
    state.planned_tools = ["check_quality", "analyze_metric", "make_recommendation"]
    state.max_tool_calls = 2

    AgentExecutor(orchestrator.skills, orchestrator.tools).execute(state)

    assert len(state.tool_calls) == 2
    assert any("已达到最大 tool call 数 2" in warning for warning in state.warnings)
    assert not any(event.status == "error" for event in state.workflow_trace)
