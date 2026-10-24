# BC005：检查失败，被当成“没有检查出问题”

来源：2026-10-23 对 upstream main@121cfc5 的合成故障注入；不是生产事故。使用商品详情页 fixture，保留核心指标 uplift，将 GMV 护栏改为持平，仅令 QualityChecker.run 抛出异常。

## 实际失败

[修复前原始运行记录](evidence/BC005_before.json)显示：quality_check 在 trace 中报错，总状态为 DONE_WITH_CONCERNS，但仍有“建议小流量灰度或继续推进发布评审”。

原因：执行器捕获异常后继续；建议引擎只看到空 quality_issues，没有确认质量检查是否成功。warning 没有成为建议生成的前置条件。

## 产品调整

1. 空问题列表不能证明检查通过：必检状态区分 PASS、FAIL、UNKNOWN。
2. 只有质量检查、全部输入指标的统计结果、结果校验均通过后才调用建议工具。
3. 必检未完成或无效时，评审为 BLOCKED，输出实验分析负责人和重跑条件；计算仅用于排障。
4. 分群是可选步骤，其失败允许保留已验证总体结论。
5. 被阻断报告不交给模型重写；建议生成失败或被预算跳过也必须返回明确接管。

取舍：允许保留部分计算，不允许部分计算被当作完整发布证据。READY 只是当前内置检查通过，不是业务批准。

## 修复后证据

[最终报告](evidence/BC005_after.md) · [结构化运行记录](evidence/BC005_after.json)

质量检查 UNKNOWN；统计计算与结果校验 PASS；评审 BLOCKED；make_recommendation 未被调用；建议改为“暂缓发布结论”。

运行：

```bash
python -m evals.replay_quality_failure
python -m pytest -q tests/test_review_gate.py
python -m evals.runner --no-write
```

基线记录来自未改动的 upstream main@121cfc5 源码快照，使用相同数据和同一 Python 环境。修复后标签 portfolio-step1 表示本次变更快照。原始记录保存实际 trace；调用耗时可能随机器变化。

回归：E005 检查质量工具失败；E006–E012 检查其他必检失败、可选降级、正常路径、结果遗漏和非法返回。测试还覆盖跳过质量检查、预算耗尽以及阻断报告绕过模型。

## 尚未覆盖

原始数据缺失/迟到、口径确认、策略允许损失界值、持久化签字撤回、READY 报告的真实模型文案保真度仍在后续阶段。
