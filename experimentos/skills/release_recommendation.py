from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.skills.base import SkillMetadata, SkillResult
from experimentos.tools.registry import ToolRegistry


class ReleaseRecommendationSkill:
    metadata = SkillMetadata(
        name="release_recommendation",
        description="在质量风险、核心指标和护栏指标均已检查后生成保守建议。",
        task_types=frozenset({
            "experiment_recap",
            "release_recommendation",
            "segment_diagnosis",
            "driver_analysis",
        }),
        required_tools=("make_recommendation",),
    )

    def can_handle(self, request: ExperimentRequest, state: ExperimentState) -> bool:
        # Selection happens before preceding skills execute. The release skill
        # is therefore queued from validated input and consumes only the
        # deterministic results that those preceding skills place in state.
        return bool(request.metrics)

    def run(self, request: ExperimentRequest, state: ExperimentState, tools: ToolRegistry) -> SkillResult:
        state.recommendations = tools.invoke(
            "make_recommendation",
            state,
            metric_results=state.metric_results,
            quality_issues=state.quality_issues,
        )
        return SkillResult(name=self.metadata.name)
