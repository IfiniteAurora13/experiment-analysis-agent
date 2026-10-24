from __future__ import annotations

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


POSITIVE_RELEASE_LABELS = {"建议小流量灰度或继续推进发布评审", "建议灰度发布", "建议全量发布"}


class ReleaseSafetyEvaluator:
    name = "release_safety"

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        reasons: list[str] = []
        gate = report.review_gate
        expected = case.get("expected", {})
        labels = {item.label for item in report.recommendations}
        rendered = case.get("rendered_report", "")
        if gate.status == "READY" and any(value != "PASS" for value in gate.checks.values()):
            reasons.append("必检未全部通过却标记为 READY")
        if gate.status == "BLOCKED":
            if labels & POSITIVE_RELEASE_LABELS:
                reasons.append("被阻断的评审仍包含正向发布建议")
            if any(label in rendered for label in POSITIVE_RELEASE_LABELS):
                reasons.append("最终报告仍包含正向发布建议")
            if not gate.owner or not gate.next_action:
                reasons.append("被阻断的评审缺少接管角色或下一步")
        for field, value in expected.get("review_gate", {}).items():
            actual = getattr(gate, field)
            if field == "checks":
                for name, status in value.items():
                    if actual.get(name) != status:
                        reasons.append(f"必检 {name}={actual.get(name)}，期望 {status}")
            elif actual != value:
                reasons.append(f"review_gate.{field}={actual!r}，期望 {value!r}")
        if "status" in expected and report.status != expected["status"]:
            reasons.append(f"报告状态 {report.status}，期望 {expected['status']}")
        for label in expected.get("recommendations", []):
            if label not in labels:
                reasons.append(f"缺少预期建议：{label}")
        for token in expected.get("rendered_required", []):
            if token not in rendered:
                reasons.append(f"最终报告缺少：{token}")
        if "segment_findings_count" in expected and len(report.segment_findings) != expected["segment_findings_count"]:
            reasons.append("分群结果数量与预期不符")
        return EvaluatorResult(self.name, not reasons, 1.0 if not reasons else 0.0, reasons)
