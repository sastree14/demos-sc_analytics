import {runOptimisation,settings,catalogue,cases as inventoryMarkets} from "../optimization/model.js";
/* General mathematical optimisation demonstration: exact enumerations on small synthetic cases.
 * No operational decisions, payments or live data. Comparisons are explicit heuristics.
 */
const fmt=n=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:0}).format(n);
const euro=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const percent=n=>(100*n).toFixed(1)+"%";
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)));
const spec=(key,label,min,max,step,unit="")=>({key,label,min,max,step,unit,kind:"range"});
const choice=(key,label,values)=>({key,label,values,kind:"choice"});
const row=(label,a,b=0,c=0)=>({label,a,b,c});
const metric=(label,value,hint)=>({label,value:String(value),hint});
const chart=(series,title,subtitle)=>({kind:"bars",series,labels:["Allocation"],title,subtitle});
const result=(metrics,chartData,comparison,table,impact,decision,quality,methodology)=>({metrics,chart:chartData,comparison,table,impact,decision,quality,methodology,scope:"Illustrative mathematical optimisation · transparent objective and constraints",assumptions:"All data and coefficients are invented examples, and outputs require real-world validation."});
export const optimizationModule={
 id:"optimization",label:"Mathematical Optimisation",tag:"MATHEMATICAL DECISIONS / CONSTRAINTS",
 headline:"Find the best plan with the resources you already have.",
 intro:"Explore how a mathematical solver compares feasible options for resource allocation, shift planning, fleet operations, production and inventory. See the trade-offs, not just a single answer.",
 focus:"Objective functions, constraints and measurable alternatives",
 cases:[
 {id:"resource-allocation",label:"Budget & resource allocation",short:"Choose the most valuable portfolio of initiatives within spending and team-capacity limits.",category:"STRATEGY / CAPITAL",categoryShort:"EXACT PORTFOLIO SEARCH",
 inputs:[spec("budget","Investment budget",50000,400000,10000," €"),spec("hours","Available delivery hours",200,1400,50," h"),spec("risk","Risk penalty multiplier",0,60,5,"%"),spec("horizon","Benefits horizon",1,3,1," years")],
 defaults:{budget:210000,hours:700,risk:20,horizon:2}},
 {id:"workforce-allocation",label:"Workforce & shift planning",short:"Allocate a limited team across shifts and quantify the service-cost trade-off.",category:"OPERATIONS / STAFFING",categoryShort:"INTEGER SCHEDULING",
 inputs:[spec("staff","Available team members",5,22,1),spec("rate","Cases handled per staff member",9,25,1),spec("wage","Cost per staffed shift",95,240,5," €"),spec("penalty","Cost of an unserved case",15,100,5," €"),spec("budget","Daily staffing budget",1000,5000,100," €"),spec("growth","Demand variation",-20,35,5,"%")],
 defaults:{staff:14,rate:17,wage:145,penalty:38,budget:2400,growth:0}},
 {id:"fleet-allocation",label:"Fleet & delivery allocation",short:"Compare vehicle allocation across service zones while respecting fleet and cost limits.",category:"LOGISTICS / FLEET",categoryShort:"EXACT FLEET ALLOCATION",
 inputs:[spec("fleet","Vehicles available",3,18,1),spec("capacity","Deliveries per vehicle",7,20,1),spec("demand","Demand adjustment",-25,40,5,"%"),spec("vehicleCost","Daily operating cost per vehicle",200,950,50," €"),spec("missedCost","Penalty per unserved order",30,170,10," €"),spec("budget","Daily fleet budget",2000,14000,500," €")],
 defaults:{fleet:12,capacity:13,demand:5,vehicleCost:450,missedCost:80,budget:6200}},
 {id:"production-mix",label:"Production & product mix",short:"Prioritise profitable product combinations with limited machine time and materials.",category:"INDUSTRIAL / PRODUCTION",categoryShort:"INTEGER PROGRAMMING",
 inputs:[spec("hours","Available machine hours",70,300,10," h"),spec("material","Raw material units",350,2200,50),spec("demand","Market demand factor",70,140,10,"%"),spec("margin","Sales margin factor",75,150,5,"%")],
 defaults:{hours:160,material:1250,demand:100,margin:100}},
 {id:"inventory-allocation",label:"Inventory replenishment",short:"Solve a multi-item purchasing plan with exact two-constraint dynamic programming.",category:"SUPPLY CHAIN / INVENTORY",categoryShort:"EXACT DP / ADVANCED",
 inputs:[spec("budget","Purchasing budget",15000,70000,1000," €"),spec("capacity","Available storage slots",200,800,50),choice("market","Demand scenario",[["base","Baseline"],["growth","Demand spike"],["soft","Demand slowdown"]]),spec("uncertainty","Demand uncertainty",60,160,10,"%"),spec("service","Service emphasis",50,150,10,"%"),choice("period","Planning period",[[4,"4 weeks"],[8,"8 weeks"],[12,"12 weeks"]])],
 defaults:{budget:33000,capacity:450,market:"base",uncertainty:100,service:100,period:4}}
 ]};
const factors=[
 {name:"Sales digitisation",cost:65000,hours:170,value:91000,risk:.13},
 {name:"Distribution planning",cost:85000,hours:220,value:125000,risk:.23},
 {name:"Finance reporting",cost:42000,hours:115,value:58000,risk:.08},
 {name:"Quality monitoring",cost:58000,hours:195,value:79000,risk:.16},
 {name:"Service automation",cost:98000,hours:270,value:149000,risk:.3},
 {name:"Fleet analytics",cost:72000,hours:160,value:96000,risk:.19}
];
function allocateResources(p){
 const candidates=factors.map(x=>({...x,benefit:x.value*p.horizon*(1-x.risk*p.risk/100),net:x.value*p.horizon*(1-x.risk*p.risk/100)-x.cost}));
 const evaluate=ids=>{
  const selected=ids.map(i=>candidates[i]),spent=selected.reduce((s,x)=>s+x.cost,0),hours=selected.reduce((s,x)=>s+x.hours,0);
  return {ids,spent,hours,net:selected.reduce((s,x)=>s+x.net,0),benefit:selected.reduce((s,x)=>s+x.benefit,0)};
 };
 let best=evaluate([]);
 for(let mask=0;mask<1<<candidates.length;mask++){
  const ids=candidates.flatMap((x,i)=>(mask&(1<<i))?[i]:[]),candidate=evaluate(ids);
  if(candidate.spent<=p.budget&&candidate.hours<=p.hours&&candidate.net>best.net)best=candidate;
 }
 let baseline=evaluate([]);
 for(const i of [...candidates.keys()].sort((a,b)=>candidates[b].benefit/candidates[b].cost-candidates[a].benefit/candidates[a].cost)){
  const next=evaluate([...baseline.ids,i]);if(next.spent<=p.budget&&next.hours<=p.hours)baseline=next;
 }
 const selected=new Set(best.ids);
 const delta=best.net-baseline.net;
 return result([
  metric("OPTIMISED NET VALUE",euro(best.net),"synthetic benefit minus committed cost"),
  metric("VALUE VS HEURISTIC",euro(delta),"exact search versus benefit-cost rule"),
  metric("BUDGET USED",euro(best.spent),"of "+euro(p.budget)),
  metric("TEAM HOURS REQUIRED",fmt(best.hours)+" h","of "+fmt(p.hours)+" available")
 ],chart(candidates.map((x,i)=>row(x.name,selected.has(i)?Math.round(x.net):0)),"Which initiatives belong in the optimal portfolio?","Contribution of selected initiatives over "+p.horizon+" years."),
 chart([row("Reference rule",Math.round(baseline.net)),row("Exact solution",Math.round(best.net)),row("Budget available",p.budget)],"Objective against a disclosed baseline","Net value is compared with a greedy benefit-to-cost heuristic."),
 {columns:["Initiative","Cost","Capacity","Decision"],rows:candidates.map((x,i)=>[x.name,euro(x.cost),fmt(x.hours)+" h",selected.has(i)?"SELECT":"DEFER"])},
 {value:euro(delta),label:"Illustrative value above baseline",formula:"Best feasible net value minus a transparent greedy portfolio heuristic.",note:"Benefits, project risks and delivery capacity are invented. This is a mathematical comparison, not realised business savings."},
 {title:"Fund the highest-value feasible combination",summary:"The exact enumeration selects "+best.ids.length+" initiatives, using "+euro(best.spent)+" and "+fmt(best.hours)+" team hours.",actions:["Validate initiative financial benefits and dependencies.","Assign accountable project owners and confirm real resource availability.","Re-evaluate the selection when budget, scope or risk conditions change."]},
 [["Candidate initiatives",fmt(candidates.length)],["Feasible combinations","Enumerated across 64 subsets"],["Primary objective","Maximum net modelled value"],["Constraints","Budget and delivery hours"]],
 "The solver enumerates all 2^6 subsets and keeps only those within both budget and team-hour limits. The objective is sum of risk-adjusted forecast benefits over the chosen horizon minus initial costs."
 );
}
const shifts=[
 {name:"Morning",demand:85},{name:"Midday",demand:125},{name:"Evening",demand:105},{name:"Night",demand:70}
];
function workforcePlanning(p){
 const demand=shifts.map(x=>Math.round(x.demand*(1+p.growth/100))),maxAllowed=Math.min(p.staff,Math.floor(p.budget/p.wage));
 const score=arr=>{
  const served=arr.reduce((s,n,i)=>s+Math.min(demand[i],n*p.rate),0),lost=demand.reduce((s,x)=>s+x,0)-served,
  staff=arr.reduce((s,x)=>s+x,0),expense=staff*p.wage;
  const weightedLoss=arr.reduce((sum,n,i)=>sum+Math.max(0,demand[i]-n*p.rate)*p.penalty*[1,1.5,1.25,.8][i],0);
  return {arr,served,lost,staff,expense,total:expense+weightedLoss};
 };
 let best=score([0,0,0,0]);
 for(let a=0;a<=maxAllowed;a++)for(let b=0;b<=maxAllowed-a;b++)for(let c=0;c<=maxAllowed-a-b;c++)for(let d=0;d<=maxAllowed-a-b-c;d++){
  const candidate=score([a,b,c,d]);
  if(candidate.total<best.total)best=candidate;
 }
 // Baseline: equally distribute each available team member in rotating sequence.
 const basic=[0,0,0,0];for(let i=0;i<maxAllowed;i++)basic[i%4]++;
 const baseline=score(basic);
 return result([
  metric("UNSERVED CASES",fmt(best.lost),"cases left beyond staffed capacity"),
  metric("TOTAL MODELLED COST",euro(best.total),"staff expense plus missed-service cost"),
  metric("COST REDUCTION",euro(baseline.total-best.total),"versus equal-share reference plan"),
  metric("TEAM MEMBERS ASSIGNED",fmt(best.staff),"of "+fmt(p.staff)+" available")
 ],chart(shifts.map((x,i)=>row(x.name,best.arr[i])),"Optimal staff allocation across four shifts","The model considers demand, staff productivity and cost of unmet work."),
 chart([row("Equal-share plan",Math.round(baseline.total)),row("Exact plan",Math.round(best.total))],"Cost comparison","Staffing cost plus assumed unserved-case penalties in euros."),
 {columns:["Shift","Expected cases","Team members","Unserved cases"],rows:shifts.map((x,i)=>[x.name,fmt(demand[i]),fmt(best.arr[i]),fmt(Math.max(0,demand[i]-best.arr[i]*p.rate))])},
 {value:euro(baseline.total-best.total),label:"Illustrative operating cost reduction",formula:"Reference expense and backlog penalties minus optimal expense and penalties.",note:"Not observed staffing savings: each worker is assigned to one shift and legal scheduling, contracts, skills and rest periods require validation."},
 {title:"Cover the highest-need shifts first",summary:"The exact allocation uses "+best.staff+" of "+p.staff+" available staff and leaves "+best.lost+" cases unserved.",actions:["Check required skills, labour rules and contract constraints.","Use actual per-shift demand distributions, not only averages.","Run sensitivity analysis before changing staff rosters."]},
 [["Exact search","All feasible four-shift integer splits"],["Cost objective","Wages plus unserved workload penalty"],["Budget limit",euro(p.budget)],["Current total demand",fmt(demand.reduce((s,x)=>s+x,0))]],
 "Complete enumeration of staff allocations across four shifts under team and wage limits. Work served = min(demand, staff × productivity). The solver minimises wages plus unmet service penalties weighted by shift priority (1, 1.5, 1.25, 0.8)."
 );
}
const zones=[{name:"North",base:70},{name:"Central",base:110},{name:"Coastal",base:85}];
function fleetPlanning(p){
 const demands=zones.map(z=>Math.round(z.base*(1+p.demand/100))),limit=Math.min(p.fleet,Math.floor(p.budget/p.vehicleCost));
 const score=arr=>{
  const served=arr.reduce((s,n,i)=>s+Math.min(demands[i],n*p.capacity),0),vehicles=arr.reduce((s,x)=>s+x,0),cost=vehicles*p.vehicleCost,
  unserved=demands.reduce((s,x)=>s+x,0)-served;
  const weightedValue=arr.reduce((sum,n,i)=>sum+Math.min(demands[i],n*p.capacity)*p.missedCost*[1,1.45,.85][i],0);
  return {arr,served,vehicles,cost,unserved,score:weightedValue-cost};
 };
 let best=score([0,0,0]);
 for(let a=0;a<=limit;a++)for(let b=0;b<=limit-a;b++)for(let c=0;c<=limit-a-b;c++){
  const trial=score([a,b,c]);if(trial.score>best.score)best=trial;
 }
 const equal=[0,0,0];for(let i=0;i<limit;i++)equal[i%3]++;
 const baseline=score(equal);
 return result([
  metric("MODELLED SERVICE COVERAGE",percent(best.served/demands.reduce((s,x)=>s+x,0)),"orders covered by allocated fleet"),
  metric("VEHICLES DEPLOYED",fmt(best.vehicles),"of "+fmt(p.fleet)+" available"),
  metric("COST & SERVICE UPLIFT",euro(best.score-baseline.score),"versus equal-share assignment"),
  metric("UNSERVED ORDERS",fmt(best.unserved),"under example demand conditions")
 ],chart(zones.map((z,i)=>row(z.name,best.arr[i])),"Where should available vehicles go?","Exact allocation by service zone, demand and operating cost."),
 chart([row("Equal-share reference",Math.round(baseline.score)),row("Optimised deployment",Math.round(best.score))],"Service value net of vehicle cost","Covered orders × assumed missed-order penalty − deployed fleet expense."),
 {columns:["Service area","Requested","Vehicles","Orders covered"],rows:zones.map((z,i)=>[z.name,fmt(demands[i]),fmt(best.arr[i]),fmt(Math.min(demands[i],best.arr[i]*p.capacity))])},
 {value:euro(best.score-baseline.score),label:"Illustrative net service improvement",formula:"Optimised covered-order value minus operating cost, versus equal-share allocation.",note:"This is area-level fleet allocation, not street-level routing or a guaranteed logistics saving. Travel times and driver constraints are omitted."},
 {title:"Allocate vehicles by demand and economic value",summary:"The solution assigns "+best.vehicles+" vehicles with "+fmt(best.unserved)+" unserved orders under the synthetic conditions.",actions:["Validate geographic route times, driver hours and vehicle capacity.","Compare rental, reassignment and outsourcing options.","Consider waiting when extra vehicle cost exceeds unmet-demand penalties."]},
 [["Search method","Exact integer enumeration"],["Constraints","Vehicle availability and daily budget"],["Objective","Covered-order value less vehicle cost"],["Geographic routing","Not included"]],
 "The solver enumerates nonnegative integer allocations across three service regions and respects fleet availability and daily spending. It maximises a weighted service value using regional factors 1, 1.45 and 0.85, minus vehicle operating cost."
 );
}
const products=[
 {name:"Standard units",demand:180,margin:42,hours:.9,material:6},
 {name:"Premium units",demand:110,margin:105,hours:1.8,material:12},
 {name:"Service kits",demand:160,margin:58,hours:1.1,material:9}
];
function productionMix(p){
 const max=products.map(x=>Math.floor(x.demand*p.demand/100/10)),batchHours=products.map(x=>x.hours*10),batchMat=products.map(x=>x.material*10),value=products.map(x=>x.margin*10*p.margin/100);
 const score=arr=>{
  const hours=arr.reduce((s,x,i)=>s+x*batchHours[i],0),material=arr.reduce((s,x,i)=>s+x*batchMat[i],0),contribution=arr.reduce((s,x,i)=>s+x*value[i],0);
  return {arr,hours,material,contribution};
 };
 let best=score([0,0,0]);
 for(let a=0;a<=max[0];a++)for(let b=0;b<=max[1];b++)for(let c=0;c<=max[2];c++){
  const trial=score([a,b,c]);
  if(trial.hours<=p.hours&&trial.material<=p.material&&trial.contribution>best.contribution)best=trial;
 }
 const ref=[0,0,0];for(let i=0;i<3;i++){const trial=[...ref];trial[i]=Math.min(max[i],Math.floor(p.hours/3/batchHours[i]),Math.floor(p.material/3/batchMat[i]));ref[i]=trial[i];}
 const baseline=score(ref);
 return result([
  metric("OPTIMAL CONTRIBUTION",euro(best.contribution),"expected unit margin before overhead"),
  metric("IMPROVEMENT VS REFERENCE",euro(best.contribution-baseline.contribution),"versus equal resource share"),
  metric("MACHINE HOURS USED",fmt(best.hours)+" h","of "+fmt(p.hours)+" available"),
  metric("MATERIAL USED",fmt(best.material),"of "+fmt(p.material)+" available")
 ],chart(products.map((x,i)=>row(x.name,best.arr[i]*10)),"Optimal production mix","Production units selected under machine time and materials limits."),
 chart([row("Equal-share reference",Math.round(baseline.contribution)),row("Integer programme",Math.round(best.contribution))],"Modelled product contribution","After allocating finite machine hours and material."),
 {columns:["Product group","Units planned","Demand cap","Contribution"],rows:products.map((x,i)=>[x.name,fmt(best.arr[i]*10),fmt(max[i]*10),euro(best.arr[i]*10*x.margin*p.margin/100)])},
 {value:euro(best.contribution-baseline.contribution),label:"Illustrative additional contribution",formula:"Exact integer mix contribution minus equal-share reference contribution.",note:"Not verified savings: the example omits setup time, batch sequencing, labour rules, stock policy and real orders."},
 {title:"Prioritise the most valuable feasible combination",summary:"The model produces a feasible product mix consuming "+fmt(best.hours)+" machine hours and "+fmt(best.material)+" material units. Demand ceilings total "+fmt(max.reduce((s,x)=>s+x,0)*10)+" units; unmet orders remain visible in the scenario.",actions:["Check production specifications, batch sizes and material availability.","Review minimum contract commitments and changeover time.","Schedule execution only after operational approval."]},
 [["Decision granularity","10-unit product batches"],["Search method","Exact feasible enumeration"],["Constraints","Machine hours and raw materials"],["Business outcomes","Not verified"]],
 "The model enumerates all feasible 10-unit production batches across three product families, subject to machine-hour and material restrictions, and maximises total hypothetical unit contribution."
 );
}
function inventoryPlanning(p){
 const model=runOptimisation(settings(p)),s=model.settings,o=model.optimised.evaluation,b=model.comparison.evaluation;
 return result([
  metric("EXACT SOLVER CONTRIBUTION",euro(o.contribution),"expected contribution under synthetic demand"),
  metric("CONTRIBUTION IMPROVEMENT",euro(model.delta),"versus published replenishment heuristic"),
  metric("DEMAND FULFILMENT",percent(o.fill),"expected demand covered"),
  metric("PURCHASING BUDGET USED",euro(o.spend),"of "+euro(s.budget)+" selected")
 ],chart(model.diagnostics.map(x=>row(x.name,x.optimised)),"Optimised purchasing allocation by SKU","Exact discrete dynamic programme with budget and storage constraints."),
 chart([row("Reference heuristic",Math.round(b.contribution)),row("Exact solver",Math.round(o.contribution))],"Expected contribution vs disclosed benchmark","Both plans respect exactly the same spending and storage constraints."),
 {columns:["Product family","On hand","Reference order","Optimal order"],rows:model.diagnostics.map(x=>[x.name,fmt(x.stock),fmt(x.baseline),fmt(x.optimised)])},
 {value:euro(model.delta),label:"Illustrative optimisation gain",formula:"Expected contribution with exact optimal quantities minus contribution under the transparent comparison policy.",note:"Not realised savings. Calculations use invented demand, margins, penalties and holding costs."},
 {title:"Allocate purchasing capacity where it adds the most value",summary:"The plan uses "+euro(o.spend)+" in budget and "+fmt(o.storage)+" of "+fmt(s.capacity)+" storage slots.",actions:["Validate demand assumptions and SKU availability against ERP records.","Check lead times, carrying costs and supplier restrictions.","Use a purchasing approval process before issuing orders."]},
 [["Solver","Exact discrete two-resource dynamic programme"],["Explored candidate states",fmt(model.optimised.explored)],["Budget and space","Both checked"],["Full detailed demonstration","Available at inventory.html"]],
 "The solver performs exact discrete dynamic programming over 10-unit replenishment increments. Each SKU has a budget, capacity, demand and expected contribution, with a disclosed greedy reference policy."
 );
}
const runners={"resource-allocation":allocateResources,"workforce-allocation":workforcePlanning,"fleet-allocation":fleetPlanning,"production-mix":productionMix,"inventory-allocation":inventoryPlanning};
export const optimizationCase=id=>optimizationModule.cases.find(c=>c.id===id)||optimizationModule.cases[0];
export const initialOptimization=id=>({...optimizationCase(id).defaults});
export function runOptimizationCase(id,raw={}){
 const c=optimizationCase(id),p={...c.defaults,...raw};
 for(const control of c.inputs){
  if(control.kind==="range")p[control.key]=clamp(p[control.key],control.min,control.max);
  else if(!control.values.some(x=>x[0]===p[control.key]))p[control.key]=c.defaults[control.key];
 }
 return {...runners[c.id](p),case:c,module:optimizationModule,params:p};
}
