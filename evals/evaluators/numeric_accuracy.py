from __future__ import annotations

from math import isclose

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


class NumericAccuracyEvaluator:
    name = "numeric_accuracy"

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        expected = case.get("expected", {}).get("numeric", [])
        actual = {metric.metric_name: metric for metric in report.metric_results}
        reasons: list[str] = []
        for item in expected:
            metric = actual.get(item["metric_name"])
            if metric is None:
                reasons.append(f"无法核验缺失指标：{item['metric_name']}")
                continue
            tolerance = float(item.get("tolerance", 1e-6))
            for field, expected_value in item.items():
                if field in {"metric_name", "tolerance"}:
                    continue
                actual_value = getattr(metric, field)
                if isinstance(expected_value, bool):
                    matches = actual_value is expected_value
                else:
                    matches = actual_value is not None and isclose(float(actual_value), float(expected_value), abs_tol=tolerance)
                if not matches:
                    reasons.append(f"{item['metric_name']} 的 {field}={actual_value!r}，期望 {expected_value!r}")
        return EvaluatorResult(self.name, not reasons, 1.0 if not reasons else 0.0, reasons)
