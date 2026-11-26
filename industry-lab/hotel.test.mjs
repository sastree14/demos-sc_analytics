import assert from "node:assert/strict";
import {INDUSTRY_CATALOG} from "./catalog.js";
import {MODELS,calculate,defaultInputs} from "./models.js";
import {EXPLANATIONS,CONSTRAINTS,sectorText,DETAIL_TRANSLATIONS} from "./i18n.js";
const industry=INDUSTRY_CATALOG.sectors.find(s=>s.code==="SC07");
assert(industry);
assert.deepEqual(industry.pain_points.map(x=>x.model),["htOccupancy","htChannels","htHousekeeping","htReception","htEnergy","htGroupBooking"]);
const run=(name,v)=>calculate(name,v??defaultInputs(name,710));
const metric=(r,k)=>r.metrics.find(x=>x.key===k)?.value;
for(const [i,p] of industry.pain_points.entries()){
 const def=MODELS[p.model],base=defaultInputs(p.model,p.scenario_seed);
 assert(def.inputs.length>=5);
 assert(sectorText.SC07.problems[i].ca&&sectorText.SC07.problems[i].en);
 assert(EXPLANATIONS[p.model]?.length===3&&CONSTRAINTS[p.model]?.length===3);
 for(const input of def.inputs)for(const endpoint of [input.min,input.max]){
   const res=run(p.model,{...base,[input.key]:endpoint});
   assert(res.metrics.length===4&&res.metrics.every(v=>Number.isFinite(v.value)),p.id+" invalid "+input.key);
   assert(res.visual.series.every(s=>s.values.length===res.visual.labels.length),p.id+" plot length "+input.key);
 }
 for(const [label] of run(p.model,base).table)assert(DETAIL_TRANSLATIONS[label]?.every(Boolean),"Untranslated "+p.id+" "+label);
}
const occ=defaultInputs("htOccupancy",710),o=run("htOccupancy",occ);
assert(metric(o,"occupancy")>=0&&metric(o,"occupancy")<=100);
assert(metric(o,"volume")<=7*occ.rooms+0.1);
const fewer=run("htOccupancy",{...occ,rooms:Math.max(25,occ.rooms-40)});
assert(metric(fewer,"volume")<=7*Math.max(25,occ.rooms-40)+0.1);
const ch=defaultInputs("htChannels",710),c=run("htChannels",ch);
assert(metric(c,"revenue")>0);
assert(metric(c,"profit")<=metric(c,"revenue")+0.01);
assert(metric(c,"revpar")>=0&&metric(c,"revpar")<=ch.rate+0.01);
const hc=defaultInputs("htHousekeeping",710),h=run("htHousekeeping",hc);
assert(metric(h,"service")>=0&&metric(h,"service")<=100);
assert(metric(h,"unserved")>=0);
assert(metric(h,"delta")>=-0.01);
const qr=defaultInputs("htReception",710),q=run("htReception",qr);
assert(metric(q,"wait")>=0&&metric(q,"staff")<=qr.receptionists+qr.extra);
const ee=defaultInputs("htEnergy",710),e=run("htEnergy",ee);
assert(metric(e,"energy")>=0&&metric(e,"cost")>=0);
const g=defaultInputs("htGroupBooking",710),group=run("htGroupBooking",g);
assert(metric(group,"displaced")>=0&&metric(group,"displaced")<=g.nights*g.rooms);
assert(metric(group,"service")>=0&&metric(group,"service")<=100);
console.log("SC07 hotels validated: pickup, channel contribution/RevPAR, housekeeping, reception queues, energy and group decisions.");
