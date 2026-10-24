# 固定导出包规范 v1

只做用户随机、两个组、固定周期、一个主指标和一个护栏。此规范用于本地原型；内部一致性校验不能认证真实随机化、源系统完整性或上游声明。

## 四个文件

每文件最多 5 MiB，UTF-8，可带 BOM。CSV 必填列不能空，表头不能重复，不能多出未命名字段。额外命名列不参与计算；去重比较契约内字段。所有原始字节都会影响版本。

| 文件 | 必填内容 |
| --- | --- |
| assignments.csv | experiment_id,user_id,variant,assigned_at |
| orders.csv | order_id,user_id,paid_at,paid_amount,currency,ingested_at |
| contract.json | 见下方固定定义和策略 |
| manifest.json | 快照时间、两类完整性水位、证据与来源 |

入组日志应来自策略影响前的分流系统，不能只导出点击或支付后的人群。user_id 是随机化单位；同一用户重复且契约字段一致可去重，跨组或入组时间冲突必须修复。

订单文件只包含当前实验入组用户。订单 ID 一致而内容冲突不能自动选最新；关联不到用户、混合币种、负金额退款和快照后入库数据均阻断。金额支持非负、最多两位小数的 CNY，当前不处理退款抵扣或汇率。

## 观察窗口与分母

- 入组范围为 enrollment_start <= assigned_at < enrollment_end。
- 每个用户支付窗口为 assigned_at <= paid_at < assigned_at + 168 小时，非自然日，端点不计入。
- 分母是每组唯一入组用户；不能用订单数、曝光次数或每日 UV 累加代替。
- 转化人数是窗口内至少一笔支付订单的唯一用户数，零金额支付订单仍是支付事件。
- 每用户 GMV 先按人汇总窗口内支付金额，再在全部入组用户上算均值与无偏样本方差。
- 迟到但在快照前已入库的窗口内订单计入；窗口外订单明确排除并计数。

所有时间必须带 ISO 时区偏移。timezone 是 IANA 时区；固定观察窗始终为连续 168 小时，时区只用于显示和日期描述。

## 完整性声明不是最大时间戳

manifest 至少包含：

- snapshot_at：这次导出快照时刻。
- assignments_complete_through：入组日志已齐全到哪里，必须覆盖入组结束。
- orders_complete_through：支付事件完整性水位，必须覆盖入组结束 + 168 小时。
- source_evidence：上游任务、水位、工单或说明的可核对标识。
- origin：synthetic 或 user_export，仅为来源声明，不是认证。

水位不能晚于快照。等到水位覆盖只是必要条件；负责人还须确认来源、缺失与延迟处理。没有水位或窗口未成熟时，不生成补零的统计结论。

## contract.json

运行 python -m experimentos.demo_data 可得到完整合成示例。固定字段为：

- schema_version=1，randomization_unit=user，observation_days=7。
- analysis_mode=fixed_horizon，alpha=0.05。
- conversion_event=paid_order，denominator=all_assigned_users。
- zero_policy=after_watermark_only，refunds=not_deducted，currency=CNY。
- experiment_id、objective、timezone、入组起止时刻和 expected_control_ratio 必填。
- policy.intent 为 conversion_guarded 或 learning。
- policy.max_gmv_loss_per_user 为非负有限 CNY / 用户允许损失。
- policy.declared_at 不晚于入组开始。文件不能证明声明真实，负责人应核对原始实验计划。

缺失定义和不支持的口径直接要求补充，不让模型猜测映射。

## 方法适用性与风险规则

本地转化检验为 pooled z-test + Wald 区间。保守限制为每组支付及未支付人数均不少于 5；这是工程拒绝边界，不是功效或统计误差保证。触发后交实验分析负责人选择适用方法，不自动增加样本直到显著。

一个主指标需形成正向证据；护栏使用双侧 95% 绝对差值区间保守判断。若允许损失为 δ，护栏区间 [L,U]：

- L > -δ：满足这项损失约束。
- U < -δ：明确超出允许损失，不支持推进。
- 其他：证据不足，包括边界相等情况。

这不是完整平台的联合风险或多重检验保证。学习意图只记录学习结果。SRM、必检异常、数据无效不能被业务偏好豁免。

## 确认、失效与撤回

确认绑定四文件完整 SHA-256；任何字节变化都重新确认，即使只改了格式。评审卡另绑定策略与计算结果。数据更新后旧卡进入 SUPERSEDED，撤回保留 WITHDRAWN 记录并清除当前确认。

本地复核记录只表示某人署名完成复核，不能代替企业权限、电子签名或上线授权。工作台记录在会话中；CLI --store 使用本地 JSON 持久保存，面向单用户，不提供并发写入或不可篡改承诺。
