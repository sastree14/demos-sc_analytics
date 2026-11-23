import {cases,byId,initial,controlSpecs,runCase,formatNum,formatCompact,currency} from "./studio-engine.js";
import {installDecisionExperience} from "../shared/experience.js";

const $=id=>document.getElementById(id);
const fmt=n=>formatNum(n);
const pct=n=>(n*100).toFixed(1)+"%";
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const ns="http://www.w3.org/2000/svg";
let active="demand",inputs={...initial.demand},result=null,running=false;
let lastExecutedInputs={...inputs};
const experience=installDecisionExperience({
 family:"predictive-models",
 simulate:runCase,
 read:()=>({id:active,label:byId(active).name,question:byId(active).short,result,params:{...lastExecutedInputs},controls:controlDescriptor(byId(active).kind)}),
 apply:async values=>{inputs={...values};controlsForCase();dirty();},
 run:()=>execute()
});
const safe=(value)=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const signed=(x,digits=0)=>(x>0?"+":"")+(digits?Number(x).toFixed(digits):formatNum(x));
const put=(id,value)=>{$(id).textContent=String(value)};
function svg(name,attributes={},text){
 const element=document.createElementNS(ns,name);
 for(const [key,val] of Object.entries(attributes))element.setAttribute(key,String(val));
 if(text!==undefined)element.textContent=String(text);
 return element;
}
function dom(name,classname,content){
 const node=document.createElement(name);if(classname)node.className=classname;
 if(content!==undefined)node.textContent=String(content);return node;
}
function clear(id){$(id).replaceChildren();}
function chartBox(id,width=900,height=320){
 const root=$(id);root.replaceChildren();
 const element=svg("svg",{viewBox:`0 0 ${width} ${height}`,"aria-hidden":"true",preserveAspectRatio:"xMidYMid meet"});
 root.append(element);return element;
}
function axes(root,{w=900,h=320,left=70,right=22,top=22,bottom=45,min=0,max=100,ticks=4,formatter=fmt}={}){
 const usableH=h-top-bottom;
 const yy=v=>top+(max-v)/(max-min||1)*usableH;
 for(let k=0;k<=ticks;k++){
  const value=min+(max-min)*(ticks-k)/ticks,y=yy(value);
  root.append(svg("line",{x1:left,y1:y,x2:w-right,y2:y,stroke:"#e7ede8","stroke-width":1}));
  root.append(svg("text",{x:left-12,y:y+4,"text-anchor":"end","font-size":11,fill:"#92a398"},formatter(value)));
 }
 return {yy,xx:index=>left+index/(1||1),left,right,top,bottom,usableH};
}
function line(root,coords,color="#205343",width=2.8,dash){
 const attrs={points:coords.map(point=>point.map(n=>Number(n).toFixed(2)).join(",")).join(" "),fill:"none",stroke:color,"stroke-width":width,"stroke-linejoin":"round","stroke-linecap":"round"};
 if(dash)attrs["stroke-dasharray"]=dash;
 root.append(svg("polyline",attrs));
}
function addDot(root,x,y,color="#418c69",radius=3.7,title=""){
 const circle=svg("circle",{cx:x,cy:y,r:radius,fill:color,stroke:"#fff","stroke-width":1.6});
 if(title)circle.append(svg("title",{},title));root.append(circle);
}
function legend(items){
 const root=$("main-chart-legend");root.replaceChildren();
 for(const item of items){
  const span=dom("span");const itemSymbol=dom("i",item[1]);span.append(itemSymbol,document.createTextNode(item[0]));root.append(span);
 }
}
function setMainHead(title,sub,kicker="ANALYTICAL VIEW",foot="Calculated with fictional observations"){
 put("main-chart-title",title);put("main-chart-subtitle",sub);put("main-chart-kicker",kicker);put("main-chart-footnote",foot);
}
function forecastMain(r){
 setMainHead(r.case.id==="revenue"?"Revenue outlook and planning range":r.case.id==="workforce"?"Future workload and capacity":"Demand forecast and uncertainty range",
  "Historical observations, scenario-adjusted forecast and an indicative uncertainty band.",
  "FORWARD FORECAST","Bands use held-out error magnitudes; they are not calibrated confidence intervals.");
 legend([["Observed history","legend-line"],["Scenario outlook","legend-line future"],["Unadjusted method","legend-line dashed"],["Indicative range","legend-band"]]);
 const root=chartBox("main-chart"),W=900,H=320,left=66,right=20,top=22,bottom=41;
 const observed=r.chart.history,projection=r.chart.future;
 const all=[...observed.map(d=>d.value),...projection.flatMap(d=>[d.low,d.high])];
 const low=Math.floor(Math.min(...all)*.84),high=Math.ceil(Math.max(...all)*1.13);
 const {yy}=axes(root,{w:W,h:H,left,right,top,bottom,min:low,max:high,formatter:v=>r.case.id==="revenue"?"€"+fmt(v)+"k":fmt(v)});
 const length=observed.length+projection.length,x=i=>left+i/(length-1)*(W-left-right);
 const boundary=(x(observed.length-1)+x(observed.length))/2;
 root.append(svg("rect",{x:boundary,y:top,width:W-right-boundary,height:H-top-bottom,fill:"#f4faf5"}));
 root.append(svg("line",{x1:boundary,y1:top,x2:boundary,y2:H-bottom,stroke:"#a6c9b4","stroke-dasharray":"5 6"}));
 const highs=projection.map((p,i)=>[x(observed.length+i),yy(p.high)]);
 const lows=projection.map((p,i)=>[x(observed.length+i),yy(p.low)]).reverse();
 root.append(svg("polygon",{points:[...highs,...lows].map(p=>p.join(",")).join(" "),fill:"#d5e9db",opacity:.8}));
 line(root,observed.map((d,i)=>[x(i),yy(d.value)]),"#243d48",2.8);
 line(root,[[x(observed.length-1),yy(observed.at(-1).value)],...projection.map((d,i)=>[x(observed.length+i),yy(d.reference)])],"#a2b5aa",1.9,"5 6");
 line(root,[[x(observed.length-1),yy(observed.at(-1).value)],...projection.map((d,i)=>[x(observed.length+i),yy(d.value)])],"#387f5c",3.5);
 projection.forEach((p,i)=>addDot(root,x(observed.length+i),yy(p.value),"#39875e",4.2,`${p.label}: ${fmt(p.value)} ${r.case.unit} (${fmt(p.low)}–${fmt(p.high)})`));
 const allLabels=[...observed,...projection];
 [...new Set([0,3,6,9,12,15,observed.length-1,allLabels.length-1])].forEach(i=>{
  const p=allLabels[i];if(p)root.append(svg("text",{x:x(i),y:H-12,"font-size":11,"text-anchor":"middle",fill:"#92a39a"},p.label));
 });
 root.append(svg("text",{x:boundary+10,y:top+11,"font-size":10,fill:"#4e9670","font-weight":"700"},"PROJECTED"));
}
function forecastValidation(r){
 put("second-chart-title","Actual vs predicted: unseen months");
 put("second-chart-description","The model is tested against six months excluded from training.");
 const root=chartBox("second-chart",480,210),pts=r.back,all=pts.flatMap(p=>[p.actual,p.predicted]);
 const lo=Math.min(...all)*.89,hi=Math.max(...all)*1.11;
 const {yy}=axes(root,{w:480,h:210,left:50,right:16,top:14,bottom:36,min:lo,max:hi,ticks:3,formatter:fmt});
 const x=i=>50+i/(pts.length-1)*(480-66);
 line(root,pts.map((p,i)=>[x(i),yy(p.actual)]),"#1f4650",2.6);
 line(root,pts.map((p,i)=>[x(i),yy(p.predicted)]),"#47966b",2.6,"4 3");
 pts.forEach((p,i)=>{root.append(svg("text",{x:x(i),y:195,"font-size":10,"text-anchor":"middle",fill:"#97a69e"},p.label));addDot(root,x(i),yy(p.actual),"#234550",3.6,p.label+" observed: "+fmt(p.actual));});
}
function scenarioBars(r,variant="forecast"){
 const root=$("third-chart");root.replaceChildren();
 const vals=r.third.values;
 const max=Math.max(...vals.map(v=>v.value),1);
 const wrapper=dom("div","bar-chart-small");
 for(const [i,row] of vals.entries()){
  const item=dom("div","bar-mini-row"+(i===1?" selected":""));const label=dom("span","",row.name);
  const track=dom("div","track"),fill=dom("i","fill");
  fill.style.width=Math.max(1,row.value/max*100)+"%";track.append(fill);
  const value=dom("b","",variant==="forecast"?formatCompact(row.value):variant==="regression"?currency(row.value):formatNum(row.value));
  item.append(label,track,value);wrapper.append(item);
 }
 root.append(wrapper);
 const p=dom("p","driver-footnote",variant==="anomaly"?"Number of automatic alerts at each sensitivity setting. Higher sensitivity usually increases review effort.":variant==="regression"?"Estimated operational cost as the selected volume changes by ±20%.":"The same model evaluated under different planning scenarios.");root.append(p);
}
function renderDrivers(r){
 const root=$("drivers-chart");root.replaceChildren();
 const entries=r.drivers||[];
 const max=Math.max(1,...entries.map(x=>Math.abs(x.value)));
 const wrapper=dom("div","driver-list");
 for(const x of entries){
  const row=dom("div","driver-row"),label=dom("span","driver-label",x.label),track=dom("div","driver-track");
  const fill=dom("i","driver-fill"+(x.value<0?" negative":""));fill.style.width=Math.max(.5,Math.abs(x.value)/max*100)+"%";track.append(fill);
  const value=dom("b","driver-value"+(x.value<0?" negative":""),r.kind==="forecast"?(x.value>0?"+":"")+fmt(x.value):r.kind==="regression"?(x.value>0?"+":"")+currency(x.value):r.kind==="classification"?signed(x.value,2):fmt(x.value));
  row.append(label,track,value);wrapper.append(row);
 }
 root.append(wrapper);
 const text={
  forecast:"Components of the last forecast point: recent actual level, method-driven movement, and the selected business scenario.",
  classification:"Signed contributions to the fitted logistic score for this single profile. They are not causal drivers.",
  regression:"Contributions from fitted coefficients for the current job, excluding the model intercept. These are associations, not causal effects.",
  anomaly:"Counts from the synthetic detection test, including known inserted events and alerts that did not match them."
 };
 root.append(dom("p","driver-footnote",text[r.kind]));
 put("drivers-title",r.kind==="anomaly"?"Signals and detection quality":r.kind==="classification"?"What influences this risk score?":r.kind==="regression"?"What shapes the cost estimate?":"How the outlook is constructed");
 put("drivers-caption",r.kind==="anomaly"?"Known artificial events versus detected alerts.":r.kind==="classification"?"Model contributions under the current sample inputs.":r.kind==="regression"?"Estimated cost contribution by input feature.":"Understand the components behind the projected result.");
}
function probabilityChart(r){
 setMainHead("Risk scores across the validation sample","Distribution of predicted probabilities, with the selected case and review threshold.","CLASSIFICATION / RISK SCORES","Predictions computed from 130 held-out synthetic records; no actual customer scores.");
 legend([["All scored cases","legend-line"],["Known events","legend-line red"],["This case","legend-line future"],["Review threshold","legend-line dashed"]]);
 const root=chartBox("main-chart"),W=900,H=320,left=60,right=20,top=23,bottom=42;
 const all=r.histogram,max=Math.max(...all.map(x=>x.value),1),bw=(W-left-right)/all.length;
 const {yy}=axes(root,{w:W,h:H,left,right,top,bottom,min:0,max:max*1.13,formatter:v=>fmt(v)});
 all.forEach((p,i)=>{
  const x=left+i*bw+8,y=yy(p.value),h=H-bottom-y;
  root.append(svg("rect",{x,y,width:bw-16,height:h,fill:"#b8d4c5",rx:2}));
  const eventY=yy(p.events),eventH=H-bottom-eventY;
  root.append(svg("rect",{x:x+bw*.2,y:eventY,width:(bw-16)-bw*.4,height:eventH,fill:"#bc816a",rx:1}));
  root.append(svg("text",{x:left+(i+.5)*bw,y:H-14,"font-size":10,"text-anchor":"middle",fill:"#8fa29a"},i*10+"%"));
 });
 const thresholdX=left+r.threshold*(W-left-right),caseX=left+r.probability*(W-left-right);
 root.append(svg("line",{x1:thresholdX,y1:top,x2:thresholdX,y2:H-bottom,stroke:"#a6b5aa","stroke-width":2,"stroke-dasharray":"6 5"}));
 root.append(svg("line",{x1:caseX,y1:top,x2:caseX,y2:H-bottom,stroke:"#307757","stroke-width":2}));
 root.append(svg("text",{x:Math.min(W-95,Math.max(left,caseX+8)),y:top+13,"font-size":11,fill:"#2a754f","font-weight":"700"},"CASE "+pct(r.probability)));
}
function confusionChart(r){
 put("second-chart-title","What the review queue catches");
 put("second-chart-description","Validation outcomes at the selected risk threshold.");
 const root=$("second-chart");root.replaceChildren();
 const cells=[["Correct alerts",r.cm.tp,false],["False alerts",r.cm.fp,true],["Missed events",r.cm.fn,true],["Correct non-alerts",r.cm.tn,false]];
 const grid=dom("div","small-confusion");
 cells.forEach(([name,value,bad])=>{const cell=dom("div","conf-cell"+(bad?" bad":""));cell.append(dom("strong","",value),dom("small","",name));grid.append(cell)});
 root.append(grid,dom("p","conf-note","130 held-out examples. The threshold changes the number of false alarms and missed events; no model is perfectly accurate."));
}
function tradeoffChart(r){
 put("third-chart-title","Detection versus review effort");put("third-chart-description","Change the alert threshold to choose your operating trade-off.");
 const root=chartBox("third-chart",480,210),points=r.tradeoff,{yy}=axes(root,{w:480,h:210,left:48,right:16,top:15,bottom:37,min:0,max:100,ticks:4,formatter:v=>fmt(v)+"%"});
 const x=i=>48+i/(points.length-1)*(480-64);
 line(root,points.map((p,i)=>[x(i),yy(p.detected)]),"#2d7954",2.8);
 line(root,points.map((p,i)=>[x(i),yy(p.reviewed)]),"#bb8267",2.8,"6 4");
 points.forEach((p,i)=>{if(i%2===0)root.append(svg("text",{x:x(i),y:194,"text-anchor":"middle","font-size":10,fill:"#8fa498"},p.label))});
 root.append(svg("text",{x:48,y:12,"font-size":10,fill:"#357a58"},"Events detected"));
 root.append(svg("text",{x:300,y:12,"font-size":10,fill:"#bd8369"},"Cases reviewed"));
}
function regressionChart(r){
 setMainHead("Observed costs versus fitted estimates","Synthetic job examples, fitted predictions and the profile selected for assessment.","NUMERIC ESTIMATION / REGRESSION","Indicative ranges use held-out residual error; they are not calibrated predictive guarantees.");
 legend([["Historical synthetic jobs","legend-line"],["Model expectation","legend-line future"],["Selected job","legend-line red"]]);
 const points=r.chart.points,sel=r.chart.marker,W=900,H=320,left=72,right=24,top=22,bottom=42;
 const root=chartBox("main-chart");
 const vals=[...points.map(p=>p.actual),...points.map(p=>p.predicted),r.low,r.high];
 const lo=Math.max(0,Math.min(...vals)*.85),hi=Math.max(...vals)*1.12;
 const {yy}=axes(root,{w:W,h:H,left,right,top,bottom,min:lo,max:hi,formatter:currency});
 const x=v=>left+(v-35)/(680-35)*(W-left-right);
 points.forEach(p=>addDot(root,x(p.x),yy(p.actual),"#9bbeb0",3.4,"Order: "+fmt(p.x)+" units · cost "+currency(p.actual)));
 const sorted=[...points].sort((a,b)=>a.x-b.x);
 line(root,sorted.map(p=>[x(p.x),yy(p.predicted)]),"#387f5a",2.9);
 root.append(svg("line",{x1:x(sel.x),y1:yy(r.low),x2:x(sel.x),y2:yy(r.high),stroke:"#aa6f56","stroke-width":4,opacity:.5}));
 addDot(root,x(sel.x),yy(sel.y),"#b87459",6.5,"Current estimate: "+currency(sel.y));
 [50,150,250,350,450,550,650].forEach(v=>root.append(svg("text",{x:x(v),y:H-12,"text-anchor":"middle","font-size":11,fill:"#8b9f96"},fmt(v))));
 root.append(svg("text",{x:W/2,y:H-1,"text-anchor":"middle","font-size":10,fill:"#84968c"},"JOB VOLUME (UNITS)"));
}
function secondaryDrivers(r){
 put("second-chart-title","Cost contributions");put("second-chart-description","How the fitted input coefficients affect the estimate.");
 const root=$("second-chart");root.replaceChildren();
 const max=Math.max(1,...r.drivers.map(x=>Math.abs(x.value)));
 const block=dom("div","bar-chart-small");
 r.drivers.forEach(d=>{const row=dom("div","bar-mini-row"),label=dom("span","",d.label),track=dom("div","track"),fill=dom("i","fill");
  fill.style.width=Math.max(1,Math.abs(d.value)/max*100)+"%";if(d.value<0)fill.style.background="#ba8a74";track.append(fill);
  row.append(label,track,dom("b","",(d.value<0?"−":"+")+currency(Math.abs(d.value))));block.append(row)});
 root.append(block,dom("p","driver-footnote","Model intercept and coefficients are estimated on synthetic examples; associations are not causal."));
}
function anomalyChart(r){
 setMainHead("Production signal monitoring","Hourly operating readings, rolling baseline and alerts for unusual movements.","EARLY WARNING / ANOMALY DETECTION","Flags use preceding-window robust deviations. Not every alert is a confirmed fault.");
 legend([["Operating signal","legend-line"],["Detected anomaly","legend-line red"],["Later-period load shift","legend-band"]]);
 const root=chartBox("main-chart"),W=900,H=320,left=62,right=18,top=25,bottom=45;
 const vals=r.series.map(x=>x.value),lo=Math.min(...vals)-4,hi=Math.max(...vals)+4;
 const {yy}=axes(root,{w:W,h:H,left,right,top,bottom,min:lo,max:hi,formatter:v=>Number(v).toFixed(0)});
 const x=i=>left+i/(r.series.length-1)*(W-left-right);
 const xShift=x(72);
 root.append(svg("rect",{x:xShift,y:top,width:W-right-xShift,height:H-top-bottom,fill:"#edf6ef"}));
 line(root,r.series.map((d,i)=>[x(i),yy(d.value)]),"#1b4e54",2.3);
 r.series.forEach((d,i)=>{if(d.flagged)addDot(root,x(i),yy(d.value),"#bd6855",5,d.label+": "+d.value.toFixed(1)+" · anomaly signal")});
 for(let i=0;i<96;i+=12)root.append(svg("text",{x:x(i),y:H-15,"text-anchor":"middle","font-size":10,fill:"#8d9e96"},i+"h"));
 root.append(svg("text",{x:xShift+8,y:top+13,"font-size":10,fill:"#4d9673"},"LOAD CHANGE"));
}
function anomalyQuality(r){
 put("second-chart-title","Known signals versus alerts");put("second-chart-description","How detection behaved on inserted synthetic anomalies.");
 const root=$("second-chart");root.replaceChildren();
 const max=Math.max(1,...r.drivers.map(d=>d.value));
 const block=dom("div","bar-chart-small");
 r.drivers.forEach(d=>{const row=dom("div","bar-mini-row"),label=dom("span","",d.label),track=dom("div","track"),fill=dom("i","fill");
  fill.style.width=Math.max(1,d.value/max*100)+"%";track.append(fill);row.append(label,track,dom("b","",fmt(d.value)));block.append(row)});
 root.append(block);
}
function renderMetrics(r){
 const root=$("kpi-grid");root.replaceChildren();
 for(const metric of r.metrics){const card=dom("article","kpi"),title=dom("span","label",metric.label),value=dom("strong","",metric.value),hint=dom("small","",metric.hint);card.append(title,value,hint);root.append(card)}
}
function renderCase(r){
 result=r;
 lastExecutedInputs={...r.params};
 renderMetrics(r);
 if(r.kind==="forecast"){
  forecastMain(r);forecastValidation(r);put("third-chart-title","Different futures, one plan");put("third-chart-description","A conservative, current and accelerated demand outlook.");scenarioBars(r,"forecast");
 }else if(r.kind==="classification"){probabilityChart(r);confusionChart(r);tradeoffChart(r);}
 else if(r.kind==="regression"){regressionChart(r);secondaryDrivers(r);put("third-chart-title","Sensitivity to job size");put("third-chart-description","Compare scope variations before quoting.");scenarioBars(r,"regression");}
 else{anomalyChart(r);anomalyQuality(r);put("third-chart-title","What if we adjust sensitivity?");put("third-chart-description","How many alerts require investigation?");scenarioBars(r,"anomaly");}
 renderDrivers(r);
 put("impact-value",r.impact.value);put("impact-label",r.impact.label);put("impact-subtitle",r.impact.subtitle);put("impact-disclaimer",r.impact.note);
 put("decision-headline",r.decision.headline);put("decision-summary",r.decision.summary);
 const actions=$("decision-actions");actions.replaceChildren();
 r.decision.actions.forEach((a,i)=>{const row=dom("div","action-item");row.append(dom("span","action-icon",i+1),dom("span","",a));actions.append(row)});
 renderReport(r);
 experience.refresh();
}
function renderReport(r){
 const idx=String(cases.findIndex(x=>x.id===r.case.id)+1).padStart(2,"0");
 put("report-category",r.case.tag.toUpperCase()+" / EXAMPLE "+idx);
 put("report-title",r.case.name+" — executive brief");
 put("report-subtitle",r.case.sector+" · Scenario-led analysis · Sample data");
 const root=$("report-metrics");root.replaceChildren();
 for(const metric of r.metrics){const card=dom("div","report-metric");card.append(dom("span","",metric.label),dom("strong","",metric.value),dom("small","",metric.hint));root.append(card)}
 put("report-decision-title",r.decision.headline);put("report-decision-copy",r.decision.summary);
 const actions=$("report-actions");actions.replaceChildren();
 r.decision.actions.forEach(a=>actions.append(dom("li","",a)));
 const quality=$("report-quality");quality.replaceChildren();
 r.quality.forEach(q=>{const row=dom("div");row.append(dom("span","",q.name),dom("b","",q.value));quality.append(row)});
 put("report-method",r.methodology+" Business impact: "+r.impact.note);
}
function controlDescriptor(kind){return controlSpecs[(kind==="classification"||kind==="regression")?active:kind]||controlSpecs.forecast;}
function displayControl(value,spec){
 if(spec.key==="sensitivity")return Number(value).toFixed(1)+"σ";
 if(spec.key==="unitCost"||spec.key==="cost")return "€"+fmt(Number(value));
 if(spec.key==="budget")return currency(Number(value));
 const n=Number(value);const sign=spec.key==="outlook"&&n>0?"+":"";
 return sign+fmt(n)+(spec.unit||"");
}
function controlsForCase(){
 const root=$("control-list");root.replaceChildren();
 const descriptors=controlDescriptor(byId(active).kind);
 for(const c of descriptors){
  const section=dom("div","control-entry"),head=dom("div","control-label");
  const label=dom("label","",c.label),display=dom("output","",c.kind==="slider"?displayControl(inputs[c.key],c):"");
  const help=dom("button","sc-input-help","?");help.type="button";help.title="Explain this input";help.setAttribute("aria-label","Explain "+c.label);help.addEventListener("click",()=>experience.askQuestion("Explain "+c.label));
  if(c.kind==="slider"){
   const id="control-"+c.key;label.htmlFor=id;head.append(label,help,display);section.append(head);
   const slider=dom("input");slider.type="range";slider.id=id;slider.min=c.min;slider.max=c.max;slider.step=c.step||1;slider.value=inputs[c.key];
   slider.addEventListener("input",()=>{inputs[c.key]=Number(slider.value);display.textContent=displayControl(inputs[c.key],c);dirty()});
   section.append(slider);
   const end=dom("div","range-ends");end.append(dom("span","",displayControl(c.min,c)),dom("span","",displayControl(c.max,c)));section.append(end);
   if(c.hint)section.append(dom("p","control-hint",c.hint));
  }else{
   section.append(head);head.append(label,help);const box=dom("div","control-choices");
   c.choices.forEach(([v,labelText])=>{
    const b=dom("button",Number(inputs[c.key])===Number(v)?"selected":"",labelText);b.type="button";b.setAttribute("aria-pressed",String(Number(inputs[c.key])===Number(v)));
    b.addEventListener("click",()=>{
     inputs[c.key]=Number(v);box.querySelectorAll("button").forEach(q=>{const selected=q===b;q.classList.toggle("selected",selected);q.setAttribute("aria-pressed",String(selected))});dirty();
    });box.append(b);
   });section.append(box);
  }
  root.append(section);
 }
}
function dirty(){put("update-status","Assumptions changed · run the analysis to update the results.");$("update-status").classList.add("dirty");}
function resetWorkflow(){
 document.querySelectorAll(".workflow-step").forEach((step,i)=>{step.classList.remove("running","done","warning");step.querySelector(".workflow-icon").textContent=String(i+1).padStart(2,"0");});
 put("workflow-status","● Example analysis ready");
}
function selectCase(id){
 if(running)return;
 active=byId(id).id;
 inputs={...initial[active]};controlsForCase();
 document.querySelectorAll("[data-case]").forEach(button=>{const selected=button.dataset.case===active;button.classList.toggle("active",selected);button.setAttribute("aria-pressed",String(selected))});
 const c=byId(id),index=String(cases.findIndex(x=>x.id===active)+1).padStart(2,"0");
 put("current-index",index);put("current-sector",c.sector+" / "+c.tag.toUpperCase());put("current-title",c.name);put("current-description",c.short);
 try{renderCase(runCase(active,inputs));put("update-status","Example calculated · adjust assumptions and rerun.");$("update-status").classList.remove("dirty");}
 catch(error){put("update-status","Unable to load this example: "+error.message);}
 resetWorkflow();
}
function renderCards(){
 const root=$("case-grid");root.replaceChildren();
 for(const [i,c] of cases.entries()){
  const card=dom("button","case-card"+(active===c.id?" active":""));card.type="button";card.dataset.case=c.id;
  card.setAttribute("aria-pressed",String(active===c.id));
  card.append(dom("span","case-no","0"+(i+1)+" / "+c.sector),dom("span","case-tag",c.tag),dom("strong","",c.name),dom("small","",c.short));
  const foot=dom("span","case-foot");foot.append(dom("span","",c.kind==="forecast"?"TIME SERIES":c.kind==="classification"?"RISK SCORING":c.kind==="regression"?"NUMERIC OUTPUT":"EARLY WARNING"),dom("span","","↗"));
  card.append(foot);card.addEventListener("click",()=>selectCase(c.id));root.append(card);
 }
}
async function execute(){
 if(running)return;running=true;const button=$("run-analysis");button.disabled=true;
 resetWorkflow();put("workflow-status","● Checking example inputs");
 try{
  const chosen=active,parameters={...inputs};let computed;
  for(let i=0;i<5;i++){
   const step=document.querySelector('.workflow-step[data-step="'+i+'"]');step.classList.add("running");
   put("workflow-status",["● Preparing illustrative records","● Checking structure and valid ranges","● Computing model outputs","● Constructing decision view","● Reconciling metrics and report"][i]);
   await delay(document.getElementById("sc-fast-mode")?.checked?100:1900);
   if(i===2){computed=runCase(chosen,parameters);if(!computed?.metrics?.length)throw Error("No model output");}
   if(i===3)renderCase(computed);
   step.classList.remove("running");
   const warn=i===3&&experience.getDecision()?.level==="review";
   step.classList.add(warn?"warning":"done");step.querySelector(".workflow-icon").textContent=warn?"!":"✓";
  }
  put("workflow-status","✓ Example analysis complete · results calculated locally");
  put("update-status","Updated · model metrics and executive report are current.");$("update-status").classList.remove("dirty");
 }catch(error){put("workflow-status","! Review example inputs");put("update-status","Unable to complete analysis: "+error.message);$("update-status").classList.add("dirty");}
 finally{button.disabled=false;running=false;if(JSON.stringify(inputs)!==JSON.stringify(lastExecutedInputs))dirty();}
}
$("run-analysis").addEventListener("click",execute);
$("reset-analysis").addEventListener("click",()=>{if(running)return;inputs={...initial[active]};controlsForCase();execute();});
function csvCell(x){return '"'+String(x??"").replaceAll('"','""')+'"'}
function download(name,text,mime){
 const url=URL.createObjectURL(new Blob([text],{type:mime})),a=dom("a");
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("download-data").addEventListener("click",()=>{
 if(!result)return;
 const r=result,rows=[["SC-Analytics Decision Studio","Synthetic data","Scenario: "+r.case.name]];
 if(r.kind==="forecast"){
  rows.push(["Period","Actual","Scenario forecast","Model reference","Indicative lower","Indicative upper"]);
  r.history.forEach(row=>rows.push([row.label,row.value,"","","",""]));
  r.future.forEach(row=>rows.push([row.label,"",row.value,row.reference,row.low,row.high]));
 }else if(r.kind==="classification"){
  rows.push(["Validation record","Actual event","Predicted probability","Predicted flag","Threshold"]);
  r.rows.forEach((row,i)=>rows.push([i+1,row.y,row.prob,row.prob>=r.threshold?1:0,r.threshold]));
 }else if(r.kind==="regression"){
  rows.push(["Job volume","Observed cost EUR","Predicted cost EUR"]);
  r.chart.points.forEach(row=>rows.push([row.x,row.actual,row.predicted]));
 }else{
  rows.push(["Observation","Sensor reading","Known injected event","Detector flag","Robust score"]);
  r.series.forEach(row=>rows.push([row.label,row.value,row.realAnomaly?1:0,row.flagged?1:0,row.score]));
 }
 rows.push(["DISCLAIMER","Fictional data and analytical examples only"]);
 download("sc-analytics-"+r.case.id+"-example.csv",rows.map(row=>row.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8");
});
const print=()=>{if(result)window.print()};
$("print-report").addEventListener("click",print);
$("print-report-top").addEventListener("click",()=>{document.querySelector("#executive-report").scrollIntoView({behavior:"smooth"});});
$("download-report").addEventListener("click",()=>{
 if(!result)return;
 const body=$("report-sheet").outerHTML;
 const styling=`body{background:#fff;color:#18382e;font:14px/1.6 Arial,sans-serif;max-width:860px;margin:34px auto;padding:0 20px}.report-letterhead,.report-heading,.report-signoff{display:flex;justify-content:space-between;gap:20px;align-items:start;border-bottom:1px solid #cbd9cf;padding-bottom:15px;margin-bottom:24px}.report-logo{font-size:18px;font-weight:800;letter-spacing:.08em}.report-logo small{display:block;font-size:9px;color:#668575}.report-heading h3{font:normal 30px Georgia,serif;margin:8px 0}.report-overline,.report-serial{color:#418464;font:700 10px Arial;letter-spacing:.09em}.report-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:22px 0}.report-metric{border:1px solid #dce7db;padding:14px}.report-metric span{display:block;font:700 10px Arial;color:#69857b}.report-metric strong{display:block;font-size:21px;margin:9px 0;overflow-wrap:anywhere}.report-metric small{font-size:10px;color:#8ea295}.report-columns,.report-bottom{display:grid;grid-template-columns:1fr 1fr;gap:27px;margin:25px 0}.report-columns h4{font-size:17px}.report-columns p,.report-columns li,.report-bottom p{font-size:12px}.report-bottom{padding-top:16px;border-top:1px solid #dce7dc}.report-quality>div{display:flex;justify-content:space-between;border-bottom:1px solid #edf1eb;padding:6px 0;gap:10px;font-size:11px}.report-signoff{font-size:9px;border-top:1px solid #cddacd;border-bottom:0;padding-top:15px;color:#718c7b}.report-serial{text-align:right}@media print{@page{size:A4;margin:14mm}body{margin:0;padding:0}.report-columns,.report-bottom,.report-metrics{break-inside:avoid}}`;
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>'+safe(result.case.name)+' — SC-Analytics Executive Brief</title><style>'+styling+'</style></head><body>'+body+'<p style="color:#7d9689;font-size:10px">Generated from synthetic, locally calculated demonstration data. Not a real client report.</p></body></html>';
 download("SC-Analytics-Executive-Report-"+result.case.id+".html",html,"text/html;charset=utf-8");
});
renderCards();selectCase("demand");
