# 运行指南

## 最快演示

按 README 安装后，运行 `streamlit run experimentos/app/streamlit_app.py`。默认演示无需模型密钥。选择正常评审、口径冲突与恢复、护栏越界，分别演示确认、补证和正确停止。

本地任务保存在 `.review_state/task.json` 和相邻的评审记录中。刷新后恢复同一案例；上传文件刷新后需要重新导入原包。可用环境变量 `EXPERIMENTOS_TASK_STORE` 指定任务记录路径。当前为本地单用户工作台，记录不是不可篡改审计。

## 使用真实模型

安装可选依赖：`pip install -e '.[dev,llm]'`。

在本地终端配置 `EXPERIMENTOS_LLM_API_KEY`、`EXPERIMENTOS_LLM_MODEL`，兼容服务可配置 `EXPERIMENTOS_LLM_BASE_URL`。密钥只保存在本地环境，不填写到源码或公开页面。

工作台展开“问题与口径材料”，填写脱敏文本并启用模型辅助核对。模型只接收问题与上述文本，不接收 CSV 明细。模型每个输入版本最多调用一次；SDK 请求配置 20 秒超时、禁用自动重试。失败或返回不合法时记录回退，不宣传为模型完成。

模型输出限定为口径候选和原文引用，不能输出动作或统计结论。无法用固定短语核对的语义候选需要负责人确认；引用存在不等于解释正确。输入材料中的指令不能修改质量门禁、阈值或上线状态。

当前尚未取得真实模型端到端成绩。页面的口径冲突演示使用离线规则，真实模型收益需另外评测。超时配置依据 [OpenAI Python 官方文档](https://developers.openai.com/api/reference/python)。

配置服务后可显式运行 `python -m evals.model_smoke`，执行 6 个真实接口开发探针。模型回退不能记为抽取成功，未配置服务会直接拒绝运行。这不是独立验收集；负责人回答由测试预设，不能当作用户研究。默认结果保存在被忽略的 model-local.json，核对后再决定是否公开。

## 导入本地数据

准备 assignments.csv、orders.csv、contract.json、manifest.json，格式见 [数据契约](data_contract.md)。每个文件不超过 5 MiB；数据完整性依赖上游声明与负责人核对。

命令行基线继续可用：

```bash
python -m experimentos.demo_data --output examples/generated_bundle
python -m experimentos.app.bundle_cli examples/generated_bundle
```

先核对输出中的完整版本和口径，再执行：

```bash
python -m experimentos.app.bundle_cli examples/generated_bundle \
  --confirm-by '数据负责人' --snapshot '填写已核对的完整 SHA-256'
```

撤回评审记录不执行线上回滚；新数据或材料需要重新确认。旧汇总 JSON 入口保留在“汇总输入实验室（旧版）”。
