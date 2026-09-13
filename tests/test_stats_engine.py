from __future__ import annotations

from experimentos.models import MetricInput
from experimentos.tools.stats_engine import StatsEngine


def test_conversion_result_has_auditable_test_metadata():
    result = StatsEngine().analyze_metrics(
        [
            MetricInput(
                name="CTR",
                kind="conversion",
                control_n=10_000,
                treatment_n=10_000,
                control_successes=1_000,
                treatment_successes=1_200,
            )
        ],
        alpha=0.05,
    )[0]

    assert result.metric_name == "CTR"
    assert result.control_value == 0.1
    assert result.treatment_value == 0.12
    assert result.control_n == result.treatment_n == 10_000
    assert result.p_value is not None and result.p_value < 0.05
    assert result.ci_low is not None and result.ci_high is not None
    assert result.ci_low > 0
    assert result.statistical_method.startswith("two_proportion_z_test")


def test_continuous_result_uses_welch_test_and_confidence_interval():
    result = StatsEngine().analyze_metrics(
        [
            MetricInput(
                name="Revenue per user",
                kind="continuous",
                control_n=100,
                treatment_n=90,
                control_value=10.0,
                treatment_value=11.0,
                control_var=4.0,
                treatment_var=9.0,
            )
        ],
        alpha=0.05,
    )[0]

    assert result.metric_kind == "continuous"
    assert result.delta_abs == 1.0
    assert result.p_value is not None and result.p_value < 0.05
    assert result.ci_low is not None and result.ci_high is not None
    assert result.ci_low < result.delta_abs < result.ci_high
    assert result.statistical_method.startswith("welch_t_test")


def test_invalid_conversion_counts_are_rejected():
    metric = MetricInput(
        name="CTR",
        kind="conversion",
        control_n=10,
        treatment_n=10,
        control_successes=11,
        treatment_successes=2,
    )

    try:
        StatsEngine().analyze_metrics([metric], alpha=0.05)
    except ValueError as exc:
        assert "control_successes" in str(exc)
    else:
        raise AssertionError("invalid conversion inputs must fail")
