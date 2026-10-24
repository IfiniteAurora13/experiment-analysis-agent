"""Allowlisted offline fault injection; never read from ExperimentRequest."""

from __future__ import annotations

from contextlib import contextmanager
from unittest.mock import patch

from experimentos.agent.guardrails import GuardrailEngine
from experimentos.analysis.quality_checks import QualityChecker
from experimentos.analysis.result_validation import ResultValidator
from experimentos.analysis.segmentation import SegmentAnalyzer
from experimentos.tools.stats_engine import StatsEngine


FAULTS = {
    "quality_check_error": (QualityChecker, "run"),
    "metric_analysis_error": (StatsEngine, "analyze_metrics"),
    "segment_analysis_error": (SegmentAnalyzer, "run"),
    "result_validation_error": (ResultValidator, "validate"),
    "recommendation_error": (GuardrailEngine, "recommend"),
}


@contextmanager
def injected_fault(name: str | None):
    if name is None:
        yield
        return
    if name not in FAULTS:
        raise ValueError(f"未注册的离线故障：{name}")
    target, method = FAULTS[name]
    with patch.object(target, method, side_effect=RuntimeError(f"offline injected fault: {name}")):
        yield
