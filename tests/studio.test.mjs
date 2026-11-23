import test from "node:test";
import assert from "node:assert/strict";
import {cases,byId,runCase,initial,controlSpecs} from "../predictive-models/studio-engine.js";

test("commercial showroom contains the seven distinct business applications",()=>{
 assert.deepEqual(cases.map(c=>c.id),["demand","revenue","workforce","churn","delivery","cost","anomaly"]);
 assert.deepEqual([...new Set(cases.map(c=>c.kind))].sort(),["anomaly","classification","forecast","regression"]);
});

test("all business examples calculate four finite metrics, real actions and a decision report",()=>{
 for(const c of cases){
  const r=runCase(c.id);
  assert.equal(r.case.id,c.id);
  assert.equal(r.metrics.length,4);
  assert.ok(r.metrics.every(m=>m.label&&m.value&&m.hint));
  assert.equal(r.decision.actions.length,3);
  assert.ok(r.methodology.length>80);
  assert.ok(r.impact.note.includes("not ")||r.impact.note.includes("assumed")||r.impact.note.includes("is not"));
  assert.ok(r.quality.length>=4);
  assert.equal(r.drivers.length>=3,true);
 }
});

test("all examples use reproducible, non-sensitive generated observations",()=>{
 for(const c of cases){
  const first=runCase(c.id),second=runCase(c.id);
  assert.deepEqual(first,second);
 }
});

test("forecasts respect horizon selection, scenario arithmetic and model holdout integrity",()=>{
 for(const id of ["demand","revenue","workforce"]){
  const base=runCase(id,{horizon:6,outlook:0,confidence:90});
  const stress=runCase(id,{horizon:12,outlook:20,confidence:95});
  assert.equal(base.history.length,42);
  assert.equal(base.back.length,6);
  assert.equal(base.future.length,6);
  assert.equal(stress.future.length,12);
  assert.ok(stress.future.every(p=>p.low<=p.value&&p.high>=p.value));
  assert.ok(base.future.every(p=>p.low<=p.value&&p.high>=p.value));
  assert.ok(stress.future.at(-1).value>runCase(id,{horizon:12,outlook:0}).future.at(-1).value);
  assert.equal(base.selected.accuracy,stress.selected.accuracy,"planning scenario does not rewrite validation accuracy");
  assert.ok(base.validation.every(r=>Number.isFinite(r.accuracy)&&Number.isFinite(r.mae)));
 }
});

test("classification score is fitted to held-out validation data and threshold changes flags, not probabilities",()=>{
 for(const id of ["churn","delivery"]){
  const low=runCase(id,{threshold:25}),high=runCase(id,{threshold:80});
  assert.equal(low.rows.length,130);
  assert.equal(high.rows.length,130);
  assert.equal(low.probability,high.probability);
  assert.ok(low.cm.alerts>=high.cm.alerts);
  assert.ok(low.cm.recall>=high.cm.recall);
  assert.equal(low.cm.tp+low.cm.tn+low.cm.fp+low.cm.fn,130);
  assert.ok(low.cm.precision>=0&&low.cm.precision<=1);
  assert.ok(low.cm.recall>=0&&low.cm.recall<=1);
 }
});

test("numeric cost regression is fitted and responds to material changes in job size",()=>{
 const a=runCase("cost",{volume:100});
 const b=runCase("cost",{volume:600});
 assert.equal(a.chart.points.length,50);
 assert.equal(a.quality.length,4);
 assert.ok(b.estimate>a.estimate);
 assert.ok(a.low<=a.estimate&&a.high>=a.estimate);
 assert.ok(b.low<=b.estimate&&b.high>=b.estimate);
 assert.equal(a.quality[0].value,"100 separate jobs");
});

test("anomaly classifier uses prior-window observations and threshold sensitivity",()=>{
 const high=runCase("anomaly",{sensitivity:2.0});
 const low=runCase("anomaly",{sensitivity:3.5});
 assert.equal(high.series.length,96);
 assert.ok(high.flags.length>=low.flags.length);
 assert.ok(high.series.every(row=>Number.isFinite(row.score)));
 assert.ok(high.series.slice(0,10).every(row=>!row.flagged));
});

test("controls exist for each active family, and all initial values are within slider ranges",()=>{
 for(const c of cases){
  const specs=controlSpecs[c.kind==="classification"||c.kind==="regression"?c.id:c.kind];
  assert.ok(specs?.length>=4);
  for(const spec of specs){
   const init=initial[c.id][spec.key];
   assert.notEqual(init,undefined,c.id+"."+spec.key);
   if(spec.kind==="slider"){
    assert.ok(Number(init)>=spec.min&&Number(init)<=spec.max,c.id+"."+spec.key+" outside bounds");
   }else if(spec.kind==="choice"){
    assert.ok(spec.choices.some(x=>Number(x[0])===Number(init)),c.id+"."+spec.key+" not available");
   }
  }
 }
});
