from __future__ import annotations

from experimentos.models import ExperimentState, WorkflowTrace
from experimentos.skills.registry import SkillRegistry
from experimentos.tools.registry import ToolBudgetExhausted, ToolRegistry


class AgentExecutor:
    """Executes the bounded Skill → Tool → State-update loop.

    Planning may be LLM-assisted, but all selected skills call deterministic
    tools. Each tool invocation appends a ToolTrace to the shared state.
    """

    def __init__(self, skills: SkillRegistry, tools: ToolRegistry) -> None:
        self._skills = skills
        self._tools = tools

    def execute(self, state: ExperimentState) -> ExperimentState:
        selected = self._skills.select(
            request=state.request,
            state=state,
            requested_names=state.planned_skills,
        )
        state.selected_skills = [skill.metadata.name for skill in selected]

        for skill in selected:
            if len(state.tool_calls) >= state.max_tool_calls:
                state.warnings.append(f"已达到最大 tool call 数 {state.max_tool_calls}，后续 skill 未执行。")
                break
            try:
                result = skill.run(state.request, state, self._tools)
            except ToolBudgetExhausted as exc:
                # Budget gone mid-skill: stop here instead of letting every
                # remaining skill fail with the same error.
                state.workflow_trace.append(
                    WorkflowTrace(stage=f"skill:{skill.metadata.name}", status="error", detail={"error": str(exc)})
                )
                state.warnings.append(str(exc))
                break
            except Exception as exc:
                # Graceful degradation: record the failure and continue with
                # the remaining skills so partial results still reach the
                # validator, guardrails and final report.
                state.workflow_trace.append(
                    WorkflowTrace(stage=f"skill:{skill.metadata.name}", status="error", detail={"error": str(exc)})
                )
                state.warnings.append(f"skill {skill.metadata.name} 执行失败，已跳过：{exc}")
                continue
            state.completed_skills.append(result.name)
            state.warnings.extend(result.warnings)
            state.workflow_trace.append(
                WorkflowTrace(stage=f"skill:{result.name}", status="ok")
            )
        return state
