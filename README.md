# ExperimentOS｜电商实验上线评审助手

帮助增长 PM 把商品详情页 A/B 实验的原始数据整理成**可复核、可接管、可撤回的本地评审卡**。用户级随机、固定周期，一个主指标加一个护栏。

[任务回放与评测页面](https://ifiniteaurora13.github.io/experiment-analysis-agent/) · [当前改动 PR](https://github.com/IfiniteAurora13/experiment-analysis-agent/pull/1) · [评审卡样例](evals/reports/sample_review_card.md) · [数据契约](product/data_contract.md)

> 当前改动位于 PR 分支；GitHub Pages 须在合并部署后更新。本地可直接打开 docs/index.html。页面是 Python 真实运行结果的交互回放；实际 CSV 导入使用本地工作台。

## 1. 谁在什么时刻使用

电商增长 PM 已结束商品详情页改版实验，需要协调数据负责人核对分母、窗口和数据完整性，再向业务负责人提交评审材料。

输入 assignments.csv、orders.csv、contract.json、manifest.json；输出当前判断、证据、接管角色和恢复条件。没有上游完整性声明时，不把无订单记录当成零支付；数据或口径变化后，旧确认失效。

目标用户与任务仍是待验证假设。当前样例和评测均为合成数据，没有用户研究、生产接入或业务收益结论。

## 2. 非 AI 基线与 Agent 增量

产品主路径是**可运行的非 AI 基线**：固定数据契约、确定性统计与策略、显式确认和模板评审卡，不调用模型，也不自动执行上线。

保留受约束的 LLM 规划作为旧汇总实验室的可选能力。Agent 后续应证明在跨材料核对、关键澄清和补证路径上减少返工；结构化材料齐全时，不要求使用模型。

尚无真实模型优于基线的证据。[用户研究与对照任务包](product/user_research_kit.md)列出了后续验证方式，不用模型调用次数代替产品价值。

## 3. 看三条完整任务

| 路径 | 产品行为 | 可核查证据 |
| --- | --- | --- |
| 正常完成 | 检查原始数据 → 署名确认口径 → 计算收益与风险 → 人工评审 | [样例评审卡](evals/reports/sample_review_card.md)、C001–C003 |
| 正确阻断 | 跨组、缺口径、水位未成熟、SRM 或必检异常时停止推进，给出接管角色 | C004–C009、C013、E005–E012 |
| 修复后恢复 | 替换修复包 → 旧卡失效 → 重新确认 → 重算；撤回也清除当前确认 | C018–C019、页面中的修复回放 |

浏览器页从同一套 Python 逻辑导出 11 条回放，不维护第二套统计引擎。CI 会检查已提交回放是否与当前代码一致。

## 4. 决策与失败边界

- 主指标：每人入组后连续 168 小时内支付用户数 / 全部唯一入组用户。
- 护栏：同窗口支付 GMV / 入组用户，CNY，未扣退款。
- 质量、全部指标结果和统计校验区分 PASS / FAIL / UNKNOWN；未完成不能当通过。
- 完全一致的契约内重复记录去重并留痕；跨组或冲突重复不猜测保留版本。
- 风险阈值事先声明。护栏区间在允许损失内、明确越界、跨越边界，分别进入人工评审、不支持推进、证据不足。
- 数据完整与方法适用分开检查。稀疏转化不把当前 z-test / Wald 区间当作发布证据。
- 学习意图不生成发布建议；任何人工确认都不能豁免 SRM 或失败的必检。
- 本地署名与撤回是流程记录，不是企业身份认证、不可篡改审计或生产发布控制。

## 5. 评测证据

**60 / 60 合成离线回归场景通过**：12 个既有工作流 / 工具故障场景，加 48 个原始数据、口径、时间边界、策略与版本场景。

[逐例报告](evals/reports/step2.md) · [完整结果 JSON](evals/reports/step2.json) · [案例分类与交付门槛](evals/README.md) · [CSV 行为案例](evals/cases/C001_C048_bundle_review.json) · [测试](tests/)

页面按类型展示分母、预期与实际状态。既有数值评估覆盖 4 例；新增 CSV 数值参考包含在 bundle_behavior 中，不能将总案例数写成每个维度都覆盖 60 例。

全部案例用于回归，**尚无独立冻结验收集或真实 LLM 端到端成绩**。通过这些案例不等于线上错误率为零，也不证明用户任务效率提升。

## 6. 两次改变设计的失败

- [BC005：质量检查失败却仍建议推进](bad_cases/BC005_quality_check_unavailable.md)。空问题列表被误当成检查通过；修复为完成性门禁和固定阻断报告。
- [BC006：极端小样本被正态近似判为可推进](bad_cases/BC006_sparse_conversion.md)。禁用适用性检查可复现错误建议；当前明确阻断并交分析负责人。采用保守边界，先拒绝不适用输入，不横向堆统计方法。

上述证据来自合成故障注入或受控消融，不是生产事故。

## 7. 已做与暂停投入

已实现固定 CSV 导入、口径确认、完整性水位、用户级聚合、分级护栏、本地版本失效 / 人工复核 / 撤回、评审卡下载、分层回归和任务回放。

暂停 CUPED、贝叶斯、序贯检验、多 Agent、任意 SQL、更多 Provider 和自动上线。公式拆解只作为说明，不宣传自动归因。

[产品简报](product/brief.md) · [分阶段路线与未完成项](product/roadmap.md) · [求职叙事与证据边界](product/portfolio_story.md)

## 本地运行

需要 Python 3.11+。在仓库根目录安装：

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[dev]'
streamlit run experimentos/app/streamlit_app.py
```

默认入口为数据包评审；可使用合成场景或上传四个本地文件。主路径不调用远端模型。工作台历史保留在当前会话；CLI 可持久保存。

## 命令行：导入 → 确认 → 评审

生成一个明确标为合成的示例包：

```bash
python -m experimentos.demo_data --output examples/generated_bundle
python -m experimentos.app.bundle_cli examples/generated_bundle
```

先阅读输出中的口径、水位与完整数据包版本，再将实际版本填入命令；不提供自动确认开关：

```bash
python -m experimentos.app.bundle_cli examples/generated_bundle \
  --confirm-by '演示数据负责人' --snapshot '填写刚刚核对的完整版本'
```

确认只绑定当前数据包；任何文件字节变化都会使旧确认失效。本地历史默认保存在 .review_state/ledger.json。

```bash
python -m experimentos.app.bundle_cli examples/generated_bundle \
  --withdraw-by '演示复核人' --reason '发现口径需要重核' --snapshot '当前完整版本'
```

撤回评审卡不执行线上回滚。原来的汇总 JSON CLI 与旧版实验室继续保留，作为兼容入口与规则回归。

## 验证与导出

```bash
python -m pytest -q
python -m evals.runner --no-write
python -m evals.export_portfolio --check
node --test tests/portfolio_dom.cjs
```

修改代码、契约或案例后重新导出回放：

```bash
python -m evals.export_portfolio
```

CI 会验证回归、回放与 Python 语义一致性，以及浏览器页面状态转换。页面状态测试使用隔离 DOM，不等同于浏览器截图验收。[本轮验收记录](product/verification.md)保留结果与未完成项。

## 数据与可信度边界

导入能力可处理符合契约的本地导出包；已公开的样例、案例和回放均为合成数据。真实上游水位、随机化过程、埋点完整性、并发实验干扰和业务口径仍需负责人核对。

本项目是本地个人作品集原型。共享部署的权限、数据保留、多用户并发、生产审批及运营监控不在当前交付范围。旧实验室的真实模型模式仍需单独验证文案保真度，不计入上述成绩。

## License

Internal / personal project for learning and experimentation.
