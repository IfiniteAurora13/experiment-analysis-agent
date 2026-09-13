from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.skills.base import SkillMetadata, SkillResult
from experimentos.tools.registry import ToolRegistry


class QualityCheckSkill:
    metadata = SkillMetadata(
        name="quality_check",
        description="检查 SRM、实验时长和样本量等结果可信度风险。",
        task_types=frozenset({
            "experiment_recap",
            "quality_check",
            "segment_diagnosis",
            "release_recommendation",
            "driver_analysis",
        }),
        required_tools=("check_quality",),
    )

    def can_handle(self, request: ExperimentRequest, state: ExperimentState) -> bool:
        return bool(request.metrics)

    def run(self, request: ExperimentRequest, state: ExperimentState, tools: ToolRegistry) -> SkillResult:
        state.quality_issues = tools.invoke("check_quality", state, request=request)
        return SkillResult(name=self.metadata.name)
