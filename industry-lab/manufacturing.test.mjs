import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,sectorText,DETAIL_TRANSLATIONS} from "./i18n.js";

const sc03=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC03");
assert(sc03,"Manufacturing industry is present");
assert.deepEqual(sc03.pain_points.map(p=>p.model),[
 "mfSequence","mfCapacity","mfMaintenance","mfQuality","mfMaterials","mfEnergy"
]);
assert(sc03.pain_points.every((p,i)=>p.title&&sectorText.SC03.problems[i].ca&&sectorText.SC03.problems[i].en));
const run=(name,values)=>calculate(name,values??defaultInputs(name,137));
const value=(r,key)=>r.metrics.find(m=>m.key===key)?.value;
const table=(r,label)=>r.table.find(x=>x[0]===label)?.[1];
for(const problem of sc03.pain_points){
 const model=MODELS[problem.model];
 assert(model.inputs.length>=5,problem.id+" does not have enough controls");
 assert(EXPLANATIONS[problem.model]?.every(x=>x.length>30));
 assert(CONSTRAINTS[problem.model]?.every(x=>x.length>30));
 const base=defaultInputs(problem.model,problem.scenario_seed);
 for(const inp of model.inputs){
  for(const tested of [inp.min,inp.max]){
   const values={...base,[inp.key]:tested};
   const res=run(problem.model,values);
   assert(res.metrics.every(x=>Number.isFinite(x.value)),problem.id+" invalid metric at "+inp.key);
   assert(res.visual.series.every(x=>x.values.every(v=>v===null||Number.isFinite(v))),problem.id+" invalid chart at "+inp.key);
  }
 }
}
// Sequence: five orders, no overlaps, model chooses no worse objective than FIFO.
const seq=run("mfSequence");
assert.equal(seq.visual.type,"schedule");
const events=seq.visual.events;
assert.equal(events.length,5);
for(let i=0;i<events.length;i++){
 assert(events[i].finish>=events[i].start);
 assert(i===0||events[i].start>=events[i-1].finish);
}
assert(value(seq,"delta")>=-0.01);
assert(table(seq,"Secuencia calculada").split(" → ").length===5);

// Capacity: staffing bottleneck, overtime and demand conservation.
const baseCapacity=defaultInputs("mfCapacity",137);
const capacity=run("mfCapacity",baseCapacity);
assert(value(capacity,"produced")>=0&&value(capacity,"produced")<=baseCapacity.demand+0.01);
assert(Math.abs(value(capacity,"produced")+value(capacity,"shortage")-baseCapacity.demand)<0.03);
const fewerStaff=run("mfCapacity",{...baseCapacity,staff:1});
assert(value(fewerStaff,"produced")<=value(capacity,"produced")+0.01);

// Preventive maintenance budget and no-worse expected cost.
const maintInput=defaultInputs("mfMaintenance",137);
const maint=run("mfMaintenance",maintInput);
assert(value(maint,"interventions")*maintInput.prevent<=maintInput.budget+0.01);
assert(value(maint,"delta")>=-0.01);

// Quality: improved process raises good yield and false-reject effect.
const q=defaultInputs("mfQuality",137);
const good=run("mfQuality",{...q,improve:q.improve+20});
const bad=run("mfQuality",{...q,improve:0});
assert(value(good,"qualityYield")>=value(bad,"qualityYield")-0.01);
const moreFalse=run("mfQuality",{...q,falsePositive:15});
const fewerFalse=run("mfQuality",{...q,falsePositive:0});
assert(value(moreFalse,"falseReject")>=value(fewerFalse,"falseReject"));

// Materials: X,Y BOM and remaining orders under available resources.
const p=defaultInputs("mfMaterials",137),mat=run("mfMaterials",p);
const batchesA=table(mat,"Lotes A"),batchesB=table(mat,"Lotes B");
assert(batchesA<=p.ordersA&&batchesB<=p.ordersB);
assert(batchesA*2+batchesB<=p.materialX);
assert(batchesA+batchesB*3<=p.materialY);
assert(value(mat,"delta")>=-0.01);

// Energy: capacity, economics and conservation.
const energyInput=defaultInputs("mfEnergy",137),energy=run("mfEnergy",energyInput);
assert(value(energy,"shiftedKWh")<=energyInput.offCap+0.01);
assert(value(energy,"shiftedKWh")>=0);
assert(value(energy,"delta")>=-0.01);
assert(value(energy,"energy")<=energyInput.units*energyInput.kwh+0.01);

// ES-CAT-EN table translations for all SC03 table row keys.
const detailKeys=new Set(sc03.pain_points.flatMap(p=>run(p.model).table.map(([name])=>name)));
for(const key of detailKeys)assert(DETAIL_TRANSLATIONS[key]?.every(Boolean),"Missing translated detail label: "+key);
console.log("SC03 manufacturing validated: six specialist models, BOM constraints, sequencing, capacity, quality, prevention, energy and translated reports.");
