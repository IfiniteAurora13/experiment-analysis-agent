from __future__ import annotations

from collections import Counter

from experimentos.analysis.result_validation import ResultValidator
from experimentos.models import ExperimentState, MetricResult, QualityIssue, Recommendation, ReviewGate, WorkflowTrace


class ReviewGateChecker:
    """Require completed checks; an empty issue list alone proves nothing."""

    def __init__(self, validator: ResultValidator | None = None) -> None:
        self.validator = validator or ResultValidator()

    def check(self, state: ExperimentState) -> ReviewGate:
        checks = {name: "UNKNOWN" for name in state.review_gate.checks}
        blockers: list[str] = []
        validation_warnings: list[str] = []

        quality_shape_valid = isinstance(state.quality_issues, list) and all(
            isinstance(issue, QualityIssue) and issue.severity in {"low", "medium", "high"}
            for issue in state.quality_issues
        )
        if not quality_shape_valid:
            state.quality_issues = []
            blockers.append("质量检查返回格式无效，检查状态未确认。")
        elif self._completed(state, "quality_check", "check_quality"):
            severe = [issue for issue in state.quality_issues if issue.severity == "high"]
            checks["quality_check"] = "FAIL" if severe else "PASS"
            blockers.extend(f"质量检查未通过：{issue.name}。{issue.impact}" for issue in severe)
        else:
            blockers.append("质量检查未完成，不能把没有质量问题记录当作检查通过。")

        metric_shape_valid = isinstance(state.metric_results, list) and all(
            isinstance(metric, MetricResult) for metric in state.metric_results
        )
        if not metric_shape_valid:
            state.metric_results = []
            checks["metric_analysis"] = "FAIL"
            blockers.append("指标工具返回格式无效，不能作为评审证据。")
        elif self._completed(state, "experiment_recap", "analyze_metric"):
            expected = Counter((m.name, m.kind, m.role, m.direction) for m in state.request.metrics)
            actual = Counter((m.name, m.kind, m.role, m.direction) for m in state.metric_results)
            complete = bool(expected) and expected == actual
            checks["metric_analysis"] = "PASS" if complete else "FAIL"
            if not complete:
                blockers.append("指标结果不完整或与输入不一致，必须覆盖全部主指标与护栏。")
        else:
            blockers.append("指标计算未完成，当前不能生成发布建议。")

        if checks["metric_analysis"] == "PASS":
            try:
                validation_warnings = self.validator.validate(state.metric_results)
                if not isinstance(validation_warnings, list) or not all(isinstance(item, str) for item in validation_warnings):
                    raise TypeError("结果校验返回格式无效")
                checks["result_validation"] = "FAIL" if validation_warnings else "PASS"
                blockers.extend(validation_warnings)
            except Exception as exc:
                validation_warnings = [f"结果校验未完成：{type(exc).__name__}。"]
                blockers.extend(validation_warnings)
        else:
            blockers.append("统计结果尚不完整，结果校验未确认。")

        state.warnings.extend(validation_warnings)
        state.workflow_trace.append(WorkflowTrace(
            stage="result_validation",
            status={"PASS": "ok", "FAIL": "warning", "UNKNOWN": "blocked"}[checks["result_validation"]],
            detail={"check_status": checks["result_validation"], "warning_count": len(validation_warnings)},
        ))
        ready = all(value == "PASS" for value in checks.values())
        next_action = "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
        if not ready:
            next_action = "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        state.review_gate = ReviewGate(
            status="READY" if ready else "BLOCKED",
            checks=checks,
            blockers=blockers,
            next_action=next_action,
        )
        return state.review_gate

    @staticmethod
    def _completed(state: ExperimentState, skill: str, tool: str) -> bool:
        return skill in state.completed_skills and any(
            trace.tool_name == tool and trace.status == "ok" for trace in state.tool_calls
        )


def block_review(state: ExperimentState, reason: str) -> None:
    state.review_gate.status = "BLOCKED"
    state.review_gate.blockers.append(reason)
    state.review_gate.next_action = "由实验分析负责人恢复建议生成流程，重跑必检并重新生成评审卡。"


def blocked_recommendations(gate: ReviewGate) -> list[Recommendation]:
    label = "暂停业务结论解读" if gate.checks["quality_check"] == "FAIL" else "暂缓发布结论"
    reason = "；".join(gate.blockers) or "必检证据尚未确认。"
    return [Recommendation(label=label, reason=f"{reason} 接管角色：{gate.owner}。下一步：{gate.next_action}")]
