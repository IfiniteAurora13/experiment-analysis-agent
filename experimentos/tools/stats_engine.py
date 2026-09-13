from __future__ import annotations

from math import isclose, sqrt

from scipy import stats

from experimentos.models import MetricInput, MetricResult, SegmentMetricInput


class StatsEngine:
    """Deterministic statistical computations used by every data provider."""
    def analyze_metrics(self, metrics: list[MetricInput | SegmentMetricInput], alpha: float) -> list[MetricResult]:
        results: list[MetricResult] = []
        for metric in metrics:
            if metric.statistical_source == "libra_platform":
                result = self._analyze_platform_metric(metric, alpha)
            elif metric.kind == "conversion":
                result = self._analyze_conversion(metric, alpha)
            elif metric.kind == "continuous":
                result = self._analyze_continuous(metric, alpha)
            else:
                continue
            if isinstance(metric, SegmentMetricInput):
                result.notes = f"{metric.segment_name}={metric.segment_value}"
            results.append(result)
        return results

    def _analyze_platform_metric(self, metric: MetricInput, alpha: float) -> MetricResult:
        if metric.control_value is None or metric.treatment_value is None:
            raise ValueError(f"{metric.name} 缺少平台汇总统计所需的均值。")

        delta_abs = metric.treatment_value - metric.control_value
        delta_rel = delta_abs / metric.control_value if metric.control_value else None
        p_value = metric.platform_p_value
        ci_low = metric.platform_ci_low
        ci_high = metric.platform_ci_high
        significant = (
            metric.platform_significant
            if metric.platform_significant is not None
            else (p_value < alpha if p_value is not None else False)
        )
        interpretation = self._interpret(metric, delta_abs, significant)

        return MetricResult(
            metric_name=metric.name,
            metric_kind=metric.kind,
            metric_role=metric.role,
            direction=metric.direction,
            control_n=metric.control_n,
            treatment_n=metric.treatment_n,
            control_value=metric.control_value,
            treatment_value=metric.treatment_value,
            delta_abs=delta_abs,
            delta_rel=delta_rel,
            p_value=p_value,
            ci_low=ci_low,
            ci_high=ci_high,
            significant=significant,
            statistical_method="platform_reported",
            interpretation=interpretation,
            statistical_source=metric.statistical_source,
            source_summary=metric.platform_summary,
        )

    def _analyze_conversion(self, metric: MetricInput, alpha: float) -> MetricResult:
        if metric.control_successes is None or metric.treatment_successes is None:
            raise ValueError(f"{metric.name} 缺少 conversion 所需的 successes。")
        self._validate_binomial_input(metric)
        control_rate = metric.control_successes / metric.control_n
        treatment_rate = metric.treatment_successes / metric.treatment_n
        delta_abs = treatment_rate - control_rate
        delta_rel = delta_abs / control_rate if control_rate else None

        pooled = (metric.control_successes + metric.treatment_successes) / (metric.control_n + metric.treatment_n)
        pooled_se = sqrt(max(pooled * (1 - pooled) * (1 / metric.control_n + 1 / metric.treatment_n), 1e-12))
        z = delta_abs / pooled_se
        p_value = float(2 * stats.norm.sf(abs(z)))

        se = sqrt(
            max(control_rate * (1 - control_rate) / metric.control_n, 0) +
            max(treatment_rate * (1 - treatment_rate) / metric.treatment_n, 0)
        )
        z_crit = float(stats.norm.ppf(1 - alpha / 2))
        ci_low = delta_abs - z_crit * se
        ci_high = delta_abs + z_crit * se
        significant = p_value < alpha
        interpretation = self._interpret(metric, delta_abs, significant)

        return MetricResult(
            metric_name=metric.name,
            metric_kind=metric.kind,
            metric_role=metric.role,
            direction=metric.direction,
            control_n=metric.control_n,
            treatment_n=metric.treatment_n,
            control_value=control_rate,
            treatment_value=treatment_rate,
            delta_abs=delta_abs,
            delta_rel=delta_rel,
            p_value=p_value,
            ci_low=ci_low,
            ci_high=ci_high,
            significant=significant,
            statistical_method="two_proportion_z_test_pooled; wald_ci_unpooled",
            interpretation=interpretation,
            statistical_source=metric.statistical_source,
        )

    def _analyze_continuous(self, metric: MetricInput, alpha: float) -> MetricResult:
        if metric.control_value is None or metric.treatment_value is None:
            raise ValueError(f"{metric.name} 缺少 continuous 所需的均值。")
        if metric.control_var is None or metric.treatment_var is None:
            raise ValueError(f"{metric.name} 缺少 continuous 所需的方差。")

        self._validate_continuous_input(metric)
        delta_abs = metric.treatment_value - metric.control_value
        delta_rel = delta_abs / metric.control_value if metric.control_value else None
        se = sqrt(metric.control_var / metric.control_n + metric.treatment_var / metric.treatment_n)
        degrees_of_freedom = self._welch_degrees_of_freedom(metric)
        if isclose(se, 0.0):
            p_value = 1.0 if isclose(delta_abs, 0.0) else 0.0
            ci_low = delta_abs
            ci_high = delta_abs
        else:
            t_stat = delta_abs / se
            p_value = float(2 * stats.t.sf(abs(t_stat), degrees_of_freedom))
            t_crit = float(stats.t.ppf(1 - alpha / 2, degrees_of_freedom))
            ci_low = delta_abs - t_crit * se
            ci_high = delta_abs + t_crit * se
        significant = p_value < alpha
        interpretation = self._interpret(metric, delta_abs, significant)

        return MetricResult(
            metric_name=metric.name,
            metric_kind=metric.kind,
            metric_role=metric.role,
            direction=metric.direction,
            control_n=metric.control_n,
            treatment_n=metric.treatment_n,
            control_value=metric.control_value,
            treatment_value=metric.treatment_value,
            delta_abs=delta_abs,
            delta_rel=delta_rel,
            p_value=p_value,
            ci_low=ci_low,
            ci_high=ci_high,
            significant=significant,
            statistical_method=f"welch_t_test; df={degrees_of_freedom:.2f}",
            interpretation=interpretation,
            statistical_source=metric.statistical_source,
        )

    def _interpret(self, metric: MetricInput, delta_abs: float, significant: bool) -> str:
        if not significant:
            return "统计上未达到显著，当前更适合表述为未形成足够证据。"
        if metric.direction == "increase" and delta_abs > 0:
            return "实验组相对对照组显著提升。"
        if metric.direction == "decrease" and delta_abs < 0:
            return "实验组相对对照组显著下降，且方向符合预期。"
        return "实验组出现显著变化，但方向不符合预期。"

    def _validate_binomial_input(self, metric: MetricInput) -> None:
        if metric.control_n <= 0 or metric.treatment_n <= 0:
            raise ValueError(f"{metric.name} 的 conversion 样本量必须大于 0。")
        if not 0 <= metric.control_successes <= metric.control_n:
            raise ValueError(f"{metric.name} 的 control_successes 必须介于 0 和 control_n 之间。")
        if not 0 <= metric.treatment_successes <= metric.treatment_n:
            raise ValueError(f"{metric.name} 的 treatment_successes 必须介于 0 和 treatment_n 之间。")

    def _validate_continuous_input(self, metric: MetricInput) -> None:
        if metric.control_n < 2 or metric.treatment_n < 2:
            raise ValueError(f"{metric.name} 的连续指标 Welch t-test 要求每组至少 2 个样本。")
        if metric.control_var is None or metric.treatment_var is None:
            raise ValueError(f"{metric.name} 缺少 continuous 所需的方差。")
        if metric.control_var < 0 or metric.treatment_var < 0:
            raise ValueError(f"{metric.name} 的方差不能为负数。")

    def _welch_degrees_of_freedom(self, metric: MetricInput) -> float:
        assert metric.control_var is not None and metric.treatment_var is not None
        control_term = metric.control_var / metric.control_n
        treatment_term = metric.treatment_var / metric.treatment_n
        numerator = (control_term + treatment_term) ** 2
        denominator = (
            control_term**2 / (metric.control_n - 1)
            + treatment_term**2 / (metric.treatment_n - 1)
        )
        return float("inf") if isclose(denominator, 0.0) else numerator / denominator
