"""任务 → skill/tool 路由单一事实来源（metadata.task_types）的回归测试。"""

from __future__ import annotations

from experimentos.agent.planner import Planner
from experimentos.models import ExperimentContext, ExperimentRequest, MetricInput, SegmentMetricInput
from experimentos.skills.driver_analysis import DriverAnalysisSkill
from experimentos.skills.experiment_recap import ExperimentRecapSkill
from experimentos.skills.quality_check import QualityCheckSkill
from experimentos.skills.registry import (
    DEFAULT_SKILLS_BY_TASK,
    DEFAULT_TOOLS_BY_TASK,
)
from experimentos.skills.release_recommendation import ReleaseRecommendationSkill
from experimentos.skills.segment_diagnosis import SegmentDiagnosisSkill

_DEFAULT_SKILL_CLASSES = (
    QualityCheckSkill,
    ExperimentRecapSkill,
    SegmentDiagnosisSkill,
    DriverAnalysisSkill,
    ReleaseRecommendationSkill,
)


def test_skill_route_exact_content():
    assert DEFAULT_SKILLS_BY_TASK["experiment_recap"] == (
        "quality_check", "experiment_recap", "segment_diagnosis", "release_recommendation",
    )
    assert DEFAULT_SKILLS_BY_TASK["quality_check"] == (
        "quality_check", "experiment_recap", "release_recommendation",
    )
    assert DEFAULT_SKILLS_BY_TASK["segment_diagnosis"] == (
        "quality_check", "experiment_recap", "segment_diagnosis", "release_recommendation",
    )
    assert DEFAULT_SKILLS_BY_TASK["release_recommendation"] == (
        "quality_check", "experiment_recap", "segment_diagnosis", "release_recommendation",
    )
    assert DEFAULT_SKILLS_BY_TASK["driver_analysis"] == (
        "quality_check", "experiment_recap", "driver_analysis", "release_recommendation",
    )


def test_tool_route_exact_content():
    assert DEFAULT_TOOLS_BY_TASK["experiment_recap"] == (
        "check_quality", "analyze_metric", "analyze_segment", "make_recommendation",
    )
    assert DEFAULT_TOOLS_BY_TASK["quality_check"] == (
        "check_quality", "analyze_metric", "make_recommendation",
    )
    assert DEFAULT_TOOLS_BY_TASK["segment_diagnosis"] == (
        "check_quality", "analyze_metric", "analyze_segment", "make_recommendation",
    )
    assert DEFAULT_TOOLS_BY_TASK["release_recommendation"] == (
        "check_quality", "analyze_metric", "analyze_segment", "make_recommendation",
    )
    assert DEFAULT_TOOLS_BY_TASK["driver_analysis"] == (
        "check_quality", "analyze_metric", "driver_analysis", "make_recommendation",
    )


def test_route_is_consistent_with_skill_metadata():
    # 路由必须能从 metadata.task_types / required_tools 重新推导，防止手写漂移。
    for task_type, names in DEFAULT_SKILLS_BY_TASK.items():
        derived = tuple(
            cls.metadata.name
            for cls in _DEFAULT_SKILL_CLASSES
            if task_type in cls.metadata.task_types
        )
        assert names == derived
    for task_type, tools in DEFAULT_TOOLS_BY_TASK.items():
        derived = tuple(dict.fromkeys(
            tool
            for name in DEFAULT_SKILLS_BY_TASK[task_type]
            for tool in next(
                cls.metadata.required_tools
                for cls in _DEFAULT_SKILL_CLASSES
                if cls.metadata.name == name
            )
        ))
        assert tools == derived


def _request(with_segments: bool, data_source: bool = False) -> ExperimentRequest:
    context = ExperimentContext(
        objective="提升点击率",
        control_name="control",
        treatment_name="treatment",
        start_date="2026-09-01",
        end_date="2026-09-09",
    )
    metrics = [
        MetricInput(name="CTR", kind="conversion", control_n=1000, treatment_n=1000,
                    control_successes=100, treatment_successes=120),
    ]
    segments = [
        SegmentMetricInput(name="CTR", kind="conversion", control_n=1000, treatment_n=1000,
                           control_successes=100, treatment_successes=120,
                           segment_name="user_type", segment_value="new_user"),
    ] if with_segments else []
    data_source_config = None
    if data_source:
        from experimentos.models import DataSourceConfig
        data_source_config = DataSourceConfig(kind="duckdb", database_path=":memory:")
    return ExperimentRequest(
        question="请复盘实验并给出发布建议",
        context=context,
        metrics=metrics,
        segments=segments,
        data_source=data_source_config,
    )


def test_planner_plan_matches_registry_route_when_segments_exist():
    planner = Planner()
    for task_type in DEFAULT_SKILLS_BY_TASK:
        plan = planner.create_plan(task_type, _request(with_segments=True))
        assert plan.skills == list(DEFAULT_SKILLS_BY_TASK[task_type])
        assert plan.tools == list(DEFAULT_TOOLS_BY_TASK[task_type])


def test_planner_drops_segment_route_without_segments():
    plan = Planner().create_plan("experiment_recap", _request(with_segments=False))
    assert "segment_diagnosis" not in plan.skills
    assert "analyze_segment" not in plan.tools


def test_planner_inserts_data_materialization_first():
    plan = Planner().create_plan("experiment_recap", _request(with_segments=False, data_source=True))
    assert plan.tools[0] == "get_experiment_report"
