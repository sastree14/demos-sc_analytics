import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {getDefinition,calculate,defaultInputs,modelNames,metricLabel} from "./models.js";
import {sectorText,UI,EXPLANATIONS,CONSTRAINTS} from "./i18n.js";

const sectors=INDUSTRY_CATALOG.sectors;
assert.equal(sectors.length,18,"Expected 18 industries");
let total=0,changes=0;
const ids=new Set();
for(const sector of sectors){
 assert.match(sector.code,/^SC\d\d$/);
 assert.equal(sector.pain_points.length,6,sector.code+" must have six challenges");
 assert.equal(sectorText[sector.code].problems.length,6,sector.code+" must have Catalan and English labels");
 for(let j=0;j<sector.pain_points.length;j++){
  const pain=sector.pain_points[j];
  total++;
  assert(!ids.has(pain.id),"Duplicate "+pain.id);ids.add(pain.id);
  assert(modelNames.includes(pain.model),pain.id+" has no engine");
  assert(sectorText[sector.code].problems[j].ca.length>3);
  assert(sectorText[sector.code].problems[j].en.length>3);
  const d=getDefinition(pain.model),base=defaultInputs(pain.model,pain.scenario_seed);
  assert(d.inputs.length>=3);
  const result=calculate(pain.model,base);
  assert.equal(result.metrics.length,4,pain.id+" metric count");
  assert(result.visual.labels.length>0);
  assert(result.visual.series.every(s=>s.values.length===result.visual.labels.length));
  assert(result.metrics.every(m=>Number.isFinite(m.value)),pain.id+" returned nonfinite metric");
  assert(result.visual.series.flatMap(s=>s.values).every(x=>x===null||Number.isFinite(x)));
  assert(result.table.length>=2);
  assert(EXPLANATIONS[pain.model].every(x=>x.length>25));
  assert(CONSTRAINTS[pain.model].every(x=>x.length>20));
  for(const lang of ["es","ca","en"]){
   assert(UI[lang].tutorial.length===5);
   assert(metricLabel(result.metrics[0].key,lang).length>1);
  }
  let responsive=false;
  for(const input of d.inputs){
   const alt={...base,[input.key]:Math.abs(base[input.key]-input.min)>Math.abs(base[input.key]-input.max)?input.min:input.max};
   const other=calculate(pain.model,alt);
   assert(other.metrics.every(m=>Number.isFinite(m.value)),pain.id+" nonfinite on "+input.key);
   if(result.metrics.some((m,i)=>Math.abs(m.value-other.metrics[i].value)>0.001))responsive=true;
  }
  assert(responsive,pain.id+" has no numeric response to any changed input");
  changes+=responsive?1:0;
 }
}
assert.equal(total,108);
console.log("Industry Lab validated:",sectors.length,"sectors,",total,"problem simulations,",modelNames.length,"model families and",changes,"responsive journeys.");
