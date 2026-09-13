from __future__ import annotations

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


class ExpressionEvaluator:
    name = "expression"
    _FORBIDDEN = ("已经证明", "一定有效", "确定因果", "因果有效")

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        reasons: list[str] = []
        text = "\n".join(
            item.evidence
            for group in (report.facts, report.inferences, report.hypotheses)
            for item in group
        )
        for token in self._FORBIDDEN:
            if token in text:
                reasons.append(f"出现过度确定性表达：{token}")
        if report.segment_findings:
            hypothesis_labels = {item.label for item in report.hypotheses if item.strength == "待验证假设"}
            for finding in report.segment_findings:
                if finding.label not in hypothesis_labels:
                    reasons.append("分群结果未被降级为待验证假设")
        return EvaluatorResult(self.name, not reasons, 1.0 if not reasons else 0.0, reasons)
