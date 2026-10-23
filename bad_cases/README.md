# Bad Case 闭环

每个 Bad Case 都必须描述失败输入、预期与实际、根因、修复动作和对应的 Eval 回归用例。

闭环：`Bad Case → Root Cause → Prompt / Skill / Workflow Fix → Regression Case → Eval Score`。

当前示例：

- [BC006：极端小样本与方法适用性](BC006_sparse_conversion.md)：合成受控消融，附启用/禁用适用性检查的原始记录；不是生产事故。

- [BC005：质量检查失败却仍建议发布](BC005_quality_check_unavailable.md)：已在 upstream main@121cfc5 通过合成故障注入复现，附原始前后证据与 E005–E012 回归；不是生产事故。
- 下面的 BC001–BC004 为历史机制示例；没有相应原始运行记录时，不得据此宣称真实用户事故或线上收益。

- `BC001`：分群结果被过度表述为因果结论，回归用例为 `E003`。
- `BC002`：SRM 风险未阻断发布建议，回归用例为 `E002`。
- `BC003`：缺少统计字段，回归用例为 `E001`。
