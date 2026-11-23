import {catalogue,cases,settings,runOptimisation,comparisonPolicy,optimise,evaluate,scoreProduct,validateResult,money,integer,percent} from "./model.js";

const $=id=>document.getElementById(id);
let period=4,report=null,busy=false;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const changeStamp={};
const inputs=["budget","capacity","market","uncertainty","service"];
function readInputs(){return settings({
  budget:Number($("budget").value),capacity:Number($("capacity").value),
  market:$("market").value,uncertainty:Number($("uncertainty").value),
  service:Number($("service").value),period
});}
function showReadouts(){
  $("budget-display").textContent=money(Number($("budget").value));
  $("capacity-display").textContent=integer(Number($("capacity").value))+" units";
  $("uncertainty-display").textContent=$("uncertainty").value+"%";
  $("service-display").textContent=$("service").value+"%";
}
function changed(){
  showReadouts();
  const note=$("update-note");note.textContent="Inputs changed · run the solver to update results.";note.classList.add("changed");
}
inputs.forEach(id=>$(id).addEventListener("input",changed));
document.querySelectorAll("[data-period]").forEach(button=>button.addEventListener("click",()=>{
  period=Number(button.dataset.period);
  document.querySelectorAll("[data-period]").forEach(b=>b.classList.toggle("chosen",b===button));
  changed();
}));
function setView(view){
  const name=view==="method"?"method":"plan";
  document.querySelectorAll("[data-panel]").forEach(node=>node.hidden=node.dataset.panel!==name);
  document.querySelectorAll("[data-view]").forEach(node=>{
    const selected=node.dataset.view===name;node.classList.toggle("active",selected);
    if(node.getAttribute("role")==="tab")node.setAttribute("aria-selected",String(selected));
  });
  history.replaceState(null,"",location.pathname+location.search+"#"+name);
  if(window.innerWidth<740)window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",()=>setView(el.dataset.view)));
function step(index,state){
  const el=document.querySelector('.step[data-step="'+index+'"]');
  if(!el)return;
  el.classList.remove("active","complete");
  if(state)el.classList.add(state);
  el.querySelector(".step-icon").textContent=state==="complete"?"✓":String(index+1);
}
function status(text,tone="neutral"){
  const el=$("run-status");el.textContent=text;el.className="pill "+tone;
}
function buildOutput(s,baseline,solver,scenarios){
  const diagnostics=catalogue.map((p,i)=>({
    ...p,baseline:baseline.quantities[i],optimised:solver.quantities[i],
    change:solver.quantities[i]-baseline.quantities[i],
    baselineScore:scoreProduct(p,baseline.quantities[i],s),
    optimisedScore:scoreProduct(p,solver.quantities[i],s)
  }));
  return {
    settings:s,comparison:baseline,optimised:solver,scenarios,diagnostics,
    delta:solver.evaluation.contribution-baseline.evaluation.contribution,
    fillDelta:solver.evaluation.fill-baseline.evaluation.fill
  };
}
async function run(){
  if(busy)return;
  busy=true;
  const btn=$("run-optimisation");btn.disabled=true;
  document.querySelectorAll(".step").forEach((_,i)=>step(i,""));
  let s,baseline,solver,scenarios;
  try{
    status("Evaluating","working");
    for(let i=0;i<5;i++){
      step(i,"active");
      if(i===0){s=readInputs();if(s.budget<15000||s.capacity<200)throw new Error("Resource limits too low");}
      if(i===1)baseline=comparisonPolicy(s);
      if(i===2)solver=optimise(s);
      if(i===3)scenarios=Object.keys(cases).map(key=>({key,label:cases[key].label,optimised:evaluate(solver.quantities,s,key),comparison:evaluate(baseline.quantities,s,key)}));
      if(i===4){
        const result=buildOutput(s,baseline,solver,scenarios);validateResult(result);
        report=result;renderResult(result);
      }
      await pause(240);
      step(i,"complete");
    }
    status("Analysis complete","good");
    $("update-note").textContent="Allocation calculated · all constraints verified.";
    $("update-note").classList.remove("changed");
  }catch(err){
    status("Review inputs","working");
    $("update-note").textContent="Calculation failed: "+(err?.message||"Unknown error");
    $("update-note").classList.add("changed");
  }finally{btn.disabled=false;busy=false;}
}
$("run-optimisation").addEventListener("click",run);
$("reset").addEventListener("click",()=>{
  $("budget").value="33000";$("capacity").value="450";$("market").value="base";
  $("uncertainty").value="100";$("service").value="100";period=4;
  document.querySelectorAll("[data-period]").forEach(b=>b.classList.toggle("chosen",Number(b.dataset.period)===4));
  showReadouts();run();
});
function text(id,value){$(id).textContent=String(value);}
function renderResult(r){
  const s=r.settings,o=r.optimised.evaluation,b=r.comparison.evaluation;
  text("kpi-gain",(r.delta>=0?"+":"")+money(r.delta));
  text("kpi-fill",percent(o.fill));
  text("kpi-fill-compare","vs "+percent(b.fill)+" with reference policy");
  text("kpi-spend",money(o.spend));
  text("kpi-budget",money(s.budget-o.spend)+" budget remaining");
  text("kpi-space",integer(o.storage)+" / "+integer(s.capacity));
  text("kpi-capacity",integer(s.capacity-o.storage)+" additional slots remaining");
  text("comparison-contribution",money(b.contribution));
  text("optimal-contribution",money(o.contribution));
  text("comparison-fill",percent(b.fill));text("optimal-fill",percent(o.fill));
  text("comparison-spend",money(b.spend));text("optimal-spend",money(o.spend));
  text("comparison-lost",integer(b.lost));text("optimal-lost",integer(o.lost));
  renderBars(r);renderTable(r);renderScenarios(r);renderInsights(r);renderExecutiveBrief(r);
}
function el(tag,cls,value){
  const node=document.createElement(tag);if(cls)node.className=cls;if(value!==undefined)node.textContent=String(value);return node;
}
function renderBars(r){
  const target=$("bar-chart");target.replaceChildren();
  const max=Math.max(...r.diagnostics.flatMap(p=>[p.baseline,p.optimised]),1);
  r.diagnostics.forEach(p=>{
    const row=el("div","bar-row");
    const name=el("div","bar-name"),strong=el("strong","",p.name),small=el("small","",p.category);name.append(strong,small);
    const lines=el("div","bar-lines");
    for(const [value,cls] of [[p.baseline,"reference"],[p.optimised,"optimised"]]){
      const track=el("div","bar-track"),fill=el("div","bar-fill "+cls);fill.style.width=(value/max*100)+"%";
      track.setAttribute("title",cls+": "+integer(value)+" units");
      track.append(fill);lines.append(track);
    }
    const values=el("div","bar-values"),v1=el("span","",integer(p.baseline)),v2=el("strong","",integer(p.optimised));values.append(v1,v2);row.append(name,lines,values);target.append(row);
  });
}
function renderTable(r){
  const target=$("allocation-table");target.replaceChildren();
  r.diagnostics.forEach(p=>{
    const tr=el("tr");
    const first=el("td"),name=el("strong","",p.name),category=el("small","",p.category);first.append(name,category);tr.append(first);
    const cells=[integer(p.optimisedScore.expected),integer(p.stock),integer(p.baseline),integer(p.optimised),(p.change>0?"+":"")+integer(p.change)];
    cells.forEach((value,i)=>{const td=el("td",i===4?(p.change>0?"delta-positive":p.change<0?"delta-negative":""):"",value);tr.append(td)});
    target.append(tr);
  });
}
function renderScenarios(r){
  const target=$("stress-rows");target.replaceChildren();
  r.scenarios.forEach(sc=>{
    const item=el("article","stress-case"+(sc.key===r.settings.market?" selected":""));
    const label=el("div","scenario-label",sc.label.toUpperCase());
    const value=el("strong","",money(sc.optimised.contribution));
    const sub=el("small","","Modelled contribution · fixed purchase plan");
    const foot=el("div","scenario-foot");
    const gain=sc.optimised.contribution-sc.comparison.contribution;
    const sign=gain>=0?"+":"−";
    const note=el("span","",sign+money(Math.abs(gain))+" vs reference rule");
    foot.append(note);
    item.append(label,value,sub,foot);target.append(item);
  });
}
function renderInsights(r){
  const target=$("insights");target.replaceChildren();
  const o=r.optimised.evaluation,s=r.settings;
  const opportunities=[
    {head:"Expected contribution",description:"The selected allocation improves the modelled objective by "+money(r.delta)+" over the comparison rule under the current assumptions."},
    {head:"Customer demand coverage",description:"Expected fulfilled demand changes by "+(r.fillDelta>=0?"+":"")+ (r.fillDelta*100).toFixed(1)+" percentage points versus the reference plan."},
    {head:"Feasibility checked",description:"Purchase cost "+money(o.spend)+" ≤ "+money(s.budget)+" budget; "+integer(o.storage)+" ≤ "+integer(s.capacity)+" available storage units."}
  ];
  opportunities.forEach((obj,i)=>{
    const wrapper=el("div","insight"),symbol=el("span","insight-symbol",["↗","≈","✓"][i]);
    const body=el("div"),h=el("strong","",obj.head),p=el("p","",obj.description);
    body.append(h,p);wrapper.append(symbol,body);target.append(wrapper);
  });
  text("constraint-badge","Constraints respected · "+integer(r.optimised.explored)+" candidate transitions");
}
$("export-plan").addEventListener("click",()=>{
  if(!report)return;
  const s=report.settings;
  const rows=[
    ["SC-Analytics inventory optimisation","Fictional demonstration"],
    ["Market",cases[s.market].label],["Planning weeks",s.period],
    ["Budget EUR",s.budget],["Capacity units",s.capacity],
    [],
    ["Product line","Demand","On-hand stock","Reference order units","Optimised order units","Optimised purchase cost EUR"],
    ...report.diagnostics.map(p=>[p.name,Math.round(p.optimisedScore.expected),p.stock,p.baseline,p.optimised,p.optimised*p.unitCost]),
    [],["Reference contribution EUR",report.comparison.evaluation.contribution],
    ["Optimised contribution EUR",report.optimised.evaluation.contribution],
    ["Modelled delta EUR",report.delta],
    ["Modelled fill rate",report.optimised.evaluation.fill],
    ["Disclaimer","Illustrative expectations based only on synthetic data; not realised savings"]
  ];
  const csv=rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");
  const link=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  link.href=url;link.download="sc-analytics-optimisation-plan.csv";
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
});

function renderExecutiveBrief(r){
  const s=r.settings,o=r.optimised.evaluation,b=r.comparison.evaluation;
  const metrics=[
    ["MODELLED CONTRIBUTION",money(o.contribution)],
    ["ILLUSTRATIVE UPLIFT",(r.delta>=0?"+":"")+money(r.delta)],
    ["COVERED DEMAND",percent(o.fill)],
    ["BUDGET USED",money(o.spend)+" / "+money(s.budget)]
  ];
  const host=$("brief-metrics");host.replaceChildren();
  metrics.forEach(([label,value])=>{
    const card=el("div","brief-metric");
    card.append(el("span","",label),el("strong","",value));host.append(card);
  });
  text("brief-headline","A purchasing plan that respects the operating constraints");
  text("brief-summary","The optimised purchase mix produces "+money(o.contribution)+" of modelled expected contribution; "+money(r.delta)+" above the disclosed reference allocation under the same synthetic assumptions.");
  text("brief-evidence","Budget: "+money(o.spend)+" used of "+money(s.budget)+". Storage: "+integer(o.storage)+" / "+integer(s.capacity)+" units. Forecast demand coverage: "+percent(o.fill)+" versus "+percent(b.fill)+" under the reference rule.");
}
function optimisationReportHtml(r){
  const escape=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const s=r.settings,o=r.optimised.evaluation,b=r.comparison.evaluation;
  const rows=r.diagnostics.map(p=>"<tr><td>"+escape(p.name)+"</td><td>"+integer(p.optimisedScore.expected)+"</td><td>"+integer(p.stock)+"</td><td>"+integer(p.baseline)+"</td><td>"+integer(p.optimised)+"</td></tr>").join("");
  const scenarios=r.scenarios.map(x=>"<tr><td>"+escape(x.label)+"</td><td>"+money(x.optimised.contribution)+"</td><td>"+money(x.comparison.contribution)+"</td></tr>").join("");
  const style="body{font:13px/1.65 Arial,sans-serif;color:#1d3f32;max-width:930px;margin:40px auto;padding:0 22px}h1,h2{font-family:Georgia,serif;font-weight:400;letter-spacing:-.025em}h1{font-size:34px}h2{font-size:21px}header{border-bottom:3px solid #2c634c;padding-bottom:18px}header b{font-size:17px;letter-spacing:.07em}header span{float:right;color:#648474;font-size:10px}p{line-height:1.75}.metrics{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #dce6dc}.metrics>div{border-right:1px solid #dce6dc;padding:14px}.metrics span{display:block;font-size:10px;color:#628b6c}.metrics strong{display:block;font-size:20px;line-height:1.3;overflow-wrap:anywhere;margin-top:9px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid #e1eae1;font-size:11px}th{background:#eef4ee}.note{background:#edf5ee;padding:15px;border-left:3px solid #397656;color:#486b59}.fine{font-size:10px;color:#8b9e8e;margin-top:30px}@media print{@page{size:A4;margin:15mm}body{padding:0;margin:0}table,.metrics{break-inside:avoid}}";
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>SC-Analytics Inventory Optimisation Executive Brief</title><style>'+style+'</style></head><body><header><b>SC—ANALYTICS</b><span>OPTIMISATION / EXECUTIVE BRIEF</span></header><h1>Inventory allocation decision</h1><p>Illustrative '+escape(cases[s.market].label)+' scenario · '+s.period+'-week horizon · results calculated locally using exact discrete dynamic programming.</p><div class="metrics"><div><span>MODELLED CONTRIBUTION</span><strong>'+money(o.contribution)+'</strong></div><div><span>CONTRIBUTION VS REFERENCE</span><strong>'+money(r.delta)+'</strong></div><div><span>EXPECTED FILL RATE</span><strong>'+percent(o.fill)+'</strong></div><div><span>RESOURCE UTILISATION</span><strong>'+money(o.spend)+' / '+money(s.budget)+'</strong></div></div><h2>Executive interpretation</h2><p>The optimised allocation improves expected contribution by '+money(r.delta)+' over the disclosed comparison rule under the same fictional demand assumptions. It requires '+money(o.spend)+' of purchasing budget and '+integer(o.storage)+' storage slots, within the selected limits.</p><div class="note">Model value is illustrative, not observed profit or verified savings. Calibrate demand, margins and procurement constraints before any business decision.</div><h2>Purchasing plan by product line</h2><table><thead><tr><th>Product</th><th>Demand</th><th>On hand</th><th>Reference</th><th>Optimised</th></tr></thead><tbody>'+rows+'</tbody></table><h2>Scenario stress tests</h2><table><thead><tr><th>Scenario</th><th>Optimised contribution</th><th>Reference contribution</th></tr></thead><tbody>'+scenarios+'</tbody></table><h2>Recommended next actions</h2><ol><li>Validate product-level demand and supply lead times on actual ERP records.</li><li>Review carrying costs, lost-demand penalties and contractual purchasing limits.</li><li>Integrate an audited approval process before operational purchasing.</li></ol><p class="fine">© 2026 SC-Analytics · Synthetic inputs, calculated outputs. No ERP connection or realised customer savings.</p></body></html>';
}
function saveReport(body,filename){
  const blob=new Blob([body],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
}
$("download-optimisation-brief").addEventListener("click",()=>{
  if(!report)return;
  saveReport(optimisationReportHtml(report),"SC-Analytics-Optimisation-Executive-Brief.html");
});
$("print-optimisation-brief").addEventListener("click",()=>{if(report)window.print()});

showReadouts();
try{
  report=runOptimisation(readInputs());validateResult(report);renderResult(report);
  $("update-note").textContent="Example outcome ready · run to inspect the workflow.";
}catch(err){$("update-note").textContent="Unable to calculate initial example: "+err.message;}
setView(location.hash.slice(1)||"plan");
