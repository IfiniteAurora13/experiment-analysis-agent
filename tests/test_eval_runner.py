from __future__ import annotations

from pathlib import Path
import json
import subprocess
import sys

from evals.runner import EvalRunner


def test_eval_runner_executes_all_fixture_cases_and_writes_reports(tmp_path):
    runner = EvalRunner()
    cases = runner.load_cases(Path("evals/cases"))
    results = runner.run_cases(cases)
    json_path, markdown_path = runner.write_reports(results, tmp_path)

    assert len(results) == len(cases)
    assert all(result.passed for result in results)
    assert json_path.exists()
    assert markdown_path.exists()


def test_case_exception_is_recorded_and_does_not_skip_next_case():
    runner = EvalRunner()
    normal = next(case for case in runner.load_cases(Path("evals/cases")) if case["id"] == "E010")
    broken = {**normal, "id": "unknown_fault", "fault": "unregistered_fault"}

    results = runner.run_cases([broken, normal])

    assert not results[0].passed
    assert results[0].results[0].name == "execution"
    assert results[1].passed
    assert runner._summary(results)["dimension_case_counts"]["execution"] == 1


def test_eval_command_returns_nonzero_for_failed_case(tmp_path):
    runner = EvalRunner()
    normal = next(case for case in runner.load_cases(Path("evals/cases")) if case["id"] == "E010")
    normal["expected"]["review_gate"]["status"] = "BLOCKED"
    (tmp_path / "failure.json").write_text(json.dumps(normal), encoding="utf-8")

    result = subprocess.run(
        [sys.executable, "-m", "evals.runner", "--cases-dir", str(tmp_path), "--no-write"],
        capture_output=True, text=True,
    )

    assert result.returncode == 1
    assert "FAIL" in result.stdout
