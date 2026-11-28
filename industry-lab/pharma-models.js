/* SC05 Pharmaceutical and chemical manufacturing. ALL records and
 * process parameters are synthetic. No GMP/GxP validation, batch release,
 * compliance certification, manufacturing control or clinical use.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const metric=(key,value,unit="number")=>({key,value,unit});
const series=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number",extra={})=>({type,labels,series,unit,...extra});
const output=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,insight:formula,formula,limitations,table,warning});
const rnd=x=>Math.round(x*100)/100;
const sum=a=>a.reduce((s,x)=>s+x,0);
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const phi=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
const cdf=x=>{const a=1/(1+.2316419*Math.abs(x));const v=1-phi(x)*(.319381530*a-.356563782*a*a+1.781477937*a*a*a-1.821255978*a**4+1.330274429*a**5);return x>=0?v:1-v;};

export const pharmaModels={
 phBatch:{
  title:L("Variación de proceso y rendimiento hipotético","Variació de procés i rendiment hipotètic","Synthetic process variation and yield"),
  inputs:[
   f("lots","Lotes de producción","Lots de producció","Production batches",10,500,10,160),
   f("meanShift","Desviación del proceso respecto al objetivo","Desviació del procés respecte a l'objectiu","Process mean deviation", -3,3,0.1,0.7),
   f("sigma","Desviación típica hipotética","Desviació típica hipotètica","Assumed standard deviation",0.3,3,0.1,1.2),
   f("tolerance","Tolerancia simétrica (unidades)","Tolerància simètrica (unitats)","Symmetric tolerance (units)",0.5,6,0.1,2.3),
   f("reviewCost","Coste de revisión por lote (€)","Cost de revisió per lot (€)","Review cost per batch (€)",30,3000,50,420,"eur"),
   f("scrapCost","Coste de lote fuera de rango (€)","Cost per lot fora de rang (€)","Out-of-range lot cost (€)",500,40000,500,7600,"eur")
  ]
 },
 phRelease:{
  title:L("Capacidad de revisión documental y cola QA","Capacitat de revisió documental i cua QA","QA documentation review throughput"),
  inputs:[
   f("incoming","Lotes recibidos por semana","Lots rebuts per setmana","Batches incoming per week",5,150,5,58),
   f("analysts","Revisores disponibles","Revisors disponibles","Available reviewers",1,18,1,6),
   f("extra","Revisores adicionales","Revisors addicionals","Additional reviewers",0,8,1,2),
   f("hoursWeek","Horas semanales por revisor","Hores setmanals per revisor","Hours per reviewer-week",15,45,5,35,"hours"),
   f("reviewHours","Horas de revisión por lote","Hores de revisió per lot","Review hours per batch",1,16,0.5,4.5,"hours"),
   f("rework","Porcentaje que requiere aclaración (%)","Percentatge que requereix aclariment (%)","Batches requiring clarification (%)",0,60,5,20,"pct"),
   f("reworkHours","Horas adicionales por aclaración","Hores addicionals per aclariment","Extra hours per clarification",1,12,0.5,3,"hours"),
   f("initialBacklog","Cola inicial de lotes","Cua inicial de lots","Starting batch backlog",0,300,10,80),
   f("weekCost","Coste semanal por revisor extra (€)","Cost setmanal per revisor extra (€)","Extra reviewer weekly cost (€)",300,2500,100,950,"eur")
  ]
 },
 phCritical:{
  title:L("Materiales críticos: stock liberado y pendiente","Materials crítics: estoc alliberat i pendent","Critical material stock and release uncertainty"),
  inputs:[
   f("demand","Necesidades de materia por periodo","Necessitats de matèria per període","Material demand per period",100,9000,100,3200),
   f("released","Stock liberado disponible","Estoc alliberat disponible","Available released stock",0,9000,100,1900),
   f("quarantine","Stock pendiente de revisión","Estoc pendent de revisió","Stock awaiting review",0,9000,100,1200),
   f("releaseChance","Fracción hipotética que se liberará (%)","Fracció hipotètica que s'alliberarà (%)","Assumed eventual released share (%)",0,100,5,75,"pct"),
   f("arrival","Suministro programado","Subministrament programat","Scheduled supplier delivery",0,9000,100,1800),
   f("delayChance","Probabilidad de demora del suministro (%)","Probabilitat de demora del subministrament (%)","Assumed supplier delay probability (%)",0,90,5,35,"pct"),
   f("expires","Material liberado que vence (%)","Material alliberat que caduca (%)","Released material expiring (%)",0,50,5,10,"pct"),
   f("missCost","Coste de falta de material (€)","Cost de falta de material (€)","Material shortage cost (€)",1,300,5,55,"eur")
  ]
 },
 phCampaign:{
  title:L("Programación de campañas y limpieza de equipos","Programació de campanyes i neteja d'equips","Campaign scheduling and cleaning"),
  inputs:[
   f("runA","Duración de campaña A (h)","Durada de campanya A (h)","Campaign A duration (hours)",2,35,1,14,"hours"),
   f("runB","Duración de campaña B (h)","Durada de campanya B (h)","Campaign B duration (hours)",2,35,1,20,"hours"),
   f("runC","Duración de campaña C (h)","Durada de campanya C (h)","Campaign C duration (hours)",2,35,1,11,"hours"),
   f("clean","Limpieza por cambio de familia (h)","Neteja per canvi de família (h)","Inter-family cleaning hours",0,16,1,5,"hours"),
   f("qaHold","Espera documental por campaña (h)","Espera documental per campanya (h)","Documentation hold per campaign (hours)",0,15,1,3,"hours"),
   f("dueSpacing","Separación entre fechas objetivo (h)","Separació entre dates objectiu (h)","Gap between campaign due times (hours)",10,40,2,20,"hours"),
   f("lateCost","Coste supuesto por hora de retraso (€)","Cost suposat per hora de retard (€)","Assumed late-hour penalty (€)",20,400,10,160,"eur"),
   f("cleanCost","Coste por cambio de familia (€)","Cost per canvi de família (€)","Cleaning event cost (€)",0,2500,100,600,"eur")
  ]
 },
 phAnomaly:{
  title:L("Tendencias de sensores y alertas para revisión","Tendències de sensors i alertes per revisar","Sensor trends and review alerts"),
  inputs:[
   f("baseline","Valor de referencia del sensor","Valor de referència del sensor","Reference sensor level",20,150,5,70),
   f("sigma","Variación habitual supuesta","Variació habitual suposada","Assumed ordinary variation",1,15,1,4),
   f("drift","Deriva adicional en el periodo","Deriva addicional en el període","Drift during observation window",-25,25,1,7),
   f("threshold","Umbral de alerta (sigmas)","Llindar d'alerta (sigmes)","Alert threshold (sigma units)",1,4,0.25,2),
   f("reviewMin","Minutos por revisión","Minuts per revisió","Minutes per alert review",5,90,5,30,"minutes"),
   f("hourCost","Coste del técnico por hora (€)","Cost del tècnic per hora (€)","Review personnel cost per hour (€)",15,150,5,45,"eur")
  ]
 },
 phTrace:{
  title:L("Trazabilidad documental y excepciones","Traçabilitat documental i excepcions","Document traceability and exceptions"),
  inputs:[
   f("records","Eventos y registros por lote","Esdeveniments i registres per lot","Recorded events per batch",100,12000,100,3500),
   f("missing","Registros con evidencia incompleta (%)","Registres amb evidència incompleta (%)","Incomplete evidence records (%)",0,35,1,12,"pct"),
   f("duplicates","Duplicados esperados (%)","Duplicats esperats (%)","Expected duplicate records (%)",0,20,1,5,"pct"),
   f("match","Resolución por reglas documentales (%)","Resolució amb regles documentals (%)","Rules-based documentary matching (%)",0,85,5,50,"pct"),
   f("mins","Minutos por revisión manual","Minuts per revisió manual","Manual review minutes",2,65,1,18,"minutes"),
   f("hourCost","Coste horario de revisión (€)","Cost horari de revisió (€)","Review cost per hour (€)",15,100,5,43,"eur"),
   f("threshold","Máximo de excepciones para alerta","Màxim d'excepcions per alerta","Outstanding exception alert threshold",0,2500,50,550)
  ]
 }
};

function batchProcess(p){
 const upper=p.tolerance,lower=-upper;
 const pass=clamp(cdf((upper-p.meanShift)/p.sigma)-cdf((lower-p.meanShift)/p.sigma),0,1);
 const baselinePass=clamp(cdf((upper)/p.sigma)-cdf((lower)/p.sigma),0,1);
 const flagged=p.lots*(1-pass),baseFlagged=p.lots*(1-baselinePass);
 const reviewCost=p.lots*p.reviewCost+flagged*p.scrapCost;
 const baselineCost=p.lots*p.reviewCost+baseFlagged*p.scrapCost;
 return output([
   metric("qualityYield",pass*100,"pct"),metric("scrap",flagged),
   metric("cost",reviewCost,"eur"),metric("delta",baselineCost-reviewCost,"eur")
 ],vis("line",["−3σ","−2σ","−1σ","Centro","+1σ","+2σ","+3σ"],
   [series("reference",[-3,-2,-1,0,1,2,3].map(z=>Math.exp(-z*z/2))),
    series("scenario",[-3,-2,-1,0,1,2,3].map(z=>Math.exp(-((z-p.meanShift/p.sigma)**2)/2)))],"number"),
 "Proporción dentro de límites bajo una distribución normal hipotética de media desplazada y desviación estándar supuesta. La comparación utiliza media centrada sin deriva.",
 "No establece especificaciones de un producto real, capacidad validada ni conformidad GxP; las probabilidades son hipotéticas y no autorizan liberar lotes.",
 [["Lotes fuera de rango (esperados)",rnd(flagged)],["Coste si el proceso estuviera centrado (€)",rnd(baselineCost)],["Límite inferior simulado",-upper],["Límite superior simulado",upper]]);
}
function qaRelease(p){
 const effectiveHours=p.reviewHours+p.rework/100*p.reworkHours;
 const capacity=(staff)=>staff*p.hoursWeek/effectiveHours;
 const simulate=(staff)=>{
  let backlog=p.initialBacklog,processed=0;
  const seriesData=[];
  for(let i=0;i<6;i++){
   backlog+=p.incoming;
   const done=Math.min(backlog,capacity(staff));
   backlog-=done;
   processed+=done;seriesData.push(backlog);
  }
  return {backlog,processed,trend:seriesData};
 };
 const ref=simulate(p.analysts),next=simulate(p.analysts+p.extra);
 const backlogCost=Math.max(0,ref.backlog-next.backlog);
 return output([
   metric("backlog",next.backlog),metric("produced",next.processed),
   metric("utilisation",Math.min(100,100*(p.incoming/capacity(p.analysts+p.extra))),"pct"),
   metric("reviewerCost",p.extra*p.weekCost*6,"eur")
 ],vis("line",["S1","S2","S3","S4","S5","S6"],
   [series("reference",ref.trend),series("scenario",next.trend)]),
 "Se simula durante seis semanas una cola documental: entrada de lotes, capacidad en horas por revisor y aclaraciones esperadas. No equivale a aprobar ni liberar un lote.",
 "No incluye prioridades regulatorias, firmas electrónicas, revisión de desviaciones reales, cualificación ni validación GxP. Todo caso requiere revisión humana.",
 [["Cola final sin refuerzo",rnd(ref.backlog)],["Cola final con refuerzo",rnd(next.backlog)],["Lotes menos pendientes",rnd(backlogCost)],["Horas esperadas por lote",rnd(effectiveHours)]]);
}
function criticalMaterials(p){
 const releasedGood=p.released*(1-p.expires/100);
 const expectedReleased=p.quarantine*p.releaseChance/100;
 const timely=releasedGood+expectedReleased+p.arrival;
 const delayed=releasedGood+expectedReleased;
 const normalShort=Math.max(0,p.demand-timely);
 const delayShort=Math.max(0,p.demand-delayed);
 const w=p.delayChance/100;
 const expectedShort=normalShort*(1-w)+delayShort*w;
 const expectedService=100*(p.demand-expectedShort)/p.demand;
 return output([
  metric("service",expectedService,"pct"),metric("shortage",expectedShort),
  metric("cost",expectedShort*p.missCost,"eur"),metric("coverage",p.releaseChance,"pct")
 ],vis("bar",["Con llegada","Con demora"],[series("stock",[timely,delayed]),series("target",[p.demand,p.demand])]),
 "Se ponderan dos estados de proveedor (llega o se demora) y fracción futura hipotéticamente liberable. Todo material pendiente queda bloqueado hasta revisión y liberación humanas.",
 "El porcentaje liberable NO es autorización de uso. No hay trazabilidad real, liberación GxP, calidad de proveedor ni lotes certificados.",
 [["Stock liberado tras vencimiento",rnd(releasedGood)],["Stock pendiente potencialmente liberable",rnd(expectedReleased)],["Falta si llega",rnd(normalShort)],["Falta si se demora",rnd(delayShort)]],
 expectedShort>0?"La planificación muestra faltantes esperados; revisar disponibilidades y autorizaciones reales antes de producir.":"");
}
function campaigns(p){
 const jobs=[{id:"01",type:"A",due:p.dueSpacing},{id:"02",type:"B",due:2*p.dueSpacing},
 {id:"03",type:"A",due:3*p.dueSpacing},{id:"04",type:"C",due:4*p.dueSpacing}];
 const times={A:p.runA,B:p.runB,C:p.runC};
 const evaluate=items=>{
  let clock=0,late=0,changeovers=0,last=null;const events=[];
  for(const job of items){
   const setup=last===null||last===job.type?0:p.clean;
   if(setup>0)changeovers++;
   clock+=setup;
   const start=clock,finish=start+times[job.type]+p.qaHold;
   clock=finish;late+=Math.max(0,finish-job.due);
   events.push({id:job.id,type:job.type,start,finish,due:job.due,setup});
   last=job.type;
  }
  return {events,late,changeovers,finish:clock,cost:late*p.lateCost+changeovers*p.cleanCost};
 };
 const reference=evaluate(jobs);let best=reference;
 const recurse=(rest,prev=[])=>{
  if(rest.length===0){const r=evaluate(prev);if(r.cost<best.cost)best=r;return;}
  for(let i=0;i<rest.length;i++)recurse([...rest.slice(0,i),...rest.slice(i+1)],[...prev,rest[i]]);
 };
 recurse(jobs);
 return output([
   metric("lateness",best.late,"hours"),metric("changeovers",best.changeovers),
   metric("makespan",best.finish,"hours"),metric("delta",reference.cost-best.cost,"eur")
 ],vis("schedule",best.events.map(e=>e.id),
 [series("duration",best.events.map(e=>e.finish-e.start))],"hours",{events:best.events}),
 "Se evalúan exactamente las 24 permutaciones de cuatro campañas, con tiempos de producción, limpieza, espera documental y penalización por retraso.",
 "No es un plan de campañas GxP válido. No representa limpieza validada, segregación, controles de contaminación cruzada ni liberación de producto.",
 [["Coste secuencia de referencia (€)",rnd(reference.cost)],["Coste secuencia elegida (€)",rnd(best.cost)],["Orden seleccionado",best.events.map(e=>e.id+"-"+e.type).join(" → ")],["Horas de retraso de referencia",rnd(reference.late)]]);
}
function sensorAnomaly(p){
 const labels=Array.from({length:12},(_,i)=>"T"+String(i+1));
 const seriesData=labels.map((_,i)=>p.baseline+p.drift*i/11+p.sigma*(.48*Math.sin(i*1.68)+.25*Math.cos(i*.93)));
 const top=p.baseline+p.threshold*p.sigma,bottom=p.baseline-p.threshold*p.sigma;
 const alerts=seriesData.filter(v=>v>top||v<bottom).length;
 const scenarioMean=seriesData.reduce((a,b)=>a+b,0)/seriesData.length;
 const maxDev=Math.max(...seriesData.map(v=>Math.abs(v-p.baseline)/p.sigma));
 const reviewHours=alerts*p.reviewMin/60;
 return output([
   metric("anomalies",alerts),metric("reviewHours",reviewHours,"hours"),
   metric("maxZ",maxDev),metric("cost",reviewHours*p.hourCost,"eur")
 ],vis("line",labels,[series("scenario",seriesData),series("upper",labels.map(()=>top)),series("lower",labels.map(()=>bottom))]),
 "Se calculan doce lecturas sintéticas con deriva y oscilación deterministas; se activan alertas cuando se rebasa el umbral ±n desviaciones estándar supuesto.",
 "Las alertas NO provienen de un detector entrenado ni de sensores reales; no permiten certificar desviaciones ni corregir automáticamente procesos.",
 [["Nivel central de referencia",p.baseline],["Promedio observado sintético",rnd(scenarioMean)],["Límite superior",rnd(top)],["Límite inferior",rnd(bottom)]]);
}
function traceability(p){
 const flagged=p.records*(p.missing/100+p.duplicates/100-p.missing*p.duplicates/10000);
 const auto=flagged*p.match/100;
 const remaining=flagged-auto;
 const before=flagged*p.mins/60,after=remaining*p.mins/60;
 const cost=after*p.hourCost;
 return output([
   metric("exceptions",remaining),metric("hours",after,"hours"),
   metric("coverage",p.match,"pct"),metric("delta",(before-after)*p.hourCost,"eur")
 ],vis("bar",["Sin reglas","Con reglas"],[series("cases",[flagged,remaining])]),
 "Estimación de registros con evidencia incompleta o duplicada, eliminando la intersección esperada. Las reglas reducen la cola documental pero NO validan ni aprueban registros.",
 "No existe integración a LIMS/QMS/ERP, firma electrónica, pista de auditoría certificada ni cumplimiento normativo demostrado.",
 [["Registros a revisar inicialmente",rnd(flagged)],["Excepciones conciliadas con reglas",rnd(auto)],["Coste manual restante (€)",rnd(cost)],["Umbral de alerta",p.threshold]],
 remaining>p.threshold?"El número simulado de excepciones supera el umbral; requiere revisión documental especializada.":"");
}
export const pharmaCalculators={phBatch:batchProcess,phRelease:qaRelease,phCritical:criticalMaterials,
 phCampaign:campaigns,phAnomaly:sensorAnomaly,phTrace:traceability};
