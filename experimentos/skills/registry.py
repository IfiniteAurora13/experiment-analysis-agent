from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.skills.base import Skill
from experimentos.skills.driver_analysis import DriverAnalysisSkill
from experimentos.skills.experiment_recap import ExperimentRecapSkill
from experimentos.skills.quality_check import QualityCheckSkill
from experimentos.skills.release_recommendation import ReleaseRecommendationSkill
from experimentos.skills.segment_diagnosis import SegmentDiagnosisSkill

# Single source of truth for the task → skill route: each skill's
# metadata.task_types. The class tuple doubles as the canonical execution
# order (quality first, release recommendation last).
_DEFAULT_SKILL_CLASSES = (
    QualityCheckSkill,
    ExperimentRecapSkill,
    SegmentDiagnosisSkill,
    DriverAnalysisSkill,
    ReleaseRecommendationSkill,
)

_TASK_TYPES = sorted({
    task_type
    for cls in _DEFAULT_SKILL_CLASSES
    for task_type in cls.metadata.task_types
})

DEFAULT_SKILLS_BY_TASK: dict[str, tuple[str, ...]] = {
    task_type: tuple(
        cls.metadata.name
        for cls in _DEFAULT_SKILL_CLASSES
        if task_type in cls.metadata.task_types
    )
    for task_type in _TASK_TYPES
}

# Task → tool route derives from the selected skills' required_tools, so the
# two route maps can never drift apart.
_REQUIRED_TOOLS_BY_SKILL = {
    cls.metadata.name: cls.metadata.required_tools for cls in _DEFAULT_SKILL_CLASSES
}

DEFAULT_TOOLS_BY_TASK: dict[str, tuple[str, ...]] = {
    task_type: tuple(dict.fromkeys(
        tool
        for name in DEFAULT_SKILLS_BY_TASK[task_type]
        for tool in _REQUIRED_TOOLS_BY_SKILL[name]
    ))
    for task_type in _TASK_TYPES
}


class SkillRegistry:
    """Selects task-appropriate skills without coupling the orchestrator to them."""

    def __init__(self) -> None:
        self._skills: dict[str, Skill] = {}

    def register(self, skill: Skill) -> None:
        if skill.metadata.name in self._skills:
            raise ValueError(f"重复注册 skill: {skill.metadata.name}")
        self._skills[skill.metadata.name] = skill

    def names(self) -> list[str]:
        return list(self._skills)

    def get(self, name: str) -> Skill:
        return self._skills[name]

    def select(
        self,
        request: ExperimentRequest,
        state: ExperimentState,
        requested_names: list[str] | None = None,
    ) -> list[Skill]:
        baseline = DEFAULT_SKILLS_BY_TASK.get(state.task_type, DEFAULT_SKILLS_BY_TASK["experiment_recap"])
        requested = requested_names or []
        ordered_names = list(dict.fromkeys([*baseline, *requested]))
        selected: list[Skill] = []
        for name in ordered_names:
            skill = self._skills.get(name)
            if skill and skill.can_handle(request, state):
                selected.append(skill)
        return selected


def build_default_skill_registry() -> SkillRegistry:
    registry = SkillRegistry()
    for skill_class in _DEFAULT_SKILL_CLASSES:
        registry.register(skill_class())
    return registry
