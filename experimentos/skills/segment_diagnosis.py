from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.skills.base import SkillMetadata, SkillResult
from experimentos.tools.registry import ToolRegistry


class SegmentDiagnosisSkill:
    metadata = SkillMetadata(
        name="segment_diagnosis",
        description="分析样本量足够的分群，并把结果保持为探索性发现。",
        task_types=frozenset({"experiment_recap", "segment_diagnosis", "release_recommendation"}),
        required_tools=("analyze_segment",),
    )

    def can_handle(self, request: ExperimentRequest, state: ExperimentState) -> bool:
        return bool(request.segments)

    def run(self, request: ExperimentRequest, state: ExperimentState, tools: ToolRegistry) -> SkillResult:
        state.segment_findings = tools.invoke(
            "analyze_segment",
            state,
            segments=request.segments,
            alpha=request.context.alpha,
            context=request.context,
        )
        return SkillResult(name=self.metadata.name)
