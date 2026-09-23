<div align="center">

# ExperimentOS

### An auditable A/B experiment analysis agent

**理解可以灵活，计算必须可靠。**

[![CI](https://github.com/IfiniteAurora13/experiment-analysis-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/IfiniteAurora13/experiment-analysis-agent/actions/workflows/ci.yml)
[![Interactive Demo](https://img.shields.io/badge/Interactive_Demo-open-5eead4?style=flat-square&logo=github)](https://ifiniteaurora13.github.io/experiment-analysis-agent/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-759cff?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-internal%20%2F%20personal-8d97ad?style=flat-square)](#license)

[在线体验](https://ifiniteaurora13.github.io/experiment-analysis-agent/) · [快速开始](#快速开始) · [设计原则](#设计原则) · [项目结构](#项目结构)

</div>

---

## 这是什么

ExperimentOS 是一个面向 A/B 实验复盘与发布决策的可运行 Agent Workflow。它刻意把两类工作分开：

| LLM 擅长 | 确定性代码负责 |
| --- | --- |
| 理解问题、规划任务、组织叙述 | 统计检验、结果校验、质量检查、发布护栏 |

它不会因为核心指标 uplift 为正就直接建议发布，也不会把探索性分群结果包装成因果结论。

> **核心流程：先验证，再计算，后解释。**

## 在线交互 Demo

无需安装，直接打开：

### **[→ Launch ExperimentOS Interactive Lab](https://ifiniteaurora13.github.io/experiment-analysis-agent/)**

在线页面支持：

- 修改 CVR 与 GMV / User 的实验输入；
- 实时运行浏览器侧统计演示；
- 查看显著性、指标变化与发布护栏；
- 查看精简版 workflow trace；
- 全程本地计算，不上传数据。

> 在线页面用于演示核心统计与护栏思想；完整 Agent、数据源适配器与 Eval 请使用 Python 版本。

## 工作流

```mermaid
flowchart LR
    A[问题与实验数据] --> B[Intent Router]
    B --> C[Planner]
    C --> D[Input Validation]
    D --> E[Quality Check]
    E --> F[Deterministic Stats]
    F --> G[Result Validation]
    G --> H[Release Guardrails]
    H --> I[Auditable Report]
```

每轮执行都会保留 `Workflow Trace` 与 `Tool Trace`，用于复核、排障和 Eval 回归。

## 快速开始

### 1. 安装

```bash
git clone https://github.com/IfiniteAurora13/experiment-analysis-agent.git
cd experiment-analysis-agent
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -U pip
python -m pip install -e '.[dev]'
```

### 2. 打开可视化工作台

```bash
streamlit run experimentos/app/streamlit_app.py
```

工作台提供示例切换、JSON 编辑、指标卡片、结论报告、Workflow Trace、Tool Trace 与完整结构化输出。

### 3. 从 CLI 运行

```bash
python -m experimentos.app.cli examples/product_detail_release.json --trace
```

### 4. 测试与离线 Eval

```bash
python -m pytest -q
python -m evals.runner --no-write
```

## 能力矩阵

| 能力 | 实现 |
| --- | --- |
| 实验质量 | SRM、样本量、实验时长风险 |
| 转化指标 | Pooled two-proportion z-test + Wald CI |
| 连续指标 | Welch t-test + Welch–Satterthwaite df |
| 平台结果 | 保留并标记 `platform_reported` 统计来源 |
| 分群诊断 | BH-FDR 多重比较校正；发现固定标记为待验证假设 |
| 发布建议 | 综合质量、核心指标与护栏指标 |
| 可观测性 | Workflow Trace + Tool Trace |
| 回归评估 | Offline Eval + Bad Case Loop |

## 示例决策

商品详情页改版实验中，核心指标 CVR 显著提升，但护栏指标 GMV / User 显著下降：

| Metric | Control | Treatment | Relative change | Interpretation |
| --- | ---: | ---: | ---: | --- |
| CVR | 10.00% | 11.56% | +15.58% | Significant uplift |
| GMV / User | 12.40 | 12.10 | −2.42% | Significant degradation |

**结论：不建议直接发布。** 护栏指标的显著恶化会阻断仅由核心指标 uplift 驱动的发布建议。

## 设计原则

1. **LLM 不计算统计结果**：模型用于理解、规划与叙述。
2. **约束不可绕过**：Planner 不能删除质量检查、结果校验和发布护栏。
3. **探索不等于因果**：分群显著只生成待验证假设。
4. **输入不足时不编造**：返回最小补充信息清单。
5. **Eval 是产品的一部分**：Bad Case 必须沉淀为回归用例。

## 项目结构

```text
.
├── docs/                    # GitHub Pages 交互 Demo
├── experimentos/
│   ├── agent/               # router / planner / executor / guardrails
│   ├── analysis/            # quality / validation / segmentation
│   ├── app/                 # CLI / Streamlit workspace
│   ├── skills/              # 可注册分析能力
│   └── tools/               # stats / SQL / providers / registry
├── examples/                # 合成示例
├── evals/                   # 离线评测
├── bad_cases/               # 失败案例与回归闭环
├── metric_specs/            # 指标与分群定义
└── tests/
```

## 数据边界

仓库只包含合成 fixture 与离线 Demo。线上 provider 默认关闭；只有显式设置 `allow_live_provider=true` 才允许启用。CI、Eval 与 GitHub Pages 均不访问真实业务数据。

## GitHub Pages 部署

仓库内置 `.github/workflows/pages.yml`。推送到 `main` 后，GitHub Actions 会部署 `docs/`。若首次启用，请在 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。

## License

Internal / personal project for learning and experimentation.
