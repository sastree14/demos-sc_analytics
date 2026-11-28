/* SC17 Energy and industrial utilities: only deterministic synthetic what-if
 * simulations. No grid dispatch, switching, equipment control or regulatory compliance.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const sr=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,formula,insight:formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=a=>a.reduce((u,v)=>u+v,0);
const hours=["00h","03h","06h","09h","12h","15h","18h","21h"];
export const energyIndustrialModels={
 enPeak:{title:L("Picos de potencia y reprogramación flexible","Pics de potència i reprogramació flexible","Power peaks and flexible load shifting"),inputs:[
 f("base","Carga base de instalación (kW)","Càrrega base instal·lació (kW)","Site baseload (kW)",50,5000,50,1250),
 f("peak","Carga adicional en hora punta (kW)","Càrrega addicional en punta (kW)","Additional peak load (kW)",50,3500,50,850),
 f("flex","Carga máxima desplazable (kW)","Càrrega màxima desplaçable (kW)","Maximum shiftable power (kW)",0,1500,50,450),
 f("offCap","Capacidad adicional fuera de punta (kW)","Capacitat addicional fora de punta (kW)","Off-peak spare power capacity (kW)",0,1200,50,550),
 f("contract","Umbral de potencia contratada (kW)","Llindar potència contractada (kW)","Contracted power threshold (kW)",500,6000,100,1700),
 f("penalty","Penalización pico por kW excedido (€)","Penalització punta per kW excedit (€)","Assumed excess peak penalty per kW (€)",1,100,5,25,"eur"),
 f("moveCost","Coste desplazamiento por kW (€)","Cost desplaçament per kW (€)","Load shifting cost per kW (€)",0,80,5,8,"eur")
 ]},
 enForecast:{title:L("Demanda energética y efecto de producción y clima","Demanda energètica, producció i clima","Synthetic energy demand scenarios"),inputs:[
 f("base","Consumo diario referencia (MWh)","Consum diari de referència (MWh)","Reference energy use MWh/day",5,400,5,80),
 f("growth","Crecimiento productivo supuesto (%)","Creixement productiu suposat (%)","Assumed production growth (%)",-25,60,5,20,"pct"),
 f("weather","Incremento por climatología (%)","Increment per climatologia (%)","Weather sensitivity (%)",-35,55,5,15,"pct"),
 f("weekly","Variación por calendario (%)","Variació per calendari (%)","Calendar-related swing (%)",0,40,5,15,"pct"),
 f("weekends","Actividad fines de semana (%)","Activitat caps de setmana (%)","Weekend relative utilisation (%)",20,100,5,65,"pct"),
 f("uncertainty","Variación hipotética (+/- %)","Variació hipotètica (+/- %)","Illustrative uncertainty (+/- %)",0,35,5,15,"pct")
 ]},
 enSensors:{title:L("Sensores y detección ilustrativa de anomalías","Sensors i detecció il·lustrativa d'anomalies","Synthetic sensor alert thresholds"),inputs:[
 f("mean","Valor de referencia del sensor","Valor de referència del sensor","Sensor baseline level",20,250,5,105),
 f("noise","Variación típica hipotética","Variació típica hipotètica","Assumed normal variation",1,25,1,7),
 f("drift","Deriva del equipo a lo largo del periodo","Deriva de l'equip al llarg del període","Assumed signal drift",-35,40,5,16),
 f("threshold","Umbral de alarma (sigmas)","Llindar alarma (sigmes)","Alert threshold in sigmas",1,5,0.5,1.5),
 f("review","Tiempo de revisión por alerta (min)","Temps de revisió per alerta (min)","Review time per alert",5,90,5,25,"minutes"),
 f("hourCost","Coste de revisión/hora (€)","Cost revisió/hora (€)","Human review hourly cost (€)",15,160,5,55,"eur")
 ]},
 enPrevent:{title:L("Mantenimiento por criticidad y ventana segura","Manteniment per criticitat i finestra segura","Criticality-based preventive maintenance"),inputs:[
 f("equipment","Equipos operativos","Equips operatius","Number of assets",10,300,10,75),
 f("failure","Probabilidad de fallo por equipo (%)","Probabilitat fallada per equip (%)","Assumed failure probability (%)",1,50,1,16,"pct"),
 f("duration","Horas de parada por fallo","Hores parada per fallada","Expected incident downtime hours",1,120,1,18,"hours"),
 f("downtimeCost","Coste por hora de parada (€)","Cost per hora aturada (€)","Downtime cost per hour (€)",50,4000,50,700,"eur"),
 f("budget","Presupuesto de prevención (€)","Pressupost de prevenció (€)","Maintenance budget (€)",5000,350000,5000,30000,"eur"),
 f("intervention","Coste de intervención por equipo (€)","Cost intervenció per equip (€)","Intervention cost per asset (€)",100,6000,100,900,"eur"),
 f("riskReduction","Eficacia preventiva hipotética (%)","Eficàcia preventiva hipotètica (%)","Assumed relative risk reduction (%)",10,90,5,65,"pct"),
 f("window","Equipos accesibles en parada programada","Equips accessibles en parada programada","Assets available in approved maintenance window",0,250,5,45)
 ]},
 enTariff:{title:L("Comparar tarifas y desplazamiento de consumo","Comparar tarifes i desplaçament de consum","Time-of-use tariffs and shiftable demand"),inputs:[
 f("day","Energía en periodo punta (kWh)","Energia en període punta (kWh)","Peak-window energy (kWh)",300,30000,100,9500),
 f("night","Energía en periodo valle (kWh)","Energia en període vall (kWh)","Off-peak energy (kWh)",100,30000,100,4500),
 f("peakPrice","Tarifa punta (€/kWh)","Tarifa punta (€/kWh)","Peak tariff (€ / kWh)",0.08,1.0,0.02,0.30,"eur"),
 f("offPrice","Tarifa valle (€/kWh)","Tarifa vall (€/kWh)","Off-peak tariff (€ / kWh)",0.03,0.75,0.02,0.13,"eur"),
 f("shiftPct","Consumo punta desplazable (%)","Consum punta desplaçable (%)","Shiftable peak energy (%)",0,65,5,30,"pct"),
 f("offCap","Capacidad libre en valle (kWh)","Capacitat lliure en vall (kWh)","Available off-peak capacity (kWh)",0,18000,500,6000),
 f("shiftCost","Coste por kWh desplazado (€)","Cost per kWh desplaçat (€)","Operational shift cost (€ / kWh)",0,0.4,0.02,0.04,"eur")
 ]},
 enEfficiency:{title:L("Rendimiento energético por línea de producción","Rendiment energètic per línia de producció","Production-line energy intensity"),inputs:[
 f("unitsA","Unidades línea A","Unitats línia A","Line A produced units",100,12000,100,3400),
 f("unitsB","Unidades línea B","Unitats línia B","Line B produced units",100,12000,100,2750),
 f("kwhA","kWh por unidad línea A","kWh per unitat línia A","Line A kWh per unit",1,55,1,12),
 f("kwhB","kWh por unidad línea B","kWh per unitat línia B","Line B kWh per unit",1,55,1,17),
 f("target","Objetivo energético (kWh/unidad)","Objectiu energètic (kWh/unitat)","Energy target kWh/unit",2,35,1,13),
 f("efficiency","Eficiencia adicional posible (%)","Eficiència addicional possible (%)","Assumed achievable efficiency (%)",0,45,5,20,"pct"),
 f("price","Precio energético (€/kWh)","Preu energètic (€/kWh)","Power cost (€ / kWh)",0.05,0.8,0.05,0.20,"eur"),
 f("investment","Coste de medida (€)","Cost mesura (€)","One-period intervention cost (€)",0,20000,500,2200,"eur")
 ]}
};
function peakLoad(p){
 const shape=[.68,.62,.77,.96,1.12,1.08,1.3,.85];
 const load=shape.map((x,i)=>p.base*x+((i===4||i===6)?p.peak:0));
 const ix=load.indexOf(Math.max(...load));
 const candidate=Math.min(p.flex,p.offCap,Math.max(0,load[ix]-p.contract));
 const basePeak=Math.max(...load);
 const before=Math.max(0,basePeak-p.contract)*p.penalty;
 const consider=(moved)=>{
  const profile=load.slice();profile[ix]-=moved;profile[1]+=moved;
  const peak=Math.max(...profile);
  const cost=Math.max(0,peak-p.contract)*p.penalty+moved*p.moveCost;
  return {moved,profile,peak,cost};
 };
 let best=consider(0);
 // Search 100 candidate points including the exact feasible maximum;
 // a second peak can arise in the receiving off-peak slot.
 for(let k=1;k<=100;k++){
  const proposal=consider(candidate*k/100);
  if(proposal.cost<best.cost-1e-8)best=proposal;
 }
 const chosen=best.moved,after=best.profile,finalPeak=best.peak,finalCost=best.cost;
 return out([
 m("peak",finalPeak),m("delta",before-finalCost,"eur"),
 m("shifted",chosen),m("cost",finalCost,"eur")
 ],vis("line",hours,[sr("reference",load),sr("scenario",after)]),
 "Se desplaza una carga de potencia equivalente entre dos intervalos si la penalización de exceso supera el coste supuesto de movimiento.",
 "Una potencia kW por franja no equivale a energía kWh salvo duraciones conocidas. No es un controlador eléctrico; no aplica límites de red, generación ni contratos reales.",
 [["Pico inicial (kW)",rnd(basePeak)],["Pico resultante (kW)",rnd(finalPeak)],["Carga desplazada (kW)",rnd(chosen)],["Coste de exceso resultante (€)",rnd(finalCost)]]);
}
function demand(p){
 const base=["L","M","X","J","V","S","D"].map((x,i)=>{
  const swing=1+p.weekly/100*Math.sin(i*Math.PI/3);
  const weekend=i>=5?p.weekends/100:1;
  return p.base*(1+p.growth/100)*(1+p.weather/100)*swing*weekend;
 });
 const total=sum(base);
 return out([
 m("energy",total),m("peak",Math.max(...base)),m("delta",total-p.base*7),
 m("uncertainty",p.uncertainty,"pct")
 ],vis("line",["L","M","X","J","V","S","D"],[
 sr("scenario",base),sr("lower",base.map(x=>x*(1-p.uncertainty/100))),sr("upper",base.map(x=>x*(1+p.uncertainty/100)))]),
 "Demanda sintética semanal en MWh con producción, climatología y patrón de días. Bandas meramente hipotéticas sin inferencia estadística.",
 "No usa series energéticas reales, curvas de tarifa, temperatura registrada ni incertidumbre calibrada.",
 [["MWh semanales ilustrativos",rnd(total)],["Escenario inferior MWh",rnd(total*(1-p.uncertainty/100))],["Escenario superior MWh",rnd(total*(1+p.uncertainty/100))],["Consumo diario máximo MWh",rnd(Math.max(...base))]]);
}
function sensors(p){
 const vals=Array.from({length:18},(_,i)=>p.mean+p.drift*i/17+p.noise*(.5*Math.sin(i*1.75)+.35*Math.cos(i*2.23)));
 const hi=p.mean+p.noise*p.threshold,lo=p.mean-p.noise*p.threshold;
 const alerts=vals.filter(v=>v>hi||v<lo).length;
 const load=alerts*p.review/60;
 return out([
 m("anomalies",alerts),m("hours",load,"hours"),m("cost",load*p.hourCost,"eur"),
 m("maxZ",Math.max(...vals.map(x=>Math.abs((x-p.mean)/p.noise))))
 ],vis("line",vals.map((_,i)=>"T"+(i+1)),[
 sr("scenario",vals),sr("upper",vals.map(()=>hi)),sr("lower",vals.map(()=>lo))]),
 "Dieciocho muestras deterministas inventadas y umbrales ±n desviaciones típicas. Las alertas son solo marcas para revisión por personal cualificado.",
 "No hay diagnóstico de fallo, sensor integrado, mantenimiento automatizado ni certificación de seguridad industrial.",
 [["Lecturas simuladas",vals.length],["Alertas por umbral",alerts],["Umbral superior",rnd(hi)],["Umbral inferior",rnd(lo)]]);
}
function preventive(p){
 const base=p.equipment*p.failure/100;
 const possible=Math.min(p.equipment,p.window,Math.floor(p.budget/p.intervention));
 const netPer=p.failure/100*p.duration*p.downtimeCost*p.riskReduction/100-p.intervention;
 const treated=netPer>0?possible:0;
 const after=base-treated*p.failure/100*p.riskReduction/100;
 const spend=treated*p.intervention;
 const beforeCost=base*p.duration*p.downtimeCost,afterCost=after*p.duration*p.downtimeCost+spend;
 return out([
 m("downtime",after*p.duration,"hours"),
 m("interventions",treated),m("cost",afterCost,"eur"),m("delta",beforeCost-afterCost,"eur")
 ],vis("bar",["Sin prevención","Plan calculado"],[
 sr("failures",[base,after])],"number"),
 "Prevención de equipos dentro de presupuesto y ventana de mantenimiento. Selección cuando el coste evitado esperado supera el coste por intervención.",
 "Probabilidad de fallo, eficacia de intervención y ventana son supuestos; no autoriza paradas de equipos críticos ni sustituye permisos de trabajo.",
 [["Fallos esperados sin intervención",rnd(base)],["Fallos esperados tras plan",rnd(after)],["Coste preventivo (€)",rnd(spend)],["Equipos intervenidos",treated]]);
}
function tariff(p){
 const available=Math.min(p.day*p.shiftPct/100,p.offCap);
 const perKwh=p.peakPrice-p.offPrice-p.shiftCost;
 const shifted=perKwh>0?available:0;
 const before=p.day*p.peakPrice+p.night*p.offPrice;
 const after=(p.day-shifted)*p.peakPrice+(p.night+shifted)*p.offPrice+shifted*p.shiftCost;
 return out([
 m("cost",after,"eur"),m("delta",before-after,"eur"),
 m("energy",p.day+p.night),m("shifted",shifted)
 ],vis("bar",["Punta","Valle"],[sr("reference",[p.day,p.night]),sr("scenario",[p.day-shifted,p.night+shifted])]),
 "Se desplaza consumo punta al periodo valle solo cuando el ahorro tarifario por kWh supera el coste de reprogramación y hay capacidad nocturna.",
 "Sin contrato eléctrico conectado, demanda horaria de potencia, capacidad de líneas ni límites de confort, seguridad o personal.",
 [["Coste sin mover (€)",rnd(before)],["Coste tras mover (€)",rnd(after)],["kWh trasladados",rnd(shifted)],["Tarifa diferencial (€/kWh)",rnd(p.peakPrice-p.offPrice)]]);
}
function efficiency(p){
 const usedA=p.unitsA*p.kwhA,usedB=p.unitsB*p.kwhB;
 const before=usedA+usedB,after=before*(1-p.efficiency/100);
 const saving=before*p.price-(after*p.price+p.investment);
 const apply=saving>0;const actual=apply?after:before;
 return out([
 m("energy",actual),m("intensity",actual/(p.unitsA+p.unitsB)),
 m("delta",Math.max(0,saving),"eur"),
 m("deviation",actual/(p.unitsA+p.unitsB)-p.target)
 ],vis("bar",["Línea A","Línea B"],[sr("reference",[usedA,usedB]),sr("scenario",[apply?usedA*(1-p.efficiency/100):usedA,apply?usedB*(1-p.efficiency/100):usedB])]),
 "Intensidad = suma del consumo por líneas dividida por unidades producidas. Se aplica una reducción uniforme hipotética si el ahorro cubre inversión.",
 "No acredita eficiencia M&V/ISO50001 ni incluye mix de producto, picos horarios, potencia o balances reales.",
 [["kWh iniciales",rnd(before)],["kWh en escenario",rnd(actual)],["Coste de intervención (€)",apply?p.investment:0],["Objetivo kWh por unidad",p.target]],
 actual/(p.unitsA+p.unitsB)>p.target?"La intensidad supera el objetivo supuesto bajo este escenario.":"");
}
export const energyIndustrialCalculators={enPeak:peakLoad,enForecast:demand,enSensors:sensors,enPrevent:preventive,enTariff:tariff,enEfficiency:efficiency};
