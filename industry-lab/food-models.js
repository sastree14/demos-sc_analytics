/* SC04 Food & Beverage — 6 sector-specific scenarios.
 * Illustrative deterministic mechanics only. Not a food safety or shelf-life validation.
 * Invented demand, waste, production and refrigeration assumptions.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const serie=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number",other={})=>({type,labels,series,unit,...other});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,formula,insight:formula,limitations,table,warning});
const sum=a=>a.reduce((a,b)=>a+b,0);
const rnd=(v)=>Math.round(v*100)/100;
const clamp=(v,low,high)=>Math.max(low,Math.min(high,v));

export const foodModels={
 fbDemand:{
  title:L("Demanda semanal y capacidad alimentaria","Demanda setmanal i capacitat alimentària","Weekly demand and fulfilment capacity"),
  inputs:[
   f("base","Demanda media diaria","Demanda mitjana diària","Daily average demand",50,2500,25,500),
   f("trend","Crecimiento esperado (%)","Creixement esperat (%)","Expected growth (%)",-20,45,1,8,"pct"),
   f("season","Variación por día (%)","Variació segons el dia (%)","Day-of-week variation (%)",0,65,5,25,"pct"),
   f("promo","Aumento por promoción (%)","Augment per promoció (%)","Promotional uplift (%)",0,90,5,30,"pct"),
   f("promoDay","Día de la promoción","Dia de la promoció","Promotion day",1,7,1,4),
   f("capacity","Unidades diarias disponibles","Unitats diàries disponibles","Daily available units",50,3500,25,600),
   f("uncertainty","Variabilidad ilustrativa (%)","Variabilitat il·lustrativa (%)","Illustrative variation (%)",5,40,5,18,"pct")
  ]
 },
 fbExpiry:{
  title:L("Priorizar lotes próximos a caducar","Prioritzar lots a punt de caducar","Expiry-aware stock rotation"),
  inputs:[
   f("lotA","Unidades lote A","Unitats lot A","Lot A units",50,1100,25,280),
   f("lotB","Unidades lote B","Unitats lot B","Lot B units",50,1100,25,410),
   f("lotC","Unidades lote C","Unitats lot C","Lot C units",50,1100,25,360),
   f("daysA","Días restantes lote A","Dies restants lot A","Days remaining A",1,7,1,2),
   f("daysB","Días restantes lote B","Dies restants lot B","Days remaining B",1,7,1,4),
   f("daysC","Días restantes lote C","Dies restants lot C","Days remaining C",1,7,1,6),
   f("daily","Demanda diaria estimada","Demanda diària estimada","Daily estimated demand",30,500,10,105),
   f("cost","Valor unitario de merma (€)","Valor unitari de minva (€)","Waste cost per unit (€)",1,65,1,9,"eur")
  ]
 },
 fbBatch:{
  title:L("Plan de producción por lotes y merma","Pla de producció per lots i minva","Batch sizing and expected waste"),
  inputs:[
   f("demand","Demanda semanal","Demanda setmanal","Weekly demand",100,3200,50,1550),
   f("stock","Stock disponible","Estoc disponible","Available stock",0,950,50,160),
   f("batch","Tamaño mínimo del lote","Mida mínima del lot","Minimum batch size",25,350,25,175),
   f("capacity","Capacidad máxima de fabricación","Capacitat màxima de fabricació","Maximum production capacity",100,4000,50,2100),
   f("setup","Coste de preparación de lote (€)","Cost de preparació del lot (€)","Setup cost per batch (€)",50,2500,50,450,"eur"),
   f("wastePct","Merma esperada sobre excedente (%)","Minva esperada de l'excedent (%)","Expected waste on leftover (%)",10,100,5,75,"pct"),
   f("wasteCost","Coste unitario de merma (€)","Cost unitari de minva (€)","Waste cost per unit (€)",1,100,1,13,"eur"),
   f("missCost","Coste por demanda no servida (€)","Cost per demanda no servida (€)","Unmet demand cost per unit (€)",10,150,5,55,"eur")
  ]
 },
 fbPromo:{
  title:L("Promociones y riesgo de demanda no servida","Promocions i risc de demanda no atesa","Promotional uplift and unserved demand"),
  inputs:[
   f("normal","Demanda normal del periodo","Demanda normal del període","Normal period demand",100,4000,50,1100),
   f("uplift","Incremento atribuido (supuesto %)","Increment atribuït (supòsit %)","Assumed promotional uplift (%)",0,100,5,40,"pct"),
   f("capacity","Unidades disponibles para venta","Unitats disponibles per vendre","Units available for sale",100,5000,50,1400),
   f("price","Precio habitual (€)","Preu habitual (€)","Usual selling price (€)",5,150,5,45,"eur"),
   f("discount","Descuento de promoción (%)","Descompte de promoció (%)","Promotional discount (%)",0,60,5,20,"pct"),
   f("unitCost","Coste variable por unidad (€)","Cost variable per unitat (€)","Variable unit cost (€)",1,120,1,20,"eur"),
   f("missCost","Coste asumido de ruptura (€)","Cost assumit de ruptura (€)","Assumed stockout penalty (€)",0,80,5,15,"eur")
  ]
 },
 fbColdRoute:{
  title:L("Distribución refrigerada y ventanas de servicio","Distribució refrigerada i finestres de servei","Cold-chain delivery windows and routes"),
  inputs:[
   f("speed","Velocidad media de ruta (km/h)","Velocitat mitjana de ruta (km/h)","Average route speed (km/h)",25,100,5,60),
   f("unload","Descarga por cliente (min)","Descàrrega per client (min)","Unloading time per stop (min)",10,70,5,25,"minutes"),
   f("window","Factor de holgura de entrega (%)","Factor de marge de lliurament (%)","Delivery time allowance (%)",70,160,5,100,"pct"),
   f("kmCost","Coste por km (€)","Cost per km (€)","Cost per kilometre (€)",0.5,4,0.1,1.45,"eur"),
   f("lateCost","Coste por hora de retraso (€)","Cost per hora de retard (€)","Late-delivery penalty per hour (€)",20,450,10,175,"eur"),
   f("maxHours","Límite operativo de ruta (h)","Límit operatiu de ruta (h)","Operating route limit (hours)",2,12,0.5,5,"hours"),
   f("overCost","Penalización por hora excedente (€)","Penalització per hora excedida (€)","Overtime penalty per hour (€)",0,500,20,160,"eur")
  ]
 },
 fbSupply:{
  title:L("Disponibilidad de ingredientes y compra de emergencia","Disponibilitat d'ingredients i compra d'emergència","Ingredient availability and emergency sourcing"),
  inputs:[
   f("plan","Producción prevista (unidades)","Producció prevista (unitats)","Planned production units",100,3500,50,1400),
   f("xPer","Ingrediente X por unidad","Ingredient X per unitat","Ingredient X per unit",1,6,1,2),
   f("yPer","Ingrediente Y por unidad","Ingredient Y per unitat","Ingredient Y per unit",1,6,1,3),
   f("stockX","Inventario ingrediente X","Inventari ingredient X","Ingredient X inventory",100,16000,100,2400),
   f("stockY","Inventario ingrediente Y","Inventari ingredient Y","Ingredient Y inventory",100,16000,100,3900),
   f("delayChance","Riesgo de retraso de reposición (%)","Risc de retard de reposició (%)","Supplier delay probability (%)",0,85,5,35,"pct"),
   f("normalSupply","Entrega prevista de X","Lliurament previst de X","Planned ingredient X delivery",0,8000,100,1400),
   f("emergency","Compra urgente máxima de X","Compra urgent màxima de X","Emergency ingredient X capacity",0,5000,100,1200),
   f("expediteCost","Coste por X urgente (€)","Cost per X urgent (€)","Emergency ingredient X cost (€)",1,45,1,12,"eur"),
   f("shortCost","Coste por unidad no fabricada (€)","Cost per unitat no produïda (€)","Cost per unproduced unit (€)",5,150,5,35,"eur")
  ]
 }
};

function weeklyDemand(p){
 const names=["L","M","X","J","V","S","D"];
 const daily=names.map((_,i)=>{
  const day=i+1;
  const season=1+p.season/100*Math.sin((day-1)*Math.PI/3);
  const uplift=day===p.promoDay?1+p.promo/100:1;
  return p.base*(1+p.trend/100)*season*uplift;
 });
 const served=daily.map(d=>Math.min(p.capacity,d));
 const short=daily.map((d,i)=>Math.max(0,d-served[i]));
 return out([
  m("volume",sum(daily)),m("service",100*sum(served)/Math.max(1,sum(daily)),"pct"),
  m("shortage",sum(short)),m("peak",Math.max(...daily))
 ],vis("line",names,[serie("scenario",daily),serie("capacity",names.map(()=>p.capacity))]),
 "Demanda semanal sintética con tendencia, patrón senoidal y uplift promocional en el día elegido. Se compara con una capacidad diaria fija.",
 "No se ha entrenado ningún modelo con ventas históricas. La variación definida no es un intervalo predictivo calibrado.",
 [["Demanda inferior ilustrativa",rnd(sum(daily)*(1-p.uncertainty/100))],
  ["Demanda superior ilustrativa",rnd(sum(daily)*(1+p.uncertainty/100))],
  ["Días con falta de capacidad",short.filter(v=>v>0).length],
  ["Demanda atendida",rnd(sum(served))]]);
}
function perishableLots(p){
 const stock=[{id:"A",units:p.lotA,expiry:p.daysA,arrival:2},{id:"B",units:p.lotB,expiry:p.daysB,arrival:0},{id:"C",units:p.lotC,expiry:p.daysC,arrival:1}];
 const simulate=(fefo)=>{
  const lots=stock.map(x=>({...x})),expires=Array(7).fill(0);
  let sold=0,missed=0;
  for(let day=1;day<=7;day++){
   const demand=p.daily;
   let need=demand;
   // Lots can still be sold during their final day; remove unconsumed expired quantities after sales.
   const order=[...lots].sort((a,b)=>fefo?a.expiry-b.expiry:a.arrival-b.arrival);
   for(const lot of order){
    if(lot.expiry<day)continue;
    const used=Math.min(need,lot.units);lot.units-=used;need-=used;sold+=used;
    if(need<=0)break;
   }
   missed+=need;
   for(const lot of lots){
    if(lot.expiry===day){expires[day-1]+=lot.units;lot.units=0;}
   }
  }
  return {sold,missed,expired:sum(expires),expires,remaining:sum(lots.map(l=>l.units))};
 };
 const fefo=simulate(true),fifo=simulate(false);
 const improvement=fifo.expired-fefo.expired;
 const priceEffect=improvement*p.cost;
 return out([
  m("service",100*fefo.sold/(7*p.daily),"pct"),m("waste",fefo.expired),
  m("avoidedWaste",improvement),m("delta",priceEffect,"eur")
 ],vis("bar",["FEFO","Orden de llegada"],[serie("waste",[fefo.expired,fifo.expired]),serie("shortage",[fefo.missed,fifo.missed])]),
 "Comparación diaria de rotación por caducidad (FEFO) frente a orden de llegada. Un lote puede venderse hasta su último día de vida simulada; las unidades no vendidas vencen al cierre de ese día.",
 "Las caducidades son plazos hipotéticos, no certificación sanitaria. No incluye seguridad alimentaria, trazabilidad real, temperatura, devoluciones ni decisiones de retirada.",
 [["Merma orden de llegada",fifo.expired],["Merma FEFO",fefo.expired],["Demanda semanal",7*p.daily],["Unidades FEFO sin vender al final",fefo.remaining]],
 improvement<0?"La rotación FEFO no mejora la merma con esta configuración simulada.":"");
}
function batchSizing(p){
 const maxBatches=Math.floor(p.capacity/p.batch);
 const evaluate=n=>{
  const produced=n*p.batch,total=p.stock+produced;
  const unmet=Math.max(0,p.demand-total),excess=Math.max(0,total-p.demand);
  const waste=excess*p.wastePct/100;
  return {n,produced,unmet,excess,waste,cost:n*p.setup+waste*p.wasteCost+unmet*p.missCost};
 };
 let best=evaluate(0);
 for(let n=1;n<=maxBatches;n++){const r=evaluate(n);if(r.cost<best.cost)best=r;}
 const heuristic=evaluate(Math.min(maxBatches,Math.max(0,Math.ceil((p.demand-p.stock)/p.batch))));
 return out([
  m("produced",best.produced),m("shortage",best.unmet),
  m("waste",best.waste),m("delta",heuristic.cost-best.cost,"eur")
 ],vis("bar",["Pedido base","Plan calculado"],[serie("produced",[heuristic.produced,best.produced]),serie("waste",[heuristic.waste,best.waste])]),
 "Se buscan tamaños enteros del lote mínimo bajo capacidad máxima. Coste de cada opción = preparación de lotes + merma esperada del excedente + demanda no servida.",
 "Simplificación de un horizonte semanal con productos homogéneos; no es un plan HACCP, ni incluye fechas de entrega o restricciones de líneas múltiples.",
 [["Lotes programados",best.n],["Coste de plan calculado (€)",rnd(best.cost)],["Coste de plan base (€)",rnd(heuristic.cost)],["Excedente antes de merma",best.excess]]);
}
function promotion(p){
 const promoDemand=p.normal*(1+p.uplift/100);
 const promotedPrice=p.price*(1-p.discount/100);
 const baseServed=Math.min(p.normal,p.capacity),promoServed=Math.min(promoDemand,p.capacity);
 const baseUnserved=p.normal-baseServed,promoUnserved=promoDemand-promoServed;
 const baseContribution=(p.price-p.unitCost)*baseServed-baseUnserved*p.missCost;
 const promoContribution=(promotedPrice-p.unitCost)*promoServed-promoUnserved*p.missCost;
 return out([
  m("service",promoServed/Math.max(1,promoDemand)*100,"pct"),
  m("profit",promoContribution,"eur"),m("shortage",promoUnserved),
  m("delta",promoContribution-baseContribution,"eur")
 ],vis("bar",["Sin promoción","Promoción"],
 [serie("scenario",[p.normal,promoDemand]),serie("actual",[baseServed,promoServed])]),
 "Se compara contribución bajo venta habitual y promoción: unidades atendidas × (precio descontado − coste unitario) menos un coste supuesto por demanda no cubierta.",
 "El uplift promocional es una hipótesis, NO una estimación causal. No incorpora canibalización, elasticidad histórica, inventario multicanal ni reacción de competidores.",
 [["Contribución sin promoción (€)",rnd(baseContribution)],["Contribución con promoción (€)",rnd(promoContribution)],["Precio promocional (€)",rnd(promotedPrice)],["Demanda promocional",rnd(promoDemand)]],
 promoContribution<baseContribution?"La promoción reduce la contribución estimada con estos supuestos.":"");
}
function coldRoutes(p){
 const names=["A","B","C"];
 const dist=[
  [0,30,52,44],
  [30,0,39,30],
  [52,39,0,37],
  [44,30,37,0]
 ];
 const allowed=[2.1,3.2,4.5].map(v=>v*p.window/100);
 const speed=Math.max(1,p.speed),unload=p.unload/60;
 const candidates=[];
 const permutations=[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]];
 for(const order of permutations){
  let from=0,time=0,km=0,late=0;
  const arrivals=[];
  for(const point of order){
   const leg=dist[from][point],hours=leg/speed;
   km+=leg;time+=hours;
   late+=Math.max(0,time-allowed[point-1]);
   arrivals.push({label:names[point-1],arrival:time,due:allowed[point-1],km:leg});
   time+=unload;from=point;
  }
  km+=dist[from][0];time+=dist[from][0]/speed;
  const overtime=Math.max(0,time-p.maxHours);
  const cost=km*p.kmCost+late*p.lateCost+overtime*p.overCost;
  candidates.push({order,arrivals,km,time,late,overtime,cost});
 }
 const best=candidates.reduce((a,b)=>b.cost<a.cost?b:a);
 const baseline=candidates[0];
 return out([
  m("lateHours",best.late,"hours"),m("routeHours",best.time,"hours"),
  m("routeDistance",best.km),m("delta",baseline.cost-best.cost,"eur")
 ],vis("bar",candidates.map(r=>r.order.map(x=>names[x-1]).join("→")),[serie("cost",candidates.map(r=>r.cost))],"eur"),
 "Se enumeran las seis permutaciones de tres entregas con distancias fijas sintéticas y velocidad elegida; se penalizan los retrasos frente a ventanas y superar un límite operativo.",
 "No calcula temperatura de producto, tiempos de exposición térmica ni cumplimiento de cadena de frío. Los trayectos, las ventanas y las distancias no son reales ni sustituyen un TMS.",
 [["Orden sugerido",best.order.map(x=>names[x-1]).join(" → ")],["Coste base (€)",rnd(baseline.cost)],["Coste calculado (€)",rnd(best.cost)],["Horas por encima del límite",rnd(best.overtime)]]);
}
function ingredientSupply(p){
 const normalX=p.stockX+p.normalSupply;
 const delayedX=p.stockX;
 const process=(availableX)=>{
  const baseUnits=Math.min(p.plan,Math.floor(availableX/p.xPer),Math.floor(p.stockY/p.yPer));
  const roomY=Math.max(0,p.stockY/p.yPer-baseUnits);
  const needX=Math.max(0,p.plan-baseUnits)*p.xPer;
  const affordableEmergency=(p.expediteCost*p.xPer)<p.shortCost;
  const emergency=affordableEmergency?Math.min(p.emergency,needX,roomY*p.xPer):0;
  const produced=baseUnits+emergency/p.xPer;
  const missed=Math.max(0,p.plan-produced);
  return {produced,missed,emergency,cost:missed*p.shortCost+emergency*p.expediteCost};
 };
 const normal=process(normalX),delayed=process(delayedX);
 const weight=p.delayChance/100;
 const expected={
  produced:normal.produced*(1-weight)+delayed.produced*weight,
  missed:normal.missed*(1-weight)+delayed.missed*weight,
  emergency:normal.emergency*(1-weight)+delayed.emergency*weight,
  cost:normal.cost*(1-weight)+delayed.cost*weight
 };
 // Expected baseline cost without emergency procurement for both cases.
 const costNoEmergency=()=>{
  const basic=x=>Math.max(0,p.plan-Math.min(p.plan,Math.floor(x/p.xPer),Math.floor(p.stockY/p.yPer)))*p.shortCost;
  return (1-weight)*basic(normalX)+weight*basic(delayedX);
 };
 return out([
  m("service",100*expected.produced/Math.max(1,p.plan),"pct"),
  m("shortage",expected.missed),m("cost",expected.cost,"eur"),
  m("delta",costNoEmergency()-expected.cost,"eur")
 ],vis("bar",["Suministro normal","Con retraso","Promedio ponderado"],
 [serie("produced",[normal.produced,delayed.produced,expected.produced]),
  serie("shortage",[normal.missed,delayed.missed,expected.missed])]),
 "Dos estados hipotéticos de proveedor (entrega puntual o tardía), ponderados por su probabilidad. Se utiliza suministro urgente solo si cuesta menos por unidad producida que el coste de falta y hay ingrediente Y disponible.",
 "No incluye recetas alternativas, calidad del ingrediente, lotes certificados, fecha de caducidad ni condiciones reales de proveedor. El promedio no representa disponibilidad garantizada.",
 [["Ingrediente X urgente esperado",rnd(expected.emergency)],["Coste sin urgencias (€)",rnd(costNoEmergency())],["Escenario puntual: unidades",rnd(normal.produced)],["Escenario retrasado: unidades",rnd(delayed.produced)]],
 expected.missed>0?"No se cubre toda la producción prevista bajo los supuestos de suministro.":"");
}
export const foodCalculators={
 fbDemand:weeklyDemand,
 fbExpiry:perishableLots,
 fbBatch:batchSizing,
 fbPromo:promotion,
 fbColdRoute:coldRoutes,
 fbSupply:ingredientSupply
};
