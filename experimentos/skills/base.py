from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.tools.registry import ToolRegistry


@dataclass(frozen=True)
class SkillMetadata:
    name: str
    description: str
    task_types: frozenset[str]
    required_tools: tuple[str, ...]


@dataclass
class SkillResult:
    name: str
    warnings: list[str] = field(default_factory=list)


class Skill(Protocol):
    """An analysis capability that composes registered deterministic tools."""

    metadata: SkillMetadata

    def can_handle(self, request: ExperimentRequest, state: ExperimentState) -> bool:
        ...

    def run(
        self,
        request: ExperimentRequest,
        state: ExperimentState,
        tools: ToolRegistry,
    ) -> SkillResult:
        ...
