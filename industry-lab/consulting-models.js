/* SC13 professional services: simulated project economics and delivery decisions.
 * No real client, employee, deal, or partner data. Forecast weights are assumptions.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const sr=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limitations,table,warning="")=>({metrics,visual,insight:formula,formula,limitations,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=a=>a.reduce((x,y)=>x+y,0);
export const consultingModels={
 csProjects:{title:L("Margen real de proyectos a precio cerrado","Marge real de projectes a preu tancat","Fixed-fee project profitability"),inputs:[
 f("fee","Honorarios pactados (€)","Honoraris pactats (€)","Contracted fee (€)",5000,180000,2500,42000,"eur"),
 f("planned","Horas previstas","Hores previstes","Planned delivery hours",40,1500,20,420,"hours"),
 f("actual","Horas ejecutadas","Hores executades","Actual delivery hours",40,2200,20,540,"hours"),
 f("hourCost","Coste completo hora (€)","Cost complet hora (€)","Fully loaded hourly cost (€)",20,180,5,63,"eur"),
 f("external","Gasto externo (€)","Despesa externa (€)","Outside subcontracting (€)",0,45000,1000,5600,"eur"),
 f("writeOff","Horas no facturables adicionales","Hores no facturables addicionals","Additional non-billable hours",0,400,10,65,"hours")
 ]},
 csCapacity:{title:L("Capacidad por especialidad y trabajo pendiente","Capacitat per especialitat i feina pendent","Skill-constrained staffing capacity"),inputs:[
 f("dataPeople","Consultores de datos","Consultors de dades","Data consultants",1,20,1,5),
 f("engineeringPeople","Ingenieros de software","Enginyers de programari","Software engineers",1,20,1,4),
 f("businessPeople","Consultores funcionales","Consultors funcionals","Business analysts",1,20,1,3),
 f("weeklyHours","Horas productivas por persona/semana","Hores productives per persona/setmana","Productive hours per person-week",15,40,5,30,"hours"),
 f("dataLoad","Trabajo de datos requerido (h)","Treball de dades requerit (h)","Data hours needed",40,1000,20,320,"hours"),
 f("engineeringLoad","Trabajo software requerido (h)","Treball de programari requerit (h)","Engineering hours needed",40,1000,20,280,"hours"),
 f("businessLoad","Trabajo funcional requerido (h)","Treball funcional requerit (h)","Business analysis hours needed",40,1000,20,170,"hours"),
 f("externalHours","Refuerzo externo disponible (h)","Reforç extern disponible (h)","Available outside hours",0,500,20,120,"hours"),
 f("externalCost","Coste por hora externa (€)","Cost per hora externa (€)","Outside hourly cost (€)",35,220,5,105,"eur"),
 f("lateCost","Coste supuesto por hora pendiente (€)","Cost suposat per hora pendent (€)","Unmet-hour penalty (€)",20,250,5,120,"eur")
 ]},
 csPipeline:{title:L("Pipeline de proyectos y capacidad futura","Pipeline de projectes i capacitat futura","Project pipeline revenue and capacity"),inputs:[
 f("early","Oportunidades exploratorias","Oportunitats exploratòries","Discovery opportunities",0,50,1,13),
 f("proposal","Propuestas enviadas","Propostes enviades","Submitted proposals",0,45,1,8),
 f("negotiation","Negociaciones activas","Negociacions actives","Active negotiations",0,30,1,5),
 f("deal","Ticket medio posible (€)","Import mitjà possible (€)","Assumed average deal size (€)",3000,150000,1000,27000,"eur"),
 f("winEarly","Conversión hipotética de descubrimiento (%)","Conversió hipotètica de descobriment (%)","Assumed discovery conversion (%)",0,40,5,12,"pct"),
 f("winProposal","Conversión hipotética de propuesta (%)","Conversió hipotètica de proposta (%)","Assumed proposal conversion (%)",0,75,5,35,"pct"),
 f("winNegotiation","Conversión hipotética de negociación (%)","Conversió hipotètica de negociació (%)","Assumed negotiation conversion (%)",0,95,5,65,"pct"),
 f("avgHours","Horas medias por proyecto (h)","Hores mitjanes per projecte (h)","Delivery hours per won project",50,1500,50,350,"hours"),
 f("available","Capacidad futura (h)","Capacitat futura (h)","Available future hours",200,6000,100,2000,"hours")
 ]},
 csScope:{title:L("Cambios de alcance y control de coste","Canvis d'abast i control del cost","Scope changes and delivery overruns"),inputs:[
 f("fee","Precio base del contrato (€)","Preu base del contracte (€)","Base contract fee (€)",3000,150000,1000,34000,"eur"),
 f("hours","Horas base pactadas","Hores base pactades","Contracted delivery hours",30,1800,20,360,"hours"),
 f("requests","Solicitudes de cambio","Sol·licituds de canvi","Change requests",0,30,1,8),
 f("changeHours","Horas medias por cambio","Hores mitjanes per canvi","Average hours per change",2,70,2,20,"hours"),
 f("approved","Cambios aprobados y cobrados (%)","Canvis aprovats i cobrats (%)","Changes approved for billing (%)",0,100,5,35,"pct"),
 f("changeFee","Precio por cambio aprobado (€)","Preu per canvi aprovat (€)","Fee per approved change (€)",0,10000,250,1750,"eur"),
 f("hourCost","Coste por hora de ejecución (€)","Cost per hora d'execució (€)","Delivery hourly cost (€)",20,180,5,67,"eur")
 ]},
 csDocs:{title:L("Preparación documental y control de revisiones","Preparació documental i control de revisions","Document preparation and approval workload"),inputs:[
 f("documents","Entregables documentales","Entregables documentals","Document deliverables",20,1000,20,240),
 f("manualMinutes","Minutos de edición inicial","Minuts d'edició inicial","Manual drafting minutes",10,160,5,65,"minutes"),
 f("templated","Trabajo reutilizable con plantilla (%)","Feina reutilitzable amb plantilla (%)","Templatable proportion (%)",0,85,5,45,"pct"),
 f("saving","Ahorro en tareas plantillables (%)","Estalvi en tasques amb plantilla (%)","Savings on templatable tasks (%)",0,80,5,65,"pct"),
 f("errors","Entregables con incidencias (%)","Entregables amb incidències (%)","Assumed issue rate (%)",0,55,5,20,"pct"),
 f("rework","Minutos por revisión de error","Minuts per revisió d'error","Rework minutes per issue",5,120,5,40,"minutes"),
 f("hourCost","Coste revisión/hora (€)","Cost revisió/hora (€)","Review hourly cost (€)",15,130,5,48,"eur")
 ]},
 csPartner:{title:L("Encaje de un colaborador técnico de entrega","Encaix d'un col·laborador tècnic de lliurament","Technical delivery partner fit"),inputs:[
 f("work","Horas de proyecto requeridas","Hores requerides pel projecte","Project hours needed",100,2500,50,850,"hours"),
 f("internal","Horas disponibles internamente","Hores disponibles internament","Available internal hours",0,1800,50,450,"hours"),
 f("specialty","Necesidad de especialidad externa (%)","Necessitat d'especialitat externa (%)","Specialist outside-skill share (%)",0,100,5,60,"pct"),
 f("budget","Presupuesto máximo subcontrata (€)","Pressupost màxim subcontractació (€)","Outside delivery budget (€)",3000,180000,1000,58000,"eur"),
 f("rate","Tarifa externa hipotética (€ / h)","Tarifa externa hipotètica (€ / h)","Assumed external hourly rate (€)",30,200,5,95,"eur"),
 f("risk","Coste esperado de coordinación (%)","Cost esperat de coordinació (%)","Assumed coordination overhead (%)",0,40,5,15,"pct"),
 f("coverage","Cobertura de habilidad del partner (%)","Cobertura d'habilitat del partner (%)","Partner skill coverage (%)",20,100,5,80,"pct")
 ]}
};
function projects(p){
 const work=p.actual+p.writeOff;
 const cost=work*p.hourCost+p.external,baseline=p.planned*p.hourCost+p.external;
 const contribution=p.fee-cost;
 return out([
 m("profit",contribution,"eur"),m("margin",100*contribution/p.fee,"pct"),
 m("variance",cost-baseline,"eur"),m("hours",p.writeOff,"hours")
 ],vis("bar",["Presupuestado","Ejecutado"],[sr("cost",[baseline,cost]),sr("revenue",[p.fee,p.fee])],"eur"),
 "Ingreso pactado menos horas reales y no facturables al coste completo, más subcontratación. Compara coste previsto frente a ejecutado.",
 "No se calcula fiscalidad, cobro real, satisfacción ni modificaciones de contrato; las horas son simuladas.",
 [["Coste previsto (€)",rnd(baseline)],["Coste realizado (€)",rnd(cost)],["Horas totales ejecutadas",work],["Horas adicionales",Math.max(0,work-p.planned)]],
 contribution<0?"El proyecto presenta margen negativo bajo las hipótesis introducidas.":"");
}
function capacity(p){
 const groups=[["Data",p.dataPeople,p.dataLoad],["Software",p.engineeringPeople,p.engineeringLoad],["Funcional",p.businessPeople,p.businessLoad]];
 const load=groups.map(x=>x[2]),base=groups.map(x=>Math.min(x[2],x[1]*p.weeklyHours));
 const extra=groups.map((x,i)=>Math.max(0,x[2]-base[i]));
 const order=[0,1,2].sort((a,b)=>extra[b]-extra[a]);
 const add=[0,0,0];let remaining=p.externalHours;
 for(const j of order){add[j]=Math.min(remaining,extra[j]);remaining-=add[j];}
 const served=base.map((x,i)=>x+add[i]),missed=sum(load)-sum(served);
 const externalUsed=sum(add),cost=externalUsed*p.externalCost+missed*p.lateCost;
 return out([
 m("service",100*sum(served)/sum(load),"pct"),m("shortage",missed,"hours"),
 m("hours",externalUsed,"hours"),m("cost",cost,"eur")
 ],vis("bar",groups.map(x=>x[0]),[sr("target",load),sr("actual",served)]),
 "Capacidad por habilidad = consultores × horas disponibles; el refuerzo externo se reparte a las habilidades con mayor déficit.",
 "No asigna personas concretas, convenios, disponibilidad real, compatibilidad de equipos ni requisitos contractuales.",
 [["Demanda de horas",sum(load)],["Horas cubiertas",rnd(sum(served))],["Coste del refuerzo (€)",rnd(externalUsed*p.externalCost)],["Horas sin cubrir",rnd(missed)]]);
}
function pipeline(p){
 const qty=[p.early,p.proposal,p.negotiation],prob=[p.winEarly,p.winProposal,p.winNegotiation].map(v=>v/100);
 const wins=qty.map((q,i)=>q*prob[i]),weighted=sum(wins);
 const hours=weighted*p.avgHours,uncovered=Math.max(0,hours-p.available);
 return out([
 m("revenue",weighted*p.deal,"eur"),m("volume",weighted),
 m("utilisation",hours/Math.max(1,p.available)*100,"pct"),m("shortage",uncovered,"hours")
 ],vis("bar",["Descubrimiento","Propuesta","Negociación"],[sr("target",qty),sr("scenario",wins)]),
 "Número de oportunidades en cada etapa por probabilidad hipotética de cierre; se compara la entrega esperada con las horas futuras disponibles.",
 "Las probabilidades son elegidas por el usuario, sin historial de CRM ni calibración. No se garantiza cierre ni facturación futura.",
 [["Proyectos esperados",rnd(weighted)],["Carga de entrega esperada (h)",rnd(hours)],["Horas disponibles",p.available],["Horas sin cobertura",rnd(uncovered)]]);
}
function scope(p){
 const extra=p.requests*p.changeHours,approved=p.requests*p.approved/100;
 const extraRevenue=approved*p.changeFee;
 const baseProfit=p.fee-p.hours*p.hourCost;
 const finalRevenue=p.fee+extraRevenue;
 const finalCost=(p.hours+extra)*p.hourCost,finalProfit=finalRevenue-finalCost;
 return out([
 m("profit",finalProfit,"eur"),m("margin",100*finalProfit/Math.max(1,finalRevenue),"pct"),
 m("hours",extra,"hours"),m("delta",finalProfit-baseProfit,"eur")
 ],vis("bar",["Contrato base","Con cambios"],[sr("revenue",[p.fee,finalRevenue]),sr("cost",[p.hours*p.hourCost,finalCost])],"eur"),
 "Se añade esfuerzo medio de cambios y solo se facturan aquellos aprobados hipotéticamente. Margen final = ingreso base + cambios cobrados - coste total.",
 "No interpreta cláusulas del cliente ni decide si las ampliaciones pueden facturarse. Los cambios son promedios sintéticos.",
 [["Ingreso adicional pactable (€)",rnd(extraRevenue)],["Horas adicionales",rnd(extra)],["Resultado base (€)",rnd(baseProfit)],["Resultado con cambios (€)",rnd(finalProfit)]],
 finalProfit<baseProfit?"Los cambios reducen la rentabilidad del proyecto frente al alcance original.":"");
}
function docs(p){
 const before=p.documents*(p.manualMinutes+p.errors/100*p.rework)/60;
 const savedPrep=p.documents*p.manualMinutes/60*p.templated/100*p.saving/100;
 const after=before-savedPrep;
 return out([
 m("hours",after,"hours"),m("delta",(before-after)*p.hourCost,"eur"),
 m("exceptions",p.documents*p.errors/100),m("coverage",100*p.templated/100*p.saving/100,"pct")
 ],vis("bar",["Manual","Con plantillas"],[sr("hours",[before,after])],"hours"),
 "Solo reduce el tiempo de preparación de tareas plantillables; la revisión y corrección de errores permanece íntegra bajo supervisión humana.",
 "Las reglas no sustituyen aprobaciones profesionales ni certifican que un entregable sea correcto. No hay acceso a documentos reales.",
 [["Horas antes de reutilizar",rnd(before)],["Horas tras plantillas",rnd(after)],["Horas ahorradas",rnd(before-after)],["Errores esperados a revisar",rnd(p.documents*p.errors/100)]]);
}
function partner(p){
 const gap=Math.max(0,p.work-p.internal);
 const specialist=gap*p.specialty/100;
 const covered=Math.min(gap,specialist*p.coverage/100+(gap-specialist)*Math.min(1,p.coverage/100));
 const spend=covered*p.rate*(1+p.risk/100);
 const achievable=p.budget/(p.rate*(1+p.risk/100));
 const used=Math.min(covered,achievable);
 const missed=Math.max(0,gap-used),cost=used*p.rate*(1+p.risk/100);
 return out([
 m("service",100*(p.work-missed)/p.work,"pct"),m("hours",used,"hours"),
 m("cost",cost,"eur"),m("shortage",missed,"hours")
 ],vis("bar",["Trabajo previsto","Interno","Partner"],[sr("hours",[p.work,Math.min(p.work,p.internal),used])],"hours"),
 "Cobertura hipotética del proveedor = horas faltantes × porcentaje de habilidad. Se limita la colaboración a la inversión disponible y el coste de coordinación.",
 "Un porcentaje de ajuste técnico no acredita experiencia, disponibilidad ni solvencia de ningún colaborador. Requiere diligencia y acuerdo contractual.",
 [["Horas no cubiertas inicialmente",rnd(gap)],["Horas cubiertas por partner",rnd(used)],["Coste con coordinación (€)",rnd(cost)],["Presupuesto disponible (€)",p.budget]],
 missed>0?"La colaboración propuesta no cubre todas las horas demandadas; conviene revisar alcance y habilidades.":"");
}
export const consultingCalculators={csProjects:projects,csCapacity:capacity,csPipeline:pipeline,csScope:scope,csDocs:docs,csPartner:partner};
