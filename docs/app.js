const $ = (id) => document.getElementById(id);
const ids = ["cN","tN","cSuccess","tSuccess","cGmv","tGmv","cVar","tVar","alpha"];
const defaults = {cN:20000,tN:20150,cSuccess:2000,tSuccess:2329,cGmv:12.4,tGmv:12.1,cVar:25,tVar:25,alpha:.05};

function erf(x){const s=x<0?-1:1;x=Math.abs(x);const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911,t=1/(1+p*x);return s*(1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));}
function normalP(z){return Math.max(0,Math.min(1,1-erf(Math.abs(z)/Math.sqrt(2))));}
function pct(x,d=2){return `${x>=0?"+":"−"}${Math.abs(x*100).toFixed(d)}%`;}
function n(id){return Number($(id).value);}
function setBar(id,value,max){$(id).style.height=`${Math.max(8,Math.min(100,value/max*100))}%`;}
function item(icon,text){return `<div class="evidence-item"><b>${icon}</b><span>${text}</span></div>`;}

function analyze(){
  const run=$("run");run.classList.add("running");run.querySelector("b").textContent="◌";
  setTimeout(()=>{
    const cN=n("cN"),tN=n("tN"),cS=n("cSuccess"),tS=n("tSuccess"),alpha=n("alpha");
    const cG=n("cGmv"),tG=n("tGmv"),cV=n("cVar"),tV=n("tVar");
    const invalid=[cN,tN,cS,tS,cG,tG,cV,tV].some(v=>!Number.isFinite(v))||cN<=0||tN<=0||cS<0||tS<0||cS>cN||tS>tN||cV<=0||tV<=0;
    if(invalid){
      $("decision").textContent="输入无效";$("statusBadge").textContent="BLOCKED";$("statusBadge").className="status danger";
      $("summary").textContent="请检查输入：样本量需大于 0，转化数不能超过样本量，方差需为正数。上一次结果已撤回。";
      ["cvrLift","cvrValues","cvrSig","gmvLift","gmvValues","gmvSig"].forEach(id=>$(id).textContent="—");
      ["cvrBarA","cvrBarB","gmvBarA","gmvBarB"].forEach(id=>$(id).style.height="0%");
      $("evidenceList").textContent="当前输入未通过校验。";$("details").textContent="{}";
      $("trace").innerHTML='<div class="trace-step"><span>输入校验失败，后续未执行</span></div>';
      run.classList.remove("running");run.querySelector("b").textContent="→";return;
    }
    const cp=cS/cN,tp=tS/tN,pooled=(cS+tS)/(cN+tN),se=Math.sqrt(pooled*(1-pooled)*(1/cN+1/tN));
    const z=se?(tp-cp)/se:0,cvrP=normalP(z),cvrLift=cp?(tp-cp)/cp:0,cvrSig=cvrP<alpha;
    const gSe=Math.sqrt(cV/cN+tV/tN),gZ=gSe?(tG-cG)/gSe:0,gmvP=normalP(gZ),gmvLift=cG?(tG-cG)/cG:0,gmvSig=gmvP<alpha;
    const guardrailBad=gmvSig&&gmvLift<0,coreGood=cvrSig&&cvrLift>0;
    let decision,status,kind,summary;
    if(guardrailBad){decision="护栏恶化示例";status="ILLUSTRATION ONLY";kind="danger";summary="示意数据中护栏显著下降；本页未验证实验质量，不能形成完整发布结论。";}
    else if(coreGood){decision="核心指标提升示例";status="ILLUSTRATION ONLY";kind="caution";summary="示意数据中核心指标显著提升；护栏未显著恶化不等于安全。请使用 Python 工作流完成质量检查和人工评审。";}
    else{decision="证据不足示例";status="ILLUSTRATION ONLY";kind="caution";summary="示意数据中未形成显著正向证据。请按预先约定的实验周期评审，不应延长实验直到显著。";}
    $("decision").textContent=decision;$("summary").textContent=summary;$("statusBadge").textContent=status;$("statusBadge").className=`status ${kind}`;
    $("cvrLift").textContent=pct(cvrLift);$("cvrValues").textContent=`${(cp*100).toFixed(2)}% → ${(tp*100).toFixed(2)}%`;$("cvrSig").textContent=cvrSig?"显著":"不显著";$("cvrSig").className=cvrSig?(cvrLift>=0?"good":"bad"):"neutral";
    $("gmvLift").textContent=pct(gmvLift);$("gmvValues").textContent=`${cG.toFixed(2)} → ${tG.toFixed(2)}`;$("gmvSig").textContent=gmvSig?(gmvLift<0?"显著恶化":"显著改善"):"不显著";$("gmvSig").className=gmvSig?(gmvLift<0?"bad":"good"):"neutral";
    setBar("cvrBarA",cp,Math.max(cp,tp));setBar("cvrBarB",tp,Math.max(cp,tp));setBar("gmvBarA",cG,Math.max(cG,tG));setBar("gmvBarB",tG,Math.max(cG,tG));
    $("evidenceList").innerHTML=item("✓",`CVR 的双侧两比例 z 检验 p = ${cvrP.toFixed(4)}，${cvrSig?"达到":"未达到"} α = ${alpha.toFixed(2)} 的显著性标准。`)+item(guardrailBad?"!":"i",`GMV / User 变化 ${pct(gmvLift)}，大样本近似双侧检验 p = ${gmvP.toFixed(4)}。`)+item("!","质量检查、SRM、数据成熟度和分群分析均未在本页执行；本页不生成发布建议。");
    $("details").textContent=JSON.stringify({alpha,conversion:{method:"pooled two-proportion z-test",control:cp,treatment:tp,z_score:z,p_value:cvrP,relative_change:cvrLift,significant:cvrSig},guardrail:{method:"large-sample Welch approximation",control:cG,treatment:tG,z_score:gZ,p_value:gmvP,relative_change:gmvLift,significant:gmvSig},decision},null,2);
    $("trace").innerHTML=["输入校验","浏览器统计近似","示意结果展示"].map(x=>`<div class="trace-step done"><span>✓ ${x}</span></div>`).join("");
    run.classList.remove("running");run.querySelector("b").textContent="→";
  },280);
}
$("alpha").addEventListener("input",()=>$("alphaValue").textContent=n("alpha").toFixed(2));
$("run").addEventListener("click",analyze);
$("reset").addEventListener("click",()=>{Object.entries(defaults).forEach(([k,v])=>$(k).value=v);$("alphaValue").textContent="0.05";analyze();});
ids.forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter")analyze();}));
analyze();
