/* SC12 Finance & Insurance — strictly synthetic and aggregate decision support.
 * Not a trained fraud model, lending eligibility tool, underwriting decision,
 * insurance approval/rejection, actuarial certification or live transaction system.
 * All fraud, risk and claim parameters are hypothetical.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,formula,insight:formula,limitations,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=x=>x.reduce((a,b)=>a+b,0);
const months=["M1","M2","M3","M4","M5","M6"];
export const financeInsuranceModels={
 fiAlerts:{
  title:L("Alertas ilustrativas y revisión de operaciones","Alertes il·lustratives i revisió d'operacions","Illustrative alert and human review trade-off"),
  inputs:[
   f("cases","Operaciones del periodo","Operacions del període","Transactions in period",1000,60000,1000,12000),
   f("prevalence","Proporción hipotética de casos relevantes (%)","Proporció hipotètica de casos rellevants (%)","Assumed relevant-case prevalence (%)",0.5,20,0.5,3,"pct"),
   f("threshold","Umbral de alerta ilustrativo (%)","Llindar d'alerta il·lustratiu (%)","Illustrative alert threshold (%)",10,90,5,50,"pct"),
   f("costReview","Coste de revisión de alerta (€)","Cost de revisió d'alerta (€)","Alert review cost (€)",1,100,1,12,"eur"),
   f("costMiss","Coste supuesto por caso omitido (€)","Cost per cas omès (€)","Assumed missed-case cost (€)",10,2500,25,480,"eur"),
   f("capacity","Revisiones humanas disponibles","Revisions humanes disponibles","Available human reviews",50,10000,100,2200)
  ]
 },
 fiPortfolio:{
  title:L("Deterioro agregado de cartera por escenarios","Deteriorament agregat de cartera","Aggregate portfolio deterioration scenarios"),
  inputs:[
   f("exposure","Exposición agregada (€)","Exposició agregada (€)","Aggregate portfolio exposure (€)",100000,25000000,250000,6500000,"eur"),
   f("performing","Exposición al día (%)","Exposició al corrent (%)","Performing exposure (%)",35,98,1,82,"pct"),
   f("migration","Migración mensual a seguimiento (%)","Migració mensual a seguiment (%)","Monthly migration into watchlist (%)",0,18,1,5,"pct"),
   f("cure","Recuperación mensual desde seguimiento (%)","Recuperació mensual des de seguiment (%)","Monthly cure rate from watchlist (%)",0,35,1,12,"pct"),
   f("lossGiven","Pérdida de exposición en estrés (%)","Pèrdua d'exposició en estrès (%)","Stress scenario loss severity (%)",10,95,5,44,"pct"),
   f("stress","Multiplicador macroeconómico supuesto","Multiplicador macroeconòmic suposat","Assumed macro stress multiplier",0.5,3,0.25,1.5)
  ]
 },
 fiReconcile:{
  title:L("Conciliación contable y excepciones","Conciliació comptable i excepcions","Transaction matching and exceptions"),
  inputs:[
   f("records","Apuntes a conciliar","Apunts a conciliar","Records to reconcile",100,60000,100,9500),
   f("mismatch","Diferencias entre sistemas (%)","Diferències entre sistemes (%)","Assumed mismatch rate (%)",1,45,1,13,"pct"),
   f("duplicates","Apuntes duplicados (%)","Apunts duplicats (%)","Assumed duplicates (%)",0,25,1,6,"pct"),
   f("rules","Resolución por reglas verificables (%)","Resolució amb regles verificables (%)","Rules-matched exception share (%)",0,85,5,55,"pct"),
   f("minutes","Minutos por revisión de excepción","Minuts per revisió d'excepció","Minutes per exception review",1,45,1,12,"minutes"),
   f("staff","Personas disponibles","Persones disponibles","Available reviewers",1,35,1,7),
   f("hours","Horas de revisión disponibles/persona","Hores de revisió/persona","Hours available per reviewer",5,40,5,28,"hours"),
   f("hourCost","Coste de revisión/hora (€)","Cost de revisió/hora (€)","Review cost per hour (€)",15,120,5,42,"eur")
  ]
 },
 fiClaimsDocs:{
  title:L("Documentación completa y cola de siniestros","Documentació completa i cua de sinistres","Claims documentation and review workload"),
  inputs:[
   f("claims","Expedientes recibidos","Expedients rebuts","Claim files received",50,3500,50,900),
   f("missing","Documentos incompletos (%)","Documents incomplets (%)","Files with missing information (%)",0,65,5,30,"pct"),
   f("requests","Documentación recuperada tras solicitud (%)","Documentació recuperada després de requeriment (%)","Missing documents recovered (%)",0,90,5,55,"pct"),
   f("time","Minutos por expediente completo","Minuts per expedient complet","Minutes per complete file",5,120,5,35,"minutes"),
   f("extra","Minutos por requerimiento incompleto","Minuts per requeriment incomplet","Extra incomplete-file minutes",5,80,5,20,"minutes"),
   f("staff","Revisores disponibles","Revisors disponibles","Document reviewers",1,40,1,9),
   f("hours","Horas por revisor","Hores per revisor","Hours per reviewer",10,45,5,35,"hours")
  ]
 },
 fiReserve:{
  title:L("Frecuencia y coste agregado de siniestros","Freqüència i cost agregat de sinistres","Aggregate claims frequency and severity"),
  inputs:[
   f("policies","Pólizas expuestas","Pòlisses exposades","Exposed policies",100,30000,100,6000),
   f("frequency","Frecuencia media anual (%)","Freqüència mitjana anual (%)","Assumed annual claim frequency (%)",1,35,1,12,"pct"),
   f("severity","Severidad media (€)","Severitat mitjana (€)","Assumed mean claim amount (€)",100,30000,100,3500,"eur"),
   f("severityVar","Factor de severidad alta (%)","Factor de severitat alta (%)","High-severity stress uplift (%)",0,100,5,35,"pct"),
   f("freqStress","Factor de frecuencia alta (%)","Factor de freqüència alta (%)","Frequency stress uplift (%)",0,100,5,25,"pct"),
   f("buffer","Margen prudencial ilustrativo (%)","Marge prudencial il·lustratiu (%)","Illustrative reserve buffer (%)",0,50,5,15,"pct")
  ]
 },
 fiCapacity:{
  title:L("Capacidad de tramitación de siniestros","Capacitat de tramitació de sinistres","Claims processing capacity"),
  inputs:[
   f("starting","Cola inicial de expedientes","Cua inicial d'expedients","Initial claim-file backlog",50,1200,50,280),
   f("new","Nuevos expedientes por semana","Expedients nous per setmana","Incoming files per week",20,500,20,170),
   f("staff","Tramitadores disponibles","Tramitadors disponibles","Available processors",1,50,1,12),
   f("hours","Horas de gestión por persona","Hores de gestió per persona","Processing hours per person",10,45,5,35,"hours"),
   f("time","Horas por expediente","Hores per expedient","Hours per file",0.5,8,0.5,2.5,"hours"),
   f("rework","Expedientes con retrabajo (%)","Expedients amb retraball (%)","Rework rate (%)",0,65,5,25,"pct"),
   f("extra","Refuerzo temporal de personas","Reforç temporal de persones","Temporary additional processors",0,30,1,4),
   f("cost","Coste semanal por refuerzo (€)","Cost setmanal per reforç (€)","Extra processor weekly cost (€)",250,2500,50,880,"eur"),
   f("pendingCost","Coste por expediente pendiente (€)","Cost per expedient pendent (€)","Outstanding-file cost (€)",5,160,5,45,"eur")
  ]
 }
};
function alertCases(p){
 const relevant=p.cases*p.prevalence/100,others=p.cases-relevant,t=p.threshold/100;
 const sensitivity=.95-.70*t,specificity=.55+.43*t;
 const TP=relevant*sensitivity,FN=relevant-TP,FP=others*(1-specificity),TN=others-FP;
 const candidate=TP+FP;
 const reviewed=Math.min(p.capacity,candidate);
 const coverage=reviewed/Math.max(1,candidate);
 const reviewedTP=TP*coverage,reviewedFP=FP*coverage,unreviewedRelevant=FN+(TP-reviewedTP);
 const cost=reviewed*p.costReview+unreviewedRelevant*p.costMiss;
 return out([
  m("tp",reviewedTP),m("fp",reviewedFP),m("fn",unreviewedRelevant),
  m("cost",cost,"eur")
 ],vis("matrix",["VP","FP","FN","VN"],
 [ser("cases",[reviewedTP,reviewedFP,unreviewedRelevant,TN])]),
 "Matriz de confusión con sensibilidad y especificidad INVENTADAS que varían monótonamente con un umbral. Los casos que exceden la capacidad humana quedan pendientes, sin decisiones automáticas.",
 "NO existe clasificador entrenado ni validado, ni etiquetado real, ni autorización para acusar o bloquear operaciones. Ninguna acción se ejecuta en sistemas financieros.",
 [["Casos relevantes supuestos",rnd(relevant)],["Alertas generadas",rnd(candidate)],["Alertas revisadas",rnd(reviewed)],["Alertas pendientes",rnd(candidate-reviewed)]],
 candidate>p.capacity?"Capacidad humana de revisión insuficiente para todas las alertas generadas.":"");
}
function portfolio(p){
 let performing=p.exposure*p.performing/100,watch=p.exposure-performing;const levels=[],watchLevels=[];
 for(let i=0;i<6;i++){
  const migrated=performing*p.migration/100*p.stress;
  const cured=watch*p.cure/100;
  performing=Math.max(0,performing-migrated+cured);
  watch=p.exposure-performing;
  levels.push(performing);watchLevels.push(watch);
 }
 const loss=watch*p.lossGiven/100;
 return out([
  m("risk",watch/p.exposure*100,"pct"),m("exposure",watch,"eur"),
  m("loss",loss,"eur"),m("delta",loss-(p.exposure*(1-p.performing/100)*p.lossGiven/100),"eur")
 ],vis("line",months,[ser("reference",levels),ser("risk",watchLevels)],"eur"),
 "Migración agregada mensual desde exposición al día a cartera vigilada, con recuperación hipotética y multiplicador de estrés. Pérdida ilustrativa = cartera vigilada × severidad supuesta.",
 "No es cálculo de provisiones IFRS 9, clasificación de prestatarios ni decisión de crédito; no hay scoring individual o datos financieros reales.",
 [["Exposición inicial al día (€)",rnd(p.exposure*p.performing/100)],["Exposición en seguimiento mes 6 (€)",rnd(watch)],["Severidad supuesta (%)",p.lossGiven],["Escenarios mensuales",6]]);
}
function reconciliation(p){
 const flagged=p.records*(p.mismatch/100+p.duplicates/100-p.mismatch*p.duplicates/10000);
 const automaticallyResolved=flagged*p.rules/100,remaining=flagged-automaticallyResolved;
 const work=remaining*p.minutes/60,capacity=p.staff*p.hours;
 const pending=Math.max(0,work-capacity);
 const initialWork=flagged*p.minutes/60;
 return out([
  m("exceptions",remaining),m("hours",work,"hours"),
  m("backlog",pending,"hours"),m("delta",(initialWork-work)*p.hourCost,"eur")
 ],vis("bar",["Sin reglas","Con reglas"],[ser("cases",[flagged,remaining])]),
 "Unión hipotética de diferencias y duplicados, descontando coincidencias; las reglas resuelven una parte y las excepciones restantes exigen revisión humana.",
 "No procesa transacciones ni pagos reales, no altera contabilidad, no realiza autorizaciones bancarias ni garantiza conformidad regulatoria.",
 [["Registros inconsistentes esperados",rnd(flagged)],["Registros resueltos por reglas",rnd(automaticallyResolved)],["Coste de trabajo restante (€)",rnd(work*p.hourCost)],["Capacidad de revisión (h)",rnd(capacity)]]);
}
function claimDocs(p){
 const incomplete=p.claims*p.missing/100,updated=incomplete*p.requests/100;
 const complete=p.claims-incomplete+updated,stillMissing=incomplete-updated;
 const required=complete*p.time/60+stillMissing*p.extra/60;
 const capacity=p.staff*p.hours,backlog=Math.max(0,required-capacity);
 return out([
  m("coverage",complete/p.claims*100,"pct"),
  m("backlog",backlog,"hours"),m("hours",required,"hours"),
  m("exceptions",stillMissing)
 ],vis("bar",["Completos","Pendientes de documentos"],
 [ser("cases",[complete,stillMissing])]),
 "Clasificación exclusivamente DOCUMENTAL: la existencia o falta de documentación condiciona carga de trabajo, sin determinar prioridad médica ni procedencia de un siniestro.",
 "No calcula fraude, severidad, cobertura, indemnización ni aceptación/rechazo. Los expedientes reales requieren profesionales autorizados.",
 [["Documentación recuperada tras solicitud",rnd(updated)],["Expedientes aún incompletos",rnd(stillMissing)],["Horas disponibles",rnd(capacity)],["Horas adicionales necesarias",rnd(backlog)]]);
}
function reserves(p){
 const meanCount=p.policies*p.frequency/100,normal=meanCount*p.severity;
 const stress=meanCount*(1+p.freqStress/100)*p.severity*(1+p.severityVar/100);
 const reserve=stress*(1+p.buffer/100);
 return out([
  m("frequencyCount",meanCount),m("loss",normal,"eur"),
  m("reserve",reserve,"eur"),m("delta",reserve-normal,"eur")
 ],vis("bar",["Base","Frecuencia alta","Estrés combinado"],
 [ser("loss",[normal,meanCount*(1+p.freqStress/100)*p.severity,stress])],"eur"),
 "Importe agregado de siniestros = pólizas × frecuencia supuesta × coste medio. Escenario de estrés ajusta frecuencia, severidad y colchón prudencial ilustrativo.",
 "No es reserva actuarial ni cálculo Solvencia II/IFRS 17; no estima distribuciones de cola, IBNR, reaseguro, inflación judicial ni coberturas reales.",
 [["Número de siniestros escenario alto",rnd(meanCount*(1+p.freqStress/100))],["Coste unitario de severidad alto (€)",rnd(p.severity*(1+p.severityVar/100))],["Coste escenario alto (€)",rnd(stress)],["Colchón ilustrativo (€)",rnd(reserve-stress)]]);
}
function claimsCapacity(p){
 const processHours=p.time*(1+p.rework/100);
 const sim=staff=>{
  let queue=p.starting;const levels=[];
  const capacity=staff*p.hours/processHours;
  for(let i=0;i<6;i++){
   queue=Math.max(0,queue+p.new-capacity);
   levels.push(queue);
  }
  return {queue,levels,capacity,cost:queue*p.pendingCost+(staff-p.staff)*p.cost*6};
 };
 const base=sim(p.staff),extra=sim(p.staff+p.extra);
 const best=extra.cost<base.cost?extra:base;
 return out([
  m("backlog",best.queue),m("produced",best.capacity),
  m("cost",best.cost,"eur"),m("delta",base.cost-best.cost,"eur")
 ],vis("line",months,[ser("reference",base.levels),ser("scenario",best.levels)]),
 "Simulación de cola de expedientes durante seis semanas; la capacidad depende de tramitadores, horas y retrabajo esperado. Se compara refuerzo por coste.",
 "No incluye valoración de cobertura ni gravedad, no automatiza indemnizaciones ni sustituye supervisión y controles regulatorios.",
 [["Cola final sin refuerzo",rnd(base.queue)],["Cola final con refuerzo",rnd(extra.queue)],["Capacidad semanal por escenario",rnd(best.capacity)],["Personas asignadas",best===extra?p.staff+p.extra:p.staff]]);
}
export const financeInsuranceCalculators={
 fiAlerts:alertCases,fiPortfolio:portfolio,fiReconcile:reconciliation,
 fiClaimsDocs:claimDocs,fiReserve:reserves,fiCapacity:claimsCapacity
};
