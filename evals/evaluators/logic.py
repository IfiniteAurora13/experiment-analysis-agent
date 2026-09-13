from __future__ import annotations

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


class LogicEvaluator:
    name = "logic"

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        expected = case.get("expected", {})
        reasons: list[str] = []
        quality_names = {issue.name for issue in report.quality_issues}
        for name in expected.get("quality_issues", []):
            if name not in quality_names:
                reasons.append(f"未识别质量问题：{name}")
        recommendation_labels = {item.label for item in report.recommendations}
        for label in expected.get("recommendations", []):
            if label not in recommendation_labels:
                reasons.append(f"未给出预期建议：{label}")
        if any(issue.severity == "high" for issue in report.quality_issues):
            if "暂停业务结论解读" not in recommendation_labels:
                reasons.append("高严重度质量问题未阻断业务结论")
        return EvaluatorResult(self.name, not reasons, 1.0 if not reasons else 0.0, reasons)
