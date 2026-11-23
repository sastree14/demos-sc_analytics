import test from "node:test";
import assert from "node:assert/strict";
import {optimizationModule,runOptimizationCase} from "../shared/optimization-engine.js";
import {modules,run} from "../shared/portfolio-engine.js";
import {cases,runCase} from "../predictive-models/studio-engine.js";
import {evaluateDecision,answerGuide,explainControl,familyColors,links} from "../shared/decision-engine.js";

const count=()=>modules.reduce((n,m)=>n+m.cases.length,0)+optimizationModule.cases.length+cases.length;
test("all seven service families have unique pastel identities and 32 meaningful business cases",()=>{
 assert.equal(count(),32);
 assert.equal(new Set(links.map(x=>x[0])).size,7);
 assert.equal(Object.keys(familyColors).length,7);
 assert.equal(new Set(Object.values(familyColors).map(x=>x.main)).size,7);
 assert.equal(optimizationModule.cases.length,5);
 assert.equal(new Set([...cases.map(x=>x.id),...optimizationModule.cases.map(x=>x.id),...modules.flatMap(m=>m.cases.map(x=>x.id))]).size,32);
});
test("five mathematical optimisation cases compute objective and constraints deterministically",()=>{
 for(const c of optimizationModule.cases){
  const a=runOptimizationCase(c.id),b=runOptimizationCase(c.id);
  assert.deepEqual(a,b,c.id);
  assert.equal(a.metrics.length,4);
  assert.ok(a.chart.series.length>=3);
  assert.ok(a.comparison.series.length>=2);
  assert.ok(a.table.rows.length>=3);
  assert.ok(a.impact.value.includes("€"));
  assert.ok(a.quality.length>=4);
  assert.ok(a.impact.note.includes("Not ")||a.impact.note.includes("not "));
 }
});
test("portfolio allocation stays within its selected budget and team hours",()=>{
 for(const [budget,hours] of [[50000,200],[210000,700],[400000,1400]]){
  const r=runOptimizationCase("resource-allocation",{budget,hours});
  const rows=r.table.rows.filter(x=>x[3]==="SELECT");
  const euro=x=>Number(x.replace(/[^0-9]/g,""));
  assert.ok(rows.reduce((s,x)=>s+euro(x[1]),0)<=budget);
  assert.ok(rows.reduce((s,x)=>s+parseInt(x[2]),0)<=hours);
 }
});
test("workforce, fleet and product mix solutions are actually feasible under extreme controls",()=>{
 for(const c of optimizationModule.cases.filter(x=>!["resource-allocation","inventory-allocation"].includes(x.id))){
  for(const values of [Object.fromEntries(c.inputs.map(x=>[x.key,x.kind==="range"?x.min:x.values[0][0]])),Object.fromEntries(c.inputs.map(x=>[x.key,x.kind==="range"?x.max:x.values.at(-1)[0]]))]){
   const r=runOptimizationCase(c.id,values);
   assert.ok(r.metrics.every(x=>!x.value.includes("NaN")&&!x.value.includes("Infinity")));
   assert.ok(r.chart.series.every(x=>[x.a,x.b,x.c].every(Number.isFinite)));
   assert.ok(r.impact.value.includes("€"));
  }
 }
});
test("advanced inventory example continues to use the exact discrete optimiser",()=>{
 const r=runOptimizationCase("inventory-allocation",{budget:33000,capacity:450,market:"growth",period:8});
 assert.ok(r.methodology.includes("dynamic programming"));
 assert.equal(r.chart.series.length,4);
 assert.ok(r.metrics[1].value.includes("€"));
});
test("every service example has grounded recommendation, trigger and next review",()=>{
 for(const m of modules)for(const c of m.cases){
  const r=run(m.id,c.id),d=evaluateDecision({id:c.id,result:r,params:r.params});
  assert.ok(["act","prepare","wait","review"].includes(d.level));
  assert.ok(d.status.length>5&&d.threshold.length>18&&d.next.length>10&&d.review.length>8);
 }
 for(const c of optimizationModule.cases){
  const r=runOptimizationCase(c.id),d=evaluateDecision({id:c.id,result:r,params:r.params});
  assert.ok(["act","prepare","wait","review"].includes(d.level));
  assert.ok(d.threshold.length>18);
 }
 for(const c of cases){
  const r=runCase(c.id),d=evaluateDecision({id:c.id,result:r,params:r.params||{}});
  assert.ok(d.status.length>5&&d.next.length>5);
 }
});
test("decision status changes when meaningful business thresholds are crossed",()=>{
 const low=run("simulations","stock-risk",{stock:100,order:0}),high=run("simulations","stock-risk",{stock:2800,order:1800});
 assert.notEqual(evaluateDecision({id:"stock-risk",result:low,params:low.params}).level,evaluateDecision({id:"stock-risk",result:high,params:high.params}).level);
 const a=run("modelling-scenarios","investment",{outlay:500000,savings:30000}),b=run("modelling-scenarios","investment",{outlay:50000,savings:240000});
 assert.notEqual(evaluateDecision({id:"investment",result:a,params:a.params}).level,evaluateDecision({id:"investment",result:b,params:b.params}).level);
 const x=run("custom-apps","fleet-assets",{age:12,repair:2000,downtime:1000,replacement:17000}),y=run("custom-apps","fleet-assets",{age:3,repair:13000,downtime:12000,replacement:5000});
 assert.notEqual(evaluateDecision({id:"fleet-assets",result:x,params:x.params}).level,evaluateDecision({id:"fleet-assets",result:y,params:y.params}).level);
});
test("Decision Guide explains current facts and does not pretend to run a real LLM",()=>{
 const r=run("modelling-scenarios","investment"),d=evaluateDecision({id:"investment",result:r,params:r.params});
 const ctx={id:r.case.id,result:r,decision:d,params:r.params,controls:r.case.inputs,alternatives:[]};
 const why=answerGuide("Why are you recommending this?",ctx);
 assert.ok(why.includes(d.status)&&why.includes(d.threshold));
 const impact=answerGuide("What is the financial impact?",ctx);
 assert.ok(impact.includes(r.impact.value));
 const control=answerGuide("Explain Upfront investment",ctx);
 assert.ok(control.includes("Upfront investment"));
 const hello=answerGuide("Hello what can you do?",ctx);
 assert.ok(hello.includes("not a remote LLM"));
 const compare=answerGuide("Compare alternatives",ctx);
 assert.ok(compare.includes("Save Alternative"));
});
