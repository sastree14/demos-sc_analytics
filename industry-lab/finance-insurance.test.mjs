import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,sectorText} from "./i18n.js";
const sector=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC12");
assert(sector);
assert.deepEqual(sector.pain_points.map(p=>p.model),[
 "fiAlerts","fiPortfolio","fiReconcile","fiClaimsDocs","fiReserve","fiCapacity"]);
const run=(kind,values)=>calculate(kind,values??defaultInputs(kind,1212));
const get=(r,key)=>r.metrics.find(x=>x.key===key)?.value;
for(const [index,p] of sector.pain_points.entries()){
 const def=MODELS[p.model],init=defaultInputs(p.model,p.scenario_seed);
 assert(def.inputs.length>=5);
 assert(EXPLANATIONS[p.model]?.length===3&&CONSTRAINTS[p.model]?.length===3);
 assert(sectorText.SC12.problems[index].ca&&sectorText.SC12.problems[index].en);
 for(const x of def.inputs)for(const edge of [x.min,x.max]){
  const result=run(p.model,{...init,[x.key]:edge});
  assert(result.metrics.length===4&&result.metrics.every(z=>Number.isFinite(z.value)),p.id+" invalid "+x.key);
  assert(result.visual.series.every(z=>z.values.length===result.visual.labels.length),p.id+" visual mismatch");
 }
 for(const [label] of run(p.model,init).table)assert(DETAIL_TRANSLATIONS[label]?.every(Boolean),p.id+" untranslated "+label);
}
const a=defaultInputs("fiAlerts",1212),alerts=run("fiAlerts",a);
const cases=alerts.visual.series[0].values;
assert(cases.length===4&&Math.abs(cases.reduce((x,y)=>x+y,0)-a.cases)<0.15,"synthetic confusion matrix must preserve all cases");
assert(alerts.visual.type==="matrix");
assert(get(alerts,"cost")>=0);
const p=defaultInputs("fiPortfolio",1212),portfolio=run("fiPortfolio",p);
assert(get(portfolio,"risk")>=0&&get(portfolio,"risk")<=100);
assert(get(portfolio,"exposure")>=0&&get(portfolio,"exposure")<=p.exposure);
const recon=run("fiReconcile");
assert(get(recon,"hours")>=0&&get(recon,"exceptions")>=0&&get(recon,"delta")>=0);
const docs=defaultInputs("fiClaimsDocs",1212),claimDocs=run("fiClaimsDocs",docs);
assert(get(claimDocs,"coverage")>=0&&get(claimDocs,"coverage")<=100);
assert(get(claimDocs,"exceptions")<=docs.claims);
const reserv=run("fiReserve");
assert(get(reserv,"reserve")>=get(reserv,"loss"));
assert(get(reserv,"frequencyCount")>=0);
const capacity=run("fiCapacity");
assert(get(capacity,"backlog")>=0);
assert(get(capacity,"delta")>=-0.01);
console.log("SC12 finance/insurance models validated: aggregate exposure, synthetic alerts, documentation, reserving illustration and staffing.");
