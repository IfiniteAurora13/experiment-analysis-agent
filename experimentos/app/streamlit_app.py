"""Polished Streamlit workspace for the real ExperimentOS orchestrator."""

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
    "商品详情页发布决策": ROOT / "examples" / "product_detail_release.json",
    "基础实验复盘": ROOT / "examples" / "basic_recap.json",
    "SRM 质量风险": ROOT / "examples" / "quality_srm.json",
    "分群诊断": ROOT / "examples" / "segment_diagnosis.json",
    "缺少上下文": ROOT / "examples" / "needs_context.json",
}


def load_request_payload(path: Path) -> dict:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict) and isinstance(payload.get("input"), dict) and "question" in payload["input"]:
        return payload["input"]
    return payload


@st.cache_resource
def build_orchestrator(use_mock_llm: bool) -> ExperimentOrchestrator:
    if not use_mock_llm:
        return ExperimentOrchestrator()
    canned = json.dumps(DEFAULT_MOCK_PLAN, ensure_ascii=False)
    return ExperimentOrchestrator(llm_client=LlmClient(config=LlmConfig(provider="mock"), canned=canned))


def inject_theme() -> None:
    st.markdown("""
    <style>
      .stApp{background:radial-gradient(circle at 8% 0%,#17264a 0,transparent 30%),#090d18;color:#f5f7fb}
      [data-testid="stHeader"]{background:transparent}.block-container{max-width:1240px;padding-top:2rem}
      h1,h2,h3{letter-spacing:-.035em}.hero{padding:1.2rem 0 1.8rem}.hero small{color:#5eead4;letter-spacing:.18em;font-weight:700}
      .hero h1{font-size:3.4rem;margin:.55rem 0}.hero p{color:#9ca7bc;font-size:1.05rem;max-width:720px}
      [data-testid="stSidebar"]{background:#0d1322;border-right:1px solid #20283a}
      [data-testid="stMetric"]{background:#111827;border:1px solid #253047;padding:1rem;border-radius:14px}
      [data-testid="stMetricValue"]{font-size:1.65rem}.stButton>button{border:0;border-radius:10px;background:linear-gradient(110deg,#5eead4,#70a7ff);color:#071019;font-weight:800}
      div[data-testid="stExpander"]{border:1px solid #253047;border-radius:12px;background:#0e1525}
      .status{display:inline-flex;padding:.35rem .65rem;border-radius:99px;background:#182337;color:#b9c6dc;font:600 .72rem monospace}
      .trust{border-left:2px solid #5eead4;padding:.55rem 1rem;color:#9ca7bc;background:#0e1726;border-radius:0 8px 8px 0}
    </style>""", unsafe_allow_html=True)


st.set_page_config(page_title="ExperimentOS · Analysis Workspace", page_icon="◈", layout="wide")
inject_theme()
st.markdown('<div class="hero"><small>EXPERIMENT INTELLIGENCE / WORKSPACE</small><h1>ExperimentOS</h1><p>可审计的 A/B 实验分析工作台。模型负责理解，确定性组件负责统计、校验与护栏。</p></div>', unsafe_allow_html=True)

with st.sidebar:
    st.markdown("### ◈ Analysis setup")
    example_name = st.selectbox("实验场景", list(EXAMPLES))
    use_mock_llm = st.toggle("启用 Mock LLM 规划", value=False)
    st.caption("离线模式；不会发送真实数据。统计计算始终由确定性工具完成。")
    st.divider()
    st.markdown("**Safety boundary**")
    st.caption("✓ Quality checks  ·  ✓ Statistical validation  ·  ✓ Release guardrails")

payload = load_request_payload(EXAMPLES[example_name])
input_tab, json_tab = st.tabs(["表单概览", "JSON 输入"])
with input_tab:
    st.markdown(f"#### {payload.get('question', '实验分析')}")
    context = payload.get("context", {})
    a, b, c, d = st.columns(4)
    a.metric("对照组", context.get("control_name", "control"))
    b.metric("实验组", context.get("treatment_name", "treatment"))
    c.metric("指标数", len(payload.get("metrics", [])))
    d.metric("α", context.get("alpha", 0.05))
    st.markdown(f'<div class="trust">目标：{context.get("objective", "待补充实验目标")}</div>', unsafe_allow_html=True)
with json_tab:
    # key 跟随示例切换，避免 text_area 残留上一个示例的编辑内容。
    edited = st.text_area(
        "可直接编辑请求 payload",
        json.dumps(payload, ensure_ascii=False, indent=2),
        height=360,
        key=f"payload_editor_{example_name}",
    )

run = st.button("运行分析  →", type="primary", width="stretch")
if run:
    try:
        active_payload = json.loads(edited)
        request = ExperimentRequest.from_dict(active_payload)
        orchestrator = build_orchestrator(use_mock_llm)
        with st.spinner("执行质量检查、统计检验与发布护栏…"):
            report = orchestrator.run(request)
    except Exception as exc:
        st.error(f"分析失败：{exc}")
        st.stop()

    st.divider()
    head, badge = st.columns([4, 1])
    head.subheader(report.summary)
    badge.markdown(f'<span class="status">{report.status}</span>', unsafe_allow_html=True)
    for warning in report.warnings:
        st.warning(warning)

    if report.metric_results:
        cols = st.columns(min(4, len(report.metric_results)))
        for col, metric in zip(cols, report.metric_results):
            delta = metric.delta_rel
            col.metric(metric.metric_name, f"{metric.treatment_value:.4g}", f"{delta:+.2%}" if delta is not None else "N/A")

    report_tab, metrics_tab, trace_tab, raw_tab = st.tabs(["结论", "指标证据", "执行轨迹", "Raw JSON"])
    with report_tab:
        st.markdown(orchestrator.render_markdown(report))
    with metrics_tab:
        if report.metric_results:
            st.dataframe([asdict(metric) for metric in report.metric_results], width="stretch", hide_index=True)
        else:
            st.info("当前请求未产出指标结果。")
    with trace_tab:
        left, right = st.columns(2)
        with left:
            st.markdown("##### Workflow")
            st.dataframe([{"stage": e.stage, "status": e.status, "detail": json.dumps(e.detail, ensure_ascii=False)} for e in report.workflow_trace], width="stretch", hide_index=True)
        with right:
            st.markdown("##### Tool calls")
            st.dataframe([{"tool": t.tool_name, "status": t.status, "latency_ms": t.latency_ms, "error": t.error} for t in report.agent_trace], width="stretch", hide_index=True)
    with raw_tab:
        st.json(report.to_dict())
