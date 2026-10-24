from __future__ import annotations

import argparse
import json

from experimentos.intake import read_bundle
from experimentos.review import ReviewWorkspace


def main() -> None:
    parser = argparse.ArgumentParser(description="导入固定 CSV 数据包，确认口径后生成本地评审卡。")
    parser.add_argument("folder")
    parser.add_argument("--store", default=".review_state/ledger.json")
    parser.add_argument("--confirm-by")
    parser.add_argument("--snapshot", help="显式确认的完整数据包 SHA-256；数据变化后必须重新核对")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--withdraw-by")
    parser.add_argument("--reason")
    args = parser.parse_args()
    try:
        workspace = ReviewWorkspace(args.store)
        files = read_bundle(args.folder)
        if args.confirm_by:
            if not args.snapshot:
                parser.error("确认必须同时提供 --snapshot；不能自动确认当前输入。")
            workspace.confirm(files, by=args.confirm_by, expected_snapshot=args.snapshot)
        if args.withdraw_by:
            workspace.inspect(files)
            workspace.withdraw(snapshot=args.snapshot or "", by=args.withdraw_by, reason=args.reason or "")
            print("本地评审卡已撤回；未执行任何线上变更。")
            return
        card = workspace.evaluate(files)
    except (ValueError, OSError) as exc:
        parser.error(str(exc))
    print(json.dumps(card.to_dict(), ensure_ascii=False, indent=2) if args.format == "json" else card.markdown())
    if args.format != "json" and card.status in {"BLOCKED", "NEEDS_CONFIRMATION"}:
        print(f"\n完整数据包版本：{card.snapshot_id}")


if __name__ == "__main__":
    main()
