from __future__ import annotations

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


class MetricDefinitionEvaluator:
    name = "metric_definition"

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        expected = case.get("expected", {}).get("metrics", [])
        actual = {metric.metric_name: metric for metric in report.metric_results}
        reasons: list[str] = []
        for item in expected:
            metric = actual.get(item["metric_name"])
            if metric is None:
                reasons.append(f"缺少指标：{item['metric_name']}")
                continue
            for field in ("metric_kind", "metric_role", "direction"):
                if field in item and getattr(metric, field) != item[field]:
                    reasons.append(f"{item['metric_name']} 的 {field} 不匹配")
        return EvaluatorResult(self.name, not reasons, 1.0 if not reasons else 0.0, reasons)
