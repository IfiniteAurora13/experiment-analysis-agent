from __future__ import annotations

import json
from dataclasses import dataclass

from experimentos.models import AnalysisStep, ExperimentRequest
from experimentos.skills.registry import DEFAULT_SKILLS_BY_TASK, DEFAULT_TOOLS_BY_TASK


TASK_STEPS = {
    "experiment_recap": [
        AnalysisStep("确认输入", "确认实验目标、实验组/对照组、指标和周期"),
        AnalysisStep("质量检查", "优先检查 SRM、样本量和实验时长"),
        AnalysisStep("核心指标分析", "报告绝对差异、相对变化、显著性和区间"),
        AnalysisStep("形成建议", "给出是否建议发布与下一步动作"),
    ],
    "quality_check": [
        AnalysisStep("确认输入", "确认分流方式、样本量、实验周期、埋点口径"),
        AnalysisStep("质量检查", "检查 SRM、样本量、实验时长和指标完整性"),
        AnalysisStep("结论约束", "先说明质量问题对结论可信度的影响"),
    ],
    "segment_diagnosis": [
        AnalysisStep("确认输入", "确认分群字段和核心指标"),
        AnalysisStep("总体结果", "先看总体指标方向和显著性"),
        AnalysisStep("分群诊断", "筛选有意义且样本量足够的分群"),
        AnalysisStep("后续验证", "把分群发现标记为待验证假设"),
    ],
    "release_recommendation": [
        AnalysisStep("确认输入", "确认核心指标、护栏指标和发布标准"),
        AnalysisStep("质量检查", "若实验质量异常则降低建议强度"),
        AnalysisStep("指标判断", "综合核心指标、护栏指标和风险"),
        AnalysisStep("发布建议", "给出不发布 / 灰度 / 可发布建议"),
    ],
    "driver_analysis": [
        AnalysisStep("确认输入", "确认要解释的指标和业务公式"),
        AnalysisStep("质量检查", "先排除实验质量问题"),
        AnalysisStep("指标拆解", "按流量、转化率、客单价等拆解"),
        AnalysisStep("形成假设", "明确哪些是事实，哪些只是待验证"),
    ],
}

# The task → skill/tool routes are derived in skills/registry from each
# skill's metadata (task_types / required_tools) — the single source of truth.
DEFAULT_SKILLS = {task: list(names) for task, names in DEFAULT_SKILLS_BY_TASK.items()}
DEFAULT_TOOLS = {task: list(names) for task, names in DEFAULT_TOOLS_BY_TASK.items()}

VALID_SKILLS = frozenset({name for names in DEFAULT_SKILLS.values() for name in names})
VALID_TOOLS = frozenset({name for names in DEFAULT_TOOLS.values() for name in names} | {"get_experiment_report"})


@dataclass(frozen=True)
class StructuredPlan:
    """Validated plan used to select skills and deterministic tools."""

    goal: str
    required_inputs: list[str]
    skills: list[str]
    tools: list[str]
    reasoning_constraints: list[str]
    steps: list[AnalysisStep]
    source: str = "deterministic"


class Planner:
    def build(self, task_type: str, request: ExperimentRequest) -> tuple[list[AnalysisStep], list[str]]:
        missing: list[str] = []
        context = request.context
        has_registry = bool(request.registry_entries)

        if not context.objective:
            missing.append("实验目标")
        if not request.metrics and not has_registry:
            missing.append("至少 1 个核心指标汇总结果")
        if not context.control_name or not context.treatment_name:
            missing.append("实验组 / 对照组定义")
        if (not context.start_date or not context.end_date) and not has_registry:
            missing.append("实验起止时间")
        if task_type == "segment_diagnosis" and not request.segments:
            missing.append("分群结果或可用分群字段")
        if task_type in {"quality_check", "release_recommendation"}:
            if not has_registry and not any(metric.control_n and metric.treatment_n for metric in request.metrics):
                missing.append("实验组 / 对照组样本量")

        return TASK_STEPS.get(task_type, TASK_STEPS["experiment_recap"]), missing

    def create_plan(self, task_type: str, request: ExperimentRequest) -> StructuredPlan:
        steps, missing = self.build(task_type, request)
        skills = list(DEFAULT_SKILLS.get(task_type, DEFAULT_SKILLS["experiment_recap"]))
        tools = list(DEFAULT_TOOLS.get(task_type, DEFAULT_TOOLS["experiment_recap"]))
        if not request.segments:
            # 分群 skill/tool 仅在存在分群数据时保留，让计划与实际执行一致。
            skills = [name for name in skills if name != "segment_diagnosis"]
            tools = [name for name in tools if name != "analyze_segment"]
        if request.data_source and "get_experiment_report" not in tools:
            tools.insert(0, "get_experiment_report")
        return StructuredPlan(
            goal=request.context.objective or request.question,
            required_inputs=missing,
            skills=skills,
            tools=tools,
            reasoning_constraints=[
                "先检查实验质量，再解释效果。",
                "统计数字只能来自确定性工具输出。",
                "分群发现只能表述为待验证假设。",
                "显著性不足时不得直接建议发布。",
            ],
            steps=steps,
        )


class LLMPlanner(Planner):
    """Optional JSON planner with schema validation and deterministic fallback."""

    def __init__(self, llm_client, prompt_path: str | None = None) -> None:
        self._llm = llm_client
        self._prompt_path = prompt_path
        self._prompt: str | None = None
        self._fallback = Planner()

    def create_plan(self, task_type: str, request: ExperimentRequest) -> StructuredPlan:
        fallback = self._fallback.create_plan(task_type, request)
        try:
            payload = self._parse_json(self._llm.complete(self._load_prompt(), self._request_prompt(request, task_type)))
            return self._validate(payload, fallback)
        except Exception:
            return fallback

    def build(self, task_type: str, request: ExperimentRequest) -> tuple[list[AnalysisStep], list[str]]:
        plan = self.create_plan(task_type, request)
        return plan.steps, plan.required_inputs

    def _validate(self, payload: object, fallback: StructuredPlan) -> StructuredPlan:
        if not isinstance(payload, dict):
            raise ValueError("LLM plan 必须是 JSON object。")
        required = {"goal", "required_inputs", "skills", "tools", "reasoning_constraints"}
        if not required.issubset(payload):
            raise ValueError("LLM plan 缺少必填字段。")

        goal = payload["goal"]
        fields = ["required_inputs", "skills", "tools", "reasoning_constraints"]
        if not isinstance(goal, str) or not goal.strip() or any(
            not isinstance(payload[field], list) or not all(isinstance(item, str) for item in payload[field])
            for field in fields
        ):
            raise ValueError("LLM plan 字段类型不合法。")
        if any(item not in VALID_SKILLS for item in payload["skills"]):
            raise ValueError("LLM plan 含未知 skill。")
        if any(item not in VALID_TOOLS for item in payload["tools"]):
            raise ValueError("LLM plan 含未知 tool。")

        # LLM can extend the route, but cannot remove deterministic quality and
        # guardrail controls that are mandatory for this task type.
        return StructuredPlan(
            goal=goal.strip(),
            required_inputs=list(dict.fromkeys([*fallback.required_inputs, *payload["required_inputs"]])),
            skills=list(dict.fromkeys([*fallback.skills, *payload["skills"]])),
            tools=list(dict.fromkeys([*fallback.tools, *payload["tools"]])),
            reasoning_constraints=list(dict.fromkeys([*fallback.reasoning_constraints, *payload["reasoning_constraints"]])),
            steps=fallback.steps,
            source="llm_validated",
        )

    def _parse_json(self, raw: str) -> object:
        text = raw.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        return json.loads(text)

    def _request_prompt(self, request: ExperimentRequest, task_type: str) -> str:
        return json.dumps(
            {
                "question": request.question,
                "task_type": task_type,
                "available_skills": sorted(VALID_SKILLS),
                "available_tools": sorted(VALID_TOOLS),
                "context": {
                    "objective": request.context.objective,
                    "has_metrics": bool(request.metrics),
                    "has_segments": bool(request.segments),
                    "has_data_source": request.data_source is not None,
                },
            },
            ensure_ascii=False,
        )

    def _load_prompt(self) -> str:
        if self._prompt is not None:
            return self._prompt
        if self._prompt_path:
            from pathlib import Path

            path = Path(self._prompt_path)
        else:
            from pathlib import Path

            path = Path(__file__).resolve().parent.parent / "prompts" / "plan.md"
        self._prompt = path.read_text(encoding="utf-8")
        return self._prompt
