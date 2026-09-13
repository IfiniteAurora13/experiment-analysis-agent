from __future__ import annotations

from typing import TYPE_CHECKING, Any

from experimentos.agent.executor import AgentExecutor
from experimentos.agent.guardrails import GuardrailEngine
from experimentos.agent.intent_router import IntentRouter, LLMIntentRouter
from experimentos.agent.narrator import LLMNarrator, ReportRenderer
from experimentos.agent.planner import LLMPlanner, Planner, StructuredPlan
from experimentos.analysis.quality_checks import QualityChecker
from experimentos.analysis.result_validation import ResultValidator
from experimentos.analysis.segmentation import SegmentAnalyzer
from experimentos.analysis.decomposition import explain_metric_tree
from experimentos.models import AnalysisReport, ExperimentRequest, ExperimentState, WorkflowTrace
from experimentos.skills.registry import build_default_skill_registry
from experimentos.tools.catalog_provider import CatalogProvider
from experimentos.tools.gec_ds_provider import GecDsRegistryProvider
from experimentos.tools.libra_provider import LibraProvider
from experimentos.tools.metric_builder import MetricBuilder
from experimentos.tools.metric_registry import MetricRegistry
from experimentos.tools.sql_runner import DuckDBReadOnlyRunner
from experimentos.tools.stats_engine import StatsEngine
from experimentos.tools.registry import ToolMetadata, ToolRegistry

if TYPE_CHECKING:
    from experimentos.agent.llm_client import LlmClient


class ExperimentOrchestrator:
    """Top-level orchestrator for ExperimentOS.

    When an LlmClient is provided, the orchestrator uses LLM-powered
    intent routing and narrative rendering.  Otherwise it falls back to
    the rule-based implementations.
    """

    def __init__(self, llm_client: LlmClient | None = None) -> None:
        self._llm = llm_client

        self.router = (
            LLMIntentRouter(llm_client) if llm_client else IntentRouter()
        )
        self.planner = LLMPlanner(llm_client) if llm_client else Planner()
        self.quality_checker = QualityChecker()
        self.stats = StatsEngine()
        self.segments = SegmentAnalyzer(self.stats)
        self.guardrails = GuardrailEngine()
        self.result_validator = ResultValidator()
        self.renderer = (
            LLMNarrator(llm_client) if llm_client else ReportRenderer()
        )
        self.registry = MetricRegistry()
        self.libra = LibraProvider()
        self.catalog = CatalogProvider()
        self.gec_ds: GecDsRegistryProvider | None = None
        self.tools = self._build_tool_registry()
        self.skills = build_default_skill_registry()
        self.executor = AgentExecutor(self.skills, self.tools)

    def run(self, request: ExperimentRequest) -> AnalysisReport:
        state = ExperimentState(request=request)
        state.task_type = self.router.resolve(request)
        self._apply_plan(state, self.planner.create_plan(state.task_type, request))

        if request.data_source and (not request.metrics and not request.segments):
            try:
                built_metrics, built_segments, registry_entries, report_scope, inferred_metric_group = self.tools.invoke(
                    "get_experiment_report", state, request=request
                )
                request.metrics = built_metrics
                request.segments = built_segments
                request.registry_entries = registry_entries
                state.report_scope = report_scope
                if inferred_metric_group and request.data_source.metric_group_id:
                    state.warnings.append(f"已从 registry 自动推断 metric_group_id={request.data_source.metric_group_id}")
            except Exception as exc:
                state.warnings.append(f"数据源构造失败：{exc}")

        # Data acquisition can supply the metrics required for input validation.
        self._apply_plan(state, self.planner.create_plan(state.task_type, request))
        state.workflow_trace.append(
            WorkflowTrace(
                stage="planner",
                status="ok",
                detail={"skills": state.planned_skills, "tools": state.planned_tools},
            )
        )
        state.workflow_trace.append(
            WorkflowTrace(
                stage="input_validation",
                status="needs_context" if state.missing_inputs else "ok",
                detail={"missing_inputs": state.missing_inputs},
            )
        )

        if request.registry_entries and not request.metrics:
            report = AnalysisReport(
                status="DONE_WITH_CONCERNS",
                task_type=state.task_type,
                summary="已完成指标注册表解析，但尚缺实验结果数值，暂不能给效果结论",
                plan=state.plan,
                warnings=state.warnings,
                report_scope=state.report_scope,
                registry_entries=request.registry_entries,
                facts=self._registry_facts(request.registry_entries),
                recommendations=self._registry_recommendations(),
                selected_skills=state.selected_skills,
                agent_trace=state.tool_calls,
                workflow_trace=state.workflow_trace,
            )
            state.final_report = report
            return report

        if state.missing_inputs:
            if request.registry_entries:
                report = AnalysisReport(
                    status="DONE_WITH_CONCERNS",
                    task_type=state.task_type,
                    summary="已完成指标注册表解析，但尚缺实验结果数值，暂不能给效果结论",
                    plan=state.plan,
                    missing_inputs=state.missing_inputs,
                    warnings=state.warnings,
                    report_scope=state.report_scope,
                    registry_entries=request.registry_entries,
                    facts=self._registry_facts(request.registry_entries),
                    recommendations=self._registry_recommendations(),
                    agent_trace=state.tool_calls,
                    workflow_trace=state.workflow_trace,
                )
                state.final_report = report
                return report
            report = AnalysisReport(
                status="NEEDS_CONTEXT",
                task_type=state.task_type,
                summary="当前信息不足，先补最影响判断的输入",
                plan=state.plan,
                missing_inputs=state.missing_inputs,
                warnings=state.warnings,
                report_scope=state.report_scope,
                agent_trace=state.tool_calls,
                workflow_trace=state.workflow_trace,
            )
            state.final_report = report
            return report

        self.executor.execute(state)
        validation_warnings = self.result_validator.validate(state.metric_results)
        state.warnings.extend(validation_warnings)
        state.workflow_trace.append(
            WorkflowTrace(
                stage="result_validation",
                status="warning" if validation_warnings else "ok",
                detail={"warning_count": len(validation_warnings)},
            )
        )
        facts, inferences, guardrail_hypotheses = self.guardrails.split_findings(
            state.metric_results, state.quality_issues, state.segment_findings
        )
        state.facts = facts
        state.inferences = inferences
        state.hypotheses.extend(guardrail_hypotheses)
        state.workflow_trace.append(WorkflowTrace(stage="guardrails", status="ok"))

        summary = self._build_summary(state.task_type, state.quality_issues, state.recommendations)
        status = "DONE"
        if state.quality_issues or any(item.label == "不建议发布" for item in state.recommendations):
            status = "DONE_WITH_CONCERNS"

        report = AnalysisReport(
            status=status,
            task_type=state.task_type,
            summary=summary,
            plan=state.plan,
            warnings=state.warnings,
            report_scope=state.report_scope,
            registry_entries=request.registry_entries,
            quality_issues=state.quality_issues,
            metric_results=state.metric_results,
            segment_findings=state.segment_findings,
            facts=state.facts,
            inferences=state.inferences,
            hypotheses=state.hypotheses,
            recommendations=state.recommendations,
            selected_skills=state.selected_skills,
            agent_trace=state.tool_calls,
            workflow_trace=state.workflow_trace,
        )
        state.workflow_trace.append(WorkflowTrace(stage="report_generation", status="ok"))
        state.final_report = report
        return report

    def render_markdown(self, report: AnalysisReport) -> str:
        return self.renderer.render_markdown(report)

    def _build_summary(self, task_type: str, quality_issues, recommendations) -> str:
        if quality_issues:
            return "已完成分析，但结论需要结合实验质量风险谨慎解读"
        if any(item.label == "不建议发布" for item in recommendations):
            return f"已完成 {task_type}，当前结论不支持直接发布"
        if recommendations:
            return f"已完成 {task_type}，当前建议：{recommendations[0].label}"
        return f"已完成 {task_type}"

    def _apply_plan(self, state: ExperimentState, plan: StructuredPlan) -> None:
        state.plan = plan.steps
        state.missing_inputs = plan.required_inputs
        state.planned_skills = plan.skills
        state.planned_tools = plan.tools

    def _build_tool_registry(self) -> ToolRegistry:
        tools = ToolRegistry()
        tools.register(
            ToolMetadata(
                name="get_experiment_report",
                description="从配置的数据 provider 构造统一指标输入。",
                input_schema={"request": "ExperimentRequest"},
                output_schema={"metrics": "list[MetricInput]", "segments": "list[SegmentMetricInput]"},
            ),
            self._materialize_inputs,
        )
        tools.register(
            ToolMetadata(
                name="query_data",
                description="返回当前请求的数据可用性概要；真实查询只由配置 provider 执行。",
                input_schema={"request": "ExperimentRequest"},
                output_schema={"metric_count": "int", "segment_count": "int"},
            ),
            self._profile_request,
        )
        tools.register(
            ToolMetadata(
                name="profile_data",
                description="汇总可分析的指标、分群与数据源状态。",
                input_schema={"request": "ExperimentRequest"},
                output_schema={"has_data_source": "bool", "metric_count": "int"},
            ),
            self._profile_request,
        )
        tools.register(
            ToolMetadata("check_quality", "执行实验质量检查。", {"request": "ExperimentRequest"}, {"issues": "list[QualityIssue]"}),
            self.quality_checker.run,
        )
        tools.register(
            ToolMetadata("analyze_metric", "执行确定性指标统计检验。", {"metrics": "list[MetricInput]", "alpha": "float"}, {"results": "list[MetricResult]"}),
            self.stats.analyze_metrics,
        )
        tools.register(
            ToolMetadata("analyze_segment", "执行探索性分群分析。", {"segments": "list[SegmentMetricInput]", "alpha": "float"}, {"findings": "list[Finding]"}),
            self.segments.run,
        )
        tools.register(
            ToolMetadata("lookup_metric", "读取已解析的指标注册信息。", {"request": "ExperimentRequest"}, {"entries": "list[RegistryEntry]"}),
            lambda request: request.registry_entries,
        )
        tools.register(
            ToolMetadata("driver_analysis", "返回可验证的业务指标拆解框架。", {}, {"formulas": "list[str]"}),
            explain_metric_tree,
        )
        tools.register(
            ToolMetadata("make_recommendation", "根据质量与统计结果给出保守建议。", {"metric_results": "list[MetricResult]", "quality_issues": "list[QualityIssue]"}, {"recommendations": "list[Recommendation]"}),
            self.guardrails.recommend,
        )
        return tools

    def _profile_request(self, request: ExperimentRequest) -> dict[str, Any]:
        return {
            "has_data_source": request.data_source is not None,
            "metric_count": len(request.metrics),
            "segment_count": len(request.segments),
            "registry_entry_count": len(request.registry_entries),
        }

    def _materialize_inputs(self, request: ExperimentRequest):
        data_source = request.data_source
        if data_source is None:
            return request.metrics, request.segments, request.registry_entries, {}, False

        metric_specs = []
        segment_specs = []
        if data_source.metric_specs_path:
            metric_specs = self.registry.load_metric_specs(data_source.metric_specs_path)
        if data_source.segment_specs_path:
            segment_specs = self.registry.load_segment_specs(data_source.segment_specs_path)

        provider = data_source.provider or data_source.kind or "duckdb"
        if provider == "duckdb":
            runner = DuckDBReadOnlyRunner(data_source.database_path)
            builder = MetricBuilder(runner)
            return builder.build_metrics(metric_specs), builder.build_segments(segment_specs), [], {}, False
        if provider == "libra":
            inferred_metric_group = False
            if not data_source.metric_group_id and any(spec.source_group_name for spec in metric_specs):
                resolved_entries = self._get_gec_ds_provider(data_source.registry_skill_root).resolve_entries(metric_specs)
                request.registry_entries = resolved_entries
                inferred_group_id = self._infer_single_group_id(resolved_entries)
                if inferred_group_id:
                    data_source.metric_group_id = inferred_group_id
                    inferred_metric_group = True
                else:
                    raise ValueError("无法从 registry 唯一推断 metric_group_id。")
            built_metrics, report_scope = self.libra.build_metrics(data_source, metric_specs)
            return built_metrics, [], request.registry_entries, report_scope, inferred_metric_group
        if provider == "gec-ds-catalog":
            return [], [], self._get_gec_ds_provider(data_source.registry_skill_root).resolve_entries(metric_specs), {}, False
        if provider == "catalog":
            catalog_rows = self.catalog.describe(data_source, metric_specs)
            raise ValueError(f"catalog provider 当前只支持目录注册，不直接产出统计输入：{catalog_rows}")
        raise ValueError(f"暂不支持的数据源类型：{provider}")

    def _get_gec_ds_provider(self, skill_root: str = "") -> GecDsRegistryProvider:
        if self.gec_ds is None:
            self.gec_ds = GecDsRegistryProvider(skill_root or None)
        return self.gec_ds

    def _infer_single_group_id(self, entries):
        group_ids = sorted({item.libra_group_id for item in entries if item.libra_group_id})
        if len(group_ids) == 1:
            return group_ids[0]
        return None

    def _registry_facts(self, entries):
        facts = []
        for item in entries:
            owners = ", ".join(item.owners) if item.owners else "NA"
            tables = ", ".join(item.source_tables) if item.source_tables else "NA"
            facts.append(
                {
                    "label": f"{item.name} 注册信息",
                    "evidence": (
                        f"group={item.source_group_name or 'NA'}，gallery_id={item.gallery_id or 'NA'}，"
                        f"libra_group_id={item.libra_group_id or 'NA'}，owners={owners}，source_tables={tables}，"
                        f"证据状态={item.evidence_status or 'NA'}"
                    ),
                    "strength": "事实",
                }
            )
        from experimentos.models import Finding
        return [Finding(**item) for item in facts]

    def _registry_recommendations(self):
        from experimentos.models import Recommendation
        return [
            Recommendation(
                label="补实验结果数值",
                reason="当前只完成了指标注册表解析，下一步需要补 flight_id/report 或真实 SQL 结果，才能进入效果分析。",
            ),
            Recommendation(
                label="核对 metric SQL 快照",
                reason="对 warning 中未命中的 metric，需继续补齐定义快照或走实时 Libra definition。",
            ),
        ]
