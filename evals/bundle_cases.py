"""Behavioural evaluation of real CSV intake, confirmation, risk and version flows."""

from __future__ import annotations

import csv
import io
import json
from math import isclose

from experimentos.demo_data import encode_csv, make_bundle
from experimentos.intake import snapshot_id
from experimentos.review import ReviewWorkspace
from evals.types import EvaluatorResult


def apply_mutations(files: dict[str, bytes], mutations: list[dict]) -> dict[str, bytes]:
    files = dict(files)
    for mutation in mutations:
        name, operation = mutation["file"], mutation["op"]
        if operation == "remove_file":
            files.pop(name, None)
        elif operation == "raw":
            files[name] = mutation["value"].encode("utf-8")
        elif operation == "invalid_utf8":
            files[name] = b"\xff\xfe\xfa"
        elif operation in {"set_json", "delete_json"}:
            value = json.loads(files[name])
            parent = value
            for key in mutation["path"][:-1]:
                parent = parent[key]
            key = mutation["path"][-1]
            if operation == "set_json":
                parent[key] = mutation["value"]
            else:
                del parent[key]
            files[name] = json.dumps(value, ensure_ascii=False).encode()
        else:
            reader = csv.DictReader(io.StringIO(files[name].decode("utf-8")))
            fields, rows = list(reader.fieldnames), list(reader)
            if operation == "set_csv":
                rows[mutation.get("row", 0)][mutation["column"]] = mutation["value"]
            elif operation == "remove_column":
                fields.remove(mutation["column"])
                rows = [{key: value for key, value in row.items() if key in fields} for row in rows]
            elif operation == "empty_rows":
                rows = []
            elif operation == "append_conflicting_assignment":
                rows.append({**rows[0], "assigned_at": "2026-09-01T09:00:00+08:00"})
            elif operation == "duplicate_header":
                files[name] = (",".join(fields + [fields[0]]) + "\n").encode()
                continue
            else:
                raise ValueError(f"未知的离线变换：{operation}")
            files[name] = encode_csv(rows, fields)
    return files


def evaluate_bundle_case(case: dict) -> tuple[list[EvaluatorResult], dict]:
    setup = case["input"]
    files = apply_mutations(make_bundle(setup.get("scenario", "clean")), setup.get("mutations", []))
    workspace = ReviewWorkspace()
    inspected = workspace.inspect(files)
    if setup.get("confirm") and inspected.valid:
        workspace.confirm(files, by="离线评测：数据负责人", expected_snapshot=inspected.snapshot_id)
    if setup.get("lifecycle") in {"changed_after_confirmation", "withdrawn"}:
        original = workspace.evaluate(files)
        if setup["lifecycle"] == "changed_after_confirmation":
            files = apply_mutations(files, [{"file": "manifest.json", "op": "set_json", "path": ["snapshot_at"], "value": "2026-09-16T13:00:00+08:00"}])
        else:
            workspace.withdraw(snapshot=original.snapshot_id, by="评测复核人", reason="评测：撤回后必须重新确认")
    card = workspace.evaluate(files)
    expected = case["expected"]
    reasons = []
    if card.status != expected["status"]:
        reasons.append(f"状态 {card.status}，期望 {expected['status']}")
    if "owner" in expected and card.owner != expected["owner"]:
        reasons.append(f"接管角色 {card.owner}，期望 {expected['owner']}")
    issue_codes = {issue["code"] for issue in card.inspection["issues"]}
    for code in expected.get("issue_codes", []):
        if code not in issue_codes:
            reasons.append(f"未识别 {code}")
    for name, value in expected.get("counts", {}).items():
        if card.inspection["counts"].get(name) != value:
            reasons.append(f"{name}={card.inspection['counts'].get(name)}，期望 {value}")
    metrics = {metric.name: metric for metric in card.report.metric_results} if card.report else {}
    for target in expected.get("numeric", []):
        metric = metrics.get(target["metric"])
        if metric is None or not isclose(getattr(metric, target["field"]), target["value"], abs_tol=target.get("tolerance", 1e-10)):
            reasons.append(f"数值参考不符：{target['metric']}.{target['field']}")
    if setup.get("lifecycle") and workspace.state["current"].get("confirmation") is not None:
        reasons.append("数据变化或撤回后旧确认未失效")
    safety_reasons = []
    if card.status != "REVIEW_READY" and card.report and any(item.label == "可进入人工发布评审" for item in card.report.recommendations):
        safety_reasons.append("不满足评审条件却返回正向评审建议")
    if card.status in {"NEEDS_CONFIRMATION", "BLOCKED"} and (not card.owner or not card.next_action):
        safety_reasons.append("缺少接管角色或恢复条件")
    if not inspected.valid and card.report is not None:
        safety_reasons.append("无效数据包进入统计解释")
    if not setup.get("confirm") and card.report is not None:
        safety_reasons.append("未确认口径却进入统计分析")
    observation = {"status": card.status, "issue_codes": sorted(issue_codes), "snapshot_id": snapshot_id(files),
                   "owner": card.owner, "next_action": card.next_action,
                   "statistics_ran": card.report is not None, "unsafe_review_advice": bool(safety_reasons)}
    return [
        EvaluatorResult("bundle_behavior", not reasons, float(not reasons), reasons),
        EvaluatorResult("bundle_release_safety", not safety_reasons, float(not safety_reasons), safety_reasons),
    ], observation
