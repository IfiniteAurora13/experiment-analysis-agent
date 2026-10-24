"""Local review cards: immutable input binding, explicit confirmation and withdrawal."""

from __future__ import annotations

import copy
import hashlib
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.intake import Inspection, inspect_bundle
from experimentos.models import AnalysisReport, Recommendation, WorkflowTrace


ENGINE_VERSION = "bundle-review-v1"


def _digest(value) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()).hexdigest()


def decide(report: AnalysisReport, policy: dict) -> dict:
    """Conservative absolute-difference CI rule; one predeclared core and guardrail."""
    if report.review_gate.status != "READY":
        return {"status": "BLOCKED", "label": "证据未通过复核", "reason": "必检未全部通过，业务风险偏好不能豁免数据质量。"}
    metrics = {metric.name: metric for metric in report.metric_results}
    core, guard = metrics["paid_user_cvr"], metrics["paid_gmv_per_user"]
    margin = float(policy["max_gmv_loss_per_user"])
    evidence = {
        "core_ci": [core.ci_low, core.ci_high], "gmv_ci": [guard.ci_low, guard.ci_high],
        "allowed_gmv_loss": margin, "policy_id": _digest(policy),
        "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
    }
    if policy["intent"] == "learning":
        return {**evidence, "status": "LEARNING_ONLY", "label": "记录学习结果", "reason": "预设意图为学习验证，不据此生成发布建议；支付 GMV 变化仍需复核。"}
    if guard.ci_low is None or guard.ci_high is None or core.ci_low is None or core.ci_high is None:
        return {**evidence, "status": "INCONCLUSIVE", "label": "证据不足", "reason": "缺少预设规则需要的差值置信区间。"}
    if guard.ci_high < -margin or core.ci_high < 0:
        return {**evidence, "status": "DO_NOT_SHIP", "label": "不支持推进发布", "reason": "主指标有明确损害，或 GMV 损失区间超过预先约定的允许边界。"}
    if guard.ci_low <= -margin:
        return {**evidence, "status": "INCONCLUSIVE", "label": "护栏证据不足", "reason": "尚不能排除超出允许损失；未显著恶化不等于安全。"}
    if core.ci_low <= 0 or not core.significant:
        return {**evidence, "status": "INCONCLUSIVE", "label": "主指标证据不足", "reason": "固定周期内未形成足够正向证据；不延长实验直到显著。"}
    return {**evidence, "status": "REVIEW_READY", "label": "可进入人工发布评审", "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"}


@dataclass
class ReviewCard:
    status: str
    snapshot_id: str
    inspection: dict
    decision: dict
    owner: str
    next_action: str
    report: AnalysisReport | None = None
    confirmation: dict | None = None
    card_id: str = ""
    history: list[dict] = field(default_factory=list)
    human_review: dict | None = None
    engine_version: str = ENGINE_VERSION

    def to_dict(self) -> dict:
        return asdict(self)

    def markdown(self) -> str:
        lines = [f"# {self.decision['label']}", "", self.decision["reason"], "",
                 f"**接管角色：** {self.owner}", "", f"**下一步：** {self.next_action}",
                 "", "## 口径与数据", "", "- 用户级随机；分母为全部唯一入组用户。",
                 "- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。",
                 f"- 数据来源声明：{self.inspection['manifest'].get('origin', '未提供')}。",
                 f"- 订单完整性水位：{self.inspection['manifest'].get('orders_complete_through', '未提供')}。",
                 "- 水位由上游声明并由本地负责人确认，系统不认证其真实性。"]
        if self.report and self.report.review_gate.status == "READY":
            lines += ["", "## 核心证据", "", "| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |", "| --- | ---: | ---: | ---: | --- |"]
            for metric in self.report.metric_results:
                conversion = metric.kind == "conversion"
                name = "7 天支付用户转化率" if conversion else "7 天支付 GMV / 用户"
                values = [f"{value:.2%}" if conversion else f"¥{value:.4f}" for value in (metric.control_value, metric.treatment_value)]
                delta = f"{metric.delta_abs * 100:+.2f} 个百分点" if conversion else f"¥{metric.delta_abs:+.4f}"
                scale = 100 if conversion else 1
                interval = f"[{metric.ci_low * scale:.4f}, {metric.ci_high * scale:.4f}] " + ("个百分点" if conversion else "元 / 用户")
                lines.append(f"| {name} | {values[0]} | {values[1]} | {delta} | {interval} |")
            lines += ["", "## 预设风险边界", "",
                      f"- 每用户 GMV 最多允许损失 ¥{self.decision['allowed_gmv_loss']:.4f}。",
                      "- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。",
                      "- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。"]
        elif self.report:
            lines += ["", "## 必检阻断", "", "证据未通过复核，暂停效果解读；计算输出仅供排障。"]
            lines.extend(f"- {issue.name}：{issue.impact}" for issue in self.report.quality_issues)
        if self.confirmation:
            lines += ["", f"口径确认：{self.confirmation['by']}；仅为本地署名记录，不是企业身份认证或上线批准。"]
        if self.human_review:
            lines += ["", f"人工复核记录：{self.human_review['by']}；绑定评审卡 {self.human_review['card_id'][:16]}，未执行上线。"]
        if self.inspection["issues"]:
            lines += ["", "## 数据处理与待办", ""]
            lines.extend(f"- {issue['message']} 接管：{issue['owner']}。{issue['next_action']}" for issue in self.inspection["issues"])
        lines += ["", f"版本：{self.snapshot_id} · 评审卡：{self.card_id} · {self.engine_version}",
                  "", "本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"]
        return "\n".join(lines)


class ReviewWorkspace:
    """Single-user local ledger; never writes to experiment or release platforms."""

    def __init__(self, path: str | Path | None = None, orchestrator: ExperimentOrchestrator | None = None):
        self.path = Path(path) if path is not None else None
        self.orchestrator = orchestrator or ExperimentOrchestrator()
        self.state = {"schema_version": 1, "current": None, "versions": [], "events": []}
        if self.path and self.path.exists():
            self.state = json.loads(self.path.read_text(encoding="utf-8"))
            if not isinstance(self.state, dict) or self.state.get("schema_version") != 1 or not isinstance(self.state.get("events"), list) or not isinstance(self.state.get("versions"), list):
                raise ValueError("本地复核记录格式无效；请保留原文件并检查。")

    def _event(self, kind: str, **detail) -> None:
        self.state["events"].append({"event": kind, "at": datetime.now(timezone.utc).isoformat(), **detail})

    def _save(self) -> None:
        if self.path:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            temporary = self.path.with_suffix(self.path.suffix + ".tmp")
            temporary.write_text(json.dumps(self.state, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
            temporary.replace(self.path)

    def inspect(self, files: dict[str, bytes]) -> Inspection:
        inspection = inspect_bundle(files)
        previous = self.state["current"]
        if previous is None or previous["snapshot_id"] != inspection.snapshot_id:
            if previous is not None:
                archived = copy.deepcopy(previous)
                archived["state"] = "SUPERSEDED"
                self.state["versions"].append(archived)
                self._event("superseded", snapshot_id=previous["snapshot_id"], replacement=inspection.snapshot_id)
            self.state["current"] = {"snapshot_id": inspection.snapshot_id, "confirmation": None, "state": "UNCONFIRMED", "card": None}
            self._event("imported", snapshot_id=inspection.snapshot_id)
            self._save()
        return inspection

    def confirm(self, files: dict[str, bytes], *, by: str, expected_snapshot: str) -> None:
        inspection = self.inspect(files)
        if expected_snapshot != inspection.snapshot_id:
            raise ValueError("数据包已变化，旧确认不可复用；请复核新口径与水位。")
        if not inspection.valid:
            raise ValueError("数据包仍有阻断问题；不能通过确认跳过。")
        if not isinstance(by, str) or not by.strip() or len(by.strip()) > 80:
            raise ValueError("请填写不超过 80 字的本地确认人署名。")
        confirmation = {"snapshot_id": inspection.snapshot_id, "by": by.strip(),
                        "at": datetime.now(timezone.utc).isoformat(), "scope": "definitions_and_declared_completeness"}
        self.state["current"].update(confirmation=confirmation, state="CONFIRMED", reviewed_card_id=None, human_review=None)
        self._event("definitions_confirmed", **confirmation)
        self._save()

    def evaluate(self, files: dict[str, bytes]) -> ReviewCard:
        inspection = self.inspect(files)
        current = self.state["current"]
        confirmation = current.get("confirmation")
        blocking = [issue for issue in inspection.issues if issue.blocking]
        report = None
        if blocking:
            decision = {"status": "BLOCKED", "label": "数据包需要修复", "reason": blocking[0].message}
            owner, action = blocking[0].owner, blocking[0].next_action
        elif not confirmation or confirmation["snapshot_id"] != inspection.snapshot_id:
            decision = {"status": "NEEDS_CONFIRMATION", "label": "请先确认口径与水位", "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"}
            owner, action = "数据负责人", "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。"
        else:
            report = self.orchestrator.run(inspection.request)
            report.report_scope.update(source="csv_bundle", snapshot_id=inspection.snapshot_id,
                                      input_counts=inspection.counts, definition_confirmation=confirmation)
            decision = decide(report, inspection.contract["policy"])
            report.workflow_trace.append(WorkflowTrace(stage="risk_policy", status=decision["status"],
                                                       detail={"policy_id": decision.get("policy_id"), "intent": inspection.contract["policy"]["intent"]}))
            report.report_scope["predeclared_policy"] = inspection.contract["policy"]
            report.recommendations = [Recommendation(decision["label"], decision["reason"])]
            report.summary = decision["label"] + "：" + decision["reason"]
            if decision["status"] != "REVIEW_READY":
                report.status = "DONE_WITH_CONCERNS"
            owner = "实验分析负责人" if decision["status"] == "BLOCKED" else "业务负责人"
            action = {
                "BLOCKED": report.review_gate.next_action,
                "REVIEW_READY": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
                "DO_NOT_SHIP": "停止推进当前方案，修订设计后建立新实验，不通过修改阈值覆盖当前结果。",
                "INCONCLUSIVE": "记录证据不足，按预设计划结束本次判断；如需新实验，重新制定样本与风险计划。",
                "LEARNING_ONLY": "记录学习结果与下一轮验证问题；本实验不产生上线批准。",
            }[decision["status"]]
        card = ReviewCard(decision["status"], inspection.snapshot_id, inspection.public(), decision, owner, action, report, confirmation)
        card.card_id = _digest({"snapshot": card.snapshot_id, "engine": ENGINE_VERSION, "decision": decision,
                                "metrics": [asdict(metric) for metric in report.metric_results] if report else []})
        if current.get("reviewed_card_id") and current["reviewed_card_id"] != card.card_id:
            current["reviewed_card_id"] = None
            current["human_review"] = None
            self._event("human_review_invalidated", snapshot_id=card.snapshot_id)
        if current.get("reviewed_card_id") == card.card_id:
            card.human_review = copy.deepcopy(current.get("human_review"))
        current.update(state=card.status, card=card.to_dict())
        card.history = copy.deepcopy(self.state["events"])
        self._save()
        return card

    def record_human_review(self, *, snapshot: str, by: str) -> None:
        current = self.state["current"]
        if not current or current["snapshot_id"] != snapshot or current["state"] != "REVIEW_READY":
            raise ValueError("只有当前版本且证据满足预设规则的评审卡可记录人工复核。")
        if not by.strip():
            raise ValueError("请填写本地复核人署名。")
        current["reviewed_card_id"] = current["card"]["card_id"]
        current["human_review"] = {"by": by.strip(), "at": datetime.now(timezone.utc).isoformat(), "card_id": current["reviewed_card_id"]}
        current["card"]["human_review"] = current["human_review"]
        self._event("human_review_recorded", snapshot_id=snapshot, card_id=current["reviewed_card_id"], by=by.strip(), release_executed=False)
        self._save()

    def withdraw(self, *, snapshot: str, by: str, reason: str) -> None:
        current = self.state["current"]
        if not current or current["snapshot_id"] != snapshot:
            raise ValueError("只能撤回当前版本的本地评审卡。")
        if not by.strip() or not reason.strip():
            raise ValueError("撤回需要署名和原因。")
        archived = copy.deepcopy(current)
        archived["state"] = "WITHDRAWN"
        self.state["versions"].append(archived)
        current.update(state="WITHDRAWN", confirmation=None, reviewed_card_id=None, human_review=None, card=None)
        self._event("withdrawn", snapshot_id=snapshot, by=by.strip(), reason=reason.strip(), release_executed=False)
        self._save()
