/* SC-Analytics Industry Lab — synthetic, transparent quantitative scenario models.
 * All results illustrate mathematical mechanisms only. No calibrated predictions,
 * observed customer savings, regulated decisions, or production recommendations.
 */
import {logisticsModels, logisticsCalculators} from "./logistics-models.js";
import {wholesaleModels, wholesaleCalculators} from "./wholesale-models.js";
import {manufacturingModels, manufacturingCalculators} from "./manufacturing-models.js";
import {foodModels, foodCalculators} from "./food-models.js";
import {pharmaModels, pharmaCalculators} from "./pharma-models.js";
import {restaurantModels,restaurantCalculators} from "./restaurant-models.js";
import {hotelModels,hotelCalculators} from "./hotel-models.js";
import {retailModels,retailCalculators} from "./retail-models.js";
import {clinicModels,clinicCalculators} from "./clinic-models.js";
import {constructionModels,constructionCalculators} from "./construction-models.js";
import {realEstateModels,realEstateCalculators} from "./real-estate-models.js";
import {financeInsuranceModels,financeInsuranceCalculators} from "./finance-insurance-models.js";
const L=(es,ca,en)=>({es,ca,en});
const field=(key,label,min,max,step,value,unit="number")=>({key,label,min,max,step,value,unit});
const metric=(key,value,unit="number")=>({key,value:Number.isFinite(value)?value:0,unit});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number(v)||0));
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const rnd=(v,d=0)=>Math.round(v*10**d)/10**d;
const chart=(type,labels,series,unit="number")=>({type,labels,series,unit});
const output=(metrics,visual,insight,formula,limitations,table=[],warning="")=>({metrics,visual,insight,formula,limitations,table,warning});
const f=(key,es,ca,en,min,max,step,value,unit)=>field(key,L(es,ca,en),min,max,step,value,unit);
const metricTitles={
 exposure:L("Exposición en seguimiento","Exposició en seguiment","Aggregate exposure on watch"),
 loss:L("Pérdida agregada ilustrativa","Pèrdua agregada il·lustrativa","Illustrative aggregate loss"),
 reserve:L("Reserva agregada de estrés ilustrativo","Reserva agregada d'estrès il·lustratiu","Illustrative stressed aggregate reserve"),
 frequencyCount:L("Siniestros esperados","Sinistres esperats","Expected claim count"),

 noi:L("Resultado neto de explotación (NOI)","Resultat net d'explotació (NOI)","Net operating income (NOI)"),
 vacant:L("Unidades vacantes","Unitats vacants","Vacant units"),
 yield:L("Rendimiento anual sin apalancamiento","Rendiment anual sense palanquejament","Unlevered annual yield"),
 npv:L("Valor actual neto supuesto","Valor actual net suposat","Assumed net present value"),
 arrears:L("Cobros retrasados al cierre","Cobraments retardats al tancament","Outstanding delayed rent"),

 variance:L("Desviación restante frente a presupuesto","Desviació restant respecte al pressupost","Budget variance at completion"),

 cpi:L("Índice de rendimiento de coste (CPI)","Índex rendiment de cost (CPI)","Cost performance index (CPI)"),
 spi:L("Índice de rendimiento de plazo (SPI)","Índex rendiment del termini (SPI)","Schedule performance index (SPI)"),

 returns:L("Devoluciones esperadas","Devolucions esperades","Expected returns"),
 cac:L("Coste de adquisición por cliente","Cost de captació per client","Customer acquisition cost"),
 ltv:L("Contribución esperada por cliente","Contribució esperada per client","Expected contribution per customer"),
 payback:L("Compras equivalentes para recuperar CAC","Compres equivalents per recuperar CAC","First-purchase equivalents to recover CAC"),

 occupancy:L("Ocupación prevista","Ocupació prevista","Projected occupancy"),
 revpar:L("Ingreso por habitación disponible","Ingrés per habitació disponible","Revenue per available room"),
 roomCost:L("Coste por habitación ocupada","Cost per habitació ocupada","Cost per occupied room"),
 displaced:L("Noches individuales desplazadas","Nits individuals desplaçades","Displaced individual room nights"),

 "backlog":L("Cola de pedidos pendiente","Cua de comandes pendent","Outstanding order backlog"),

 backlog:L("Cola documental pendiente","Cua documental pendent","Document review backlog"),
 reviewerCost:L("Coste de refuerzo de revisores","Cost del reforç de revisors","Additional reviewer cost"),
 anomalies:L("Alertas sintéticas","Alertes sintètiques","Synthetic alerts"),
 reviewHours:L("Horas de revisión","Hores de revisió","Review hours"),
 maxZ:L("Desviación máxima estandarizada","Desviació màxima estandarditzada","Maximum standardised deviation"),

 waste:L("Unidades perdidas por caducidad","Unitats perdudes per caducitat","Units expired or wasted"),
 avoidedWaste:L("Merma evitada frente al plan base","Minva evitada respecte al pla base","Waste avoided versus baseline"),
 lateHours:L("Retraso total de entregas","Retard total de lliuraments","Delivery delay hours"),
 routeHours:L("Duración total de ruta","Durada total de ruta","Total route duration"),
 routeDistance:L("Kilómetros de ruta","Quilòmetres de ruta","Route distance"),

 lateness:L("Retraso acumulado","Retard acumulat","Total lateness"),
 changeovers:L("Cambios de familia","Canvis de família","Family changeovers"),
 makespan:L("Finalización de órdenes","Finalització d'ordres","Schedule completion"),
 produced:L("Lotes o unidades planificadas","Lots o unitats planificades","Planned batches or units"),
 shortage:L("Unidades no cubiertas","Unitats no cobertes","Unmet units"),
 overtimeCost:L("Coste de horas extra","Cost d'hores extra","Overtime cost"),
 downtime:L("Parada esperada","Aturada esperada","Expected downtime"),
 prevented:L("Paradas evitadas","Aturades evitades","Downtime avoided"),
 interventions:L("Equipos intervenidos","Equips intervinguts","Assets maintained"),
 qualityYield:L("Rendimiento esperado","Rendiment esperat","Expected yield"),
 scrap:L("Defectos esperados","Defectes esperats","Expected defects"),
 falseReject:L("Falsos rechazos","Rebuigs falsos","False rejects"),
 missedDefects:L("Defectos no detectados","Defectes no detectats","Missed defects"),
 shiftedKWh:L("Energía desplazada","Energia desplaçada","Shifted energy"),

transferUnits:L("Unidades transferidas","Unitats transferides","Transferred units"),
external:L("Entregas subcontratadas","Lliuraments subcontractats","Subcontracted deliveries"),
emptyKm:L("Kilómetros en vacío","Quilòmetres en buit","Empty kilometres"),
backhaulShare:L("Retornos cargados","Retorns carregats","Loaded backhaul share"),
service:L("Demanda atendida","Demanda atesa","Demand fulfilled"),
unserved:L("Unidades pendientes","Unitats pendents","Unserved units"),
vehicles:L("Recursos asignados","Recursos assignats","Resources allocated"),
netValue:L("Valor del plan (€)","Valor del pla (€)","Plan value (€)"),
cost:L("Coste calculado","Cost calculat","Modelled cost"),
delta:L("Diferencia frente a referencia","Diferència respecte a referència","Difference vs reference"),
volume:L("Volumen estimado","Volum estimat","Estimated volume"),
next:L("Próximo periodo","Proper període","Next period"),
peak:L("Pico previsto","Pic previst","Projected peak"),
breach:L("Brecha de capacidad","Bretxa de capacitat","Capacity gap"),
revenue:L("Ingresos estimados","Ingressos estimats","Estimated revenue"),
profit:L("Contribución estimada","Contribució estimada","Estimated contribution"),
margin:L("Margen de contribución","Marge de contribució","Contribution margin"),
order:L("Pedido recomendado en el modelo","Comanda recomanada al model","Model-recommended order"),
shortage:L("Demanda esperada no cubierta","Demanda esperada no coberta","Expected unmet demand"),
stock:L("Existencias esperadas al cierre","Existències esperades al tancament","Expected ending stock"),
wait:L("Espera estimada","Espera estimada","Estimated waiting"),
staff:L("Recursos de servicio","Recursos de servei","Service resources"),
utilisation:L("Utilización","Utilització","Utilisation"),
output:L("Unidades planificadas","Unitats planificades","Scheduled units"),
defects:L("Defectos estimados","Defectes estimats","Expected defects"),
risk:L("Riesgo ilustrativo","Risc il·lustratiu","Illustrative risk"),
asset:L("Intervenciones propuestas","Intervencions proposades","Proposed interventions"),
energy:L("Consumo en horas punta","Consum en hores punta","Peak-period consumption"),
savings:L("Diferencia de coste","Diferència de cost","Cost difference"),
exceptions:L("Excepciones a revisar","Excepcions per revisar","Exceptions to review"),
hours:L("Horas manuales estimadas","Hores manuals estimades","Estimated manual hours"),
coverage:L("Cobertura prevista","Cobertura prevista","Projected coverage"),
tp:L("Casos positivos detectados","Casos positius detectats","Positive cases detected"),
fp:L("Revisiones innecesarias","Revisions innecessàries","Unnecessary reviews"),
fn:L("Casos positivos no detectados","Casos positius no detectats","Missed positive cases"),
precision:L("Precisión positiva","Precisió positiva","Positive precision"),
mrr:L("Ingreso recurrente final","Ingrés recurrent final","Final recurring revenue"),
churn:L("Clientes perdidos en el horizonte","Clients perduts a l'horitzó","Customers lost over horizon"),
budget:L("Presupuesto disponible","Pressupost disponible","Available budget"),
cash:L("Caja al final del horizonte","Caixa al final de l'horitzó","Cash at end of horizon"),
minimum:L("Caja mínima prevista","Caixa mínima prevista","Minimum projected cash"),
selected:L("Iniciativas seleccionadas","Iniciatives seleccionades","Selected initiatives")
};
export const metricLabel=(key,language="es")=>(metricTitles[key]||L(key,key,key))[language]||key;
const series=(key,values)=>({key,values:values.map(x=>rnd(x,2))});
const minPrice=1;
const models={...logisticsModels,...wholesaleModels,...manufacturingModels,...foodModels,...pharmaModels,...restaurantModels,...hotelModels,...retailModels,...clinicModels,...constructionModels,...realEstateModels,...financeInsuranceModels,
fleet:{
title:L("Planificación de recursos y demanda","Planificació de recursos i demanda","Resource and demand planning"),
inputs:[
f("resources","Recursos disponibles","Recursos disponibles","Available resources",3,26,1,12),
f("perResource","Unidades por recurso","Unitats per recurs","Units per resource",4,28,1,13),
f("demand","Demanda de servicios","Demanda de serveis","Service demand",70,500,10,260),
f("unitCost","Coste por recurso (€)","Cost per recurs (€)","Cost per resource (€)",100,1200,25,450,"eur"),
f("unservedCost","Coste por servicio no atendido (€)","Cost per servei no atès (€)","Cost per unserved unit (€)",20,220,10,80,"eur"),
f("incidents","Recursos fuera de servicio","Recursos fora de servei","Resources unavailable",0,8,1,0)
]},
forecast:{
title:L("Previsión y planificación de capacidad","Previsió i planificació de capacitat","Forecasting and capacity planning"),
inputs:[
f("base","Demanda actual por periodo","Demanda actual per període","Current period demand",50,4000,25,550),
f("trend","Tendencia prevista (%)","Tendència prevista (%)","Expected trend (%)",-18,30,1,5,"pct"),
f("season","Estacionalidad (%)","Estacionalitat (%)","Seasonality (%)",0,35,1,10,"pct"),
f("horizon","Periodos a simular","Períodes a simular","Forecast periods",3,12,1,8),
f("capacity","Capacidad por periodo","Capacitat per període","Capacity per period",50,4500,25,650),
f("uncertainty","Variación esperada (%)","Variació esperada (%)","Assumed variability (%)",5,40,1,15,"pct")
]},
pricing:{
title:L("Precio, demanda y contribución","Preu, demanda i contribució","Price, demand and contribution"),
inputs:[
f("basePrice","Precio de referencia (€)","Preu de referència (€)","Baseline price (€)",15,500,5,100,"eur"),
f("unitCost","Coste variable unitario (€)","Cost variable unitari (€)","Variable unit cost (€)",5,350,5,45,"eur"),
f("baseVolume","Unidades a precio de referencia","Unitats al preu de referència","Units at baseline price",50,6000,50,750),
f("elasticity","Elasticidad de demanda (supuesto)","Elasticitat de demanda (supòsit)","Demand elasticity (assumption)",0.2,3,0.1,1.3),
f("change","Cambio de precio (%)","Canvi de preu (%)","Price change (%)",-35,35,1,5,"pct")
]},
inventory:{
title:L("Inventario, reposición y nivel de servicio","Inventari, reposició i nivell de servei","Inventory, replenishment and service level"),
inputs:[
f("demand","Demanda media semanal","Demanda mitjana setmanal","Mean weekly demand",30,2400,10,440),
f("variability","Variabilidad de demanda (%)","Variabilitat de demanda (%)","Demand variability (%)",5,55,1,22,"pct"),
f("onHand","Unidades disponibles","Unitats disponibles","Units on hand",0,1200,10,190),
f("lead","Plazo de reposición (semanas)","Termini de reposició (setmanes)","Replenishment lead time (weeks)",1,5,1,2),
f("holding","Coste de exceso por unidad (€)","Cost d'excés per unitat (€)","Excess unit cost (€)",1,30,1,6,"eur"),
f("shortage","Coste de falta por unidad (€)","Cost de falta per unitat (€)","Unmet unit cost (€)",5,150,5,45,"eur")
]},
queue:{
title:L("Servicio, colas y recursos","Servei, cues i recursos","Service queues and capacity"),
inputs:[
f("arrivals","Solicitudes por hora","Sol·licituds per hora","Arrivals per hour",5,210,5,58),
f("rate","Servicios por recurso y hora","Serveis per recurs i hora","Services per resource-hour",2,20,1,8),
f("available","Recursos máximos","Recursos màxims","Maximum resources",2,30,1,15),
f("wage","Coste por recurso y hora (€)","Cost per recurs i hora (€)","Cost per resource-hour (€)",10,90,5,28,"eur"),
f("waitingCost","Coste por hora de espera (€)","Cost per hora d'espera (€)","Cost per waiting hour (€)",5,110,5,35,"eur")
]},
production:{
title:L("Producción bajo recursos limitados","Producció amb recursos limitats","Production under resource constraints"),
inputs:[
f("hours","Horas máquina disponibles","Hores màquina disponibles","Available machine hours",60,340,10,165),
f("material","Unidades de material","Unitats de material","Material units",250,2600,50,1200),
f("demand","Demanda relativa (%)","Demanda relativa (%)","Relative demand (%)",60,160,5,100,"pct"),
f("margin","Margen unitario relativo (%)","Marge unitari relatiu (%)","Relative unit margin (%)",60,160,5,100,"pct")
]},
maintenance:{
title:L("Mantenimiento y reducción de riesgo","Manteniment i reducció del risc","Maintenance and risk reduction"),
inputs:[
f("assets","Activos o equipos","Actius o equips","Assets or equipment",3,40,1,18),
f("risk","Probabilidad de fallo por periodo (%)","Probabilitat de fallada per període (%)","Failure probability per period (%)",3,60,1,22,"pct"),
f("failureCost","Coste de fallo (€)","Cost de fallada (€)","Cost per failure (€)",100,8000,100,2500,"eur"),
f("preventCost","Coste preventivo por activo (€)","Cost preventiu per actiu (€)","Preventive cost per asset (€)",50,2500,50,420,"eur"),
f("effect","Reducción de riesgo supuesta (%)","Reducció de risc suposada (%)","Assumed risk reduction (%)",5,90,5,60,"pct"),
f("budget","Presupuesto preventivo (€)","Pressupost preventiu (€)","Prevention budget (€)",0,40000,500,6500,"eur")
]},
quality:{
title:L("Variabilidad, anomalías y calidad","Variabilitat, anomalies i qualitat","Variability, anomalies and quality"),
inputs:[
f("units","Unidades inspeccionadas","Unitats inspeccionades","Units inspected",100,12000,100,1800),
f("defect","Tasa base de defectos (%)","Taxa base de defectes (%)","Baseline defect rate (%)",0.5,24,0.5,6,"pct"),
f("improve","Mejora preventiva supuesta (%)","Millora preventiva suposada (%)","Assumed preventive improvement (%)",0,80,5,35,"pct"),
f("detect","Sensibilidad de detección (%)","Sensibilitat de detecció (%)","Detection sensitivity (%)",50,99,1,83,"pct"),
f("defectCost","Coste por defecto (€)","Cost per defecte (€)","Cost per defect (€)",5,350,5,65,"eur"),
f("inspectCost","Coste de inspección (€)","Cost d'inspecció (€)","Inspection cost (€)",0,1800,50,450,"eur")
]},
energy:{
title:L("Demanda energética y desplazamiento de carga","Demanda energètica i desplaçament de càrrega","Energy demand and load shifting"),
inputs:[
f("energy","Consumo total (kWh)","Consum total (kWh)","Total energy (kWh)",500,20000,250,6000),
f("peakShare","Consumo en punta (%)","Consum en punta (%)","Peak-period share (%)",20,85,5,60,"pct"),
f("peakTariff","Tarifa punta (€/kWh)","Tarifa punta (€/kWh)","Peak tariff (€/kWh)",0.08,0.55,0.01,0.28,"eur4"),
f("offTariff","Tarifa valle (€/kWh)","Tarifa vall (€/kWh)","Off-peak tariff (€/kWh)",0.03,0.4,0.01,0.12,"eur4"),
f("shift","Carga desplazable (%)","Càrrega desplaçable (%)","Shiftable peak load (%)",0,80,5,35,"pct"),
f("shiftCost","Coste adicional por kWh (€)","Cost addicional per kWh (€)","Extra shift cost (€/kWh)",0,0.12,0.01,0.02,"eur4")
]},
reconcile:{
title:L("Conciliación y gestión de excepciones","Conciliació i gestió d'excepcions","Reconciliation and exception management"),
inputs:[
f("records","Registros por periodo","Registres per període","Records per period",100,20000,100,3500),
f("exceptions","Registros con discrepancias (%)","Registres amb discrepàncies (%)","Records with discrepancies (%)",1,35,1,12,"pct"),
f("automation","Resolución por reglas (%)","Resolució per regles (%)","Rules-based resolution (%)",0,85,5,55,"pct"),
f("minutes","Minutos por revisión","Minuts per revisió","Minutes per review",2,45,1,12),
f("hourly","Coste por hora (€)","Cost per hora (€)","Hourly cost (€)",15,80,5,35,"eur")
]},
capacity:{
title:L("Hitos, recursos y retrasos","Fites, recursos i retards","Milestones, resources and delays"),
inputs:[
f("work","Carga de trabajo (horas)","Càrrega de treball (hores)","Workload (hours)",100,2400,50,940),
f("staff","Personas disponibles","Persones disponibles","Available people",1,24,1,8),
f("hours","Horas por persona","Hores per persona","Hours per person",10,200,10,90),
f("cost","Coste por hora (€)","Cost per hora (€)","Hourly cost (€)",15,120,5,48,"eur"),
f("penalty","Coste por hora pendiente (€)","Cost per hora pendent (€)","Penalty per pending hour (€)",0,130,5,40,"eur")
]},
risk:{
title:L("Clasificación, alertas y revisión humana","Classificació, alertes i revisió humana","Classification, alerts and human review"),
inputs:[
f("cases","Casos analizados","Casos analitzats","Cases analysed",100,15000,100,2200),
f("prevalence","Prevalencia supuesta (%)","Prevalença suposada (%)","Assumed positive prevalence (%)",1,35,1,9,"pct"),
f("threshold","Umbral de alerta (%)","Llindar d'alerta (%)","Alert threshold (%)",10,90,5,50,"pct"),
f("reviewCost","Coste de revisión (€)","Cost de revisió (€)","Review cost (€)",1,100,1,16,"eur"),
f("missedCost","Coste de positivo omitido (€)","Cost de positiu omès (€)","Missed positive cost (€)",10,900,10,210,"eur")
]},
cohort:{
title:L("Retención, crecimiento y cohortes","Retenció, creixement i cohorts","Retention, growth and cohorts"),
inputs:[
f("customers","Clientes actuales","Clients actuals","Current customers",50,10000,50,850),
f("churn","Bajas mensuales (%)","Baixes mensuals (%)","Monthly churn (%)",0.5,15,0.5,4.5,"pct"),
f("new","Altas al mes","Altes al mes","New customers per month",0,500,10,75),
f("arpu","Ingreso por cliente (€)","Ingrés per client (€)","Revenue per customer (€)",10,800,10,80,"eur"),
f("improve","Mejora relativa de churn (%)","Millora relativa de churn (%)","Relative churn improvement (%)",0,65,5,20,"pct"),
f("months","Meses proyectados","Mesos projectats","Months projected",3,18,1,12)
]},
cost:{
title:L("Coste, carga y margen operativo","Cost, càrrega i marge operatiu","Operating cost, workload and margin"),
inputs:[
f("work","Horas estimadas","Hores estimades","Estimated hours",100,4500,50,1200),
f("rate","Coste por hora (€)","Cost per hora (€)","Cost per hour (€)",10,160,5,45,"eur"),
f("overhead","Costes adicionales (€)","Costos addicionals (€)","Additional costs (€)",0,100000,1000,18000,"eur"),
f("revenue","Ingreso contractual (€)","Ingrés contractual (€)","Contract revenue (€)",10000,360000,5000,120000,"eur"),
f("overrun","Desviación de horas (%)","Desviació d'hores (%)","Hour overrun (%)",-20,60,5,10,"pct")
]},
cash:{
title:L("Flujo de caja y escenarios","Flux de caixa i escenaris","Cash flow and scenarios"),
inputs:[
f("opening","Caja inicial (€)","Caixa inicial (€)","Opening cash (€)",0,600000,10000,180000,"eur"),
f("revenue","Cobros mensuales (€)","Cobraments mensuals (€)","Monthly receipts (€)",10000,200000,5000,75000,"eur"),
f("expense","Pagos mensuales (€)","Pagaments mensuals (€)","Monthly expenses (€)",10000,200000,5000,68000,"eur"),
f("delay","Cobros retrasados (%)","Cobraments retardats (%)","Receipts delayed (%)",0,50,5,12,"pct"),
f("growth","Crecimiento mensual (%)","Creixement mensual (%)","Monthly growth (%)",-10,15,1,2,"pct")
]},
portfolio:{
title:L("Priorización de proyectos y restricciones","Priorització de projectes i restriccions","Project prioritisation under constraints"),
inputs:[
f("budget","Presupuesto disponible (€)","Pressupost disponible (€)","Available budget (€)",20000,500000,10000,180000,"eur"),
f("hours","Horas de equipo disponibles","Hores d'equip disponibles","Available team hours",50,1800,50,600),
f("risk","Penalización de riesgo (%)","Penalització de risc (%)","Risk penalty (%)",0,95,5,30,"pct"),
f("horizon","Horizonte de beneficio (años)","Horitzó de benefici (anys)","Benefits horizon (years)",1,4,1,2)
]}
};
export const MODELS=models;
export const getDefinition=(kind)=>models[kind]||models.forecast;
export const defaultInputs=(kind,seed=0)=>{
 const definition=getDefinition(kind),out={};
 for(const x of definition.inputs){
  // Stable case-level starting point, not arbitrary runtime randomness.
  const jitter=(seed%11-5)/110;
  const v=x.value;
  const adjusted=x.key==="threshold"||x.key==="risk"||x.key==="incidents"?v:v*(1+jitter);
  out[x.key]=clamp(Math.round(adjusted/x.step)*x.step,x.min,x.max);
 }
 return out;
};
function cdf(x){
 const a=1/(1+0.2316419*Math.abs(x));
 const d=0.3989422804014327*Math.exp(-x*x/2);
 const p=1-d*(0.319381530*a-0.356563782*a*a+1.781477937*a**3-1.821255978*a**4+1.330274429*a**5);
 return x>=0?p:1-p;
}
const pdf=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
function fleet(p){
 const resources=Math.max(0,p.resources-p.incidents);
 const demands=[.30,.42,.28].map(x=>Math.round(p.demand*x));
 const maxDeploy= Math.min(resources,Math.floor(resources*1.5),Math.floor((resources*p.unitCost)/p.unitCost));
 const weights=[1,1.3,.92];
 const score=(a)=>{
  const served=a.map((n,i)=>Math.min(n*p.perResource,demands[i]));
  const fleet=sum(a),missed=demands.map((n,i)=>n-served[i]);
  const cost=fleet*p.unitCost+sum(missed.map((n,i)=>n*p.unservedCost*weights[i]));
  return {a,served,missed,cost,coverage:sum(served)/sum(demands)*100};
 };
 let best=score([0,0,0]);
 for(let a=0;a<=maxDeploy;a++)for(let b=0;b<=maxDeploy-a;b++)for(let c=0;c<=maxDeploy-a-b;c++){
  const candidate=score([a,b,c]);if(candidate.cost<best.cost)best=candidate;
 }
 const naive=[0,0,0];
 for(let i=0;i<maxDeploy;i++)naive[i%3]++;
 const reference=score(naive);
 return output([
  metric("service",best.coverage,"pct"),metric("unserved",sum(best.missed)),metric("vehicles",sum(best.a)),metric("delta",reference.cost-best.cost,"eur")
 ], chart("bar",["A","B","C"],[series("target",demands),series("actual",best.served)],"number"),
 "fleet","fleet","fleet",
 [["Plan base",rnd(reference.cost,0)],["Plan calculado",rnd(best.cost,0)],["Recursos fuera de servicio",p.incidents]],
 resources===0?"No hay recursos disponibles; la demanda queda sin cubrir.":""
 );
}
function forecast(p){
 const labels=Array.from({length:p.horizon},(_,i)=>"P"+(i+1));
 const scenario=labels.map((_,i)=>p.base*Math.max(.2,1+p.trend/100)**((i+1)/4)*(1+p.season/100*Math.sin((i+1)*Math.PI/3)));
 const baseline=labels.map(()=>p.base);
 const short=scenario.map(v=>Math.max(0,v-p.capacity));
 const total=sum(scenario);
 return output([
  metric("next",scenario[0]),metric("volume",total),metric("peak",Math.max(...scenario)),metric("breach",sum(short))
 ],chart("line",labels,[series("scenario",scenario),series("reference",baseline),series("capacity",labels.map(()=>p.capacity))]),
 "forecast","forecast","forecast",
 [["Rango inferior ilustrativo",rnd(total*(1-p.uncertainty/100),0)],["Rango superior ilustrativo",rnd(total*(1+p.uncertainty/100),0)],["Periodos por encima de capacidad",short.filter(x=>x>0).length]]
 );
}
function pricing(p){
 const base=Math.max(minPrice,p.basePrice),cost=p.unitCost;
 const value=change=>{
  const price=base*(1+change/100);
  const demand=p.baseVolume*Math.pow(price/base,-p.elasticity);
  return {price,demand,rev:price*demand,profit:(price-cost)*demand};
 };
 const here=value(p.change),reference=value(0);
 const values=[-25,-15,-5,0,5,15,25].map(v=>value(v).profit);
 return output([
  metric("revenue",here.rev,"eur"),metric("profit",here.profit,"eur"),
  metric("volume",here.demand),metric("margin",here.rev?here.profit/here.rev*100:0,"pct")
 ],chart("line",["-25%","-15%","-5%","0%","+5%","+15%","+25%"],[series("profit",values)],"eur"),
 "pricing","pricing","pricing",
 [["Contribución sin cambiar precio",rnd(reference.profit,0)],["Precio escenario",rnd(here.price,2)],["Cambio vs referencia",rnd(here.profit-reference.profit,0)]],
 here.price<cost?"El precio del escenario está por debajo del coste variable por unidad.":""
 );
}
function expectedStock(S,mu,sigma){
 const z=(S-mu)/sigma,phi=pdf(z),Phi=cdf(z);
 return {left:Math.max(0,(S-mu)*Phi+sigma*phi),short:Math.max(0,(mu-S)*(1-Phi)+sigma*phi)};
}
function inventory(p){
 const mu=p.demand*p.lead;
 const sigma=Math.max(1,p.demand*p.variability/100*Math.sqrt(p.lead));
 const step=10,maxOrder=Math.min(5000,Math.ceil((mu+3*sigma)/step)*step);
 const calc=q=>{
  const expected=expectedStock(p.onHand+q,mu,sigma);
  return {q,...expected,total:expected.left*p.holding+expected.short*p.shortage};
 };
 let best=calc(0);
 for(let q=step;q<=maxOrder;q+=step){const cand=calc(q);if(cand.total<best.total)best=cand;}
 const ref=calc(Math.ceil(Math.max(0,mu-p.onHand)/step)*step);
 return output([
  metric("order",best.q),metric("shortage",best.short),metric("stock",best.left),
  metric("delta",ref.total-best.total,"eur")
 ],chart("bar",["Referencia","Optimizado"],[series("shortage",[ref.short,best.short]),series("stock",[ref.left,best.left])]),
 "inventory","inventory","inventory",
 [["Coste ilustrativo de referencia",rnd(ref.total,0)],["Coste ilustrativo optimizado",rnd(best.total,0)],["Demanda media acumulada",rnd(mu,0)]]
 );
}
function factorial(n){let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
function erlangC(lambda,mu,servers){
 const capacity=servers*mu;
 if(lambda>=capacity)return {wait:120,utilisation:100,unstable:true};
 const a=lambda/mu,rho=lambda/capacity;
 let sumPart=0;for(let k=0;k<servers;k++)sumPart+=a**k/factorial(k);
 const tail=a**servers/(factorial(servers)*(1-rho));
 const probability=tail/(sumPart+tail);
 const wait=60*probability/(capacity-lambda);
 return {wait,utilisation:100*rho,unstable:false};
}
function queue(p){
 const available=Math.max(1,Math.round(p.available));
 const evalCount=n=>{
  const m=erlangC(p.arrivals,p.rate,n);
  const cost=n*p.wage+(m.unstable?1e6:p.arrivals*m.wait/60*p.waitingCost);
  return {...m,n,cost};
 };
 const trials=Array.from({length:available},(_,i)=>evalCount(i+1));
 const stable=trials.filter(x=>!x.unstable);
 const best=(stable.length?stable:trials).reduce((a,b)=>b.cost<a.cost?b:a);
 const baseline=evalCount(available);
 return output([
  metric("wait",best.wait,"minutes"),metric("staff",best.n),
  metric("utilisation",best.utilisation,"pct"),metric("delta",baseline.cost-best.cost,"eur")
 ],chart("line",trials.map(x=>String(x.n)),[series("wait",trials.map(x=>x.wait))],"minutes"),
 "queue","queue","queue",
 [["Coste por hora escenario",rnd(best.cost,0)],["Capacidad máxima",available],["Referencia con todos los recursos",rnd(baseline.cost,0)]],
 stable.length?"":"La carga supera la capacidad en todos los escenarios. La espera se muestra con límite visual de 120 min y el modelo no es estable."
 );
}
function production(p){
 const demand=[13,9,16].map(v=>Math.round(v*p.demand/100));
 const H=[10,16,11],M=[70,110,90],V=[420,1050,580].map(v=>v*p.margin/100);
 const calc=a=>({a,h:sum(a.map((v,i)=>v*H[i])),m:sum(a.map((v,i)=>v*M[i])),profit:sum(a.map((v,i)=>v*V[i]))});
 let best=calc([0,0,0]);
 for(let a=0;a<=demand[0];a++)for(let b=0;b<=demand[1];b++)for(let c=0;c<=demand[2];c++){
  const x=calc([a,b,c]);if(x.h<=p.hours&&x.m<=p.material&&x.profit>best.profit)best=x;
 }
 const baseline=calc(demand.map((v,i)=>Math.min(v,Math.floor(p.hours/3/H[i]),Math.floor(p.material/3/M[i]))));
 return output([
  metric("output",sum(best.a)*10),metric("profit",best.profit,"eur"),
  metric("utilisation",best.h/p.hours*100,"pct"),metric("delta",best.profit-baseline.profit,"eur")
 ],chart("bar",["Familia A","Familia B","Familia C"],[series("actual",best.a.map(v=>v*10)),series("target",demand.map(v=>v*10))]),
 "production","production","production",
 [["Horas de máquina usadas",best.h],["Material consumido",best.m],["Lotes planificados",sum(best.a)]]
 );
}
function maintenance(p){
 const max=Math.min(p.assets,Math.floor(p.budget/p.preventCost));
 const cost=n=>n*p.preventCost+(p.assets-n)*p.risk/100*p.failureCost+n*p.risk/100*(1-p.effect/100)*p.failureCost;
 let best={n:0,cost:cost(0)};
 for(let n=1;n<=max;n++){const c=cost(n);if(c<best.cost)best={n,cost:c};}
 const base=cost(0);
 const candidates=Array.from({length:p.assets+1},(_,n)=>n<=max?cost(n):null);
 return output([
  metric("asset",best.n),metric("cost",best.cost,"eur"),metric("delta",base-best.cost,"eur"),
  metric("risk",p.risk*(1-p.effect/100),"pct")
 ],chart("line",candidates.map((_,i)=>String(i)),[series("total",candidates.map(v=>v===null?NaN:v))],"eur"),
 "maintenance","maintenance","maintenance",
 [["Coste sin prevención",rnd(base,0)],["Presupuesto máximo preventivo",p.budget],["Intervenciones posibles",max]]
 );
}
function quality(p){
 const baseline=p.units*p.defect/100;
 const scenario=baseline*(1-p.improve/100);
 const detected=scenario*p.detect/100;
 const residual=scenario-detected;
 const cost=scenario*p.defectCost+p.inspectCost;
 const refCost=baseline*p.defectCost;
 return output([
  metric("defects",scenario),metric("tp",detected),metric("fn",residual),
  metric("delta",refCost-cost,"eur")
 ],chart("bar",["Base","Mejora","Detectados"],[series("defects",[baseline,scenario,detected])]),
 "quality","quality","quality",
 [["Coste previo ilustrativo",rnd(refCost,0)],["Coste posterior más inspección",rnd(cost,0)],["Revisiones expertas requeridas",rnd(detected,0)]]
 );
}
function energy(p){
 const total=p.energy,basePeak=total*p.peakShare/100,off=total-basePeak;
 const potential=basePeak*p.shift/100;
 const moved=(p.peakTariff-p.offTariff-p.shiftCost)>0?potential:0;
 const baseline=basePeak*p.peakTariff+off*p.offTariff;
 const optimized=(basePeak-moved)*p.peakTariff+(off+moved)*p.offTariff+moved*p.shiftCost;
 return output([
  metric("energy",basePeak-moved),metric("cost",optimized,"eur"),metric("delta",baseline-optimized,"eur"),
  metric("coverage",total?moved/total*100:0,"pct")
 ],chart("bar",["Punta","Valle"],[series("reference",[basePeak,off]),series("actual",[basePeak-moved,off+moved])],"number"),
 "energy","energy","energy",
 [["Coste de referencia",rnd(baseline,0)],["Carga desplazada (kWh)",rnd(moved,0)],["Coste de desplazamiento",rnd(moved*p.shiftCost,2)]],
 moved===0&&potential>0?"Mover la carga no reduce el coste con las tarifas y penalizaciones introducidas.":""
 );
}
function reconcile(p){
 const flagged=p.records*p.exceptions/100;
 const auto=flagged*p.automation/100;
 const residual=flagged-auto;
 const baseHours=flagged*p.minutes/60;
 const newHours=residual*p.minutes/60;
 return output([
  metric("exceptions",residual),metric("hours",newHours),metric("delta",(baseHours-newHours)*p.hourly,"eur"),
  metric("coverage",p.automation,"pct")
 ],chart("bar",["Antes","Con reglas"],[series("cases",[flagged,residual])]),
 "reconcile","reconcile","reconcile",
 [["Excepciones iniciales",rnd(flagged,0)],["Resueltas con reglas",rnd(auto,0)],["Horas base",rnd(baseHours,1)]]
 );
}
function capacity(p){
 const capacity=p.staff*p.hours;
 const served=Math.min(capacity,p.work),unserved=Math.max(0,p.work-capacity);
 const cost=served*p.cost+unserved*p.penalty;
 const reference=Math.min(p.work,p.staff*p.hours*.85);
 const baseCost=reference*p.cost+Math.max(0,p.work-reference)*p.penalty;
 return output([
  metric("coverage",served/p.work*100,"pct"),metric("unserved",unserved),metric("cost",cost,"eur"),
  metric("delta",baseCost-cost,"eur")
 ],chart("bar",["Trabajo","Capacidad","Realizable"],[series("hours",[p.work,capacity,served])]),
 "capacity","capacity","capacity",
 [["Trabajo total",p.work],["Capacidad disponible",capacity],["Coste de horas pendientes",rnd(unserved*p.penalty,0)]]
 );
}
function risk(p){
 const prevalence=p.prevalence/100;
 const threshold=p.threshold/100;
 // Illustrative monotone operating curve, not empirical classifier performance.
 const sensitivity=clamp(.98-.65*threshold,.05,.99);
 const specificity=clamp(.55+.43*threshold,.4,.995);
 const positive=p.cases*prevalence,negative=p.cases-positive;
 const tp=positive*sensitivity,fn=positive-tp,fp=negative*(1-specificity),tn=negative-fp;
 const precision=(tp+fp)>0?100*tp/(tp+fp):0;
 const reviewCost=(tp+fp)*p.reviewCost+fn*p.missedCost;
 return output([
  metric("tp",tp),metric("fp",fp),metric("fn",fn),metric("precision",precision,"pct")
 ],chart("matrix",["VP","FP","FN","VN"],[series("cases",[tp,fp,fn,tn])]),
 "risk","risk","risk",
 [["Sensibilidad ilustrativa (%)",rnd(sensitivity*100,1)],["Especificidad ilustrativa (%)",rnd(specificity*100,1)],["Coste supuesto de revisión y omisión",rnd(reviewCost,0)]],
 "Curva de rendimiento hipotética: NO es un clasificador entrenado, validado ni apto para decisiones reales."
 );
}
function cohort(p){
 let cust=p.customers,baseline=p.customers;
 let lost=0;
 const values=[],refs=[];
 for(let m=0;m<p.months;m++){
  const c=p.churn/100*(1-p.improve/100);
  lost+=cust*c;
  cust=cust*(1-c)+p.new;
  baseline=baseline*(1-p.churn/100)+p.new;
  values.push(cust*p.arpu);refs.push(baseline*p.arpu);
 }
 return output([
  metric("mrr",cust*p.arpu,"eur"),metric("churn",lost),metric("delta",(cust-baseline)*p.arpu,"eur"),
  metric("volume",cust)
 ],chart("line",values.map((_,i)=>"M"+(i+1)),[series("scenario",values),series("reference",refs)],"eur"),
 "cohort","cohort","cohort",
 [["MRR final escenario base",rnd(baseline*p.arpu,0)],["Meses simulados",p.months],["ARPU supuesto",p.arpu]]
 );
}
function cost(p){
 const hours=p.work*(1+p.overrun/100);
 const total=hours*p.rate+p.overhead;
 const baseline=p.work*p.rate+p.overhead;
 const profit=p.revenue-total;
 return output([
  metric("cost",total,"eur"),metric("profit",profit,"eur"),metric("margin",profit/p.revenue*100,"pct"),
  metric("delta",total-baseline,"eur")
 ],chart("bar",["Base","Con desvío","Ingresos"],[series("amount",[baseline,total,p.revenue])],"eur"),
 "cost","cost","cost",
 [["Horas ajustadas",rnd(hours,0)],["Costes fijos",p.overhead],["Margen previo (€)",rnd(p.revenue-baseline,0)]],
 profit<0?"El escenario de costes supera el ingreso supuesto.":""
 );
}
function cash(p){
 let cash=p.opening;const balances=[],labels=[],revenue=[];
 let carried=0;
 for(let i=0;i<6;i++){
  const earned=p.revenue*Math.pow(1+p.growth/100,i);
  const delayed=earned*p.delay/100;
  const paid=earned-delayed+carried;
  carried=delayed;
  cash+=paid-p.expense;
  labels.push("M"+(i+1));revenue.push(paid);balances.push(cash);
 }
 return output([
  metric("cash",cash,"eur"),metric("minimum",Math.min(p.opening,...balances),"eur"),
  metric("delta",cash-p.opening,"eur"),metric("coverage",Math.min(...balances)>=0?100:0,"pct")
 ],chart("line",labels,[series("cash",balances)],"eur"),
 "cash","cash","cash",
 [["Cobros pendientes al cierre",rnd(carried,0)],["Pagos en seis periodos",p.expense*6],["Caja inicial",p.opening]],
 Math.min(...balances)<0?"El escenario tiene saldo de caja negativo en uno o varios periodos.":""
 );
}
function portfolio(p){
 const initiatives=[
  {name:"A",cost:36000,hours:140,benefit:41000,risk:.14},
  {name:"B",cost:62000,hours:190,benefit:76000,risk:.24},
  {name:"C",cost:47000,hours:175,benefit:64000,risk:.10},
  {name:"D",cost:78000,hours:240,benefit:92000,risk:.30},
  {name:"E",cost:28000,hours:110,benefit:33000,risk:.05},
  {name:"F",cost:56000,hours:190,benefit:69000,risk:.21}
 ];
 const inspect=mask=>{
  const chosen=initiatives.filter((_,i)=>mask&(1<<i));
  const money=sum(chosen.map(x=>x.cost)),hours=sum(chosen.map(x=>x.hours));
  const net=sum(chosen.map(x=>x.benefit*p.horizon*(1-x.risk*p.risk/100)-x.cost));
  return {chosen,money,hours,net,mask};
 };
 let best=inspect(0);
 for(let mask=1;mask<1<<initiatives.length;mask++){
  const x=inspect(mask);
  if(x.money<=p.budget&&x.hours<=p.hours&&x.net>best.net)best=x;
 }
 const all=initiatives.map(x=>x.name);
 return output([
  metric("selected",best.chosen.length),metric("netValue",best.net,"eur"),
  metric("budget",p.budget-best.money,"eur"),metric("hours",best.hours)
 ],chart("bar",all,[series("allocation",initiatives.map(x=>best.chosen.includes(x)?x.cost:0))],"eur"),
 "portfolio","portfolio","portfolio",
 [["Presupuesto comprometido",rnd(best.money,0)],["Capacidad usada",best.hours],["Combinaciones evaluadas",64]]
 );
}
const runners={...logisticsCalculators,...wholesaleCalculators,...manufacturingCalculators,...foodCalculators,...pharmaCalculators,...restaurantCalculators,...hotelCalculators,...retailCalculators,...clinicCalculators,...constructionCalculators,...realEstateCalculators,...financeInsuranceCalculators,fleet,forecast,pricing,inventory,queue,production,maintenance,quality,energy,reconcile,capacity,risk,cohort,cost,cash,portfolio};
export function calculate(kind,values={}){
 const definition=getDefinition(kind),p={};
 for(const x of definition.inputs){
  const raw=values[x.key]??x.value;
  p[x.key]=clamp(raw,x.min,x.max);
 }
 const result=runners[kind]?runners[kind](p):forecast(p);
 result.inputs=p;result.kind=kind;
 result.metrics=result.metrics.map(m=>({...m,value:Number.isFinite(m.value)?rnd(m.value,2):0}));
 result.visual.series.forEach(s=>{s.values=s.values.map(v=>Number.isFinite(v)?v:null);});
 return result;
}
export const modelNames=Object.keys(runners);
