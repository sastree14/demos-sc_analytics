import assert from "node:assert/strict";
import {BUSINESS_QUESTIONS} from "./problem-copy.js";
import {INDUSTRY_CATALOG} from "./catalog.js";
const sectors=INDUSTRY_CATALOG.sectors.filter(s=>Number(s.code.slice(2))>=6&&Number(s.code.slice(2))<=12);
assert.equal(sectors.length,7);
let count=0;
for(const sector of sectors){
 const questions=BUSINESS_QUESTIONS[sector.code];
 assert.equal(questions?.length,6,sector.code);
 for(const [index,q] of questions.entries()){
  assert.equal(q.length,3);
  for(const text of q){
   assert(text.length>=35&&text.length<220,sector.code+" "+index+" malformed question");
   assert(text.includes("?")||text.includes("¿"),sector.code+" "+index+" no question");
  }
  count++;
 }
}
console.log("Decision-first prompts validated: "+count+" sector questions in ES/CAT/EN.");
