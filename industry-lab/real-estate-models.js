/* SC11 Real estate & asset management. Synthetic portfolio-wide analytics.
 * No tenant personal data, rent-collection instructions, eviction or credit
 * suitability scoring. All cash flows, probabilities and values fictional.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,formula,insight:formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=arr=>arr.reduce((a,b)=>a+b,0);
export const realEstateModels={
 reVacancy:{
  title:L("Vacancia esperada y rotación de unidades","Vacància esperada i rotació d'unitats","Vacancy and tenant turnover"),
  inputs:[
   f("units","Unidades del portfolio","Unitats de la cartera","Portfolio units",20,1200,20,240),
   f("occupancy","Ocupación actual (%)","Ocupació actual (%)","Current occupancy (%)",40,100,5,89,"pct"),
   f("turnover","Rotación mensual de ocupadas (%)","Rotació mensual d'ocupades (%)","Monthly turnover among occupied units (%)",0,12,1,3,"pct"),
   f("lease","Contratos nuevos mensuales (unidades)","Contractes nous mensuals (unitats)","New leases signed monthly (units)",0,90,5,15),
   f("rent","Ingreso mensual por unidad ocupada (€)","Ingrés mensual per unitat ocupada (€)","Monthly rent per occupied unit (€)",300,6000,100,1150,"eur"),
   f("opex","Coste mensual por unidad (€)","Cost mensual per unitat (€)","Monthly operating cost per unit (€)",20,850,20,180,"eur"),
   f("vacancyCost","Coste adicional por unidad vacía (€)","Cost addicional per unitat buida (€)","Extra vacant unit expense (€)",0,300,10,75,"eur")
  ]
 },
 reMaintenance:{
  title:L("Incidencias y capacidad de mantenimiento","Incidències i capacitat de manteniment","Maintenance response capacity"),
  inputs:[
   f("tickets","Avisos pendientes de mantenimiento","Avisos pendents de manteniment","Outstanding maintenance jobs",10,320,10,85),
   f("new","Nuevos avisos por semana","Nous avisos per setmana","New maintenance jobs per week",5,160,5,48),
   f("workers","Técnicos disponibles","Tècnics disponibles","Maintenance staff available",1,25,1,6),
   f("hours","Horas por técnico por semana","Hores per tècnic i setmana","Hours per technician-week",10,45,5,35,"hours"),
   f("time","Horas por incidencia","Hores per incidència","Hours per repair job",1,15,1,5,"hours"),
   f("external","Incidencias externalizables/semana","Incidències externalitzables/setmana","Outsourced job capacity per week",0,100,5,25),
   f("costExternal","Precio por incidencia externa (€)","Preu per incidència externa (€)","Outsourced job cost (€)",50,1000,25,240,"eur"),
   f("delayCost","Coste por incidencia pendiente/semana (€)","Cost per incidència pendent/setmana (€)","Penalty per overdue job (€)",10,500,10,120,"eur")
  ]
 },
 reAssets:{
  title:L("NOI y rendimiento de activos","NOI i rendiment dels actius","Asset NOI and unlevered yield"),
  inputs:[
   f("value","Valor ilustrativo del activo base (€)","Valor il·lustratiu de l'actiu base (€)","Illustrative baseline asset value (€)",100000,10000000,100000,2200000,"eur"),
   f("units","Unidades arrendables por activo","Unitats arrendables per actiu","Rentable units per asset",5,220,5,45),
   f("rent","Renta media por unidad/mes (€)","Renda mitjana per unitat/mes (€)","Rent per unit/month (€)",250,8000,50,1450,"eur"),
   f("occupancy","Ocupación media (%)","Ocupació mitjana (%)","Average occupancy (%)",30,100,5,88,"pct"),
   f("opex","Gastos operativos sobre ingreso (%)","Despeses operatives sobre ingrés (%)","Operating expenses as % of revenue (%)",10,65,5,32,"pct"),
   f("maintenance","Reserva anual de mantenimiento (€)","Reserva anual de manteniment (€)","Annual maintenance reserve (€)",0,200000,2500,32000,"eur")
  ]
 },
 reCapex:{
  title:L("Priorización de CAPEX con presupuesto y equipos","Priorització de CAPEX amb pressupost i equips","Capital-project prioritisation under constraints"),
  inputs:[
   f("budget","Presupuesto CAPEX (€)","Pressupost CAPEX (€)","CAPEX budget (€)",20000,600000,10000,220000,"eur"),
   f("team","Horas de equipo disponibles","Hores d'equip disponibles","Available team hours",80,1600,40,650,"hours"),
   f("benefit","Multiplicador de ahorro esperado (%)","Multiplicador d'estalvi esperat (%)","Benefit scenario multiplier (%)",60,150,5,100,"pct"),
   f("risk","Penalización relativa por riesgo (%)","Penalització relativa per risc (%)","Assumed risk adjustment (%)",0,75,5,25,"pct"),
   f("discount","Tipo de descuento anual (%)","Taxa de descompte anual (%)","Annual discount rate (%)",0,20,1,8,"pct"),
   f("years","Horizonte en años","Horitzó en anys","Horizon years",1,8,1,5)
  ]
 },
 reArrears:{
  title:L("Cobros agregados y morosidad de alquileres","Cobraments agregats i impagaments de rendes","Aggregate rent collection scenarios"),
  inputs:[
   f("units","Contratos de alquiler activos","Contractes de lloguer actius","Active rental contracts",20,1400,20,350),
   f("rent","Renta mensual media (€)","Renda mensual mitjana (€)","Mean monthly rent (€)",250,5000,50,1150,"eur"),
   f("late","Cobros retrasados un mes (%)","Cobraments retardats un mes (%)","Receipts delayed one month (%)",0,45,5,14,"pct"),
   f("default","Parte retrasada no recuperable (%)","Part retardada no recuperable (%)","Assumed unrecovered share of delayed rent (%)",0,65,5,12,"pct"),
   f("opex","Gastos operativos mensuales (€)","Despeses operatives mensuals (€)","Monthly operating expenses (€)",5000,200000,5000,70000,"eur"),
   f("opening","Caja inicial (€)","Caixa inicial (€)","Opening cash (€)",0,600000,10000,120000,"eur")
  ]
 },
 reVendors:{
  title:L("Proveedor de mantenimiento, coste y plazo","Proveïdor de manteniment, cost i termini","Maintenance vendors, cost and response"),
  inputs:[
   f("jobs","Trabajos de mantenimiento pendientes","Treballs de manteniment pendents","Outstanding maintenance tasks",20,400,10,135),
   f("capA","Capacidad proveedor A","Capacitat proveïdor A","Vendor A capacity",0,200,10,80),
   f("capB","Capacidad proveedor B","Capacitat proveïdor B","Vendor B capacity",0,200,10,90),
   f("capC","Capacidad proveedor C","Capacitat proveïdor C","Vendor C capacity",0,200,10,65),
   f("costA","Tarifa A (€)","Tarifa A (€)","Vendor A job rate (€)",40,400,10,145,"eur"),
   f("costB","Tarifa B (€)","Tarifa B (€)","Vendor B job rate (€)",40,400,10,175,"eur"),
   f("costC","Tarifa C (€)","Tarifa C (€)","Vendor C job rate (€)",40,400,10,125,"eur"),
   f("reliabilityB","Incidencias de plazo B (%)","Incidències de termini B (%)","Vendor B assumed delay rate (%)",0,75,5,28,"pct"),
   f("delayPenalty","Coste por aviso retrasado (€)","Cost per avís retardat (€)","Late job penalty (€)",10,350,10,90,"eur")
  ]
 }
};
function vacancy(p){
 let occupied=p.units*p.occupancy/100;
 const levels=[],profit=[],vacant=[];
 for(let i=0;i<6;i++){
  occupied=Math.min(p.units,occupied*(1-p.turnover/100)+p.lease);
  const empty=p.units-occupied;
  levels.push(occupied);vacant.push(empty);
  profit.push(occupied*(p.rent-p.opex)-empty*p.vacancyCost);
 }
 const totalNOI=sum(profit);
 return out([
  m("occupancy",occupied/p.units*100,"pct"),m("noi",totalNOI,"eur"),
  m("vacant",p.units-occupied),m("revenue",occupied*p.rent,"eur")
 ],vis("line",levels.map((_,i)=>"M"+(i+1)),[ser("scenario",levels),ser("vacant",vacant)]),
 "La ocupación evoluciona por rotación mensual supuesta y contratos nuevos limitados por inventario. Se calcula margen operativo antes de financiación e impuestos.",
 "No existe forecasting de demanda real ni probabilidades calibradas, ni datos de inquilinos ni revisión de contratos o desahucios.",
 [["Ingresos operativos de seis meses (€)",rnd(totalNOI)],["Último mes: unidades ocupadas",rnd(occupied)],["Unidades vacantes último mes",rnd(p.units-occupied)],["Renta mensual esperada (€)",rnd(occupied*p.rent)]]);
}
function maintenance(p){
 const capacity=p.workers*p.hours/p.time;
 const simulate=extra=>{
  let queue=p.tickets;const levels=[];let outsourced=0;
  for(let i=0;i<5;i++){
   queue+=p.new;
   const inHouse=Math.min(queue,capacity);queue-=inHouse;
   const external=extra?Math.min(queue,p.external):0;
   queue-=external;outsourced+=external;levels.push(queue);
  }
  const cost=queue*p.delayCost+outsourced*p.costExternal;
  return {levels,queue,cost,outsourced};
 };
 const base=simulate(false),ext=simulate(true),best=ext.cost<base.cost?ext:base;
 return out([
  m("backlog",best.queue),m("service",100*(p.tickets+5*p.new-best.queue)/(p.tickets+5*p.new),"pct"),
  m("cost",best.cost,"eur"),m("delta",base.cost-best.cost,"eur")
 ],vis("line",["S1","S2","S3","S4","S5"],[ser("reference",base.levels),ser("scenario",best.levels)]),
 "Cinco semanas de cola de mantenimiento con capacidad propia constante y opción de subcontratación; se elige el plan de menor coste hipotético.",
 "No incluye SLA real, certificaciones técnicas, riesgos eléctricos, reglas laborales, accesos al inmueble ni contratación externa.",
 [["Trabajos externalizados",rnd(best.outsourced)],["Capacidad semanal propia",rnd(capacity)],["Coste sin externalizar (€)",rnd(base.cost)],["Coste con externalización (€)",rnd(ext.cost)]]);
}
function assetNOI(p){
 const factors=[.75,1,1.4],vac=[.95,1,1.05];
 const data=factors.map((x,i)=>{
  const rent=p.units*x*p.rent*12*Math.min(1,p.occupancy/100*vac[i]);
  const annualNOI=rent*(1-p.opex/100)-p.maintenance*x;
  const value=p.value*x;
  return {rent,noi:annualNOI,value,yield:annualNOI/value*100};
 });
 const gross=sum(data.map(x=>x.rent)),noi=sum(data.map(x=>x.noi));
 return out([
  m("revenue",gross,"eur"),m("noi",noi,"eur"),
  m("yield",noi/sum(data.map(x=>x.value))*100,"pct"),m("margin",gross?noi/gross*100:0,"pct")
 ],vis("bar",["Activo A","Activo B","Activo C"],[ser("revenue",data.map(x=>x.rent)),ser("profit",data.map(x=>x.noi))],"eur"),
 "Tres activos sintéticos con tamaño relativo y vacancia distintos. NOI = renta neta de vacancia − gastos operativos − reserva de mantenimiento.",
 "No es una tasación, valoración RICS, retorno con apalancamiento ni recomendación de inversión; los activos y valores son ficticios.",
 [["NOI activo A (€)",rnd(data[0].noi)],["NOI activo B (€)",rnd(data[1].noi)],["NOI activo C (€)",rnd(data[2].noi)],["Valor cartera supuesto (€)",rnd(sum(data.map(x=>x.value)))]]);
}
function capex(p){
 const choices=[
  {name:"Climatización",cost:68000,hours:150,annual:24000,risk:.14},
  {name:"Cubierta",cost:84000,hours:210,annual:31000,risk:.10},
  {name:"Iluminación",cost:39000,hours:110,annual:16000,risk:.05},
  {name:"Ascensores",cost:94000,hours:260,annual:35000,risk:.20},
  {name:"Sensórica",cost:31000,hours:95,annual:12500,risk:.08}
 ];
 const presentAnnuity=Array.from({length:p.years},(_,i)=>1/(1+p.discount/100)**(i+1)).reduce((a,b)=>a+b,0);
 const expected=choice=>choice.annual*p.benefit/100*(1-choice.risk*p.risk/100)*presentAnnuity-choice.cost;
 let best={mask:0,chosen:[],total:0,hours:0,npv:0};
 for(let mask=1;mask<32;mask++){
  const chosen=choices.filter((_,i)=>mask&(1<<i));
  const cost=sum(chosen.map(x=>x.cost)),hours=sum(chosen.map(x=>x.hours));
  const npv=sum(chosen.map(expected));
  if(cost<=p.budget&&hours<=p.team&&npv>best.npv)best={mask,chosen,total:cost,hours,npv};
 }
 return out([
  m("selected",best.chosen.length),m("npv",best.npv,"eur"),
  m("budget",p.budget-best.total,"eur"),m("hours",best.hours,"hours")
 ],vis("bar",choices.map(x=>x.name),[ser("allocation",choices.map(x=>best.chosen.includes(x)?x.cost:0))],"eur"),
 "Búsqueda exacta sobre 32 combinaciones de cinco proyectos, presupuesto y horas. VAN = beneficios anuales ajustados y descontados − CAPEX.",
 "Los ahorros son inventados; no se estiman coste de capital real, riesgos técnicos, licencias, retornos residuales ni tasaciones.",
 [["CAPEX comprometido (€)",rnd(best.total)],["Horas asignadas",best.hours],["Iniciativas seleccionadas",best.chosen.map(x=>x.name).join(", ")||"Ninguna"],["Combinaciones exploradas",32]]);
}
function arrears(p){
 const monthly=p.units*p.rent,delayed=p.late/100,notRecovered=p.default/100;
 let balance=p.opening,carry=0;
 const balances=[],uncollected=[],recovered=[];
 for(let i=0;i<6;i++){
  const lateAmount=monthly*delayed;
  const collectedCurrent=monthly-lateAmount;
  const recoveredPrevious=carry*(1-notRecovered);
  const paid=collectedCurrent+recoveredPrevious;
  const lost=carry*notRecovered;
  carry=lateAmount;
  balance+=paid-p.opex;balances.push(balance);uncollected.push(carry);recovered.push(paid);
 }
 return out([
  m("cash",balance,"eur"),m("arrears",carry,"eur"),
  m("minimum",Math.min(p.opening,...balances),"eur"),
  m("revenue",sum(recovered),"eur")
 ],vis("line",balances.map((_,i)=>"M"+(i+1)),[ser("cash",balances),ser("arrears",uncollected)],"eur"),
 "Seis periodos de cobros agregados, con una proporción retrasada un mes y recuperación parcial del importe previo, descontando gastos operativos.",
 "No existe evaluación ni perfilado de arrendatarios individuales, scoring crediticio, recomendaciones de cobro coercitivo ni tratamientos jurídicos de deuda.",
 [["Renta contractual del periodo (€)",rnd(monthly)],["Cobros agregados en seis meses (€)",rnd(sum(recovered))],["Saldo retrasado al cierre (€)",rnd(carry)],["Gastos operativos seis meses (€)",rnd(p.opex*6)]],
 Math.min(p.opening,...balances)<0?"El escenario presenta caja negativa en algún periodo; revisar financiación y calendarios reales.":"");
}
function vendors(p){
 const caps=[p.capA,p.capB,p.capC],costs=[p.costA,p.costB,p.costC];
 const penalties=[0,p.reliabilityB/100,0].map(x=>x*p.delayPenalty);
 const effective=costs.map((v,i)=>v+penalties[i]);
 const sorted=[0,1,2].sort((a,b)=>effective[a]-effective[b]);
 let remaining=p.jobs;
 const allocation=[0,0,0];
 for(const ix of sorted){const qty=Math.min(remaining,caps[ix]);allocation[ix]=qty;remaining-=qty;}
 const base=Math.min(p.jobs,caps[0])*effective[0]+Math.max(0,p.jobs-caps[0])*p.delayPenalty;
 const cost=sum(allocation.map((v,i)=>v*effective[i]))+remaining*p.delayPenalty;
 return out([
  m("service",sum(allocation)/p.jobs*100,"pct"),
  m("shortage",remaining),m("cost",cost,"eur"),m("delta",base-cost,"eur")
 ],vis("bar",["Proveedor A","Proveedor B","Proveedor C"],[ser("capacity",caps),ser("actual",allocation)]),
 "Asignación secuencial a proveedores según coste unitario y penalización de demora supuesta, respetando cupos de intervención de cada uno.",
 "No contiene datos de empresas reales, competencias certificadas, seguridad de instalaciones, SLA contractual ni validación de proveedores.",
 [["Trabajos asignados A/B/C",allocation.join(" / ")],["Capacidad total ofertada",sum(caps)],["Coste plan de referencia (€)",rnd(base)],["Coste plan calculado (€)",rnd(cost)]],
 remaining>0?"No existe suficiente capacidad ofertada para completar todos los trabajos.":"");
}
export const realEstateCalculators={
 reVacancy:vacancy,reMaintenance:maintenance,reAssets:assetNOI,
 reCapex:capex,reArrears:arrears,reVendors:vendors
};
