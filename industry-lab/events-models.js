/* SC18 Tourism, leisure and live events — synthetic commercial/operations data.
 * No real ticket inventory, admissions, emergency crowd control, ticket sales,
 * cancellation decision, weather alert or public-safety planning.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const sr=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,formula,insight:formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=a=>a.reduce((v,w)=>v+w,0);
const hours=["16h","17h","18h","19h","20h","21h","22h","23h"];
export const eventsModels={
 evAttendance:{title:L("Asistencia prevista y aforo del evento","Assistència prevista i aforament de l'esdeveniment","Expected attendance and venue capacity"),inputs:[
 f("tickets","Entradas vendidas","Entrades venudes","Tickets already sold",100,40000,250,7500),
 f("capacity","Aforo autorizado ilustrativo","Aforament autoritzat il·lustratiu","Illustrative authorised capacity",500,60000,500,11000),
 f("new","Entradas de última hora esperadas","Entrades d'última hora esperades","Expected late ticket sales",0,25000,250,2200),
 f("refund","Devoluciones y cancelaciones de asistentes (%)","Devolucions i cancel·lacions assistents (%)","Ticket cancellations/refunds (%)",0,40,5,9,"pct"),
 f("noshow","Asistentes con entrada que no llegan (%)","Assistents amb entrada que no arriben (%)","Assumed no-show rate (%)",0,35,5,12,"pct"),
 f("uncertainty","Variación ilustrativa de asistencia (%)","Variació il·lustrativa assistència (%)","Illustrative attendance variability (%)",0,30,5,10,"pct")
 ]},
 evPricing:{title:L("Tarifa por zona y demanda prevista","Tarifa per zona i demanda prevista","Zone ticket prices and expected demand"),inputs:[
 f("capacityA","Aforo zona A","Aforament zona A","Zone A capacity",100,15000,100,2200),
 f("capacityB","Aforo zona B","Aforament zona B","Zone B capacity",100,15000,100,3500),
 f("capacityC","Aforo zona C","Aforament zona C","Zone C capacity",100,20000,100,4700),
 f("price","Precio de referencia zona B (€)","Preu referència zona B (€)","Zone B reference price (€)",15,350,5,65,"eur"),
 f("demand","Demanda base zona B","Demanda base zona B","Zone B baseline demand",100,20000,100,4000),
 f("elasticity","Elasticidad precio hipotética","Elasticitat preu hipotètica","Assumed price elasticity",0.2,3,0.1,1.3),
 f("cost","Coste por entrada validada (€)","Cost per entrada validada (€)","Variable ticket service cost (€)",1,70,1,12,"eur")
 ]},
 evStaff:{title:L("Acomodadores, accesos y tiempos de espera","Acomodadors, accessos i temps d'espera","Event staffing and gate throughput"),inputs:[
 f("attendees","Asistentes previstos","Assistents previstos","Expected visitors",300,40000,500,8500),
 f("peakShare","Fracción en hora punta (%)","Fracció en hora punta (%)","Peak-hour arrival share (%)",20,85,5,55,"pct"),
 f("gates","Puntos de entrada","Punts d'entrada","Entry gates",2,45,1,12),
 f("rate","Atenciones por puerta/hora","Atencions per porta/hora","Processing capacity per gate-hour",50,1200,50,520),
 f("extra","Puertas adicionales disponibles","Portes addicionals disponibles","Extra gates available",0,25,1,5),
 f("cost","Coste adicional por puerta/hora (€)","Cost addicional per porta/hora (€)","Extra gate staffing cost (€)",30,500,10,135,"eur"),
 f("waitCost","Coste de cola por asistente pendiente (€)","Cost de cua per assistent pendent (€)","Assumed unprocessed attendee penalty (€)",1,100,5,25,"eur")
 ]},
 evWeather:{title:L("Riesgo meteorológico y contingencia financiera","Risc meteorològic i contingència financera","Weather disruption and financial contingency"),inputs:[
 f("revenue","Ingresos previstos por evento (€)","Ingressos previstos per esdeveniment (€)","Expected event gross revenue (€)",20000,4000000,20000,550000,"eur"),
 f("fixed","Costes comprometidos (€)","Costos compromesos (€)","Committed event costs (€)",10000,2500000,10000,310000,"eur"),
 f("cancelChance","Probabilidad hipotética de suspensión (%)","Probabilitat hipotètica de suspensió (%)","Assumed cancellation probability (%)",0,70,5,20,"pct"),
 f("refund","Porcentaje de ingresos a reembolsar (%)","Percentatge ingressos a retornar (%)","Refund obligation assumed (%)",0,100,5,85,"pct"),
 f("recover","Coste contratado recuperable (%)","Cost compromès recuperable (%)","Recoverable committed cost (%)",0,75,5,20,"pct"),
 f("insurance","Cobertura neta supuesta del evento (€)","Cobertura neta suposada esdeveniment (€)","Hypothetical insurance recoverable (€)",0,500000,10000,100000,"eur"),
 f("contingency","Coste del plan alternativo (€)","Cost del pla alternatiu (€)","Contingency plan cost (€)",0,300000,5000,35000,"eur"),
 f("riskReduce","Reducción supuesta del riesgo (%)","Reducció suposada del risc (%)","Assumed risk reduction with plan (%)",0,80,5,35,"pct")
 ]},
 evQueue:{title:L("Colas de accesos y restauración","Cues d'accessos i restauració","Entrance and concession queues"),inputs:[
 f("people","Visitantes del evento","Visitants de l'esdeveniment","Event visitors",300,30000,300,7200),
 f("entrance","Proporción que llega en hora punta (%)","Proporció que arriba en hora punta (%)","Peak hour arrivals (%)",20,95,5,60,"pct"),
 f("food","Usuarios que usan restauración (%)","Usuaris que fan servir restauració (%)","Concession take-up (%)",10,90,5,45,"pct"),
 f("gates","Puntos de control de entrada","Punts de control d'entrada","Entry processing lanes",2,45,1,10),
 f("gateRate","Accesos por punto/hora","Accessos per punt/hora","Visitors processed per lane-hour",100,1100,50,550),
 f("stalls","Puestos de servicio disponibles","Punts de servei disponibles","Concession stalls",2,80,2,18),
 f("stallRate","Servicios por puesto/hora","Serveis per punt/hora","Concession orders per stall-hour",20,200,10,75),
 f("extra","Puntos extra a abrir por servicio","Punts extra a obrir per servei","Extra processing lanes per stage",0,15,1,4),
 f("extraCost","Coste abrir puntos extra (€)","Cost obrir punts extra (€)","Cost per additional processing lane (€)",20,900,20,240,"eur")
 ]},
 evProfit:{title:L("Rentabilidad realista por evento","Rendibilitat per esdeveniment","Per-event contribution and break-even"),inputs:[
 f("tickets","Entradas vendidas","Entrades venudes","Paid tickets",100,40000,500,9800),
 f("price","Ingreso medio por entrada (€)","Ingrés mitjà per entrada (€)","Average gross ticket price (€)",10,260,5,72,"eur"),
 f("commission","Comisiones de venta (%)","Comissions de venda (%)","Ticketing commission (%)",0,30,1,9,"pct"),
 f("production","Costes de producción (€)","Costos de producció (€)","Production costs (€)",20000,2400000,20000,360000,"eur"),
 f("staff","Coste del personal (€)","Cost del personal (€)","Staffing expense (€)",2000,600000,5000,65000,"eur"),
 f("venue","Alquiler y servicios recinto (€)","Lloguer i serveis del recinte (€)","Venue hire and facility expense (€)",5000,650000,5000,95000,"eur"),
 f("sponsors","Aportaciones patrocinio (€)","Aportacions patrocini (€)","Assumed sponsorship (€)",0,850000,10000,120000,"eur"),
 f("variable","Coste extra por asistente (€)","Cost extra per assistent (€)","Extra variable cost per guest (€)",0,50,1,10,"eur")
 ]}
};
function attendance(p){
 const sold=Math.min(p.capacity,p.tickets+p.new);
 const expected=Math.min(p.capacity,sold*(1-p.refund/100)*(1-p.noshow/100));
 const lower=expected*(1-p.uncertainty/100),upper=Math.min(p.capacity,expected*(1+p.uncertainty/100));
 return out([
 m("attendance",expected),m("occupancy",100*expected/p.capacity,"pct"),
 m("available",Math.max(0,p.capacity-sold)),m("uncertainty",upper-lower)
 ],vis("bar",["Entradas vendidas","Asistencia estimada","Aforo"],[sr("scenario",[sold,expected,p.capacity])]),
 "Asistencia esperada = entradas distribuidas × (1 − devoluciones) × (1 − no-show), limitada por aforo. Rango ilustrativo no calibrado.",
 "El aforo es un límite inventado para la demo; no representa autorización oficial, seguridad del recinto ni control de admisiones en tiempo real.",
 [["Asistencia inferior estimada",rnd(lower)],["Asistencia superior estimada",rnd(upper)],["Aforo remanente sobre entradas",rnd(p.capacity-sold)],["Entradas estimadas totales",rnd(sold)]]);
}
function pricing(p){
 const capacity=[p.capacityA,p.capacityB,p.capacityC],factors=[1.5,1,0.7],baseDemand=[.7,1,1.5].map(x=>p.demand*x);
 const ratios=[.8,.9,1,1.1,1.2,1.3];
 const chosen=capacity.map((cap,i)=>{
  let best={price:p.price*factors[i],sold:Math.min(cap,baseDemand[i]),contrib:-Infinity};
  for(const q of ratios){
   const price=p.price*factors[i]*q;
   const request=baseDemand[i]*Math.pow(q,-p.elasticity);
   const sold=Math.min(cap,request);
   const contrib=sold*(price-p.cost);
   if(contrib>best.contrib)best={price,sold,contrib};
  }
  return best;
 });
 const baseline=capacity.map((cap,i)=>Math.min(cap,baseDemand[i])*(p.price*factors[i]-p.cost));
 return out([
 m("revenue",sum(chosen.map(x=>x.sold*x.price)),"eur"),
 m("profit",sum(chosen.map(x=>x.contrib)),"eur"),
 m("occupancy",100*sum(chosen.map(x=>x.sold))/sum(capacity),"pct"),
 m("delta",sum(chosen.map(x=>x.contrib))-sum(baseline),"eur")
 ],vis("bar",["Zona A","Zona B","Zona C"],[sr("reference",baseline),sr("scenario",chosen.map(x=>x.contrib))],"eur"),
 "Se buscan seis multiplicadores de precio para cada zona, con elasticidad hipotética y venta limitada por aforo; se maximiza contribución tras coste variable.",
 "No estima demanda observada ni respeta restricciones contractuales o de precios reales; no determina precios finales de venta.",
 [["Tarifa A calculada (€)",rnd(chosen[0].price)],["Tarifa B calculada (€)",rnd(chosen[1].price)],["Tarifa C calculada (€)",rnd(chosen[2].price)],["Asistentes previstos en las tres zonas",rnd(sum(chosen.map(x=>x.sold)))]]);
}
function staffing(p){
 const arrivals=p.attendees*p.peakShare/100;
 const baselineUnserved=Math.max(0,arrivals-p.gates*p.rate);
 const expandedUnserved=Math.max(0,arrivals-(p.gates+p.extra)*p.rate);
 const baseCost=baselineUnserved*p.waitCost,extraCost=expandedUnserved*p.waitCost+p.extra*p.cost;
 const use=extraCost<baseCost,processed=Math.min(arrivals,(p.gates+(use?p.extra:0))*p.rate);
 return out([
 m("service",100*processed/Math.max(1,arrivals),"pct"),m("shortage",Math.max(0,arrivals-processed)),
 m("cost",Math.min(baseCost,extraCost),"eur"),m("delta",baseCost-Math.min(baseCost,extraCost),"eur")
 ],vis("bar",["Solo puertas actuales","Con puertas extra"],[sr("capacity",[p.gates*p.rate,(p.gates+p.extra)*p.rate]),sr("demand",[arrivals,arrivals])]),
 "Se compara capacidad de accesos por hora con concentración de llegadas; se añade personal de acceso si reduce coste ficticio de demanda no procesada.",
 "La simulación no establece seguridad de aforo, controles de evacuación, tiempos de espera observados, dotación legal ni plan de autoprotección.",
 [["Llegadas en hora punta",rnd(arrivals)],["Sin procesar con equipo actual",rnd(baselineUnserved)],["Sin procesar con refuerzo",rnd(expandedUnserved)],["¿Refuerzo seleccionado?",use?"Sí":"No"]]);
}
function weather(p){
 const held=p.revenue-p.fixed;
 const cancelled=p.revenue*(1-p.refund/100)-p.fixed*(1-p.recover/100)+p.insurance;
 const risk=p.cancelChance/100;
 const expected=(1-risk)*held+risk*cancelled;
 const mitigatedRisk=risk*(1-p.riskReduce/100);
 const withPlan=(1-mitigatedRisk)*held+mitigatedRisk*cancelled-p.contingency;
 const selected=Math.max(expected,withPlan);
 return out([
 m("profit",selected,"eur"),m("delta",selected-expected,"eur"),
 m("risk",100*(selected===withPlan?mitigatedRisk:risk),"pct"),
 m("cost",selected===withPlan?p.contingency:0,"eur")
 ],vis("bar",["Sin contingencia","Con contingencia"],[sr("profit",[expected,withPlan])],"eur"),
 "Valor económico esperado = probabilidad de celebración × contribución normal + probabilidad de cancelación × contribución tras reembolsos/recuperaciones y cobertura.",
 "Las probabilidades meteorológicas y póliza de seguros son ficticias. No constituye pronóstico del tiempo, asesoría legal ni decisión de celebrar o suspender un evento.",
 [["Resultado si se celebra (€)",rnd(held)],["Resultado si se suspende (€)",rnd(cancelled)],["Resultado esperado sin plan (€)",rnd(expected)],["Resultado esperado con plan (€)",rnd(withPlan)]],
 selected<0?"El resultado esperado de la alternativa preferida sería negativo bajo estas hipótesis.":"");
}
function queues(p){
 const arrivals=p.people*p.entrance/100,foodDemand=p.people*p.food/100;
 const baselineEntry=Math.max(0,arrivals-p.gates*p.gateRate);
 const baselineFood=Math.max(0,foodDemand-p.stalls*p.stallRate);
 const improvedEntry=Math.max(0,arrivals-(p.gates+p.extra)*p.gateRate);
 const improvedFood=Math.max(0,foodDemand-(p.stalls+p.extra)*p.stallRate);
 const baseCost=(baselineEntry+baselineFood)*25;
 const altCost=(improvedEntry+improvedFood)*25+p.extra*p.extraCost*2;
 const choose=altCost<baseCost,queue=choose?improvedEntry+improvedFood:baselineEntry+baselineFood;
 return out([
 m("backlog",queue),m("service",100*(arrivals+foodDemand-queue)/(arrivals+foodDemand),"pct"),
 m("delta",baseCost-Math.min(baseCost,altCost),"eur"),m("cost",Math.min(baseCost,altCost),"eur")
 ],vis("bar",["Entrada","Restauración"],[sr("reference",[baselineEntry,baselineFood]),sr("scenario",[choose?improvedEntry:baselineEntry,choose?improvedFood:baselineFood])]),
 "Dos cuellos de botella independientes con tasa de procesamiento por hora. Se compara abrir puntos adicionales contra penalización ficticia por visitantes pendientes.",
 "No representa un flujo real de evacuación, seguridad del público, atención sanitaria ni dimensionamiento normativo de accesos.",
 [["Pendientes con configuración actual",rnd(baselineEntry+baselineFood)],["Pendientes si se amplía",rnd(improvedEntry+improvedFood)],["Puntos extra por etapa",choose?p.extra:0],["Coste del plan elegido (€)",rnd(Math.min(baseCost,altCost))]]);
}
function profit(p){
 const tickets=p.tickets*p.price,fees=tickets*p.commission/100;
 const revenue=tickets+p.sponsors,expenses=fees+p.production+p.staff+p.venue+p.tickets*p.variable;
 const result=revenue-expenses;
 const variablePer=p.price*(1-p.commission/100)-p.variable;
 const breakEven=variablePer>0?Math.max(0,Math.ceil((p.production+p.staff+p.venue-p.sponsors)/variablePer)):null;
 return out([
 m("profit",result,"eur"),m("margin",100*result/Math.max(1,revenue),"pct"),
 m("revenue",revenue,"eur"),m("cost",expenses,"eur")
 ],vis("bar",["Taquilla","Patrocinios","Producción","Personal","Recinto"],[
 sr("amount",[tickets,p.sponsors,p.production,p.staff,p.venue])],"eur"),
 "Resultado del evento = taquilla + patrocinio − comisiones − producción − personal − alquiler − coste por asistente. Estima tickets de equilibrio.",
 "No incluye IVA, tasas, liquidación real de entradas, reembolsos, cancelación de artistas, seguros o garantías de rentabilidad.",
 [["Entradas de equilibrio (supuesto)",breakEven??"No alcanzable"],["Comisiones de entradas (€)",rnd(fees)],["Ingresos totales (€)",rnd(revenue)],["Resultado del evento (€)",rnd(result)]],
 result<0?"Con estos supuestos el evento arroja contribución negativa.":"");
}
export const eventsCalculators={evAttendance:attendance,evPricing:pricing,evStaff:staffing,evWeather:weather,evQueue:queues,evProfit:profit};
