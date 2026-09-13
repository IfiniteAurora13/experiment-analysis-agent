from __future__ import annotations

from pathlib import Path

import yaml

from experimentos.models import MetricSpec, SegmentMetricSpec


class MetricRegistry:
    def load_metric_specs(self, path: str) -> list[MetricSpec]:
        raw = yaml.safe_load(Path(path).read_text(encoding="utf-8")) or []
        return [MetricSpec(**item) for item in raw]

    def load_segment_specs(self, path: str) -> list[SegmentMetricSpec]:
        raw = yaml.safe_load(Path(path).read_text(encoding="utf-8")) or []
        return [SegmentMetricSpec(**item) for item in raw]
