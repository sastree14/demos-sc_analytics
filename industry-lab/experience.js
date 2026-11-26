import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,modelNames,calculate,defaultInputs,metricLabel} from "./models.js";
import {UI,sectorText,EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,WARNING_TRANSLATIONS,SECTOR_CONTEXT} from "./i18n.js";

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
 if(unit==="hours")return new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(v)+" h";
 if(unit==="days")return new Intl.NumberFormat(loc(),{maximumFractionDigits:1}).format(v)+(language==="ca"?" dies":language==="en"?" d":" días");
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
 $("industry-context").textContent=language==="es"?sector.first_screen_hypothesis:(SECTOR_CONTEXT[sector.code]?.[language]||(language==="ca"?"Explora sis decisions habituals de "+sectorName().toLowerCase()+".":"Explore six illustrative decisions in "+sectorName().toLowerCase()+"."));
 document.title=sectorName()+" · SC-Analytics Industry Decision Lab";
 buildNav();
 renderCase(true);
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
  const alert=document.createElement("div");alert.className="warning";alert.textContent=language==="es"?warning:(WARNING_TRANSLATIONS[warning]?.[language==="ca"?0:1]||warning);$("warnings").append(alert);
 }
 $("chart-unit").textContent=result.visual.unit==="eur"?"EUR":result.visual.unit==="minutes"?t("wait"):result.visual.unit==="number"?"":result.visual.unit;
 $("explanation").textContent=(language==="es"?"Para «"+caseName(problem)+"», este resultado se ha calculado con las condiciones que acabas de ejecutar. ":language==="ca"?"Per a «"+caseName(problem)+"», el resultat s'ha calculat amb els supòsits que has executat. ":"For “"+caseName(problem)+"”, this outcome uses the assumptions you just ran. ")+EXPLANATIONS[problem.model][language==="es"?0:language==="ca"?1:2];
 $("formula").textContent=EXPLANATIONS[problem.model][language==="es"?0:language==="ca"?1:2];
 $("limitations").textContent=CONSTRAINTS[problem.model][language==="es"?0:language==="ca"?1:2];
 const tbody=$("detail-rows");tbody.replaceChildren();
 for(const [name,value] of result.table){
  const row=document.createElement("tr");
  const label=document.createElement("td");label.textContent=language==="es"?name:(DETAIL_TRANSLATIONS[name]?.[language==="ca"?0:1]||name);
  const data=document.createElement("td");data.textContent=typeof value==="number"?format(value):String(value);
  row.append(label,data);tbody.append(row);
 }
 renderChart(result.visual);
}
function seriesName(key){
 return ({target:t("target"),actual:t("actual"),reference:t("reference"),scenario:t("scenario"),profit:t("profit"),shortage:t("shortage"),stock:t("stock"),wait:t("wait"),total:t("total"),cases:t("cases"),defects:t("defects"),hours:t("hours"),cash:t("cash"),allocation:t("allocation"),coverage:t("coverage"),energy:t("energy"),amount:t("total")})[key]||key;
}
const palette=["#407e6b","#7d9eb4","#c79a60","#8d83ae"];
const NS="http://www.w3.org/2000/svg";
function svgEl(tag,attrs,text){
 const el=document.createElementNS(NS,tag);
 for(const [k,v] of Object.entries(attrs||{}))el.setAttribute(k,String(v));
 if(text!==undefined)el.textContent=String(text);
 return el;
}

/* Decision-specific SVG explanations: more useful than decorative bar charts. */
const translatedLabels={
 "Ingresos":["Ingressos","Revenue"],"Kilómetros":["Quilòmetres","Distance"],"Espera":["Espera","Waiting"],
 "Contribución":["Contribució","Contribution"],"Producto":["Producte","Product cost"],
 "Operación":["Operació","Operations"],"Devoluciones":["Devolucions","Returns"],
 "Ida":["Anada","Outbound"],"Retorno cargado":["Retorn carregat","Loaded return"],
 "Retorno vacío":["Retorn buit","Empty return"],"Propio":["Propi","In-house"],
 "Externo":["Extern","External"],"Pendiente":["Pendent","Pending"],
 "Almacén A":["Magatzem A","Warehouse A"],"Almacén B":["Magatzem B","Warehouse B"],
 "VP":["VP","TP"],"FP":["FP","FP"],"FN":["FN","FN"],"VN":["VN","TN"],
 "Demanda":["Demanda","Demand"],"Base":["Base","Baseline"],"Con horas extra":["Amb hores extres","With overtime"],
 "Defectos base":["Defectes base","Baseline defects"],"Defectos escenario":["Defectes escenari","Scenario defects"],
 "Detectados":["Detectats","Detected"],"Falsos rechazos":["Rebuigs falsos","False rejects"],
 "Familia A":["Família A","Family A"],"Familia B":["Família B","Family B"],
 "Punta":["Punta","Peak"],"Valle":["Vall","Off-peak"],"Due":["Data límit","Due time"],
 "Setup":["Preparació","Setup"],"A":["A","A"],"B":["B","B"],
 "FEFO":["FEFO","FEFO"],"Orden de llegada":["Ordre d'arribada","Arrival order"],
 "Pedido base":["Comanda base","Baseline order"],"Plan calculado":["Pla calculat","Calculated plan"],
 "Sin promoción":["Sense promoció","No promotion"],"Promoción":["Promoció","Promotion"],
 "Suministro normal":["Subministrament normal","On-time supply"],"Con retraso":["Amb retard","Delayed"],
 "Promedio ponderado":["Mitjana ponderada","Weighted average"],
 "Defectos":["Defectes","Defects"],"Orden llegada":["Ordre d'arribada","Arrival order"],
 "Con llegada":["Amb arribada","On-time arrival"],"Con demora":["Amb demora","Delayed"],
 "Sin reglas":["Sense regles","Without rules"],"Con reglas":["Amb regles","With rules"],
 "Referencia":["Referència","Reference"],"Centro":["Centre","Centre"],
 "Local A":["Local A","Store A"],"Local B":["Local B","Store B"],"Local C":["Local C","Store C"],
 "Plato A":["Plat A","Dish A"],"Plato B":["Plat B","Dish B"],"Plato C":["Plat C","Dish C"],
 "Plato A":["Plat A","Dish A"],"Tickets":["Tiquets","Tickets"],"Pedido":["Comanda","Order"],
 "Directo":["Directe","Direct"],"Intermediado":["Intermediat","Intermediary"],
 "Trabajo requerido":["Feina necessària","Required work"],"Personal actual":["Personal actual","Current staff"],
 "Con refuerzo":["Amb reforç","Extra staffing"],"Sin grupo":["Sense grup","Without group"],
 "Con grupo":["Amb grup","With group"],"Carga fija":["Càrrega fixa","Fixed load"],
 "Habitaciones":["Habitacions","Rooms"],"Lunes":["Dilluns","Monday"],
 "Online":["En línia","Online"],"Tienda":["Botiga","Store"],"Tienda A":["Botiga A","Store A"],
 "Tienda B":["Botiga B","Store B"],"Web":["Web","Website"],"Precio habitual":["Preu habitual","Full price"],
 "Rebaja":["Rebaixa","Markdown"],"Sin promoción":["Sense promoció","No promotion"],"Con promoción":["Amb promoció","Promotion"],
 "Adquisición":["Captació","Acquisition"],"Primera compra":["Primera compra","First purchase"],"Recompra":["Recompra","Repeat purchase"],
 "Confirmación y lista":["Confirmació i llista","Confirmation and waiting list"],
 "General":["General","General"],"Equipada":["Equipada","Equipped"],
 "Proceso manual":["Procés manual","Manual process"],"Reglas + revisión":["Regles + revisió","Rules + review"],
 "Atendidos":["Atesos","Served"],"Solicitados":["Sol·licitats","Requested"],"Capacidad":["Capacitat","Capacity"],
 "Planificado":["Planificat","Planned"],"Valor ganado":["Valor guanyat","Earned value"],
 "Coste real":["Cost real","Actual cost"],"Zona A":["Zona A","Area A"],
 "Zona B":["Zona B","Area B"],"Zona C":["Zona C","Area C"],
 "Entrega puntual":["Lliurament puntual","On-time delivery"],"Entrega tardía":["Lliurament tardà","Delayed delivery"],
 "Sin coordinación":["Sense coordinació","Without coordination"],"Con coordinación":["Amb coordinació","With coordination"],
 "Activo A":["Actiu A","Asset A"],"Activo B":["Actiu B","Asset B"],"Activo C":["Actiu C","Asset C"],
 "Proveedor A":["Proveïdor A","Vendor A"],"Proveedor B":["Proveïdor B","Vendor B"],"Proveedor C":["Proveïdor C","Vendor C"],
 "Climatización":["Climatització","HVAC"],"Cubierta":["Coberta","Roof"],
 "Iluminación":["Il·luminació","Lighting"],"Ascensores":["Ascensors","Lifts"],
 "Sensórica":["Sensors","Sensors"],"Vacantes":["Vacants","Vacant units"]
};
const labelFor=x=>language==="es"?x:(translatedLabels[x]?.[language==="ca"?0:1]||x);
function setChartLegend(segments){
 const legend=$("legend");legend.replaceChildren();
 for(const [label,color,value,unit] of segments){
  const el=document.createElement("span");el.className="legend-item";
  const swatch=document.createElement("span");swatch.className="legend-dot";swatch.style.background=color;
  el.append(swatch,document.createTextNode(labelFor(label)+(Number.isFinite(value)?" · "+format(value,unit||"number"):"")));
  legend.append(el);
 }
}
function renderSpecialChart(visual){
 const {type}=visual;
 if(!["waterfall","parts","flow","matrix","schedule"].includes(type))return false;
 const svg=$("chart");svg.replaceChildren();
 const values=visual.series[0].values.map(x=>Number(x)||0);
 svg.append(svgEl("title",{},t("chart")+" · "+caseName(problem)));
 svg.append(svgEl("desc",{},visual.labels.map((x,i)=>labelFor(x)+": "+format(values[i]??0,visual.unit)).join("; ")));
 
 if(type==="schedule"){
   const events=visual.events||[];
   if(!events.length)return true;
   const maxTime=Math.max(1,...events.map(e=>Math.max(e.finish,e.due)))*1.1;
   const left=90,right=730,top=48,bottom=258,w=right-left;
   const pos=time=>left+Math.max(0,time)/maxTime*w;
   const byType={A:"#437f6a",B:"#7d9eb4"};
   for(let tick=0;tick<=5;tick++){
     const h=maxTime*tick/5,x=pos(h);
     svg.append(svgEl("line",{x1:x,y1:top,x2:x,y2:bottom,stroke:"#e0e9e4","stroke-dasharray":"4 4"}));
     svg.append(svgEl("text",{x,y:bottom+18,"text-anchor":"middle"},Math.round(h)+(visual.unit==="days"?(language==="ca"?" dies":language==="en"?" d":" días"):" h")));
   }
   for(let index=0;index<events.length;index++){
     const e=events[index],y=top+index*38+5;
     svg.append(svgEl("text",{x:20,y:y+20,"font-size":"12","font-weight":"700"},e.id+" · "+e.type));
     if(e.setup>0){
       const prep=svgEl("rect",{x:pos(e.start-e.setup),y:y+2,width:Math.max(1,pos(e.start)-pos(e.start-e.setup)),height:23,rx:2,fill:"#e4c89a"});
       prep.append(svgEl("title",{},"Setup: "+format(e.setup)+" h"));
       svg.append(prep);
     }
     const bar=svgEl("rect",{x:pos(e.start),y:y+2,width:Math.max(1,pos(e.finish)-pos(e.start)),height:23,rx:3,fill:byType[e.type]||"#437f6a"});
     bar.append(svgEl("title",{},e.id+" · "+e.type+" · "+format(e.start)+"–"+format(e.finish)+" h"));
     svg.append(bar);
     const dueX=pos(e.due);
     svg.append(svgEl("line",{x1:dueX,y1:y-1,x2:dueX,y2:y+28,stroke:"#b96866","stroke-width":2,"stroke-dasharray":"3 3"}));
     if(pos(e.finish)-pos(e.start)>32)svg.append(svgEl("text",{x:(pos(e.start)+pos(e.finish))/2,y:y+18,"text-anchor":"middle","font-size":"10",style:"fill:white"},e.id));
   }
   setChartLegend([["A",byType.A,null],["B",byType.B,null],["Setup","#e4c89a",null],["Due","#b96866",null]]);
   return true;
 }
if(type==="waterfall"){
  const n=values.length,net=values[n-1];
  const ceiling=Math.max(1,values[0]*1.08),floor=Math.min(0,net*1.08);
  const y=v=>245-(v-floor)/(ceiling-floor)*185;
  const zero=y(0),space=650/n,bar=70;
  svg.append(svgEl("line",{x1:45,y1:zero,x2:728,y2:zero,stroke:"#98aaa1","stroke-width":1.3}));
  let balance=0;
  const legend=[];
  for(let i=0;i<n;i++){
   const x=65+i*space,first=i===0,last=i===n-1;
   const from=first||last?0:balance;
   const to=first?values[0]:last?net:balance-values[i];
   const top=Math.min(y(from),y(to)),height=Math.max(2,Math.abs(y(to)-y(from)));
   const color=first?"#4a8177":last?(net>=0?"#3d6e88":"#ad695e"):"#c79a60";
   const rect=svgEl("rect",{x,y:top,width:bar,height,rx:3,fill:color});
   rect.append(svgEl("title",{},labelFor(visual.labels[i])+": "+format(values[i],visual.unit)));
   svg.append(rect);
   const valueText=i===0||last?values[i]:-values[i];
   svg.append(svgEl("text",{x:x+bar/2,y:top-7,"text-anchor":"middle","font-weight":"700"},format(valueText,visual.unit)));
   svg.append(svgEl("text",{x:x+bar/2,y:276,"text-anchor":"middle"},labelFor(visual.labels[i]).slice(0,15)));
   if(!last){balance=to;const nextX=65+(i+1)*space;svg.append(svgEl("line",{x1:x+bar,x2:nextX,y1:y(balance),y2:y(balance),stroke:"#9baea5","stroke-dasharray":"3 3"}));}
   legend.push([visual.labels[i],color,values[i],visual.unit]);
  }
  setChartLegend(legend);return true;
 }
 if(type==="parts"){
  const parts=values.map(v=>Math.max(0,v)),total=parts.reduce((a,b)=>a+b,0);
  const colors=["#4a8177","#7a9dae","#d2a86e","#9b83a1"],start=52,end=708,width=end-start;
  svg.append(svgEl("text",{x:start,y:60,"font-size":"13","font-weight":"700"},t("chart")));
  let offset=start;
  const legend=[];
  parts.forEach((v,i)=>{
   const segmentWidth=total>0?width*v/total:width/parts.length;
   if(segmentWidth>0){
    const rect=svgEl("rect",{x:offset,y:117,width:segmentWidth,height:74,fill:colors[i%colors.length],rx:2});
    rect.append(svgEl("title",{},labelFor(visual.labels[i])+": "+format(v,visual.unit)));
    svg.append(rect);
    if(segmentWidth>=65)svg.append(svgEl("text",{x:offset+segmentWidth/2,y:155,fill:"#fff","font-size":"15","font-weight":"700","text-anchor":"middle",style:"fill:white"},Math.round(v/Math.max(total,1)*100)+"%"));
   }
   offset+=segmentWidth;
   legend.push([visual.labels[i],colors[i%colors.length],v,visual.unit]);
  });
  svg.append(svgEl("text",{x:width/2+start,y:223,"text-anchor":"middle","font-size":"13"},format(total,visual.unit)));
  setChartLegend(legend);return true;
 }
 if(type==="flow"){
  const demand=visual.series.find(x=>x.key==="target")?.values||[0,0];
  const stock=visual.series.find(x=>x.key==="actual")?.values||[0,0];
  const transfer=result?.table?.find(x=>x[0]==="Unidades transferidas")?.[1]||0;
  const direction=result?.table?.find(x=>x[0]==="Dirección")?.[1]||"";
  const boxes=[{x:72,name:labelFor(visual.labels[0]),stock:stock[0],demand:demand[0]},
               {x:485,name:labelFor(visual.labels[1]),stock:stock[1],demand:demand[1]}];
  for(const box of boxes){
   const good=box.stock>=box.demand;
   svg.append(svgEl("rect",{x:box.x,y:56,width:200,height:163,rx:7,fill:good?"#edf5f0":"#fbf1e7",stroke:good?"#9ac3aa":"#d9b68f"}));
   svg.append(svgEl("text",{x:box.x+17,y:83,"font-size":"14","font-weight":"700"},box.name));
   svg.append(svgEl("text",{x:box.x+17,y:120,"font-size":"11"},t("stock")));
   svg.append(svgEl("text",{x:box.x+17,y:147,"font-size":"21","font-weight":"700"},format(box.stock)));
   svg.append(svgEl("text",{x:box.x+17,y:183,"font-size":"11"},t("target")+": "+format(box.demand)));
  }
  svg.append(svgEl("line",{x1:290,y1:135,x2:467,y2:135,stroke:"#477e70","stroke-width":4,"stroke-linecap":"round"}));
  svg.append(svgEl("path",{d:direction==="B → A"?"M 292 135 l 17 -10 v 20 Z":"M 467 135 l -17 -10 v 20 Z",fill:"#477e70"}));
  svg.append(svgEl("text",{x:380,y:105,"text-anchor":"middle","font-size":"19","font-weight":"700"},format(Number(transfer))));
  svg.append(svgEl("text",{x:380,y:168,"text-anchor":"middle","font-size":"11"},direction));
  setChartLegend([[t("target"),"#d1ab80",null],[t("actual"),"#4b9877",null]]);return true;
 }
 if(type==="matrix"){
  const max=Math.max(1,...values),colors=["#427f6a","#caad6c","#bb7873","#7b9bae"];
  const positions=[[90,53],[390,53],[90,158],[390,158]];
  const legend=[];
  values.forEach((v,i)=>{
   const [x,y]=positions[i],intensity=Math.max(.24,.35+.65*Math.sqrt(v/max));
   svg.append(svgEl("rect",{x,y,width:270,height:91,rx:5,fill:colors[i],opacity:intensity}));
   svg.append(svgEl("text",{x:x+17,y:y+26,"font-size":"13","font-weight":"700",style:"fill:#122f34"},labelFor(visual.labels[i])));
   svg.append(svgEl("text",{x:x+17,y:y+64,"font-size":"28","font-weight":"800",style:"fill:#122f34"},format(v)));
   legend.push([visual.labels[i],colors[i],v]);
  });
  setChartLegend(legend);return true;
 }
 return false;
}

function renderChart(visual){
 if(renderSpecialChart(visual))return;
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
