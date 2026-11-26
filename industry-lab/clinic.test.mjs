import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,sectorText} from "./i18n.js";
const sector=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC09");
assert(sector);
assert.deepEqual(sector.pain_points.map(p=>p.model),
 ["clNoShow","clWaitlist","clRooms","clAdmin","clReception","clUnitCost"]);
const run=(name,v)=>calculate(name,v??defaultInputs(name,904));
const metric=(r,k)=>r.metrics.find(m=>m.key===k)?.value;
for(const [index,p] of sector.pain_points.entries()){
 const inputs=MODELS[p.model].inputs,base=defaultInputs(p.model,p.scenario_seed);
 assert(inputs.length>=5);
 assert(sectorText.SC09.problems[index].ca&&sectorText.SC09.problems[index].en);
 assert(EXPLANATIONS[p.model]?.length===3&&CONSTRAINTS[p.model]?.length===3);
 for(const inp of inputs)for(const edge of [inp.min,inp.max]){
  const r=run(p.model,{...base,[inp.key]:edge});
  assert(r.metrics.length===4&&r.metrics.every(m=>Number.isFinite(m.value)),p.id+" invalid "+inp.key);
  assert(r.visual.series.every(s=>s.values.length===r.visual.labels.length),p.id+" chart mismatch");
 }
 for(const [name] of run(p.model,base).table)assert(DETAIL_TRANSLATIONS[name]?.every(Boolean),p.id+" untranslated "+name);
}
const n=defaultInputs("clNoShow",904),no=run("clNoShow",n);
assert(metric(no,"service")>=0&&metric(no,"service")<=100);
assert(metric(no,"unserved")>=0);
assert(metric(no,"delta")>=-0.01);
const w=defaultInputs("clWaitlist",904),back=run("clWaitlist",w);
assert(metric(back,"backlog")>=0);
assert(metric(back,"delta")>=-0.01);
const r=defaultInputs("clRooms",904),rooms=run("clRooms",r);
assert(metric(rooms,"service")>=0&&metric(rooms,"service")<=100);
assert(metric(rooms,"produced")<=r.generalDemand+r.specialDemand);
assert(metric(rooms,"shortage")>=0);
const a=defaultInputs("clAdmin",904),admin=run("clAdmin",a);
assert(metric(admin,"hours")>=0);
assert(metric(admin,"delta")>=-0.01);
const f=defaultInputs("clReception",904),front=run("clReception",f);
assert(metric(front,"wait")>=0);
assert(metric(front,"staff")<=f.staff+f.extra);
const c=defaultInputs("clUnitCost",904),unit=run("clUnitCost",c);
assert(metric(unit,"utilisation")>=0&&metric(unit,"utilisation")<=100);
assert(metric(unit,"cost")>=0);
console.log("SC09 clinics operational models passed without sensitive patient data or clinical priority decisions.");
