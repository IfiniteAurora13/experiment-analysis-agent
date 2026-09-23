from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from time import perf_counter
from typing import Any

from experimentos.models import ExperimentState, ToolTrace


class ToolBudgetExhausted(RuntimeError):
    """Raised when the tool-call budget is exhausted before a tool runs.

    Subclasses RuntimeError so the executor can distinguish budget
    exhaustion from real skill errors without string matching.
    """


@dataclass(frozen=True)
class ToolMetadata:
    """A small, inspectable contract for one deterministic capability."""

    name: str
    description: str
    input_schema: dict[str, str]
    output_schema: dict[str, str]


ToolHandler = Callable[..., Any]


class ToolRegistry:
    """Registers deterministic tools and records bounded, sanitised traces."""

    def __init__(self) -> None:
        self._tools: dict[str, tuple[ToolMetadata, ToolHandler]] = {}

    def register(self, metadata: ToolMetadata, handler: ToolHandler) -> None:
        if metadata.name in self._tools:
            raise ValueError(f"重复注册 tool: {metadata.name}")
        self._tools[metadata.name] = (metadata, handler)

    def metadata(self) -> list[ToolMetadata]:
        return [item[0] for item in self._tools.values()]

    def has(self, name: str) -> bool:
        return name in self._tools

    def invoke(self, name: str, state: ExperimentState, **kwargs: Any) -> Any:
        if name not in self._tools:
            raise KeyError(f"未注册 tool: {name}")
        if len(state.tool_calls) >= state.max_tool_calls:
            raise ToolBudgetExhausted(f"已达到最大 tool call 数 {state.max_tool_calls}，停止继续执行。")

        _, handler = self._tools[name]
        started_at = perf_counter()
        try:
            result = handler(**kwargs)
        except Exception as exc:
            state.tool_calls.append(
                ToolTrace(
                    tool_name=name,
                    input=_summarise(kwargs),
                    output={"error_type": type(exc).__name__},
                    status="error",
                    latency_ms=round((perf_counter() - started_at) * 1000, 2),
                    error=type(exc).__name__,
                )
            )
            raise

        state.tool_calls.append(
            ToolTrace(
                tool_name=name,
                input=_summarise(kwargs),
                output=_summarise(result),
                status="ok",
                latency_ms=round((perf_counter() - started_at) * 1000, 2),
            )
        )
        return result


def _summarise(value: Any) -> dict[str, Any]:
    """Keep traces useful for debugging without persisting raw data payloads."""

    if isinstance(value, dict):
        return {str(key): _summary_value(item) for key, item in value.items()}
    return {"summary": _summary_value(value)}


def _summary_value(value: Any) -> Any:
    if value is None or isinstance(value, (bool, int, float)):
        return value
    if isinstance(value, str):
        return value[:200]
    if isinstance(value, (list, tuple, set)):
        return {"type": type(value).__name__, "count": len(value)}
    if isinstance(value, dict):
        return {"type": "dict", "keys": sorted(str(key) for key in value)[:20]}
    return {"type": type(value).__name__}
