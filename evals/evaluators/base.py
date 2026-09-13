from __future__ import annotations

from typing import Protocol

from experimentos.models import AnalysisReport
from evals.types import EvaluatorResult


class Evaluator(Protocol):
    name: str

    def evaluate(self, case: dict, report: AnalysisReport) -> EvaluatorResult:
        ...
