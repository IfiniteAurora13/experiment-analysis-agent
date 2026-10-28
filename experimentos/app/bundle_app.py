"""A short, resumable review flow; details stay out of the primary task."""
from __future__ import annotations

import json
import os
from pathlib import Path

import streamlit as st

from experimentos.agent.llm_client import LlmClient
from experimentos.agent.review_task import ReviewAgent, DEMO_QUESTION, DEMO_BRIEF, DEMO_DICTIONARY
from experimentos.demo_data import make_bundle
from experimentos.intake import BUNDLE_FILES

CASES = {"clean": "正常评审", "material_conflict": "口径冲突与恢复", "guardrail_harm": "护栏越界", "immature": "等待完整数据", "srm": "分流异常"}


@st.cache_data
def demo_files(scenario):
    return make_bundle("clean" if scenario == "material_conflict" else scenario)


def save_material_draft(agent, scope, field, widget_key):
    """Widget state is temporary; persist edits before a rerun can remove it."""
    agent.state["ui"]["material_drafts"][scope][field] = st.session_state[widget_key]
    agent.save()


def render_bundle_workspace():
    path = Path(os.environ.get("EXPERIMENTOS_TASK_STORE", ".review_state/task.json"))
    if "review_agent" not in st.session_state:
        try:
            st.session_state.review_agent = ReviewAgent(path)
        except (ValueError, OSError):
            st.error("本地任务记录无法读取，请保留记录并检查后重试。")
            return
    agent = st.session_state.review_agent
    ui = agent.state["ui"]
    previous_source, previous_scenario = ui.get("source"), ui.get("scenario", "clean")
    if "agent_source" not in st.session_state:
        st.session_state.agent_source = ui.get("source", "演示案例")
    source = st.radio("数据来源", ["演示案例", "本地导出包"], horizontal=True, key="agent_source")
    ui["source"] = source
    files = {}
    scenario = "clean"
    if source == "演示案例":
        names = list(CASES)
        previous = ui.get("scenario", "clean")
        if "agent_scenario" not in st.session_state:
            st.session_state.agent_scenario = previous if previous in names else "clean"
        scenario = st.selectbox("选择案例", names, format_func=CASES.get, key="agent_scenario")
        ui["scenario"] = scenario
        files = demo_files(scenario)
        st.caption("合成数据 · 离线模式可完整演示流程 · 不执行上线")
    else:
        cols = st.columns(2)
        for index, name in enumerate(BUNDLE_FILES):
            upload = cols[index % 2].file_uploader(name, type=[name.rsplit(".", 1)[1]], key=f"bundle_upload_{name}")
            if upload:
                files[name] = upload.getvalue()
        if not files:
            st.info("重新导入同一数据包可以恢复上次任务。文件在本地统计，模型只接收你填写的文本材料。")
            agent.save()
            return
    scope = source + ":" + (scenario if source == "演示案例" else "upload")
    drafts = ui.setdefault("material_drafts", {})
    if scope not in drafts:
        same_context = previous_source == source and (source != "演示案例" or previous_scenario == scenario)
        documents = agent.state.get("documents", {}) if same_context else {}
        drafts[scope] = {
            "question": agent.state.get("question", DEMO_QUESTION) if same_context else DEMO_QUESTION,
            "brief": documents.get("实验说明", DEMO_BRIEF if source == "演示案例" else ""),
            "dictionary": documents.get("指标字典", DEMO_DICTIONARY if scenario == "material_conflict" else ""),
            "use_model": False,
        }
    draft = drafts[scope]
    keys = {field: "material:" + scope + ":" + field for field in draft}
    for field, key in keys.items():
        if key not in st.session_state:
            st.session_state[key] = draft[field]
    with st.expander("问题与口径材料", expanded=scenario == "material_conflict"):
        question = st.text_input("这次要判断什么", key=keys["question"], on_change=save_material_draft,
                                 args=(agent, scope, "question", keys["question"]))
        brief = st.text_area("实验说明", key=keys["brief"], on_change=save_material_draft,
                             args=(agent, scope, "brief", keys["brief"]))
        dictionary = st.text_area("指标字典 / 补充材料", key=keys["dictionary"], on_change=save_material_draft,
                                  args=(agent, scope, "dictionary", keys["dictionary"]))
        use_model = st.toggle("使用本地环境已配置的模型辅助核对", key=keys["use_model"], on_change=save_material_draft,
                              args=(agent, scope, "use_model", keys["use_model"]))
        st.caption("材料随当前案例自动保存，刷新或重新打开后继续保留。")
        st.caption("启用后只发送上述问题和文本。每个输入版本最多调用一次；不返回自由形式的统计结论。")
    draft.update(question=question, brief=brief, dictionary=dictionary, use_model=use_model)
    assessor = None
    assessor_key = "offline"
    if use_model:
        config = LlmClient.from_env()
        if not config.config.api_key or not os.environ.get("EXPERIMENTOS_LLM_MODEL"):
            st.warning("模型尚未配置，当前使用离线规则。配置方法见 product/quickstart.md；不用在页面填写密钥。")
        else:
            assessor, assessor_key = config, "model:" + config.config.model
    agent.assessor, agent.assessor_key = assessor, assessor_key
    documents = {"实验说明": brief, "指标字典": dictionary}
    try:
        view = agent.step(files, question=question, documents=documents)
    except (ValueError, OSError):
        st.error("当前任务无法继续，请核对输入或本地记录。")
        return
    card = view["card"]
    st.divider()
    st.subheader(view["label"])
    st.write(view["message"])
    st.caption(f"接管：{view['owner']} · {view['next_action']}")
    if view["mode"] == "fallback":
        st.warning("模型调用或材料核对未通过校验，已回退离线规则；请核对原文和契约。")
    if view["pending"]:
        for claim in view["pending"]["claims"]:
            st.write(f"**{claim['source']}**：{claim['quote']}")
        with st.form(f"resolve_{view['version']}_{view['pending']['field']}"):
            by = st.text_input("核对人", "演示：数据负责人" if source == "演示案例" else "")
            checked = st.checkbox("我已核对原文，确认当前契约有效")
            submit = st.form_submit_button("确认契约，继续评审")
        if submit:
            try:
                if not checked:
                    raise ValueError("请先核对并勾选确认。")
                agent.resolve(field=view["pending"]["field"], by=by, expected_version=view["version"])
                st.rerun()
            except ValueError as exc:
                st.error(str(exc))
    elif card["status"] == "NEEDS_CONFIRMATION":
        with st.form(f"confirm_{view['version']}"):
            st.write("全部唯一入组用户为分母 · 入组后 7 天 · CNY 支付 GMV，未扣退款")
            st.caption("订单完整性水位：" + card["inspection"]["manifest"].get("orders_complete_through", "未提供"))
            by = st.text_input("数据确认人", "演示：数据负责人" if source == "演示案例" else "")
            checked = st.checkbox("我已核对口径、去重与上游完整性声明")
            submit = st.form_submit_button("确认口径并分析")
        if submit:
            try:
                if not checked:
                    raise ValueError("请先核对并勾选确认。")
                agent.confirm(files, question=question, documents=documents, by=by, expected_version=view["version"])
                st.rerun()
            except ValueError as exc:
                st.error(str(exc))
    elif card["status"] == "BLOCKED":
        for issue in card["inspection"]["issues"]:
            if issue["blocking"]:
                st.error(issue["message"])
    report = card.get("report")
    if report and not view["pending"]:
        if report["review_gate"]["status"] == "READY":
            for col, metric in zip(st.columns(2), report["metric_results"]):
                conversion = metric["metric_kind"] == "conversion"
                col.metric("支付用户转化率" if conversion else "支付 GMV / 用户",
                           f"{metric['treatment_value']:.2%}" if conversion else f"¥{metric['treatment_value']:.4f}",
                           f"{metric['delta_abs'] * 100:+.2f} 个百分点" if conversion else f"¥{metric['delta_abs']:+.4f}")
        if card["status"] == "REVIEW_READY":
            if card.get("human_review"):
                st.success("已记录本地人工复核；未执行上线。")
            else:
                with st.form("human_review"):
                    by = st.text_input("业务复核人")
                    submitted = st.form_submit_button("记录人工复核完成")
                if submitted:
                    try:
                        agent.workspace.record_human_review(snapshot=card["snapshot_id"], by=by)
                        agent.state["cache"] = None
                        agent.save()
                        st.rerun()
                    except ValueError as exc:
                        st.error(str(exc))
    if not view["pending"]:
        st.download_button("下载评审卡", view["markdown"], file_name=f"experiment-review-{view['version'][:8]}.md", mime="text/markdown")
    with st.expander("证据与任务记录"):
        st.caption(f"任务 {view['task_id'][:8]} · {view['mode']} · 已自动保存在本地；上传文件刷新后需重新导入。")
        st.dataframe(view["trace"], hide_index=True)
        st.json(card["inspection"])
        st.download_button("下载完整记录", json.dumps(view, ensure_ascii=False, indent=2), f"review-task-{view['version'][:8]}.json", mime="application/json")
    if card.get("confirmation") and not view["pending"]:
        with st.expander("撤回当前评审"):
            with st.form("withdraw_review"):
                by = st.text_input("撤回人")
                reason = st.text_input("原因")
                submitted = st.form_submit_button("撤回并重新确认")
            if submitted:
                try:
                    agent.withdraw(by=by, reason=reason, expected_version=view["version"])
                    st.rerun()
                except ValueError as exc:
                    st.error(str(exc))
