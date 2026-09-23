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
    if(invalid){$("summary").textContent="请检查输入：样本量需大于 0，转化数不能超过样本量，方差需为正数。";run.classList.remove("running");run.querySelector("b").textContent="→";return;}
    const cp=cS/cN,tp=tS/tN,pooled=(cS+tS)/(cN+tN),se=Math.sqrt(pooled*(1-pooled)*(1/cN+1/tN));
    const z=se?(tp-cp)/se:0,cvrP=normalP(z),cvrLift=cp?(tp-cp)/cp:0,cvrSig=cvrP<alpha;
    const gSe=Math.sqrt(cV/cN+tV/tN),gZ=gSe?(tG-cG)/gSe:0,gmvP=normalP(gZ),gmvLift=cG?(tG-cG)/cG:0,gmvSig=gmvP<alpha;
    const guardrailBad=gmvSig&&gmvLift<0,coreGood=cvrSig&&cvrLift>0;
    let decision,status,kind,summary;
    if(guardrailBad){decision="不建议发布";status="DONE WITH CONCERNS";kind="danger";summary="核心指标"+(coreGood?"显著提升":"尚未形成充分证据")+"，但护栏指标显著恶化。当前证据不足以支持全量上线。";}
    else if(coreGood){decision="建议灰度发布";status="READY WITH GUARDRAILS";kind="safe";summary="核心指标显著提升，且未发现护栏指标显著恶化。建议在持续监控下逐步放量。";}
    else{decision="继续观察";status="INCONCLUSIVE";kind="caution";summary="核心指标尚未形成显著正向证据。建议延长实验或补充样本后再做发布决策。";}
    $("decision").textContent=decision;$("summary").textContent=summary;$("statusBadge").textContent=status;$("statusBadge").className=`status ${kind}`;
    $("cvrLift").textContent=pct(cvrLift);$("cvrValues").textContent=`${(cp*100).toFixed(2)}% → ${(tp*100).toFixed(2)}%`;$("cvrSig").textContent=cvrSig?"显著":"不显著";$("cvrSig").className=cvrSig?(cvrLift>=0?"good":"bad"):"neutral";
    $("gmvLift").textContent=pct(gmvLift);$("gmvValues").textContent=`${cG.toFixed(2)} → ${tG.toFixed(2)}`;$("gmvSig").textContent=gmvSig?(gmvLift<0?"显著恶化":"显著改善"):"不显著";$("gmvSig").className=gmvSig?(gmvLift<0?"bad":"good"):"neutral";
    setBar("cvrBarA",cp,Math.max(cp,tp));setBar("cvrBarB",tp,Math.max(cp,tp));setBar("gmvBarA",cG,Math.max(cG,tG));setBar("gmvBarB",tG,Math.max(cG,tG));
    $("evidenceList").innerHTML=item("✓",`CVR 的双侧两比例 z 检验 p = ${cvrP.toFixed(4)}，${cvrSig?"达到":"未达到"} α = ${alpha.toFixed(2)} 的显著性标准。`)+item(guardrailBad?"!":"✓",`GMV / User 变化 ${pct(gmvLift)}，近似双侧检验 p = ${gmvP.toFixed(4)}。`)+item("→",guardrailBad?"护栏显著恶化优先于核心指标 uplift，阻断直接发布。":"未触发护栏阻断；发布仍需结合业务成本与长期指标。")+item("i","分群发现仅作为待验证假设，不解释为因果结论。");
    $("details").textContent=JSON.stringify({alpha,conversion:{method:"pooled two-proportion z-test",control:cp,treatment:tp,z_score:z,p_value:cvrP,relative_change:cvrLift,significant:cvrSig},guardrail:{method:"large-sample Welch approximation",control:cG,treatment:tG,z_score:gZ,p_value:gmvP,relative_change:gmvLift,significant:gmvSig},decision},null,2);
    $("trace").innerHTML=["plan","validate","quality_check","analyze_metric","guardrails","report"].map(x=>`<div class="trace-step done"><span>✓ ${x}</span></div>`).join("");
    run.classList.remove("running");run.querySelector("b").textContent="→";
  },280);
}
$("alpha").addEventListener("input",()=>$("alphaValue").textContent=n("alpha").toFixed(2));
$("run").addEventListener("click",analyze);
$("reset").addEventListener("click",()=>{Object.entries(defaults).forEach(([k,v])=>$(k).value=v);$("alphaValue").textContent="0.05";analyze();});
ids.forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter")analyze();}));
analyze();
