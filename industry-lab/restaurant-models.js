/* SC06 Restaurant Groups — six synthetic decision experiences.
 * Operations are illustrative, never a labour-compliant shift scheduler,
 * dietary recommendation, food safety or POS-connected system.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,formula,insight:formula,limitations,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=xs=>xs.reduce((a,b)=>a+b,0),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const labels=["12h","13h","14h","15h","19h","20h","21h","22h"];

export const restaurantModels={
 rsShifts:{
  title:L("Personal por franja y carga de servicio","Personal per franja i càrrega de servei","Hourly service staffing and demand"),
  inputs:[
   f("tickets","Tickets medios por hora","Tiquets mitjans per hora","Average tickets per hour",12,180,4,65),
   f("peak","Incremento en franjas punta (%)","Increment en franges punta (%)","Peak-hour uplift (%)",0,130,5,55,"pct"),
   f("perWorker","Tickets por trabajador/hora","Tiquets per treballador/hora","Tickets per worker-hour",4,25,1,12),
   f("maxWorkers","Máximo de personas por franja","Màxim de persones per franja","Maximum workers per time block",2,25,1,13),
   f("hourlyCost","Coste de persona/hora (€)","Cost de persona/hora (€)","Hourly employee cost (€)",10,65,1,21,"eur"),
   f("unservedCost","Penalización por ticket pendiente (€)","Penalització per tiquet pendent (€)","Cost per unserved ticket (€)",4,90,2,24,"eur")
  ]
 },
 rsPrep:{
  title:L("Mise en place y desperdicio","Mise en place i malbaratament","Prep quantities and food waste"),
  inputs:[
   f("dishA","Demanda prevista plato A","Demanda prevista plat A","Expected dish A demand",20,320,5,135),
   f("dishB","Demanda prevista plato B","Demanda prevista plat B","Expected dish B demand",20,320,5,105),
   f("prepCap","Capacidad máxima de preparación","Capacitat màxima de preparació","Maximum prep units",50,500,10,260),
   f("batch","Lote de preparación (raciones)","Lot de preparació (racions)","Prep batch size (portions)",5,50,5,15),
   f("wasteCost","Coste de ración sobrante (€)","Cost de ració sobrant (€)","Waste cost per leftover portion (€)",1,35,1,6,"eur"),
   f("missCost","Coste de venta perdida (€)","Cost de venda perduda (€)","Lost sale contribution (€)",2,65,1,20,"eur"),
   f("safety","Colchón de preparación (%)","Coixí de preparació (%)","Prep safety buffer (%)",0,50,5,15,"pct")
  ]
 },
 rsStoreProfit:{
  title:L("Rentabilidad de una cartera de locales","Rendibilitat d'una cartera de locals","Profitability across locations"),
  inputs:[
   f("sales","Tickets mensuales por local base","Tiquets mensuals per local base","Monthly tickets in baseline store",300,12000,100,3500),
   f("ticket","Ticket medio (€)","Tiquet mitjà (€)","Average ticket value (€)",6,75,1,24,"eur"),
   f("foodPct","Coste de producto (%)","Cost de producte (%)","Food cost ratio (%)",15,60,1,34,"pct"),
   f("deliveryShare","Ventas por delivery (%)","Vendes per delivery (%)","Delivery sales share (%)",0,90,5,35,"pct"),
   f("commission","Comisión delivery (%)","Comissió delivery (%)","Delivery commission (%)",0,38,1,24,"pct"),
   f("hours","Horas de personal por local/mes","Hores de personal per local/mes","Staff hours per store/month",80,1500,20,500),
   f("wage","Coste horario personal (€)","Cost horari del personal (€)","Staff hourly cost (€)",9,45,1,17,"eur"),
   f("rent","Gastos fijos por local/mes (€)","Despeses fixes per local/mes (€)","Fixed store costs per month (€)",1000,35000,500,6500,"eur")
  ]
 },
 rsMenu:{
  title:L("Precio y contribución de tres platos","Preu i contribució de tres plats","Menu pricing and contribution"),
  inputs:[
   f("basePrice","Precio base plato A (€)","Preu base plat A (€)","Dish A base price (€)",7,50,1,19,"eur"),
   f("costA","Coste plato A (€)","Cost plat A (€)","Dish A variable cost (€)",2,30,1,6,"eur"),
   f("costB","Coste plato B (€)","Cost plat B (€)","Dish B variable cost (€)",2,30,1,8,"eur"),
   f("costC","Coste plato C (€)","Cost plat C (€)","Dish C variable cost (€)",2,30,1,10,"eur"),
   f("demand","Platos A vendidos de referencia","Plats A venuts de referència","Baseline dish A sales",30,900,10,260),
   f("elasticity","Elasticidad supuesta de la demanda","Elasticitat suposada de demanda","Assumed demand elasticity",0.1,3,0.1,1.3),
   f("minVolume","Volumen mínimo deseado (%)","Volum mínim desitjat (%)","Minimum preferred sales volume (%)",50,100,5,75,"pct")
  ]
 },
 rsDelivery:{
  title:L("Picos de pedidos y capacidad de cocina","Pics de comandes i capacitat de cuina","Delivery surge and kitchen throughput"),
  inputs:[
   f("regular","Pedidos sala/hora normal","Comandes sala/hora normal","Normal dine-in orders per hour",10,160,5,50),
   f("delivery","Pedidos delivery/hora normal","Comandes delivery/hora normal","Normal delivery orders per hour",5,140,5,35),
   f("surge","Crecimiento delivery en punta (%)","Creixement delivery en punta (%)","Peak delivery surge (%)",0,180,10,90,"pct"),
   f("kitchen","Capacidad cocina por hora","Capacitat de cuina per hora","Kitchen orders per hour",20,220,5,105),
   f("extra","Capacidad extra por hora","Capacitat extra per hora","Extra throughput capacity per hour",0,120,5,30),
   f("extraCost","Coste de capacidad extra/hora (€)","Cost de capacitat extra/hora (€)","Extra hourly throughput cost (€)",0,700,25,150,"eur"),
   f("missCost","Coste por pedido pendiente (€)","Cost per comanda pendent (€)","Cost per unserved order (€)",2,80,2,23,"eur")
  ]
 },
 rsPurchasing:{
  title:L("Compras compartidas entre restaurantes","Compres compartides entre restaurants","Consolidated multi-location purchasing"),
  inputs:[
   f("need","Demanda semanal grupo (unidades)","Demanda setmanal grup (unitats)","Group weekly demand (units)",150,3500,50,1200),
   f("stock","Stock común disponible","Estoc comú disponible","Available shared inventory",0,1300,50,180),
   f("pack","Unidades por caja","Unitats per caixa","Units per carton",10,120,10,40),
   f("unitCost","Coste por unidad (€)","Cost per unitat (€)","Cost per unit (€)",2,65,1,14,"eur"),
   f("discount","Descuento por pedido consolidado (%)","Descompte per comanda consolidada (%)","Bulk order discount (%)",0,28,1,10,"pct"),
   f("bulkMin","Compra mínima para descuento (unidades)","Compra mínima per descompte (unitats)","Bulk discount threshold (units)",100,3000,50,800),
   f("deliveryCost","Coste de envío por destino (€)","Cost de lliurament per destí (€)","Shipping cost per destination (€)",10,450,10,95,"eur"),
   f("shortCost","Coste por unidad no servida (€)","Cost per unitat no servida (€)","Unserved unit penalty (€)",5,100,5,45,"eur"),
   f("budget","Presupuesto disponible (€)","Pressupost disponible (€)","Available purchase budget (€)",3000,90000,1000,21000,"eur")
  ]
 }
};
function staffing(p){
 const patterns=[1,.95,1.1,1.35,1.15,1.5,1.65,1.05].map(x=>x*(1+p.peak/100*Math.max(0,x-1)));
 const demand=patterns.map(x=>p.tickets*x);
 const plan=[],base=[],costs=[],slots=[];
 for(let i=0;i<demand.length;i++){
  let best=null;
  for(let staff=1;staff<=p.maxWorkers;staff++){
   const short=Math.max(0,demand[i]-staff*p.perWorker),cost=staff*p.hourlyCost+short*p.unservedCost;
   if(!best||cost<best.cost)best={staff,short,cost};
  }
  const refStaff=Math.min(p.maxWorkers,Math.max(1,Math.round(p.tickets/p.perWorker)));
  plan.push(Math.min(demand[i],best.staff*p.perWorker));slots.push(best.staff);
  base.push(Math.min(demand[i],refStaff*p.perWorker));costs.push(best.cost);
 }
 const served=sum(plan),baselineCost=sum(demand.map((d,i)=>base[i]===d?slots[0]*0+Math.max(1,Math.round(p.tickets/p.perWorker))*p.hourlyCost:(d-base[i])*p.unservedCost+Math.max(1,Math.round(p.tickets/p.perWorker))*p.hourlyCost));
 const actualCost=sum(costs);
 return out([
  m("service",served/sum(demand)*100,"pct"),m("unserved",sum(demand)-served),
  m("staff",Math.max(...slots)),m("cost",actualCost,"eur")
 ],vis("line",labels,[ser("target",demand),ser("actual",plan),ser("staffing",slots)]),
 "Para cada franja se enumeran dotaciones enteras posibles y se minimiza el coste laboral más penalización por demanda no atendida. Las cantidades son tickets, no pacientes ni personas.",
 "No constituye cuadrante laboral válido: omite descansos, convenios, habilidades, horas mínimas, rotaciones y dependencias entre franjas.",
 [["Horas-persona calculadas",sum(slots)],["Coste simulado de la jornada (€)",rnd(actualCost)],["Tickets esperados",rnd(sum(demand))],["Tickets atendidos",rnd(served)]],
 sum(demand)-served>0?"La capacidad máxima indicada deja demanda sin atender.":"");
}
function prep(p){
 const desiredA=p.dishA*(1+p.safety/100),desiredB=p.dishB*(1+p.safety/100);
 const batches=Math.floor(p.prepCap/p.batch);
 const score=(a,b)=>{
  const prepA=a*p.batch,prepB=b*p.batch;
  const short=Math.max(0,p.dishA-prepA)+Math.max(0,p.dishB-prepB);
  const waste=Math.max(0,prepA-p.dishA)+Math.max(0,prepB-p.dishB);
  return {a,b,prepA,prepB,short,waste,cost:short*p.missCost+waste*p.wasteCost};
 };
 let best=score(0,0);
 for(let a=0;a<=batches;a++)for(let b=0;b<=batches-a;b++){const x=score(a,b);if(x.cost<best.cost)best=x;}
 const baseA=Math.ceil(desiredA/p.batch),baseB=Math.ceil(desiredB/p.batch);
 const baseline=score(Math.min(batches,baseA),Math.max(0,Math.min(batches-Math.min(batches,baseA),baseB)));
 return out([
  m("produced",best.prepA+best.prepB),m("waste",best.waste),
  m("shortage",best.short),m("delta",baseline.cost-best.cost,"eur")
 ],vis("bar",["Plato A","Plato B"],[ser("target",[p.dishA,p.dishB]),ser("actual",[best.prepA,best.prepB])]),
 "Búsqueda exacta del número de lotes para dos preparaciones con capacidad limitada. Minimiza costes supuestos de raciones sobrantes y demanda no cubierta.",
 "No considera seguridad alimentaria, mermas por caducidad real, recetas, tiempos de preparación ni decisiones sanitarias.",
 [["Lotes de A",best.a],["Lotes de B",best.b],["Coste sin optimizar (€)",rnd(baseline.cost)],["Coste calculado (€)",rnd(best.cost)]]);
}
function storeProfit(p){
 const factors=[.8,1,1.23],rent=[.9,1,1.12],hours=[.9,1,1.15];
 const values=factors.map((x,i)=>{
  const gross=p.sales*x*p.ticket;
  const variable=gross*(p.foodPct/100+p.deliveryShare/100*p.commission/100);
  const fixed=p.hours*hours[i]*p.wage+p.rent*rent[i];
  return {gross,cost:variable+fixed,profit:gross-variable-fixed,margin:gross>0?100*(gross-variable-fixed)/gross:0};
 });
 return out([
  m("revenue",sum(values.map(x=>x.gross)),"eur"),m("profit",sum(values.map(x=>x.profit)),"eur"),
  m("margin",sum(values.map(x=>x.gross))>0?100*sum(values.map(x=>x.profit))/sum(values.map(x=>x.gross)):0,"pct"),
  m("cost",sum(values.map(x=>x.cost)),"eur")
 ],vis("bar",["Local A","Local B","Local C"],[ser("revenue",values.map(x=>x.gross)),ser("profit",values.map(x=>x.profit))],"eur"),
 "Tres locales sintéticos con tamaños de ventas, horas y costes fijos distintos. Contribución = ventas menos producto, comisiones de delivery, personal y costes fijos.",
 "Los factores de tamaño de local son ilustrativos; no sustituye contabilidad por centro, IVA, amortización o alquileres reales.",
 [["Local con menor contribución",["A","B","C"][values.findIndex(x=>x.profit===Math.min(...values.map(y=>y.profit)))]],
  ["Coste total (€)",rnd(sum(values.map(x=>x.cost)))],["Venta total (€)",rnd(sum(values.map(x=>x.gross)))],["Local con margen superior (%)",rnd(Math.max(...values.map(x=>x.margin)))]]); 
}
function menu(p){
 const products=[
  {name:"A",price:p.basePrice,cost:p.costA,volume:p.demand},
  {name:"B",price:p.basePrice*1.18,cost:p.costB,volume:p.demand*.7},
  {name:"C",price:p.basePrice*1.35,cost:p.costC,volume:p.demand*.5}
 ];
 const variants=[-.15,-.1,-.05,0,.05,.1,.15];
 const assess=(prod,pct)=>{
  const price=prod.price*(1+pct);
  const units=prod.volume*Math.pow(price/prod.price,-p.elasticity);
  const net=(price-prod.cost)*units;
  return {price,units,net};
 };
 const picked=products.map(prod=>{
  const original=assess(prod,0);
  let best=original;
  for(const variant of variants){
   const next=assess(prod,variant);
   if(next.units>=prod.volume*p.minVolume/100&&next.net>best.net)best=next;
  }
  return {original,best};
 });
 const revenue=sum(picked.map(x=>x.best.price*x.best.units));
 const profit=sum(picked.map(x=>x.best.net));
 return out([
  m("revenue",revenue,"eur"),m("profit",profit,"eur"),
  m("volume",sum(picked.map(x=>x.best.units))),m("delta",profit-sum(picked.map(x=>x.original.net)),"eur")
 ],vis("bar",products.map(x=>"Plato "+x.name),[ser("reference",picked.map(x=>x.original.net)),ser("scenario",picked.map(x=>x.best.net))],"eur"),
 "Se comparan siete ajustes de precio por plato con demanda de elasticidad constante supuesta; se elige el que maximiza contribución respetando volumen mínimo.",
 "No infiere elasticidades reales ni preferencias, alergias, nutrición, precios regulados, interacción entre platos o reacción de competidores.",
 [["Precio plato A calculado (€)",rnd(picked[0].best.price)],["Precio plato B calculado (€)",rnd(picked[1].best.price)],["Precio plato C calculado (€)",rnd(picked[2].best.price)],["Contribución base (€)",rnd(sum(picked.map(x=>x.original.net)))]]);
}
function delivery(p){
 const base=[.75,.95,1.2,1.4,1.6,1.3,.95,.65],peak=[0,0,0,0,1,1,0,0];
 const arrivals=base.map((x,i)=>p.regular*x+p.delivery*x*(1+peak[i]*p.surge/100));
 const evaluate=useExtra=>{
  let backlog=0,fulfilled=0,peakBack=0;
  const timeline=[];
  for(let i=0;i<8;i++){
   backlog+=arrivals[i];
   const capacity=p.kitchen+(useExtra&&peak[i]?p.extra:0);
   const served=Math.min(backlog,capacity);
   fulfilled+=served;backlog-=served;
   peakBack=Math.max(peakBack,backlog);timeline.push(backlog);
  }
  const cost=backlog*p.missCost+(useExtra?2*p.extraCost:0);
  return {fulfilled,backlog,peakBack,timeline,cost};
 };
 const basePlan=evaluate(false),addPlan=evaluate(true);
 const best=addPlan.cost<basePlan.cost?addPlan:basePlan;
 return out([
  m("service",best.fulfilled/sum(arrivals)*100,"pct"),m("backlog",best.backlog),
  m("cost",best.cost,"eur"),m("delta",basePlan.cost-best.cost,"eur")
 ],vis("line",labels,[ser("reference",basePlan.timeline),ser("scenario",best.timeline)]),
 "Simulación de cola de pedidos por hora, con capacidad de cocina y refuerzo opcional en dos franjas punta. Se elige la opción de menor coste supuesto.",
 "Las órdenes pasan íntegramente de una franja a otra; no modela caducidad, cancelaciones, repartidores, SLAs contractuales ni tiempos de seguridad alimentaria.",
 [["Coste sin refuerzo (€)",rnd(basePlan.cost)],["Coste con refuerzo (€)",rnd(addPlan.cost)],["Pedidos recibidos",rnd(sum(arrivals))],["Máximo de cola",rnd(best.peakBack)]],
 best.backlog>0?"Queda cola sin procesar al cierre de la jornada simulada.":"");
}
function purchasing(p){
 const demand=[.29,.34,.37].map(x=>p.need*x);
 const totalNeed=Math.max(0,p.need-p.stock);
 const pack=p.pack,maximum=Math.floor(p.budget/Math.max(.01,pack*p.unitCost));
 const evaluate=(boxes,central)=>{
  const q=boxes*pack;
  const discount=central&&q>=p.bulkMin?p.discount/100:0;
  const netCost=q*p.unitCost*(1-discount);
  const transported=central?3*p.deliveryCost:sum(demand.map(v=>v>0?p.deliveryCost:0));
  const missed=Math.max(0,totalNeed-q);
  return {boxes,q,cost:netCost+transported+missed*p.shortCost,missed,discount};
 };
 let selected=evaluate(0,true);
 for(let n=1;n<=maximum;n++){
  for(const central of [false,true]){
   const v=evaluate(n,central);
   if(v.q*p.unitCost*(1-v.discount)>p.budget)continue;
   if(v.cost<selected.cost)selected=v;
  }
 }
 const reference=evaluate(Math.min(maximum,Math.ceil(totalNeed/pack)),false);
 return out([
  m("order",selected.q),m("shortage",selected.missed),
  m("cost",selected.cost,"eur"),m("delta",reference.cost-selected.cost,"eur")
 ],vis("bar",["Local A","Local B","Local C"],[ser("target",demand)]),
 "Enumeración de número entero de cajas dentro del presupuesto. Compara compra normal con descuento de consolidación, coste de tres entregas y penalización por falta.",
 "El coste de transporte es simplificado y el stock inicial se considera compartido. No hay transferencias reales, fechas de caducidad ni condiciones comerciales verificadas.",
 [["Cajas compradas",selected.boxes],["Coste de referencia (€)",rnd(reference.cost)],["Descuento aplicado (%)",rnd(selected.discount*100)],["Presupuesto (€)",p.budget]],
 selected.missed>0?"La compra calculada deja una parte de la demanda sin cubrir.":"");
}
export const restaurantCalculators={rsShifts:staffing,rsPrep:prep,rsStoreProfit:storeProfit,rsMenu:menu,rsDelivery:delivery,rsPurchasing:purchasing};
