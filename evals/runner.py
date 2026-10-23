from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Callable, Iterable

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
from evals.faults import injected_fault
from evals.evaluators.release_safety import ReleaseSafetyEvaluator


EVALUATORS = {
    "metric_definition": MetricDefinitionEvaluator(),
    "numeric_accuracy": NumericAccuracyEvaluator(),
    "completeness": CompletenessEvaluator(),
    "logic": LogicEvaluator(),
    "expression": ExpressionEvaluator(),
    "release_safety": ReleaseSafetyEvaluator(),
}


class EvalRunner:
    """Runs fixture-only regression cases and emits machine and human reports."""

    def __init__(
        self,
        orchestrator: ExperimentOrchestrator | None = None,
        orchestrator_factory: Callable[[], ExperimentOrchestrator] | None = None,
    ) -> None:
        self._orchestrator = orchestrator
        self._factory = orchestrator_factory or ExperimentOrchestrator
        self._mode = "custom_orchestrator" if orchestrator is not None or orchestrator_factory is not None else "offline_rule_based"

    def run_cases(self, cases: Iterable[dict]) -> list[CaseResult]:
        results: list[CaseResult] = []
        for case in cases:
            try:
                if self._orchestrator is not None and case.get("fault"):
                    raise ValueError("故障注入需要新实例，请使用 orchestrator_factory。")
                with injected_fault(case.get("fault")):
                    orchestrator = self._orchestrator or self._factory()
                    report = orchestrator.run(ExperimentRequest.from_dict(case["input"]))
                    evaluated_case = {**case, "rendered_report": orchestrator.render_markdown(report)}
                # Safety invariants are mandatory even when a case selects other checks.
                checks = list(dict.fromkeys([*case.get("checks", list(EVALUATORS)), "release_safety"]))
                evaluator_results = [EVALUATORS[name].evaluate(evaluated_case, report) for name in checks]
            except Exception as exc:
                evaluator_results = [EvaluatorResult("execution", False, 0.0, [f"{type(exc).__name__}: {exc}"])]
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
                dimensions.setdefault(item.name, []).append(item.score)
        scores = {
            name: round(sum(values) / len(values), 4)
            for name, values in dimensions.items()
            if values
        }
        overall = round(sum(item.score for item in results) / len(results), 4) if results else 0.0
        return {
            "evaluation_mode": self._mode,
            "dataset_split": "regression_only_no_holdout",
            "total_cases": len(results),
            "passed_cases": sum(item.passed for item in results),
            "overall_score": overall,
            "dimension_scores": scores,
            "dimension_case_counts": {name: len(values) for name, values in dimensions.items() if values},
            "cases": [item.to_dict() for item in results],
        }

    def _markdown(self, summary: dict) -> str:
        lines = ["# ExperimentOS Eval Report", "", f"- Mode: {summary['evaluation_mode']}", f"- Dataset: {summary['dataset_split']}", f"- Total Cases: {summary['total_cases']}", f"- Passed Cases: {summary['passed_cases']}", f"- Mean dimension score (descriptive only): {summary['overall_score']:.0%}", "", "默认模式不调用真实模型；本报告不是冻结验收集或线上可靠性证明。", "", "## Dimensions", ""]
        lines.extend(f"- {name}: {score:.0%} ({summary['dimension_case_counts'][name]} cases)" for name, score in summary["dimension_scores"].items())
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
    if not results or any(not result.passed for result in results):
        sys.exit(1)


if __name__ == "__main__":
    main()
