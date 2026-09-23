"""Streamlit demo for ExperimentOS.

Runs the real orchestrator against local example / eval-case payloads and
renders the structured report, execution traces and raw JSON.
"""

from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path

import streamlit as st

from experimentos.agent.llm_client import LlmClient, LlmConfig
from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.app.cli import DEFAULT_MOCK_PLAN
from experimentos.models import ExperimentRequest

ROOT = Path(__file__).resolve().parent.parent.parent

EXAMPLES = {
    "Product Detail Release (example)": ROOT / "examples" / "product_detail_release.json",
    "Segment Analysis E003 (eval wrapper)": ROOT / "evals" / "cases" / "E003_segment.json",
    "Needs Context": ROOT / "examples" / "needs_context.json",
}


def load_request_payload(path: Path) -> dict:
    """Accept both direct request payloads and eval-case wrappers."""
    payload = json.loads(path.read_text(encoding="utf-8"))
    if (
        isinstance(payload, dict)
        and isinstance(payload.get("input"), dict)
        and "question" in payload["input"]
    ):
        return payload["input"]
    return payload


@st.cache_resource
def build_orchestrator(use_mock_llm: bool) -> ExperimentOrchestrator:
    if not use_mock_llm:
        return ExperimentOrchestrator()
    canned = json.dumps(DEFAULT_MOCK_PLAN, ensure_ascii=False)
    return ExperimentOrchestrator(
        llm_client=LlmClient(config=LlmConfig(provider="mock"), canned=canned)
    )


st.set_page_config(page_title="ExperimentOS Demo", layout="wide")
st.title("A/B Experiment Analysis Agent Demo")

example_name = st.selectbox("选择一个示例", list(EXAMPLES))
payload = load_request_payload(EXAMPLES[example_name])

with st.sidebar:
    use_mock_llm = st.checkbox("使用 mock LLM（离线模式）", value=False)
    st.caption("LLM 仅用于意图路由 / 规划 / 叙述，统计计算始终由确定性工具完成。")

st.subheader("示例数据")
st.json(payload)

if st.button("运行分析"):
    try:
        request = ExperimentRequest.from_dict(payload)
    except Exception as exc:
        st.error(f"输入解析失败：{exc}")
        st.stop()

    orchestrator = build_orchestrator(use_mock_llm)
    try:
        report = orchestrator.run(request)
    except Exception as exc:
        st.exception(exc)
        st.stop()

    st.subheader("分析状态")
    st.markdown(
        f"- 状态：{report.status} | 任务类型：{report.task_type} | "
        f"已执行 skill：{', '.join(report.selected_skills) or '（无）'}"
    )
    for warning in report.warnings:
        st.warning(warning)

    st.subheader("分析报告")
    st.markdown(orchestrator.render_markdown(report))

    with st.expander("Agent Plan"):
        st.json([asdict(step) for step in report.plan])

    with st.expander("Workflow Trace"):
        st.dataframe(
            [
                {
                    "stage": event.stage,
                    "status": event.status,
                    "detail": json.dumps(event.detail, ensure_ascii=False),
                }
                for event in report.workflow_trace
            ]
        )

    with st.expander("Tool Calls"):
        st.dataframe(
            [
                {
                    "tool_name": trace.tool_name,
                    "status": trace.status,
                    "latency_ms": trace.latency_ms,
                    "error": trace.error,
                    "input": json.dumps(trace.input, ensure_ascii=False),
                    "output": json.dumps(trace.output, ensure_ascii=False),
                }
                for trace in report.agent_trace
            ]
        )

    with st.expander("完整报告 JSON"):
        st.json(report.to_dict())
