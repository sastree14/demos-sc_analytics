import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,sectorText} from "./i18n.js";
const s=INDUSTRY_CATALOG.sectors.find(x=>x.code==="SC11");
assert(s);
assert.deepEqual(s.pain_points.map(p=>p.model),[
"reVacancy","reMaintenance","reAssets","reCapex","reArrears","reVendors"]);
const run=(model,p)=>calculate(model,p??defaultInputs(model,1101));
const v=(r,key)=>r.metrics.find(x=>x.key===key)?.value;
for(const [i,problem] of s.pain_points.entries()){
 const def=MODELS[problem.model],input=defaultInputs(problem.model,problem.scenario_seed);
 assert(def.inputs.length>=5);
 assert(EXPLANATIONS[problem.model]?.length===3&&CONSTRAINTS[problem.model]?.length===3);
 assert(sectorText.SC11.problems[i].ca&&sectorText.SC11.problems[i].en);
 for(const f of def.inputs)for(const endpoint of [f.min,f.max]){
  const r=run(problem.model,{...input,[f.key]:endpoint});
  assert(r.metrics.length===4&&r.metrics.every(x=>Number.isFinite(x.value)),problem.id+" invalid "+f.key);
  assert(r.visual.series.every(x=>x.values.length===r.visual.labels.length));
 }
 for(const [label] of run(problem.model,input).table)
  assert(DETAIL_TRANSLATIONS[label]?.every(Boolean),problem.id+" untranslated "+label);
}
const occ=defaultInputs("reVacancy",1101),rent=run("reVacancy",occ);
assert(v(rent,"occupancy")>=0&&v(rent,"occupancy")<=100);
assert(v(rent,"vacant")>=0&&v(rent,"vacant")<=occ.units);
const repair=run("reMaintenance");
assert(v(repair,"backlog")>=0&&v(repair,"service")<=100);
assert(v(repair,"delta")>=-0.01);
const noi=run("reAssets");
assert(v(noi,"revenue")>=0&&v(noi,"yield")>-100);
const capex=defaultInputs("reCapex",1101),p=run("reCapex",capex);
assert(v(p,"selected")>=0&&v(p,"selected")<=5);
assert(v(p,"budget")>=0&&v(p,"budget")<=capex.budget);
assert(v(p,"npv")>=-0.01);
const arrears=run("reArrears");
assert(v(arrears,"arrears")>=0&&Number.isFinite(v(arrears,"cash")));
const vendors=defaultInputs("reVendors",1101),alloc=run("reVendors",vendors);
assert(v(alloc,"service")>=0&&v(alloc,"service")<=100);
assert(v(alloc,"shortage")>=0&&v(alloc,"shortage")<=vendors.jobs);
console.log("SC11 property and asset-management calculations validated without individual tenant information.");
