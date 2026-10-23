"""Controlled ablation of the applicability gate, never a production incident."""

import json
from pathlib import Path
from unittest.mock import patch

from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.analysis.quality_checks import QualityChecker
from experimentos.models import ExperimentRequest


def main():
    payload = {
        "question": "请复核小样本实验是否支持推进发布评审。",
        "task_type": "release_recommendation",
        "context": {"objective": "提升支付转化且不损害每用户收入", "start_date": "2026-09-01", "end_date": "2026-09-15"},
        "metrics": [
            {"name": "paid_user_cvr", "kind": "conversion", "role": "core", "control_n": 2, "treatment_n": 2,
             "control_successes": 0, "treatment_successes": 2},
            {"name": "paid_gmv_per_user", "kind": "continuous", "role": "guardrail", "control_n": 2, "treatment_n": 2,
             "control_value": 0, "treatment_value": 0, "control_var": 0, "treatment_var": 0},
        ],
    }
    with patch.object(QualityChecker, "_check_sparse_conversion", return_value=[]):
        before = ExperimentOrchestrator().run(ExperimentRequest.from_dict(payload))
    after = ExperimentOrchestrator().run(ExperimentRequest.from_dict(payload))
    assert any(item.label == "建议小流量灰度或继续推进发布评审" for item in before.recommendations)
    assert after.review_gate.status == "BLOCKED"
    record = {"case_id": "BC006", "origin": "synthetic_controlled_ablation", "input": payload,
              "ablation": "before disables only the new sparse-conversion applicability check",
              "before": before.to_dict(), "after": after.to_dict()}
    output = Path("bad_cases/evidence/BC006_sparse_conversion.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("已复现：禁用适用性检查时会建议推进；启用后 BLOCKED。不是生产事故。")


if __name__ == "__main__":
    main()
