"use strict";
(function () {
  const data = window.EXPERIMENT_REVIEW_DATA;
  const $ = id => document.getElementById(id);
  if (!data || !Array.isArray(data.scenarios)) {
    $("decisionTitle").textContent = "回放尚未载入";
    $("decisionReason").textContent = "请检查 data/replays.js 是否与页面一起部署。";
    return;
  }
  const labels = {BLOCKED:"待修复",NEEDS_CONFIRMATION:"待确认",WAITING_FOR_CLARIFICATION:"待补证",REVIEW_READY:"可人工评审",DO_NOT_SHIP:"不支持推进",INCONCLUSIVE:"证据不足",LEARNING_ONLY:"学习记录"};
  const categories = {normal:"正常路径",definition:"口径",data_quality:"数据质量",schema:"格式",confirmation:"确认",versioning:"版本",quality_gate:"必检",tool_failure:"工具失败",statistical_applicability:"方法适用性",risk_policy:"风险策略",boundary:"边界",legacy_workflow:"既有流程"};
  let selected = "clean", reviewed = true, repaired = false, agentStage = 0, currentCard = null;
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  };
  const scenario = () => data.scenarios.find(item => item.id === selected);
  const pair = () => repaired && scenario().recovery ? scenario().recovery : scenario();
  const pct = n => (n * 100).toFixed(2) + "%";
  const num = n => n == null ? "待核对" : Number(n).toLocaleString("zh-CN");
  const signed = (n, digits) => (n >= 0 ? "+" : "−") + Math.abs(n).toFixed(digits);
  function row(label, state) { const el = node("div"); el.append(node("span", label), node("strong", state)); return el; }
  function renderMetrics(card) {
    const report = card.report;
    const visible = !!report && report.review_gate.status === "READY";
    $("metricGrid").hidden = !visible;
    $("policyBox").hidden = !visible || !card.decision.gmv_ci;
    if (!visible) return;
    const core = report.metric_results.find(x => x.metric_role === "core");
    const guard = report.metric_results.find(x => x.metric_role === "guardrail");
    $("coreValue").textContent = pct(core.treatment_value);
    $("coreComparison").textContent = pct(core.control_value) + " → " + pct(core.treatment_value) + "  ·  " + signed(core.delta_abs * 100, 2) + " 个百分点";
    $("coreInterval").textContent = "差值 95% CI [" + (core.ci_low * 100).toFixed(2) + ", " + (core.ci_high * 100).toFixed(2) + "] 个百分点";
    $("coreTag").textContent = core.significant && core.ci_low > 0 ? "正向证据" : "证据不足";
    $("coreTag").className = core.significant && core.ci_low > 0 ? "" : "warn";
    $("gmvValue").textContent = "¥" + guard.treatment_value.toFixed(4);
    $("gmvComparison").textContent = "¥" + guard.control_value.toFixed(4) + " → ¥" + guard.treatment_value.toFixed(4);
    $("gmvInterval").textContent = "差值 95% CI [" + guard.ci_low.toFixed(4) + ", " + guard.ci_high.toFixed(4) + "] 元 / 用户";
    const margin = card.decision.allowed_gmv_loss;
    const safe = guard.ci_low > -margin, harmful = guard.ci_high < -margin;
    $("gmvTag").textContent = safe ? "边界以内" : harmful ? "损失越界" : "尚不确定";
    $("gmvTag").className = safe ? "" : harmful ? "bad" : "warn";
    $("policyDescription").textContent = "预设允许损失 ¥" + margin.toFixed(2) + " / 用户。护栏差值区间下界高于 −" + margin.toFixed(2) + "，才满足这项约束。";
  }
  function render() {
    const isAgent = selected === "material_conflict";
    const view = isAgent && data.agent_demo ? data.agent_demo.stages[agentStage] : null;
    if (isAgent && !view) { $("decisionTitle").textContent = "请更新材料核对回放"; return; }
    const s = isAgent ? null : scenario();
    const p = isAgent ? null : pair();
    currentCard = isAgent ? {...view.card, status:view.status, decision:{...view.card.decision, label:view.label, reason:view.message}, owner:view.owner, next_action:view.next_action, markdown:view.markdown} : reviewed && p.confirmed ? p.confirmed : p.inspection;
    const card = currentCard, inspection = card.inspection;
    $("scenario").value = selected;
    $("scenarioDescription").textContent = isAgent ? "实验说明与指标字典的分母冲突，先核对，再继续。" : s.description;
    [["caseClean","clean"],["caseConflict","material_conflict"],["caseRisk","guardrail_harm"]].forEach(([id,value]) => {
      $(id).className = selected === value ? "active" : "";
      $(id).setAttribute("aria-pressed", String(selected === value));
    });
    $("statusPill").textContent = labels[card.status] || card.status;
    $("statusPill").className = "status-pill" + (card.status === "REVIEW_READY" ? " safe" : ["BLOCKED","DO_NOT_SHIP"].includes(card.status) ? " danger" : "");
    $("decisionKicker").textContent = isAgent ? "材料核对 → 补证 → 评审 · 离线回放" : "已保存的 Python 执行结果";
    $("decisionTitle").textContent = card.decision.label;
    $("decisionReason").textContent = card.decision.reason;
    $("assignedCount").textContent = num(inspection.counts.assigned_users);
    $("orderCount").textContent = num(inspection.counts.included_orders);
    const count = ["duplicate_orders","duplicate_assignments","excluded_orders","late_arriving_orders"].reduce((total,key) => total + (inspection.counts[key] || 0),0);
    $("cleaningCount").textContent = count ? count + " 条处理记录" : inspection.valid ? "契约有效" : "等待核对";
    $("watermark").textContent = (inspection.manifest.orders_complete_through || "未提供").replace("T"," ");
    $("repairNote").hidden = !repaired;
    $("issueList").replaceChildren();
    inspection.issues.forEach(issue => {
      const el = node("div",undefined,"issue" + (issue.blocking ? " blocking" : ""));
      el.append(node("span",issue.message),node("small",issue.owner + " · " + issue.next_action)); $("issueList").append(el);
    });
    const pending = view && view.pending;
    $("clarificationBox").hidden = !pending;
    $("sourceQuotes").replaceChildren();
    if (pending) {
      const contract = node("div",undefined,"source-quote");
      contract.append(node("small","实验契约"),node("span","主指标分母：全部唯一入组用户")); $("sourceQuotes").append(contract);
      pending.claims.forEach(claim => { const el = node("div",undefined,"source-quote"); el.append(node("small",claim.source),node("span",claim.quote)); $("sourceQuotes").append(el); });
    }
    const needsConfirm = isAgent ? agentStage === 1 : !reviewed && inspection.valid;
    $("confirmationBox").hidden = !needsConfirm;
    $("confirmButton").disabled = isAgent ? agentStage !== 1 : !inspection.valid || !p.confirmed;
    $("repairButton").hidden = isAgent || repaired || !s.recovery;
    $("ownerName").textContent = card.owner; $("ownerAvatar").textContent = card.owner.charAt(0);
    $("nextAction").textContent = card.next_action;
    $("phaseRow").querySelectorAll("span").forEach((el,i) => { const active = isAgent ? agentStage : reviewed ? 2 : inspection.valid ? 1 : 0; el.className = i <= active ? "active" : ""; });
    renderMetrics(card);
    $("checkList").replaceChildren(row("数据契约与完整性声明",inspection.valid ? "已检查" : "未通过"),row("当前版本口径确认",card.confirmation ? "已确认" : "未确认"));
    const checks = card.report ? card.report.review_gate.checks : {};
    [["quality_check","实验质量"],["metric_analysis","指标计算"],["result_validation","结果校验"]].forEach(([key,label]) => $("checkList").append(row(label,{PASS:"通过",FAIL:"未通过",UNKNOWN:"未确认 / 未执行"}[checks[key] || "UNKNOWN"])));
    $("snapshotLabel").textContent = card.snapshot_id;
    $("historyList").replaceChildren();
    const names = {imported:"导入数据",definitions_confirmed:"确认当前口径",superseded:"旧版本失效",withdrawn:"撤回评审卡",human_review_recorded:"人工复核",inspect_bundle:"检查数据包",review_materials:"核对口径材料",resolve_definition:"负责人核对冲突",confirm_definitions:"确认当前版本",run_review:"运行评审",review_gate:"检查评审状态",material_model:"模型回退"};
    (isAgent ? view.trace : card.history || []).forEach(event => $("historyList").append(node("li",(names[event.tool || event.event] || event.tool || event.event) + (event.by ? " · " + event.by : ""))));
  }
  function select(id) { selected=id; repaired=false; agentStage=0; reviewed=["clean","guardrail_harm"].includes(id); render(); }
  function download(value,filename) {
    const text = typeof value === "string";
    const blob = new Blob([text ? value : JSON.stringify(value,null,2)],{type:text ? "text/markdown;charset=utf-8" : "application/json;charset=utf-8"});
    const url = URL.createObjectURL(blob), link=node("a"); link.href=url; link.download=filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),0);
  }
  data.scenarios.forEach(item => { const option=node("option",item.name);option.value=item.id;$("scenario").append(option); });
  if (data.agent_demo) { const option=node("option","口径冲突与恢复");option.value="material_conflict";$("scenario").append(option); }
  $("scenario").addEventListener("change",function(){select(this.value);});
  $("caseClean").addEventListener("click",()=>select("clean"));
  $("caseConflict").addEventListener("click",()=>select("material_conflict"));
  $("caseRisk").addEventListener("click",()=>select("guardrail_harm"));
  $("clarifyButton").addEventListener("click",()=>{if(selected==="material_conflict"&&agentStage===0){agentStage=1;render();}});
  $("confirmButton").addEventListener("click",()=>{if(selected==="material_conflict"){if(agentStage!==1)return;agentStage=2;}else{if(!pair().confirmed)return;reviewed=true;}render();});
  $("repairButton").addEventListener("click",()=>{if(selected==="material_conflict"||!scenario().recovery)return;repaired=true;reviewed=false;render();});
  $("resetTask").addEventListener("click",()=>{reviewed=false;repaired=false;agentStage=0;render();});
  $("downloadReport").addEventListener("click",()=>download(currentCard.markdown,"experiment-review.md"));
  $("downloadCard").addEventListener("click",()=>download(selected==="material_conflict"?data.agent_demo.stages[agentStage]:currentCard,"experiment-review.json"));
  $("downloadEval").addEventListener("click",()=>download(data.evaluation,"experiment-evaluation.json"));
  $("proofCases").textContent=data.evaluation.total_cases;
  $("evalTotal").textContent=data.evaluation.passed_cases+" / "+data.evaluation.total_cases;
  Object.keys(data.categories).forEach(key=>{
    const value=data.categories[key], el=node("div",undefined,"category-card");
    el.append(node("span",categories[key]||key),node("strong",value.passed+"/"+value.total));$("categoryGrid").append(el);
    const option=node("option",categories[key]||key);option.value=key;$("categoryFilter").append(option);
  });
  function renderCases() {
    const filter=$("categoryFilter").value, cases=data.evaluation.cases.filter(item=>filter==="all"||(item.category||"legacy_workflow")===filter);
    $("caseRows").replaceChildren();
    cases.forEach(item=>{
      const tr=node("tr"), name=node("td");name.append(node("strong",item.case_id),node("span",item.title||"既有回归"));
      const comparison=node("td",(item.expected_status||"未记录")+" → "+(item.observed?item.observed.status:"未记录"));
      const result=node("td");result.append(node("span",item.passed?"PASS":"FAIL","pass-badge"+(item.passed?"":" fail")));
      tr.append(name,node("td",categories[item.category||"legacy_workflow"]||item.category),comparison,result);$("caseRows").append(tr);
    });
    $("caseCount").textContent="显示 "+cases.length+" / "+data.evaluation.total_cases+" 例。均为合成离线回归，不计为真实模型成绩。";
  }
  $("categoryFilter").addEventListener("change",renderCases);renderCases();render();
})();
