/* SC16 education/training. Institution-level aggregates, no student profiling,
 * individual dropout labels, admissions or educational placement decisions.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const sr=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,insight:formula,formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=a=>a.reduce((x,y)=>x+y,0);
export const educationModels={
 edEngagement:{title:L("Participación agregada y continuidad formativa","Participació agregada i continuïtat formativa","Aggregate engagement and course retention"),inputs:[
 f("enrolled","Alumnado matriculado en grupo","Alumnat matriculat al grup","Learners enrolled in cohort",30,4000,50,650),
 f("attend","Asistencia media agregada (%)","Assistència mitjana agregada (%)","Aggregate attendance rate (%)",30,100,5,78,"pct"),
 f("platform","Actividad global LMS (%)","Activitat global LMS (%)","Aggregate LMS participation (%)",20,100,5,65,"pct"),
 f("baseLeave","Abandono histórico supuesto (%)","Abandonament històric suposat (%)","Assumed baseline non-completion (%)",2,50,2,18,"pct"),
 f("outreach","Participantes que aceptan apoyo (%)","Participants que accepten suport (%)","Voluntary support uptake (%)",0,80,5,30,"pct"),
 f("effect","Reducción hipotética del abandono por apoyo (%)","Reducció hipotètica de l'abandonament per suport (%)","Assumed relative retention improvement (%)",0,55,5,20,"pct")
 ]},
 edTimetable:{title:L("Horarios sin conflictos de aula y docentes","Horaris sense conflictes d'aula i docents","Timetable allocation under classroom capacity"),inputs:[
 f("groupsA","Sesiones modalidad A","Sessions modalitat A","Type A sessions",5,100,5,40),
 f("groupsB","Sesiones modalidad B","Sessions modalitat B","Type B sessions",5,100,5,30),
 f("groupsC","Sesiones modalidad C","Sessions modalitat C","Type C sessions",5,100,5,25),
 f("rooms","Aulas disponibles","Aules disponibles","Available classrooms",1,30,1,7),
 f("teachers","Docentes disponibles","Docents disponibles","Available teachers",1,40,1,10),
 f("slots","Franja por aula/docente a la semana","Franges per aula/docent a la setmana","Weekly time slots per room/teacher",3,20,1,12),
 f("specialRooms","Aulas equipadas para C","Aules equipades per a C","Specialised classrooms for C",0,15,1,2)
 ]},
 edCourse:{title:L("Rentabilidad de curso y tamaño de cohorte","Rendibilitat de curs i mida de cohort","Course unit economics"),inputs:[
 f("students","Alumnos inscritos","Alumnes inscrits","Enrolled learners",10,500,10,110),
 f("tuition","Precio matrícula (€)","Preu matrícula (€)","Tuition fee (€)",50,5000,50,950,"eur"),
 f("teachers","Horas de docencia","Hores de docència","Teaching hours",15,700,15,170,"hours"),
 f("hourCost","Coste hora docente (€)","Cost hora docent (€)","Teaching hourly cost (€)",15,170,5,60,"eur"),
 f("materials","Material por alumno (€)","Material per alumne (€)","Materials per student (€)",0,450,10,80,"eur"),
 f("fixed","Coste fijo de la edición (€)","Cost fix de l'edició (€)","Fixed course delivery cost (€)",500,50000,500,9000,"eur"),
 f("capacity","Plazas máximas ofertables","Places màximes ofertables","Maximum available seats",20,600,10,140)
 ]},
 edEnroll:{title:L("Demanda y cupos por convocatoria","Demanda i places per convocatòria","Intake demand and seat planning"),inputs:[
 f("inquiries","Consultas de posibles alumnos","Consultes de possibles alumnes","Prospective learner inquiries",100,15000,100,2400),
 f("qualified","Consultas de elegibilidad estimada (%)","Consultes d'elegibilitat estimada (%)","Eligible inquiry share (%)",20,100,5,65,"pct"),
 f("convert","Matrícula hipotética por elegible (%)","Matrícula hipotètica per elegible (%)","Assumed enrollment conversion (%)",5,90,5,30,"pct"),
 f("dropoff","No incorporaciones tras matrícula (%)","No incorporacions després de matrícula (%)","Assumed pre-start withdrawals (%)",0,45,5,12,"pct"),
 f("seats","Plazas disponibles","Places disponibles","Available seats",50,2000,50,300),
 f("newSeats","Plazas nuevas posibles","Places noves possibles","Additional seats available",0,700,25,160),
 f("unitValue","Valor medio por matrícula (€)","Valor mitjà per matrícula (€)","Average enrollment revenue (€)",100,10000,100,1900,"eur")
 ]},
 edSupport:{title:L("Soporte académico-administrativo y respuesta","Suport acadèmic-administratiu i resposta","Student support request backlog"),inputs:[
 f("backlog","Consultas pendientes","Consultes pendents","Starting requests backlog",0,1400,50,170),
 f("arrivals","Solicitudes por semana","Sol·licituds per setmana","Weekly support requests",30,1200,30,360),
 f("staff","Personas del equipo de soporte","Persones equip suport","Support staff",1,45,1,6),
 f("hours","Horas disponibles/persona","Hores disponibles/persona","Productive hours per person",10,45,5,28,"hours"),
 f("handle","Minutos por consulta","Minuts per consulta","Minutes per support request",3,120,3,32,"minutes"),
 f("extra","Refuerzo de personas","Reforç de persones","Additional staff",0,25,1,4),
 f("extraCost","Coste semanal del refuerzo (€)","Cost setmanal del reforç (€)","Extra staff weekly cost (€)",200,2500,50,720,"eur"),
 f("pendingCost","Penalización por consulta no respondida (€)","Penalització per consulta pendent (€)","Backlog item penalty (€)",5,180,5,45,"eur")
 ]},
 edResources:{title:L("Cobertura docente por asignatura","Cobertura docent per assignatura","Teacher workload and subject capacity"),inputs:[
 f("core","Horas necesarias asignatura principal","Hores necessàries assignatura principal","Core subject required hours",40,650,20,260,"hours"),
 f("lab","Horas necesarias laboratorio","Hores necessàries laboratori","Lab teaching required hours",20,500,20,170,"hours"),
 f("support","Horas de tutorías y apoyo","Hores de tutories i suport","Tutoring hours needed",20,450,20,130,"hours"),
 f("coreTeachers","Docentes teóricos disponibles","Docents teòrics disponibles","Core teachers available",1,20,1,5),
 f("labTeachers","Docentes de laboratorio","Docents de laboratori","Laboratory teachers available",1,15,1,3),
 f("flexTeachers","Docentes mixtos habilitados","Docents mixtos habilitats","Cross-qualified teachers",0,18,1,2),
 f("hours","Horas por docente","Hores per docent","Hours per teacher",15,45,5,35,"hours"),
 f("unservedCost","Coste por hora docente no cubierta (€)","Cost per hora docent sense cobrir (€)","Uncovered teaching hour cost (€)",20,180,5,75,"eur")
 ]}
};
function engagement(p){
 const signal=(p.attend+p.platform)/200; // descriptive aggregate only, not individual risk
 const estimated=p.enrolled*p.baseLeave/100;
 const avoided=estimated*p.outreach/100*p.effect/100;
 const finalLeave=estimated-avoided;
 return out([
 m("retention",100*(p.enrolled-finalLeave)/p.enrolled,"pct"),
 m("dropout",finalLeave),m("delta",avoided),
 m("engagement",signal*100,"pct")
 ],vis("bar",["Sin acompañamiento","Apoyo voluntario"],[sr("dropout",[estimated,finalLeave]),sr("retained",[p.enrolled-estimated,p.enrolled-finalLeave])]),
 "Se aplica a una tasa general de abandono la participación voluntaria y una eficacia hipotética del apoyo. Asistencia y actividad LMS son indicadores agregados, NO predictores individuales.",
 "No hay datos de estudiantes identificables, etiquetado de riesgo, asignación automatizada de apoyos o evaluación causal de intervención.",
 [["Alumnado de grupo",p.enrolled],["Abandonos de referencia",rnd(estimated)],["Abandonos con apoyo",rnd(finalLeave)],["Asistencia media (%)",p.attend]]);
}
function timetable(p){
 const need=[p.groupsA,p.groupsB,p.groupsC],total=sum(need);
 const cap=Math.min(p.rooms,p.teachers)*p.slots;
 const specialCap=Math.min(p.specialRooms,p.rooms,p.teachers)*p.slots;
 const c=Math.min(p.groupsC,specialCap),rest=cap-c;
 const a=Math.min(p.groupsA,rest),b=Math.min(p.groupsB,Math.max(0,rest-a));
 const assigned=[a,b,c],missed=total-sum(assigned);
 return out([
 m("service",100*sum(assigned)/total,"pct"),m("shortage",missed),
 m("rooms",p.rooms),m("utilisation",100*sum(assigned)/Math.max(1,cap),"pct")
 ],vis("bar",["Tipo A","Tipo B","Tipo C"],[sr("target",need),sr("actual",assigned)]),
 "La capacidad semanal se limita por número de aulas y docentes por franja. La modalidad C reserva primero aulas equipadas.",
 "No diseña horarios reales ni gestiona conflictos individuales de calendario, permisos docentes, accesibilidad o condiciones laborales.",
 [["Sesiones cubiertas",sum(assigned)],["Sesiones sin aula/docente",missed],["Sesiones posibles por semana",cap],["Sesiones de C con sala",c]]);
}
function course(p){
 const served=Math.min(p.students,p.capacity);
 const gross=served*p.tuition,variable=served*p.materials;
 const expense=p.teachers*p.hourCost+p.fixed+variable;
 const profit=gross-expense;
 const breakEven=(p.tuition-p.materials)>0?Math.ceil((p.teachers*p.hourCost+p.fixed)/(p.tuition-p.materials)):null;
 return out([
 m("profit",profit,"eur"),m("margin",100*profit/Math.max(1,gross),"pct"),
 m("cost",expense,"eur"),m("service",100*served/Math.max(1,p.students),"pct")
 ],vis("bar",["Ingresos","Docencia","Material","Costes fijos"],[sr("amount",[gross,p.teachers*p.hourCost,variable,p.fixed])],"eur"),
 "Ingresos por matrículas admitidas menos material variable, horas de docencia y gastos fijos por edición.",
 "No se representan becas, impuestos, financiación pública, acreditación docente ni calidad educativa.",
 [["Matrículas servidas",served],["Punto de equilibrio (plazas)",breakEven??"No alcanza equilibrio"],["Coste total curso (€)",rnd(expense)],["Contribución (€)",rnd(profit)]],
 profit<0?"El curso no cubre sus costes bajo los supuestos indicados.":"");
}
function enrollment(p){
 const projected=p.inquiries*p.qualified/100*p.convert/100*(1-p.dropoff/100);
 const base=Math.min(projected,p.seats),expanded=Math.min(projected,p.seats+p.newSeats);
 const selected=expanded>base?expanded:base;
 return out([
 m("enrolled",selected),m("shortage",Math.max(0,projected-selected)),
 m("revenue",selected*p.unitValue,"eur"),m("delta",(selected-base)*p.unitValue,"eur")
 ],vis("bar",["Demanda","Plazas actuales","Con ampliación"],[sr("volume",[projected,base,expanded])]),
 "Embudo agregado de consultas, elegibilidad hipotética, conversión y renuncias. Plazas finales limitadas por aforo de convocatoria.",
 "El modelo no decide admisiones ni clasifica alumnos; no está calibrado y sus conversiones son suposiciones.",
 [["Alumnos esperados",rnd(projected)],["Matriculados sin ampliar",rnd(base)],["Matriculados con ampliación",rnd(expanded)],["Ingresos brutos del escenario (€)",rnd(selected*p.unitValue)]]);
}
function support(p){
 const simulate=added=>{
  const available=(p.staff+(added?p.extra:0))*p.hours*60/p.handle;
  let backlog=p.backlog;const values=[];
  for(let i=0;i<6;i++){backlog=Math.max(0,backlog+p.arrivals-available);values.push(backlog);}
  return {values,backlog,capacity:available,cost:backlog*p.pendingCost+(added?p.extra*p.extraCost*6:0)};
 };
 const base=simulate(false),expanded=simulate(true),selected=expanded.cost<base.cost?expanded:base;
 return out([
 m("backlog",selected.backlog),m("service",100*(p.backlog+6*p.arrivals-selected.backlog)/(p.backlog+6*p.arrivals),"pct"),
 m("cost",selected.cost,"eur"),m("delta",base.cost-selected.cost,"eur")
 ],vis("line",["S1","S2","S3","S4","S5","S6"],[sr("reference",base.values),sr("scenario",selected.values)]),
 "Proyección de cola semanal de solicitudes administrativas con capacidad por horas de equipo y refuerzo opcional.",
 "Sin prioridades individuales, datos personales, riesgos educativos ni disponibilidad real de personal.",
 [["Solicitudes en cola inicial",p.backlog],["Cola final sin refuerzo",rnd(base.backlog)],["Cola final con refuerzo",rnd(expanded.backlog)],["Capacidad del equipo elegido",rnd(selected.capacity)]]);
}
function resources(p){
 const needs=[p.core,p.lab,p.support],capacity=[p.coreTeachers*p.hours,p.labTeachers*p.hours,0];
 let flex=p.flexTeachers*p.hours;
 const delivered=[Math.min(needs[0],capacity[0]),Math.min(needs[1],capacity[1]),0];
 // Only genuinely cross-qualified staff can cover remaining core/lab needs; tutoring may use remaining general staff.
 for(const i of [1,0,2]){
  const remaining=Math.max(0,needs[i]-delivered[i]);
  const used=Math.min(flex,remaining);
  delivered[i]+=used;flex-=used;
 }
 const unmet=sum(needs)-sum(delivered);
 return out([
 m("service",100*sum(delivered)/sum(needs),"pct"),m("shortage",unmet,"hours"),
 m("cost",unmet*p.unservedCost,"eur"),m("hours",sum(delivered),"hours")
 ],vis("bar",["Teoría","Laboratorio","Tutorías"],[sr("target",needs),sr("actual",delivered)]),
 "Se reservan horas de docentes especializados y se reparte capacidad adicional habilitada entre laboratorio, teoría y tutorías.",
 "Habilidades, habilitaciones y restricciones legales son simplificadas; no se asignan personas ni alumnos reales.",
 [["Horas docentes requeridas",sum(needs)],["Horas docentes cubiertas",rnd(sum(delivered))],["Horas sin cobertura",rnd(unmet)],["Capacidad flexible remanente",rnd(flex)]]);
}
export const educationCalculators={edEngagement:engagement,edTimetable:timetable,edCourse:course,edEnroll:enrollment,edSupport:support,edResources:resources};
