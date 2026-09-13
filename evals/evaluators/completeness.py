from __future__ import annotations

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


class CompletenessEvaluator:
    name = "completeness"

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        reasons: list[str] = []
        for metric in report.metric_results:
            if metric.control_n <= 0 or metric.treatment_n <= 0:
                reasons.append(f"{metric.metric_name} 缺少样本量")
            if metric.p_value is None:
                reasons.append(f"{metric.metric_name} 缺少 p-value")
            if not metric.statistical_method:
                reasons.append(f"{metric.metric_name} 缺少 statistical_method")
        if report.metric_results and not report.recommendations:
            reasons.append("缺少建议")
        if case.get("expected", {}).get("require_quality_check") and not report.workflow_trace:
            reasons.append("缺少 workflow trace")
        return EvaluatorResult(self.name, not reasons, 1.0 if not reasons else 0.0, reasons)
