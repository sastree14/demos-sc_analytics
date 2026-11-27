/* SC15 SaaS and software: fictional subscriptions, support and AI operations.
 * No observed churn, trained model, customer PII, real invoices or live agent actions.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,insight:formula,formula,limitations,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=a=>a.reduce((v,w)=>v+w,0),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const months=["M1","M2","M3","M4","M5","M6"];
export const saasModels={
 saRetention:{title:L("Churn, expansión y retención neta","Churn, expansió i retenció neta","Subscription churn and net revenue retention"),inputs:[
 f("customers","Cuentas activas al inicio","Comptes actius a l'inici","Starting active accounts",50,6000,50,820),
 f("arpu","MRR medio por cuenta (€)","MRR mitjà per compte (€)","Monthly recurring revenue per account (€)",30,2500,25,240,"eur"),
 f("churn","Bajas mensuales de cuentas (%)","Baixes mensuals de comptes (%)","Assumed monthly logo churn (%)",0.5,12,0.5,3,"pct"),
 f("expansion","Expansión de ingreso base por mes (%)","Expansió de l'ingrés base/mes (%)","Existing revenue expansion per month (%)",0,15,1,4,"pct"),
 f("contraction","Contracción de ingreso base por mes (%)","Contracció de l'ingrés base/mes (%)","Existing revenue contraction per month (%)",0,12,1,2,"pct"),
 f("new","Altas de cuentas nuevas por mes","Altes de comptes noves per mes","New accounts per month",0,350,10,65)
 ]},
 saActivation:{title:L("Activación durante el onboarding","Activació durant l'onboarding","Onboarding activation funnel"),inputs:[
 f("signups","Registros de usuarios","Registres d'usuaris","User signups",100,30000,100,4500),
 f("verify","Verificación inicial (%)","Verificació inicial (%)","Account verification rate (%)",20,100,5,84,"pct"),
 f("setup","Configuración completada (%)","Configuració completada (%)","Configuration completion rate (%)",20,100,5,63,"pct"),
 f("first","Primera acción útil (%)","Primera acció útil (%)","First meaningful action rate (%)",20,100,5,55,"pct"),
 f("assist","Mejora relativa por ayuda guiada (%)","Millora relativa amb ajuda guiada (%)","Assumed guided onboarding improvement (%)",0,70,5,30,"pct"),
 f("minutes","Tiempo base hasta primer valor (min)","Temps base fins primer valor (min)","Baseline time to first value (minutes)",5,120,5,42,"minutes"),
 f("saveMinutes","Reducción con guía (min)","Reducció amb guia (min)","Guided time saving (minutes)",0,65,5,15,"minutes")
 ]},
 saAgents:{title:L("Errores de un agente y umbral de revisión","Errors d'un agent i llindar de revisió","Agent output quality and human review"),inputs:[
 f("tasks","Respuestas del agente por periodo","Respostes de l'agent per període","Agent responses per period",100,20000,100,2300),
 f("errorRate","Errores sintéticos de respuesta (%)","Errors sintètics de resposta (%)","Assumed incorrect-answer share (%)",1,50,1,14,"pct"),
 f("flagRate","Detección supuesta de errores (%)","Detecció suposada d'errors (%)","Assumed error detection rate (%)",10,100,5,78,"pct"),
 f("falseAlarm","Falsos positivos de revisión (%)","Falsos positius de revisió (%)","False-positive review alert rate (%)",0,40,5,12,"pct"),
 f("capacity","Capacidad de revisión humana","Capacitat de revisió humana","Human review capacity",50,9000,50,1100),
 f("reviewCost","Coste por revisión (€)","Cost per revisió (€)","Review cost per output (€)",1,65,1,9,"eur"),
 f("missCost","Impacto económico supuesto de error no detectado (€)","Impacte econòmic suposat error no detectat (€)","Assumed unflagged-error cost (€)",5,500,5,90,"eur")
 ]},
 saCost:{title:L("Coste de inferencia, caché y soporte","Cost d'inferència, caché i suport","LLM inference, caching and support cost"),inputs:[
 f("requests","Solicitudes mensuales","Sol·licituds mensuals","Requests per month",1000,500000,1000,85000),
 f("inputTokens","Tokens entrada por petición","Tokens entrada per petició","Input tokens per request",100,10000,100,2100),
 f("outputTokens","Tokens salida por petición","Tokens sortida per petició","Output tokens per request",50,4000,50,550),
 f("inputPrice","Coste millón tokens entrada (€)","Cost milió tokens entrada (€)","Input token cost per million (€)",0.05,20,0.05,1.8,"eur"),
 f("outputPrice","Coste millón tokens salida (€)","Cost milió tokens sortida (€)","Output token cost per million (€)",0.1,45,0.1,8,"eur"),
 f("cache","Peticiones con caché reutilizable (%)","Peticions amb caché reutilitzable (%)","Cacheable share (%)",0,85,5,35,"pct"),
 f("cacheSaved","Ahorro input de caché (%)","Estalvi input de caché (%)","Input cache saving (%)",0,95,5,80,"pct"),
 f("tickets","Tickets humanos mensuales","Tiquets humans mensuals","Human support tickets per month",0,15000,100,1200),
 f("supportMinutes","Minutos de soporte por ticket","Minuts de suport per tiquet","Support minutes per ticket",3,80,1,18,"minutes"),
 f("hourCost","Coste de soporte por hora (€)","Cost de suport per hora (€)","Support staff hourly cost (€)",15,100,5,38,"eur")
 ]},
 saMRR:{title:L("Evolución de MRR y ARR por palancas","Evolució de MRR i ARR","MRR and ARR scenario drivers"),inputs:[
 f("initial","MRR inicial (€)","MRR inicial (€)","Starting MRR (€)",2000,800000,10000,145000,"eur"),
 f("newMRR","MRR nuevo al mes (€)","MRR nou al mes (€)","Monthly new MRR (€)",0,60000,1000,16000,"eur"),
 f("churn","Churn mensual de MRR (%)","Churn mensual del MRR (%)","Monthly revenue churn (%)",0,15,1,4,"pct"),
 f("expansion","Expansión mensual sobre base (%)","Expansió mensual sobre base (%)","Monthly base expansion (%)",0,15,1,5,"pct"),
 f("downsell","Reducción por downgrade (%)","Reducció per downgrade (%)","Monthly contraction (%)",0,12,1,1,"pct"),
 f("uncertainty","Variación ilustrativa de ingresos (%)","Variació il·lustrativa dels ingressos (%)","Illustrative revenue variation (%)",0,35,5,15,"pct")
 ]},
 saSupport:{title:L("Backlog de soporte y capacidad de resolución","Cua de suport i capacitat de resolució","Support backlog and staffing capacity"),inputs:[
 f("starting","Tickets pendientes","Tiquets pendents","Starting support backlog",0,2000,50,380),
 f("incoming","Nuevos tickets por semana","Nous tiquets per setmana","New tickets per week",50,1500,50,520),
 f("agents","Agentes de soporte","Agents de suport","Support agents",2,70,1,18),
 f("hours","Horas útiles por agente/semana","Hores útils per agent/setmana","Productive hours per agent/week",10,45,5,30,"hours"),
 f("minutes","Minutos por resolución","Minuts per resolució","Minutes per resolution",5,120,5,38,"minutes"),
 f("extra","Personal extra","Personal extra","Extra support agents",0,30,1,5),
 f("extraCost","Coste semanal por agente adicional (€)","Cost setmanal agent addicional (€)","Weekly cost per extra agent (€)",250,2500,50,950,"eur"),
 f("lateCost","Coste por pendiente al cierre (€)","Cost per pendent al final (€)","Cost per unresolved ticket (€)",5,150,5,40,"eur")
 ]}
};
function retention(p){
 let base=p.customers*p.arpu,existing=base,all=base,accounts=p.customers;
 const seriesExisting=[],seriesAll=[],nrr=[];
 for(let k=0;k<6;k++){
  const factor=1-p.churn/100+p.expansion/100-p.contraction/100;
  existing=Math.max(0,existing*factor);
  all=Math.max(0,all*factor+p.new*p.arpu);
  accounts=Math.max(0,accounts*(1-p.churn/100)+p.new);
  seriesExisting.push(existing);seriesAll.push(all);nrr.push(existing/base*100);
 }
 return out([
 m("nrr",existing/base*100,"pct"),m("mrr",all,"eur"),
 m("volume",accounts),m("revenue",sum(seriesAll),"eur")
 ],vis("line",months,[ser("reference",seriesExisting),ser("scenario",seriesAll)],"eur"),
 "Ingreso de clientes iniciales se reduce por churn/contracción y aumenta por expansión; las altas se suman solo al MRR total, nunca a la NRR de la cohorte inicial.",
 "Los flujos son expectativas deterministas y no cohortes observadas. No incorpora retrasos de cobro ni cuentas con ARPU heterogéneo.",
 [["MRR inicial (€)",rnd(base)],["MRR de cohorte inicial mes 6 (€)",rnd(existing)],["MRR total mes 6 (€)",rnd(all)],["NRR cohorte inicial (%)",rnd(existing/base*100)]]);
}
function activation(p){
 const verified=p.signups*p.verify/100;
 const set=verified*p.setup/100,first=set*p.first/100;
 const improvement=Math.min(1,p.first/100*(1+p.assist/100));
 const assisted=set*improvement;
 return out([
 m("activation",100*assisted/p.signups,"pct"),
 m("delta",assisted-first),m("volume",assisted),
 m("timeToValue",Math.max(1,p.minutes-p.saveMinutes),"minutes")
 ],vis("bar",["Registro","Verificación","Configuración","Primer valor"],[ser("reference",[p.signups,verified,set,first]),ser("scenario",[p.signups,verified,set,assisted])]),
 "Embudo de eventos con tasas condicionales supuestas; la ayuda guiada modifica la proporción de personas que llegan al primer valor y reduce minutos hipotéticos.",
 "No hay instrumentación real del producto, experimentos A/B ni evidencia causal de incremento de activación.",
 [["Activaciones iniciales",rnd(first)],["Activaciones con guía",rnd(assisted)],["Tiempo inicial estimado (min)",p.minutes],["Tiempo con guía estimado (min)",Math.max(1,p.minutes-p.saveMinutes)]]);
}
function agents(p){
 const bad=p.tasks*p.errorRate/100,good=p.tasks-bad;
 const flagged=bad*p.flagRate/100+good*p.falseAlarm/100;
 const reviewed=Math.min(flagged,p.capacity);
 const reviewedBad=reviewed*(bad*p.flagRate/100)/Math.max(1,flagged);
 const undetected=bad-reviewedBad;
 const cost=reviewed*p.reviewCost+undetected*p.missCost;
 return out([
 m("errors",undetected),m("reviewed",reviewed),
 m("cost",cost,"eur"),m("coverage",100*reviewed/Math.max(1,flagged),"pct")
 ],vis("bar",["Correctas","Incorrectas"],[ser("volume",[good,bad]),ser("review",[good*p.falseAlarm/100,bad*p.flagRate/100])]),
 "Se generan resultados sintéticos; una regla de alerta hipotética identifica errores y falsos positivos. La revisión humana tiene capacidad limitada.",
 "No hay evaluador calibrado, dataset de verdad, métricas empíricas o agentes ejecutando acciones. La supervisión humana continúa siendo necesaria.",
 [["Respuestas incorrectas supuestas",rnd(bad)],["Alertas totales",rnd(flagged)],["Revisiones realizadas",rnd(reviewed)],["Errores sin revisión estimados",rnd(undetected)]],
 undetected>0?"El escenario conserva respuestas potencialmente incorrectas sin revisión.":"");
}
function inference(p){
 const totalTokens=p.requests*(p.inputTokens*p.inputPrice+p.outputTokens*p.outputPrice)/1e6;
 const savings=p.requests*p.inputTokens*p.inputPrice/1e6*p.cache/100*p.cacheSaved/100;
 const support=p.tickets*p.supportMinutes/60*p.hourCost;
 const after=totalTokens-savings+support,before=totalTokens+support;
 return out([
 m("cost",after,"eur"),m("delta",before-after,"eur"),
 m("unitCost",p.requests>0?after/p.requests:0,"eur"),
 m("hours",p.tickets*p.supportMinutes/60,"hours")
 ],vis("bar",["Inferencia base","Caché aplicada","Soporte"],[ser("cost",[totalTokens,totalTokens-savings,support])],"eur"),
 "Coste por millón de tokens de entrada/salida, porcentaje reutilizable y descuento de input; añade tiempo administrativo de soporte humano.",
 "Precios y cargas son configurables, no cotizaciones reales del proveedor. Caché de entrada no reduce salida y no elimina el soporte.",
 [["Coste base sin caché (€)",rnd(before)],["Coste total con caché (€)",rnd(after)],["Coste tokens tras caché (€)",rnd(totalTokens-savings)],["Gasto soporte humano (€)",rnd(support)]]);
}
function mrr(p){
 let current=p.initial;const values=[];
 for(let i=0;i<6;i++){
  current=Math.max(0,current*(1-p.churn/100+p.expansion/100-p.downsell/100)+p.newMRR);
  values.push(current);
 }
 return out([
 m("mrr",current,"eur"),m("arr",current*12,"eur"),
 m("delta",current-p.initial,"eur"),m("revenue",sum(values),"eur")
 ],vis("line",months,[ser("scenario",values),ser("lower",values.map(x=>x*(1-p.uncertainty/100))),ser("upper",values.map(x=>x*(1+p.uncertainty/100)))],"eur"),
 "MRR evoluciona mensualmente por altas netas y tasa sobre el saldo previo. ARR es la anualización del MRR final, no ingresos facturados.",
 "Las bandas son un margen hipotético, no intervalos calibrados ni forecast entrenado; ignora estacionalidad y cobros efectivos.",
 [["MRR al inicio (€)",p.initial],["MRR al cierre (€)",rnd(current)],["ARR al cierre (€)",rnd(current*12)],["Banda inferior ilustrativa (€)",rnd(current*(1-p.uncertainty/100))]]);
}
function support(p){
 const sim=extra=>{
  const staff=p.agents+(extra?p.extra:0);
  const capacity=staff*p.hours*60/p.minutes;
  let backlog=p.starting;const timeline=[];
  for(let i=0;i<6;i++){backlog=Math.max(0,backlog+p.incoming-capacity);timeline.push(backlog);}
  return {backlog,capacity,timeline,cost:backlog*p.lateCost+(extra?p.extra*p.extraCost*6:0)};
 };
 const base=sim(false),more=sim(true),best=more.cost<base.cost?more:base;
 return out([
 m("backlog",best.backlog),m("produced",best.capacity),
 m("delta",base.cost-best.cost,"eur"),m("cost",best.cost,"eur")
 ],vis("line",months,[ser("reference",base.timeline),ser("scenario",best.timeline)]),
 "Cola de tickets durante seis semanas con capacidad determinada por agentes, horas productivas y duración media. Se compara refuerzo bajo coste.",
 "No conecta herramientas reales de helpdesk, no diferencia gravedad técnica ni garantiza cumplimiento de SLA.",
 [["Cola sin refuerzo",rnd(base.backlog)],["Cola con refuerzo",rnd(more.backlog)],["Tickets atendibles por semana",rnd(best.capacity)],["Coste con equipo seleccionado (€)",rnd(best.cost)]]);
}
export const saasCalculators={saRetention:retention,saActivation:activation,saAgents:agents,saCost:inference,saMRR:mrr,saSupport:support};
