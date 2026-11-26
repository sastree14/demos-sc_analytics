/* SC03 Manufacturing | Six distinct and transparent decision models.
 * All schedules, products, equipment and cost assumptions are synthetic.
 * No MES, PLC, SCADA, quality release or real-world operations are affected.
 */
const L=(es,ca,en)=>({es,ca,en});
const field=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const metric=(key,value,unit="number")=>({key,value,unit});
const series=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const chart=(type,labels,series,unit="number",extra={})=>({type,labels,series,unit,...extra});
const output=(metrics,visual,formula,limitations,table=[],warning="")=>({metrics,visual,insight:formula,formula,limitations,table,warning});
const rnd=(v,d=2)=>Math.round(v*10**d)/10**d;
const sum=arr=>arr.reduce((a,b)=>a+b,0);
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

export const manufacturingModels={
 mfSequence:{
  title:L("Programación de órdenes y cambios de línea","Programació d'ordres i canvis de línia","Production sequencing and changeovers"),
  inputs:[
   field("timeA","Horas por orden de familia A","Hores per ordre de família A","Hours per A-family order",2,14,1,6,"hours"),
   field("timeB","Horas por orden de familia B","Hores per ordre de família B","Hours per B-family order",2,14,1,8,"hours"),
   field("changeover","Horas de cambio A/B","Hores de canvi A/B","Changeover hours",0,8,0.5,3,"hours"),
   field("dueGap","Separación entre fechas objetivo (h)","Separació entre dates objectiu (h)","Gap between due times (hours)",4,20,1,10,"hours"),
   field("lateCost","Coste por hora de retraso (€)","Cost per hora de retard (€)","Cost per late hour (€)",20,250,10,85,"eur"),
   field("setupCost","Coste adicional de cambio (€)","Cost addicional de canvi (€)","Additional changeover cost (€)",0,800,25,125,"eur")
  ]
 },
 mfCapacity:{
  title:L("Capacidad de planta y dimensionamiento de turnos","Capacitat de planta i dimensionament de torns","Plant capacity and shift planning"),
  inputs:[
   field("machines","Máquinas disponibles","Màquines disponibles","Available machines",1,18,1,7),
   field("staff","Operarios disponibles","Operaris disponibles","Available operators",1,35,1,13),
   field("staffPerMachine","Operarios por máquina activa","Operaris per màquina activa","Operators per running machine",1,4,1,2),
   field("shifts","Turnos diarios","Torns diaris","Daily shifts",1,3,1,2),
   field("shiftHours","Horas por turno","Hores per torn","Hours per shift",4,12,1,8,"hours"),
   field("oee","Efectividad global supuesta (%)","Efectivitat global suposada (%)","Assumed OEE (%)",45,99,1,81,"pct"),
   field("rate","Unidades por máquina y hora","Unitats per màquina i hora","Units per machine-hour",5,80,5,24),
   field("demand","Unidades comprometidas por día","Unitats compromeses per dia","Committed daily units",80,3000,20,1650),
   field("overtime","Horas extraordinarias por máquina","Hores extraordinàries per màquina","Overtime hours per machine",0,6,0.5,1,"hours"),
   field("hourCost","Coste adicional por hora extra (€)","Cost addicional per hora extra (€)","Extra hour cost (€)",15,180,5,48,"eur")
  ]
 },
 mfMaintenance:{
  title:L("Paradas esperadas y mantenimiento preventivo","Aturades esperades i manteniment preventiu","Downtime and preventive maintenance"),
  inputs:[
   field("assets","Equipos críticos","Equips crítics","Critical assets",2,28,1,12),
   field("failure","Probabilidad de fallo por equipo (%)","Probabilitat de fallada per equip (%)","Failure probability per asset (%)",2,65,1,22,"pct"),
   field("downtime","Horas perdidas por fallo","Hores perdudes per fallada","Downtime per failure (hours)",1,48,1,12,"hours"),
   field("costHour","Coste por hora parada (€)","Cost per hora aturada (€)","Downtime cost per hour (€)",40,3500,40,580,"eur"),
   field("prevent","Coste preventivo por equipo (€)","Cost preventiu per equip (€)","Preventive cost per asset (€)",100,6000,100,1450,"eur"),
   field("efficacy","Reducción de riesgo supuesta (%)","Reducció de risc suposada (%)","Assumed relative risk reduction (%)",10,95,5,70,"pct"),
   field("budget","Presupuesto preventivo (€)","Pressupost preventiu (€)","Prevention budget (€)",0,50000,500,12000,"eur")
  ]
 },
 mfQuality:{
  title:L("Rendimiento, inspección y coste de no calidad","Rendiment, inspecció i cost de no qualitat","Yield, inspection and cost of poor quality"),
  inputs:[
   field("units","Unidades producidas","Unitats produïdes","Units produced",100,12000,100,4000),
   field("defectRate","Tasa de defectos inicial (%)","Taxa inicial de defectes (%)","Initial defect rate (%)",1,28,1,9,"pct"),
   field("improve","Reducción de defectos esperada (%)","Reducció de defectes esperada (%)","Assumed defect reduction (%)",0,80,5,30,"pct"),
   field("sensitivity","Detección de defecto (%)","Detecció de defecte (%)","Defect detection sensitivity (%)",50,99,1,88,"pct"),
   field("falsePositive","Falsos rechazos entre buenos (%)","Rebuigs falsos entre bons (%)","False rejects among good units (%)",0,18,1,4,"pct"),
   field("scrapCost","Coste de un defecto (€)","Cost per defecte (€)","Cost per defective unit (€)",5,300,5,60,"eur"),
   field("rejectCost","Coste por revisión innecesaria (€)","Cost per revisió innecessària (€)","False-reject review cost (€)",1,100,1,12,"eur"),
   field("improveCost","Coste de la intervención (€)","Cost de la intervenció (€)","Intervention cost (€)",0,40000,500,6000,"eur")
  ]
 },
 mfMaterials:{
  title:L("Plan de producción condicionado por materias primas","Pla de producció condicionat per matèries primeres","Bill-of-materials constrained production"),
  inputs:[
   field("ordersA","Demanda de producto A (lotes)","Demanda de producte A (lots)","Product A demand (batches)",10,160,5,95),
   field("ordersB","Demanda de producto B (lotes)","Demanda de producte B (lots)","Product B demand (batches)",10,160,5,90),
   field("materialX","Materia prima X disponible","Matèria primera X disponible","Available material X",100,750,25,355),
   field("materialY","Materia prima Y disponible","Matèria primera Y disponible","Available material Y",100,750,25,350),
   field("profitA","Contribución por lote A (€)","Contribució per lot A (€)","Contribution per A batch (€)",100,2500,50,740,"eur"),
   field("profitB","Contribución por lote B (€)","Contribució per lot B (€)","Contribution per B batch (€)",100,2500,50,980,"eur"),
   field("minShare","Cobertura mínima deseada por familia (%)","Cobertura mínima desitjada per família (%)","Desired minimum coverage per family (%)",0,80,5,35,"pct")
  ]
 },
 mfEnergy:{
  title:L("Coste eléctrico por orden y franja horaria","Cost elèctric per ordre i franja horària","Energy cost by production order and tariff window"),
  inputs:[
   field("units","Unidades a producir","Unitats a produir","Units to produce",100,9000,100,2800),
   field("kwh","Consumo por unidad (kWh)","Consum per unitat (kWh)","Energy per unit (kWh)",0.5,15,0.5,4,"number"),
   field("peakShare","Producción en horario punta (%)","Producció en horari punta (%)","Production during peak tariff (%)",20,90,5,70,"pct"),
   field("peakRate","Tarifa punta (€/kWh)","Tarifa punta (€/kWh)","Peak tariff (€/kWh)",0.1,0.75,0.01,0.33,"eur4"),
   field("offRate","Tarifa valle (€/kWh)","Tarifa vall (€/kWh)","Off-peak tariff (€/kWh)",0.05,0.5,0.01,0.14,"eur4"),
   field("flex","Parte flexible del trabajo en punta (%)","Part flexible de la feina en punta (%)","Flexible share of peak work (%)",0,90,5,45,"pct"),
   field("offCap","Capacidad adicional en valle (kWh)","Capacitat addicional en vall (kWh)","Additional off-peak capacity (kWh)",0,18000,250,5000,"number"),
   field("shiftCost","Sobrecoste por unidad desplazada (€)","Sobrecost per unitat desplaçada (€)","Extra cost per shifted unit (€)",0,5,0.1,0.35,"eur")
  ]
 }
};

function sequence(p){
 // Five orders: due times represent customer commitments; fixed initial order reflects FIFO.
 const jobs=[{id:"01",type:"A",due:1*p.dueGap},
             {id:"02",type:"B",due:2*p.dueGap},
             {id:"03",type:"A",due:3*p.dueGap},
             {id:"04",type:"B",due:4*p.dueGap},
             {id:"05",type:"A",due:5*p.dueGap}];
 const durations={A:p.timeA,B:p.timeB};
 const evaluate=ordered=>{
  let clock=0,late=0,changes=0,prev=null;
  const events=[];
  for(const j of ordered){
   const setup=prev!==null&&prev!==j.type?p.changeover:0;
   if(setup>0){changes++;clock+=setup;}
   const start=clock,finish=clock+durations[j.type];clock=finish;
   late+=Math.max(0,finish-j.due);
   events.push({id:j.id,type:j.type,start,finish,due:j.due,setup});
   prev=j.type;
  }
  return {events,changes,late,finish:clock,
   cost:late*p.lateCost+changes*p.setupCost};
 };
 let best=evaluate(jobs),reference=best;
 const permute=(arr,prefix=[])=>{
  if(arr.length===0){const e=evaluate(prefix);if(e.cost<best.cost)best=e;return;}
  for(let i=0;i<arr.length;i++)permute([...arr.slice(0,i),...arr.slice(i+1)],[...prefix,arr[i]]);
 };
 permute(jobs);
 return output([
  metric("lateness",best.late,"hours"),metric("changeovers",best.changes),
  metric("makespan",best.finish,"hours"),metric("delta",reference.cost-best.cost,"eur")
 ],chart("schedule",best.events.map(e=>e.id),[series("duration",best.events.map(e=>e.finish-e.start))],"hours",
 {events:best.events,referenceEvents:reference.events}),
 "Enumeración exacta de las 120 secuencias de cinco órdenes; coste supuesto = retraso total por hora × penalización + número de cambios × coste de preparación. Se minimiza el coste con fechas objetivo.",
 "Modelo ilustrativo de una máquina y cinco órdenes. No representa prioridades de seguridad, mantenimientos, turnos reales, trazabilidad ni dependencias de fabricación.",
 [["Coste secuencia inicial (€)",rnd(reference.cost)],["Coste secuencia optimizada (€)",rnd(best.cost)],["Secuencia calculada",best.events.map(e=>e.id+"-"+e.type).join(" → ")],["Retraso total secuencia inicial (h)",rnd(reference.late)]]);
}
function plantCapacity(p){
 const active=Math.min(p.machines,Math.floor(p.staff/p.staffPerMachine));
 const baseHours=p.shifts*p.shiftHours;
 const baseOutput=active*baseHours*p.rate*p.oee/100;
 const planned=active*(baseHours+p.overtime)*p.rate*p.oee/100;
 const finished=Math.min(p.demand,planned);
 const shortage=Math.max(0,p.demand-finished);
 const extraCost=active*p.overtime*p.hourCost;
 const utilisation=p.demand>0?Math.min(100,p.demand/Math.max(1,planned)*100):0;
 return output([
  metric("produced",finished),metric("shortage",shortage),
  metric("utilisation",utilisation,"pct"),metric("overtimeCost",extraCost,"eur")
 ],chart("bar",["Demanda","Base","Con horas extra"],
 [series("units",[p.demand,baseOutput,planned])]),
 "Máquinas activas = mínimo entre máquinas disponibles y operadores / dotación requerida (entero). Producción estimada = máquinas activas × horas × unidades/h × OEE.",
 "Supone una tasa y OEE constantes, sin cambios de producto, averías, cualificación, descansos ni disponibilidad real de operarios.",
 [["Máquinas activas",active],["Capacidad sin horas extra",rnd(baseOutput)],["Capacidad con horas extra",rnd(planned)],["Horas extra totales",rnd(active*p.overtime)]],
 active===0?"No hay operarios suficientes para activar ninguna máquina con la dotación indicada.":"");
}
function machineMaintenance(p){
 const max=Math.min(p.assets,Math.floor(p.budget/p.prevent));
 const baseDowntime=p.assets*p.failure/100*p.downtime;
 const evalN=n=>{
  const failures=(p.assets-n)*p.failure/100+n*p.failure/100*(1-p.efficacy/100);
  const down=failures*p.downtime;
  return {n,down,cost:down*p.costHour+n*p.prevent};
 };
 let best=evalN(0);
 const costs=[];
 for(let n=0;n<=max;n++){
  const e=evalN(n);costs.push(e.cost);if(e.cost<best.cost)best=e;
 }
 const baseline=evalN(0);
 return output([
  metric("downtime",best.down,"hours"),metric("prevented",Math.max(0,baseDowntime-best.down),"hours"),
  metric("interventions",best.n),metric("delta",baseline.cost-best.cost,"eur")
 ],chart("line",costs.map((_,i)=>String(i)),[series("cost",costs)],"eur"),
 "Minimización exacta del coste esperado (probabilidad de fallo × horas perdidas × coste de parada + prevención) dentro del presupuesto preventivo.",
 "Las probabilidades son hipotéticas y los fallos se consideran independientes. No es un modelo de mantenimiento predictivo entrenado en sensores reales.",
 [["Coste esperado sin prevención (€)",rnd(baseline.cost)],["Coste esperado escenario (€)",rnd(best.cost)],["Equipos intervenibles con presupuesto",max],["Horas esperadas sin prevención",rnd(baseDowntime)]]);
}
function yieldQuality(p){
 const defectsInitial=p.units*p.defectRate/100;
 const defects=p.units*p.defectRate/100*(1-p.improve/100);
 const good=p.units-defects;
 const detected=defects*p.sensitivity/100;
 const missed=defects-detected;
 const falseReject=good*p.falsePositive/100;
 const scenarioCost=defects*p.scrapCost+falseReject*p.rejectCost+p.improveCost;
 const referenceCost=defectsInitial*p.scrapCost+(p.units-defectsInitial)*p.falsePositive/100*p.rejectCost;
 const yieldPercent=p.units?100*good/p.units:100;
 return output([
  metric("qualityYield",yieldPercent,"pct"),metric("scrap",defects),
  metric("falseReject",falseReject),metric("delta",referenceCost-scenarioCost,"eur")
 ],chart("bar",["Defectos base","Defectos escenario","Detectados","Falsos rechazos"],
 [series("units",[defectsInitial,defects,detected,falseReject])]),
 "Defectos esperados = unidades × tasa inicial × (1 − mejora relativa). La inspección detecta una proporción de defectos, pero también genera rechazos falsos entre piezas buenas. Los costes son supuestos.",
 "No representa control estadístico validado, liberación de lotes, capacidad real del proceso ni trazabilidad clínica/farmacéutica; el rendimiento es un escenario matemático.",
 [["Defectos no detectados (esperados)",rnd(missed)],["Coste base ilustrativo (€)",rnd(referenceCost)],["Coste tras intervención (€)",rnd(scenarioCost)],["Unidades conformes esperadas",rnd(good)]],
 scenarioCost>referenceCost?"La intervención resulta más cara que la referencia con estos supuestos.":"");
}
function materials(p){
 const minimumA=Math.ceil(p.ordersA*p.minShare/100);
 const minimumB=Math.ceil(p.ordersB*p.minShare/100);
 const enoughForMinimum=2*minimumA+minimumB<=p.materialX&&minimumA+3*minimumB<=p.materialY;
 let best=null,baseline=null;
 // BOM: one A batch needs (2 X, 1 Y), one B batch (1 X, 3 Y).
 for(let a=0;a<=p.ordersA;a++)for(let b=0;b<=p.ordersB;b++){
  const x=2*a+b,y=a+3*b;
  if(x>p.materialX||y>p.materialY)continue;
  const feasibleMinimum=(!enoughForMinimum)||(a>=minimumA&&b>=minimumB);
  if(!feasibleMinimum)continue;
  const objective=a*p.profitA+b*p.profitB;
  const candidate={a,b,x,y,objective};
  if(!best||objective>best.objective)best=candidate;
 }
 if(!best)best={a:0,b:0,x:0,y:0,objective:0};
 // Simple comparison uses proportional demand ratio and stops when either material runs out.
 const ratio=Math.min(1,p.materialX/Math.max(1,2*p.ordersA+p.ordersB),p.materialY/Math.max(1,p.ordersA+3*p.ordersB));
 let ra=Math.floor(p.ordersA*ratio),rb=Math.floor(p.ordersB*ratio);
 if(enoughForMinimum&&(ra<minimumA||rb<minimumB)){ra=minimumA;rb=minimumB;}
 baseline={a:ra,b:rb,objective:ra*p.profitA+rb*p.profitB};
 const total=p.ordersA+p.ordersB,achieved=best.a+best.b;
 return output([
  metric("produced",achieved*10),metric("service",total?100*achieved/total:100,"pct"),
  metric("profit",best.objective,"eur"),metric("delta",best.objective-baseline.objective,"eur")
 ],chart("bar",["Familia A","Familia B"],
 [series("target",[p.ordersA,p.ordersB]),series("actual",[best.a,best.b])]),
 "Búsqueda entera de combinación de lotes A/B con una lista de materiales fija: A consume 2 X + 1 Y; B consume 1 X + 3 Y. Maximiza contribución dentro de stock y, si es viable, cobertura mínima por familia.",
 "No incluye plazos de compra, costes fijos, rutas de fabricación, sustitución de materiales ni múltiples recetas. La contribución es supuesta.",
 [["Materia X consumida",best.x],["Materia Y consumida",best.y],["Lotes A",best.a],["Lotes B",best.b]],
 enoughForMinimum?"":"No es viable cumplir la cobertura mínima deseada de ambas familias con los materiales disponibles.");
}
function energyOrders(p){
 const totalEnergy=p.units*p.kwh;
 const peakEnergy=totalEnergy*p.peakShare/100;
 const offEnergy=totalEnergy-peakEnergy;
 const potentialShift=peakEnergy*p.flex/100;
 const tariffBenefit=p.peakRate-p.offRate-p.shiftCost/p.kwh;
 const moved=tariffBenefit>0?Math.max(0,Math.min(potentialShift,p.offCap)):0;
 const costBase=peakEnergy*p.peakRate+offEnergy*p.offRate;
 const shiftUnits=moved/p.kwh;
 const costScenario=(peakEnergy-moved)*p.peakRate+(offEnergy+moved)*p.offRate+shiftUnits*p.shiftCost;
 return output([
  metric("energy",peakEnergy-moved),metric("shiftedKWh",moved),
  metric("cost",costScenario,"eur"),metric("delta",costBase-costScenario,"eur")
 ],chart("bar",["Punta","Valle"],
 [series("reference",[peakEnergy,offEnergy]),series("actual",[peakEnergy-moved,offEnergy+moved])]),
 "Se mueve producción flexible a horas valle si el ahorro marginal en tarifa supera el sobrecoste de reprogramación; se respetan la fracción flexible y el límite de capacidad valle.",
 "No modela potencia instantánea, arranques de línea, contratos eléctricos, calor de proceso, red, límites reales de turnos ni restricciones técnicas de equipos.",
 [["Coste energético base (€)",rnd(costBase)],["Unidades desplazadas",rnd(shiftUnits)],["Energía total (kWh)",rnd(totalEnergy)],["Coste de reprogramación (€)",rnd(shiftUnits*p.shiftCost)]],
 potentialShift>0&&moved===0?"Desplazar producción no resulta económico o no existe capacidad adicional en valle.":"");
}
export const manufacturingCalculators={
 mfSequence:sequence,
 mfCapacity:plantCapacity,
 mfMaintenance:machineMaintenance,
 mfQuality:yieldQuality,
 mfMaterials:materials,
 mfEnergy:energyOrders
};
