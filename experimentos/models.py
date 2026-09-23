from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class MetricInput:
    name: str
    kind: str
    role: str = "core"
    direction: str = "increase"
    unit: str = ""
    control_n: int = 0
    treatment_n: int = 0
    control_value: float | None = None
    treatment_value: float | None = None
    control_var: float | None = None
    treatment_var: float | None = None
    control_successes: int | None = None
    treatment_successes: int | None = None
    statistical_source: str = "computed"
    platform_p_value: float | None = None
    platform_ci_low: float | None = None
    platform_ci_high: float | None = None
    platform_significant: bool | None = None
    platform_summary: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "MetricInput":
        return cls(**data)


@dataclass
class SegmentMetricInput(MetricInput):
    segment_name: str = ""
    segment_value: str = ""

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "SegmentMetricInput":
        return cls(**data)


@dataclass
class ExperimentContext:
    experiment_id: str = ""
    name: str = ""
    objective: str = ""
    hypothesis: str = ""
    control_name: str = "control"
    treatment_name: str = "treatment"
    start_date: str = ""
    end_date: str = ""
    alpha: float = 0.05
    expected_control_ratio: float = 0.5
    segment_min_n: int = 100
    max_segment_findings: int = 5
    srm_alpha: float = 0.001
    min_sample_size: int = 200
    min_experiment_days: int = 7
    exposure_definition: str = ""
    conversion_definition: str = ""
    dimensions: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ExperimentContext":
        return cls(**data)


@dataclass
class DataSourceConfig:
    kind: str = ""
    database_path: str = ""
    metric_specs_path: str = ""
    segment_specs_path: str = ""
    provider: str = ""
    session_id: str = ""
    app_id: int | None = None
    vregion: str = ""
    flight_id: int | None = None
    metric_group_id: int | None = None
    report_mode: str = "report"
    report_fixture_path: str = ""
    allow_live_provider: bool = False
    catalog_query: str = ""
    registry_skill_root: str = ""

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "DataSourceConfig":
        return cls(**data)


@dataclass
class ExperimentRequest:
    question: str
    task_type: str | None = None
    context: ExperimentContext = field(default_factory=ExperimentContext)
    data_source: DataSourceConfig | None = None
    metrics: list[MetricInput] = field(default_factory=list)
    segments: list[SegmentMetricInput] = field(default_factory=list)
    registry_entries: list["RegistryEntry"] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ExperimentRequest":
        context = ExperimentContext.from_dict(data.get("context", {}))
        data_source = (
            DataSourceConfig.from_dict(data["data_source"])
            if data.get("data_source")
            else None
        )
        metrics = [MetricInput.from_dict(item) for item in data.get("metrics", [])]
        segments = [SegmentMetricInput.from_dict(item) for item in data.get("segments", [])]
        return cls(
            question=data["question"],
            task_type=data.get("task_type"),
            context=context,
            data_source=data_source,
            metrics=metrics,
            segments=segments,
        )


@dataclass
class AnalysisStep:
    name: str
    purpose: str


@dataclass
class QualityIssue:
    name: str
    severity: str
    impact: str
    recommendation: str


@dataclass
class MetricResult:
    """A provider-neutral, auditable statistical result for one metric."""

    metric_name: str
    metric_kind: str
    metric_role: str
    direction: str
    control_n: int
    treatment_n: int
    control_value: float
    treatment_value: float
    delta_abs: float
    delta_rel: float | None
    p_value: float | None
    ci_low: float | None
    ci_high: float | None
    significant: bool
    statistical_method: str
    interpretation: str
    statistical_source: str = "computed"
    source_summary: str = ""
    notes: str = ""

    # Read-only aliases retain the existing renderer and provider contracts
    # while serialised output uses the explicit field names above.
    @property
    def name(self) -> str:
        return self.metric_name

    @property
    def kind(self) -> str:
        return self.metric_kind

    @property
    def role(self) -> str:
        return self.metric_role


@dataclass
class Finding:
    label: str
    evidence: str
    strength: str


@dataclass
class Recommendation:
    label: str
    reason: str


@dataclass
class AnalysisReport:
    status: str
    task_type: str
    summary: str
    plan: list[AnalysisStep] = field(default_factory=list)
    missing_inputs: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    report_scope: dict[str, Any] = field(default_factory=dict)
    registry_entries: list["RegistryEntry"] = field(default_factory=list)
    quality_issues: list[QualityIssue] = field(default_factory=list)
    metric_results: list[MetricResult] = field(default_factory=list)
    segment_findings: list[Finding] = field(default_factory=list)
    facts: list[Finding] = field(default_factory=list)
    inferences: list[Finding] = field(default_factory=list)
    hypotheses: list[Finding] = field(default_factory=list)
    recommendations: list[Recommendation] = field(default_factory=list)
    selected_skills: list[str] = field(default_factory=list)
    agent_trace: list["ToolTrace"] = field(default_factory=list)
    workflow_trace: list["WorkflowTrace"] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class MetricSpec:
    name: str
    kind: str
    role: str = "core"
    direction: str = "increase"
    unit: str = ""
    sql: str = ""
    provider: str = "sql"
    entity: str = ""
    owner: str = ""
    source_group_name: str = ""
    source_metric_name: str = ""
    source_metric_id: int | None = None
    source_table: str = ""
    source_column: str = ""
    notes: str = ""


@dataclass
class SegmentMetricSpec(MetricSpec):
    segment_name: str = ""
    group_by: str = ""


@dataclass
class RegistryEntry:
    name: str
    provider: str
    kind: str
    role: str
    direction: str
    unit: str
    source_group_name: str = ""
    source_metric_name: str = ""
    gallery_id: int | None = None
    libra_group_id: int | None = None
    metric_id: int | None = None
    owners: list[str] = field(default_factory=list)
    develop_owner: str = ""
    source_tables: list[str] = field(default_factory=list)
    evidence_status: str = ""
    notes: str = ""
    warnings: list[str] = field(default_factory=list)
    raw_group: dict[str, Any] = field(default_factory=dict)
    raw_metric: dict[str, Any] = field(default_factory=dict)


@dataclass
class ToolTrace:
    """A sanitised, serialisable trace record for one deterministic tool call."""

    tool_name: str
    input: dict[str, Any]
    output: dict[str, Any]
    status: str
    latency_ms: float
    error: str = ""


@dataclass
class WorkflowTrace:
    """Trace event for a workflow node that is not a direct tool invocation."""

    stage: str
    status: str
    detail: dict[str, Any] = field(default_factory=dict)


@dataclass
class ExperimentState:
    """State passed across the lightweight ExperimentOS workflow nodes."""

    request: ExperimentRequest
    task_type: str = ""
    plan: list[AnalysisStep] = field(default_factory=list)
    planned_skills: list[str] = field(default_factory=list)
    planned_tools: list[str] = field(default_factory=list)
    missing_inputs: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    report_scope: dict[str, Any] = field(default_factory=dict)
    quality_issues: list[QualityIssue] = field(default_factory=list)
    metric_results: list[MetricResult] = field(default_factory=list)
    segment_findings: list[Finding] = field(default_factory=list)
    facts: list[Finding] = field(default_factory=list)
    inferences: list[Finding] = field(default_factory=list)
    hypotheses: list[Finding] = field(default_factory=list)
    recommendations: list[Recommendation] = field(default_factory=list)
    selected_skills: list[str] = field(default_factory=list)
    completed_skills: list[str] = field(default_factory=list)
    tool_calls: list[ToolTrace] = field(default_factory=list)
    workflow_trace: list[WorkflowTrace] = field(default_factory=list)
    max_tool_calls: int = 5
    final_report: AnalysisReport | None = None
