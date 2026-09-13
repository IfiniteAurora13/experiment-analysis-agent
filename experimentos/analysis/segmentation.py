from __future__ import annotations

from experimentos.models import Finding, SegmentMetricInput
from experimentos.tools.stats_engine import StatsEngine


class SegmentAnalyzer:
    def __init__(self, stats: StatsEngine) -> None:
        self.stats = stats

    def run(self, segments: list[SegmentMetricInput], alpha: float) -> list[Finding]:
        findings: list[Finding] = []
        analyzed = self.stats.analyze_metrics(list(segments), alpha)
        # StatsEngine preserves input ordering. Pairing directly keeps segment
        # dimensions unambiguous even when different dimensions share values.
        filtered = [
            result
            for segment, result in zip(segments, analyzed, strict=True)
            if min(segment.control_n, segment.treatment_n) >= 100
        ]

        filtered.sort(key=lambda item: (not item.significant, -abs(item.delta_abs)))
        for item in filtered[:5]:
            findings.append(
                Finding(
                    label=f"{item.name} 分群发现",
                    evidence=f"{item.notes}，{item.interpretation}",
                    strength="待验证假设",
                )
            )
        return findings
