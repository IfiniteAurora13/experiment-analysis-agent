from __future__ import annotations

from experimentos.models import MetricInput, MetricSpec, SegmentMetricInput, SegmentMetricSpec
from experimentos.tools.sql_runner import SqlRunner


class MetricBuilder:
    def __init__(self, runner: SqlRunner) -> None:
        self.runner = runner

    def build_metrics(self, specs: list[MetricSpec]) -> list[MetricInput]:
        metrics: list[MetricInput] = []
        for spec in specs:
            result = self.runner.execute(spec.sql)
            if not result.rows:
                continue
            row = result.rows[0]
            metrics.append(
                MetricInput(
                    name=spec.name,
                    kind=spec.kind,
                    role=spec.role,
                    direction=spec.direction,
                    unit=spec.unit,
                    control_n=int(row["control_n"]),
                    treatment_n=int(row["treatment_n"]),
                    control_value=self._maybe_float(row.get("control_value")),
                    treatment_value=self._maybe_float(row.get("treatment_value")),
                    control_var=self._maybe_float(row.get("control_var")),
                    treatment_var=self._maybe_float(row.get("treatment_var")),
                    control_successes=self._maybe_int(row.get("control_successes")),
                    treatment_successes=self._maybe_int(row.get("treatment_successes")),
                )
            )
        return metrics

    def build_segments(self, specs: list[SegmentMetricSpec]) -> list[SegmentMetricInput]:
        segments: list[SegmentMetricInput] = []
        for spec in specs:
            result = self.runner.execute(spec.sql)
            for row in result.rows:
                segments.append(
                    SegmentMetricInput(
                        name=spec.name,
                        kind=spec.kind,
                        role=spec.role,
                        direction=spec.direction,
                        unit=spec.unit,
                        segment_name=spec.segment_name,
                        segment_value=str(row["segment_value"]),
                        control_n=int(row["control_n"]),
                        treatment_n=int(row["treatment_n"]),
                        control_value=self._maybe_float(row.get("control_value")),
                        treatment_value=self._maybe_float(row.get("treatment_value")),
                        control_var=self._maybe_float(row.get("control_var")),
                        treatment_var=self._maybe_float(row.get("treatment_var")),
                        control_successes=self._maybe_int(row.get("control_successes")),
                        treatment_successes=self._maybe_int(row.get("treatment_successes")),
                    )
                )
        return segments

    def _maybe_int(self, value):
        return None if value is None else int(value)

    def _maybe_float(self, value):
        return None if value is None else float(value)
