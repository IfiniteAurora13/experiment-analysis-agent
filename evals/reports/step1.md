# ExperimentOS Eval Report

- Mode: offline_rule_based
- Dataset: regression_only_no_holdout
- Total Cases: 12
- Passed Cases: 12
- Mean dimension score (descriptive only): 100%

默认模式不调用真实模型；本报告不是冻结验收集或线上可靠性证明。

## Dimensions

- metric_definition: 100% (4 cases)
- numeric_accuracy: 100% (4 cases)
- completeness: 100% (4 cases)
- logic: 100% (4 cases)
- expression: 100% (4 cases)
- release_safety: 100% (12 cases)

## Cases

### E001 — PASS (100%)
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E002 — PASS (100%)
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E003 — PASS (100%)
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E004 — PASS (100%)
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E005 — PASS (100%)
- release_safety: PASS

### E006 — PASS (100%)
- release_safety: PASS

### E007 — PASS (100%)
- release_safety: PASS

### E008 — PASS (100%)
- release_safety: PASS

### E009 — PASS (100%)
- release_safety: PASS

### E010 — PASS (100%)
- release_safety: PASS

### E011 — PASS (100%)
- release_safety: PASS

### E012 — PASS (100%)
- release_safety: PASS

## Verification

- Python 3.12.15; 82 tests passed; baseline existing suite: 65 passed.
- New quality-failure assertion failed on upstream 121cfc5 before the fix.
- CLI, offline quality-failure replay, Streamlit default/SRM/Mock and browser DOM behavior verified.
- Synthetic inputs only; no live model, production data or holdout set.
