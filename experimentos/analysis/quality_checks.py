from __future__ import annotations

from datetime import date
from math import erfc, sqrt

from experimentos.models import ExperimentRequest, QualityIssue


class QualityChecker:
    def run(self, request: ExperimentRequest) -> list[QualityIssue]:
        issues: list[QualityIssue] = []
        issues.extend(self._check_srm(request))
        issues.extend(self._check_duration(request))
        issues.extend(self._check_small_sample(request))
        return issues

    def _check_srm(self, request: ExperimentRequest) -> list[QualityIssue]:
        for metric in request.metrics:
            if not metric.control_n or not metric.treatment_n:
                continue

            total = metric.control_n + metric.treatment_n
            expected_control = total * request.context.expected_control_ratio
            expected_treatment = total - expected_control
            if expected_control <= 0 or expected_treatment <= 0:
                continue

            chi_square = (
                (metric.control_n - expected_control) ** 2 / expected_control +
                (metric.treatment_n - expected_treatment) ** 2 / expected_treatment
            )
            p_value = erfc(sqrt(chi_square / 2.0))
            if p_value < 0.001:
                return [
                    QualityIssue(
                        name="SRM 风险",
                        severity="high",
                        impact=(
                            f"样本分流与预期不一致，control={metric.control_n}，"
                            f"treatment={metric.treatment_n}，SRM p={p_value:.6f}。"
                        ),
                        recommendation="先排查分流、曝光日志和实验配置，再决定是否继续解读效果。",
                    )
                ]
        return []

    def _check_duration(self, request: ExperimentRequest) -> list[QualityIssue]:
        if not request.context.start_date or not request.context.end_date:
            return []
        start = date.fromisoformat(request.context.start_date)
        end = date.fromisoformat(request.context.end_date)
        days = (end - start).days + 1
        if days < 7:
            return [
                QualityIssue(
                    name="实验时长偏短",
                    severity="medium",
                    impact=f"当前实验仅运行 {days} 天，可能尚未覆盖周内波动。",
                    recommendation="补足实验周期后再做最终业务结论。",
                )
            ]
        return []

    def _check_small_sample(self, request: ExperimentRequest) -> list[QualityIssue]:
        low_sample_metrics = [
            metric.name for metric in request.metrics
            if metric.control_n and metric.treatment_n and min(metric.control_n, metric.treatment_n) < 200
        ]
        if not low_sample_metrics:
            return []
        return [
            QualityIssue(
                name="样本量偏小",
                severity="medium",
                impact=f"以下指标的组内样本量偏小：{', '.join(low_sample_metrics)}。",
                recommendation="谨慎解释不显著结果，必要时补样本或补功效分析。",
            )
        ]
