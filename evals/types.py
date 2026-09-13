from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class EvaluatorResult:
    name: str
    passed: bool
    score: float
    reasons: list[str] = field(default_factory=list)


@dataclass
class CaseResult:
    case_id: str
    results: list[EvaluatorResult]

    @property
    def score(self) -> float:
        return sum(item.score for item in self.results) / len(self.results) if self.results else 0.0

    @property
    def passed(self) -> bool:
        return all(item.passed for item in self.results)

    def to_dict(self) -> dict[str, Any]:
        return {
            "case_id": self.case_id,
            "passed": self.passed,
            "score": self.score,
            "results": [
                {"name": item.name, "passed": item.passed, "score": item.score, "reasons": item.reasons}
                for item in self.results
            ],
        }
