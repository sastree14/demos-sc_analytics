/* SC07 Hotels and accommodation — six synthetic, transparent scenarios.
 * Illustrative planning only. No PMS/channel manager connection, live inventory
 * or contract commitments. Never represent values as verified hotel outcomes.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,formula,insight:formula,limitations,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=x=>x.reduce((a,b)=>a+b,0),clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const weekdays=["L","M","X","J","V","S","D"];

export const hotelModels={
 htOccupancy:{
  title:L("Reservas, cancelaciones y ocupación prevista","Reserves, cancel·lacions i ocupació prevista","Bookings, cancellations and expected occupancy"),
  inputs:[
   f("rooms","Habitaciones disponibles","Habitacions disponibles","Available rooms",25,500,5,160),
   f("booked","Reservas existentes por noche","Reserves existents per nit","Existing booked rooms per night",10,500,5,112),
   f("pickup","Captación adicional de reservas (%)","Captació addicional de reserves (%)","Additional booking pickup (%)",0,70,5,18,"pct"),
   f("cancel","Probabilidad de cancelación (%)","Probabilitat de cancel·lació (%)","Cancellation probability (%)",0,45,1,12,"pct"),
   f("noshow","Probabilidad de no presentación (%)","Probabilitat de no presentar-se (%)","No-show probability (%)",0,25,1,4,"pct"),
   f("walkin","Clientes sin reserva esperados/noche","Clients sense reserva esperats/nit","Expected walk-ins per night",0,80,5,12),
   f("adr","Tarifa media por noche (€)","Tarifa mitjana per nit (€)","Average nightly rate (€)",50,500,10,145,"eur")
  ]
 },
 htChannels:{
  title:L("Canal directo vs intermediarios y contribución","Canal directe i intermediació: contribució","Direct versus OTA distribution contribution"),
  inputs:[
   f("rooms","Habitaciones disponibles por noche","Habitacions disponibles per nit","Rooms available per night",30,600,10,160),
   f("nightDemand","Noches-habitación demandadas","Nits-habitació demandades","Room nights demanded",30,700,10,148),
   f("directShare","Cuota de venta directa (%)","Quota de venda directa (%)","Direct-booking share (%)",10,95,5,45,"pct"),
   f("rate","Tarifa media neta de descuento (€)","Tarifa mitjana neta de descompte (€)","Room rate before channel cost (€)",45,600,5,155,"eur"),
   f("otaCommission","Comisión del intermediario (%)","Comissió de l'intermediari (%)","OTA commission (%)",5,40,1,19,"pct"),
   f("directCost","Coste de adquisición directo/estancia (€)","Cost de captació directa/estada (€)","Direct acquisition cost per room (€)",2,90,2,14,"eur"),
   f("serviceCost","Coste variable de habitación (€)","Cost variable d'habitació (€)","Variable room-night cost (€)",5,150,5,38,"eur")
  ]
 },
 htHousekeeping:{
  title:L("Limpieza y disponibilidad de habitaciones","Neteja i disponibilitat d'habitacions","Housekeeping staffing and room readiness"),
  inputs:[
   f("checkout","Habitaciones con check-out diario","Habitacions amb check-out diari","Daily checkouts",15,350,5,115),
   f("stayover","Limpiezas de estancia","Neteges d'estada","Stayover services",0,250,5,75),
   f("minutesOut","Minutos por habitación de salida","Minuts per habitació de sortida","Minutes per checkout room",15,75,5,32,"minutes"),
   f("minutesStay","Minutos por limpieza de estancia","Minuts per neteja d'estada","Minutes per stayover clean",10,65,5,18,"minutes"),
   f("staff","Personal de limpieza","Personal de neteja","Housekeeping staff",1,35,1,10),
   f("shiftHours","Horas efectivas por persona","Hores efectives per persona","Productive hours per staff member",4,9,0.5,7,"hours"),
   f("extraStaff","Personal extra opcional","Personal extra opcional","Optional additional staff",0,12,1,3),
   f("extraCost","Coste extra por persona (€)","Cost extra per persona (€)","Cost per additional worker (€)",40,300,10,120,"eur"),
   f("pendingCost","Coste por habitación no lista (€)","Cost per habitació no preparada (€)","Unready-room cost (€)",10,160,5,65,"eur")
  ]
 },
 htReception:{
  title:L("Esperas en recepción y check-in digital","Esperes a recepció i check-in digital","Front-desk queues and digital check-in"),
  inputs:[
   f("arrivals","Llegadas por hora punta","Arribades per hora punta","Peak arrivals per hour",5,180,5,64),
   f("digitalShare","Porcentaje que usa check-in digital (%)","Percentatge de check-in digital (%)","Digital check-in share (%)",0,80,5,25,"pct"),
   f("serviceRate","Check-ins por empleado/hora","Check-ins per empleat/hora","Front-desk service rate per staff-hour",4,26,1,10),
   f("receptionists","Empleados en recepción","Empleats a recepció","Front-desk staff",1,25,1,6),
   f("extra","Refuerzo de recepción","Reforç de recepció","Extra reception staff",0,10,1,2),
   f("hourCost","Coste por hora de empleado (€)","Cost per hora d'empleat (€)","Hourly employee cost (€)",10,70,2,25,"eur"),
   f("waitingCost","Coste de espera por hora-cliente (€)","Cost d'espera per hora-client (€)","Waiting cost per guest-hour (€)",5,120,5,30,"eur")
  ]
 },
 htEnergy:{
  title:L("Consumo energético según ocupación","Consum energètic segons ocupació","Occupancy-dependent energy cost"),
  inputs:[
   f("rooms","Habitaciones del establecimiento","Habitacions de l'establiment","Rooms in property",30,700,10,190),
   f("occupancy","Ocupación prevista (%)","Ocupació prevista (%)","Expected occupancy (%)",20,100,5,74,"pct"),
   f("baseLoad","Consumo fijo diario (kWh)","Consum fix diari (kWh)","Daily base energy load (kWh)",100,10000,100,1800),
   f("roomLoad","Consumo por habitación ocupada (kWh)","Consum per habitació ocupada (kWh)","Energy per occupied room (kWh)",3,65,1,16),
   f("weather","Impacto de climatización (%)","Impacte de climatització (%)","Assumed HVAC weather impact (%)",-30,80,5,20,"pct"),
   f("tariff","Precio energético (€/kWh)","Preu energètic (€/kWh)","Energy price (€/kWh)",0.05,0.8,0.01,0.22,"eur4"),
   f("efficient","Ahorro en consumo variable (%)","Estalvi en consum variable (%)","Variable-load efficiency gain (%)",0,45,5,18,"pct"),
   f("implement","Coste diario de la medida (€)","Cost diari de la mesura (€)","Daily implementation cost (€)",0,300,10,65,"eur")
  ]
 },
 htGroupBooking:{
  title:L("Aceptar un grupo o preservar demanda individual","Acceptar un grup o preservar demanda individual","Accept group booking versus individual demand"),
  inputs:[
   f("rooms","Habitaciones totales del hotel","Habitacions totals de l'hotel","Total available rooms",30,500,10,150),
   f("group","Habitaciones solicitadas por grupo","Habitacions sol·licitades pel grup","Group room request",10,250,5,65),
   f("nights","Noches de la reserva de grupo","Nits de la reserva de grup","Group nights",1,7,1,3),
   f("groupRate","Precio pactado por grupo/noche (€)","Preu pactat per grup/nit (€)","Agreed group room-night rate (€)",35,350,5,105,"eur"),
   f("individualRate","Precio público esperado/noche (€)","Preu públic esperat/nit (€)","Expected retail nightly rate (€)",55,600,5,170,"eur"),
   f("retailDemand","Demanda individual esperada (habit./noche)","Demanda individual esperada (hab./nit)","Expected retail rooms per night",20,500,10,115),
   f("groupCancel","Probabilidad de cancelación grupo (%)","Probabilitat de cancel·lació grup (%)","Group cancellation probability (%)",0,55,5,15,"pct"),
   f("individualCost","Coste variable por estancia/noche (€)","Cost variable per estada/nit (€)","Room variable cost per night (€)",5,130,5,38,"eur"),
   f("groupPenalty","Penalización por no show grupal (€)","Penalització per no presentació grupal (€)","Group cancellation assumed penalty (€)",0,8000,250,1500,"eur")
  ]
 }
};
function occupancy(p){
 const pattern=[.91,.96,1,1.06,1.15,1.18,.98];
 const demand=pattern.map(v=>p.booked*v*(1+p.pickup/100));
 const expected=demand.map(x=>Math.min(p.rooms,x*(1-p.cancel/100)*(1-p.noshow/100)+p.walkin));
 const risk=demand.map(x=>Math.max(0,x-p.rooms));
 return out([
  m("occupancy",sum(expected)/(7*p.rooms)*100,"pct"),
  m("revenue",sum(expected)*p.adr,"eur"),
  m("unserved",sum(risk)),m("volume",sum(expected))
 ],vis("line",weekdays,[ser("scenario",expected),ser("capacity",weekdays.map(()=>p.rooms))]),
 "Reservas sintéticas por día, pickup, cancelaciones, no-shows y clientes sin reserva. Se limita la ocupación al inventario disponible de habitaciones.",
 "Las probabilidades son supuestas; no se calcula sobreventa óptima ni se conecta a un PMS. La ocupación esperada no es garantía de reservas o ingresos.",
 [["Habitaciones-noche disponibles",p.rooms*7],["Noches-habitación ocupadas previstas",rnd(sum(expected))],["Reserva potencial sobre capacidad",rnd(sum(risk))],["Ingreso medio diario (€)",rnd(sum(expected)*p.adr/7)]]);
}
function channels(p){
 const booked=Math.min(p.rooms,p.nightDemand),direct=booked*p.directShare/100,ota=booked-direct;
 const directContribution=direct*(p.rate-p.serviceCost-p.directCost);
 const otaContribution=ota*(p.rate*(1-p.otaCommission/100)-p.serviceCost);
 const gross=booked*p.rate,contribution=directContribution+otaContribution;
 return out([
  m("revpar",gross/p.rooms,"eur"),m("revenue",gross,"eur"),
  m("profit",contribution,"eur"),m("margin",gross?contribution/gross*100:0,"pct")
 ],vis("bar",["Directo","Intermediado"],[ser("revenue",[direct*p.rate,ota*p.rate]),ser("profit",[directContribution,otaContribution])],"eur"),
 "Contribución por canal = noches vendidas × tarifa, menos coste variable, comisión de OTA o coste de adquisición directo. RevPAR = ingreso de alojamiento / habitaciones disponibles.",
 "No se atribuye causalmente demanda al canal ni se modela desplazamiento de ventas, contratos de distribución o paridad tarifaria.",
 [["Habitaciones-noche vendidas",rnd(booked)],["Noches directas",rnd(direct)],["Noches intermediadas",rnd(ota)],["Comisión de intermediación (€)",rnd(ota*p.rate*p.otaCommission/100)]]);
}
function cleaning(p){
 const demandMinutes=p.checkout*p.minutesOut+p.stayover*p.minutesStay;
 const baseCapacity=p.staff*p.shiftHours*60;
 const extraCapacity=p.extraStaff*p.shiftHours*60;
 const referenceUnready=Math.max(0,demandMinutes-baseCapacity)/p.minutesOut;
 const withExtraUnready=Math.max(0,demandMinutes-baseCapacity-extraCapacity)/p.minutesOut;
 const baseCost=referenceUnready*p.pendingCost;
 const extraCost=withExtraUnready*p.pendingCost+p.extraStaff*p.extraCost;
 const useExtra=extraCost<baseCost;
 const unready=useExtra?withExtraUnready:referenceUnready;
 const capacity=(useExtra?baseCapacity+extraCapacity:baseCapacity)/Math.max(1,demandMinutes);
 return out([
  m("service",Math.min(100,capacity*100),"pct"),
  m("unserved",unready),m("cost",Math.min(baseCost,extraCost),"eur"),
  m("delta",baseCost-Math.min(baseCost,extraCost),"eur")
 ],vis("bar",["Trabajo requerido","Personal actual","Con refuerzo"],
 [ser("hours",[demandMinutes/60,baseCapacity/60,(baseCapacity+extraCapacity)/60])],"hours"),
 "Convierte salidas y estancias en minutos de limpieza. Se contrasta coste de habitaciones equivalentes no preparadas frente al coste de refuerzo.",
 "El equivalente de habitaciones pendientes aproxima toda la carga a limpiezas de salida. No hay horarios reales, convenios, habilidades ni disponibilidad del personal.",
 [["Minutos de limpieza necesarios",rnd(demandMinutes)],["Capacidad de plantilla (min)",rnd(baseCapacity)],["Coste sin refuerzo (€)",rnd(baseCost)],["¿Refuerzo elegido?",useExtra?"Sí":"No"]]);
}
function fact(n){let x=1;for(let i=2;i<=n;i++)x*=i;return x;}
function queue(p){
 const lambda=p.arrivals*(1-p.digitalShare/100);
 const evaluate=c=>{
  const mu=p.serviceRate,util=lambda/(c*mu);
  if(util>=1)return {c,wait:120,util:100,unstable:true,cost:1e6+c*p.hourCost};
  const a=lambda/mu;
  let partial=0;for(let k=0;k<c;k++)partial+=a**k/fact(k);
  const tail=a**c/(fact(c)*(1-util));
  const pw=tail/(partial+tail);
  const waitHours=pw/(c*mu-lambda);
  return {c,wait:60*waitHours,util:util*100,unstable:false,cost:c*p.hourCost+lambda*waitHours*p.waitingCost};
 };
 const base=evaluate(p.receptionists),extra=evaluate(p.receptionists+p.extra);
 const best=extra.cost<base.cost?extra:base;
 return out([
  m("wait",best.wait,"minutes"),m("utilisation",best.util,"pct"),
  m("staff",best.c),m("cost",best.cost,"eur")
 ],vis("bar",["Personal actual","Con refuerzo"],
 [ser("wait",[base.wait,extra.wait])],"minutes"),
 "Cola Erlang C con llegadas Poisson, servicio exponencial, personal homogéneo y derivación hipotética al check-in digital; compara coste de atención y espera.",
 "Cuando la demanda supera la capacidad el sistema es inestable: 120 minutos es un límite visual, no un tiempo esperado real. No mide experiencias observadas.",
 [["Coste sin refuerzo (€)",rnd(base.cost)],["Coste con refuerzo (€)",rnd(extra.cost)],["Llegadas para atención presencial/h",rnd(lambda)],["¿Cola estable?",best.unstable?"No":"Sí"]],
 best.unstable?"La demanda excede la capacidad de atención de recepción; no se estima una espera estable.":"");
}
function energy(p){
 const occupied=p.rooms*p.occupancy/100;
 const climate=1+p.weather/100;
 const base=p.baseLoad+p.roomLoad*occupied*climate;
 const saved=p.roomLoad*occupied*climate*p.efficient/100;
 const before=base*p.tariff;
 const after=(base-saved)*p.tariff+p.implement;
 return out([
  m("energy",base-saved),m("cost",after,"eur"),m("delta",before-after,"eur"),
  m("roomCost",occupied>0?after/occupied:0,"eur")
 ],vis("bar",["Carga fija","Habitaciones"],[ser("reference",[p.baseLoad,p.roomLoad*occupied*climate]),ser("scenario",[p.baseLoad,p.roomLoad*occupied*climate-saved])]),
 "Consumo diario = carga fija + consumo de habitaciones ocupadas ajustado por climatización supuesta. La mejora reduce solo el consumo variable y añade coste diario.",
 "No simula curva horaria, potencia eléctrica, climatización central real ni tarifas negociadas. No se verifican ahorros energéticos.",
 [["Habitaciones ocupadas (estimadas)",rnd(occupied)],["Coste diario sin medida (€)",rnd(before)],["Coste diario con medida (€)",rnd(after)],["Consumo evitado (kWh)",rnd(saved)]],
 after>before?"La medida cuesta más que el ahorro energético supuesto.":"");
}
function groupBooking(p){
 const retail=Math.min(p.rooms,p.retailDemand);
 const acceptedGroup=Math.min(p.group,p.rooms);
 const cancel=p.groupCancel/100;
 const retainedRetail=Math.min(p.retailDemand,p.rooms-acceptedGroup);
 const incrementalRetail=Math.min(p.rooms,p.retailDemand);
 const groupMargin=p.groupRate-p.individualCost;
 const retailMargin=p.individualRate-p.individualCost;
 const normalContribution=retail*retailMargin*p.nights;
 const withGroupNoCancel=(acceptedGroup*groupMargin+retainedRetail*retailMargin)*p.nights;
 const withGroupCancelled=normalContribution+p.groupPenalty;
 const withGroup=withGroupNoCancel*(1-cancel)+withGroupCancelled*cancel;
 const displacement=Math.max(0,retail-retainedRetail);
 return out([
  m("profit",withGroup,"eur"),m("delta",withGroup-normalContribution,"eur"),
  m("displaced",displacement*p.nights),m("service",acceptedGroup/p.rooms*100,"pct")
 ],vis("bar",["Sin grupo","Con grupo"],[ser("profit",[normalContribution,withGroup])],"eur"),
 "Se compara un bloque de grupo con la demanda individual alternativa a lo largo de varias noches, ponderando cancelación y una penalización contractual hipotética.",
 "Se simplifica la sustitución de demanda y se asume reventa completa al cancelar. No se simulan curvas reales de pickup, depósitos, fechas exactas ni restricciones de contrato.",
 [["Ingreso marginal sin grupo (€)",rnd(normalContribution)],["Resultado ponderado con grupo (€)",rnd(withGroup)],["Noches individuales desplazadas",rnd(displacement*p.nights)],["Habitaciones grupo consideradas",acceptedGroup]],
 withGroup<normalContribution?"El grupo reduce la contribución esperada frente a conservar el inventario individual.":"");
}
export const hotelCalculators={
 htOccupancy:occupancy,
 htChannels:channels,
 htHousekeeping:cleaning,
 htReception:queue,
 htEnergy:energy,
 htGroupBooking:groupBooking
};
