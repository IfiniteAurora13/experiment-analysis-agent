"""Replay a custom material through confirmation and a fresh UI session.

Synthetic, offline developer regression; not a user study or model evaluation.
"""
from __future__ import annotations

import argparse
import json
import os
import tempfile
from pathlib import Path

from streamlit.testing.v1 import AppTest


ROOT = Path(__file__).resolve().parents[1]
DICTIONARY = "指标字典：支付转化率的分母为曝光用户；观察窗口为7天。"


def replay():
    previous = os.environ.get("EXPERIMENTOS_TASK_STORE")
    try:
        with tempfile.TemporaryDirectory(prefix="material-replay-") as directory:
            os.environ["EXPERIMENTOS_TASK_STORE"] = str(Path(directory) / "task.json")
            app_path = str(ROOT / "experimentos/app/streamlit_app.py")
            app = AppTest.from_file(app_path).run(timeout=30)
            app.selectbox[0].set_value("guardrail_harm").run(timeout=30)
            dictionary_field = lambda current: next(item for item in current.text_area if item.label == "指标字典 / 补充材料")
            button = lambda current, label: next(item for item in current.button if item.label == label)
            dictionary_field(app).set_value(DICTIONARY).run(timeout=30)
            app.checkbox[0].set_value(True)
            button(app, "确认契约，继续评审").click().run(timeout=30)
            app.checkbox[0].set_value(True)
            button(app, "确认口径并分析").click().run(timeout=30)
            before = app.session_state["review_agent"].state
            before_view = before["last_view"]
            before_record = {"dictionary": dictionary_field(app).value, "version": before["version"],
                             "status": before_view["status"], "resolved_fields": list(before["resolved"])}
            resumed = AppTest.from_file(app_path).run(timeout=30)
            after = resumed.session_state["review_agent"].state
            after_record = {"dictionary": dictionary_field(resumed).value, "version": after["version"],
                            "status": after["last_view"]["status"], "resolved_fields": list(after["resolved"])}
            return {"origin": "synthetic_offline_ui_replay", "scenario": "guardrail_harm_with_custom_dictionary",
                    "expected_dictionary": DICTIONARY, "before_new_session": before_record, "after_new_session": after_record,
                    "checks": {"material_retained": after_record["dictionary"] == DICTIONARY,
                               "same_input_version": before_record["version"] == after_record["version"],
                               "confirmed_result_retained": after_record["status"] == "DO_NOT_SHIP",
                               "resolution_retained": "denominator" in after_record["resolved_fields"]}}
    finally:
        if previous is None:
            os.environ.pop("EXPERIMENTOS_TASK_STORE", None)
        else:
            os.environ["EXPERIMENTOS_TASK_STORE"] = previous


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output")
    args = parser.parse_args()
    result = replay()
    if args.output:
        path = Path(args.output)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if all(result["checks"].values()) else 1)


if __name__ == "__main__":
    main()
