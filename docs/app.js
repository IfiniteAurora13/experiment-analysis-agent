"use strict";
(function () {
  const data = window.EXPERIMENT_REVIEW_DATA;
  const $ = function (id) { return document.getElementById(id); };
  if (!data || !Array.isArray(data.scenarios)) {
    $("decisionTitle").textContent = "回放数据尚未载入";
    $("decisionReason").textContent = "请保留 data/replays.js 与页面在同一目录，或按仓库说明重新导出回放。";
    return;
  }
  const statusNames = { BLOCKED:"需要修复 / 接管", NEEDS_CONFIRMATION:"等待口径确认", REVIEW_READY:"可进入人工评审", INCONCLUSIVE:"证据不足", DO_NOT_SHIP:"不支持推进", LEARNING_ONLY:"仅记录学习" };
  const categories = { normal:"正常路径", definition:"口径约束", data_quality:"数据质量", schema:"文件格式", confirmation:"人工确认", versioning:"版本失效", quality_gate:"必检阻断", tool_failure:"工具故障", statistical_applicability:"方法适用性", risk_policy:"决策策略", boundary:"时间边界", legacy_workflow:"既有工作流" };
  let selected = data.scenarios[0].id;
  let reviewed = false;
  let repaired = false;
  let currentCard = null;

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function selectedScenario() { return data.scenarios.find(function (scenario) { return scenario.id === selected; }); }
  function selectedPair() {
    const scenario = selectedScenario();
    return repaired && scenario.recovery ? scenario.recovery : scenario;
  }
  function number(value) { return value === undefined || value === null ? "待核对" : Number(value).toLocaleString("zh-CN"); }
  function percent(value) { return (value * 100).toFixed(2) + "%"; }
  function signed(value, places) { return (value >= 0 ? "+" : "−") + Math.abs(value).toFixed(places); }
  function row(label, state) {
    const element = node("div");
    element.append(node("span", label), node("strong", state));
    return element;
  }
  function renderMetrics(card) {
    const report = card.report;
    const visible = !!report && report.review_gate.status === "READY";
    $("metricGrid").hidden = !visible;
    $("policyBox").hidden = !visible || !card.decision.gmv_ci;
    if (!visible) return;
    const core = report.metric_results.find(function (metric) { return metric.metric_role === "core"; });
    const guard = report.metric_results.find(function (metric) { return metric.metric_role === "guardrail"; });
    $("coreValue").textContent = percent(core.treatment_value);
    $("coreComparison").textContent = percent(core.control_value) + " → " + percent(core.treatment_value) + "　" + signed(core.delta_abs * 100, 2) + " 个百分点";
    $("coreInterval").textContent = "差值 95% 区间 [" + (core.ci_low * 100).toFixed(2) + ", " + (core.ci_high * 100).toFixed(2) + "] 个百分点";
    $("coreTag").textContent = core.significant && core.ci_low > 0 ? "正向证据" : "证据不足";
    $("coreTag").className = "metric-tag" + (core.significant && core.ci_low > 0 ? "" : " warn");
    $("gmvValue").textContent = "¥" + guard.treatment_value.toFixed(4);
    $("gmvComparison").textContent = "¥" + guard.control_value.toFixed(4) + " → ¥" + guard.treatment_value.toFixed(4);
    $("gmvInterval").textContent = "差值 95% 区间 [" + guard.ci_low.toFixed(4) + ", " + guard.ci_high.toFixed(4) + "] 元 / 用户";
    const margin = card.decision.allowed_gmv_loss;
    const safe = guard.ci_low > -margin;
    const harmful = guard.ci_high < -margin;
    $("gmvTag").textContent = safe ? "边界以内" : harmful ? "损失越界" : "尚不确定";
    $("gmvTag").className = "metric-tag" + (safe ? "" : harmful ? " bad" : " warn");
    $("policyDescription").textContent = "每用户 GMV 最多允许损失 ¥" + margin.toFixed(4) + "。区间下界高于 −" + margin.toFixed(4) + " 才满足这项约束；跨越边界时明确返回证据不足。该策略在实验前声明，当前只支持一个主指标与一个护栏。";
  }
  function render() {
    const scenario = selectedScenario();
    const pair = selectedPair();
    currentCard = reviewed && pair.confirmed ? pair.confirmed : pair.inspection;
    const card = currentCard;
    const inspection = card.inspection;
    $("scenarioDescription").textContent = scenario.description;
    $("statusPill").textContent = statusNames[card.status] || card.status;
    $("statusPill").className = "status-pill" + (card.status === "REVIEW_READY" ? " safe" : ["BLOCKED","DO_NOT_SHIP"].includes(card.status) ? " danger" : "");
    $("decisionTitle").textContent = card.decision.label;
    $("decisionReason").textContent = card.decision.reason;
    $("assignedCount").textContent = number(inspection.counts.assigned_users);
    $("orderCount").textContent = number(inspection.counts.included_orders);
    const processing = ["duplicate_orders","duplicate_assignments","excluded_orders","late_arriving_orders"].reduce(function (total, name) { return total + (inspection.counts[name] || 0); }, 0);
    $("cleaningCount").textContent = processing ? processing + " 条已记录" : inspection.valid ? "无需修正" : "等待核对";
    $("watermark").textContent = (inspection.manifest.orders_complete_through || "未提供").replace("T", " ");
    $("repairNote").hidden = !repaired;
    $("issueList").replaceChildren();
    inspection.issues.forEach(function (issue) {
      const item = node("div", undefined, "issue" + (issue.blocking ? " blocking" : ""));
      item.append(node("span", issue.message), node("small", "接管：" + issue.owner + " · " + issue.next_action));
      $("issueList").append(item);
    });
    $("confirmationBox").hidden = reviewed || !inspection.valid;
    $("confirmButton").disabled = !$("acknowledge").checked || !inspection.valid || !pair.confirmed;
    $("repairButton").hidden = repaired || !scenario.recovery;
    $("ownerName").textContent = card.owner;
    $("ownerAvatar").textContent = card.owner.charAt(0);
    $("nextAction").textContent = card.next_action;
    const phases = $("phaseRow").querySelectorAll("span");
    phases.forEach(function (element, index) {
      const active = reviewed ? 2 : inspection.valid ? 1 : 0;
      element.className = index <= active ? "active" : "";
    });
    renderMetrics(card);
    $("checkList").replaceChildren(row("数据契约与完整性声明", inspection.valid ? "已检查" : "未通过"), row("当前版本口径确认", card.confirmation ? "已确认" : "未确认"));
    const checks = card.report ? card.report.review_gate.checks : {};
    [["quality_check","实验质量检查"],["metric_analysis","全部指标计算"],["result_validation","统计结果校验"]].forEach(function (item) {
      const value = checks[item[0]] || "UNKNOWN";
      $("checkList").append(row(item[1], {PASS:"通过",FAIL:"未通过",UNKNOWN:"未确认 / 未执行"}[value] || value));
    });
    $("snapshotLabel").textContent = card.snapshot_id;
    $("historyList").replaceChildren();
    const eventNames = {imported:"导入数据包", definitions_confirmed:"确认口径与声明", superseded:"旧版本失效", withdrawn:"撤回本地评审卡", human_review_recorded:"记录人工复核", human_review_invalidated:"人工复核失效"};
    (card.history || []).forEach(function (event) {
      $("historyList").append(node("li", (eventNames[event.event] || event.event) + (event.by ? " · " + event.by : "")));
    });
  }
  function download(value, filename) {
    const blob = new Blob([typeof value === "string" ? value : JSON.stringify(value, null, 2)], {type:typeof value === "string" ? "text/markdown;charset=utf-8" : "application/json;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = node("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }
  data.scenarios.forEach(function (scenario) {
    const option = node("option", scenario.name);
    option.value = scenario.id;
    $("scenario").append(option);
  });
  $("scenario").addEventListener("change", function () {
    selected = this.value;
    reviewed = repaired = false;
    $("acknowledge").checked = false;
    render();
  });
  $("acknowledge").addEventListener("change", function () { render(); });
  $("confirmButton").addEventListener("click", function () {
    if (!$("acknowledge").checked || !selectedPair().confirmed) return;
    reviewed = true;
    render();
  });
  $("repairButton").addEventListener("click", function () {
    if (!selectedScenario().recovery) return;
    repaired = true;
    reviewed = false;
    $("acknowledge").checked = false;
    render();
  });
  $("resetTask").addEventListener("click", function () {
    reviewed = repaired = false;
    $("acknowledge").checked = false;
    render();
  });
  $("downloadCard").addEventListener("click", function () { download(currentCard, "experiment-review-replay-" + selected + ".json"); });
  $("downloadReport").addEventListener("click", function () { download(currentCard.markdown, "experiment-review-" + selected + ".md"); });
  $("downloadEval").addEventListener("click", function () { download(data.evaluation, "experiment-evaluation.json"); });

  $("proofCases").textContent = data.evaluation.total_cases;
  $("evalTotal").textContent = data.evaluation.passed_cases + " / " + data.evaluation.total_cases;
  Object.keys(data.categories).forEach(function (category) {
    const score = data.categories[category];
    const block = node("div", undefined, "category-card");
    block.append(node("span", categories[category] || category), node("strong", score.passed + " / " + score.total), node("small", "案例通过 / 该类总数"));
    $("categoryGrid").append(block);
    const option = node("option", categories[category] || category);
    option.value = category;
    $("categoryFilter").append(option);
  });
  function renderCases() {
    const filter = $("categoryFilter").value;
    const cases = data.evaluation.cases.filter(function (item) { return filter === "all" || (item.category || "legacy_workflow") === filter; });
    $("caseRows").replaceChildren();
    cases.forEach(function (item) {
      const tableRow = node("tr");
      const name = node("td");
      name.append(node("strong", item.case_id), node("span", item.title || "既有统计与工作流回归"));
      const comparison = node("td");
      comparison.append(node("span", (item.expected_status || "未记录") + " → " + (item.observed ? item.observed.status : "未记录"), "status-comparison"));
      const result = node("td");
      result.append(node("span", item.passed ? "PASS" : "FAIL", "pass-badge" + (item.passed ? "" : " fail")));
      tableRow.append(name, node("td", categories[item.category || "legacy_workflow"] || item.category), comparison, result);
      $("caseRows").append(tableRow);
    });
    $("caseCount").textContent = "显示 " + cases.length + " / " + data.evaluation.total_cases + " 个场景。全部为合成离线回归；重复运行不计为新案例。";
  }
  $("categoryFilter").addEventListener("change", renderCases);
  renderCases();
  render();
})();
