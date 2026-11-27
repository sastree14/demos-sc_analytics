/* SC14 Field services and maintenance; all assets, distances and visits are synthetic.
 * No location tracking, regulated-work certification, safety dispatch or live SLA.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,formula,insight:formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=a=>a.reduce((s,v)=>s+v,0),min=(...v)=>Math.min(...v);
export const fieldServiceModels={
 svDispatch:{title:L("Asignación de técnicos según habilidad y carga","Assignació tècnics segons habilitat i càrrega","Technician dispatch by skills and capacity"),inputs:[
 f("electrical","Avisos eléctricos","Avisos elèctrics","Electrical jobs",10,220,5,68),
 f("mechanical","Avisos mecánicos","Avisos mecànics","Mechanical jobs",10,220,5,82),
 f("electricalStaff","Técnicos eléctricos","Tècnics elèctrics","Electrical technicians",1,25,1,5),
 f("mechanicalStaff","Técnicos mecánicos","Tècnics mecànics","Mechanical technicians",1,25,1,6),
 f("multiStaff","Técnicos polivalentes","Tècnics polivalents","Multi-skilled technicians",0,15,1,3),
 f("jobsPerTech","Órdenes por técnico y periodo","Ordres per tècnic i període","Jobs per technician per period",2,20,1,12),
 f("travel","Tiempo medio traslado por aviso (min)","Temps mitjà trasllat per avís (min)","Assumed drive minutes per job",10,100,5,35,"minutes"),
 f("lateCost","Coste de incumplimiento por orden (€)","Cost d'incompliment per ordre (€)","Cost of unserved job (€)",10,400,10,95,"eur")
 ]},
 svFirstFix:{title:L("Primera resolución y viajes repetidos","Primera resolució i visites repetides","First-time fix and repeat visits"),inputs:[
 f("orders","Avisos del periodo","Avisos del període","Service calls",20,1000,20,240),
 f("parts","Disponibilidad de repuesto adecuado (%)","Disponibilitat del recanvi adequat (%)","Correct spare availability (%)",10,100,5,74,"pct"),
 f("diagnostic","Diagnóstico correcto inicial (%)","Diagnòstic inicial correcte (%)","Correct initial diagnosis (%)",20,100,5,78,"pct"),
 f("skills","Competencia requerida cubierta (%)","Competència requerida coberta (%)","Required skill coverage (%)",30,100,5,90,"pct"),
 f("improve","Mejora en disponibilidad de piezas (p.p.)","Millora disponibilitat de recanvis (p.p.)","Spare availability improvement (pp)",0,30,5,15),
 f("repeatCost","Coste de segunda visita (€)","Cost de segona visita (€)","Repeat visit cost (€)",30,350,10,140,"eur"),
 f("upgradeCost","Coste del plan de repuestos (€)","Cost del pla de recanvis (€)","Spare stocking intervention cost (€)",0,15000,500,2400,"eur")
 ]},
 svPreventive:{title:L("Intervenciones preventivas por criticidad","Intervencions preventives per criticitat","Budgeted preventive maintenance by asset"),inputs:[
 f("assets","Equipos bajo mantenimiento","Equips amb manteniment","Assets covered",5,400,5,100),
 f("prob","Probabilidad de fallo por periodo (%)","Probabilitat de fallada per període (%)","Assumed failure probability (%)",2,50,2,18,"pct"),
 f("downtime","Horas por incidencia","Hores per incidència","Downtime hours per failure",1,80,1,15,"hours"),
 f("costHour","Coste por hora de parada (€)","Cost per hora d'aturada (€)","Downtime cost per hour (€)",50,2500,50,470,"eur"),
 f("preventCost","Coste por actuación preventiva (€)","Cost per actuació preventiva (€)","Cost per preventive service (€)",100,7000,100,1600,"eur"),
 f("efficacy","Reducción relativa de fallos (%)","Reducció relativa fallades (%)","Assumed risk reduction (%)",10,90,5,65,"pct"),
 f("budget","Presupuesto preventivo (€)","Pressupost preventiu (€)","Maintenance budget (€)",5000,250000,5000,65000,"eur")
 ]},
 svUrgent:{title:L("Urgencias y capacidad reservada","Urgències i capacitat reservada","Urgent repairs and buffer staffing"),inputs:[
 f("planned","Avisos planificados por día","Avisos planificats per dia","Planned daily jobs",10,140,5,68),
 f("urgent","Urgencias esperadas por día","Urgències esperades per dia","Expected daily urgent calls",0,85,5,26),
 f("techs","Técnicos disponibles","Tècnics disponibles","Available technicians",2,40,1,13),
 f("capacity","Avisos por técnico/día","Avisos per tècnic/dia","Jobs per technician-day",3,14,1,8),
 f("reserve","Técnicos reservados para urgencias","Tècnics reservats per urgències","Technicians reserved for emergencies",0,20,1,3),
 f("urgentCost","Penalización por urgencia pendiente (€)","Penalització urgència pendent (€)","Cost per unserved emergency (€)",50,800,25,230,"eur"),
 f("plannedCost","Penalización por planificado pendiente (€)","Penalització planificat pendent (€)","Cost per unserved scheduled job (€)",10,300,10,65,"eur")
 ]},
 svContract:{title:L("Contribución por contrato de mantenimiento","Contribució per contracte manteniment","Maintenance agreement contribution"),inputs:[
 f("clients","Número de contratos equivalentes","Nombre de contractes equivalents","Number of contracts",3,120,3,36),
 f("revenue","Cuota mensual por contrato (€)","Quota mensual per contracte (€)","Monthly contract fee (€)",150,6000,50,1350,"eur"),
 f("visits","Visitas por contrato/mes","Visites per contracte/mes","Visits per contract per month",1,24,1,7),
 f("serviceHours","Horas de trabajo por visita","Hores de feina per visita","Work hours per visit",0.5,7,0.5,2),
 f("travelKm","Km medios por visita","Km mitjans per visita","Average kilometres per visit",5,180,5,45),
 f("staffCost","Coste hora técnico (€)","Cost hora tècnic (€)","Technician hourly cost (€)",15,95,5,35,"eur"),
 f("kmCost","Coste por km (€)","Cost per km (€)","Travel cost per kilometre (€)",0.2,2.5,0.1,0.7,"eur"),
 f("partsCost","Repuestos por contrato/mes (€)","Recanvis per contracte/mes (€)","Spare costs per agreement/month (€)",0,2500,50,250,"eur")
 ]},
 svVans:{title:L("Repuestos en furgonetas y roturas de stock","Recanvis en furgonetes i trencaments d'estoc","Van stock and parts shortages"),inputs:[
 f("vans","Vehículos de servicio","Vehicles de servei","Service vans",1,35,1,9),
 f("capacity","Espacio por vehículo (unidades)","Espai per vehicle (unitats)","Stock spaces per vehicle",10,100,5,45),
 f("needA","Demanda esperada piezas A","Demanda esperada peces A","Expected part A needs",10,500,10,115),
 f("needB","Demanda esperada piezas B","Demanda esperada peces B","Expected part B needs",10,500,10,140),
 f("needC","Demanda esperada piezas C","Demanda esperada peces C","Expected part C needs",10,500,10,95),
 f("price","Coste medio de repuesto (€)","Cost mitjà de recanvi (€)","Average part unit cost (€)",5,180,5,48,"eur"),
 f("stockBudget","Presupuesto inmovilizado (€)","Pressupost immobilitzat (€)","Stock purchase budget (€)",2000,80000,1000,16000,"eur"),
 f("missCost","Coste por falta de repuesto (€)","Cost per manca de recanvi (€)","Cost per missing required part (€)",20,450,10,160,"eur")
 ]}
};
function dispatch(p){
 const capE=p.electricalStaff*p.jobsPerTech,capM=p.mechanicalStaff*p.jobsPerTech,flex=p.multiStaff*p.jobsPerTech;
 const e=Math.min(p.electrical,capE),mec=Math.min(p.mechanical,capM);
 let remain=flex,shortE=Math.max(0,p.electrical-e),shortM=Math.max(0,p.mechanical-mec);
 const ex=Math.min(shortE,remain);shortE-=ex;remain-=ex;
 const mx=Math.min(shortM,remain);shortM-=mx;
 const served=e+mec+ex+mx,missed=shortE+shortM;
 return out([
 m("service",100*served/(p.electrical+p.mechanical),"pct"),m("shortage",missed),
 m("cost",missed*p.lateCost,"eur"),m("hours",served*p.travel/60,"hours")
 ],vis("bar",["Electricidad","Mecánica"],[ser("target",[p.electrical,p.mechanical]),ser("actual",[e+ex,mec+mx])]),
 "El personal especialista cubre primero su tipología; la capacidad de técnicos polivalentes se utiliza sobre avisos restantes. El tiempo de viaje es una media ficticia.",
 "No se asignan técnicos reales, no hay cartografía ni seguridad o habilitación de trabajos reglamentados. SLA es solo un proxy de demanda no atendida.",
 [["Avisos eléctricos pendientes",rnd(shortE)],["Avisos mecánicos pendientes",rnd(shortM)],["Avisos atendidos",rnd(served)],["Traslado acumulado ilustrativo (h)",rnd(served*p.travel/60)]]);
}
function firstFix(p){
 const chance=p.parts/100*p.diagnostic/100*p.skills/100;
 const improvedParts=Math.min(100,p.parts+p.improve);
 const newChance=improvedParts/100*p.diagnostic/100*p.skills/100;
 const repeat=p.orders*(1-chance),after=p.orders*(1-newChance);
 const beforeCost=repeat*p.repeatCost,afterCost=after*p.repeatCost+p.upgradeCost;
 const deploy=afterCost<beforeCost,chosen=deploy?newChance:chance;
 return out([
 m("firstFix",100*chosen,"pct"),m("repeat",p.orders*(1-chosen)),
 m("delta",beforeCost-Math.min(beforeCost,afterCost),"eur"),m("cost",Math.min(beforeCost,afterCost),"eur")
 ],vis("bar",["Actual","Con repuestos"],[ser("repeat",[repeat,after])]),
 "Probabilidad conjunta supuesta de tener piezas, diagnóstico y capacidades necesarias. Se compara reducción de segunda visita con coste de mejorar disponibilidad.",
 "Independencia asumida, sin registros reales, criterios de seguridad o autorización de intervención en sistemas críticos.",
 [["Segundas visitas sin mejora",rnd(repeat)],["Segundas visitas con mejora",rnd(after)],["Coste de referencia (€)",rnd(beforeCost)],["¿Mejora seleccionada?",deploy?"Sí":"No"]]);
}
function preventive(p){
 const groups=[.65,1,1.45],qty=groups.map(x=>p.assets*x/3);
 const baseline=qty.map((n,i)=>n*p.prob/100*groups[i]*p.downtime*p.costHour);
 const withPrevention=baseline.map((x,i)=>x*(1-p.efficacy/100)+qty[i]*p.preventCost);
 const choose=groups.map((_,i)=>({i,gain:baseline[i]-withPrevention[i],cost:qty[i]*p.preventCost})).filter(x=>x.gain>0).sort((a,b)=>b.gain/b.cost-a.gain/a.cost);
 let budget=p.budget,selected=[false,false,false];
 for(const x of choose)if(x.cost<=budget){selected[x.i]=true;budget-=x.cost;}
 const remaining=baseline.map((x,i)=>selected[i]?x*(1-p.efficacy/100):x);
 const total=sum(remaining)+sum(selected.map((x,i)=>x?qty[i]*p.preventCost:0));
 return out([
 m("downtime",sum(remaining)/p.costHour,"hours"),m("delta",sum(baseline)-total,"eur"),
 m("cost",total,"eur"),m("interventions",sum(selected.map((v,i)=>v?qty[i]:0)))
 ],vis("bar",["Baja","Media","Alta"],[ser("reference",baseline),ser("scenario",remaining)],"eur"),
 "Equipos sintéticos en tres bandas de criticidad. Se seleccionan grupos de mantenimiento que presentan reducción neta de coste esperado con presupuesto disponible.",
 "Probabilidades independientes, coste horario y eficacia de prevención inventados; no existe diagnóstico predictivo ni conexión a sensores.",
 [["Coste sin prevención (€)",rnd(sum(baseline))],["Coste tras prevención (€)",rnd(total)],["Presupuesto restante (€)",rnd(budget)],["Grupos seleccionados",selected.filter(Boolean).length]]);
}
function urgent(p){
 const dailyCap=p.techs*p.capacity,urgentSlots=Math.min(dailyCap,p.reserve*p.capacity);
 const directUrgent=Math.min(p.urgent,urgentSlots),fromRest=Math.min(Math.max(0,p.urgent-directUrgent),Math.max(0,dailyCap-urgentSlots));
 const leftover=Math.max(0,dailyCap-directUrgent-fromRest);
 const regular=Math.min(p.planned,leftover),urgentDone=directUrgent+fromRest;
 const missedUrgent=p.urgent-urgentDone,missedPlanned=p.planned-regular;
 const cost=missedUrgent*p.urgentCost+missedPlanned*p.plannedCost;
 const baselineUrgent=Math.min(p.urgent,Math.max(0,dailyCap-Math.min(p.planned,dailyCap)));
 const baselineCost=(p.urgent-baselineUrgent)*p.urgentCost+Math.max(0,p.planned-dailyCap)*p.plannedCost;
 return out([
 m("service",100*(urgentDone+regular)/(p.urgent+p.planned),"pct"),m("shortage",missedUrgent+missedPlanned),
 m("cost",cost,"eur"),m("delta",baselineCost-cost,"eur")
 ],vis("bar",["Planificados","Urgentes"],[ser("target",[p.planned,p.urgent]),ser("actual",[regular,urgentDone])]),
 "La capacidad diaria se reparte priorizando urgencias, con reserva explícita. Se compara el coste de dejar sin servir cada tipología frente a una referencia de planificados primero.",
 "El concepto de urgencia es exclusivamente operativo; no realiza triaje de emergencias ni calcula tiempos reales de llegada por ruta.",
 [["Urgencias pendientes",rnd(missedUrgent)],["Planificados pendientes",rnd(missedPlanned)],["Capacidad diaria",dailyCap],["Huecos reservados para urgencias",urgentSlots]]);
}
function contract(p){
 const fees=p.clients*p.revenue;
 const per=p.visits*(p.serviceHours*p.staffCost+p.travelKm*p.kmCost)+p.partsCost;
 const cost=p.clients*per,profit=fees-cost;
 return out([
 m("profit",profit,"eur"),m("margin",100*profit/fees,"pct"),
 m("cost",cost,"eur"),m("unitCost",per,"eur")
 ],vis("bar",["Ingresos","Servicio","Repuestos"],[ser("amount",[fees,p.clients*(per-p.partsCost),p.clients*p.partsCost])],"eur"),
 "Contribución mensual = cuotas de contratos − visitas × (horas y desplazamientos) − repuestos. Las mismas condiciones se aplican a todos los contratos ficticios.",
 "No representa impuestos, equipos distintos, condiciones reales de SLA, penalizaciones contractuales o aprovisionamiento.",
 [["Coste por contrato (€)",rnd(per)],["Visitas mensuales esperadas",p.clients*p.visits],["Ingresos contratos (€)",rnd(fees)],["Resultado neto del escenario (€)",rnd(profit)]],
 profit<0?"El coste de prestar el servicio supera las cuotas mensuales supuestas.":"");
}
function vans(p){
 const demand=[p.needA,p.needB,p.needC],total=Math.min(p.vans*p.capacity,Math.floor(p.stockBudget/p.price));
 const weights=[1.35,1,1.65],placed=[0,0,0],order=[2,0,1],remaining=total;
 for(const idx of order){placed[idx]=Math.min(remaining,demand[idx]);remaining-=placed[idx];}
 const short=demand.map((v,i)=>Math.max(0,v-placed[i])),missed=sum(short);
 return out([
 m("service",100*(sum(placed))/sum(demand),"pct"),m("shortage",missed),
 m("cost",sum(placed)*p.price+missed*p.missCost,"eur"),m("stock",sum(placed))
 ],vis("bar",["Pieza A","Pieza B","Pieza C"],[ser("target",demand),ser("actual",placed)]),
 "Asignación de unidades de repuesto entre tres referencias según prioridad supuesta, limitada por capacidad física de vehículos y presupuesto.",
 "No hay predicción de averías, caducidad, compatibilidad, inventario real ni reparto individual entre furgonetas.",
 [["Espacio total en vehículos",p.vans*p.capacity],["Unidades compradas",sum(placed)],["Presupuesto utilizado (€)",rnd(sum(placed)*p.price)],["Unidades sin cubrir",missed]]);
}
export const fieldServiceCalculators={svDispatch:dispatch,svFirstFix:firstFix,svPreventive:preventive,svUrgent:urgent,svContract:contract,svVans:vans};
