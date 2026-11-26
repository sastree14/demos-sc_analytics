import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,modelNames,calculate,defaultInputs,metricLabel} from "./models.js";
import {UI,sectorText,EXPLANATIONS,CONSTRAINTS} from "./i18n.js";

const $=id=>document.getElementById(id);
const query=new URLSearchParams(location.search);
let language=["es","ca","en"].includes(query.get("lang"))?query.get("lang"):null;
try{language=language||sessionStorage.getItem("scIndustryLanguage");}catch(_){}
language=["es","ca","en"].includes(language)?language:(navigator.language?.toLowerCase().startsWith("ca")?"ca":navigator.language?.toLowerCase().startsWith("en")?"en":"es");
const requested=(query.get("sector")||query.get("industry")||"SC01").toUpperCase();
const sectors=INDUSTRY_CATALOG.sectors;
let sector=sectors.find(x=>x.code===requested)||sectors[0];
let problem=sector.pain_points.find(x=>x.id===query.get("case"))||sector.pain_points[0];
let values={},lastValues={},result=null,snapshots={A:null,B:null};
let tutorialStep=0;
const formatters={};
const loc=()=>language==="ca"?"ca-ES":language==="es"?"es-ES":"en-GB";
const t=key=>UI[language][key]??UI.es[key]??key;
const tr=ob=>(typeof ob==="string"?ob:(ob?.[language]||ob?.es||""));
const stateLocale=(str,key)=>language==="es"?str:(sectorText[sector.code]?.problems?.[key]?.[language]||str);
function sectorName(){return language==="es"?sector.name:(sectorText[sector.code]?.[language]||sector.name);}
function caseName(p){return stateLocale(p.title,sector.pain_points.findIndex(x=>x.id===p.id));}
function format(v,unit="number"){
 if(!Number.isFinite(v))return "—";
 const digits=unit==="eur4"?3:unit==="minutes"?1:Math.abs(v)<10&&unit!=="number"?1:Math.abs(v)<1?2:Math.abs(v)<100?1:0;
 const options={maximumFractionDigits:digits};
 if(unit==="eur"||unit==="eur4"){return new Intl.NumberFormat(loc(),{style:"currency",currency:"EUR",maximumFractionDigits:unit==="eur4"?3:Math.abs(v)<20?2:0}).format(v);}
 if(unit==="pct")return new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(v)+" %";
 if(unit==="minutes")return new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(v)+" min";
 return new Intl.NumberFormat(loc(),options).format(v);
}
const escaped=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
function syncUrl(){
 const url=new URL(location.href);url.searchParams.set("sector",sector.code);url.searchParams.set("case",problem.id);url.searchParams.set("lang",language);
 history.replaceState(null,"",url.pathname+url.search+url.hash);
}
function colorInit(){
 document.documentElement.style.setProperty("--accent",sector.accent||"#458774");
 document.documentElement.style.setProperty("--accent-bg",(sector.accent||"#458774")+"19");
 document.body.dataset.sector=sector.code;
}
function applyLanguage(next){
 language=next;
 document.documentElement.lang=next;
 try{sessionStorage.setItem("scIndustryLanguage",language);}catch(_){}
 document.querySelectorAll("[data-i18n]").forEach(el=>{el.textContent=t(el.dataset.i18n);});
 document.querySelectorAll("[data-locale]").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.locale===next)));
 $("sector-code").textContent=sector.code;
 $("industry-name").textContent=sectorName();
 $("industry-context").textContent=language==="es"?sector.first_screen_hypothesis:(language==="ca"?"Explora sis decisions habituals de "+sectorName().toLowerCase()+".":"Explore six illustrative decisions in "+sectorName().toLowerCase()+".");
 document.title=sectorName()+" · SC-Analytics Industry Decision Lab";
 buildNav();
 renderCase(false);
 renderTour();
 syncUrl();
}
function buildNav(){
 const nav=$("case-nav"),select=$("mobile-case");nav.replaceChildren();select.replaceChildren();
 sector.pain_points.forEach((p,i)=>{
  const b=document.createElement("button");b.type="button";b.className="case-nav-button";
  b.setAttribute("aria-current",String(p.id===problem.id));
  const number=document.createElement("span");number.className="number";number.textContent=String(i+1).padStart(2,"0");
  const name=document.createElement("span");name.textContent=caseName(p);
  b.append(number,name);b.addEventListener("click",()=>chooseProblem(p.id));
  nav.append(b);
  const opt=document.createElement("option");opt.value=p.id;opt.textContent=String(i+1)+". "+caseName(p);select.append(opt);
 });
 select.value=problem.id;
}
function chooseProblem(caseId){
 const next=sector.pain_points.find(x=>x.id===caseId);if(!next)return;
 problem=next;values=defaultInputs(problem.model,problem.scenario_seed);
 snapshots={A:null,B:null};
 result=null;lastValues={};
 buildNav();renderCase(true);syncUrl();
}
function renderCase(rebuildControls=true){
 $("case-title").textContent=caseName(problem);
 $("case-count").textContent=String(sector.pain_points.indexOf(problem)+1).padStart(2,"0")+" / 06";
 const description=language==="es"?problem.example_controls:(language==="ca"?"Analitza aquest repte amb paràmetres simulats i compara escenaris de "+tr(MODELS[problem.model].title).toLowerCase()+".":"Explore this challenge with synthetic inputs and compare "+tr(MODELS[problem.model].title).toLowerCase()+" scenarios.");
 $("case-description").textContent=description;
 if(!result){values=defaultInputs(problem.model,problem.scenario_seed);result=calculate(problem.model,values);lastValues={...values};rebuildControls=true;}
 if(rebuildControls)renderInputs();
 renderResults();renderComparison();
 $("unsaved").hidden=true;
 const contact=new URL("https://www.sc-analytics.io/contact");
 contact.searchParams.set("intent","problem");
 contact.searchParams.set("sector",sector.code);
 contact.searchParams.set("case",problem.id);
 $("contact-link").href=contact.toString();
}
function renderInputs(){
 const container=$("input-grid");container.replaceChildren();
 const def=MODELS[problem.model];
 for(const input of def.inputs){
  const wrap=document.createElement("div");wrap.className="control";
  const top=document.createElement("div");top.className="control-top";
  const label=document.createElement("label");
  label.textContent=tr(input.label);
  label.htmlFor="control-"+input.key;
  const value=document.createElement("div");value.className="value-box";value.textContent=format(values[input.key],input.unit);
  top.append(label,value);
  const slider=document.createElement("input");
  slider.type="range";slider.id="control-"+input.key;slider.min=String(input.min);slider.max=String(input.max);slider.step=String(input.step);slider.value=String(values[input.key]);
  slider.addEventListener("input",()=>{
   values[input.key]=Number(slider.value);
   value.textContent=format(values[input.key],input.unit);
   $("unsaved").hidden=Object.keys(values).every(k=>values[k]===lastValues[k]);
  });
  const hint=document.createElement("div");hint.className="range-labels";
  const left=document.createElement("span");left.textContent=format(input.min,input.unit);
  const right=document.createElement("span");right.textContent=format(input.max,input.unit);
  hint.append(left,right);wrap.append(top,slider,hint);container.append(wrap);
 }
}
function metricCard(m){
 const card=document.createElement("article");card.className="metric";
 const label=document.createElement("div");label.className="metric-label";label.textContent=metricLabel(m.key,language);
 const val=document.createElement("div");val.className="metric-value";val.textContent=format(m.value,m.unit);
 card.append(label,val);return card;
}
function renderResults(){
 const container=$("metrics");container.replaceChildren();
 result.metrics.forEach(m=>container.append(metricCard(m)));
 $("warnings").replaceChildren();
 const warnings=[result.warning];if(["SC05","SC09","SC12","SC16"].includes(sector.code))warnings.push(t("noRegulated"));
 for(const warning of warnings.filter(Boolean)){
  const alert=document.createElement("div");alert.className="warning";alert.textContent=warning;$("warnings").append(alert);
 }
 $("chart-unit").textContent=result.visual.unit==="eur"?"EUR":result.visual.unit==="minutes"?t("wait"):result.visual.unit==="number"?"":result.visual.unit;
 $("explanation").textContent=(language==="es"?"Para «"+caseName(problem)+"», este resultado se ha calculado con las condiciones que acabas de ejecutar. ":language==="ca"?"Per a «"+caseName(problem)+"», el resultat s'ha calculat amb els supòsits que has executat. ":"For “"+caseName(problem)+"”, this outcome uses the assumptions you just ran. ")+EXPLANATIONS[problem.model][language==="es"?0:language==="ca"?1:2];
 $("formula").textContent=EXPLANATIONS[problem.model][language==="es"?0:language==="ca"?1:2];
 $("limitations").textContent=CONSTRAINTS[problem.model][language==="es"?0:language==="ca"?1:2];
 const tbody=$("detail-rows");tbody.replaceChildren();
 for(const [name,value] of result.table){
  const row=document.createElement("tr");
  const label=document.createElement("td");label.textContent=name;
  const data=document.createElement("td");data.textContent=typeof value==="number"?format(value):String(value);
  row.append(label,data);tbody.append(row);
 }
 renderChart(result.visual);
}
function seriesName(key){
 return ({target:t("target"),actual:t("actual"),reference:t("reference"),scenario:t("scenario"),profit:t("profit"),shortage:t("shortage"),stock:t("stock"),wait:t("wait"),total:t("total"),cases:t("cases"),defects:t("defects"),hours:t("hours"),cash:t("cash"),allocation:t("allocation"),energy:t("energy"),amount:t("total")})[key]||key;
}
const palette=["#407e6b","#7d9eb4","#c79a60","#8d83ae"];
const NS="http://www.w3.org/2000/svg";
function svgEl(tag,attrs,text){
 const el=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs||{}))el.setAttribute(k,String(v));
 if(text!==undefined)el.textContent=String(text);
 return el;
}
function renderChart(visual){
 const svg=$("chart");svg.replaceChildren();
 const width=760,height=300,left=68,right=18,top=19,bottom=50,plotW=width-left-right,plotH=height-top-bottom;
 const data=visual.series.flatMap(s=>s.values).filter(v=>v!==null&&Number.isFinite(v));
 const min=Math.min(0,...data),max=Math.max(1,...data),span=max-min||1;
 const y=n=>top+(max-n)/span*plotH;
 const x=i=>left+(i+.5)*plotW/visual.labels.length;
 svg.append(svgEl("title",{},t("chart")+" · "+caseName(problem)));
 svg.append(svgEl("desc",{},visual.labels.length+" categories; "+visual.series.map(s=>seriesName(s.key)).join(", ")));
 for(let i=0;i<=4;i++){
  const value=min+span*i/4,yy=y(value);
  svg.append(svgEl("line",{x1:left,x2:width-right,y1:yy,y2:yy,class:"grid-line"}));
  svg.append(svgEl("text",{x:left-9,y:yy+4,"text-anchor":"end"},format(value,visual.unit==="eur"?"eur":visual.unit==="minutes"?"minutes":"number")));
 }
 svg.append(svgEl("line",{x1:left,x2:width-right,y1:y(0),y2:y(0),stroke:"#a4b9af","stroke-width":"1.2"}));
 if(visual.type==="line"){
  visual.series.forEach((s,j)=>{
   const pts=s.values.map((value,i)=>({value,i})).filter(p=>p.value!==null&&Number.isFinite(p.value));
   for(let k=0;k<pts.length-1;k++){
    if(pts[k+1].i!==pts[k].i+1)continue;
    svg.append(svgEl("line",{x1:x(pts[k].i),y1:y(pts[k].value),x2:x(pts[k+1].i),y2:y(pts[k+1].value),stroke:palette[j%palette.length],"stroke-width":2.7,"stroke-linecap":"round"}));
   }
   for(const pt of pts){
    const circle=svgEl("circle",{cx:x(pt.i),cy:y(pt.value),r:4,fill:palette[j%palette.length],stroke:"#fff","stroke-width":1.6});
    circle.append(svgEl("title",{},visual.labels[pt.i]+": "+seriesName(s.key)+" "+format(pt.value,visual.unit)));
    svg.append(circle);
   }
  });
 }else{
  const groupW=plotW/visual.labels.length, barW=Math.max(3,Math.min(30,groupW*.7/visual.series.length));
  visual.series.forEach((s,j)=>{
   s.values.forEach((v,i)=>{
    if(v===null||!Number.isFinite(v))return;
    const pos=x(i)+(j-(visual.series.length-1)/2)*barW*1.12;
    const boxY=Math.min(y(v),y(0)),boxH=Math.max(1,Math.abs(y(v)-y(0)));
    const rect=svgEl("rect",{x:pos-barW/2,y:boxY,width:barW,height:boxH,fill:palette[j%palette.length],rx:2});
    rect.append(svgEl("title",{},visual.labels[i]+": "+seriesName(s.key)+" "+format(v,visual.unit)));
    svg.append(rect);
   });
  });
 }
 const every=Math.ceil(visual.labels.length/10);
 visual.labels.forEach((name,i)=>{if(i%every!==0)return;
  const text=String(name).length>16?String(name).slice(0,15)+"…":String(name);
  svg.append(svgEl("text",{x:x(i),y:height-22,"text-anchor":"middle"},text));
 });
 const legend=$("legend");legend.replaceChildren();
 visual.series.forEach((s,j)=>{
  const item=document.createElement("span");item.className="legend-item";
  const dot=document.createElement("span");dot.className="legend-dot";dot.style.background=palette[j%palette.length];
  item.append(dot,document.createTextNode(seriesName(s.key)));legend.append(item);
 });
}
function execute(){
 lastValues={...values};result=calculate(problem.model,lastValues);
 $("unsaved").hidden=true;renderResults();renderComparison();
}
function save(which){
 if($("unsaved").hidden===false)execute();
 snapshots[which]={problem:problem.id,metrics:result.metrics.map(m=>({...m})),values:{...lastValues},date:new Date().toISOString()};
 renderComparison();
}
function renderComparison(){
 const a=snapshots.A,b=snapshots.B,container=$("compare-result");container.replaceChildren();
 $("compare-hint").hidden=!!(a||b);
 if(!a&&!b)return;
 const table=document.createElement("div");table.className="compare-table";
 for(const cell of ["",t("scenarioA"),t("scenarioB")]){const span=document.createElement("div");span.className="compare-head";span.textContent=cell;table.append(span);}
 for(const m of (a||b).metrics){
  const left=document.createElement("div");left.textContent=metricLabel(m.key,language);table.append(left);
  for(const snapshot of [a,b]){
   const cell=document.createElement("div");cell.className="compare-num";
   const value=snapshot?.metrics.find(x=>x.key===m.key);
   cell.textContent=value?format(value.value,value.unit):"—";table.append(cell);
  }
 }
 container.append(table);
}
function report(){
 if(!$("unsaved").hidden)execute();
 const rows=result.metrics.map(m=>"<tr><td>"+escaped(metricLabel(m.key,language))+"</td><td>"+escaped(format(m.value,m.unit))+"</td></tr>").join("");
 const vars=Object.entries(lastValues).map(([k,v])=>{
  const x=MODELS[problem.model].inputs.find(f=>f.key===k);
  return "<tr><td>"+escaped(tr(x.label))+"</td><td>"+escaped(format(v,x.unit))+"</td></tr>";
 }).join("");
 const html='<!doctype html><html lang="'+language+'"><meta charset="utf-8"><title>'+escaped(t("reportTitle"))+'</title><style>body{font:15px Arial,sans-serif;max-width:850px;margin:45px auto;padding:0 30px;color:#102b31;line-height:1.6}h1{font:normal 34px Georgia,serif}table{border-collapse:collapse;width:100%;margin:20px 0}td{padding:9px;border-bottom:1px solid #ddd}td:last-child{text-align:right}small{color:#60716b}.brand{color:#28664e;font-weight:bold}</style><p class="brand">SC-Analytics · Industry Decision Lab</p><h1>'+escaped(sectorName())+' — '+escaped(caseName(problem))+'</h1><p>'+escaped(t("reportSource"))+'</p><h2>'+escaped(t("controls"))+'</h2><table>'+vars+'</table><h2>'+escaped(t("metrics"))+'</h2><table>'+rows+'</table><h2>'+escaped(t("formula"))+'</h2><p>'+escaped($("formula").textContent)+'</p><h2>'+escaped(t("limitations"))+'</h2><p>'+escaped($("limitations").textContent)+'</p><small>https://www.sc-analytics.io/ · '+escaped(new Date().toLocaleDateString(loc()))+'</small></html>';
 const blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download=sector.code.toLowerCase()+"-"+problem.id.toLowerCase()+"-sc-analytics.html";
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function copyLink(){
 syncUrl();
 const text=location.href;
 try{await navigator.clipboard.writeText(text);$("copy-link").lastElementChild.textContent=t("copyDone");setTimeout(()=>$("copy-link").lastElementChild.textContent=t("copy"),1600);}
 catch(_){const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();try{document.execCommand("copy");$("copy-link").lastElementChild.textContent=t("copyDone");}finally{area.remove();}}
}
const dialog=$("guide-dialog");
function closeTour(){if(dialog.open)dialog.close();try{sessionStorage.setItem("scIndustryTourSeen","yes");}catch(_){}}
function renderTour(){
 $("guide-progress").textContent=String(tutorialStep+1)+" / 5";
 $("guide-title").textContent=t("tutorial")[tutorialStep];
 $("guide-body").textContent=t("tourDescriptions")[tutorialStep];
 $("guide-back").disabled=tutorialStep===0;
 $("guide-next").textContent=tutorialStep===4?t("action"):t("next");
 $("guide-back").textContent=t("back");
 $("guide-skip").textContent=t("skip");
 const locales=$("guide-locales");locales.replaceChildren();
 if(tutorialStep===0){
  for(const [code,name] of [["es","Español"],["ca","Català"],["en","English"]]){
   const btn=document.createElement("button");btn.type="button";btn.textContent=name;btn.setAttribute("aria-pressed",String(language===code));btn.addEventListener("click",()=>applyLanguage(code));locales.append(btn);
  }
 }
}
function openTour(){tutorialStep=0;renderTour();dialog.showModal();}
function configure(){
 colorInit();
 document.querySelectorAll("[data-locale]").forEach(btn=>btn.addEventListener("click",()=>applyLanguage(btn.dataset.locale)));
 $("mobile-case").addEventListener("change",e=>chooseProblem(e.target.value));
 $("run").addEventListener("click",execute);
 $("reset").addEventListener("click",()=>{values=defaultInputs(problem.model,problem.scenario_seed);result=calculate(problem.model,values);lastValues={...values};renderInputs();renderResults();$("unsaved").hidden=true;});
 $("save-a").addEventListener("click",()=>save("A"));$("save-b").addEventListener("click",()=>save("B"));
 $("download").addEventListener("click",report);
 $("copy-link").addEventListener("click",copyLink);
 $("restart-tour").addEventListener("click",openTour);
 $("close-guide").addEventListener("click",closeTour);
 $("guide-skip").addEventListener("click",closeTour);
 $("guide-back").addEventListener("click",()=>{tutorialStep=Math.max(0,tutorialStep-1);renderTour();});
 $("guide-next").addEventListener("click",()=>{if(tutorialStep===4){closeTour();$("input-grid").scrollIntoView({block:"center",behavior:"smooth"});}else{tutorialStep++;renderTour();}});
 dialog.addEventListener("close",()=>{try{sessionStorage.setItem("scIndustryTourSeen","yes");}catch(_){}});
 applyLanguage(language);
 try{if(sessionStorage.getItem("scIndustryTourSeen")!=="yes"){openTour();}}catch(_){openTour();}
}
configure();
