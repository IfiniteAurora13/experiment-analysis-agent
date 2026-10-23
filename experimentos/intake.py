"""One deliberately narrow CSV contract for user-randomised commerce tests."""

from __future__ import annotations

import csv
import hashlib
import io
import json
from collections import Counter
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation
from pathlib import Path
from statistics import mean, variance
from zoneinfo import ZoneInfo

from experimentos.models import ExperimentContext, ExperimentRequest, MetricInput


BUNDLE_FILES = ("contract.json", "manifest.json", "assignments.csv", "orders.csv")
MAX_FILE_BYTES = 5 * 1024 * 1024


@dataclass
class IntakeIssue:
    code: str
    message: str
    next_action: str
    blocking: bool = True
    owner: str = "数据负责人"


@dataclass
class Inspection:
    snapshot_id: str
    contract: dict = field(default_factory=dict)
    manifest: dict = field(default_factory=dict)
    counts: dict = field(default_factory=dict)
    issues: list[IntakeIssue] = field(default_factory=list)
    request: ExperimentRequest | None = None

    @property
    def valid(self) -> bool:
        return self.request is not None and not any(issue.blocking for issue in self.issues)

    def public(self) -> dict:
        return {
            "snapshot_id": self.snapshot_id,
            "valid": self.valid,
            "contract": self.contract,
            "manifest": self.manifest,
            "counts": self.counts,
            "issues": [asdict(issue) for issue in self.issues],
        }


class BundleError(ValueError):
    def __init__(self, code: str, message: str, next_action: str = "修复数据包后重新导入并确认口径。", *, owner: str = "数据负责人"):
        super().__init__(message)
        self.issue = IntakeIssue(code, message, next_action, owner=owner)


def read_bundle(folder: str | Path) -> dict[str, bytes]:
    folder = Path(folder)
    return {name: (folder / name).read_bytes() for name in BUNDLE_FILES if (folder / name).is_file()}


def snapshot_id(files: dict[str, bytes]) -> str:
    digest = hashlib.sha256()
    for name in BUNDLE_FILES:
        data = files.get(name, b"")
        if not isinstance(data, bytes):
            data = repr(type(data)).encode()
        digest.update(name.encode() + bytes([name in files]) + b"\0" + str(len(data)).encode() + b"\0" + data)
    return digest.hexdigest()


def _json(data: bytes, name: str) -> dict:
    def unique_pairs(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError("duplicate JSON key")
            result[key] = value
        return result

    try:
        value = json.loads(data.decode("utf-8-sig"), object_pairs_hook=unique_pairs,
                           parse_constant=lambda value: (_ for _ in ()).throw(ValueError(value)))
        if not isinstance(value, dict):
            raise ValueError("expected object")
        return value
    except (ValueError, UnicodeError) as exc:
        raise BundleError("INVALID_JSON", f"{name} 不是有效且键唯一的 UTF-8 JSON 对象。") from exc


def _time(value, name: str) -> datetime:
    try:
        if not isinstance(value, str):
            raise ValueError("timestamp must be a string")
        result = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if result.tzinfo is None or result.utcoffset() is None:
            raise ValueError("timezone missing")
        return result
    except (ValueError, TypeError) as exc:
        raise BundleError("INVALID_TIME", f"{name} 必须为带时区偏移的 ISO 时间。") from exc


def _number(value, name: str, *, minimum: float = 0) -> float:
    try:
        if isinstance(value, bool):
            raise ValueError("boolean is not a number")
        number = Decimal(str(value))
        if not number.is_finite() or number < Decimal(str(minimum)):
            raise ValueError("out of range")
        result = float(number)
        if result == float("inf"):
            raise ValueError("overflow")
        return result
    except (InvalidOperation, ValueError, TypeError) as exc:
        raise BundleError("INVALID_NUMBER", f"{name} 必须为有限且不小于 {minimum} 的数值。") from exc


def _rows(data: bytes, required: set[str], name: str) -> list[dict[str, str]]:
    try:
        reader = csv.DictReader(io.StringIO(data.decode("utf-8-sig"), newline=""), strict=True)
        headers = reader.fieldnames or []
        if len(headers) != len(set(headers)):
            raise BundleError("DUPLICATE_HEADER", f"{name} 含重复列名。")
        if not required.issubset(headers):
            raise BundleError("MISSING_COLUMN", f"{name} 缺少列：{', '.join(sorted(required - set(headers)))}。")
        rows = []
        for index, row in enumerate(reader, 2):
            if None in row or any(row.get(key) is None or not row[key].strip() for key in required):
                raise BundleError("INVALID_ROW", f"{name} 第 {index} 行列数或必填值无效。")
            rows.append({key: row[key].strip() for key in required})
        return rows
    except (UnicodeError, csv.Error) as exc:
        raise BundleError("INVALID_CSV", f"{name} 必须是有效的 UTF-8 CSV。") from exc


def inspect_bundle(files: dict[str, bytes]) -> Inspection:
    inspection = Inspection(snapshot_id(files))
    try:
        _inspect(files, inspection)
    except BundleError as exc:
        inspection.issues.append(exc.issue)
        inspection.request = None
    return inspection


def _inspect(files: dict[str, bytes], result: Inspection) -> None:
    missing = [name for name in BUNDLE_FILES if name not in files]
    if missing:
        raise BundleError("MISSING_FILE", f"缺少数据包文件：{', '.join(missing)}。")
    if any(not isinstance(files[name], bytes) or len(files[name]) > MAX_FILE_BYTES for name in BUNDLE_FILES):
        raise BundleError("FILE_LIMIT", "每个文件须为不超过 5 MiB 的字节内容。")
    contract = _json(files["contract.json"], "contract.json")
    manifest = _json(files["manifest.json"], "manifest.json")
    result.contract, result.manifest = contract, manifest
    required = {
        "schema_version", "experiment_id", "objective", "randomization_unit",
        "expected_control_ratio", "enrollment_start", "enrollment_end", "observation_days",
        "timezone", "currency", "conversion_event", "denominator", "zero_policy", "refunds", "policy", "alpha", "analysis_mode",
    }
    absent = sorted(required - contract.keys())
    if absent:
        raise BundleError("MISSING_DEFINITION", f"口径尚不完整：{', '.join(absent)}。", "请数据负责人补齐上述定义；系统不会猜测分母、事件或单位。")
    fixed = {
        "schema_version": 1, "randomization_unit": "user", "observation_days": 7,
        "currency": "CNY", "conversion_event": "paid_order", "denominator": "all_assigned_users",
        "zero_policy": "after_watermark_only", "refunds": "not_deducted",
        "alpha": 0.05, "analysis_mode": "fixed_horizon",
    }
    if any(contract[key] != expected or isinstance(contract[key], bool) for key, expected in fixed.items()):
        raise BundleError("UNSUPPORTED_DEFINITION", "当前仅支持用户随机、7 天支付、全部入组用户分母、CNY 支付 GMV（未扣退款）的固定口径。")
    if not all(isinstance(contract[key], str) and contract[key].strip() for key in ("experiment_id", "objective", "timezone")):
        raise BundleError("MISSING_DEFINITION", "实验 ID、目标和时区必须为非空文本。")
    try:
        zone = ZoneInfo(contract["timezone"])
    except (ValueError, KeyError) as exc:
        raise BundleError("INVALID_TIMEZONE", "timezone 必须为有效 IANA 时区。") from exc
    start, end = _time(contract["enrollment_start"], "enrollment_start"), _time(contract["enrollment_end"], "enrollment_end")
    if start >= end:
        raise BundleError("INVALID_PERIOD", "入组区间必须为非空的左闭右开区间。")
    ratio = _number(contract["expected_control_ratio"], "expected_control_ratio")
    if not 0 < ratio < 1:
        raise BundleError("INVALID_ALLOCATION", "预设对照组比例必须在 0 和 1 之间。")
    policy = contract["policy"]
    if not isinstance(policy, dict) or not {"intent", "max_gmv_loss_per_user", "declared_at"}.issubset(policy):
        raise BundleError("MISSING_POLICY", "请事先定义实验意图、每用户 GMV 允许损失和声明时间。", "请业务负责人确认预设策略后重新导入；不能根据结果临时放宽阈值。", owner="业务负责人")
    if not isinstance(policy["intent"], str) or policy["intent"] not in {"conversion_guarded", "learning"}:
        raise BundleError("UNSUPPORTED_POLICY", "实验意图仅支持转化提升且支付 GMV 受约束，或学习验证。", owner="业务负责人")
    try:
        _number(policy["max_gmv_loss_per_user"], "max_gmv_loss_per_user")
        declared_at = _time(policy["declared_at"], "policy.declared_at")
    except BundleError as exc:
        exc.issue.owner = "业务负责人"
        raise
    if declared_at > start:
        raise BundleError("POSTHOC_POLICY", "策略声明晚于实验开始，当前结果不能使用这份事后阈值。", owner="业务负责人")
    for key in ("snapshot_at", "assignments_complete_through", "orders_complete_through", "source_evidence", "origin"):
        if key not in manifest or not isinstance(manifest[key], str) or not manifest[key].strip():
            raise BundleError("MISSING_WATERMARK", f"manifest 缺少 {key}；不能用最大事件时间推断数据完整。")
    if manifest["origin"] not in {"synthetic", "user_export"}:
        raise BundleError("INVALID_ORIGIN", "数据来源必须声明为 synthetic 或 user_export。")
    snapshot = _time(manifest["snapshot_at"], "snapshot_at")
    assignment_watermark = _time(manifest["assignments_complete_through"], "assignments_complete_through")
    order_watermark = _time(manifest["orders_complete_through"], "orders_complete_through")
    if max(assignment_watermark, order_watermark) > snapshot:
        raise BundleError("INVALID_WATERMARK", "声明的数据水位晚于快照时间。")
    try:
        cutoff = end + timedelta(days=7)
    except OverflowError as exc:
        raise BundleError("INVALID_PERIOD", "入组终点超出可支持的观察窗口日期范围。") from exc
    result.counts["required_complete_through"] = cutoff.isoformat()
    if assignment_watermark < end or order_watermark < cutoff or snapshot < cutoff:
        raise BundleError("DATA_NOT_MATURE", "上游水位尚未覆盖入组区间及完整 7 天观察窗口，不能将无订单用户计零。", f"等待上游完整性水位覆盖 {cutoff.isoformat()}，重新导出完整数据包。")

    assignment_rows = _rows(files["assignments.csv"], {"experiment_id", "user_id", "variant", "assigned_at"}, "assignments.csv")
    order_rows = _rows(files["orders.csv"], {"order_id", "user_id", "paid_at", "paid_amount", "currency", "ingested_at"}, "orders.csv")
    result.counts.update(raw_assignments=len(assignment_rows), raw_orders=len(order_rows))
    users: dict[str, tuple[str, datetime]] = {}
    duplicate_assignments = 0
    for index, row in enumerate(assignment_rows, 2):
        if row["experiment_id"] != contract["experiment_id"]:
            raise BundleError("WRONG_EXPERIMENT", f"assignments.csv 第 {index} 行不属于当前实验。")
        if row["variant"] not in {"control", "treatment"}:
            raise BundleError("INVALID_VARIANT", f"assignments.csv 第 {index} 行组别不受支持。")
        assigned = _time(row["assigned_at"], f"assignments.csv 第 {index} 行 assigned_at")
        if not start <= assigned < end:
            raise BundleError("ASSIGNMENT_OUTSIDE_PERIOD", f"assignments.csv 第 {index} 行入组时间不在约定区间。")
        current = (row["variant"], assigned)
        previous = users.get(row["user_id"])
        if previous and previous != current:
            code = "CROSS_GROUP_USER" if previous[0] != current[0] else "ASSIGNMENT_CONFLICT"
            raise BundleError(code, f"assignments.csv 第 {index} 行出现同一用户的冲突入组；不能静默选择一组。")
        if previous:
            duplicate_assignments += 1
        users[row["user_id"]] = current
    group_counts = Counter(value[0] for value in users.values())
    result.counts.update(assigned_users=len(users), control_users=group_counts["control"], treatment_users=group_counts["treatment"])
    if min(group_counts["control"], group_counts["treatment"]) < 2:
        raise BundleError("INSUFFICIENT_USERS", "每组至少需要 2 名唯一入组用户；空组或空文件不能分析。")
    amounts = {user: Decimal("0") for user in users}
    converters: set[str] = set()
    seen_orders: dict[str, tuple] = {}
    duplicate_orders = excluded_orders = late_orders = included_orders = 0
    for index, row in enumerate(order_rows, 2):
        if row["user_id"] not in users:
            raise BundleError("ORPHAN_ORDER", f"orders.csv 第 {index} 行没有匹配的入组用户；请核对导出范围与关联键。")
        if row["currency"] != contract["currency"]:
            raise BundleError("CURRENCY_MISMATCH", f"orders.csv 第 {index} 行币种与口径不一致；不做自动汇率转换。")
        try:
            amount = Decimal(row["paid_amount"])
            if not amount.is_finite() or amount < 0 or amount > 1_000_000_000 or amount != amount.quantize(Decimal("0.01")):
                raise InvalidOperation
        except InvalidOperation as exc:
            raise BundleError("INVALID_AMOUNT", f"orders.csv 第 {index} 行金额须为非负、有限、至多两位小数的 CNY 金额。") from exc
        paid = _time(row["paid_at"], f"orders.csv 第 {index} 行 paid_at")
        ingested = _time(row["ingested_at"], f"orders.csv 第 {index} 行 ingested_at")
        if ingested < paid or ingested > snapshot:
            raise BundleError("SNAPSHOT_MISMATCH", f"orders.csv 第 {index} 行入库时间与支付时间或快照不一致。")
        record = (row["user_id"], paid, amount, row["currency"], ingested)
        previous = seen_orders.get(row["order_id"])
        if previous is not None:
            if previous != record:
                raise BundleError("ORDER_CONFLICT", f"orders.csv 第 {index} 行订单 ID 重复但内容冲突；不猜测保留版本。")
            duplicate_orders += 1
            continue
        seen_orders[row["order_id"]] = record
        assigned = users[row["user_id"]][1]
        if not assigned <= paid < assigned + timedelta(days=7):
            excluded_orders += 1
            continue
        included_orders += 1
        late_orders += int(ingested - paid > timedelta(days=1))
        amounts[row["user_id"]] += amount
        converters.add(row["user_id"])
    result.counts.update(unique_orders=len(seen_orders), included_orders=included_orders,
                         duplicate_orders=duplicate_orders, duplicate_assignments=duplicate_assignments,
                         excluded_orders=excluded_orders, late_arriving_orders=late_orders)
    for code, count, message in (
        ("DEDUPLICATED_ASSIGNMENTS", duplicate_assignments, "完全一致的重复入组记录已去重"),
        ("DEDUPLICATED_ORDERS", duplicate_orders, "完全一致的重复订单已去重"),
        ("OUTSIDE_OBSERVATION_WINDOW", excluded_orders, "观察窗口外订单已按契约排除"),
        ("LATE_ORDERS_INCLUDED", late_orders, "迟到但已在快照前入库的窗口内订单已计入"),
    ):
        if count:
            result.issues.append(IntakeIssue(code, f"{message}：{count} 条。", "确认处理记录；无需静默删改源数据。", blocking=False))
    group_amounts = {group: [float(amounts[user]) for user, value in users.items() if value[0] == group] for group in ("control", "treatment")}
    successes = Counter(users[user][0] for user in converters)
    n_control, n_treatment = group_counts["control"], group_counts["treatment"]
    metrics = [
        MetricInput(name="paid_user_cvr", kind="conversion", role="core", control_n=n_control,
                    treatment_n=n_treatment, control_successes=successes["control"], treatment_successes=successes["treatment"]),
        MetricInput(name="paid_gmv_per_user", kind="continuous", role="guardrail", unit="CNY/user",
                    control_n=n_control, treatment_n=n_treatment,
                    control_value=mean(group_amounts["control"]), treatment_value=mean(group_amounts["treatment"]),
                    control_var=variance(group_amounts["control"]), treatment_var=variance(group_amounts["treatment"])),
    ]
    for metric in metrics:
        metric.metadata = {"snapshot_id": result.snapshot_id, "denominator": "unique_assigned_users", "observation_days": 7}
    result.request = ExperimentRequest(
        question="请准备商品详情页改版的人工上线评审卡。", task_type="release_recommendation",
        context=ExperimentContext(experiment_id=contract["experiment_id"], objective=contract["objective"],
                                  start_date=start.astimezone(zone).date().isoformat(), end_date=cutoff.astimezone(zone).date().isoformat(),
                                  expected_control_ratio=ratio, exposure_definition="唯一入组用户",
                                  conversion_definition="入组后 7 天内至少一笔支付订单；左闭右开窗口"),
        metrics=metrics,
    )
