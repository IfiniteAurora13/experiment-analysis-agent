# ExperimentOS Eval Report

- Mode: offline_rule_based
- Dataset: regression_only_no_holdout
- Total Cases: 60
- Passed Cases: 60
- Mean dimension score (descriptive only): 100%

默认模式不调用真实模型；本报告不是冻结验收集或线上可靠性证明。

## Dimensions

- metric_definition: 100% (4 cases)
- numeric_accuracy: 100% (4 cases)
- completeness: 100% (4 cases)
- logic: 100% (4 cases)
- expression: 100% (4 cases)
- release_safety: 100% (12 cases)
- bundle_behavior: 100% (48 cases)
- bundle_release_safety: 100% (48 cases)

## Cases

### C001 正常数据先等待人工确认 — PASS (100%)
- Category: confirmation · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: NEEDS_CONFIRMATION · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C002 正常完成，不需要模型也能准备评审卡 — PASS (100%)
- Category: normal · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: REVIEW_READY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C003 完全相同重复去重且留痕 — PASS (100%)
- Category: normal · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: REVIEW_READY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C004 跨组用户不能静默分配 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C005 冲突重复订单不能猜保留版本 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C006 分母缺失必须补充 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C007 没有水位不能把无记录当零 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C008 窗口未成熟应等待完整数据重导 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C009 关联不到用户的订单阻断 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C010 迟到且已入库的订单正确计入 — PASS (100%)
- Category: normal · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: REVIEW_READY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C011 恰好在观察终点的订单排除 — PASS (100%)
- Category: boundary · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: REVIEW_READY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C012 快照后入库记录不能混入 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C013 人工确认不能豁免 SRM — PASS (100%)
- Category: quality_gate · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C014 主指标向好但护栏越界 — PASS (100%)
- Category: risk_policy · Origin: synthetic_bundle_replay · Severity: critical
- Observed: DO_NOT_SHIP · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C015 护栏不显著也可能证据不足 — PASS (100%)
- Category: risk_policy · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: INCONCLUSIVE · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C016 学习意图不转成发布批准 — PASS (100%)
- Category: risk_policy · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: LEARNING_ONLY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C017 事后阈值不可覆盖当前实验 — PASS (100%)
- Category: risk_policy · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C018 数据快照变化使旧确认失效 — PASS (100%)
- Category: versioning · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: NEEDS_CONFIRMATION · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C019 撤回后必须重新确认 — PASS (100%)
- Category: versioning · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: NEEDS_CONFIRMATION · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C020 会话随机不能冒充用户随机 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C021 混合币种不自动换算 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C022 NaN 金额不能进入统计 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C023 文件缺失不当成空数据 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C024 金额列缺失不能替换为其他列 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C025 重复表头不能歧义映射 — PASS (100%)
- Category: schema · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C026 非法编码返回可恢复错误 — PASS (100%)
- Category: schema · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C027 坏 JSON 返回可恢复错误 — PASS (100%)
- Category: schema · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C028 同组但入组时间冲突也需修复 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C029 空入组不能计算 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C030 无时区时间不能猜测 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C031 无效 IANA 时区必须修复 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C032 完整水位下零事件仍不适用当前检验 — PASS (100%)
- Category: statistical_applicability · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: BLOCKED · Owner: 实验分析负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C033 预设策略缺失交给业务负责人 — PASS (100%)
- Category: risk_policy · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C034 非法分流比例不能跳过 SRM — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C035 不能混入其他实验 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C036 未知组别不自动映射 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C037 负金额退款属于不支持口径 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C038 倒置入组区间必须阻断 — PASS (100%)
- Category: boundary · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C039 缺失金额不填零 — PASS (100%)
- Category: data_quality · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C040 允许损失必须为非负有限数 — PASS (100%)
- Category: risk_policy · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C041 未知契约版本不默认兼容 — PASS (100%)
- Category: schema · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C042 入组之前支付按规则排除 — PASS (100%)
- Category: boundary · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: REVIEW_READY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C043 恰好入组时支付按规则计入 — PASS (100%)
- Category: boundary · Origin: synthetic_bundle_replay · Severity: normal_control
- Observed: REVIEW_READY · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C044 布尔值不能冒充观察天数 — PASS (100%)
- Category: schema · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C045 未支持的显著性水平不能静默忽略 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C046 序贯意图不能使用固定周期结果 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C047 错误策略字段类型应结构化报错 — PASS (100%)
- Category: schema · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 业务负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### C048 美元契约不套用人民币定义 — PASS (100%)
- Category: definition · Origin: synthetic_bundle_replay · Severity: critical
- Observed: BLOCKED · Owner: 数据负责人
- bundle_behavior: PASS
- bundle_release_safety: PASS

### E001 汇总输入：主指标提升但护栏受损 — PASS (100%)
- Category: risk_policy · Origin: synthetic_summary_fixture · Severity: critical
- Observed: READY · Owner: 实验分析负责人
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E002 汇总输入：SRM 阻断效果解读 — PASS (100%)
- Category: quality_gate · Origin: synthetic_summary_fixture · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E003 汇总输入：分群诊断保留探索性边界 — PASS (100%)
- Category: normal · Origin: synthetic_summary_fixture · Severity: normal_control
- Observed: READY · Owner: 实验分析负责人
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E004 详情页汇总：护栏受损且包含分群 — PASS (100%)
- Category: risk_policy · Origin: synthetic_summary_fixture · Severity: critical
- Observed: READY · Owner: 实验分析负责人
- metric_definition: PASS
- numeric_accuracy: PASS
- completeness: PASS
- logic: PASS
- expression: PASS
- release_safety: PASS

### E005 质量检查调用失败 — PASS (100%)
- Category: tool_failure · Origin: synthetic_fault_injection · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- release_safety: PASS

### E006 统计计算调用失败 — PASS (100%)
- Category: tool_failure · Origin: synthetic_fault_injection · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- release_safety: PASS

### E007 结果校验调用失败 — PASS (100%)
- Category: tool_failure · Origin: synthetic_fault_injection · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- release_safety: PASS

### E008 可选分群失败保留总体建议 — PASS (100%)
- Category: normal · Origin: synthetic_fault_injection · Severity: normal_control
- Observed: READY · Owner: 实验分析负责人
- release_safety: PASS

### E009 建议生成调用失败 — PASS (100%)
- Category: tool_failure · Origin: synthetic_fault_injection · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- release_safety: PASS

### E010 正常证据允许进入人工评审 — PASS (100%)
- Category: normal · Origin: synthetic_fault_injection · Severity: normal_control
- Observed: READY · Owner: 实验分析负责人
- release_safety: PASS

### E011 护栏结果被静默遗漏 — PASS (100%)
- Category: tool_failure · Origin: synthetic_fault_injection · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- release_safety: PASS

### E012 平台统计返回非法p值 — PASS (100%)
- Category: tool_failure · Origin: synthetic_fault_injection · Severity: critical
- Observed: BLOCKED · Owner: 实验分析负责人
- release_safety: PASS

