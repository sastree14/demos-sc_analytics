import {evaluateDecision,answerGuide,explainSensitivity,number,links,familyColors} from "./decision-engine.js";

/**
 * Installs a reusable, fully-local decision layer across SC-Analytics demos.
 * Adapter: read() -> {id,label,result,params,controls}; apply(inputs); run() -> Promise/void.
 * No session storage, backend API calls, automatic business decisions or LLM claims.
 */
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n};
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cloneData=x=>JSON.parse(JSON.stringify(x));
const makeButton=(text,fn,css="sc-action")=>{const n=el("button",css,text);n.type="button";n.addEventListener("click",fn);return n};
const PAGE_NAMES=["Decision brief","Business analysis","Compare scenarios","Action & monitoring"];
export function installDecisionExperience({family,read,apply,run,simulate}){
 const canonical=familyColors[family]?family:"predictive-models";
 document.body.dataset.family=canonical;
 const state={saved:new Map(),context:null,decision:null,reportPage:0,clientLabel:""};
 const stylesheet=document.createElement("link");
 stylesheet.rel="stylesheet";stylesheet.href=new URL("./experience.css",import.meta.url).href;
 document.head.append(stylesheet);
 const brand=document.querySelector(".brand-monogram, .monogram, .brand-emblem");
 if(brand)brand.textContent="SC";
 const oldBrand=document.querySelector(".logo-name, .brand-name b");
 if(oldBrand&&oldBrand.textContent.includes("SC"))oldBrand.childNodes[0]&&(oldBrand.childNodes[0].textContent="SC-ANALYTICS");
 // Consistent navigation is deliberately placed outside each demo's sidebar.
 const nav=el("nav","sc-crossnav");nav.setAttribute("aria-label","Navigate solution families");
 nav.append(el("strong","","SC-ANALYTICS / SOLUTIONS"));
 for(const [id,name] of links){
  const a=el("a",id===canonical?"is-current":"",name);
  a.href="../"+id+"/";if(id===canonical)a.setAttribute("aria-current","page");nav.append(a);
 }
 const mainTop=document.querySelector(".topbar,.top");
 if(mainTop)mainTop.after(nav);else document.body.prepend(nav);

 const toolbar=el("section","sc-toolbar");
 toolbar.setAttribute("aria-label","Decision workspace tools");
 const toolbarCopy=el("div");toolbarCopy.append(el("h3","","Decision workspace"),el("small","","Understand the current result, test alternatives and explain the next action."));
 const serviceCTA=el("a","sc-action sc-action-primary","Explore this with our data");
 const impactBoard=el("section","sc-impact-board");
 const toolbarActions=el("div","sc-toolbar-actions");
 toolbarActions.append(makeButton("Open full report ↗",()=>openReport(0),"sc-action sc-action-primary"),
  makeButton("Compare scenarios",()=>openReport(2)),
  makeButton("Ask Decision Guide",()=>toggleGuide(true)),makeButton("Preview client branding",()=>previewBrand()));
 toolbarActions.append(serviceCTA);toolbar.append(toolbarCopy,toolbarActions);
 const root=document.querySelector(".body,.main-column main,.workspace main,main")||document.body;
 const hero=root.querySelector(".hero,.intro");
 if(hero)hero.after(toolbar);else root.prepend(toolbar);toolbar.after(impactBoard);

 const callout=el("section","sc-decision");
 callout.setAttribute("aria-label","What should you do next?");
 const cLeft=el("div"),cRight=el("div","sc-decision-body");
 cLeft.append(el("div","sc-eyebrow","WHAT SHOULD YOU DO NEXT?"));
 const badge=el("span","sc-decision-status","ASSESSING"),headline=el("h3","","What should you do next?"),reason=el("p","","Run an example to inspect decision options.");
 const guideLink=makeButton("Why this recommendation? ↗",()=>{toggleGuide(true);ask("Why are you recommending this?")},"sc-action");
 guideLink.style.marginTop="15px";
 cLeft.append(badge,headline,reason,guideLink);
 const lineWhy=el("div"),lineTrigger=el("div"),lineAction=el("div"),lineReview=el("div");
 for(const [slot,title] of [[lineWhy,"WHY"],[lineTrigger,"ILLUSTRATIVE DECISION THRESHOLD"],[lineAction,"POSSIBLE NEXT ACTION"],[lineReview,"WHEN TO REASSESS"]])slot.append(el("strong","",title),el("div","","—"));
 cRight.append(lineWhy,lineTrigger,lineAction,lineReview);callout.append(cLeft,cRight);

 const scenarios=el("section","sc-scenarios");
 scenarios.setAttribute("aria-label","Scenario comparison");
 const scTop=el("div","sc-scenarios-header");
 const scIntro=el("div");
 scIntro.append(el("h3","","Compare business options"),el("p","","Save two alternatives, adjust assumptions, then compare the evidence. Scenarios stay in this browser session."));
 scTop.append(scIntro,makeButton("Compare 3 plans ↗",()=>openReport(2)));
 const slotBox=el("div","sc-scenario-slots");scenarios.append(scTop,slotBox);
 const anchor=document.querySelector("#report,.report-section,#executive-report,.executive-brief");
 if(anchor){anchor.before(callout);anchor.before(scenarios);}
 else root.append(callout,scenarios);

 const stageDetails=[
 "Define the business question and gather the example input records.",
 "Check completeness, valid ranges and the constraints that the decision must respect.",
 "Execute the mathematical model or documented decision rules against the current synthetic scenario.",
 "Compare feasible options, review exceptions and identify where human approval is needed.",
 "Check outputs, limitations and the next monitoring condition before sharing a recommendation."
 ];
 document.querySelectorAll(".workflow-step,.step").forEach((node,i)=>{
  if(i<stageDetails.length){
   node.title=stageDetails[i];
   if(!node.querySelector(".sc-step-explain"))node.append(el("small","sc-step-explain",stageDetails[i]));
  }
 });
 const modeHolder=el("label","sc-present-mode");
 const modeCheck=document.createElement("input");
 modeCheck.type="checkbox";modeCheck.id="sc-fast-mode";
 modeHolder.append(modeCheck,document.createTextNode("Quick mode (skip presentation pauses)"));
 modeHolder.title="The 2-second presentation steps are illustrative animations, not compute time.";
 const workflow=document.querySelector("#workflow,.workflow-section,.runbook");
 const wfHead=workflow?.querySelector(".section-head,.section-heading,.runbook-header")||workflow;
 if(wfHead)wfHead.after(modeHolder);

 // Contextual guide: deterministic text grounded in the current calculated state.
 const floating=makeButton("◉ Decision Guide",()=>toggleGuide(),"sc-guide-trigger");
 floating.setAttribute("aria-label","Open Decision Guide");
 document.body.append(floating);
 const guide=el("aside","sc-guide");guide.hidden=true;guide.setAttribute("aria-label","Decision Guide");
 const guideHead=el("div","sc-guide-head"),guideTitle=el("div");
 guideTitle.append(el("b","","Decision Guide"),el("small","","Your decisions, explained. · Local rules by SC-Analytics"));
 guideHead.append(guideTitle,makeButton("×",()=>toggleGuide(false),"sc-guide-close"));
 const log=el("div","sc-guide-log");log.setAttribute("aria-live","polite");
 const quick=el("div","sc-guide-quick"),form=el("form","sc-guide-form"),input=document.createElement("input");
 input.type="text";input.placeholder="Ask about the current business decision…";input.maxLength=500;input.setAttribute("aria-label","Ask a question about this analysis");
 const send=el("button","","Ask");send.type="submit";form.append(input,send);
 guide.append(guideHead,log,quick,form,el("div","sc-guide-note","No external AI or business systems are contacted. Explanations are computed from the demo's current results."));
 document.body.append(guide);
 const prompts=["Why this action?","What changes the decision?","What if I wait?","What is the financial impact?","Compare alternatives","Explain this chart"];
 prompts.forEach(x=>quick.append(makeButton(x,()=>ask(x))));
 const whatif=makeButton("Try +10% in a selected input",()=>proposeWhatIf());
 quick.append(whatif);
 function previewBrand(){
  const answer=window.prompt("Optional company name for this browser-only white-label preview. Leave blank to restore SC-Analytics.",state.clientLabel);
  if(answer===null)return;
  state.clientLabel=answer.trim().slice(0,48);
  toolbarCopy.querySelector("h3").textContent=state.clientLabel?state.clientLabel+" · Decision workspace":"Decision workspace";
  guideTitle.querySelector("b").textContent=state.clientLabel?state.clientLabel+" · Decision Guide":"Decision Guide";
  guideTitle.querySelector("small").textContent=state.clientLabel?"Powered by SC-Analytics · Local decision explanations":"Your decisions, explained. · Local rules by SC-Analytics";
  if(dialog.open)reportBuilder();
 }
 function toggleGuide(force){
  const open=force===undefined?guide.hidden:Boolean(force);
  guide.hidden=!open;floating.setAttribute("aria-expanded",String(open));
  if(open&&!log.childNodes.length)addChat("assistant","Hi. I can explain the current analysis, the threshold that changes the recommendation, or what an alternative scenario would do. I use transparent decision rules, not a remote AI model.");
  if(open)input.focus();
 }
 function addChat(role,message){
  const item=el("div","sc-chat "+role,message);log.append(item);log.scrollTop=log.scrollHeight;
 }
 function contextForGuide(){const x=state.context||read();return {...x,decision:state.decision,alternatives:savedFor(x?.id)};}
 function ask(text){
  toggleGuide(true);addChat("user",text);
  const ctx=contextForGuide();
  if(simulate && /which (variable|input)|matters most|most influential/i.test(text)){addChat("assistant",explainSensitivity(ctx,simulate));return;}
  const test=text.match(/what if.*?(increas|decreas|rais|reduc).*?(\d+(?:\.\d+)?)\s*%/i);
  if(test){
   const term=text.toLowerCase();
   let control=ctx.controls.find(c=>c.kind!=="choice"&&(term.includes(c.key.toLowerCase())||term.includes(c.label.toLowerCase())));
   if(!control&&ctx.result?.kind==="forecast"&&/demand|sales|workload|revenue/.test(term)){
    control=ctx.controls.find(c=>c.key==="outlook");
   }
   if(control){
    const direction=/decreas|reduc/i.test(test[1])?-1:1;
    proposeWhatIf(control,Number(test[2])*direction);
   }else{
    addChat("assistant","Select an input available for "+ctx.label+": "+ctx.controls.map(c=>c.label).join(", ")+".");
   }
   return;
  }
  addChat("assistant",answerGuide(text,ctx));
 }
 form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value="";ask(q);});
 function proposeWhatIf(selected,change=10){
  const x=read(),controls=x.controls||[],c=selected||controls.find(y=>y.kind!=="choice"&&(/demand|capacity|volume|budget|staff|growth|cost|price|stock/.test(y.key)))||controls.find(y=>y.kind!=="choice");
  if(!c){ask("What can I change?");return;}
  const prior=Number(x.params[c.key]);
  const step=Math.max(Number(c.step)||1,.001),max=Number.isFinite(c.max)?c.max:prior*2;
  const target=c.unit==="%"?prior+change:prior*(1+change/100);
  const next=Math.max(c.min,Math.min(max,c.min+Math.round((target-c.min)/step)*step));
  toggleGuide(true);
  if(next===prior){addChat("assistant",c.label+" stays at "+prior+" after applying the input limits and step size. Try another change.");return;}
  addChat("assistant","I propose a what-if test: "+c.label+" from "+prior+" to "+next+". This is a local synthetic scenario, not an operational action. Apply this change?");
  const row=el("div","sc-guide-quick");
  row.append(makeButton("Apply & recalculate",async()=>{
   if(document.querySelector("#calculate:disabled,#run-analysis:disabled,#run-optimisation:disabled"))return;
   row.remove();const updated={...x.params,[c.key]:next};await apply(updated);await run();refresh();
   addChat("assistant","The scenario has been recalculated. "+(state.decision?.why||"See the updated model results."));
  },"sc-action sc-action-primary"),makeButton("Cancel",()=>{row.remove();addChat("assistant","No input was changed.");}));
  log.append(row);log.scrollTop=log.scrollHeight;
 }
 // In-app document reader. Four actual report sections, not a scaled-down card.
 const dialog=document.createElement("dialog");
 dialog.className="sc-report-dialog";dialog.setAttribute("aria-label","Full executive report");
 const shell=el("div","sc-report-shell"),head=el("div","sc-report-head"),headTitle=el("div");
 headTitle.append(el("strong","","SC-ANALYTICS · FULL EXECUTIVE REPORT"),el("small","","Fictional data · Real calculations · Advisory only"));
 const actions=el("div","sc-report-actions");
 actions.append(makeButton("Download HTML",downloadFullReport),makeButton("Print / save PDF",printFullReport),makeButton("Close ×",()=>dialog.close()));
 head.append(headTitle,actions);
 const pagination=el("nav","sc-report-pagination"),scroll=el("div","sc-report-scroll"),doc=el("div","sc-report-document");
 scroll.append(doc);shell.append(head,pagination,scroll);dialog.append(shell);document.body.append(dialog);
 dialog.addEventListener("close",()=>document.body.classList.remove("sc-report-print"));
 window.addEventListener("afterprint",()=>document.body.classList.remove("sc-report-print"));
 function paper(parent,pageIndex,title,eyebrow){
  const page=el("article","sc-report-page"+(pageIndex===state.reportPage?" active":""));page.dataset.page=String(pageIndex);
  const top=el("div","sc-report-paper-top");top.append(el("b","",state.clientLabel||"SC-ANALYTICS"),el("span","","EXECUTIVE DECISION INTELLIGENCE / MODELLED EXAMPLE"));
  page.append(top,el("div","sc-report-eyebrow",eyebrow),el("h2","",title));parent.append(page);return page;
 }
 function foot(page,n){page.append(el("div","sc-report-paper-foot","SC-ANALYTICS · SYNTHETIC DATA · NO VERIFIED CLIENT OUTCOMES · "+(n+1)+" / 4"));}
 function para(root,text){root.append(el("p","",text||"Not specified for this example."));}
 function metrics(root,data){
  const panel=el("div","sc-report-metrics");
  (data||[]).forEach(x=>{const item=el("div","sc-report-metric");
   item.append(el("small","",x.label),el("strong","",x.value),el("p","",x.hint));panel.append(item);});
  root.append(panel);
 }
 function highlight(root,title,body){
  const panel=el("div","sc-report-highlight");panel.append(el("b","",title),el("p","",body));root.append(panel);
 }
 function table(root,heads,rows){
  const t=el("table","sc-report-table"),h=el("thead"),tr=el("tr");
  heads.forEach(x=>tr.append(el("th","",x)));h.append(tr);t.append(h);
  const b=el("tbody");rows.forEach(values=>{const row=el("tr");values.forEach(x=>row.append(el("td","",x)));b.append(row)});t.append(b);root.append(t);
 }
 function list(root,values){
  const l=el("ol");values.forEach(x=>l.append(el("li","",x)));root.append(l);
 }
 function reportBuilder(){
  const ctx=state.context||read();if(!ctx?.result)return;
  const r=ctx.result,d=state.decision||evaluateDecision(ctx);
  doc.replaceChildren();
  const p1=paper(doc,0,ctx.label||"Business decision brief","01 / EXECUTIVE SUMMARY");
  para(p1,"Business question: "+(ctx.question||ctx.label||"Determine the next appropriate operational action."));
  metrics(p1,r.metrics||[]);
  highlight(p1,"WHAT SHOULD YOU DO NEXT? · "+d.status,d.why+" "+d.threshold);
  p1.append(el("h3","","Economic or operating implication"));para(p1,(r.impact?.label||"Current impact")+": "+(r.impact?.value||"n/a")+". "+(r.impact?.formula||r.impact?.subtitle||"Calculation supplied in the model."));
  p1.append(el("h3","","Business interpretation"));para(p1,r.decision?.summary||r.summary||d.why);foot(p1,0);
  const p2=paper(doc,1,"Evidence behind the recommendation","02 / BUSINESS ANALYSIS");
  p2.append(el("h3","",r.chart?.title||document.getElementById("main-chart-title")?.textContent||"Operational model and comparison"));
  para(p2,r.chart?.subtitle||document.getElementById("main-chart-subtitle")?.textContent||"Current scenario output and comparison.");
  const figure=el("div","sc-report-figure");
  const sourceSvg=document.querySelector("#main-chart svg,.figure-main svg,.figure svg");
  if(sourceSvg){const copy=sourceSvg.cloneNode(true);copy.removeAttribute("role");figure.append(copy);}
  else{const source=document.querySelector("#bar-chart");
   if(source){
    const graph=source.cloneNode(true);graph.removeAttribute("id");
    graph.querySelectorAll(".bar-row").forEach(row=>row.style.cssText="display:grid;grid-template-columns:32% 1fr 14%;gap:8px;align-items:center;margin:6px 0;font-size:11px");
    graph.querySelectorAll(".bar-name small,.bar-values span").forEach(n=>n.style.display="block");
    graph.querySelectorAll(".bar-fill").forEach(n=>{n.style.height="6px";n.style.margin="3px 0";n.style.background=n.classList.contains("reference")?"#b7ac8e":"#438568";});
    figure.append(graph);
   }}
  figure.append(el("p","","Generated from the currently executed synthetic scenario."));
  p2.append(figure);
  p2.append(el("h3","","Sample records and quality checks"));
  if(r.table?.rows?.length)table(p2,r.table.columns,r.table.rows.slice(0,8));
  else if(r.quality?.length)table(p2,["Check","Result"],r.quality.slice(0,8).map(check=>Array.isArray(check)?check:[check.name,check.value]));
  else para(p2,r.methodology||"No sample table for this model.");
  para(p2,r.methodology||"Method details are documented by the model.");foot(p2,1);
  const p3=paper(doc,2,"Current plan versus alternatives","03 / SCENARIO COMPARISON");
  para(p3,"Alternative A and B use the inputs and outputs of saved calculations. They are not historical client results.");
  const opts=[{label:"Current plan",result:r,decision:d,params:ctx.params},...savedFor(ctx.id)];
  const headers=["Metric",...opts.map(x=>x.label)];
  const metricLabels=[...new Set(opts.flatMap(x=>x.result.metrics?.map(m=>m.label)||[]))].slice(0,12);
  const rows=metricLabels.map(label=>[label,...opts.map(x=>x.result.metrics?.find(m=>m.label===label)?.value||"—")]);
  if(r.impact)rows.push([r.impact.label,...opts.map(o=>o.result.impact?.value??"—")]);
  if(rows.length)table(p3,headers,rows);
  table(p3,["Scenario","Suggested decision","Reason"],opts.map(x=>[x.label,x.decision.status,x.decision.why]));
  p3.append(el("h3","","Executed assumptions"));
  const inputs=(ctx.controls||[]).map(c=>[c.label,...opts.map(o=>{const value=o.params[c.key];return (c.choices||c.values)?.find(([key])=>key===value)?.[1]??(String(value)+(c.unit||""));})]);
  if(inputs.length)table(p3,["Business input",...opts.map(o=>o.label)],inputs);
  foot(p3,2);
  const p4=paper(doc,3,"Action and monitoring plan","04 / DECISION & GOVERNANCE");
  highlight(p4,d.status,d.next);
  p4.append(el("h3","","Recommended next actions"));list(p4,d.actions.length?d.actions:[d.next]);
  p4.append(el("h3","","What would change this decision?"));para(p4,d.threshold);
  p4.append(el("h3","","When should management review it?"));para(p4,d.review);
  p4.append(el("h3","","Method and limitations"));para(p4,r.methodology||"Synthetic analysis. No independent validation on client data.");
  para(p4,(r.impact?.note||"All economic impacts are modelled assumptions.")+" "+d.limits);
  p4.append(el("h3","","Suggested sign-off"));para(p4,"Review the evidence, confirm operating constraints and secure the relevant internal authorisation before any action.");
  foot(p4,3);
  pagination.replaceChildren();
  PAGE_NAMES.forEach((name,i)=>{
   const b=makeButton(String(i+1)+". "+name,()=>setPage(i),i===state.reportPage?"active":"");
   pagination.append(b);
  });
 }
 function setPage(i){
  state.reportPage=i;
  [...doc.children].forEach((page,k)=>page.classList.toggle("active",k===i));
  [...pagination.children].forEach((n,k)=>n.classList.toggle("active",k===i));
  scroll.scrollTop=0;
 }
 function openReport(page=0){
  state.reportPage=page;reportBuilder();setPage(page);
  if(!dialog.open)dialog.showModal();
 }
 function printFullReport(){
  if(!dialog.open)openReport(0);
  document.body.classList.add("sc-report-print");window.print();
 }
 function downloadFullReport(){
  reportBuilder();
  const htmlCSS="body{font:13px/1.7 Arial,sans-serif;color:#25443b;max-width:920px;margin:20px auto;padding:0 18px}.sc-report-page{padding:25px 30px;min-height:850px;break-after:page;border:1px solid #dbe6db;margin:0 0 20px;display:block!important}.sc-report-paper-top{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #438568;padding-bottom:15px}.sc-report-paper-top b{font-size:18px}.sc-report-paper-top span,.sc-report-eyebrow{font-size:10px;color:#458767;letter-spacing:.12em}.sc-report-page h2{font:normal 34px Georgia,serif}.sc-report-page h3{font:normal 22px Georgia,serif;margin-top:23px}p,li{line-height:1.8}.sc-report-metrics{display:grid;grid-template-columns:1fr 1fr;gap:10px}.sc-report-metric,.sc-report-highlight{border:1px solid #d9e7dc;padding:13px}.sc-report-metric small{display:block;font-size:10px}.sc-report-metric strong{display:block;font-size:21px}.sc-report-figure svg{width:100%;max-height:250px}.sc-report-table{width:100%;border-collapse:collapse;font-size:11px}.sc-report-table th,.sc-report-table td{border-bottom:1px solid #dbe6db;padding:8px;text-align:left}.sc-report-paper-foot{font-size:9px;color:#7c9b89;margin-top:30px}@media print{@page{size:A4;margin:13mm}.sc-report-page{border:0;break-after:page;margin:0;min-height:0;padding:0}.sc-report-page:last-child{break-after:auto}.sc-report-table td,.sc-report-table th{padding:4px}.sc-report-page p,.sc-report-page li{line-height:1.4;margin:6px 0}}";
  const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>SC-Analytics · '+safe(state.context?.label||"Executive report")+'</title><style>'+htmlCSS+'</style></head><body>'+doc.outerHTML+'</body></html>';
  const name="SC-Analytics-"+(state.context?.id||"Decision")+"-Executive-Report.html",url=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"}));
  const a=el("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 // Save comparable scenarios for this exact case, never across unrelated companies or models.
 function savedFor(id){
  const slots=state.saved.get(id)||{};
  return ["A","B"].filter(k=>slots[k]).map(k=>({label:"Alternative "+k,...slots[k]}));
 }
 function saveInto(letter){
  const ctx=state.context;if(!ctx?.result)return;
  if(!state.saved.has(ctx.id))state.saved.set(ctx.id,{});
  state.saved.get(ctx.id)[letter]={
   params:cloneData(ctx.params),result:cloneData({metrics:ctx.result.metrics,impact:ctx.result.impact,decision:ctx.result.decision,chart:ctx.result.chart,methodology:ctx.result.methodology,quality:ctx.result.quality,table:ctx.result.table}),
   decision:cloneData(state.decision||evaluateDecision(ctx))
  };
  renderSlots();
 }
 function restoreSlot(letter){
  const ctx=read(),saved=state.saved.get(ctx?.id)?.[letter];
  if(!saved||document.querySelector("#calculate:disabled,#run-analysis:disabled,#run-optimisation:disabled"))return;apply(cloneData(saved.params));run();
 }
 function renderSlots(){
  const ctx=state.context||read(),opts=state.saved.get(ctx?.id)||{};
  slotBox.replaceChildren();
  const current=el("div","sc-scenario-slot");current.append(el("strong","","Current plan"),el("small","",state.decision?.status||"Run a scenario"),makeButton("Open report",()=>openReport(0)));
  slotBox.append(current);
  for(const letter of ["A","B"]){
   const saved=opts[letter],item=el("div","sc-scenario-slot");
   item.append(el("strong","","Alternative "+letter),
    el("small","",saved?saved.decision.status+" · saved inputs":"Not saved yet · modify inputs and run an analysis"));
   item.append(makeButton(saved?"Overwrite":"Save current",()=>saveInto(letter)));
   if(saved)item.append(makeButton("Restore & run",()=>restoreSlot(letter)));
   slotBox.append(item);
  }
 }
 function refresh(){
  const ctx=read();if(!ctx?.result)return;
  if(state.context?.id!==ctx.id)log.replaceChildren();
  log.querySelectorAll(".sc-guide-quick").forEach(row=>row.remove());
  state.context=ctx;
  toolbarCopy.querySelector("h3").textContent=ctx.label;
  toolbarCopy.querySelector("small").textContent="Change one business constraint and see what it does to the result. A client implementation uses your records, rules and costs.";
  const url=new URL("https://www.sc-analytics.io/contact");url.searchParams.set("intent","problem");url.searchParams.set("demo",canonical);url.searchParams.set("case",ctx.id);serviceCTA.href=url.href;
  impactBoard.replaceChildren();
  const control=ctx.controls?.find(c=>c.kind!=="choice"&&Number.isFinite(c.max)&&Number.isFinite(c.min)&&Number.isFinite(Number(ctx.params[c.key])));
  if(control&&simulate){
   const step=control.step||1,base=Number(ctx.params[control.key]),shift=step*Math.max(1,Math.round((control.max-control.min)*.12/step));
   const levels=[base,Math.max(control.min,base-shift),Math.min(control.max,base+shift)];
   const outcomes=levels.map((v,i)=>i?simulate(ctx.id,{...ctx.params,[control.key]:v}):ctx.result);
   const impacts=outcomes.map(o=>number(o.impact?.value));
   if(impacts.every(Number.isFinite)){
    impactBoard.append(el("h3","",ctx.result.impact.label),el("p","","Three scenarios for "+control.label+". All other inputs match the current plan."));
    const lo=Math.min(0,...impacts),hi=Math.max(0,...impacts),span=hi-lo||1;
    outcomes.forEach((o,i)=>{
     const row=el("div","sc-impact-row"),track=el("span","sc-impact-track"),bar=el("i");
     bar.style.left=(Math.min(0,impacts[i])-lo)/span*100+"%";bar.style.width=Math.abs(impacts[i])/span*100+"%";track.append(bar);
     const diff=impacts[i]-impacts[0],currency=String(o.impact.value).includes("€");
     const delta=new Intl.NumberFormat("en-GB",{signDisplay:"exceptZero",maximumFractionDigits:2,...(currency?{style:"currency",currency:"EUR"}:{})}).format(diff);
     row.append(el("b","","ABC"[i]),el("span","",levels[i]+(control.unit||"")),track,el("strong","",String(o.impact.value)),el("small","",i?delta+" vs A":"Reference"));impactBoard.append(row);
    });
   }
  }
  impactBoard.hidden=!impactBoard.childElementCount;
  state.decision=evaluateDecision(ctx);
  badge.textContent=state.decision.status;badge.dataset.level=state.decision.level;
  headline.textContent=state.decision.level==="wait"?"Monitor before changing the plan":
   state.decision.level==="review"?"An exception needs human judgment":
   state.decision.level==="prepare"?"Prepare an alternative, without committing yet":"Evaluate the proposed action";
  reason.textContent=state.decision.why;
  lineWhy.firstChild.textContent=ctx.result.impact?.label||"Modelled impact";
  lineWhy.lastChild.textContent=[ctx.result.impact?.value,ctx.result.impact?.formula||ctx.result.impact?.subtitle].filter(Boolean).join(" · ");
  lineTrigger.lastChild.textContent=state.decision.threshold;
  lineAction.lastChild.textContent=state.decision.next;
  lineReview.lastChild.textContent=state.decision.review;
  renderSlots();
  document.querySelectorAll(".kpi-grid .kpi").forEach(card=>{
   const label=card.querySelector(".label,.k-label")?.textContent?.trim();
   if(!label||card.dataset.scExplain==="yes")return;
   card.dataset.scExplain="yes";card.tabIndex=0;card.role="button";card.title="Explain this metric with Decision Guide";
   const open=()=>ask("Explain "+label);
   card.addEventListener("click",open);
   card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
  if(dialog.open)reportBuilder();
 }
 return {refresh,openReport,downloadFullReport,printFullReport,guide:()=>toggleGuide(true),askQuestion:ask,getDecision:()=>state.decision};
}
