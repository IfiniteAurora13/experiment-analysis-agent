from __future__ import annotations

from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.agent.planner import LLMPlanner
from experimentos.models import DataSourceConfig, ExperimentRequest
from experimentos.tools.libra_provider import LibraProvider


class StaticLlm:
    def __init__(self, response: str) -> None:
        self.response = response

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        return self.response


def _request() -> ExperimentRequest:
    return ExperimentRequest.from_dict(
        {
            "question": "请复盘实验并给出发布建议",
            "context": {
                "objective": "提升点击率",
                "control_name": "control",
                "treatment_name": "treatment",
                "start_date": "2026-09-01",
                "end_date": "2026-09-09",
            },
            "metrics": [
                {
                    "name": "CTR",
                    "kind": "conversion",
                    "role": "core",
                    "control_n": 1000,
                    "treatment_n": 1000,
                    "control_successes": 100,
                    "treatment_successes": 120,
                }
            ],
        }
    )


def test_llm_planner_validates_json_and_keeps_deterministic_controls():
    planner = LLMPlanner(
        StaticLlm(
            '{"goal":"评估发布风险","required_inputs":[],"skills":["experiment_recap"],'
            '"tools":["analyze_metric"],"reasoning_constraints":["先核对口径"]}'
        )
    )

    plan = planner.create_plan("experiment_recap", _request())

    assert plan.source == "llm_validated"
    assert "quality_check" in plan.skills
    assert "check_quality" in plan.tools
    assert "先核对口径" in plan.reasoning_constraints


def test_invalid_llm_plan_falls_back_to_deterministic_plan():
    plan = LLMPlanner(StaticLlm("not json")).create_plan("experiment_recap", _request())

    assert plan.source == "deterministic"
    assert "quality_check" in plan.skills


def test_workflow_records_planner_tools_guardrails_and_report():
    report = ExperimentOrchestrator().run(_request())

    assert {trace.tool_name for trace in report.agent_trace} == {
        "check_quality",
        "analyze_metric",
        "make_recommendation",
    }
    stages = {event.stage for event in report.workflow_trace}
    assert {"planner", "input_validation", "result_validation", "guardrails", "report_generation"} <= stages
    assert report.selected_skills == ["quality_check", "experiment_recap", "release_recommendation"]


def test_live_provider_is_opt_in_and_fixture_free_call_is_blocked():
    config = DataSourceConfig(
        provider="libra",
        flight_id=1,
        metric_group_id=1,
        allow_live_provider=False,
    )

    try:
        LibraProvider()._load_report(config)
    except RuntimeError as exc:
        assert "默认关闭" in str(exc)
    else:
        raise AssertionError("live provider must be explicit opt-in")
