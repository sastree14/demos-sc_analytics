import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,sectorText} from "./i18n.js";
const sector=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC10");
assert(sector);
assert.deepEqual(sector.pain_points.map(p=>p.model),[
 "coTimeline","coBudget","coCrews","coMaterials","coPartners","coCash"]);
const run=(name,p)=>calculate(name,p??defaultInputs(name,1001));
const m=(r,key)=>r.metrics.find(v=>v.key===key)?.value;
for(const [i,p] of sector.pain_points.entries()){
 const def=MODELS[p.model],init=defaultInputs(p.model,p.scenario_seed);
 assert(def.inputs.length>=5);
 assert(sectorText.SC10.problems[i].ca&&sectorText.SC10.problems[i].en);
 assert(EXPLANATIONS[p.model].length===3&&CONSTRAINTS[p.model].length===3);
 for(const x of def.inputs)for(const val of [x.min,x.max]){
  const o=run(p.model,{...init,[x.key]:val});
  assert(o.metrics.length===4&&o.metrics.every(v=>Number.isFinite(v.value)),p.id+" invalid "+x.key);
  assert(o.visual.series.every(s=>s.values.length===o.visual.labels.length));
 }
 for(const [label] of run(p.model,init).table)assert(DETAIL_TRANSLATIONS[label]?.every(Boolean),"Untranslated SC10 label "+label);
}
const timeline=run("coTimeline");
assert(timeline.visual.type==="schedule"&&timeline.visual.unit==="days");
assert(timeline.visual.events.length===5);
assert(m(timeline,"delta")>=-0.01);
const budget=run("coBudget");
assert(m(budget,"cpi")>=0&&m(budget,"spi")>=0);
const c=defaultInputs("coCrews",1001),crews=run("coCrews",c);
assert(m(crews,"service")>=0&&m(crews,"service")<=100);
assert(m(crews,"external")<=c.external);
assert(m(crews,"delta")>=-0.01);
const mat=run("coMaterials");
assert(m(mat,"shortage")>=0);
assert(m(mat,"delta")>=-0.01);
const coord=run("coPartners");
assert(m(coord,"delta")>=-0.01);
assert(m(coord,"makespan")>=0);
const cash=run("coCash");
assert(Number.isFinite(m(cash,"cash")));
assert(m(cash,"cost")>=0);
console.log("SC10 construction models passed: precedence path, CPI/SPI, crews, materials, contractors and milestone cash.");
