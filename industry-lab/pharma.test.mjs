import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,sectorText,DETAIL_TRANSLATIONS} from "./i18n.js";
const pharma=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC05");
assert(pharma);
assert.deepEqual(pharma.pain_points.map(p=>p.model),["phBatch","phRelease","phCritical","phCampaign","phAnomaly","phTrace"]);
const run=(kind,params)=>calculate(kind,params??defaultInputs(kind,303));
const metric=(r,key)=>r.metrics.find(m=>m.key===key)?.value;
const tab=(r,key)=>r.table.find(x=>x[0]===key)?.[1];
for(const [index,problem] of pharma.pain_points.entries()){
 const def=MODELS[problem.model];
 assert(def.inputs.length>=5,problem.id);
 assert(EXPLANATIONS[problem.model]?.length===3);
 assert(CONSTRAINTS[problem.model]?.length===3);
 assert(sectorText.SC05.problems[index].ca&&sectorText.SC05.problems[index].en);
 const base=defaultInputs(problem.model,problem.scenario_seed);
 for(const f of def.inputs){
  for(const endpoint of [f.min,f.max]){
   const r=run(problem.model,{...base,[f.key]:endpoint});
   assert(r.metrics.length===4);
   assert(r.metrics.every(m=>Number.isFinite(m.value)),problem.id+" nonfinite metrics");
   assert(r.visual.series.every(s=>s.values.every(v=>v===null||Number.isFinite(v))),problem.id+" nonfinite series");
  }
 }
 const output=run(problem.model,base);
 for(const [name] of output.table)assert(DETAIL_TRANSLATIONS[name]?.every(Boolean),problem.id+" untranslated detail "+name);
}
const b=defaultInputs("phBatch",303),batch=run("phBatch",b);
assert(metric(batch,"qualityYield")>=0&&metric(batch,"qualityYield")<=100);
assert(metric(batch,"scrap")>=0&&metric(batch,"scrap")<=b.lots);
const centred=run("phBatch",{...b,meanShift:0});
assert(metric(centred,"qualityYield")>=metric(batch,"qualityYield")-0.01);
const q=defaultInputs("phRelease",303);
const baseQa=run("phRelease",{...q,extra:0});
const increasedQa=run("phRelease",{...q,extra:5});
assert(metric(increasedQa,"backlog")<=metric(baseQa,"backlog")+0.01);
const c=defaultInputs("phCritical",303),supply=run("phCritical",c);
assert(metric(supply,"service")>=0&&metric(supply,"service")<=100);
assert(metric(supply,"shortage")>=0&&metric(supply,"shortage")<=c.demand);
const x=run("phCampaign");
assert(x.visual.type==="schedule");
assert(x.visual.events.length===4);
assert(metric(x,"delta")>=-0.01);
for(let n=1;n<x.visual.events.length;n++)assert(x.visual.events[n].start>=x.visual.events[n-1].finish);
const an=run("phAnomaly");
assert(metric(an,"anomalies")>=0&&metric(an,"anomalies")<=12);
assert(an.visual.labels.length===12);
const d=run("phTrace");
assert(metric(d,"exceptions")>=0);
assert(metric(d,"delta")>=-0.01);
console.log("SC05 pharmaceutical/chemical models validated without real batch release or external systems.");
