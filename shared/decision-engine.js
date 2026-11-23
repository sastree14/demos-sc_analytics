/**
 * Transparent, synthetic-data decision rules for the SC-Analytics Solutions Lab.
 * No autonomous action, remote AI, external permissions or verified savings.
 */
export const familyColors={
 "predictive-models":{name:"Powder blue",main:"#437ca1",light:"#deedf8",soft:"#f1f7fc"},
 "optimization":{name:"Sage green",main:"#438568",light:"#e0efdf",soft:"#f3faf2"},
 "automation-ai":{name:"Soft turquoise",main:"#317f83",light:"#daf1ef",soft:"#effafa"},
 "modelling-scenarios":{name:"Blush pink",main:"#956880",light:"#f7e1eb",soft:"#fcf4f8"},
 "simulations":{name:"Pastel lavender",main:"#756aa2",light:"#e9e2f7",soft:"#f8f5fc"},
 "bi-reporting":{name:"Warm sand",main:"#9a7951",light:"#faefd9",soft:"#fdf9ef"},
 "custom-apps":{name:"Soft coral",main:"#aa7165",light:"#fae2dc",soft:"#fdf5f3"}
};
export const links=[
 ["predictive-models","Predictive Intelligence"],["optimization","Mathematical Optimisation"],
 ["modelling-scenarios","Modelling & Scenarios"],["simulations","Simulation & Risk"],
 ["bi-reporting","BI & Reporting"],["automation-ai","Automation & AI"],["custom-apps","CRM / ERP / Apps"]
];
const money=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Number(n)||0);
const percent=n=>(100*n).toFixed(1)+"%";
const number=value=>{
 if(typeof value==="number")return value;
 const s=String(value??"").replace(/[€£\s%]/g,"").replace(/[^0-9.,+\-]/g,"");
 if(!s)return NaN;const comma=s.lastIndexOf(","),dot=s.lastIndexOf(".");
 if(comma>=0&&dot>=0)return Number(comma>dot?s.replaceAll(".","").replace(",","."):s.replaceAll(",",""));
 if(comma>=0)return Number(/,\d{3}$/.test(s)?s.replaceAll(",",""):s.replace(",","."));
 if(dot>=0&&/\.\d{3}$/.test(s))return Number(s.replaceAll(".",""));
 return Number(s);
};
const metric=(result,query)=>result?.metrics?.find(m=>m.label.toLowerCase().includes(query.toLowerCase()));
const get=(result,query)=>number(metric(result,query)?.value);
const make=(level,why,threshold,next,review)=>({level,why,threshold,next,review});
const titles={act:"ACT / REVIEW OPTIONS",prepare:"PREPARE A CONTINGENCY",wait:"WAIT & MONITOR",review:"HUMAN REVIEW REQUIRED"};
export function evaluateDecision({id,result,params={}}){
 if(!result)return {...make("review","The analysis has not been calculated.","Run an analysis first.","Check the inputs and run the current case.","When valid results are available."),status:titles.review,id};
 let d;
 switch(id){
 case "demand":case "revenue":case "workforce":{
  const data=result.future||[],avg=data.reduce((s,x)=>s+x.value,0)/(data.length||1),high=Math.max(0,...data.map(x=>x.high||x.value)),cap=Number(params.capacity)||1;
  d=avg>cap?make("act","Expected activity exceeds the configured available capacity.","Review capacity if scenario-average activity > "+cap+".","Compare additional resources with unserved-demand costs.","At the next planning cycle.")
   :high>cap?make("prepare","The expected value fits, but the upper illustrative outlook exceeds capacity.","Prepare when the upper indicative range exceeds "+cap+".","Evaluate a temporary capacity option.","At the next forecast refresh.")
   :make("wait","Expected activity and its indicative range remain within capacity.","Wait while the upper indicative range is below "+cap+".","Monitor capacity utilisation and forecast errors.","At the next data refresh.");
  break;
 }
 case "churn":case "delivery":{
  const risk=Number(result.probability)||0,threshold=Number(result.threshold)||.5;
  d=risk>=threshold?make("act","This example risk score of "+percent(risk)+" exceeds the chosen threshold.","Escalate when risk ≥ "+percent(threshold)+".","Review the case before authorising an intervention.","When new customer or delivery evidence arrives.")
   :make("wait","The current example risk score "+percent(risk)+" remains below the threshold.","Escalate when risk ≥ "+percent(threshold)+".","Continue monitoring; do not intervene automatically.","When input signals change.");
  break;
 }
 case "anomaly":d=(result.flags||[]).length?make("review",result.flags.length+" sample signals were flagged; an alert is not a confirmed incident.","Investigate when a rolling deviation crosses the selected sensitivity.","Inspect flagged readings with an operator.","After the next sensor readings."):make("wait","No current sample readings crossed the selected anomaly threshold.","Review on new outlying readings.","Continue monitoring.","At the next measurement.");break;
 case "cost":d=make("prepare","The numerical estimate is based on synthetic fitted examples, not a binding quote.","Request detailed validation before contractual pricing.","Review volume, distance, margins and delivery complexity.","Before a commercial commitment.");break;
 case "resource-allocation":{
  const gain=get(result,"VALUE VS HEURISTIC");
  d=gain>10000?make("act","The optimal feasible initiative portfolio improves modelled net value by "+money(gain)+" over a disclosed baseline.","Consider formal portfolio selection when improvement > €10,000 and the capacity constraints are met.","Validate project interdependencies and submit the feasible portfolio for review.","At the next investment and resource committee.")
  :gain>0?make("prepare","The feasible portfolio improves the illustrative benchmark by "+money(gain)+".","Prepare alternatives when improvement is positive but ≤ €10,000.","Confirm projected benefits, project hours and constraints.","Before budget allocation.")
  :make("wait","No material modelled benefit over the current reference selection.","Keep the current portfolio when no feasible improvement is found.","Monitor budget and available delivery capacity.","After a project assumption changes.");break;
 }
 case "workforce-allocation":{
  const gain=get(result,"COST REDUCTION"),unserved=get(result,"UNSERVED CASES");
  d=gain>1000?make("act","Reassigning the example team reduces weighted operating cost by "+money(gain)+" while respecting team and budget limits.","Review shift allocation when modelled reduction exceeds €1,000.","Check skills, working-time rules and staff availability before approval.","Before the next staffing rota.")
  :unserved>0?make("prepare","Some work remains unserved, but reallocating shifts provides limited modelled cost improvement.","Prepare more cover if unserved cases persist without a feasible reallocation.","Check flexible capacity and shifts with the highest service penalties.","Before the next peak shift.")
  :make("wait","The current shift allocation can meet demand under the selected assumptions.","Wait while all shifts remain covered.","Monitor actual arrivals and productivity.","At the next roster review.");break;
 }
 case "fleet-allocation":{
  const gain=get(result,"COST & SERVICE UPLIFT"),unserved=get(result,"UNSERVED ORDERS");
  d=gain>2000?make("act","Zone allocation improves modelled net service value by "+money(gain)+" versus equal-share dispatch.","Review reassignment when value uplift > €2,000.","Evaluate changing fleet allocation before paying for additional vehicles.","Before the next dispatch plan.")
  :unserved>0?make("prepare","The fleet cannot cover all example demand; extra vehicles may not always be justified.","Prepare additional capacity if shortage penalties exceed added vehicle cost.","Compare temporary rental, routing and outsourcing.","At the next vehicle planning cycle.")
  :make("wait","The current fleet allocation can cover modelled demand.","Wait while all selected zones are sufficiently covered.","Track route demand and vehicle availability.","At the next fleet review.");break;
 }
 case "production-mix":{
  const gain=get(result,"IMPROVEMENT VS REFERENCE");
  d=gain>500?make("act","The exact product mix improves expected contribution by "+money(gain)+" over the equal-share plan.","Review a production-mix change when uplift > €500.","Validate demand, machine time and batch constraints with production.","Before the next production schedule.")
  :make("wait","The candidate mix does not materially exceed the reference contribution.","Wait while improvement ≤ €500.","Monitor changes in margins, machine availability and orders.","At the next schedule update.");break;
 }
 case "inventory-allocation":{
  const gain=get(result,"CONTRIBUTION IMPROVEMENT"),fill=get(result,"DEMAND FULFILMENT");
  d=gain>500?make("act","The exact allocation produces "+money(gain)+" more modelled contribution than the disclosed rule, with "+String(fill)+"% expected fill.","Consider a purchasing-plan review when improvement exceeds €500.","Validate supplier terms and costs, then submit for purchasing approval.","Before the next order cutoff.")
  :make("wait","The exact allocation is not materially better than the stated reference plan.","Wait while contribution uplift ≤ €500.","Monitor SKU demand and supply restrictions.","At the next replenishment run.");break;
 }
 case "invoice-flow":case "order-exceptions":case "service-routing":case "purchase-approvals":case "agent-workflow":{
  const key=id==="invoice-flow"?"EXCEPTIONS":id==="order-exceptions"?"REVIEW QUEUE":id==="service-routing"?"HUMAN ESCALATIONS":id==="agent-workflow"?"REQUIRES HUMAN ACTION":"HUMAN REVIEW QUEUE",count=get(result,key);
  d=count>0?make("review",count+" example items require policy review or exception handling.","Keep a human checkpoint whenever any exception is present.","Review the flagged sample records; do not execute actual approvals or transfers.","Once missing information has been supplied.")
   :make("prepare","All sample items meet the current illustrative routing conditions.","Release a workflow only after verifying rules and permissions.","Validate exceptions and audit logging on real data.","At the next policy update.");break;
 }
 case "pricing":{
  const increase=number(result.impact?.value),current=result.comparison?.series?.[0]?.a||0;
  d=increase>current*.05?make("prepare","The modelled pricing alternative improves contribution by "+money(increase)+".","Pilot changes only if estimated uplift exceeds 5% of baseline contribution.","Run a limited commercial experiment before changing all prices.","After observing customer conversion.")
   :make("wait","Modelled pricing alternatives do not show material improvement.","Wait while uplift ≤ 5% of baseline contribution.","Keep current pricing and monitor volume.","At the next pricing review.");break;
 }
 case "investment":{
  const npv=number(result.impact?.value),down=get(result,"DOWNSIDE NPV");
  d=npv<=0?make("wait","The investment's modelled NPV is "+money(npv)+".","Wait while NPV ≤ €0.","Validate assumptions and seek alternative investments.","When a material benefit or cost estimate changes.")
  :down<=0?make("prepare","Base NPV is positive, but the downside case is "+money(down)+".","Run a pilot if base NPV > 0 and downside NPV ≤ 0.","Reduce uncertainty before committing capital.","At the pilot decision point.")
  :make("act","Base and downside NPV are positive under the current assumptions.","Consider formal review when base and downside NPV exceed €0.","Submit to the appropriate financial approval process.","At the capital investment review.");break;
 }
 case "recurring":{
  const x=get(result,"LTV / CAC");d=x<2?make("review","The simplified customer economics have an LTV/CAC of "+x+"×.","Investigate when LTV/CAC < 2×.","Review retention, acquisition costs and margins.","After verified cohort data.")
    :x<3?make("prepare","LTV/CAC is "+x+"× under the synthetic model.","Prepare if LTV/CAC is between 2× and 3×.","Test a bounded acquisition increase.","At the next cohort review.")
    :make("act","LTV/CAC is "+x+"×, but cash constraints require review.","Consider acquisition expansion only if ratio ≥ 3× and cash is available.","Request approval for a controlled test.","At the next acquisition review.");break;
 }
 case "hire-outsource":{
  const saved=get(result,"SAVINGS VS ALL OUTSOURCE"),hires=get(result,"NEW HIRES");
  d=hires===0?make("wait","Fully outsourced coverage is the lowest-cost option under the current example assumptions.","Wait on permanent hiring while no feasible plan with new staff reduces monthly cost.","Monitor supplier prices and volume persistence.","At the next staffing budget review.")
   :saved>2000?make("act","The cost-minimising scenario uses "+hires+" internal hires and reduces modelled cost by "+money(saved)+" versus outsourcing all work.","Consider recruitment review when the expected saving exceeds €2,000 per month.","Validate productivity, employer costs and legal constraints before approving recruitment.","Before signing employment contracts.")
   :make("prepare","Internal hiring shows a modest modelled economic advantage.","Prepare if the cost improvement is positive but ≤ €2,000.","Pilot internal capacity or renegotiate an outsourcing contract.","At the next demand review.");break;
 }
 case "business-stress":{
  const risk=get(result,"SERVICE CAPACITY BREACH")/100;
  d=risk>.3?make("act","Simulated capacity is breached in "+percent(risk)+" of operating weeks.","Review capacity or contingency when simulated breach risk > 30%.","Compare temporary staffing and flex capacity with expected shortfall cost.","Before the next seasonal demand peak.")
   :risk>.1?make("prepare","Capacity breach risk is "+percent(risk)+" under fictional demand and outage shocks.","Prepare contingency when breach risk is 10–30%.","Identify surge suppliers and reserve flexible cover.","At the next resilience exercise.")
   :make("wait","Capacity remains sufficient in most trials.","Maintain the current plan while breach risk ≤ 10%.","Monitor workloads, absences and data quality.","After new workload records arrive.");break;
 }
 case "executive-bi":{
  const revenue=get(result,"TARGET VARIANCE"),service=get(result,"ON-TIME SERVICE")/100,goal=Number(params.service)/100||.92;
  d=revenue<0||service<goal?make("review","The selected reporting scope has a revenue shortfall of "+money(Math.max(0,-revenue))+" or service performance "+percent(service)+" below its "+percent(goal)+" target.","Escalate if revenue variance < €0 OR on-time service falls below "+percent(goal)+".","Assign owners to the failing commercial or operational measures.","At the next executive management review.")
   :make("wait","Commercial and operational example targets are both met.","Monitor while revenue variance ≥ €0 and service ≥ "+percent(goal)+".","Check underlying margin and capacity signals.","At the next executive reporting refresh.");break;
 }
 case "fleet-assets":{
  const renew=get(result,"RENEWAL CANDIDATES"),prepare=get(result,"PREPARE TO REPLACE");
  d=renew>0?make("act",renew+" vehicles meet both the configured age and modelled lifecycle-cost conditions.","Review replacement if asset age ≥ "+String(params.age)+" years AND retaining it costs > replacement plus "+money(params.buffer||0)+".","Compare actual repair history, disposal value and leasing offers before approval.","Before each flagged asset's next major maintenance period.")
   :prepare>0?make("prepare",prepare+" vehicles have a cost warning but do not meet all criteria.","Prepare when retain cost exceeds replacement cost without meeting final approval criteria.","Collect condition and usage evidence before committing.","At the next fleet lifecycle review.")
   :make("wait","No example assets currently meet replacement review criteria.","Continue operating while age and cost thresholds are not both crossed.","Monitor maintenance cost and downtime.","At the next asset inspection.");break;
 }
 case "stock-risk":{
  const risk=get(result,"STOCKOUT PROBABILITY")/100;
  d=risk>.25?make("act","Simulated stockout probability is "+percent(risk)+".","Review replenishment when risk exceeds 25%.","Compare stock buffers, supplier lead times and shortage exposure.","At the next purchase cycle.")
  :risk>.1?make("prepare","Stockout risk is "+percent(risk)+", above the chosen comfort zone.","Prepare if risk is 10–25%.","Evaluate contingency supply.","Before the next order cutoff.")
  :make("wait","Simulated stockout risk is "+percent(risk)+".","Monitor while risk ≤ 10%.","Keep observing volatility.","At the next inventory review.");break;
 }
 case "queue-risk":{
  const service=get(result,"SERVICE WITHIN SLA")/100;
  d=service<.8?make("act","Only "+percent(service)+" of simulated requests meet the service target.","Review capacity if SLA < 80%.","Test extra staffing or lower handling times.","Before the next peak workload.")
  :service<.93?make("prepare","The modelled service level is "+percent(service)+".","Prepare extra cover when 80% ≤ SLA < 93%.","Compare flexible staffing.","At the next shift plan.")
  :make("wait","Modelled service performance is "+percent(service)+".","Keep the plan while SLA ≥ 93%.","Monitor arrival spikes.","After the next peak.");break;
 }
 case "delivery-risk":{
  const chance=get(result,"ON-TIME PROBABILITY")/100;
  d=chance<.8?make("review","Only "+percent(chance)+" of simulated paths meet the deadline.","Do not commit before review when probability < 80%.","Revisit the target or add contingency.","Before a contractual deadline is accepted.")
  :chance<.95?make("prepare","The model meets the deadline in "+percent(chance)+" of simulated runs.","Prepare contingency between 80% and 95%.","Review dependencies and buffer.","Before the project starts.")
  :make("wait","Simulated on-time probability is "+percent(chance)+".","Maintain the plan if on-time probability ≥ 95%.","Track real milestone progress.","At the next milestone.");break;
 }
 case "sales-bi":{
  const gap=get(result,"TARGET VARIANCE");
  d=gap<0?make("review","Revenue is "+money(-gap)+" below the selected target.","Investigate when net revenue variance < €0.","Inspect the lowest-performing segment or period.","At the next month-end close.")
   :make("wait","Revenue meets the selected reporting target.","Wait while target variance ≥ €0.","Check returns and margins before concluding.","At the next reporting refresh.");break;
 }
 case "logistics-bi":{
  const service=get(result,"ON-TIME DELIVERY")/100,goal=Number(params.goal)/100||.92;
  d=service<goal?make("act","On-time service is "+percent(service)+" versus target "+percent(goal)+".","Investigate if service falls below "+percent(goal)+".","Review carrier and route-level delays.","At the next service review.")
   :make("wait","The current service rate meets its chosen target.","Maintain plan while service ≥ "+percent(goal)+".","Watch for emerging late-delivery clusters.","At the next service review.");break;
 }
 case "profitability-bi":{
  const margin=get(result,"OPERATING CONTRIBUTION");
  d=margin<0?make("review","Modelled contribution is "+money(margin)+".","Investigate when contribution is negative.","Validate costs and product mix with finance.","At the next reporting close.")
   :make("wait","Modelled contribution is positive.","Monitor while contribution remains positive.","Inspect low-margin families.","At the next margin review.");break;
 }
 case "sales-crm":{
  const stale=get(result,"STALE OPPORTUNITIES");
  d=stale?make("prepare",stale+" deals exceed the chosen activity-age threshold.","Review if stale opportunities > 0.","Assign concrete next steps to owners.","At the next pipeline meeting.")
   :make("wait","No open deals breach the activity rule.","Maintain tracking while all deals have recent activity.","Monitor the pipeline; do not treat weighted value as won revenue.","At the next pipeline meeting.");break;
 }
 case "service-workspace":{
  const risk=get(result,"PROJECTED SLA RISK")/100;
  d=risk>.3?make("act","Projected SLA risk is "+percent(risk)+".","Act if risk > 30%.","Rebalance workload and prioritise ageing cases.","Before the next SLA breach.")
   :make("wait","Current modelled SLA risk is "+percent(risk)+".","Monitor while risk ≤ 30%.","Continue assigning clear case owners.","At the next service meeting.");break;
 }
 default:d=make("prepare",result.decision?.summary||"A working model has been calculated, but business sign-off still matters.","Compare current results with relevant operational constraints.","Review the model's evidence and approval rules.","When business assumptions change.");
 }
 return {...d,id,status:titles[d.level],actions:result.decision?.actions||[],source:"Transparent example-specific decision rule",limits:"Synthetic business data. Advisory only; not automated authorisation or guaranteed financial impact."};
}
export function explainControl(control,value){
 if(!control)return "Select an editable input to inspect its role in the calculation.";
 const key=control.key.toLowerCase();
 let meaning="This is a scenario assumption. Change it and run the model again to compare the results.";
 if(/threshold|limit|tolerance|sla|goal|confidence|sensitivity/.test(key))meaning="This defines a decision boundary. Changing it can affect review queues and service targets; it does not change historical observations.";
 else if(/budget|cost|price|penalty|rate|margin|outlay|fee/.test(key))meaning="This affects the economic comparison and may change the preferred action.";
 else if(/capacity|staff|agent|stock|order|vehicle|load|volume|count|arrivals|demand/.test(key))meaning="This affects capacity, demand, workload or availability.";
 else if(/growth|uncertainty|volatility|churn|conversion|reliability|adoption/.test(key))meaning="This affects future scenarios and may change model uncertainty or risk.";
 return control.label+" is currently "+String(value)+(control.unit||"")+". "+meaning+" No external system changes when you edit it.";
}
export function answerGuide(query,context){
 const q=String(query||"").trim().toLowerCase(),{result,decision,controls=[],params={},alternatives=[]}=context;
 const d=decision||evaluateDecision(context),r=result||{};
 if(!q)return "Choose a question or ask about the current decision.";
 if(/who are|what can|how can|hello|hola|help/.test(q))return "I am the SC-Analytics Decision Guide: a transparent, rules-based explanation assistant for the current synthetic analysis. I can explain metrics, assumptions, decision thresholds and saved scenarios. I am not a remote LLM.";
 if(/why|por qu|recommend|recomiend|reason|decisi[oó]n/.test(q))return d.status+". "+d.why+" "+d.threshold+" This is advisory, not an automatic business action.";
 if(/wait|esper|do nothing/.test(q))return "Waiting can be valid. "+d.threshold+" "+d.review;
 if(/threshold|umbral|when|cu[aá]ndo|trigger|switch/.test(q))return d.threshold+" "+d.next+" Review: "+d.review;
 if(/scenario|compare|compar|alternative|alternativ/.test(q))return alternatives.length?alternatives.map(a=>a.label+": "+a.decision.status+"; "+a.result.metrics[0]?.label+" "+a.result.metrics[0]?.value).join(" | ")+". Use Compare to inspect all metrics.":"Save Alternative A or B first using the scenario controls, then compare results.";
 if(q.startsWith("explain ")||q.startsWith("explica ")){
  const chosen=controls.find(c=>q.includes(c.key.toLowerCase())||q.includes(c.label.toLowerCase()));
  if(chosen)return explainControl(chosen,params[chosen.key]);
  const chosenMetric=(r.metrics||[]).find(m=>q.includes(m.label.toLowerCase()));
  if(chosenMetric)return chosenMetric.label+": "+chosenMetric.value+". "+chosenMetric.hint+" (synthetic scenario).";
 }
 if(/cost|€|eur|saving|ahorro|profit|value|impact|benefit|valor/.test(q))return (r.impact?.label||"Illustrative impact")+": "+(r.impact?.value||"not available")+". "+(r.impact?.formula||"See report")+" "+(r.impact?.note||"No verified customer savings.");
 if(/risk|riesgo|warn|warning|error|limitation|l[ií]mite/.test(q))return d.status+". "+d.why+" Limit: "+d.limits+" "+(r.methodology||"");
 const requestedMetric=(r.metrics||[]).find(m=>q.includes(m.label.toLowerCase())||q.includes(m.label.toLowerCase().replaceAll(" ","")));
 if(requestedMetric)return requestedMetric.label+" = "+requestedMetric.value+". "+requestedMetric.hint+" This metric is computed for the active synthetic scenario.";
 if(/chart|gr[aá]fic|graph|report|informe|pdf|metric|indicador/.test(q))return "The active analysis is "+(r.chart?.title||r.case?.name||"the selected scenario")+". "+(r.chart?.subtitle||r.decision?.summary||"")+" Open the full report for evidence and actions.";
 const control=controls.find(c=>q.includes(c.key.toLowerCase())||c.label.toLowerCase().split(" ").some(x=>x.length>4&&q.includes(x)));
 if(control)return explainControl(control,params[control.key]);
 if(/change|modify|vary|variable|parameter|modific|cambi|what if|qu[eé] pasa|10%|15%|20%/.test(q))return explainControl(controls[0],params[controls[0]?.key])+" Use the scenario controls and then run the model. I do not change inputs without your confirmation.";
 return d.why+" I can explain the action, the threshold, business impact, parameter effects and saved scenarios. Ask about one of these.";
}
