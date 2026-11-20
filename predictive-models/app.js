import {segments,models,monthText,runForecast,runRisk,clamp} from "./model.js";

const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat("en-GB", {maximumFractionDigits:0});
const fixed = (x,n=1) => Number(x).toFixed(n);
const signed = (value,digits=0) => (value>0?"+":"") + (digits?fixed(value,digits):number.format(Math.round(value)));
const pct = x => fixed(x*100,1)+"%";
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
let currentView="forecast",horizon=3,lastForecast,lastRisk,running=false;
const forecastValues = () => ({
  segment:$("segment").value, horizon, method:$("forecast-model").value,
  growth:Number($("growth").value), volatility:Number($("volatility").value)
});
const riskValues = () => ({
  backlog:Number($("backlog").value),distance:Number($("distance").value),
  reliability:Number($("reliability").value),priority:$("priority").checked
});
function updateFieldReadouts(){
  $("growth-display").textContent=signed(Number($("growth").value))+"%";
  $("volatility-display").textContent="+"+$("volatility").value+"%";
  $("backlog-display").textContent=$("backlog").value;
  $("distance-display").textContent=number.format(Number($("distance").value))+" km";
  $("reliability-display").textContent=$("reliability").value+"%";
}
function setView(view){
  if(!["forecast","risk","method"].includes(view))view="forecast";
  currentView=view;
  document.querySelectorAll("[data-panel]").forEach(el=>el.hidden=el.dataset.panel!==view);
  document.querySelectorAll("[data-view]").forEach(el=>{
    const selected=el.dataset.view===view;
    el.classList.toggle("active",selected);
    if(el.getAttribute("role")==="tab")el.setAttribute("aria-selected",String(selected));
  });
  $("runbook-status").textContent=view==="method"?"Reference notes":"Ready";
  history.replaceState(null,"",location.pathname+location.search+"#"+view);
  if(window.innerWidth<=740)window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",()=>setView(el.dataset.view)));
document.querySelectorAll("#horizon-buttons button").forEach(el=>el.addEventListener("click",()=>{
  horizon=Number(el.dataset.horizon);
  document.querySelectorAll("#horizon-buttons button").forEach(b=>b.classList.toggle("chosen",b===el));
  changed("forecast");
}));
function changed(module){
  updateFieldReadouts();
  const el=$(module+"-note");
  el.textContent="Assumptions changed · run to refresh results.";
  el.classList.add("changed");
}
["segment","forecast-model","growth","volatility"].forEach(id=>$(id).addEventListener("input",()=>changed("forecast")));
["backlog","distance","reliability","priority"].forEach(id=>$(id).addEventListener("input",()=>changed("risk")));
$("toggle-band").addEventListener("change",()=>lastForecast&&drawChart(lastForecast));
$("reset-forecast").addEventListener("click",()=>{
  $("segment").value="distribution";$("forecast-model").value="ensemble";$("growth").value="0";$("volatility").value="0";horizon=3;
  document.querySelectorAll("#horizon-buttons button").forEach(b=>b.classList.toggle("chosen",Number(b.dataset.horizon)===3));
  updateFieldReadouts();changed("forecast");perform("forecast");
});
$("reset-risk").addEventListener("click",()=>{
  $("backlog").value=62;$("distance").value=600;$("reliability").value=88;$("priority").checked=false;
  updateFieldReadouts();changed("risk");perform("risk");
});
$("run-forecast").addEventListener("click",()=>perform("forecast"));
$("run-risk").addEventListener("click",()=>perform("risk"));
$("export-csv").addEventListener("click",()=>{
  if(!lastForecast)return;
  const rows=[["Month","Baseline forecast","Scenario-adjusted forecast","Indicative lower","Indicative upper"],...lastForecast.future.map(r=>[monthText(r.month),r.baseline,r.value,r.low,r.high])];
  const csv=rows.map(row=>row.join(",")).join("\r\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const link=document.createElement("a");link.href=url;link.download="sc-analytics-demand-forecast.csv";document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
});
function setStatus(label,tone="neutral"){
  const status=$("runbook-status");status.textContent=label;status.className="pill "+tone;
}
function markStep(index,state){
  const el=document.querySelector('.step[data-step="'+index+'"]');
  el.classList.remove("active","complete");
  if(state)el.classList.add(state);
  if(state==="complete")el.querySelector(".step-icon").textContent="✓";
  if(state==="active")el.querySelector(".step-icon").textContent=String(index+1);
}
async function perform(module){
  if(running)return;
  running=true;
  const runButton=$(module==="forecast"?"run-forecast":"run-risk");
  runButton.disabled=true;
  document.querySelectorAll(".step").forEach((el,i)=>markStep(i,""));
  let result;
  try{
    setStatus("Processing","working");
    for(let i=0;i<4;i++){
      markStep(i,"active");
      if(i===0){
        // Inputs are read here; no remote data sources are queried.
        if(module==="forecast")forecastValues();else riskValues();
      }else if(i===1){
        // Dataset construction and structure checks occur within each model function.
        const values=module==="forecast"?forecastValues():riskValues();
        if(module==="forecast"&&(!segments[values.segment]||!models[values.method]))throw new Error("Invalid model selection");
        if(module==="risk"&&(values.reliability<0||values.reliability>100))throw new Error("Invalid reliability");
      }else if(i===2){
        result=module==="forecast"?runForecast(forecastValues()):runRisk(riskValues());
      }else if(i===3){
        if(module==="forecast"){lastForecast=result;renderForecast(result);}else{lastRisk=result;renderRisk(result);}
      }
      await pause(230);
      markStep(i,"complete");
    }
    setStatus("Analysis complete","good");
    const note=$(module+"-note");note.textContent="Analysis completed · results updated.";note.classList.remove("changed");
  }catch(error){
    setStatus("Check required","working");
    const note=$(module+"-note");note.textContent="Unable to calculate: "+error.message;note.classList.add("changed");
  }finally{runButton.disabled=false;running=false;}
}
function renderForecast(result){
  $("kpi-accuracy").textContent=fixed(result.accuracy,1)+"%";
  $("kpi-demand").textContent=number.format(result.total);
  $("kpi-demand-sub").textContent=segments[result.segment].unit+" over "+result.horizon+" months";
  const difference=result.accuracy-result.baseline.accuracy;
  $("kpi-benchmark").textContent=signed(difference,1)+" pp";
  $("kpi-impact").textContent=signed(result.impact);
  $("graph-horizon").textContent="Next "+result.horizon+" months";
  const tbody=$("model-table");tbody.replaceChildren();
  result.comparisons.forEach(item=>{
    const tr=document.createElement("tr");if(item.key===result.method)tr.className="highlight";
    const fields=[models[item.key].label,fixed(item.accuracy,1)+"%",number.format(Math.round(item.mae)),signed(item.bias,1)+"%"];
    fields.forEach(s=>{const td=document.createElement("td");td.textContent=s;tr.appendChild(td);});
    tbody.appendChild(tr);
  });
  const insights=[
    {symbol:"↗",headline:"Capacity to plan",detail:"Expected volume across "+result.horizon+" months: "+number.format(result.total)+" "+segments[result.segment].unit+". Use this as an input to purchasing and workforce planning."},
    {symbol:"≈",headline:"Model quality",detail:result.accuracy>=result.baseline.accuracy?
       "The selected method improves held-out accuracy by "+fixed(difference,1)+" percentage points versus last-year seasonality.":
       "The selected method trails the simple seasonal baseline by "+fixed(Math.abs(difference),1)+" points. A more complex method is not always better."},
    {symbol:"±",headline:"Scenario exposure",detail:result.growth===0?
       "The current scenario uses the unadjusted model outlook. Change demand assumptions to stress-test the plan.":
       "The "+signed(result.growth)+"% end-of-horizon assumption changes projected demand by "+signed(result.impact)+" "+segments[result.segment].unit+"."}
  ];
  const out=$("insights");out.replaceChildren();
  insights.forEach(it=>{
    const article=document.createElement("div");article.className="insight";
    const symbol=document.createElement("span");symbol.className="insight-symbol";symbol.textContent=it.symbol;
    const body=document.createElement("div"),strong=document.createElement("strong"),para=document.createElement("p");
    strong.textContent=it.headline;para.textContent=it.detail;body.append(strong,para);article.append(symbol,body);out.append(article);
  });
  drawChart(result);
}
function svgEl(name,attrs={},text){
  const e=document.createElementNS("http://www.w3.org/2000/svg",name);
  Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));
  if(text!=null)e.textContent=String(text);
  return e;
}
function drawChart(result){
  const svg=$("demand-chart");svg.replaceChildren();
  const width=980,height=348,pad={left:65,right:22,top:20,bottom:38};
  const actual=result.series.slice(-18),all=[...actual.map(x=>x.value),...result.future.flatMap(x=>[x.value,x.low,x.high])];
  const vMin=Math.min(...all)*.87,vMax=Math.max(...all)*1.12;
  const y=v=>pad.top+(vMax-v)/(vMax-vMin)*(height-pad.top-pad.bottom);
  const x=i=>pad.left+i/(actual.length+result.future.length-1)*(width-pad.left-pad.right);
  for(let k=0;k<=4;k++){
    const val=vMax-k*(vMax-vMin)/4,Y=y(val);
    svg.append(svgEl("line",{x1:pad.left,y1:Y,x2:width-pad.right,y2:Y,stroke:"#e8ede9","stroke-width":"1"}));
    svg.append(svgEl("text",{x:pad.left-11,y:Y+4,"text-anchor":"end","font-size":"11",fill:"#90a09b"},number.format(Math.round(val))));
  }
  const boundary=(x(actual.length-1)+x(actual.length))/2;
  svg.append(svgEl("rect",{x:boundary,y:pad.top,width:width-pad.right-boundary,height:height-pad.top-pad.bottom,fill:"#f6faf7"}));
  svg.append(svgEl("line",{x1:boundary,y1:pad.top,x2:boundary,y2:height-pad.bottom,stroke:"#b8cec0","stroke-dasharray":"5 6"}));
  svg.append(svgEl("text",{x:boundary+9,y:pad.top+12,"font-size":"10",fill:"#75a18b","font-weight":"700"},"FORECAST"));
  const points=values=>values.map((v,i)=>x(i)+","+y(v)).join(" ");
  if($("toggle-band").checked){
    const upper=result.future.map((r,i)=>[x(actual.length+i),y(r.high)]);
    const lower=result.future.map((r,i)=>[x(actual.length+i),y(r.low)]).reverse();
    svg.append(svgEl("polygon",{points:[...upper,...lower].map(q=>q.join(",")).join(" "),fill:"#dcece1",opacity:".82"}));
  }
  const historic=actual.map(r=>r.value);
  svg.append(svgEl("polyline",{points:points(historic),fill:"none",stroke:"#253f4a","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"}));
  const base=[actual.at(-1).value,...result.future.map(r=>r.baseline)];
  svg.append(svgEl("polyline",{points:base.map((v,i)=>x(actual.length-1+i)+","+y(v)).join(" "),fill:"none",stroke:"#9eaca8","stroke-width":"2","stroke-dasharray":"6 6","stroke-linecap":"round","stroke-linejoin":"round"}));
  const future=[actual.at(-1).value,...result.future.map(r=>r.value)];
  svg.append(svgEl("polyline",{points:future.map((v,i)=>x(actual.length-1+i)+","+y(v)).join(" "),fill:"none",stroke:"#2f8061","stroke-width":"3.4","stroke-linecap":"round","stroke-linejoin":"round"}));
  result.future.forEach((r,i)=>{
    const c=svgEl("circle",{cx:x(actual.length+i),cy:y(r.value),r:4.2,fill:"#2f8061",stroke:"#fff","stroke-width":2});
    c.append(svgEl("title",{},monthText(r.month)+": "+number.format(r.value)+" "+segments[result.segment].unit));
    svg.append(c);
  });
  const visible=[...actual,...result.future];
  const indices=[0,3,6,9,12,15,actual.length-1,actual.length+result.future.length-1];
  for(const i of new Set(indices)){
    const entry=visible[i];if(!entry)continue;
    svg.append(svgEl("text",{x:x(i),y:height-12,"text-anchor":"middle","font-size":"11",fill:"#859791"},monthText(entry.month)));
  }
}
function renderRisk(r){
  $("risk-percent").textContent=pct(r.probability);
  $("risk-accuracy").textContent=pct(r.validation.accuracy);
  $("risk-precision").textContent=pct(r.validation.precision);
  $("risk-recall").textContent=pct(r.validation.recall);
  $("risk-f1").textContent=pct(r.validation.f1);
  document.querySelector(".risk-scale>span").style.left=clamp(r.probability*100,0,100)+"%";
  const titles={High:"Prioritise a review",Elevated:"Monitor the shipment",Low:"Routine monitoring"};
  const descriptions={
    High:"The fitted model places this shipment in a higher-risk band. A human operations review would be appropriate before making commitments.",
    Elevated:"The current conditions point to some delivery exposure. Reviewing queue pressure and carrier reliability could help.",
    Low:"The estimated delay risk is comparatively low for this example. Continue normal controls and periodic monitoring."
  };
  $("risk-heading").textContent=titles[r.band];
  $("risk-description").textContent=descriptions[r.band];
  $("risk-band").textContent=r.band.toUpperCase()+" RISK · synthetic order profile";
}
updateFieldReadouts();
try{lastForecast=runForecast(forecastValues());renderForecast(lastForecast);}catch(e){$("forecast-note").textContent="Forecast unavailable: "+e.message;}
try{lastRisk=runRisk(riskValues());renderRisk(lastRisk);}catch(e){$("risk-note").textContent="Risk model unavailable: "+e.message;}
setView(location.hash.slice(1)||"forecast");
