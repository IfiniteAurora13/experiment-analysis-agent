from __future__ import annotations

from experimentos.models import MetricResult


class ResultValidator:
    """Checks internal consistency before a result is used for conclusions."""

    def validate(self, metrics: list[MetricResult]) -> list[str]:
        warnings: list[str] = []
        for metric in metrics:
            if metric.control_n <= 0 or metric.treatment_n <= 0:
                warnings.append(f"{metric.metric_name} 缺少有效样本量，不能可靠解读。")
            if metric.p_value is not None and not 0 <= metric.p_value <= 1:
                warnings.append(f"{metric.metric_name} 的 p-value 超出 [0, 1]。")
            if metric.ci_low is not None and metric.ci_high is not None:
                if metric.ci_low > metric.ci_high:
                    warnings.append(f"{metric.metric_name} 的置信区间上下界顺序异常。")
                interval_excludes_zero = metric.ci_low > 0 or metric.ci_high < 0
                if metric.p_value is not None and metric.significant != interval_excludes_zero:
                    warnings.append(
                        f"{metric.metric_name} 的显著性与置信区间不一致，需核对统计口径。"
                    )
            if not metric.statistical_method:
                warnings.append(f"{metric.metric_name} 未标注统计方法。")
        return warnings
