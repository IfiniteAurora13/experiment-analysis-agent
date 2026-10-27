# ExperimentOS · 实验评审 Agent

核对口径，补齐证据，准备一张有依据的实验评审卡。

**[在线体验](https://ifiniteaurora13.github.io/experiment-analysis-agent/)** · [快速开始](#快速开始) · [评测证据](evals/reports/step2.md) · [面试演示提纲](product/interview_demo.md)

面向电商增长 PM：商品详情页实验结束后，先确认数据是否可信，再判断收益与护栏是否支持进入人工发布评审。

## 三个案例，理解项目

| 案例 | 助手做什么 |
| --- | --- |
| 正常评审 | 确认口径和数据完整性，计算转化与 GMV，交付评审卡。 |
| 口径冲突 | 发现指标字典与实验契约冲突，提出关键澄清；负责人补证后继续，任务可保存与恢复。 |
| 护栏越界 | 主指标提升，但 GMV 超出预设损失边界，明确停止推进并交给业务负责人。 |

网页回放由 Python 实际运行生成，使用合成数据。真实文件导入、材料核对与任务恢复在本地工作台运行。

## Agent 的职责

问题与材料 → 口径候选及引用 → 关键澄清 → 版本确认 → 统计工具 → 评审卡 / 人工接管。

- **模型理解材料**：从说明和字典中提取口径候选，附原文引用；语义候选需人工核对。
- **代码控制结果**：统计数字、质量门禁和风险状态由确定性工具输出。
- **任务能接着走**：等待补证时保存进度；数据、材料或模式变化后，旧确认失效。
- **失败有退路**：模型异常、坏格式或无效引用时回退离线规则；必检失败不能靠模型或人工确认放行。

输入完整时直接使用规则基线。Agent 的候选价值是减少材料核对与补证返工，真实收益仍需对照验证。

## 快速开始

Python 3.11+，在仓库根目录运行：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
streamlit run experimentos/app/streamlit_app.py
```

默认离线，可完整演示三条流程。任务自动保存在本地；启用真实模型、导入格式与命令行见 [运行指南](product/quickstart.md)。

## 验证与边界

已有 **60 个合成离线回归场景**，另有材料澄清、任务恢复、引用校验和页面状态测试。网页回放的一致性由 CI 检查。

[逐例结果](evals/reports/step2.md) · [澄清闭环原始记录](evals/reports/agent_loop.json) · [失败前后证据](bad_cases/README.md) · [数据契约](product/data_contract.md)

当前只支持两组、用户级随机、固定周期，一个主指标与一个护栏。不执行上线。公开材料均为合成数据，尚无真实用户收益、独立冻结验收集或真实模型端到端成绩。

CUPED、序贯检验、多 Agent 和任意 SQL 暂停投入。[产品判断与后续计划](product/agent_closed_loop_plan.md)。

<details>
<summary>开发验证</summary>

```bash
python -m pytest -q
python -m evals.runner --no-write
python -m evals.export_portfolio --check
node --test tests/portfolio_dom.cjs
```

变更回放行为后运行 python -m evals.export_portfolio，提交生成结果。

</details>
