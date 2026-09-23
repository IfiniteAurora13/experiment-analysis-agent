"""BH-FDR 多重比较校正与质量检查阈值参数化的回归测试。"""

from __future__ import annotations

import pytest

from experimentos.analysis.quality_checks import QualityChecker
from experimentos.analysis.segmentation import SegmentAnalyzer, benjamini_hochberg
from experimentos.models import ExperimentContext, ExperimentRequest, MetricInput, SegmentMetricInput
from experimentos.tools.stats_engine import StatsEngine


# ---------------------------------------------------------------------------
# benjamini_hochberg 单元测试
# ---------------------------------------------------------------------------


def test_bh_classic_rejects_sorted_prefix():
    adjusted, rejected = benjamini_hochberg([0.01, 0.02, 0.03, 0.40], 0.05)
    assert rejected == [True, True, True, False]
    assert adjusted == pytest.approx([0.04, 0.04, 0.04, 0.40])


def test_bh_surprise_case_rejects_both_when_last_rank_satisfies():
    # 经典性质：p1 单独超阈值，但 k=2 整体满足，双双拒绝。
    adjusted, rejected = benjamini_hochberg([0.03, 0.04], 0.05)
    assert rejected == [True, True]
    assert adjusted == pytest.approx([0.04, 0.04])


def test_bh_conflict_case_rejects_nothing():
    # 所有 p 都 < alpha 的前两个原始显著，但没有任何 rank 满足 BH 阈值。
    adjusted, rejected = benjamini_hochberg([0.02, 0.04, 0.10], 0.05)
    assert rejected == [False, False, False]
    assert adjusted == pytest.approx([0.06, 0.06, 0.10])


def test_bh_none_counts_toward_m_and_stays_none():
    adjusted, rejected = benjamini_hochberg([0.01, None, 0.30], 0.05)
    assert rejected == [True, False, False]
    assert adjusted[0] == pytest.approx(0.03)
    assert adjusted[1] is None
    assert adjusted[2] == pytest.approx(0.45)


def test_bh_all_none():
    adjusted, rejected = benjamini_hochberg([None, None], 0.05)
    assert adjusted == [None, None]
    assert rejected == [False, False]


def test_bh_empty_input():
    adjusted, rejected = benjamini_hochberg([], 0.05)
    assert adjusted == []
    assert rejected == []


def test_bh_exact_threshold_is_rejected():
    adjusted, rejected = benjamini_hochberg([0.05], 0.05)
    assert rejected == [True]
    assert adjusted == pytest.approx([0.05])


def test_bh_output_order_matches_input_order():
    adjusted, rejected = benjamini_hochberg([0.10, 0.01, 0.04], 0.05)
    assert rejected == [False, True, False]
    assert adjusted == pytest.approx([0.10, 0.03, 0.06])


def test_bh_zero_alpha_does_not_raise():
    adjusted, rejected = benjamini_hochberg([0.5, 0.2], 0.0)
    assert rejected == [False, False]
    assert adjusted == pytest.approx([0.5, 0.4])


# ---------------------------------------------------------------------------
# SegmentAnalyzer 集成测试（platform 分群可精确控制 p 值）
# ---------------------------------------------------------------------------


def _platform_segment(name: str, p_value: float | None, delta: float = 0.01,
                      control_n: int = 1000, treatment_n: int = 1000) -> SegmentMetricInput:
    return SegmentMetricInput(
        name=name,
        kind="conversion",
        control_n=control_n,
        treatment_n=treatment_n,
        control_value=0.10,
        treatment_value=0.10 + delta,
        statistical_source="libra_platform",
        platform_p_value=p_value,
        segment_name=name,
        segment_value="A",
    )


def test_segment_analyzer_filters_below_min_n():
    stats = StatsEngine()
    segments = [
        _platform_segment("CVR_新用户", 0.9),
        _platform_segment("CVR_老用户", 0.9, control_n=50, treatment_n=50),
        _platform_segment("CVR_回流", 0.9),
    ]
    findings = SegmentAnalyzer(stats).run(segments, 0.05)
    labels = [item.label for item in findings]
    assert "CVR_新用户 分群发现" in labels
    assert "CVR_回流 分群发现" in labels
    assert "CVR_老用户 分群发现" not in labels


def test_segment_analyzer_respects_max_findings():
    stats = StatsEngine()
    segments = [_platform_segment(f"CVR_{i}", 0.9) for i in range(3)]
    findings = SegmentAnalyzer(stats).run(
        segments, 0.05, ExperimentContext(max_segment_findings=2)
    )
    assert len(findings) == 2


def test_segment_evidence_conflict_case_is_not_contradictory():
    # 原始显著但 BH 校正后不显著：证据不得出现“显著提升”，必须标注校正后不显著。
    stats = StatsEngine()
    segments = [
        _platform_segment("CVR_A", 0.02, delta=0.02),
        _platform_segment("CVR_B", 0.04, delta=0.01),
        _platform_segment("CVR_C", 0.10, delta=0.005),
    ]
    findings = SegmentAnalyzer(stats).run(segments, 0.05)
    evidence_a = findings[0].evidence
    assert "显著提升" not in evidence_a
    assert "校正后不显著" in evidence_a
    assert "p=0.0200" in evidence_a
    assert "探索性线索" in evidence_a


def test_segment_evidence_corrected_significant_keeps_interpretation():
    # m=2 前缀惊奇例：0.04 经 BH 仍显著，证据保留解释并标注校正后显著。
    stats = StatsEngine()
    segments = [
        _platform_segment("CVR_A", 0.03, delta=0.02),
        _platform_segment("CVR_B", 0.04, delta=0.01),
    ]
    findings = SegmentAnalyzer(stats).run(segments, 0.05)
    assert all("校正后显著" in item.evidence for item in findings)
    assert any("显著提升" in item.evidence for item in findings)


def test_segment_evidence_none_p_renders_na():
    stats = StatsEngine()
    segments = [_platform_segment("CVR_平台", None)]
    findings = SegmentAnalyzer(stats).run(segments, 0.05)
    assert "p=NA" in findings[0].evidence
    assert "None" not in findings[0].evidence


def test_segment_sort_puts_corrected_significant_first():
    stats = StatsEngine()
    segments = [
        _platform_segment("CVR_不显著", 0.40, delta=0.03),
        _platform_segment("CVR_强", 0.02, delta=0.02),
        _platform_segment("CVR_弱", 0.03, delta=0.01),
    ]
    findings = SegmentAnalyzer(stats).run(segments, 0.05)
    assert findings[0].label == "CVR_强 分群发现"
    assert findings[-1].label == "CVR_不显著 分群发现"


# ---------------------------------------------------------------------------
# QualityChecker 阈值参数化
# ---------------------------------------------------------------------------


def _metric(control_n: int, treatment_n: int) -> MetricInput:
    return MetricInput(name="CVR", kind="conversion", control_n=control_n, treatment_n=treatment_n)


def _request(metric: MetricInput | None, context: ExperimentContext) -> ExperimentRequest:
    return ExperimentRequest(
        question="q", context=context, metrics=[metric] if metric else []
    )


def test_srm_threshold_uses_context_srm_alpha():
    checker = QualityChecker()
    # n=80/120 → chi2=8.0 → p≈0.00468，落在默认 0.001 与 0.05 之间。
    metric = _metric(80, 120)
    default_names = [item.name for item in checker.run(_request(metric, ExperimentContext()))]
    assert "SRM 风险" not in default_names
    strict_names = [item.name for item in checker.run(
        _request(metric, ExperimentContext(srm_alpha=0.05))
    )]
    assert "SRM 风险" in strict_names


def test_small_sample_threshold_uses_context_min_sample_size():
    checker = QualityChecker()
    metric = _metric(150, 150)
    default_names = [item.name for item in checker.run(_request(metric, ExperimentContext()))]
    assert "样本量偏小" in default_names
    relaxed_names = [item.name for item in checker.run(
        _request(metric, ExperimentContext(min_sample_size=100))
    )]
    assert "样本量偏小" not in relaxed_names


def test_duration_threshold_uses_context_min_experiment_days():
    checker = QualityChecker()
    context_default = ExperimentContext(start_date="2026-01-01", end_date="2026-01-03")
    default_names = [item.name for item in checker.run(_request(None, context_default))]
    assert "实验时长偏短" in default_names
    context_relaxed = ExperimentContext(
        start_date="2026-01-01", end_date="2026-01-03", min_experiment_days=3
    )
    relaxed_names = [item.name for item in checker.run(_request(None, context_relaxed))]
    assert "实验时长偏短" not in relaxed_names
