/* SC01 purpose-built logistics illustrations. These are small deterministic examples
 * illustrating distinct decisions, not full route planning, TMS integration, labour law
 * compliance, carrier quotations, or demonstrated customer savings.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const rnd=(n)=>Math.round(n*100)/100;
const vis=(labels,series,unit="number",type="bar")=>({type,labels,series,unit});
const series=(key,values)=>({key,values:values.map(rnd)});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,insight:formula,formula,limitations:limits,table,warning});
const sum=a=>a.reduce((x,y)=>x+y,0);
export const logisticsModels={
routeMargin:{
 title:L("Margen económico de una ruta","Marge econòmic d'una ruta","Route contribution and margin"),
 inputs:[
 f("km","Kilómetros cargados por servicio","Quilòmetres carregats per servei","Loaded kilometres per service",20,800,10,230),
 f("empty","Kilómetros en vacío respecto a cargados (%)","Quilòmetres en buit respecte als carregats (%)","Empty km as % of loaded km",0,90,5,35,"pct"),
 f("trips","Servicios del periodo","Serveis del període","Services in the period",1,80,1,18),
 f("tariff","Ingreso por servicio (€)","Ingrés per servei (€)","Revenue per service (€)",100,5000,50,900,"eur"),
 f("kmCost","Coste variable por km (€)","Cost variable per km (€)","Variable cost per km (€)",0.3,3,0.1,1.35,"eur"),
 f("wait","Horas de espera por servicio","Hores d'espera per servei","Waiting hours per service",0,9,0.5,1.5),
 f("waitCost","Coste por hora de espera (€)","Cost per hora d'espera (€)","Waiting cost per hour (€)",5,125,5,42,"eur")
]},
backhaul:{
 title:L("Retornos y kilómetros en vacío","Retorns i quilòmetres en buit","Backhauls and empty kilometres"),
 inputs:[
 f("trips","Trayectos ida y vuelta","Trajectes d'anada i tornada","Round trips",5,110,5,42),
 f("outKm","Km de ida cargada","Km d'anada carregada","Loaded outbound km",40,700,10,190),
 f("backKm","Km de retorno","Km de retorn","Return km",40,700,10,190),
 f("loaded","Retornos con carga (%)","Retorns amb càrrega (%)","Loaded backhaul share (%)",0,100,5,25,"pct"),
 f("backRate","Ingreso de retorno por km (€)","Ingrés de retorn per km (€)","Backhaul income per km (€)",0.3,4,0.1,1.8,"eur"),
 f("extraCost","Coste adicional por retorno cargado (€)","Cost addicional per retorn carregat (€)","Extra loaded-backhaul cost (€)",0,250,10,65,"eur")
]},
incident:{
 title:L("Replanificación ante una incidencia","Replanificació davant d'una incidència","Operational disruption and recovery"),
 inputs:[
 f("fleet","Vehículos del plan inicial","Vehicles del pla inicial","Vehicles in original plan",4,35,1,16),
 f("lost","Vehículos no disponibles","Vehicles no disponibles","Unavailable vehicles",0,12,1,3),
 f("capacity","Entregas por vehículo","Lliuraments per vehicle","Deliveries per vehicle",5,25,1,12),
 f("orders","Pedidos comprometidos","Comandes compromeses","Committed orders",30,500,10,200),
 f("rush","Pedidos adicionales urgentes","Comandes addicionals urgents","Urgent additional orders",0,140,10,20),
 f("external","Entregas máximas subcontratables","Lliuraments màxims subcontractables","Outsourcing delivery capacity",0,220,10,60),
 f("externalCost","Coste subcontratado por entrega (€)","Cost subcontractat per lliurament (€)","Outsourced delivery cost (€)",10,170,5,45,"eur"),
 f("missedCost","Coste por entrega no realizada (€)","Cost per lliurament no fet (€)","Unserved delivery cost (€)",20,220,5,95,"eur")
]},
subcontract:{
 title:L("Flota propia frente a colaboración externa","Flota pròpia davant de col·laboració externa","In-house fleet versus external capacity"),
 inputs:[
 f("orders","Entregas necesarias","Lliuraments necessaris","Required deliveries",40,650,10,280),
 f("ownCapacity","Capacidad de flota propia","Capacitat de flota pròpia","Own fleet capacity",0,500,10,180),
 f("ownCost","Coste interno por entrega (€)","Cost intern per lliurament (€)","In-house cost per delivery (€)",10,160,5,42,"eur"),
 f("externalCap","Capacidad externa disponible","Capacitat externa disponible","Available subcontracted capacity",0,350,10,160),
 f("externalCost","Tarifa externa por entrega (€)","Tarifa externa per lliurament (€)","External rate per delivery (€)",10,220,5,72,"eur"),
 f("penalty","Coste de no atender entrega (€)","Cost de no atendre lliurament (€)","Unserved delivery penalty (€)",15,250,5,125,"eur"),
 f("serviceTarget","Objetivo mínimo de servicio (%)","Objectiu mínim de servei (%)","Minimum service target (%)",60,100,5,95,"pct")
]}
};
function routeMargin(p){
 const revenue=p.tariff*p.trips;
 const totalKm=p.trips*p.km*(1+p.empty/100);
 const waitCost=p.trips*p.wait*p.waitCost;
 const travelCost=totalKm*p.kmCost;
 const costs=waitCost+travelCost;
 const contribution=revenue-costs;
 const referenceCost=p.trips*p.km*p.kmCost+waitCost;
 const emptyDistance=p.trips*p.km*p.empty/100;
 return out([
  m("profit",contribution,"eur"),m("margin",revenue?100*contribution/revenue:0,"pct"),
  m("cost",costs,"eur"),m("delta",costs-referenceCost,"eur")
 ],vis(["Tarifa","Kilómetros","Espera"],[series("amount",[revenue,travelCost,waitCost])],"eur"),
 "Los ingresos son servicios × tarifa. Los costes son kilómetros cargados más vacíos × coste por km, más horas de espera. Margen = contribución / ingresos.",
 "No incluye peajes, seguros, depreciación, impuestos, kilometraje real, restricciones de conductores ni contratos. No son márgenes de clientes.",
 [["Kilómetros totales",rnd(totalKm)],["Km en vacío",rnd(emptyDistance)],["Ingresos ilustrativos",rnd(revenue)],["Coste sin km en vacío",rnd(referenceCost)]],
 contribution<0?"El coste calculado supera el ingreso supuesto de las rutas.":"");
}
function backhaul(p){
 const loadedTrips=p.trips*p.loaded/100;
 const loadedKm=loadedTrips*p.backKm;
 const emptyKm=(p.trips-loadedTrips)*p.backKm;
 const extraRevenue=loadedKm*p.backRate;
 const extraCosts=loadedTrips*p.extraCost;
 const contribution=extraRevenue-extraCosts;
 const totalKm=p.trips*(p.outKm+p.backKm);
 return out([
  m("profit",contribution,"eur"),m("service",p.loaded,"pct"),
  m("unserved",emptyKm),m("delta",extraRevenue-extraCosts,"eur")
 ],vis(["Ida","Retorno cargado","Retorno vacío"],[series("actual",[p.trips*p.outKm,loadedKm,emptyKm])],"number"),
 "La carga de retorno genera ingreso adicional por kilómetro y puede generar un coste de manipulación. El trayecto de vuelta se realiza en cualquier caso.",
 "No busca cargas reales, no garantiza disponibilidad de backhauls y no reduce automáticamente kilómetros recorridos: el efecto principal aquí es ingreso adicional por retornos cargados.",
 [["Trayectos con carga de retorno (esperados)",rnd(loadedTrips)],["Kilómetros totales",rnd(totalKm)],["Ingreso de retornos",rnd(extraRevenue)],["Coste adicional de retornos",rnd(extraCosts)]],
 contribution<0?"Según estos supuestos, aceptar retornos cargados destruye contribución.":"");
}
function incident(p){
 const originalCapacity=p.fleet*p.capacity;
 const availableVehicles=Math.max(0,p.fleet-p.lost);
 const demand=p.orders+p.rush,own=Math.min(demand,availableVehicles*p.capacity);
 const gap=demand-own;
 const outsourced=p.externalCost<p.missedCost?Math.min(gap,p.external):0;
 const missed=gap-outsourced;
 const cost=outsourced*p.externalCost+missed*p.missedCost;
 const before=Math.min(demand,originalCapacity)/demand*100;
 const after=(own+outsourced)/demand*100;
 const noActionCost=gap*p.missedCost;
 return out([
  m("service",after,"pct"),m("unserved",missed),m("cost",cost,"eur"),
  m("delta",noActionCost-cost,"eur")
 ],vis(["Plan inicial","Tras incidencia","Con alternativa"],[series("coverage",[before,own/demand*100,after])],"pct"),
 "Se recalcula la capacidad tras perder vehículos. Para demanda no cubierta, se compara coste externo por entrega con el coste supuesto de incumplimiento; se usa capacidad externa solo si mejora el objetivo.",
 "Las pérdidas son independientes y la capacidad por vehículo es uniforme. No hay georrutas, tráfico, ventanas horarias, descansos ni disponibilidad externa real.",
 [["Vehículos útiles",availableVehicles],["Pedidos totales",demand],["Entregas subcontratadas",outsourced],["Entregas que quedan pendientes",missed]],
 missed>0?"El escenario mantiene pedidos sin atender; requiere un plan operativo de contingencia.":"");
}
function subcontract(p){
 const capOwn=Math.min(p.orders,p.ownCapacity),capExt=Math.min(p.orders,p.externalCap);
 const target=Math.ceil(p.orders*p.serviceTarget/100);
 let best=null;
 // Enumerate integer allocation in delivery batches up to 650; cost minimisation
 // with a feasible service target whenever possible.
 const feasibleTarget=Math.min(target,capOwn+capExt);
 for(let own=0;own<=capOwn;own+=1){
  const minExt=Math.max(0,feasibleTarget-own);
  if(minExt>capExt)continue;
  const maxExt=Math.min(capExt,p.orders-own);
  // Linear costs: minimum is reached at one of these endpoints.
  for(const ext of new Set([minExt,maxExt])){
   if(ext<0||ext>maxExt)continue;
   const missed=p.orders-own-ext;
   const cost=own*p.ownCost+ext*p.externalCost+missed*p.penalty;
   if(!best||cost<best.cost)best={own,ext,missed,cost};
  }
 }
 if(!best)best={own:capOwn,ext:0,missed:p.orders-capOwn,cost:capOwn*p.ownCost+(p.orders-capOwn)*p.penalty};
 const baselineOwn=Math.min(p.orders,p.ownCapacity);
 const baselineCost=baselineOwn*p.ownCost+(p.orders-baselineOwn)*p.penalty;
 const served=best.own+best.ext,coverage=100*served/p.orders;
 return out([
  m("service",coverage,"pct"),m("vehicles",best.ext),m("cost",best.cost,"eur"),
  m("delta",baselineCost-best.cost,"eur")
 ],vis(["Propio","Externo","Pendiente"],[series("actual",[best.own,best.ext,best.missed])],"number"),
 "Enumeración de entregas propias y externas para minimizar costes variables e incumplimientos, imponiendo el nivel de servicio alcanzable bajo los límites de capacidad.",
 "No incluye acuerdos con transportistas, disponibilidad por zona, conductor, horarios ni penalizaciones contractuales reales. Son costes unitarios supuestos.",
 [["Entregas con flota propia",best.own],["Entregas externas",best.ext],["Entregas no servidas",best.missed],["Coste plan sin subcontratación",rnd(baselineCost)]],
 served<target?"La capacidad combinada no permite alcanzar el objetivo de servicio indicado.":"");
}
export const logisticsCalculators={routeMargin,backhaul,incident,subcontract};
