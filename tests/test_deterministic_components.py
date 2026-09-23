"""确定性组件单测：意图路由、结果校验、护栏、工具注册表。"""

from __future__ import annotations

import pytest

from experimentos.agent.guardrails import GuardrailEngine
from experimentos.agent.intent_router import IntentRouter, LLMIntentRouter
from experimentos.analysis.decomposition import explain_metric_tree
from experimentos.analysis.result_validation import ResultValidator
from experimentos.models import (
    ExperimentRequest,
    ExperimentState,
    Finding,
    MetricResult,
    QualityIssue,
)
from experimentos.tools.registry import ToolBudgetExhausted, ToolRegistry


# ---------------------------------------------------------------------------
# IntentRouter
# ---------------------------------------------------------------------------


def _router_request(question: str, task_type: str | None = None) -> ExperimentRequest:
    return ExperimentRequest(question=question, task_type=task_type)


def test_router_explicit_task_type_wins():
    assert IntentRouter().resolve(_router_request("随便问", "quality_check")) == "quality_check"


def test_router_keyword_cases():
    router = IntentRouter()
    assert router.resolve(_router_request("新老用户分群表现差异")) == "segment_diagnosis"
    assert router.resolve(_router_request("检查一下 SRM 有没有问题")) == "quality_check"
    assert router.resolve(_router_request("这个实验能否上线")) == "release_recommendation"
    assert router.resolve(_router_request("为什么转化率提升了，帮我拆解")) == "driver_analysis"
    assert router.resolve(_router_request("帮我复盘这个实验")) == "experiment_recap"


class _StaticLlm:
    def __init__(self, response: str) -> None:
        self.response = response

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        return self.response


class _RaisingLlm:
    def complete(self, system_prompt: str, user_prompt: str) -> str:
        raise RuntimeError("llm down")


def test_llm_router_accepts_valid_and_rejects_invalid_types():
    assert LLMIntentRouter(_StaticLlm("release_recommendation")).resolve(_router_request("能上线吗")) == "release_recommendation"
    assert LLMIntentRouter(_StaticLlm("完全无关的回答")).resolve(_router_request("能上线吗")) == "release_recommendation"
    assert LLMIntentRouter(_StaticLlm("不相关的词")).resolve(_router_request("看看分群差异")) == "segment_diagnosis"


def test_llm_router_falls_back_to_keywords_on_failure():
    assert LLMIntentRouter(_RaisingLlm()).resolve(_router_request("能上线吗")) == "release_recommendation"


# ---------------------------------------------------------------------------
# ResultValidator
# ---------------------------------------------------------------------------


def _result(**overrides) -> MetricResult:
    base = dict(
        metric_name="CVR",
        metric_kind="conversion",
        metric_role="core",
        direction="increase",
        control_n=1000,
        treatment_n=1000,
        control_value=0.10,
        treatment_value=0.12,
        delta_abs=0.02,
        delta_rel=0.2,
        p_value=0.03,
        ci_low=0.005,
        ci_high=0.035,
        significant=True,
        statistical_method="two_proportion_z_test_pooled",
        interpretation="实验组相对对照组显著提升。",
    )
    base.update(overrides)
    return MetricResult(**base)


def test_validator_accepts_consistent_result():
    assert ResultValidator().validate([_result()]) == []


def test_validator_flags_invalid_sample_size():
    warnings = ResultValidator().validate([_result(control_n=0)])
    assert any("缺少有效样本量" in item for item in warnings)


def test_validator_flags_p_value_out_of_range():
    warnings = ResultValidator().validate([_result(p_value=1.5)])
    assert any("超出 [0, 1]" in item for item in warnings)


def test_validator_flags_inverted_confidence_interval():
    warnings = ResultValidator().validate([_result(ci_low=0.05, ci_high=0.01)])
    assert any("上下界顺序异常" in item for item in warnings)


def test_validator_flags_significance_ci_inconsistency():
    warnings = ResultValidator().validate(
        [_result(significant=False, p_value=0.03, ci_low=0.005, ci_high=0.035)]
    )
    assert any("显著性与置信区间不一致" in item for item in warnings)


def test_validator_flags_missing_statistical_method():
    warnings = ResultValidator().validate([_result(statistical_method="")])
    assert any("未标注统计方法" in item for item in warnings)


# ---------------------------------------------------------------------------
# GuardrailEngine
# ---------------------------------------------------------------------------


def test_split_findings_classifies_facts_inferences_and_hypotheses():
    engine = GuardrailEngine()
    metric = _result()
    issue = QualityIssue(name="SRM 风险", severity="medium", impact="分流异常", recommendation="排查")
    segment = Finding(label="CVR 分群发现", evidence="原始检验显著（p=0.0200）但 BH-FDR 校正后不显著", strength="待验证假设")
    facts, inferences, hypotheses = engine.split_findings([metric], [issue], [segment])

    assert [item.label for item in facts] == ["CVR 指标结果"]
    assert all(item.strength == "事实" for item in facts)
    assert any(item.label == "CVR 方向判断" for item in inferences)
    assert any(item.label == "质量风险：SRM 风险" for item in inferences)
    assert all(item.strength == "合理推断" for item in inferences)
    assert len(hypotheses) == 1
    assert hypotheses[0].strength == "待验证假设"
    assert "需独立验证" in hypotheses[0].evidence


def test_split_findings_fact_without_p_value_omits_p():
    facts, _, _ = GuardrailEngine().split_findings([_result(p_value=None, ci_low=None, ci_high=None, significant=False)], [], [])
    assert "p=" not in facts[0].evidence


def test_split_findings_appends_source_suffix():
    facts, _, _ = GuardrailEngine().split_findings([_result(source_summary="libra_report_10001")], [], [])
    assert "统计来源=libra_report_10001" in facts[0].evidence


def test_recommend_severe_issue_takes_precedence_over_empty_results():
    recommendations = GuardrailEngine().recommend(
        [], [QualityIssue(name="SRM 风险", severity="high", impact="x", recommendation="y")]
    )
    assert [item.label for item in recommendations] == ["暂停业务结论解读"]


def test_recommend_empty_results_deferred():
    recommendations = GuardrailEngine().recommend([], [])
    assert [item.label for item in recommendations] == ["暂缓发布结论"]


def test_recommend_harmful_guardrail_blocks_release():
    guardrail = _result(metric_name="GMV", metric_role="guardrail", direction="increase", delta_abs=-0.1)
    recommendations = GuardrailEngine().recommend([guardrail], [])
    labels = [item.label for item in recommendations]
    assert labels[0] == "不建议发布"
    assert "补充分群复核" in labels


def test_recommend_positive_core_suggests_gradual_rollout():
    recommendations = GuardrailEngine().recommend([_result()], [])
    labels = [item.label for item in recommendations]
    assert labels[0] == "建议小流量灰度或继续推进发布评审"
    assert "补充分群复核" in labels


def test_recommend_weak_core_defers_release():
    weak = _result(significant=False, p_value=0.4, ci_low=-0.02, ci_high=0.06)
    recommendations = GuardrailEngine().recommend([weak], [])
    labels = [item.label for item in recommendations]
    assert labels[0] == "暂不建议直接发布"
    assert "补充分群复核" in labels


# ---------------------------------------------------------------------------
# ToolRegistry
# ---------------------------------------------------------------------------


def test_tool_registry_invokes_and_records_trace():
    registry = ToolRegistry()
    registry.register(_metadata("echo"), lambda **kwargs: kwargs)
    state = ExperimentState(request=ExperimentRequest(question="q"))
    state.max_tool_calls = 5
    result = registry.invoke("echo", state, value=42)
    assert result == {"value": 42}
    assert len(state.tool_calls) == 1
    assert state.tool_calls[0].status == "ok"
    assert state.tool_calls[0].tool_name == "echo"


def test_tool_registry_unknown_tool_raises():
    with pytest.raises(KeyError):
        ToolRegistry().invoke("nope", ExperimentState(request=ExperimentRequest(question="q")))


def test_tool_registry_duplicate_registration_raises():
    registry = ToolRegistry()
    registry.register(_metadata("echo"), lambda: None)
    with pytest.raises(ValueError):
        registry.register(_metadata("echo"), lambda: None)


def test_tool_budget_exhausted_raises_before_execution():
    registry = ToolRegistry()
    registry.register(_metadata("echo"), lambda: None)
    state = ExperimentState(request=ExperimentRequest(question="q"))
    state.max_tool_calls = 0
    with pytest.raises(ToolBudgetExhausted):
        registry.invoke("echo", state)
    assert state.tool_calls == []


def test_tool_error_is_recorded_then_reraised():
    registry = ToolRegistry()
    registry.register(_metadata("boom"), _boom)
    state = ExperimentState(request=ExperimentRequest(question="q"))
    state.max_tool_calls = 5
    with pytest.raises(ValueError):
        registry.invoke("boom", state)
    assert state.tool_calls[0].status == "error"
    assert state.tool_calls[0].error == "ValueError"


def _boom():
    raise ValueError("boom")


def _metadata(name: str):
    from experimentos.tools.registry import ToolMetadata
    return ToolMetadata(name=name, description="test", input_schema={}, output_schema={})


# ---------------------------------------------------------------------------
# explain_metric_tree
# ---------------------------------------------------------------------------


def test_explain_metric_tree_returns_formulas():
    formulas = explain_metric_tree()
    assert len(formulas) == 3
    assert all(isinstance(item, str) and item for item in formulas)
    assert "GMV" in formulas[0]
