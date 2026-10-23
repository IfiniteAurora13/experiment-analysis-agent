"""Reproducible, explicitly synthetic bundles for the local product demo."""

from __future__ import annotations

import argparse
import csv
import io
import json
from pathlib import Path


SCENARIOS = {
    "clean": "正常数据，等待口径确认",
    "duplicates": "重复记录：明确去重并留痕",
    "cross_group": "同一用户跨组：阻断",
    "order_conflict": "重复订单内容冲突：阻断",
    "missing_definition": "分母不明确：等待补充",
    "missing_watermark": "缺少上游完整性声明：阻断",
    "immature": "数据窗口未成熟：等待重导",
    "orphan_order": "订单关联不到入组用户：阻断",
    "late_arrival": "窗口内迟到订单：水位齐全后正确计入",
    "outside_window": "窗口结束时订单：按约定排除",
    "mixed_snapshot": "混入快照之后入库数据：阻断",
    "srm": "入组分流异常：阻断效果结论",
    "guardrail_harm": "主指标提升但收入越过损失边界",
    "guardrail_uncertain": "未能排除超出允许损失",
    "learning": "学习意图：不生成发布建议",
    "posthoc_policy": "事后设置风险阈值：阻断",
}


def encode_csv(rows: list[dict], fields: list[str]) -> bytes:
    stream = io.StringIO(newline="")
    writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue().encode("utf-8")


def make_bundle(scenario: str = "clean", n: int = 2000) -> dict[str, bytes]:
    if scenario not in SCENARIOS:
        raise ValueError(f"未知合成场景：{scenario}")
    if n < 20 or n % 20:
        raise ValueError("合成样本量须为至少 20 的 20 倍数")
    contract = {
        "schema_version": 1, "experiment_id": "synthetic-detail-page-001",
        "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
        "randomization_unit": "user", "expected_control_ratio": 0.5,
        "enrollment_start": "2026-09-01T00:00:00+08:00", "enrollment_end": "2026-09-08T00:00:00+08:00",
        "observation_days": 7, "timezone": "Asia/Shanghai", "currency": "CNY",
        "conversion_event": "paid_order", "denominator": "all_assigned_users",
        "zero_policy": "after_watermark_only", "refunds": "not_deducted",
        "alpha": 0.05, "analysis_mode": "fixed_horizon",
        "policy": {"intent": "conversion_guarded", "max_gmv_loss_per_user": "0.02", "declared_at": "2026-08-31T10:00:00+08:00"},
    }
    manifest = {
        "snapshot_at": "2026-09-16T12:00:00+08:00",
        "assignments_complete_through": "2026-09-08T00:00:00+08:00",
        "orders_complete_through": "2026-09-15T00:00:00+08:00",
        "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
        "origin": "synthetic",
    }
    assignments = [{"experiment_id": contract["experiment_id"], "user_id": f"{group}-{i:05d}",
                    "variant": group, "assigned_at": "2026-09-01T08:00:00+08:00"}
                   for group in ("control", "treatment") for i in range(n)]
    orders = [{"order_id": f"order-{group}-{i:05d}", "user_id": f"{group}-{i:05d}",
               "paid_at": "2026-09-02T08:00:00+08:00", "paid_amount": "1.00" if group == "control" else "0.67",
               "currency": "CNY", "ingested_at": "2026-09-02T09:00:00+08:00"}
              for group, count in (("control", n // 10), ("treatment", n * 3 // 20)) for i in range(count)]
    if scenario == "duplicates":
        assignments.append(dict(assignments[0]))
        orders.append(dict(orders[0]))
    elif scenario == "cross_group":
        assignments.append({**assignments[0], "variant": "treatment"})
    elif scenario == "order_conflict":
        orders.append({**orders[0], "paid_amount": "2.00"})
    elif scenario == "missing_definition":
        del contract["denominator"]
    elif scenario == "missing_watermark":
        del manifest["orders_complete_through"]
    elif scenario == "immature":
        manifest["orders_complete_through"] = "2026-09-12T00:00:00+08:00"
    elif scenario == "orphan_order":
        orders[0]["user_id"] = "not-enrolled"
    elif scenario == "late_arrival":
        orders.append({**orders[0], "order_id": "late-order", "user_id": f"control-{n - 1:05d}",
                       "ingested_at": "2026-09-14T10:00:00+08:00"})
    elif scenario == "outside_window":
        orders.append({**orders[0], "order_id": "outside-order", "paid_at": "2026-09-08T08:00:00+08:00",
                       "ingested_at": "2026-09-08T09:00:00+08:00"})
    elif scenario == "mixed_snapshot":
        orders[0]["ingested_at"] = "2026-09-17T00:00:00+08:00"
    elif scenario == "srm":
        assignments = [row for row in assignments if row["variant"] == "control" or int(row["user_id"].split("-")[1]) < n * 3 // 4]
    elif scenario in {"guardrail_harm", "guardrail_uncertain"}:
        for row in orders:
            if row["user_id"].startswith("treatment-"):
                row["paid_amount"] = "0.40" if scenario == "guardrail_harm" else "0.55"
    elif scenario == "learning":
        contract["policy"]["intent"] = "learning"
    elif scenario == "posthoc_policy":
        contract["policy"]["declared_at"] = "2026-09-02T10:00:00+08:00"
    return {
        "contract.json": (json.dumps(contract, ensure_ascii=False, indent=2) + "\n").encode(),
        "manifest.json": (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode(),
        "assignments.csv": encode_csv(assignments, ["experiment_id", "user_id", "variant", "assigned_at"]),
        "orders.csv": encode_csv(orders, ["order_id", "user_id", "paid_at", "paid_amount", "currency", "ingested_at"]),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="生成公开规则的合成 CSV 数据包。")
    parser.add_argument("--scenario", choices=SCENARIOS, default="clean")
    parser.add_argument("--output", default="examples/generated_bundle")
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    for name, data in make_bundle(args.scenario).items():
        (output / name).write_bytes(data)
    print(f"合成数据包已保存：{output}")


if __name__ == "__main__":
    main()
