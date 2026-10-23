"""Replay BC005 without network access or live business data."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from unittest.mock import patch

from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.analysis.quality_checks import QualityChecker
from experimentos.models import ExperimentRequest


def main() -> None:
    parser = argparse.ArgumentParser(description="离线复现质量检查失败后的评审行为。")
    parser.add_argument("--input", default="examples/product_detail_release.json")
    parser.add_argument("--output", help="可选 JSON 证据文件")
    parser.add_argument("--markdown-output", help="可选最终报告文件")
    parser.add_argument("--version-label", default="working-tree")
    args = parser.parse_args()
    payload = json.loads(Path(args.input).read_text(encoding="utf-8"))
    # Keep the core uplift while removing actual guardrail degradation, so the
    # sole blocker is the unavailable mandatory quality check.
    payload["metrics"][1]["treatment_value"] = payload["metrics"][1]["control_value"]
    with patch.object(QualityChecker, "run", side_effect=RuntimeError("offline quality check unavailable")):
        orchestrator = ExperimentOrchestrator()
        report = orchestrator.run(ExperimentRequest.from_dict(payload))
        rendered = orchestrator.render_markdown(report)
    evidence = {
        "case_id": "BC005",
        "origin": "synthetic_fault_injection",
        "version_label": args.version_label,
        "input": payload,
        "fault": "QualityChecker.run raises RuntimeError",
        "report": report.to_dict(),
        "rendered_report": rendered,
    }
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.markdown_output:
        Path(args.markdown_output).write_text(rendered + "\n", encoding="utf-8")
    print(rendered)


if __name__ == "__main__":
    main()
