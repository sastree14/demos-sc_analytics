import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,DETAIL_TRANSLATIONS,SECTOR_CONTEXT,WARNING_TRANSLATIONS,sectorText} from "./i18n.js";
import {BUSINESS_QUESTIONS} from "./problem-copy.js";
const mapping={
 SC13:["csProjects","csCapacity","csPipeline","csScope","csDocs","csPartner"],
 SC14:["svDispatch","svFirstFix","svPreventive","svUrgent","svContract","svVans"],
 SC15:["saRetention","saActivation","saAgents","saCost","saMRR","saSupport"],
 SC16:["edEngagement","edTimetable","edCourse","edEnroll","edSupport","edResources"],
 SC17:["enPeak","enForecast","enSensors","enPrevent","enTariff","enEfficiency"],
 SC18:["evAttendance","evPricing","evStaff","evWeather","evQueue","evProfit"]
};
const run=(key,values)=>calculate(key,values??defaultInputs(key,1600));
const val=(result,key)=>result.metrics.find(x=>x.key===key)?.value;
let total=0,edges=0,queries=0;
for(const [code,engines] of Object.entries(mapping)){
 const sector=INDUSTRY_CATALOG.sectors.find(x=>x.code===code);
 assert(sector,code);
 assert.deepEqual(sector.pain_points.map(x=>x.model),engines);
 assert.equal(BUSINESS_QUESTIONS[code]?.length,6);
 assert(SECTOR_CONTEXT[code]?.ca&&SECTOR_CONTEXT[code]?.en);
 for(const [index,kind] of engines.entries()){
  total++;
  const definition=MODELS[kind],input=defaultInputs(kind,sector.pain_points[index].scenario_seed);
  assert(definition?.inputs.length>=5,kind+" missing interactive controls");
  assert.equal(EXPLANATIONS[kind]?.length,3);
  assert.equal(CONSTRAINTS[kind]?.length,3);
  assert(sectorText[code]?.problems[index]?.ca&&sectorText[code]?.problems[index]?.en);
  for(const text of BUSINESS_QUESTIONS[code][index]){
   queries++;
   assert(text.length>=35&&text.length<250,kind+" malformed UX question");
   assert(text.includes("?"),kind+" UX entry is not a question");
  }
  const initial=run(kind,input);
  assert.equal(initial.metrics.length,4,kind+" KPI count");
  assert(initial.metrics.every(x=>Number.isFinite(x.value)),kind+" initial nonfinite KPI");
  assert(initial.visual.series.every(x=>x.values.length===initial.visual.labels.length),kind+" mismatched chart");
  assert(initial.visual.series.every(x=>x.values.every(Number.isFinite)),kind+" nonfinite chart");
  for(const [name] of initial.table){
   assert(DETAIL_TRANSLATIONS[name]?.every(Boolean),kind+" untranslated report label "+name);
  }
  if(initial.warning)assert(WARNING_TRANSLATIONS[initial.warning]?.every(Boolean),kind+" untranslated notice");
  let reactive=false;
  for(const field of definition.inputs){
   assert(field.min<=field.value&&field.value<=field.max,kind+" default outside slider: "+field.key);
   for(const boundary of [field.min,field.max]){
    edges++;
    const variant=run(kind,{...input,[field.key]:boundary});
    assert(variant.metrics.every(x=>Number.isFinite(x.value)),kind+" invalid at "+field.key);
    assert(variant.visual.series.every(x=>x.values.length===variant.visual.labels.length),kind+" chart at "+field.key);
    assert(variant.visual.series.every(x=>x.values.every(v=>v===null||Number.isFinite(v))),kind+" series nonfinite at "+field.key);
    if(variant.metrics.some((x,i)=>Math.abs(x.value-initial.metrics[i].value)>1e-3))reactive=true;
   }
  }
  assert(reactive,kind+" all sliders inert");
 }
}
const get=(key)=>run(key);
const requiresRange=(num,lo,hi,msg)=>assert(num>=lo-1e-6&&num<=hi+1e-6,msg+" "+num);
requiresRange(val(get("csCapacity"),"service"),0,100,"consulting capacity");
requiresRange(val(get("csPartner"),"service"),0,100,"partner coverage");
assert(val(get("csPipeline"),"shortage")>=0);
requiresRange(val(get("svDispatch"),"service"),0,100,"technician service");
requiresRange(val(get("svFirstFix"),"firstFix"),0,100,"first-time fix");
const sp=defaultInputs("svVans",1600),stock=get("svVans");
assert(val(stock,"stock")<=sp.vans*sp.capacity+.1,"van stock exceeds physical space");
assert(val(stock,"stock")*sp.price<=sp.stockBudget+.1,"van stock exceeds budget");
const urg=get("svUrgent");requiresRange(val(urg,"service"),0,100,"urgent backlog coverage");
const s=get("saRetention");assert(val(s,"mrr")>=0&&val(s,"nrr")>=0);
requiresRange(val(get("saActivation"),"activation"),0,100,"activation");
const evals=get("saAgents");assert(val(evals,"reviewed")<=defaultInputs("saAgents",1600).capacity+.1);
const ed=get("edTimetable");requiresRange(val(ed,"service"),0,100,"classroom allocation");
const ec=defaultInputs("edCourse",1600),course=get("edCourse");requiresRange(val(course,"service"),0,100,"course seats");
const enroll=defaultInputs("edEnroll",1600),enrollment=get("edEnroll");
assert(val(enrollment,"enrolled")<=enroll.seats+enroll.newSeats+.1);
const f=get("edEngagement");requiresRange(val(f,"retention"),0,100,"education retention");
const pe=defaultInputs("enPeak",1600),peak=get("enPeak");
assert(val(peak,"shifted")<=Math.min(pe.flex,pe.offCap)+.1,"peak shift exceeds flexibility");
assert(val(peak,"delta")>=-.02,"peak shift must not worsen cost");
const tariff=defaultInputs("enTariff",1600),et=get("enTariff");
assert(val(et,"shifted")<=tariff.offCap+.1);
assert(val(et,"delta")>=-.02,"tariff shift must not increase energy cost");
const preventive=defaultInputs("enPrevent",1600),pm=get("enPrevent");
assert(val(pm,"interventions")<=Math.min(preventive.equipment,preventive.window)+.1);
assert(val(pm,"interventions")*preventive.intervention<=preventive.budget+.1);
const att=defaultInputs("evAttendance",1600),event=get("evAttendance");
assert(val(event,"attendance")<=att.capacity+.1);
requiresRange(val(event,"occupancy"),0,100,"event capacity");
const vp=get("evPricing");requiresRange(val(vp,"occupancy"),0,100,"zone occupancy");
assert(val(vp,"delta")>=-.02,"price grid should include baseline");
const weather=get("evWeather");assert(val(weather,"delta")>=-.02,"contingency cannot lower chosen scenario");
const evq=get("evQueue");requiresRange(val(evq,"service"),0,100,"event queue coverage");
console.log("Final six sectors validated: "+total+" specialised engines, "+edges+" slider endpoints, "+queries+" multilingual UX questions and 6 domain invariant groups.");
