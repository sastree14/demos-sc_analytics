import test from "node:test";
import assert from "node:assert/strict";
import {catalogue,cases,optimise,comparisonPolicy,runOptimisation,validateResult,settings,scoreProduct} from "../optimization/model.js";

test("optimisation constraints are respected across multiple planning situations",()=>{
  const budgets=[15000,23000,33000,48000,70000];
  const capacities=[200,350,450,600,800];
  for(const budget of budgets)for(const capacity of capacities)for(const market of Object.keys(cases)){
    const result=runOptimisation({budget,capacity,market,period:4,uncertainty:100,service:100});
    assert.equal(validateResult(result),true);
    assert.ok(result.delta>=-0.0000001);
    assert.ok(result.optimised.evaluation.spend<=budget);
    assert.ok(result.optimised.evaluation.storage<=capacity);
  }
});
test("solver returns integer ten-unit batches and honours SKU limits",()=>{
  const result=optimise({budget:70000,capacity:800,market:"growth",period:12});
  result.quantities.forEach((q,i)=>{
    assert.equal(q%10,0);
    assert.ok(q<=catalogue[i].maxOrder);
    assert.ok(q>=0);
  });
});
test("reported contribution uplift equals calculated plan difference",()=>{
  const r=runOptimisation({budget:33000,capacity:450});
  const delta=r.optimised.evaluation.contribution-r.comparison.evaluation.contribution;
  assert.ok(Math.abs(r.delta-delta)<1e-9);
});
test("market sensitivity evaluates same chosen orders, not three independently optimised plans",()=>{
  const r=runOptimisation({budget:33000,capacity:450});
  for(const item of r.scenarios){
    assert.deepEqual(item.optimised.units,r.optimised.quantities);
    assert.deepEqual(item.comparison.units,r.comparison.quantities);
  }
});
test("independent baseline rule also respects resource caps",()=>{
  const r=comparisonPolicy({budget:18000,capacity:220});
  assert.ok(r.evaluation.spend<=18000);
  assert.ok(r.evaluation.storage<=220);
});
test("synthetic model is deterministic",()=>{
  const s=settings({budget:22000,capacity:350,period:8,service:150});
  assert.deepEqual(runOptimisation(s),runOptimisation(s));
});
test("expected contribution is computed from genuinely varied purchase quantities",()=>{
  const s=settings();
  const p=catalogue[0];
  assert.notEqual(scoreProduct(p,0,s).contribution,scoreProduct(p,100,s).contribution);
});
