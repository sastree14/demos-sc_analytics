import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,sectorText,DETAIL_TRANSLATIONS} from "./i18n.js";
const industry=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC06");
assert(industry);
assert.deepEqual(industry.pain_points.map(x=>x.model),["rsShifts","rsPrep","rsStoreProfit","rsMenu","rsDelivery","rsPurchasing"]);
const run=(name,values)=>calculate(name,values??defaultInputs(name,621));
const metric=(r,k)=>r.metrics.find(x=>x.key===k)?.value;
const detail=(r,k)=>r.table.find(x=>x[0]===k)?.[1];
for(const [i,p] of industry.pain_points.entries()){
 assert(MODELS[p.model].inputs.length>=5);
 assert(sectorText.SC06.problems[i].ca&&sectorText.SC06.problems[i].en);
 assert(EXPLANATIONS[p.model].every(x=>x.length>20));
 assert(CONSTRAINTS[p.model].every(x=>x.length>20));
 const input=defaultInputs(p.model,p.scenario_seed);
 for(const slider of MODELS[p.model].inputs){
  for(const end of [slider.min,slider.max]){
   const result=run(p.model,{...input,[slider.key]:end});
   assert(result.metrics.length===4&&result.metrics.every(x=>Number.isFinite(x.value)),p.id+" invalid metric "+slider.key);
   assert(result.visual.series.every(x=>x.values.length===result.visual.labels.length),p.id+" chart series mismatch");
  }
 }
 for(const [key] of run(p.model,input).table)assert(DETAIL_TRANSLATIONS[key]?.every(Boolean),"Untranslated "+p.id+" "+key);
}
const base=defaultInputs("rsShifts",621),shifts=run("rsShifts",base);
assert(metric(shifts,"service")>=0&&metric(shifts,"service")<=100);
assert(metric(shifts,"unserved")>=0);
assert(metric(shifts,"staff")<=base.maxWorkers);
const staffAlt=run("rsShifts",{...base,maxWorkers:2});
assert(metric(staffAlt,"service")<=metric(shifts,"service")+0.01);

const prep=defaultInputs("rsPrep",621),ready=run("rsPrep",prep);
assert(metric(ready,"produced")<=prep.prepCap);
assert(metric(ready,"produced")%prep.batch===0);
assert(metric(ready,"shortage")>=0&&metric(ready,"waste")>=0);
assert(metric(ready,"delta")>=-0.01);

const stores=run("rsStoreProfit");
assert(metric(stores,"revenue")>0);
assert(Math.abs(metric(stores,"revenue")-metric(stores,"cost")-metric(stores,"profit"))<0.05);

const menu=run("rsMenu");
assert(metric(menu,"delta")>=-0.01);
assert(metric(menu,"volume")>=0);
assert(menu.visual.labels.length===3);

const delivery=defaultInputs("rsDelivery",621),del=run("rsDelivery",delivery);
assert(metric(del,"service")>=0&&metric(del,"service")<=100);
assert(metric(del,"backlog")>=0);
assert(metric(del,"delta")>=-0.01);

const purchasing=defaultInputs("rsPurchasing",621),po=run("rsPurchasing",purchasing);
assert(metric(po,"order")%purchasing.pack===0);
assert(metric(po,"shortage")>=0);
assert(metric(po,"cost")>=0);
assert(detail(po,"Cajas compradas")*purchasing.pack===metric(po,"order"));
console.log("SC06 restaurant-group specialist models passed: labour load, food prep, multi-store P&L, menus, delivery capacity and purchasing.");
