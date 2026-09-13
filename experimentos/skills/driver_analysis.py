from __future__ import annotations

from experimentos.models import ExperimentRequest, ExperimentState, Finding
from experimentos.skills.base import SkillMetadata, SkillResult
from experimentos.tools.registry import ToolRegistry


class DriverAnalysisSkill:
    metadata = SkillMetadata(
        name="driver_analysis",
        description="提供可验证的业务指标拆解框架，不将其误作已证实归因。",
        task_types=frozenset({"driver_analysis"}),
        required_tools=("driver_analysis",),
    )

    def can_handle(self, request: ExperimentRequest, state: ExperimentState) -> bool:
        return bool(request.metrics)

    def run(self, request: ExperimentRequest, state: ExperimentState, tools: ToolRegistry) -> SkillResult:
        formulas = tools.invoke("driver_analysis", state)
        state.hypotheses.extend(
            Finding(label="驱动拆解框架", evidence=formula, strength="待验证假设")
            for formula in formulas
        )
        return SkillResult(name=self.metadata.name)
