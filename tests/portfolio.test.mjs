import test from "node:test";
import assert from "node:assert/strict";
import {modules,moduleById,caseById,initial,run} from "../shared/portfolio-engine.js";

test("five executive modules expose twenty distinct, generalist service cases",()=>{
 assert.equal(modules.length,5);
 assert.ok(modules.every(m=>m.cases.length===4));
 const all=modules.flatMap(m=>m.cases.map(c=>c.id));
 assert.equal(new Set(all).size,20);
 assert.deepEqual(modules.map(m=>m.id),["automation-ai","modelling-scenarios","simulations","bi-reporting","custom-apps"]);
});

test("every scenario returns calculated KPIs, two charts, sample records and a truthful report",()=>{
 for(const m of modules)for(const c of m.cases){
  const r=run(m.id,c.id);
  assert.equal(r.case.id,c.id);
  assert.equal(r.metrics.length,4);
  assert.ok(r.metrics.every(x=>x.label&&x.value&&x.hint));
  assert.ok(["bars","line","distribution"].includes(r.chart.kind));
  assert.ok(r.chart.series.length>=2);
  assert.ok(r.comparison.series.length>=2);
  assert.ok(r.table.rows.length>=2);
  assert.ok(r.table.columns.length>=4);
  assert.equal(r.decision.actions.length,3);
  assert.ok(r.impact.formula.length>20&&r.impact.note.length>20);
  assert.ok(r.methodology.length>70);
  assert.ok(r.quality.length>=4);
 }
});

test("synthetic results are deterministic and do not depend on hidden live services",()=>{
 for(const m of modules)for(const c of m.cases){
  assert.deepEqual(run(m.id,c.id),run(m.id,c.id));
 }
});

test("all extreme configured input cases stay numerically finite",()=>{
 for(const m of modules)for(const c of m.cases){
  const extreme={};
  for(const control of c.inputs)extreme[control.key]=control.kind==="range"?control.max:control.values.at(-1)[0];
  const result=run(m.id,c.id,extreme);
  assert.equal(result.metrics.length,4);
  assert.ok(result.chart.series.every(x=>[x.a,x.b,x.c].every(Number.isFinite)));
  assert.ok(result.comparison.series.every(x=>[x.a,x.b,x.c].every(Number.isFinite)));
  assert.ok(result.metrics.every(x=>!x.value.includes("NaN")&&!x.value.includes("Infinity")));
 }
});

test("automation routes real example records and respects stricter policy controls",()=>{
 const lenient=run("automation-ai","invoice-flow",{limit:12000,tolerance:8});
 const strict=run("automation-ai","invoice-flow",{limit:500,tolerance:0});
 assert.ok(Number(lenient.metrics[2].value.split(" ")[0])<Number(strict.metrics[2].value.split(" ")[0]));
 const low=run("automation-ai","service-routing",{confidence:60});
 const high=run("automation-ai","service-routing",{confidence:95});
 assert.notEqual(low.metrics[1].value,high.metrics[1].value);
 assert.ok(low.table.rows.some(row=>row.length===4));
});

test("investment and pricing respond to economics with coherent decision rules",()=>{
 const base=run("modelling-scenarios","investment",{discount:5});
 const expensive=run("modelling-scenarios","investment",{discount:18});
 assert.ok(Number(base.impact.value.replace(/[^\d,.-]/g,"").replaceAll(".","").replace(",", "."))>
 Number(expensive.impact.value.replace(/[^\d,.-]/g,"").replaceAll(".","").replace(",", ".")));
 const price=run("modelling-scenarios","pricing");
 assert.ok(price.comparison.series[1].a>=price.comparison.series[0].a-1);
 assert.ok(price.chart.series.length>=20);
 const lowChurn=run("modelling-scenarios","recurring",{churn:1});
 const highChurn=run("modelling-scenarios","recurring",{churn:8});
 assert.ok(lowChurn.chart.series.at(-1).a>highChurn.chart.series.at(-1).a);
});

test("inventory Monte Carlo, queue and project deadline respond to controllable risk assumptions",()=>{
 const weakStock=run("simulations","stock-risk",{stock:500,order:0});
 const strongStock=run("simulations","stock-risk",{stock:2500,order:1500});
 assert.ok(Number(weakStock.metrics[0].value.replace("%",""))>=Number(strongStock.metrics[0].value.replace("%","")));
 const slow=run("simulations","queue-risk",{agents:3});
 const staffed=run("simulations","queue-risk",{agents:12});
 assert.ok(Number(staffed.metrics[0].value.replace("%",""))>=Number(slow.metrics[0].value.replace("%","")));
 const tight=run("simulations","delivery-risk",{deadline:60});
 const ample=run("simulations","delivery-risk",{deadline:160});
 assert.ok(Number(ample.metrics[0].value.replace("%",""))>=Number(tight.metrics[0].value.replace("%","")));
});

test("BI filters the same source data rather than changing the reporting denominator arbitrarily",()=>{
 const all=run("bi-reporting","logistics-bi",{region:"All"});
 const north=run("bi-reporting","logistics-bi",{region:"North"});
 assert.equal(all.metrics[0].value,"700");
 assert.ok(Number(north.metrics[0].value)<700);
 const salesAll=run("bi-reporting","sales-bi",{region:"All"});
 const salesNorth=run("bi-reporting","sales-bi",{region:"North"});
 assert.notEqual(salesAll.metrics[0].value,salesNorth.metrics[0].value);
 assert.equal(salesAll.table.rows.length,12);
 const product=run("bi-reporting","profitability-bi",{channel:"Digital"});
 assert.equal(product.table.rows.length,6);
});

test("procurement sequential approval never exceeds aggregate budget",()=>{
 const low=run("custom-apps","purchase-approvals",{budget:50000});
 const high=run("custom-apps","purchase-approvals",{budget:400000});
 assert.ok(Number(low.metrics[1].value)<=Number(high.metrics[1].value));
 assert.ok(low.table.rows.every(row=>row.length===4));
 assert.ok(low.impact.note.includes("not actually approve")||low.methodology.includes("not actually executed"));
 const crm=run("custom-apps","sales-crm",{stale:7}),looser=run("custom-apps","sales-crm",{stale:60});
 assert.ok(Number(crm.metrics[2].value)>=Number(looser.metrics[2].value));
});

test("all financial figures in the new application use euro conventions",()=>{
 const moneyRuns=[
  run("automation-ai","invoice-flow"),run("modelling-scenarios","investment"),
  run("simulations","delivery-risk"),run("bi-reporting","sales-bi"),
  run("custom-apps","purchase-approvals")
 ];
 assert.ok(moneyRuns.every(r=>r.impact.value.includes("€")&&!r.impact.value.includes("£")));
});
