import assert from "node:assert/strict";
import {EXTRA_MODELS,EXTRA_CASES,EXTRA_COPY,EXTRA_ACTIONS} from "./sector-expanded.js";
import {calculate,defaultInputs,metricLabel} from "./models.js";
assert.equal(Object.keys(EXTRA_CASES).length,17);assert.equal(Object.keys(EXTRA_MODELS).length,170);
let checks=0;
for(const [code,cases] of Object.entries(EXTRA_CASES)){assert.equal(cases.length,10);for(const c of cases){const d=EXTRA_MODELS[c.model],p=defaultInputs(c.model,c.scenario_seed),a=EXTRA_ACTIONS[c.model];assert(d.inputs.some(f=>f.key===a[0])&&d.inputs.some(f=>f.key===a[2]));assert(EXTRA_COPY[c.model].title.en&&EXTRA_COPY[c.model].title.ca);for(const v of [p,...d.inputs.flatMap(f=>[f.min,f.max].map(x=>({...p,[f.key]:x})))]){const o=calculate(c.model,v);assert.equal(o.metrics.length,4);assert(o.metrics.every(m=>Number.isFinite(m.value)&&metricLabel(m.key,"en").length>1),c.id);assert(o.visual.series.every(s=>s.values.length===o.visual.labels.length&&s.values.every(v=>v===null||Number.isFinite(v))),c.id);checks++;}}}
console.log("Expanded sectors:",Object.keys(EXTRA_CASES).length,"additional models:",Object.keys(EXTRA_MODELS).length,"numeric checks:",checks);
