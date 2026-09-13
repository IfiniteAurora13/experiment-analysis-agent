from __future__ import annotations

from pathlib import Path

from evals.runner import EvalRunner


def test_eval_runner_executes_all_fixture_cases_and_writes_reports(tmp_path):
    runner = EvalRunner()
    cases = runner.load_cases(Path("evals/cases"))
    results = runner.run_cases(cases)
    json_path, markdown_path = runner.write_reports(results, tmp_path)

    assert len(results) == 3
    assert all(result.passed for result in results)
    assert json_path.exists()
    assert markdown_path.exists()
