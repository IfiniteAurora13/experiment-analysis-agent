from __future__ import annotations

import json

from experimentos.models import (
    AnalysisReport,
    Finding,
    MetricResult,
    QualityIssue,
    Recommendation,
    RegistryEntry,
)


class ReportRenderer:
    """Template-based report renderer (rule engine, no LLM)."""

    def render_markdown(self, report: AnalysisReport) -> str:
        lines: list[str] = []
        lines.append(f"# {report.summary}")
        lines.append("")
        lines.append(f"- 状态：{report.status}")
        lines.append(f"- 任务类型：{report.task_type}")

        if report.warnings:
            lines.append("")
            lines.append("## 警告")
            lines.append("")
            for item in report.warnings:
                lines.append(f"- {item}")

        if report.report_scope:
            lines.append("")
            lines.append("## Report 作用范围")
            lines.append("")
            for key, value in report.report_scope.items():
                lines.append(f"- {key}: {value}")

        if report.missing_inputs:
            lines.append("")
            lines.append("## 当前缺失的最小信息")
            lines.append("")
            for item in report.missing_inputs:
                lines.append(f"- {item}")
            self._append_registry_block(lines, report.registry_entries)
            return "\n".join(lines)

        self._append_registry_block(lines, report.registry_entries)
        self._append_finding_block(lines, "事实", report.facts)
        self._append_quality_block(lines, report.quality_issues)
        self._append_metric_block(lines, report.metric_results)
        self._append_finding_block(lines, "合理推断", report.inferences)
        self._append_finding_block(lines, "待验证假设", report.hypotheses)
        self._append_recommendation_block(lines, report.recommendations)
        return "\n".join(lines)

    def _append_finding_block(self, lines: list[str], title: str, findings: list[Finding]) -> None:
        if not findings:
            return
        lines.append("")
        lines.append(f"## {title}")
        lines.append("")
        for item in findings:
            lines.append(f"- {item.label}：{item.evidence}")

    def _append_quality_block(self, lines: list[str], issues: list[QualityIssue]) -> None:
        if not issues:
            return
        lines.append("")
        lines.append("## 实验质量")
        lines.append("")
        for item in issues:
            lines.append(
                f"- {item.name}（{item.severity}）：{item.impact}。建议：{item.recommendation}"
            )

    def _append_metric_block(self, lines: list[str], metrics: list[MetricResult]) -> None:
        if not metrics:
            return
        lines.append("")
        lines.append("## 核心证据")
        lines.append("")
        for item in metrics:
            delta_rel = f"{item.delta_rel * 100:.2f}%" if item.delta_rel is not None else "NA"
            ci = (
                f"[{item.ci_low:.4f}, {item.ci_high:.4f}]"
                if item.ci_low is not None and item.ci_high is not None
                else "NA"
            )
            p_value = f"{item.p_value:.4f}" if item.p_value is not None else "NA"
            source = item.source_summary or item.statistical_source
            lines.append(
                f"- {item.name}：对照={item.control_value:.4f}（n={item.control_n}），实验={item.treatment_value:.4f}（n={item.treatment_n}），"
                f"绝对变化={item.delta_abs:.4f}，相对变化={delta_rel}，CI={ci}，p={p_value}，"
                f"统计方法={item.statistical_method}，统计来源={source}，结论={item.interpretation}"
            )

    def _append_recommendation_block(self, lines: list[str], items: list[Recommendation]) -> None:
        if not items:
            return
        lines.append("")
        lines.append("## 建议")
        lines.append("")
        for item in items:
            lines.append(f"- {item.label}：{item.reason}")

    def _append_registry_block(self, lines: list[str], items: list[RegistryEntry]) -> None:
        if not items:
            return
        lines.append("")
        lines.append("## 指标注册表")
        lines.append("")
        for item in items:
            owners = ", ".join(item.owners) if item.owners else "NA"
            source_tables = ", ".join(item.source_tables) if item.source_tables else "NA"
            warnings = f"；warning={'; '.join(item.warnings)}" if item.warnings else ""
            lines.append(
                f"- {item.name}：group={item.source_group_name or 'NA'}，metric={item.source_metric_name or 'NA'}，"
                f"gallery_id={item.gallery_id or 'NA'}，libra_group_id={item.libra_group_id or 'NA'}，"
                f"owners={owners}，source_tables={source_tables}，evidence={item.evidence_status or 'NA'}{warnings}"
            )


class LLMNarrator(ReportRenderer):
    """LLM-powered narrator that wraps structured data into natural language.

    Falls back to template rendering when the LLM is unavailable.
    Statistical facts are always preserved verbatim from the code.
    """

    def __init__(self, llm_client, prompt_path: str | None = None) -> None:
        super().__init__()
        self._llm = llm_client
        self._prompt_path = prompt_path
        self._narrate_prompt: str | None = None
        self._system_prompt: str | None = None

    def render_markdown(self, report: AnalysisReport) -> str:
        try:
            return self._llm_narrate(report)
        except Exception:
            return super().render_markdown(report)

    def _llm_narrate(self, report: AnalysisReport) -> str:
        system_prompt = self._load_system_prompt()
        user_prompt = self._load_narrate_prompt() + "\n\n" + self._build_context(report)
        return self._llm.complete(system_prompt, user_prompt)

    def _build_context(self, report: AnalysisReport) -> str:
        """Build a structured JSON context for the LLM to narrate."""
        ctx: dict = {
            "status": report.status,
            "task_type": report.task_type,
            "summary": report.summary,
            "report_scope": report.report_scope,
            "warnings": report.warnings,
            "missing_inputs": report.missing_inputs,
            "quality_issues": [
                {"name": i.name, "severity": i.severity, "impact": i.impact, "recommendation": i.recommendation}
                for i in report.quality_issues
            ],
            "metric_results": [
                {
                    "metric_name": m.metric_name,
                    "metric_kind": m.metric_kind,
                    "metric_role": m.metric_role,
                    "control_n": m.control_n,
                    "treatment_n": m.treatment_n,
                    "control_value": m.control_value,
                    "treatment_value": m.treatment_value,
                    "delta_abs": m.delta_abs,
                    "delta_rel": m.delta_rel,
                    "p_value": m.p_value,
                    "ci_low": m.ci_low,
                    "ci_high": m.ci_high,
                    "significant": m.significant,
                    "statistical_method": m.statistical_method,
                    "interpretation": m.interpretation,
                    "statistical_source": m.statistical_source,
                }
                for m in report.metric_results
            ],
            "facts": [{"label": f.label, "evidence": f.evidence} for f in report.facts],
            "inferences": [{"label": f.label, "evidence": f.evidence} for f in report.inferences],
            "hypotheses": [{"label": f.label, "evidence": f.evidence} for f in report.hypotheses],
            "recommendations": [{"label": r.label, "reason": r.reason} for r in report.recommendations],
            "registry_entries": [
                {
                    "name": e.name,
                    "source_group_name": e.source_group_name,
                    "source_metric_name": e.source_metric_name,
                    "libra_group_id": e.libra_group_id,
                    "owners": e.owners,
                    "evidence_status": e.evidence_status,
                    "warnings": e.warnings,
                }
                for e in report.registry_entries
            ],
        }
        return json.dumps(ctx, ensure_ascii=False, indent=2)

    def _load_narrate_prompt(self) -> str:
        if self._narrate_prompt is not None:
            return self._narrate_prompt
        path = self._prompt_path
        if path is None:
            from pathlib import Path
            path = str(Path(__file__).resolve().parent.parent / "prompts" / "narrate.md")
        self._narrate_prompt = open(path, encoding="utf-8").read()
        return self._narrate_prompt

    def _load_system_prompt(self) -> str:
        if self._system_prompt is not None:
            return self._system_prompt
        from pathlib import Path
        system_path = str(Path(__file__).resolve().parent.parent / "prompts" / "system.md")
        self._system_prompt = open(system_path, encoding="utf-8").read()
        return self._system_prompt
