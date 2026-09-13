from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.models import ExperimentRequest
from evals.evaluators import (
    CompletenessEvaluator,
    ExpressionEvaluator,
    LogicEvaluator,
    MetricDefinitionEvaluator,
    NumericAccuracyEvaluator,
)
from evals.types import CaseResult, EvaluatorResult


EVALUATORS = {
    "metric_definition": MetricDefinitionEvaluator(),
    "numeric_accuracy": NumericAccuracyEvaluator(),
    "completeness": CompletenessEvaluator(),
    "logic": LogicEvaluator(),
    "expression": ExpressionEvaluator(),
}


class EvalRunner:
    """Runs fixture-only regression cases and emits machine and human reports."""

    def __init__(self, orchestrator: ExperimentOrchestrator | None = None) -> None:
        self._orchestrator = orchestrator or ExperimentOrchestrator()

    def run_cases(self, cases: Iterable[dict]) -> list[CaseResult]:
        results: list[CaseResult] = []
        for case in cases:
            report = self._orchestrator.run(ExperimentRequest.from_dict(case["input"]))
            checks = case.get("checks", list(EVALUATORS))
            evaluator_results: list[EvaluatorResult] = [
                EVALUATORS[name].evaluate(case, report)
                for name in checks
            ]
            results.append(CaseResult(case_id=case["id"], results=evaluator_results))
        return results

    def load_cases(self, cases_dir: Path) -> list[dict]:
        cases: list[dict] = []
        for path in sorted(cases_dir.glob("*.json")):
            payload = json.loads(path.read_text(encoding="utf-8"))
            cases.extend(payload if isinstance(payload, list) else [payload])
        return cases

    def write_reports(self, results: list[CaseResult], report_dir: Path) -> tuple[Path, Path]:
        report_dir.mkdir(parents=True, exist_ok=True)
        payload = self._summary(results)
        json_path = report_dir / "latest.json"
        markdown_path = report_dir / "latest.md"
        json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        markdown_path.write_text(self._markdown(payload), encoding="utf-8")
        return json_path, markdown_path

    def _summary(self, results: list[CaseResult]) -> dict:
        dimensions = {name: [] for name in EVALUATORS}
        for result in results:
            for item in result.results:
                dimensions[item.name].append(item.score)
        scores = {
            name: round(sum(values) / len(values), 4)
            for name, values in dimensions.items()
            if values
        }
        overall = round(sum(item.score for item in results) / len(results), 4) if results else 0.0
        return {
            "total_cases": len(results),
            "passed_cases": sum(item.passed for item in results),
            "overall_score": overall,
            "dimension_scores": scores,
            "cases": [item.to_dict() for item in results],
        }

    def _markdown(self, summary: dict) -> str:
        lines = ["# ExperimentOS Eval Report", "", f"- Total Cases: {summary['total_cases']}", f"- Passed Cases: {summary['passed_cases']}", f"- Overall Score: {summary['overall_score']:.0%}", "", "## Dimensions", ""]
        lines.extend(f"- {name}: {score:.0%}" for name, score in summary["dimension_scores"].items())
        lines.extend(["", "## Cases", ""])
        for case in summary["cases"]:
            lines.append(f"### {case['case_id']} — {'PASS' if case['passed'] else 'FAIL'} ({case['score']:.0%})")
            for result in case["results"]:
                suffix = "" if not result["reasons"] else f"：{'；'.join(result['reasons'])}"
                lines.append(f"- {result['name']}: {'PASS' if result['passed'] else 'FAIL'}{suffix}")
            lines.append("")
        return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run offline ExperimentOS evaluation cases.")
    parser.add_argument("--cases-dir", default="evals/cases")
    parser.add_argument("--report-dir", default="evals/reports")
    parser.add_argument("--no-write", action="store_true")
    args = parser.parse_args()

    runner = EvalRunner()
    results = runner.run_cases(runner.load_cases(Path(args.cases_dir)))
    summary = runner._summary(results)
    print(runner._markdown(summary))
    if not args.no_write:
        json_path, markdown_path = runner.write_reports(results, Path(args.report_dir))
        print(f"Reports written: {json_path}, {markdown_path}")


if __name__ == "__main__":
    main()
