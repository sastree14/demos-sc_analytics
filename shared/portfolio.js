import {modules,moduleById,caseById,initial,run,presentation} from "./portfolio-engine.js";
import {installDecisionExperience} from "./experience.js";
import {optimizationModule,optimizationCase,initialOptimization,runOptimizationCase} from "./optimization-engine.js";
const $=id=>document.getElementById(id),create=(tag,cl,txt)=>{const el=document.createElement(tag);if(cl)el.className=cl;if(txt!==undefined)el.textContent=String(txt);return el;};
const svgNS="http://www.w3.org/2000/svg",svg=(tag,attrs={},txt)=>{const el=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(txt!==undefined)el.textContent=String(txt);return el;};
const number=n=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:1}).format(n);
const compact=n=>Math.abs(n)>=1000000?number(n/1000000)+" M":Math.abs(n)>=10000?number(n/1000)+" k":number(n);
const escape=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isOptimization=document.body.dataset.module==="optimization";
const module=isOptimization?optimizationModule:moduleById(document.body.dataset.module),isWorkflow=module.id==="automation-ai"||module.id==="custom-apps";
const getCase=id=>isOptimization?optimizationCase(id):caseById(module.id,id);
const getInitial=id=>isOptimization?initialOptimization(id):initial(module.id,id);
const runModule=(id,p)=>isOptimization?runOptimizationCase(id,p):run(module.id,id,p);
let active=module.cases[0].id,inputs=getInitial(active),snapshot=null,busy=false,reviewed=new Set();
const experience=installDecisionExperience({
 family:module.id,
 read:()=>({id:active,label:getCase(active).label,question:getCase(active).short,result:snapshot,params:{...(snapshot?.params||inputs)},controls:getCase(active).inputs}),
 apply:async values=>{inputs={...values};paintControls();dirty();},
 run:()=>execute()
});
function set(id,v){$(id).textContent=String(v)}
function paintCases(){
 const host=$("case-grid");host.replaceChildren();
 module.cases.forEach((c,i)=>{
  const button=create("button","case-card"+(c.id===active?" active":""));button.type="button";button.dataset.case=c.id;
  button.setAttribute("aria-pressed",String(c.id===active));
  button.append(create("span","number",String(i+1).padStart(2,"0")+" / "+c.category),create("span","category",c.categoryShort),create("strong","",c.label),create("p","",c.short),create("span","arrow","↗"));
  if(isOptimization&&c.id==="inventory-allocation")button.title="Select here for executive view; detailed exact solver is available below.";
  button.addEventListener("click",()=>choose(c.id,true));host.append(button);
 });
}
function displayValue(value,c){
 if(c.unit.includes("€"))return number(value)+" €";
 if(c.unit==="%")return number(value)+"%";
 if(c.unit==="")return number(value);
 return number(value)+c.unit;
}
function paintControls(){
 const host=$("control-list");host.replaceChildren();
 getCase(active).inputs.forEach(c=>{
  const root=create("div","input-wrap"),head=create("div","input-header"),label=create("label","",c.label);head.append(label);root.append(head);
  if(c.kind==="range"){
   const id="input-"+c.key,labelValue=create("output","",displayValue(inputs[c.key],c));head.append(labelValue);label.htmlFor=id;
   const input=create("input");input.type="range";input.id=id;input.min=c.min;input.max=c.max;input.step=c.step;input.value=inputs[c.key];
   input.addEventListener("input",()=>{inputs[c.key]=Number(input.value);labelValue.textContent=displayValue(inputs[c.key],c);dirty()});root.append(input);
   const ends=create("div","input-ends");ends.append(create("span","",displayValue(c.min,c)),create("span","",displayValue(c.max,c)));root.append(ends);
  }else{
   const opts=create("div","choices");
   c.values.forEach(([value,name])=>{
    const b=create("button",inputs[c.key]===value?"selected":"",name);b.type="button";b.setAttribute("aria-pressed",String(inputs[c.key]===value));
    b.addEventListener("click",()=>{inputs[c.key]=value;opts.querySelectorAll("button").forEach(el=>{const isSelected=el===b;el.classList.toggle("selected",isSelected);el.setAttribute("aria-pressed",String(isSelected));});dirty()});
    opts.append(b);
   });root.append(opts);
  }
  host.append(root);
 });
}
function dirty(){set("input-status","Scenario modified · run analysis to update results.");$("input-status").classList.add("dirty");}
function choose(id,scroll=false){
 if(busy)return;
 active=caseById(module.id,id).id;inputs=getInitial(active);reviewed=new Set();
 paintCases();paintControls();
 const c=getCase(active);
 const deep=document.getElementById("optimization-advanced-link");if(deep)deep.hidden=c.id!=="inventory-allocation";
 set("current-category",c.category+" / "+c.categoryShort);
 set("current-case",c.label);set("current-copy",c.short);
 resetWorkflow();
 try{paint(runModule(active,inputs));set("input-status","Example calculated from synthetic records. Change assumptions to experiment.");$("input-status").classList.remove("dirty");}
 catch(e){set("input-status","Unable to calculate this case: "+e.message);}
 if(scroll)document.querySelector("#workbench").scrollIntoView({behavior:"smooth",block:"start"});
}
function metricCards(data,where){
 const host=$(where);host.replaceChildren();
 data.forEach(m=>{const card=create("div",where==="metrics"?"kpi":"report-metric");card.append(create("span",where==="metrics"?"k-label":"",m.label),create("strong","",m.value),create("small","",m.hint));host.append(card)});
}
function elementSvg(container,W,H){
 const root=$(container);root.replaceChildren();
 const node=svg("svg",{viewBox:"0 0 "+W+" "+H,preserveAspectRatio:"xMidYMid meet",role:"img","aria-label":"Calculated chart for "+snapshot?.case.label});
 root.append(node);return node;
}
function grid(svgNode,W,H,{left=64,right=22,top=18,bottom=43,min=0,max=100,ticks=4,formatter=compact}={}){
 const plotH=H-top-bottom,scale=max-min||1,y=value=>top+(max-value)/scale*plotH;
 for(let i=0;i<=ticks;i++){const n=min+(max-min)*(ticks-i)/ticks,Y=y(n);
  svgNode.append(svg("line",{x1:left,y1:Y,x2:W-right,y2:Y,stroke:"#e7efe7","stroke-width":1}));
  svgNode.append(svg("text",{x:left-10,y:Y+4,"text-anchor":"end","font-size":11,fill:"#98aaa0"},formatter(n)));
 }
 return {y,left,right,top,bottom,plotH};
}
function pointLine(node,points,color,width=3){
 node.append(svg("polyline",{points:points.map(([x,y])=>x.toFixed(1)+","+y.toFixed(1)).join(" "),fill:"none",stroke:color,"stroke-width":width,"stroke-linecap":"round","stroke-linejoin":"round"}));
}
function graphChart(chart){
 set("chart-title",chart.title);set("chart-description",chart.subtitle);
 const data=chart.series,W=860,H=305,node=elementSvg("main-chart",W,H);
 const all=data.map(x=>x.a),hasSecondary=chart.kind==="line"&&data.some(x=>Number(x.b)!==0),series=hasSecondary?data.flatMap(x=>[x.a,x.b]):all;
 const minV=Math.min(...series),maxV=Math.max(1,...series);
 if(chart.kind==="line"){
  const low=minV>=0?Math.max(0,Math.min(...series)*.85):minV*1.2,high=maxV*1.12+1;
  const g=grid(node,W,H,{min:low,max:high,ticks:4,left:68,right:17,top:17,bottom:45});
  const x=i=>g.left+i/Math.max(1,data.length-1)*(W-g.left-g.right);
  const coordsA=data.map((v,i)=>[x(i),g.y(v.a)]),coordsB=hasSecondary?data.map((v,i)=>[x(i),g.y(v.b)]):[];
  if(hasSecondary)pointLine(node,coordsB,"#b3a17e",2.5);
  pointLine(node,coordsA,"#307854",3);
  data.forEach((v,i)=>{const pos=coordsA[i];const dot=svg("circle",{cx:pos[0],cy:pos[1],r:3.3,fill:"#377e5a",stroke:"#fff","stroke-width":1});dot.append(svg("title",{},v.label+": "+compact(v.a)));node.append(dot);});
  const every=Math.max(1,Math.ceil(data.length/7));
  data.forEach((v,i)=>{if(i%every===0||i===data.length-1)node.append(svg("text",{x:x(i),y:H-15,"text-anchor":"middle","font-size":10,fill:"#9eafa2"},v.label.length>11?v.label.slice(0,10)+"…":v.label));});
 }else if(chart.kind==="distribution"){
  const g=grid(node,W,H,{min:0,max:maxV*1.12,left:55,right:18,top:20,bottom:48});
  const band=(W-g.left-g.right)/data.length;
  data.forEach((v,i)=>{const x=g.left+i*band+band*.13,y=g.y(Math.max(0,v.a)),bar=svg("rect",{x,y,width:band*.74,height:H-g.bottom-y,fill:i%2===0?"#83b394":"#477f62",rx:2});bar.append(svg("title",{},v.label+": "+number(v.a)+" simulated runs"));node.append(bar);
   if(i%Math.max(1,Math.ceil(data.length/8))===0)node.append(svg("text",{x:x+band*.36,y:H-16,"text-anchor":"middle","font-size":10,fill:"#8da295"},v.label.slice(0,15)));});
 }else{
  const left=158,right=25,top=20,bottom=18,plotWidth=W-left-right,plotH=H-top-bottom;
  const vmin=Math.min(0,...data.map(x=>x.a)),vmax=Math.max(1,...data.map(x=>x.a)),scale=vmax-vmin||1,zeroX=left+(0-vmin)/scale*plotWidth;
  node.append(svg("line",{x1:zeroX,y1:top,x2:zeroX,y2:H-bottom,stroke:"#95aba0","stroke-width":1.5}));
  const rowH=plotH/data.length;
  data.forEach((v,i)=>{const y=top+i*rowH+rowH*.21,h=rowH*.58,valX=left+(v.a-vmin)/scale*plotWidth;
   const rectangle=svg("rect",{x:Math.min(zeroX,valX),y,width:Math.max(1,Math.abs(valX-zeroX)),height:h,fill:v.a>=0?"#3f8764":"#bb8a72",rx:2});
   rectangle.append(svg("title",{},v.label+": "+number(v.a)));node.append(rectangle);
   node.append(svg("text",{x:left-10,y:y+h/2+4,"text-anchor":"end","font-size":11,fill:"#5f7c6d"},v.label.slice(0,23)));
   node.append(svg("text",{x:Math.min(W-26,Math.max(left+20,valX+8)),y:y+h/2+4,"text-anchor":"start","font-size":10,fill:"#2e6c4f"},compact(v.a)));
  });
 }
 const legend=$("legend");legend.replaceChildren();
 const items=[chart.labels[0]||"Calculated values"];if(hasSecondary)items.push(chart.labels[1]||"Comparison");
 items.forEach((value,i)=>{const span=create("span");span.append(create("i","swatch"+(i?" alt":"")),document.createTextNode(value));legend.append(span)});
}
function chartBars(data){
 set("comparison-title",data.title);set("comparison-description",data.subtitle);
 const root=$("comparison-bars");root.replaceChildren();const rows=data.series||[],max=Math.max(1,...rows.map(x=>Math.abs(x.a)));
 rows.forEach(x=>{const item=create("div","mini-row"),label=create("div","mini-label",x.label),track=create("div","mini-track"),fill=create("span","mini-fill"+(x.a<0?" negative":""));
  fill.style.width=Math.max(.5,Math.abs(x.a)/max*100)+"%";track.append(fill);item.append(label,track,create("span","mini-value",compact(x.a)));root.append(item);
 });
 root.append(create("p","mini-note","All comparisons recompute with the active scenario. Chart values are illustrative and share their current unit context with the description."));
}
function tableView(data){
 const table=$("sample-table");table.replaceChildren();const thead=create("thead"),header=create("tr");
 data.columns.forEach(c=>header.append(create("th","",c)));if(isWorkflow)header.append(create("th","","Sample interaction"));
 thead.append(header);table.append(thead);const body=create("tbody");
 data.rows.forEach((values,i)=>{
  const tr=create("tr");values.forEach(value=>tr.append(create("td","",value)));
  if(isWorkflow){const td=create("td"),button=create("button","sample-review"+(reviewed.has(i)?" done":""),reviewed.has(i)?"Reviewed ✓":"Mark reviewed");
   button.type="button";button.addEventListener("click",()=>{if(reviewed.has(i))reviewed.delete(i);else reviewed.add(i);tableView(data);});
   td.append(button);tr.append(td);
  }
  body.append(tr);
 });
 table.append(body);set("sample-count","Showing "+data.rows.length+" sample records"+(isWorkflow?" · "+reviewed.size+" locally marked reviewed":""));
 set("audit-banner",isWorkflow?reviewed.size+" sample rows reviewed in this browser only. No messages, financial approvals, deals or production records have been changed.":"This is a read-only sample register. The analysis does not access company databases or modify real records.");
}
function decisionView(out){
 set("impact-value",out.impact.value);set("impact-name",out.impact.label);set("impact-formula",out.impact.formula);set("impact-note",out.impact.note);
 set("decision-title",out.decision.title);set("decision-summary",out.decision.summary);
 const list=$("decision-list");list.replaceChildren();out.decision.actions.forEach(x=>list.append(create("li","",x)));
}
function reportView(out){
 set("report-id",module.label.toUpperCase()+" / "+out.case.category);
 set("report-title",out.case.label+" — executive decision brief");
 set("report-description",out.scope);
 metricCards(out.metrics,"report-metrics");set("report-insight",out.decision.title);set("report-summary",out.decision.summary);
 const list=$("report-actions-list");list.replaceChildren();out.decision.actions.forEach(x=>list.append(create("li","",x)));
 const q=$("report-quality");q.replaceChildren();out.quality.forEach(([k,v])=>{const row=create("div","quality-row");row.append(create("span","",k),create("b","",v));q.append(row)});
 set("report-methodology",out.methodology);set("report-assumptions",out.assumptions||out.impact.note);
}
function paint(out){
 snapshot=out;metricCards(out.metrics,"metrics");graphChart(out.chart);chartBars(out.comparison);tableView(out.table);decisionView(out);reportView(out);
 set("active-scenario-label","SYNTHETIC DATA / "+out.case.categoryShort);set("example-method",out.methodology);
 experience.refresh();
}
function resetSteps(){
 document.querySelectorAll(".workflow-step").forEach((element,i)=>{element.classList.remove("done","running");element.querySelector("i").textContent=String(i+1).padStart(2,"0")});
 set("workflow-status","Ready to calculate a new scenario.");
}
function delay(n){return new Promise(r=>setTimeout(r,n))}
async function execute(){
 if(busy)return;busy=true;$("calculate").disabled=true;resetSteps();const params={...inputs},c=active;
 try{
  const messages=["Preparing synthetic business records","Checking assumptions and input constraints","Calculating models and operational rules","Summarising implications for decision-makers","Verifying the current reporting output"];
  for(let i=0;i<5;i++){
   const step=document.querySelector('[data-step="'+i+'"]');step.classList.add("running");set("workflow-status",messages[i]);await delay(document.getElementById("sc-fast-mode")?.checked?110:1900);
   if(i===2){const computed=run(module.id,c,params);if(computed.metrics.length!==4)throw Error("Model did not return a complete result");snapshot=computed;}
   if(i===3)paint(snapshot);
   step.classList.remove("running");
   const warn=i===3&&experience.getDecision()?.level==="review";
   step.classList.add(warn?"warning":"done");step.querySelector("i").textContent=warn?"!":"✓";
  }
  set("workflow-status","✓ Calculation complete · report and sample register refreshed");set("input-status","Scenario updated successfully.");$("input-status").classList.remove("dirty");
 }catch(error){set("workflow-status","Unable to calculate: "+error.message);set("input-status","Check your inputs: "+error.message);$("input-status").classList.add("dirty")}
 finally{busy=false;$("calculate").disabled=false}
}
function csvCell(x){return '"'+String(x??"").replaceAll('"','""')+'"'}
function download(filename,body,type){
 const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=create("a");
 a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
$("download-csv").addEventListener("click",()=>{
 if(!snapshot)return;const rows=[["SC-Analytics / Synthetic operating example"],["Module",module.label],["Use case",snapshot.case.label],[],["Metric","Value","Meaning"],...snapshot.metrics.map(m=>[m.label,m.value,m.hint]),[],[...snapshot.table.columns,...(isWorkflow?["Locally reviewed"] :[])],...snapshot.table.rows.map((row,i)=>[...row,...(isWorkflow?[reviewed.has(i)?"yes":"no"]:[])])];
 download("SC-Analytics-"+active+"-sample.csv",rows.map(r=>r.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8");
});
$("reset").addEventListener("click",()=>{inputs=getInitial(active);reviewed=new Set();paintControls();execute()});
$("calculate").addEventListener("click",()=>{reviewed=new Set();execute()});
$("print").addEventListener("click",()=>{if(snapshot)window.print()});
$("download-report").addEventListener("click",()=>{
 if(!snapshot)return;
 const sheet=$("report-sheet").outerHTML;
 const css="body{font:13px/1.7 Arial,Helvetica,sans-serif;color:#1d4835;max-width:900px;margin:32px auto;padding:0 22px}.report-sheet{background:white}.report-top,.report-footer{display:flex;justify-content:space-between;gap:20px;border-bottom:2px solid #275d42;padding:0 0 16px}.report-top b{font-size:18px}.report-top span,.report-id,.eyebrow{font-size:10px;letter-spacing:.1em;font-weight:800;color:#508368}.report-title{padding:20px 0}.report-title h3{font:normal 32px Georgia,serif;margin:9px 0}.report-title p{font-size:12px;color:#839688}.report-metrics{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #dce6df}.report-metric{padding:13px;border-right:1px solid #dce6df}.report-metric span{display:block;font-size:10px;color:#72907e}.report-metric strong{display:block;font-size:19px;margin:9px 0;overflow-wrap:anywhere}.report-metric small{font-size:9px;color:#94a597}.report-columns,.report-method{display:grid;grid-template-columns:1fr 1fr;gap:34px;padding:24px 0}.report-columns p,.report-columns li,.report-method p{font-size:12px;line-height:1.7}.report-columns h4{font-size:17px}.report-method{border-top:1px solid #dce6dc}.quality-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid #eef3ed;font-size:10px}.report-footer{border-top:1px solid #dce6dc;border-bottom:0;padding-top:12px;font-size:9px;color:#8b9d8d}@media print{@page{size:A4;margin:15mm}body{padding:0;margin:0}.report-columns,.report-method,.report-metrics{break-inside:avoid}}";
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>'+escape(module.label)+" — "+escape(snapshot.case.label)+'</title><style>'+css+'</style></head><body>'+sheet+'<p style="font-size:10px;color:#6a8e73">Independent illustrative example. No customer data or guaranteed commercial impact.</p></body></html>';
 download("SC-Analytics-"+active+"-Executive-Brief.html",html,"text/html;charset=utf-8");
});
paintCases();choose(active,false);
