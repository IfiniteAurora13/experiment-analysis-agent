from __future__ import annotations

from experimentos.models import ExperimentContext, Finding, SegmentMetricInput
from experimentos.tools.stats_engine import StatsEngine


def benjamini_hochberg(
    p_values: list[float | None], alpha: float
) -> tuple[list[float | None], list[bool]]:
    """Benjamini-Hochberg FDR correction.

    Standard BH procedure: with p_(i) sorted ascending, reject the prefix
    1..k where k = max{i : p_(i) <= i*alpha/m}. The satisfying ranks are not
    themselves a prefix, so k is a maximum, not a first-failure scan.

    Returns (adjusted p-values, rejected flags) in the ORIGINAL input order.
    None p-values count toward m, sort last, are never rejected, and keep an
    adjusted p-value of None.
    """
    m = len(p_values)
    if m == 0:
        return [], []

    order = sorted(range(m), key=lambda i: (p_values[i] is None, p_values[i]))
    k = max(
        (
            rank
            for rank, idx in enumerate(order, start=1)
            if p_values[idx] is not None and p_values[idx] <= rank * alpha / m
        ),
        default=0,
    )

    # Adjusted p: min over non-None ranks j >= rank(i) of p_(j) * m / j.
    adjusted: list[float | None] = [None] * m
    running_min = float("inf")
    for rank, idx in reversed(list(enumerate(order, start=1))):
        if p_values[idx] is None:
            continue
        running_min = min(running_min, p_values[idx] * m / rank)
        adjusted[idx] = min(running_min, 1.0)

    rejected = [idx in set(order[:k]) for idx in range(m)]
    return adjusted, rejected


class SegmentAnalyzer:
    def __init__(self, stats: StatsEngine) -> None:
        self.stats = stats

    def run(
        self,
        segments: list[SegmentMetricInput],
        alpha: float,
        context: ExperimentContext | None = None,
    ) -> list[Finding]:
        context = context or ExperimentContext()
        analyzed = self.stats.analyze_metrics(list(segments), alpha)

        # Correct over ALL segments tested, before any display filter —
        # filtering first would inflate significance by shrinking m.
        adjusted, rejected = benjamini_hochberg(
            [result.p_value for result in analyzed], alpha
        )

        # StatsEngine preserves input ordering. Pairing directly keeps segment
        # dimensions unambiguous even when different dimensions share values.
        filtered = [
            (segment, result, adj_p, adj_sig)
            for segment, result, adj_p, adj_sig in zip(segments, analyzed, adjusted, rejected, strict=True)
            if min(segment.control_n, segment.treatment_n) >= context.segment_min_n
        ]

        filtered.sort(key=lambda item: (not item[3], -abs(item[1].delta_abs)))
        findings: list[Finding] = []
        for segment, result, adj_p, adj_sig in filtered[: context.max_segment_findings]:
            findings.append(
                Finding(
                    label=f"{result.name} 分群发现",
                    evidence=self._build_evidence(result, adj_p, adj_sig),
                    strength="待验证假设",
                )
            )
        return findings

    @staticmethod
    def _build_evidence(result, adjusted_p: float | None, adjusted_significant: bool) -> str:
        """Evidence is anchored on the corrected status so a raw-significant
        but corrected-insignificant result never reads as contradictory."""
        notes = result.notes
        raw_p = f"{result.p_value:.4f}" if result.p_value is not None else "NA"
        adj_p = f"{adjusted_p:.4f}" if adjusted_p is not None else "NA"
        if adjusted_significant:
            return (
                f"{notes}，{result.interpretation}；"
                f"p={raw_p}，BH-FDR 校正 p={adj_p}，校正后显著"
            )
        if result.significant:
            return (
                f"{notes}，原始检验显著（p={raw_p}）但 BH-FDR 校正后不显著"
                f"（校正 p={adj_p}），仅作探索性线索"
            )
        return f"{notes}，{result.interpretation}；p={raw_p}，BH-FDR 校正后不显著"
