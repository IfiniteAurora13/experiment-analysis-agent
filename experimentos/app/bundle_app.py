"""Product-facing intake and local review flow for the fixed bundle contract."""

from __future__ import annotations

import json

import streamlit as st

from experimentos.demo_data import SCENARIOS, make_bundle
from experimentos.intake import BUNDLE_FILES
from experimentos.review import ReviewWorkspace


STATUS_LABELS = {
    "BLOCKED": "需要修复", "NEEDS_CONFIRMATION": "等待口径确认", "REVIEW_READY": "可进入人工评审",
    "INCONCLUSIVE": "证据不足", "DO_NOT_SHIP": "不支持推进", "LEARNING_ONLY": "仅记录学习结果",
}


@st.cache_data
def demo_files(scenario: str) -> dict[str, bytes]:
    return make_bundle(scenario)


def render_bundle_workspace() -> None:
    st.subheader("从数据包到一张可复核的评审卡")
    st.caption("固定任务：商品详情页、两组用户随机、入组后 7 天支付。当前产品主路径为规则基线，不调用模型或线上实验平台。")
    source = st.radio("数据来源", ["合成数据演示", "本地导出包"], horizontal=True)
    if source == "合成数据演示":
        scenario = st.selectbox("选择一次完整任务", list(SCENARIOS), format_func=SCENARIOS.get)
        files = demo_files(scenario)
        st.info("当前为合成数据，订单金额与效果仅用于验证流程，不是业务收益证据。")
    else:
        st.info("文件仅在当前本地工作台内处理，不调用远端模型。共享部署需另行设计访问控制与数据保留。")
        files = {}
        for name in BUNDLE_FILES:
            upload = st.file_uploader(name, type=[name.rsplit(".", 1)[1]], key=f"bundle_upload_{name}")
            if upload is not None:
                files[name] = upload.getvalue()
        if not files:
            st.caption("上传 contract.json、manifest.json、assignments.csv、orders.csv。支持每文件 5 MiB；格式规范见 product/data_contract.md。")
            return
    if "bundle_workspace" not in st.session_state:
        st.session_state.bundle_workspace = ReviewWorkspace()
    workspace = st.session_state.bundle_workspace
    try:
        card = workspace.evaluate(files)
    except (ValueError, OSError) as exc:
        st.error(f"当前任务未完成，请保留源文件并联系分析负责人：{exc}")
        return
    inspection = card.inspection
    st.divider()
    st.markdown("#### ① 数据包检查")
    a, b, c = st.columns(3)
    a.metric("唯一入组用户", inspection["counts"].get("assigned_users", "待确认"))
    b.metric("窗口内订单", inspection["counts"].get("included_orders", "待确认"))
    c.metric("数据包状态", "检查通过" if inspection["valid"] else "需要修复")
    for issue in inspection["issues"]:
        message = f"{issue['message']} 接管：{issue['owner']}。{issue['next_action']}"
        (st.error if issue["blocking"] else st.warning)(message)
    contract = inspection["contract"]
    manifest = inspection["manifest"]
    with st.expander("查看固定口径与上游声明", expanded=card.status == "NEEDS_CONFIRMATION"):
        st.write("支付用户 / 全部唯一入组用户；每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款。")
        st.write("无订单计零的前提：上游完整性声明覆盖全部观察窗口，并由数据负责人确认。")
        st.write(f"订单完整性水位：{manifest.get('orders_complete_through', '缺失')}")
        st.write(f"水位证据：{manifest.get('source_evidence', '缺失')}")
        policy = contract.get("policy", {})
        if isinstance(policy, dict):
            st.write(f"预设 GMV 允许损失：{policy.get('max_gmv_loss_per_user', '未定义')} 元 / 用户；声明时间：{policy.get('declared_at', '未定义')}")
        st.caption("声明来自数据包，系统不认证上游真实性；需要负责人核对。不能通过改写事后阈值放行。")
    st.markdown("#### ② 确认当前口径")
    if card.confirmation:
        st.success(f"当前数据包已由 {card.confirmation['by']} 确认。数据或口径变化后，此确认自动失效。")
    else:
        with st.form(f"confirm_bundle_{card.snapshot_id}"):
            by = st.text_input("数据确认人（本地署名）", value="演示：数据负责人" if source == "合成数据演示" else "")
            acknowledged = st.checkbox("我已核对以上分母、窗口、去重规则及完整性证据")
            submitted = st.form_submit_button("确认当前版本并生成评审卡", disabled=not inspection["valid"])
        if submitted:
            if not acknowledged:
                st.error("请先核对并勾选确认范围。")
            else:
                try:
                    workspace.confirm(files, by=by, expected_snapshot=card.snapshot_id)
                    st.rerun()
                except ValueError as exc:
                    st.error(str(exc))
    st.markdown("#### ③ 评审结果")
    st.subheader(card.decision["label"])
    st.write(card.decision["reason"])
    st.write(f"**接管角色：** {card.owner}　 **下一步：** {card.next_action}")
    if card.report:
        if card.report.review_gate.status == "READY":
            cols = st.columns(2)
            for col, metric in zip(cols, card.report.metric_results):
                with col:
                    conversion = metric.kind == "conversion"
                    st.metric("7 天支付转化率" if conversion else "7 天支付 GMV / 用户",
                              f"{metric.treatment_value:.2%}" if conversion else f"¥{metric.treatment_value:.4f}",
                              f"{metric.delta_abs * 100:+.2f} 个百分点" if conversion else f"¥{metric.delta_abs:+.4f} / 用户")
                    if metric.ci_low is not None:
                        scale = 100 if conversion else 1
                        st.caption(f"差值 95% 区间：[{metric.ci_low * scale:.4f}, {metric.ci_high * scale:.4f}] {'个百分点' if conversion else '元 / 用户'}")
        else:
            st.warning("必检未通过，暂停效果解读。计算输出仅供分析负责人排障。")
        if card.human_review:
            st.success(f"已由 {card.human_review['by']} 记录本地人工复核；未执行上线。")
        reviewer = st.text_input("业务复核人（本地署名，不是上线授权）", key="bundle_reviewer")
        if st.button("记录人工复核完成", disabled=card.status != "REVIEW_READY"):
            try:
                workspace.record_human_review(snapshot=card.snapshot_id, by=reviewer)
                st.rerun()
            except ValueError as exc:
                st.error(str(exc))
        st.download_button("下载当前评审卡", card.markdown(), file_name=f"review-{card.snapshot_id[:12]}.md", mime="text/markdown")
        with st.expander("撤回本地评审卡"):
            withdraw_by = st.text_input("撤回人", key="bundle_withdraw_by")
            reason = st.text_input("撤回原因", key="bundle_withdraw_reason")
            if st.button("撤回并清除当前确认"):
                try:
                    workspace.withdraw(snapshot=card.snapshot_id, by=withdraw_by, reason=reason)
                    st.rerun()
                except ValueError as exc:
                    st.error(str(exc))
    with st.expander("处理记录与可复现证据"):
        st.caption(f"数据包 SHA-256：{card.snapshot_id}；本地会话记录，刷新或关闭会话可能清空。CLI --store 支持持久保存。")
        st.json(inspection["counts"])
        st.dataframe(workspace.state["events"], hide_index=True)
        st.download_button("下载本地记录（JSON）", json.dumps(workspace.state, ensure_ascii=False, indent=2), "review-ledger.json", mime="application/json")
        if card.report:
            st.dataframe([{"步骤": event.stage, "状态": event.status} for event in card.report.workflow_trace], hide_index=True)
