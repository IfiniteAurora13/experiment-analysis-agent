from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState
from experimentos.skills.base import SkillMetadata, SkillResult
from experimentos.tools.registry import ToolRegistry


class ExperimentRecapSkill:
    metadata = SkillMetadata(
        name="experiment_recap",
        description="对总体核心与护栏指标执行确定性统计分析。",
        task_types=frozenset({
            "experiment_recap",
            "quality_check",
            "segment_diagnosis",
            "release_recommendation",
            "driver_analysis",
        }),
        required_tools=("analyze_metric",),
    )

    def can_handle(self, request: ExperimentRequest, state: ExperimentState) -> bool:
        return bool(request.metrics)

    def run(self, request: ExperimentRequest, state: ExperimentState, tools: ToolRegistry) -> SkillResult:
        state.metric_results = tools.invoke(
            "analyze_metric",
            state,
            metrics=request.metrics,
            alpha=request.context.alpha,
        )
        return SkillResult(name=self.metadata.name)
