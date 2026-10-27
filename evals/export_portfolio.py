"""Export genuine Python runs for a transparent, backend-free portfolio replay."""

from __future__ import annotations

import json
import argparse
import re
from collections import defaultdict
from pathlib import Path

from experimentos.demo_data import make_bundle
from experimentos.intake import snapshot_id
from experimentos.review import ReviewWorkspace
from experimentos.agent.review_task import ReviewAgent, DEMO_QUESTION, DEMO_BRIEF, DEMO_DICTIONARY
from evals.bundle_cases import apply_mutations
from evals.runner import EvalRunner


ROOT = Path(__file__).resolve().parents[1]


def agent_replay():
    agent = ReviewAgent()
    files = make_bundle()
    documents = {"实验说明": DEMO_BRIEF, "指标字典": DEMO_DICTIONARY}
    stages = [agent.step(files, question=DEMO_QUESTION, documents=documents)]
    agent.resolve(field="denominator", by="合成回放：数据负责人", expected_version=stages[0]["version"])
    stages.append(agent.step(files, question=DEMO_QUESTION, documents=documents))
    agent.confirm(files, question=DEMO_QUESTION, documents=documents, by="合成回放：数据负责人", expected_version=stages[1]["version"])
    stages.append(agent.step(files, question=DEMO_QUESTION, documents=documents))
    return {"mode": "offline_material_workflow", "description": "合成文本、离线规则执行；没有真实模型调用。", "documents": documents, "stages": stages}


def _card_payload(card) -> dict:
    return {**card.to_dict(), "markdown": card.markdown()}


def replay(scenario: str) -> dict:
    workspace = ReviewWorkspace()
    files = make_bundle("clean" if scenario in {"stale_confirmation", "withdrawn"} else scenario)
    if scenario in {"stale_confirmation", "withdrawn"}:
        workspace.confirm(files, by="合成回放：数据负责人", expected_snapshot=snapshot_id(files))
        previous = workspace.evaluate(files)
        if scenario == "stale_confirmation":
            files = apply_mutations(files, [{"file": "manifest.json", "op": "set_json", "path": ["snapshot_at"], "value": "2026-09-16T13:00:00+08:00"}])
        else:
            workspace.withdraw(snapshot=previous.snapshot_id, by="合成回放：复核人", reason="示例：需要重新检查口径")
    inspected = workspace.evaluate(files)
    payload = {"inspection": _card_payload(inspected), "confirmed": None, "recovery": None}
    if inspected.inspection["valid"]:
        workspace.confirm(files, by="合成回放：数据负责人", expected_snapshot=snapshot_id(files))
        payload["confirmed"] = _card_payload(workspace.evaluate(files))
    elif scenario in {"cross_group", "immature", "missing_watermark", "missing_definition"}:
        fixed = make_bundle("clean")
        before = workspace.evaluate(fixed)
        workspace.confirm(fixed, by="合成回放：修复负责人", expected_snapshot=snapshot_id(fixed))
        payload["recovery"] = {"inspection": _card_payload(before), "confirmed": _card_payload(workspace.evaluate(fixed))}
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="从真实 Python 运行导出或校验作品集回放。")
    parser.add_argument("--check", action="store_true", help="仅检查已提交回放与当前实现的语义一致性，不写文件")
    args = parser.parse_args()
    runner = EvalRunner()
    cases = runner.load_cases(ROOT / "evals/cases")
    results = runner.run_cases(cases)
    summary = runner._summary(results)
    if any(not item.passed for item in results):
        raise SystemExit("Eval 未通过，拒绝导出通过状态的作品集回放。")
    specifications = [
        ("clean", "正常评审", "先检查原始数据，再确认口径，最后查看收益与风险。"),
        ("immature", "等待数据 → 修复重跑", "水位未覆盖完整窗口时暂停；替换完整数据包后重新确认。"),
        ("cross_group", "跨组用户 → 人工接管", "随机化单位被污染时不猜测分组；修复关联链路后重跑。"),
        ("missing_definition", "分母歧义 → 补充定义", "缺少指标分母时停下，不把曝光次数当作入组人数。"),
        ("guardrail_harm", "收益与护栏冲突", "主指标提升，也不能越过事先约定的支付 GMV 损失边界。"),
        ("guardrail_uncertain", "护栏证据不足", "没有显著恶化，不等于已经证明损失可接受。"),
        ("stale_confirmation", "旧确认自动失效", "数据快照更新后，上一版评审卡及确认不再沿用。"),
        ("withdrawn", "撤回本地评审卡", "撤回清除当前确认；再次评审需要重新核对口径。"),
        ("duplicates", "重复记录正确处理", "完全相同的记录去重并留痕；冲突重复会阻断。"),
        ("late_arrival", "迟到订单正确计入", "窗口内订单只要已入库且水位齐全，就应纳入相应用户。"),
        ("learning", "学习意图", "预设学习目标的实验记录结论，不自动转成发布建议。"),
    ]
    scenarios = [{"id": key, "name": name, "description": description, **replay(key)} for key, name, description in specifications]
    categories = defaultdict(lambda: {"total": 0, "passed": 0})
    for case in summary["cases"]:
        category = case.get("category", "legacy_workflow")
        categories[category]["total"] += 1
        categories[category]["passed"] += int(case["passed"])
    data = {
        "mode": "synthetic_python_replay", "engine_version": "bundle-review-v1",
        "scenarios": scenarios, "evaluation": summary, "categories": dict(categories), "agent_demo": agent_replay(),
        "limits": ["合成数据与本地回放", "全部为回归案例，尚无独立冻结验收集", "不调用真实模型，不证明 Agent 相对基线的收益", "确认是本地署名，不认证企业身份，也不执行上线"],
    }
    output = ROOT / "docs/data"
    if args.check:
        existing = (output / "replays.js").read_text(encoding="utf-8")
        existing = json.loads(existing.removeprefix("window.EXPERIMENT_REVIEW_DATA = ").strip().removesuffix(";"))
        if _semantic(existing) != _semantic(data):
            raise SystemExit("回放与当前代码不一致，请重新运行 python -m evals.export_portfolio。")
        print("已提交的回放与当前 Python 行为一致（忽略运行时刻、耗时和浮点尾差）。")
        return
    report_dir = ROOT / "evals/reports"
    (report_dir / "step2.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (report_dir / "step2.md").write_text(runner._markdown(summary) + "\n", encoding="utf-8")
    (report_dir / "sample_review_card.md").write_text(scenarios[0]["confirmed"]["markdown"] + "\n", encoding="utf-8")
    (report_dir / "agent_loop.json").write_text(json.dumps(data["agent_demo"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    output.mkdir(parents=True, exist_ok=True)
    (output / "replays.js").write_text("window.EXPERIMENT_REVIEW_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"已导出 {len(scenarios)} 条 Python 回放，Eval {summary['passed_cases']}/{summary['total_cases']}。")


def _semantic(value):
    if isinstance(value, dict):
        return {key: _semantic(item) for key, item in value.items() if key not in {"at", "latency_ms", "card_id", "reviewed_card_id", "task_id"}}
    if isinstance(value, list):
        return [_semantic(item) for item in value]
    if isinstance(value, float):
        return round(value, 8)
    if isinstance(value, str) and "\n" in value:
        # Derived card hashes may differ with harmless floating-point tails;
        # standalone input fingerprints remain exact elsewhere in the payload.
        return re.sub(r"\b[0-9a-f]{64}\b", "<version-hash>", value)
    return value


if __name__ == "__main__":
    main()
