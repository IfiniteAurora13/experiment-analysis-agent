from __future__ import annotations

from experimentos.models import Finding, MetricResult, QualityIssue, Recommendation


class GuardrailEngine:
    """Keep conclusions conservative and auditable."""

    def split_findings(
        self,
        metric_results: list[MetricResult],
        quality_issues: list[QualityIssue],
        segment_findings: list[Finding],
    ) -> tuple[list[Finding], list[Finding], list[Finding]]:
        facts: list[Finding] = []
        inferences: list[Finding] = []
        hypotheses: list[Finding] = []

        for metric in metric_results:
            source_suffix = f"；统计来源={metric.source_summary}" if metric.source_summary else ""
            facts.append(
                Finding(
                    label=f"{metric.name} 指标结果",
                    evidence=(
                        f"{metric.name} 对照 {metric.control_value:.4f}，实验 {metric.treatment_value:.4f}，"
                        f"绝对变化 {metric.delta_abs:.4f}，p={metric.p_value:.4f}"
                        if metric.p_value is not None
                        else f"{metric.name} 对照 {metric.control_value:.4f}，实验 {metric.treatment_value:.4f}"
                    ),
                    strength="事实",
                )
            )
            if source_suffix:
                facts[-1].evidence += source_suffix
            if metric.significant:
                inferences.append(
                    Finding(
                        label=f"{metric.name} 方向判断",
                        evidence=metric.interpretation,
                        strength="合理推断",
                    )
                )

        for issue in quality_issues:
            inferences.append(
                Finding(
                    label=f"质量风险：{issue.name}",
                    evidence=issue.impact,
                    strength="合理推断",
                )
            )

        for finding in segment_findings:
            hypotheses.append(
                Finding(
                    label=finding.label,
                    evidence=f"{finding.evidence.rstrip('。')}。该发现来自分群扫描，需独立验证。",
                    strength="待验证假设",
                )
            )

        return facts, inferences, hypotheses

    def recommend(
        self,
        metric_results: list[MetricResult],
        quality_issues: list[QualityIssue],
    ) -> list[Recommendation]:
        recommendations: list[Recommendation] = []
        severe_issues = [issue for issue in quality_issues if issue.severity == "high"]
        core_metrics = [metric for metric in metric_results if metric.role == "core"]
        guardrails = [metric for metric in metric_results if metric.role == "guardrail"]

        if severe_issues:
            recommendations.append(
                Recommendation(
                    label="暂停业务结论解读",
                    reason="存在高严重度实验质量问题，当前结果可信度不足。",
                )
            )
            return recommendations

        # Order matters: the severe-issues check above must stay first so a
        # high-severity quality issue still yields "暂停业务结论解读" even
        # when no metric results exist. StatsEngine is all-or-nothing per
        # call, so an empty list here means the analysis never completed.
        if not metric_results:
            return [
                Recommendation(
                    label="暂缓发布结论",
                    reason="指标分析未完成，无法形成可靠的发布结论，请先修复指标输入或补充实验数据。",
                )
            ]

        harmful_guardrail = [
            metric for metric in guardrails
            if metric.significant and (
                (metric.direction == "increase" and metric.delta_abs < 0) or
                (metric.direction == "decrease" and metric.delta_abs > 0)
            )
        ]
        positive_core = [
            metric for metric in core_metrics
            if metric.significant and (
                (metric.direction == "increase" and metric.delta_abs > 0) or
                (metric.direction == "decrease" and metric.delta_abs < 0)
            )
        ]

        if harmful_guardrail:
            recommendations.append(
                Recommendation(
                    label="不建议发布",
                    reason="至少一个护栏指标出现显著恶化。",
                )
            )
        elif positive_core:
            recommendations.append(
                Recommendation(
                    label="建议小流量灰度或继续推进发布评审",
                    reason="核心指标显著向好，且未见明显护栏风险。",
                )
            )
        else:
            recommendations.append(
                Recommendation(
                    label="暂不建议直接发布",
                    reason="核心指标尚未形成足够强的正向证据。",
                )
            )

        recommendations.append(
            Recommendation(
                label="补充分群复核",
                reason="在总体结论之外，对重点人群做二次验证，避免探索性发现被误当作确定结论。",
            )
        )
        return recommendations
