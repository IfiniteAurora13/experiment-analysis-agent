# Bad Case 闭环

每个 Bad Case 都必须描述失败输入、预期与实际、根因、修复动作和对应的 Eval 回归用例。

闭环：`Bad Case → Root Cause → Prompt / Skill / Workflow Fix → Regression Case → Eval Score`。

当前示例：

- `BC001`：分群结果被过度表述为因果结论，回归用例为 `E003`。
- `BC002`：SRM 风险未阻断发布建议，回归用例为 `E002`。
- `BC003`：缺少统计字段，回归用例为 `E001`。
