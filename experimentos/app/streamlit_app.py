import streamlit as st
import json
from pathlib import Path
from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.models import ExperimentRequest

# 示例文件路径
EXAMPLES = {
    "Product Detail Release": "examples/product_detail_release.json",
    "Segment Analysis (E003)": "evals/cases/E003_segment.json"
}

def load_example(example_path):
    """加载 JSON 示例文件"""
    with open(example_path, "r") as f:
        return json.load(f)

# 初始化 Orchestrator
orchestrator = ExperimentOrchestrator()

# Streamlit 页面布局
st.title("A/B Experiment Analysis Agent Demo")

# 选择示例文件
example_name = st.selectbox("选择一个示例", list(EXAMPLES.keys()))
example_path = EXAMPLES[example_name]

# 加载并展示示例内容
example_data = load_example(example_path)
st.subheader("示例数据")
st.json(example_data)

# 点击按钮运行分析
if st.button("运行分析"):
    st.write("正在运行分析，请稍候...")
    try:
        # 构造 ExperimentRequest
        experiment_request = ExperimentRequest(**example_data["input"])

        # 调用 Orchestrator 执行分析
        result = orchestrator.run(experiment_request)

        # 展示 Agent Plan
        st.subheader("Agent Plan")
        st.json(result.plan.dict() if result.plan else {})

        # 展示 Execution Trace
        st.subheader("Execution Trace")
        st.json([trace.dict() for trace in result.traces] if result.traces else [])

        # 展示 Tool Calls
        st.subheader("Tool Calls")
        st.json([tool_call.dict() for tool_call in result.tool_calls] if result.tool_calls else [])

        # 展示 Metric Results
        st.subheader("Metric Results")
        st.json([metric.dict() for metric in result.metric_results] if result.metric_results else [])

        # 展示 Segment Diagnosis
        st.subheader("Segment Diagnosis")
        st.json([segment.dict() for segment in result.segment_diagnosis] if result.segment_diagnosis else [])

        # 展示 Release Recommendation
        st.subheader("Release Recommendation")
        st.json(result.release_recommendation.dict() if result.release_recommendation else {})

        # 展示 Final AI Summary
        st.subheader("Final AI Summary")
        st.json(result.ai_summary.dict() if result.ai_summary else {})

    except Exception as e:
        st.error(f"分析失败: {e}")
        st.write("异常详情：", str(e))