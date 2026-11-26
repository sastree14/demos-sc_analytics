/* SC09 Clinics — operational and administrative illustrations only.
 * No patient records, medical decisions, clinical urgency scoring, diagnostic
 * inference, or appointment booking with real systems. Synthetic aggregate data.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,formula,insight:formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=xs=>xs.reduce((a,b)=>a+b,0),clamp=(v,l,h)=>Math.max(l,Math.min(h,v));
const days=["L","M","X","J","V","S"];

export const clinicModels={
 clNoShow:{
  title:L("Huecos por ausencias y llamadas de confirmación","Buits per absències i confirmacions","No-shows and appointment confirmations"),
  inputs:[
   f("appointments","Citas programadas en el periodo","Cites programades al període","Appointments scheduled",20,650,10,180),
   f("noshow","Ausencias previstas (%)","Absències previstes (%)","Assumed no-show rate (%)",0,40,1,18,"pct"),
   f("reminder","Reducción relativa de ausencias (%)","Reducció relativa d'absències (%)","Assumed relative no-show reduction (%)",0,65,5,25,"pct"),
   f("waitlist","Personas que solicitaron hueco disponible","Persones que han demanat un espai lliure","People requesting an available slot",0,250,10,40),
   f("accept","Aceptación de huecos ofertados (%)","Acceptació d'espais oferts (%)","Assumed offered-slot acceptance (%)",0,90,5,55,"pct"),
   f("adminMinutes","Minutos por confirmación manual","Minuts per confirmació manual","Manual confirmation minutes",1,15,1,4,"minutes"),
   f("hourCost","Coste administración/hora (€)","Cost administració/hora (€)","Administrative cost per hour (€)",10,65,1,24,"eur")
  ]
 },
 clWaitlist:{
  title:L("Lista de espera y capacidad de citas","Llista d'espera i capacitat de cites","Waitlist volume and appointment capacity"),
  inputs:[
   f("backlog","Solicitudes administrativas pendientes","Sol·licituds administratives pendents","Pending appointment requests",10,850,10,210),
   f("new","Nuevas solicitudes por semana","Sol·licituds noves per setmana","New requests per week",10,240,5,92),
   f("slots","Huecos ofertables por semana","Espais ofertables per setmana","Available appointment slots/week",10,300,5,80),
   f("cancel","Huecos perdidos por cancelaciones (%)","Espais perduts per cancel·lacions (%)","Unavailable slots after cancellations (%)",0,45,5,10,"pct"),
   f("added","Citas adicionales por semana","Cites addicionals per setmana","Extra appointment slots per week",0,100,5,25),
   f("weeks","Semanas de proyección","Setmanes de projecció","Projection weeks",3,12,1,8)
  ]
 },
 clRooms:{
  title:L("Asignar consultas a salas habilitadas","Assignar consultes a sales habilitades","Match appointment sessions with rooms"),
  inputs:[
   f("generalRooms","Salas polivalentes disponibles","Sales polivalents disponibles","General rooms available",1,14,1,5),
   f("specialRooms","Salas equipadas disponibles","Sales equipades disponibles","Equipped rooms available",0,9,1,2),
   f("generalDemand","Sesiones generales demandadas","Sessions generals demandades","General session demand",5,100,5,45),
   f("specialDemand","Sesiones que precisan sala equipada","Sessions que necessiten sala equipada","Sessions requiring equipped room",2,65,1,20),
   f("sessionsPerRoom","Sesiones por sala por jornada","Sessions per sala i jornada","Sessions per room per day",2,15,1,8),
   f("missCost","Coste de sesión no programable (€)","Cost per sessió no programable (€)","Administrative cost per unassigned session (€)",10,130,5,45,"eur")
  ]
 },
 clAdmin:{
  title:L("Carga administrativa y verificación de documentos","Càrrega administrativa i verificació documental","Administrative verification workload"),
  inputs:[
   f("records","Trámites por semana","Tràmits per setmana","Administrative cases per week",100,5000,100,1500),
   f("minutes","Minutos manuales por trámite","Minuts manuals per tràmit","Manual minutes per case",2,50,1,11,"minutes"),
   f("rules","Trámites simplificables con reglas (%)","Tràmits simplificables amb regles (%)","Rules-eligible administrative cases (%)",0,85,5,45,"pct"),
   f("exceptions","Casos que requieren verificación humana (%)","Casos que requereixen verificació humana (%)","Cases requiring human review (%)",0,55,5,20,"pct"),
   f("staff","Personas administrativas","Persones administratives","Administrative staff",1,25,1,5),
   f("hours","Horas disponibles por persona","Hores disponibles per persona","Available hours per staff member",10,45,5,35,"hours"),
   f("hourly","Coste por hora (€)","Cost per hora (€)","Hourly staff cost (€)",10,85,5,28,"eur")
  ]
 },
 clReception:{
  title:L("Recepción y cola de atención administrativa","Recepció i cua d'atenció administrativa","Front-desk administrative waiting times"),
  inputs:[
   f("arrival","Llegadas por hora","Arribades per hora","Arrivals per hour",5,120,5,35),
   f("service","Atenciones por persona/hora","Atencions per persona/hora","Cases handled per staff-hour",3,22,1,9),
   f("staff","Personas de recepción","Persones de recepció","Front-desk staff",1,18,1,5),
   f("selfService","Gestiones resueltas por autoservicio (%)","Gestions resoltes per autoservei (%)","Self-service share (%)",0,75,5,20,"pct"),
   f("extra","Personal extra disponible","Personal extra disponible","Additional staff available",0,8,1,2),
   f("waiting","Coste de espera administrativa/hora (€)","Cost d'espera administrativa/hora (€)","Waiting-hour cost (€)",5,120,5,30,"eur"),
   f("wage","Coste personal/hora (€)","Cost personal/hora (€)","Staff hourly cost (€)",10,70,2,24,"eur")
  ]
 },
 clUnitCost:{
  title:L("Coste por servicio y uso de capacidad","Cost per servei i ús de capacitat","Service contribution and capacity utilisation"),
  inputs:[
   f("visits","Servicios prestados por periodo","Serveis prestats per període","Services delivered per period",25,1800,25,320),
   f("price","Ingreso medio por servicio (€)","Ingrés mitjà per servei (€)","Average service revenue (€)",20,350,5,95,"eur"),
   f("variable","Coste variable por servicio (€)","Cost variable per servei (€)","Variable cost per service (€)",5,180,5,28,"eur"),
   f("hours","Horas de profesionales disponibles","Hores de professionals disponibles","Professional hours available",40,850,10,480,"hours"),
   f("time","Duración por servicio (min)","Durada per servei (min)","Minutes per service",20,120,5,50,"minutes"),
   f("hourCost","Coste de profesional/hora (€)","Cost professional/hora (€)","Professional hourly cost (€)",15,120,5,42,"eur"),
   f("fixed","Coste fijo periodo (€)","Cost fix període (€)","Period fixed costs (€)",500,28000,500,5500,"eur")
  ]
 }
};
function noShow(p){
 const before=p.appointments*p.noshow/100;
 const after=before*(1-p.reminder/100);
 const recovered=Math.min(p.waitlist*p.accept/100,after);
 const attended=p.appointments-after+recovered;
 const admin=p.appointments*p.adminMinutes/60*p.hourCost;
 return out([
  m("service",attended/p.appointments*100,"pct"),m("unserved",after-recovered),
  m("delta",before-(after-recovered)),m("cost",admin,"eur")
 ],vis("bar",["Referencia","Confirmación y lista"],[ser("shortage",[before,after-recovered]),ser("actual",[p.appointments-before,attended])]),
 "Se estiman ausencias tras recordatorios y cobertura de huecos por personas voluntariamente en lista de disponibilidad; nunca reserva automáticamente ni prioriza por estado de salud.",
 "No usa datos personales ni historiales; la tasa de ausencia y eficacia de llamadas son supuestos. La priorización clínica nunca depende del modelo.",
 [["Huecos esperados inicialmente",rnd(before)],["Ausencias tras confirmación",rnd(after)],["Huecos aceptados desde lista",rnd(recovered)],["Horas administrativas",rnd(p.appointments*p.adminMinutes/60)]]);
}
function waitlist(p){
 const base=[],withExtra=[];let a=p.backlog,b=p.backlog;
 for(let i=0;i<p.weeks;i++){
  a=Math.max(0,a+p.new-p.slots*(1-p.cancel/100));
  b=Math.max(0,b+p.new-(p.slots+p.added)*(1-p.cancel/100));
  base.push(a);withExtra.push(b);
 }
 const capacity=(p.slots+p.added)*(1-p.cancel/100);
 return out([
  m("backlog",b),m("delta",a-b),
  m("utilisation",p.new/Math.max(1,capacity)*100,"pct"),
  m("wait",b/Math.max(1,capacity)*7,"number")
 ],vis("line",base.map((_,i)=>"S"+(i+1)),[ser("reference",base),ser("scenario",withExtra)]),
 "Simulación administrativa de solicitudes pendientes y cupos semanales. Una tasa agregada de cancelación reduce la capacidad ofertable.",
 "El indicador aproximado de días de cola no es espera médica pronosticada. No estratifica enfermedad, gravedad ni prioridades clínicas.",
 [["Cola sin plazas adicionales",rnd(a)],["Cola con plazas adicionales",rnd(b)],["Cupos ofertables/semana",rnd(capacity)],["Semanas simuladas",p.weeks]]);
}
function rooms(p){
 const generalSlots=p.generalRooms*p.sessionsPerRoom;
 const equippedSlots=p.specialRooms*p.sessionsPerRoom;
 const equippedAssigned=Math.min(equippedSlots,p.specialDemand);
 const equippedAvailable=Math.max(0,equippedSlots-equippedAssigned);
 const generalAssigned=Math.min(p.generalDemand,generalSlots+equippedAvailable);
 const shortage=p.generalDemand+p.specialDemand-equippedAssigned-generalAssigned;
 const served=equippedAssigned+generalAssigned;
 const total=p.generalDemand+p.specialDemand;
 return out([
  m("service",served/Math.max(1,total)*100,"pct"),
  m("shortage",shortage),m("cost",shortage*p.missCost,"eur"),
  m("produced",served)
 ],vis("bar",["General","Equipada"],
 [ser("capacity",[generalSlots,equippedSlots]),ser("actual",[generalAssigned,equippedAssigned])]),
 "Primero se reservan salas equipadas para sesiones que requieren ese tipo de sala; capacidad remanente puede utilizarse en sesiones generales compatibles.",
 "No es asignación clínica validada: desconoce requisitos específicos, recursos humanos, limpieza, equipamiento, tiempos o habilitaciones regulatorias.",
 [["Sesiones equipadas asignadas",equippedAssigned],["Sesiones generales asignadas",generalAssigned],["Capacidad sala equipada",equippedSlots],["Sesiones no asignables",shortage]]);
}
function administration(p){
 const initial=p.records*p.minutes/60;
 const auto=Math.max(0,p.records*p.rules/100*(1-p.exceptions/100));
 const after=(p.records-auto)*p.minutes/60;
 const capacity=p.staff*p.hours;
 const backlog=Math.max(0,after-capacity);
 const saving=(initial-after)*p.hourly;
 return out([
  m("hours",after,"hours"),m("backlog",backlog,"hours"),
  m("delta",saving,"eur"),m("coverage",initial>0?(initial-after)/initial*100:0,"pct")
 ],vis("bar",["Proceso manual","Reglas + revisión"],[ser("hours",[initial,after])],"hours"),
 "Se estiman tareas administrativas simplificables por reglas, dejando cualquier discrepancia para revisión humana. La carga se compara con horas disponibles.",
 "No modifica documentación clínica ni confirma datos sanitarios. No conecta HIS/EHR ni procesa información personal.",
 [["Horas antes de simplificar",rnd(initial)],["Horas después de reglas",rnd(after)],["Horas disponibles",rnd(capacity)],["Trámites simplificados (esperados)",rnd(auto)]]);
}
function fact(n){let v=1;for(let k=2;k<=n;k++)v*=k;return v;}
function reception(p){
 const lambda=p.arrival*(1-p.selfService/100);
 const evaluate=staff=>{
  const a=lambda/p.service,rho=lambda/(staff*p.service);
  if(rho>=1)return {wait:120,util:100,cost:1000000,unstable:true};
  let part=0;for(let i=0;i<staff;i++)part+=a**i/fact(i);
  const tail=a**staff/fact(staff)/(1-rho);
  const pw=tail/(tail+part);
  const hours=pw/(staff*p.service-lambda);
  return {wait:hours*60,util:rho*100,cost:staff*p.wage+lambda*hours*p.waiting,unstable:false};
 };
 const base=evaluate(p.staff),extra=evaluate(p.staff+p.extra);
 const choose=extra.cost<base.cost?extra:base;
 return out([
  m("wait",choose.wait,"minutes"),m("utilisation",choose.util,"pct"),
  m("cost",choose.cost,"eur"),m("staff",choose===extra?p.staff+p.extra:p.staff)
 ],vis("bar",["Referencia","Refuerzo"],[ser("wait",[base.wait,extra.wait])],"minutes"),
 "Modelo M/M/c Erlang C para trámites administrativos presenciales, con autoservicio hipotético y personal equivalente; compara coste de personal y espera.",
 "Supone llegadas Poisson y atención exponencial. No es triaje sanitario ni asignación de prioridad clínica, y 120 min es un límite visual cuando la cola es inestable.",
 [["Llegadas presenciales/h",rnd(lambda)],["Coste de referencia (€)",rnd(base.cost)],["Coste con refuerzo (€)",rnd(extra.cost)],["¿Cola estable?",choose.unstable?"No":"Sí"]],
 choose.unstable?"La cola administrativa supera la capacidad de servicio; el tiempo mostrado es un límite visual, no una espera estable.":"");
}
function unitCost(p){
 const capacity=p.hours*60/p.time;
 const served=Math.min(p.visits,capacity),unserved=Math.max(0,p.visits-served);
 const revenue=served*p.price,variable=served*p.variable;
 const labor=p.hours*p.hourCost;
 const total=variable+labor+p.fixed;
 const margin=revenue-total;
 return out([
  m("profit",margin,"eur"),m("margin",revenue?margin/revenue*100:0,"pct"),
  m("utilisation",capacity?served/capacity*100:0,"pct"),
  m("cost",served?total/served:0,"eur")
 ],vis("bar",["Solicitados","Capacidad","Atendidos"],[ser("cases",[p.visits,capacity,served])]),
 "Contribución = servicios prestados × ingreso medio − coste variable − personal disponible − gastos fijos. La capacidad depende de horas y duración supuesta.",
 "No representa facturación sanitaria real, cartera de servicios, tarifas aseguradoras ni valoración médica de la atención.",
 [["Servicios no programables",rnd(unserved)],["Capacidad calculada",rnd(capacity)],["Coste total escenario (€)",rnd(total)],["Ingreso calculado (€)",rnd(revenue)]],
 unserved>0?"La demanda de servicios excede la capacidad disponible bajo estos parámetros.":"");
}
export const clinicCalculators={
 clNoShow:noShow,clWaitlist:waitlist,clRooms:rooms,
 clAdmin:administration,clReception:reception,clUnitCost:unitCost
};
