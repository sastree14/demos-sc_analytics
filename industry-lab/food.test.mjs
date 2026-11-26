import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,sectorText,DETAIL_TRANSLATIONS} from "./i18n.js";

const food=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC04");
assert(food,"Food industry is in catalog");
assert.deepEqual(food.pain_points.map(p=>p.model),[
 "fbDemand","fbExpiry","fbBatch","fbPromo","fbColdRoute","fbSupply"
]);
const run=(name,values)=>calculate(name,values??defaultInputs(name,251));
const metric=(r,k)=>r.metrics.find(x=>x.key===k)?.value;
const row=(r,k)=>r.table.find(x=>x[0]===k)?.[1];
for(const [i,problem] of food.pain_points.entries()){
 const def=MODELS[problem.model];
 assert(def.inputs.length>=5);
 assert(sectorText.SC04.problems[i].ca&&sectorText.SC04.problems[i].en);
 assert(EXPLANATIONS[problem.model].every(Boolean));
 assert(CONSTRAINTS[problem.model].every(Boolean));
 const params=defaultInputs(problem.model,problem.scenario_seed);
 for(const inp of def.inputs){
  for(const value of [inp.min,inp.max]){
   const r=run(problem.model,{...params,[inp.key]:value});
   assert(r.metrics.length===4);
   assert(r.metrics.every(m=>Number.isFinite(m.value)),problem.id+" / "+inp.key);
   assert(r.visual.series.every(s=>s.values.length===r.visual.labels.length));
   assert(r.visual.series.every(s=>s.values.every(v=>v===null||Number.isFinite(v))));
  }
 }
 for(const [key] of run(problem.model,params).table){
  assert(DETAIL_TRANSLATIONS[key]?.every(Boolean),"Untranslated SC04 detail: "+key);
 }
}
const fd=defaultInputs("fbDemand",251),demand=run("fbDemand",fd);
assert(metric(demand,"service")>=0&&metric(demand,"service")<=100);
assert(metric(demand,"shortage")>=0);
assert(metric(demand,"shortage")<=metric(demand,"volume"));
const normal=run("fbDemand",{...fd,capacity:fd.capacity});
const reduced=run("fbDemand",{...fd,capacity:50});
assert(metric(reduced,"service")<=metric(normal,"service")+0.01);

const expiry=defaultInputs("fbExpiry",251),fefo=run("fbExpiry",expiry);
assert(metric(fefo,"waste")>=0);
assert(metric(fefo,"avoidedWaste")>=-0.01,"FEFO should not increase waste vs arrival order in the simulation");
assert(metric(fefo,"service")>=0&&metric(fefo,"service")<=100);

const batch=defaultInputs("fbBatch",251),plan=run("fbBatch",batch);
assert(metric(plan,"produced")%batch.batch===0);
assert(metric(plan,"produced")<=batch.capacity);
assert(metric(plan,"delta")>=-0.01);

const promo=defaultInputs("fbPromo",251),pr=run("fbPromo",promo);
assert(metric(pr,"shortage")>=0);
assert(metric(pr,"service")>=0&&metric(pr,"service")<=100);
assert(Math.abs(metric(pr,"delta")-(row(pr,"Contribución con promoción (€)")-row(pr,"Contribución sin promoción (€)")))<0.1);

const cold=defaultInputs("fbColdRoute",251),cr=run("fbColdRoute",cold);
assert(cr.visual.labels.length===6,"3 stops require 6 possible permutations");
assert(metric(cr,"delta")>=-0.01);
assert(metric(cr,"lateHours")>=0&&metric(cr,"routeHours")>=0);

const supply=defaultInputs("fbSupply",251),res=run("fbSupply",supply);
assert(metric(res,"service")>=0&&metric(res,"service")<=100);
assert(metric(res,"shortage")>=0);
assert(metric(res,"delta")>=-0.01);
assert(row(res,"Ingrediente X urgente esperado")<=supply.emergency+0.01);
console.log("SC04 food & beverage validated: six sector models, expiry FEFO, batches, promotions, 6 delivery orders and ingredient sourcing.");
