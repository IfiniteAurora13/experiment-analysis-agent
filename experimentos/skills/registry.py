from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.skills.base import Skill
from experimentos.skills.driver_analysis import DriverAnalysisSkill
from experimentos.skills.experiment_recap import ExperimentRecapSkill
from experimentos.skills.quality_check import QualityCheckSkill
from experimentos.skills.release_recommendation import ReleaseRecommendationSkill
from experimentos.skills.segment_diagnosis import SegmentDiagnosisSkill


DEFAULT_SKILLS_BY_TASK: dict[str, tuple[str, ...]] = {
    "experiment_recap": ("quality_check", "experiment_recap", "segment_diagnosis", "release_recommendation"),
    "quality_check": ("quality_check", "experiment_recap", "release_recommendation"),
    "segment_diagnosis": ("quality_check", "experiment_recap", "segment_diagnosis", "release_recommendation"),
    "release_recommendation": ("quality_check", "experiment_recap", "segment_diagnosis", "release_recommendation"),
    "driver_analysis": ("quality_check", "experiment_recap", "driver_analysis", "release_recommendation"),
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
    for skill in (
        QualityCheckSkill(),
        ExperimentRecapSkill(),
        SegmentDiagnosisSkill(),
        DriverAnalysisSkill(),
        ReleaseRecommendationSkill(),
    ):
        registry.register(skill)
    return registry
