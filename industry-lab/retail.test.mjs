import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,sectorText} from "./i18n.js";
const sector=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC08");
assert(sector);
assert.deepEqual(sector.pain_points.map(p=>p.model),[
"rtPromo","rtSizes","rtReturns","rtOmnichannel","rtAcquisition","rtAssortment"]);
const run=(kind,vars)=>calculate(kind,vars??defaultInputs(kind,803));
const get=(r,key)=>r.metrics.find(m=>m.key===key)?.value;
for(const [index,caseData] of sector.pain_points.entries()){
 const def=MODELS[caseData.model],init=defaultInputs(caseData.model,caseData.scenario_seed);
 assert(def.inputs.length>=5);
 assert(EXPLANATIONS[caseData.model]?.length===3);
 assert(CONSTRAINTS[caseData.model]?.length===3);
 assert(sectorText.SC08.problems[index].ca&&sectorText.SC08.problems[index].en);
 for(const x of def.inputs)for(const value of [x.min,x.max]){
  const out=run(caseData.model,{...init,[x.key]:value});
  assert(out.metrics.length===4);
  assert(out.metrics.every(m=>Number.isFinite(m.value)),caseData.id+" invalid "+x.key);
  assert(out.visual.series.every(s=>s.values.length===out.visual.labels.length),caseData.id+" chart");
 }
 for(const [name] of run(caseData.model,init).table){
  assert(DETAIL_TRANSLATIONS[name]?.every(Boolean),caseData.id+" untranslated "+name);
 }
}
const p=defaultInputs("rtPromo",803),promo=run("rtPromo",p);
assert(get(promo,"shortage")>=0);
assert(get(promo,"revenue")>=0);
const noPromo=run("rtPromo",{...p,discount:0,uplift:0,adSpend:0});
assert(get(noPromo,"delta")>=-0.01);
const s=defaultInputs("rtSizes",803),sz=run("rtSizes",s);
assert(get(sz,"service")>=0&&get(sz,"service")<=100);
assert(get(sz,"shortage")>=0&&get(sz,"shortage")<=s.demand);
assert(get(sz,"delta")>=-0.01);
const r=defaultInputs("rtReturns",803),ret=run("rtReturns",r);
assert(get(ret,"returns")>=0&&get(ret,"returns")<=r.orders);
const lowerReturns=run("rtReturns",{...r,rateOnline:0,rateStore:0});
assert(get(lowerReturns,"returns")<=get(ret,"returns")+0.01);
const o=defaultInputs("rtOmnichannel",803),omni=run("rtOmnichannel",o);
assert(get(omni,"service")>=0&&get(omni,"service")<=100);
assert(get(omni,"transferUnits")<=o.transferCap+0.01);
assert(get(omni,"delta")>=-0.01);
const a=defaultInputs("rtAcquisition",803),cac=run("rtAcquisition",a);
assert(get(cac,"cac")>=0);
assert(get(cac,"ltv")>=-a.aov*a.returns/100);
const as=defaultInputs("rtAssortment",803),arr=run("rtAssortment",as);
assert(get(arr,"delta")>=-0.01);
assert(get(arr,"service")>=0&&get(arr,"service")<=100);
console.log("SC08 retail/e-commerce validated: incremental promotions, size allocation, returns, transfers, acquisition and markdowns.");
