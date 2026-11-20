import test from "node:test";
import assert from "node:assert/strict";
import {runForecast,runRisk,segments,models,historicalSeries} from "../predictive-models/model.js";

test("forecast outputs calculated validation and consistent horizons",()=>{
  for(const segment of Object.keys(segments))for(const method of Object.keys(models))for(const horizon of [3,6,12]){
    const r=runForecast({segment,method,horizon,growth:0,volatility:0});
    assert.equal(r.future.length,horizon);
    assert.equal(r.series.length,42);
    assert.equal(r.backtest.length,8);
    assert.ok(Number.isFinite(r.accuracy));
    assert.ok(Number.isFinite(r.chosen.mae));
    assert.ok(r.future.every(v=>v.low<=v.value&&v.value<=v.high));
  }
});
test("forecast accuracy remains a holdout metric when scenario is adjusted",()=>{
  const a=runForecast({segment:"distribution",method:"ensemble",horizon:6,growth:0});
  const b=runForecast({segment:"distribution",method:"ensemble",horizon:6,growth:15});
  assert.equal(a.accuracy,b.accuracy);
  assert.notEqual(a.total,b.total);
});
test("classification uses separate held-out examples",()=>{
  const r=runRisk({backlog:62,distance:600,reliability:88,priority:false});
  assert.equal(r.samples,480);
  assert.equal(r.validation.size,100);
  for(const key of ["accuracy","precision","recall","f1"])
    assert.ok(r.validation[key]>=0&&r.validation[key]<=1);
  assert.ok(r.probability>=0&&r.probability<=1);
});
test("all generated records are reproducible",()=>{
  assert.deepEqual(historicalSeries("retail"),historicalSeries("retail"));
});
