/* SC10 Construction and installation — synthetic project controls.
 * No site safety certification, procurement order, building-code validation
 * or contractual payment execution. Durations and rates are assumed.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,formula,insight:formula,limitations,table,warning});
const rnd=v=>Math.round(v*100)/100,sum=a=>a.reduce((x,y)=>x+y,0);
export const constructionModels={
 coTimeline:{
  title:L("Ruta crítica, plazos y aceleración de actividades","Ruta crítica, terminis i acceleració d'activitats","Critical path, delays and activity crashing"),
  inputs:[
   f("foundation","Duración fase cimentación (días)","Durada fase fonamentació (dies)","Foundation duration (days)",3,35,1,14),
   f("frame","Duración estructura (días)","Durada estructura (dies)","Structural phase duration",5,50,1,20),
   f("mep","Duración instalaciones (días)","Durada instal·lacions (dies)","MEP installation duration",4,45,1,17),
   f("finish","Duración acabados (días)","Durada acabats (dies)","Finishing duration",4,45,1,18),
   f("inspection","Inspección final (días)","Inspecció final (dies)","Final inspection duration",1,20,1,6),
   f("delay","Retraso de suministro (días)","Retard de subministrament (dies)","Supply delay (days)",0,30,1,8),
   f("due","Plazo objetivo (días)","Termini objectiu (dies)","Target completion (days)",30,145,5,74),
   f("crashCost","Coste por día acelerado (€)","Cost per dia accelerat (€)","Acceleration cost per day (€)",100,3000,100,700,"eur"),
   f("lateCost","Coste por día de retraso (€)","Cost per dia de retard (€)","Penalty per late day (€)",100,6500,100,2500,"eur")
  ]
 },
 coBudget:{
  title:L("Coste proyectado vs presupuesto (valor ganado)","Cost projectat vs pressupost (valor guanyat)","Earned value and cost at completion"),
  inputs:[
   f("budget","Presupuesto aprobado (€)","Pressupost aprovat (€)","Approved budget (€)",20000,2000000,20000,480000,"eur"),
   f("progress","Avance físico real (%)","Progrés físic real (%)","Actual physical progress (%)",5,90,5,45,"pct"),
   f("planned","Avance previsto (%)","Progrés previst (%)","Planned progress (%)",5,95,5,55,"pct"),
   f("spent","Coste real acumulado (€)","Cost real acumulat (€)","Actual cost to date (€)",10000,1500000,10000,260000,"eur"),
   f("risk","Contingencia adicional prevista (%)","Contingència addicional prevista (%)","Additional expected contingency (%)",0,35,5,12,"pct")
  ]
 },
 coCrews:{
  title:L("Asignación de cuadrillas y capacidad semanal","Assignació de quadrilles i capacitat setmanal","Crew allocation and weekly workload"),
  inputs:[
   f("crews","Cuadrillas propias disponibles","Quadrilles pròpies disponibles","In-house crews available",1,20,1,7),
   f("hours","Horas útiles por cuadrilla","Hores útils per quadrilla","Productive hours per crew",20,55,5,40,"hours"),
   f("zoneA","Horas pendientes zona A","Hores pendents zona A","Outstanding hours in zone A",20,550,10,180),
   f("zoneB","Horas pendientes zona B","Hores pendents zona B","Outstanding hours in zone B",20,550,10,140),
   f("zoneC","Horas pendientes zona C","Hores pendents zona C","Outstanding hours in zone C",20,550,10,200),
   f("external","Cuadrillas externas posibles","Quadrilles externes possibles","External crews available",0,12,1,3),
   f("externalCost","Coste extra por cuadrilla (€)","Cost extra per quadrilla (€)","External cost per crew (€)",150,3500,50,850,"eur"),
   f("lateCost","Coste por hora pendiente (€)","Cost per hora pendent (€)","Unserved work-hour penalty (€)",5,150,5,50,"eur")
  ]
 },
 coMaterials:{
  title:L("Material crítico y riesgo de parada de obra","Material crític i risc d'aturada de l'obra","Critical materials and downtime exposure"),
  inputs:[
   f("need","Unidades necesarias esta semana","Unitats necessàries aquesta setmana","Units required this week",40,2500,20,800),
   f("stock","Stock disponible","Estoc disponible","Available stock",0,1800,20,400),
   f("ordered","Pedido previsto","Comanda prevista","Scheduled supplier units",0,1800,20,650),
   f("delayChance","Probabilidad de retraso (%)","Probabilitat de retard (%)","Assumed delivery delay probability (%)",0,85,5,40,"pct"),
   f("buffer","Días de colchón en obra","Dies de marge a obra","Site scheduling buffer (days)",0,12,1,3),
   f("delayDays","Días de retraso de entrega","Dies de retard del lliurament","Supplier delay days",0,18,1,7),
   f("dailyPenalty","Coste de parada por día (€)","Cost d'aturada per dia (€)","Daily downtime cost (€)",100,8000,100,1900,"eur"),
   f("expedite","Coste de alternativa urgente (€)","Cost d'alternativa urgent (€)","Emergency sourcing fee (€)",0,12000,250,3200,"eur")
  ]
 },
 coPartners:{
  title:L("Dependencias de subcontratas y retrabajos","Dependències de subcontractes i retraballs","Subcontractor handoffs and rework risk"),
  inputs:[
   f("workA","Días contratista A","Dies contractista A","Contractor A days",3,35,1,12),
   f("workB","Días contratista B","Dies contractista B","Contractor B days",3,35,1,15),
   f("workC","Días contratista C","Dies contractista C","Contractor C days",3,35,1,11),
   f("handoff","Retraso por coordinación (días/entrega)","Retard per coordinació (dies/entrega)","Handoff delay (days)",0,14,1,4),
   f("reworkChance","Probabilidad de retrabajo (%)","Probabilitat de retraball (%)","Assumed rework probability (%)",0,70,5,30,"pct"),
   f("reworkDays","Duración del retrabajo (días)","Durada del retraball (dies)","Rework duration (days)",1,20,1,6),
   f("coordination","Reducción por coordinación (%)","Reducció per coordinació (%)","Assumed coordination improvement (%)",0,90,5,55,"pct"),
   f("coordCost","Coste del esfuerzo de coordinación (€)","Cost de l'esforç de coordinació (€)","Coordination intervention cost (€)",0,9000,250,1700,"eur"),
   f("dayCost","Coste por día retrasado (€)","Cost per dia retardat (€)","Cost per delayed day (€)",100,5000,100,1200,"eur")
  ]
 },
 coCash:{
  title:L("Caja de obra y pagos condicionados a hitos","Caixa d'obra i pagaments vinculats a fites","Construction cash flow and milestone payments"),
  inputs:[
   f("opening","Caja inicial (€)","Caixa inicial (€)","Opening cash (€)",0,900000,10000,150000,"eur"),
   f("contract","Valor contractual (€)","Valor contractual (€)","Contract value (€)",40000,2500000,20000,780000,"eur"),
   f("margin","Porcentaje total previsto de cobro en seis meses (%)","Percentatge previst de cobrament en sis mesos (%)","Share of contract paid within 6 months (%)",35,100,5,85,"pct"),
   f("retention","Retención contractual (%)","Retenció contractual (%)","Contract retention (%)",0,25,1,7,"pct"),
   f("monthlyCost","Pagos mensuales a personal y proveedores (€)","Pagaments mensuals a personal i proveïdors (€)","Monthly staffing and supplier payments (€)",10000,350000,5000,97000,"eur"),
   f("delay","Porcentaje de cobros retrasados un mes (%)","Percentatge de cobraments retardats un mes (%)","Receipts delayed by one month (%)",0,80,5,25,"pct"),
   f("variation","Variación mensual de costes (%)","Variació mensual de costos (%)","Monthly cost trend (%)",-15,20,1,4,"pct")
  ]
 }
};
function timeline(p){
 // DAG: foundation → structure, structure → installations and finish, both → inspection.
 const plan=crash=>{
  const duration=[p.foundation,p.frame,p.mep,p.finish,p.inspection];
  const x=duration.map((v,i)=>Math.max(1,v-(crash[i]?Math.min(3,v-1):0)));
  const foundation=x[0],frameEnd=foundation+x[1],mepEnd=frameEnd+p.delay+x[2],finEnd=frameEnd+x[3];
  const finish=Math.max(mepEnd,finEnd)+x[4];
  const late=Math.max(0,finish-p.due);
  const crashDays=sum(x.map((v,i)=>duration[i]-v));
  return {finish,late,crashDays,cost:late*p.lateCost+crashDays*p.crashCost,x,
   events:[{id:"01",type:"A",start:0,finish:foundation,due:p.due,setup:0},
   {id:"02",type:"B",start:foundation,finish:frameEnd,due:p.due,setup:0},
   {id:"03",type:"C",start:frameEnd+p.delay,finish:mepEnd,due:p.due,setup:p.delay},
   {id:"04",type:"B",start:frameEnd,finish:finEnd,due:p.due,setup:0},
   {id:"05",type:"A",start:Math.max(mepEnd,finEnd),finish,due:p.due,setup:0}]};
 };
 const base=plan([0,0,0,0,0]);let best=base;
 for(let mask=1;mask<32;mask++){
  const flags=Array.from({length:5},(_,i)=>(mask>>i)&1);
  const attempt=plan(flags);if(attempt.cost<best.cost)best=attempt;
 }
 return out([
  m("lateness",best.late,"number"),m("makespan",best.finish,"number"),
  m("delta",base.cost-best.cost,"eur"),m("interventions",best.crashDays)
 ],vis("schedule",best.events.map(e=>e.id),[ser("duration",best.events.map(e=>e.finish-e.start))],"number",{events:best.events}),
 "Optimización exacta de 32 combinaciones de aceleración limitada (hasta 3 días por actividad) sobre un pequeño grafo de precedencias con dos ramas en paralelo.",
 "La ruta crítica y los retrasos son ilustrativos; no existe programación con recursos y fechas reales, restricciones legales de obra ni certificación técnica.",
 [["Plazo inicial (días)",base.finish],["Plazo calculado (días)",best.finish],["Coste penalización más aceleración (€)",rnd(best.cost)],["Días acelerados",best.crashDays]]);
}
function earnedValue(p){
 const BAC=p.budget,EV=BAC*p.progress/100,PV=BAC*p.planned/100,AC=p.spent;
 const CPI=EV/Math.max(1,AC),SPI=EV/Math.max(1,PV);
 const estimate=AC+(BAC-EV)/Math.max(.1,CPI)*(1+p.risk/100);
 const over=estimate-BAC;
 return out([
  m("profit",BAC-estimate,"eur"),m("cost",estimate,"eur"),
  m("cpi",CPI),m("spi",SPI)
 ],vis("bar",["Planificado","Valor ganado","Coste real"],[ser("amount",[PV,EV,AC])],"eur"),
 "Valor ganado EV = presupuesto × avance real. CPI=EV/AC, SPI=EV/PV. EAC aproxima el coste final reestimando el trabajo restante mediante CPI y contingencia.",
 "No hay certificaciones de avance ni control de costes verificado; EAC es una proyección con hipótesis, no una obligación contractual.",
 [["Coste final estimado (€)",rnd(estimate)],["Desviación frente a presupuesto (€)",rnd(over)],["Valor ganado (€)",rnd(EV)],["Valor previsto (€)",rnd(PV)]],
 over>0?"El coste final estimado supera el presupuesto con estos supuestos.":"");
}
function crews(p){
 const demand=[p.zoneA,p.zoneB,p.zoneC],hours=p.hours;
 const unit=p.lateCost;
 const max=p.crews+p.external;
 let best=null;
 // Enumerate feasible integer crew allocations across three work zones.
 for(let a=0;a<=max;a++)for(let b=0;b<=max-a;b++)for(let c=0;c<=max-a-b;c++){
  const used=a+b+c,extra=Math.max(0,used-p.crews);
  if(extra>p.external)continue;
  const served=[Math.min(p.zoneA,a*hours),Math.min(p.zoneB,b*hours),Math.min(p.zoneC,c*hours)];
  const missed=sum(demand)-sum(served);
  const cost=missed*unit+extra*p.externalCost;
  if(!best||cost<best.cost)best={used,extra,served,missed,cost,crews:[a,b,c]};
 }
 const baseCrews=[0,0,0];
 for(let i=0;i<p.crews;i++)baseCrews[i%3]++;
 const baseServed=baseCrews.map((n,i)=>Math.min(demand[i],n*hours)),baseMissed=sum(demand)-sum(baseServed);
 return out([
  m("service",100*sum(best.served)/sum(demand),"pct"),
  m("shortage",best.missed),m("external",best.extra),m("delta",baseMissed*unit-best.cost,"eur")
 ],vis("bar",["Zona A","Zona B","Zona C"],[ser("target",demand),ser("actual",best.served)]),
 "Enumeración exacta de asignaciones de cuadrillas enteras a tres áreas; se minimiza trabajo pendiente × penalización más coste de refuerzo externo.",
 "Una cuadrilla no se divide ni cambia de zona en el periodo; no incluye especialidades, seguridad, subcontratación legal ni precedencias.",
 [["Cuadrillas A/B/C",best.crews.join(" / ")],["Horas sin cubrir",rnd(best.missed)],["Coste plan calculado (€)",rnd(best.cost)],["Coste reparto uniforme (€)",rnd(baseMissed*unit)]]);
}
function criticalMaterial(p){
 const shortageWith=Math.max(0,p.need-(p.stock+p.ordered));
 const shortageDelay=Math.max(0,p.need-p.stock);
 const penaltyWith=shortageWith>0?p.dailyPenalty*Math.max(0,p.delayDays-p.buffer):0;
 const penaltyDelay=shortageDelay>0?p.dailyPenalty*Math.max(0,p.delayDays-p.buffer):0;
 const risk=p.delayChance/100;
 const expected=penaltyWith*(1-risk)+penaltyDelay*risk;
 const option=Math.min(expected,p.expedite);
 return out([
  m("shortage",shortageWith*(1-risk)+shortageDelay*risk),
  m("cost",option,"eur"),m("delta",expected-option,"eur"),
  m("risk",p.delayChance,"pct")
 ],vis("bar",["Entrega puntual","Entrega tardía"],[ser("shortage",[shortageWith,shortageDelay])]),
 "Dos escenarios de recepción de material y parada por retraso que exceda el colchón; compara coste esperado de paralización con opción de abastecimiento urgente.",
 "La opción urgente no garantiza material, calidad, seguridad ni plazo; no se está asignando stock real ni autorizando compra.",
 [["Coste esperado sin alternativa (€)",rnd(expected)],["Coste alternativo supuesto (€)",p.expedite],["Unidades faltantes si se demora",shortageDelay],["Colchón operativo (días)",p.buffer]],
 option>0?"Revisar disponibilidad de alternativa real antes de adoptar decisiones.":"");
}
function subcontractors(p){
 const baseDuration=p.workA+p.workB+p.workC+2*p.handoff+p.reworkChance/100*p.reworkDays;
 const coordinatedDuration=p.workA+p.workB+p.workC+2*p.handoff*(1-p.coordination/100)+p.reworkChance/100*(1-p.coordination/100)*p.reworkDays;
 const savings=(baseDuration-coordinatedDuration)*p.dayCost-p.coordCost;
 const apply=savings>0;
 const chosenDuration=apply?coordinatedDuration:baseDuration;
 return out([
  m("makespan",chosenDuration),m("delta",Math.max(0,savings),"eur"),
  m("cost",apply?p.coordCost:0,"eur"),m("prevented",baseDuration-chosenDuration,"number")
 ],vis("bar",["Sin coordinación","Con coordinación"],[ser("duration",[baseDuration,coordinatedDuration])],"number"),
 "Cadena de tres paquetes con dos traspasos y retrabajo esperado. La coordinación reduce hipotéticamente demoras y retrabajos, comparando ahorro contra coste de intervención.",
 "No representa responsabilidad de contratistas, prevención de riesgos, ruta crítica compleja, obras reales ni contratos de subcontratación.",
 [["Duración de referencia (días)",rnd(baseDuration)],["Duración con coordinación (días)",rnd(coordinatedDuration)],["Ahorro bruto (€)",rnd((baseDuration-coordinatedDuration)*p.dayCost)],["¿Coordinación seleccionada?",apply?"Sí":"No"]]);
}
function payments(p){
 const weights=[.10,.14,.18,.20,.18,.20];const labels=weights.map((_,i)=>"M"+(i+1));
 const totalReceipts=p.contract*p.margin/100*(1-p.retention/100);
 let balance=p.opening,carry=0;const balances=[],receipts=[],expenses=[];
 for(let i=0;i<6;i++){
  const billed=totalReceipts*weights[i],delayed=billed*p.delay/100;
  const collected=billed-delayed+carry;carry=delayed;
  const paid=p.monthlyCost*Math.pow(1+p.variation/100,i);
  balance+=collected-paid;
  balances.push(balance);receipts.push(collected);expenses.push(paid);
 }
 return out([
  m("cash",balance,"eur"),m("minimum",Math.min(p.opening,...balances),"eur"),
  m("delta",balance-p.opening,"eur"),m("cost",sum(expenses),"eur")
 ],vis("line",labels,[ser("cash",balances),ser("reference",labels.map(()=>p.opening))],"eur"),
 "Caja mensual = caja anterior + cobro de hitos menos porcentaje aplazado + cobros pendientes del mes anterior − pagos operativos. Se retiene un porcentaje contractual supuesto.",
 "No considera impuestos, anticipos, cuentas certificadas, bancos, facturas reales ni cláusulas ejecutables. La retención puede liberarse fuera del horizonte.",
 [["Cobros pendientes al cierre (€)",rnd(carry)],["Ingresos efectivos seis meses (€)",rnd(sum(receipts))],["Retención contractual prevista (€)",rnd(p.contract*p.margin/100*p.retention/100)],["Coste total del periodo (€)",rnd(sum(expenses))]],
 Math.min(p.opening,...balances)<0?"Aparece un saldo de caja negativo en al menos un mes; es una alerta ilustrativa de liquidez.":"");
}
export const constructionCalculators={
 coTimeline:timeline,coBudget:earnedValue,coCrews:crews,
 coMaterials:criticalMaterial,coPartners:subcontractors,coCash:payments
};
