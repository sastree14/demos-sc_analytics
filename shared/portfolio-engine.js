/*
SC-Analytics | Solutions Lab - five operational decision modules.
All entities and input records below are reproducible SYNTHETIC examples.
There are no real integrations, AI model endpoints, private systems or claimed client savings.
*/
const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number(n)));
const round=(n,d=0)=>Number(Number(n).toFixed(d));
const sum=a=>a.reduce((s,x)=>s+x,0);
const avg=a=>a.length?sum(a)/a.length:0;
const percentile=(v,p)=>{const s=[...v].sort((a,b)=>a-b);if(!s.length)return 0;const n=(s.length-1)*p,i=Math.floor(n);return s[i]+(s[Math.min(i+1,s.length-1)]-s[i])*(n-i)};
const rnd=seed=>()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
const range=(n,fn)=>Array.from({length:n},(_,i)=>fn(i));
const money=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const num=n=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:0}).format(n);
const percent=n=>round(n*100,1)+"%";
const unit=(n,s)=>num(n)+" "+s;
const spec=(key,label,min,max,step,unit="")=>({key,label,kind:"range",min,max,step,unit});
const option=(key,label,values)=>({key,label,kind:"choice",values});
const row=(label,a,b=0,c=0)=>({label,a,b,c});
const measure=(label,value,hint)=>({label,value:String(value),hint});
const simple=(kind,field,series,labels,title,subtitle)=>({kind,field,series,labels,title,subtitle});
const chartBar=(data,title,subtitle,labels=["Current state","Alternative"])=>simple("bars","a",data,labels,title,subtitle);
const chartLine=(data,title,subtitle,labels=["Observed","Reference"])=>simple("line","a",data,labels,title,subtitle);
const chartDistribution=(data,title,subtitle)=>simple("distribution","a",data,["Frequency"],title,subtitle);
function result({metrics,chart,comparison,table,impact,decision,methodology,quality=[],scope="",assumptions=""}){
 return {metrics,chart,comparison,table,impact,decision,methodology,quality,scope,assumptions};
}
export const modules=[
 {id:"automation-ai",label:"Automation & AI",tag:"OPERATIONS / INTELLIGENT WORKFLOWS",headline:"Let routine work flow. Keep judgment where it belongs.",intro:"See how exception policies, intelligent routing and human approval can reduce repetitive operational work without giving up control.",focus:"Decisions, exceptions and auditability",cases:[
  {id:"invoice-flow",label:"Invoice processing",short:"Automatically route valid invoices while keeping exceptions under human review.",category:"FINANCE OPERATIONS",categoryShort:"WORKFLOW",
   seed:123,
   inputs:[spec("count","Incoming invoices",100,900,50),spec("limit","Automatic approval ceiling",500,12000,500," €"),spec("tolerance","Price discrepancy tolerance",0,8,1,"%"),spec("time","Manual minutes avoided",3,18,1," min"),spec("hourRate","Processing cost per hour",18,65,1," €"),spec("subscription","Monthly platform allowance",0,2500,100," €")],
   defaults:{count:400,limit:11000,tolerance:7,time:9,hourRate:34,subscription:500}},
  {id:"order-exceptions",label:"Order exceptions",short:"Route delays, stock gaps and credit checks without losing exception traceability.",category:"ORDER MANAGEMENT",categoryShort:"WORKFLOW",
   seed:204,inputs:[spec("count","Orders per period",100,1000,50),spec("late","Escalation after",1,7,1," days"),spec("inventory","Safety stock buffer",0,30,5,"%"),spec("threshold","Automated approval ceiling",500,9000,500," €"),spec("time","Minutes saved per routine order",2,15,1," min"),spec("hourRate","Hourly operating cost",18,65,1," €")],
   defaults:{count:450,late:6,inventory:5,threshold:8500,time:8,hourRate:32}},
  {id:"service-routing",label:"Assisted service routing",short:"Score sample requests and send uncertain or sensitive cases to a human.",category:"CUSTOMER OPERATIONS",categoryShort:"AI-ASSISTED PROTOTYPE",
   seed:399,inputs:[spec("count","Incoming service requests",100,800,50),spec("confidence","Auto-routing score threshold",60,95,5,"%"),spec("handling","Minutes avoided on routine cases",3,17,1," min"),spec("hourRate","Hourly support cost",18,75,1," €"),spec("fee","Illustrative operating overhead",0,2200,100," €")],
   defaults:{count:400,confidence:80,handling:7,hourRate:33,fee:350}}
 ]},
 {id:"modelling-scenarios",label:"Modelling & Scenarios",tag:"FINANCE / STRATEGIC DECISIONS",headline:"Compare possible futures before you commit.",intro:"Explore the economics of pricing, investment and recurring revenue. Adjustable assumptions turn strategy into measurable trade-offs.",focus:"Sensitivity, profitability and risk",cases:[
  {id:"pricing",label:"Price & volume strategy",short:"See how price elasticity, costs and capacity change contribution.",category:"PRICING",categoryShort:"ECONOMIC MODEL",
   inputs:[spec("price","Current selling price",40,190,5," €"),spec("volume","Baseline monthly demand",500,12000,250),spec("elasticity","Demand elasticity",0.5,3,0.1),spec("cost","Unit variable cost",15,100,5," €"),spec("capacity","Monthly supply capacity",1000,12000,250),spec("lift","Marketing demand uplift",-20,30,5,"%")],
   defaults:{price:100,volume:6000,elasticity:1.6,cost:45,capacity:8000,lift:0}},
  {id:"investment",label:"Investment business case",short:"Evaluate NPV, payback and downside sensitivity for a proposed initiative.",category:"CAPITAL ALLOCATION",categoryShort:"FINANCIAL MODEL",
   inputs:[spec("outlay","Upfront investment",50000,500000,10000," €"),spec("savings","Year-one annual gross benefit",30000,240000,5000," €"),spec("opex","Annual running cost",5000,80000,2500," €"),spec("growth","Annual benefit growth",-15,30,1,"%"),spec("discount","Discount rate",3,18,1,"%"),spec("adoption","Realised adoption assumption",40,100,5,"%")],
   defaults:{outlay:210000,savings:95000,opex:20000,growth:5,discount:9,adoption:85}},
  {id:"recurring",label:"Recurring revenue economics",short:"Understand how churn, acquisition cost and conversion drive sustainable growth.",category:"SUBSCRIPTION GROWTH",categoryShort:"COHORT MODEL",
   inputs:[spec("customers","Existing paying accounts",100,5000,100),spec("arpa","Average monthly revenue/account",40,300,10," €"),spec("churn","Monthly churn rate",0.5,9,0.5,"%"),spec("leads","Qualified prospects each month",50,800,25),spec("conversion","Conversion rate",2,25,1,"%"),spec("cac","Acquisition cost per account",200,2200,100," €"),spec("margin","Gross margin",40,90,5,"%")],
   defaults:{customers:900,arpa:125,churn:3,leads:200,conversion:9,cac:750,margin:72}}
 ]},
 {id:"simulations",label:"Simulation & Risk",tag:"MONTE CARLO / OPERATIONAL UNCERTAINTY",headline:"Understand the range of outcomes. Not only the average.",intro:"Test thousands of repeatable operational scenarios to quantify service levels, waiting times and delivery uncertainty.",focus:"Probability, service levels and contingencies",cases:[
  {id:"stock-risk",label:"Inventory resilience",short:"Run demand trials to quantify stockout probability and expected cost.",category:"INVENTORY",categoryShort:"MONTE CARLO",
   seed:808,inputs:[spec("demand","Expected monthly demand",300,3000,100),spec("volatility","Demand standard deviation",8,40,2,"%"),spec("stock","Starting available stock",100,2800,100),spec("order","Incoming replenishment",0,1800,100),spec("lead","Lead time exposure",1,6,1," weeks"),spec("penalty","Lost-sale cost per unit",5,80,5," €")],
   defaults:{demand:1500,volatility:19,stock:1150,order:500,lead:2,penalty:24}},
  {id:"queue-risk",label:"Service capacity & queues",short:"Model arrival peaks, staff utilisation and customer waiting times.",category:"CUSTOMER SERVICE",categoryShort:"DISCRETE-EVENT SIMULATION",
   seed:244,inputs:[spec("arrivals","Requests arriving per hour",10,75,5),spec("agents","Available agents",2,15,1),spec("handling","Average handling time",4,16,1," min"),spec("sla","Target maximum waiting time",2,35,1," min"),spec("cost","Daily cost per agent",90,240,10," €")],
   defaults:{arrivals:32,agents:6,handling:9,sla:12,cost:145}},
  {id:"delivery-risk",label:"Project delivery uncertainty",short:"Estimate deadline confidence and contingency cost before committing.",category:"PROJECT DELIVERY",categoryShort:"MONTE CARLO",
   seed:918,inputs:[spec("planned","Base project duration",30,160,5," days"),spec("uncertainty","Task duration uncertainty",10,60,5,"%"),spec("deadline","Contractual deadline",35,240,5," days"),spec("cost","Daily team expense",300,2500,100," €"),spec("budget","Approved cost budget",25000,230000,5000," €"),spec("contingency","Cost contingency allowance",0,35,5,"%")],
   defaults:{planned:85,uncertainty:25,deadline:86,cost:900,budget:76000,contingency:5}}
 ]},
 {id:"bi-reporting",label:"Business Intelligence & Reporting",tag:"DASHBOARDS / EXECUTIVE CONTROL",headline:"One version of performance. Clear next decisions.",intro:"Explore management reporting with consistent KPIs, segment filters, reconciled summaries and driver analysis.",focus:"Commercial performance and operational visibility",cases:[
  {id:"sales-bi",label:"Revenue performance",short:"Compare periods, regions and targets using reconciled synthetic transactions.",category:"COMMERCIAL INTELLIGENCE",categoryShort:"EXECUTIVE DASHBOARD",
   seed:559,inputs:[option("region","Reporting region",[["All","All regions"],["North","North"],["East","East"],["South","South"],["West","West"]]),spec("months","Months in reporting window",3,12,3),spec("target","Target adjustment",-20,30,5,"%"),spec("cost","Variable cost ratio",35,75,5,"%"),spec("returns","Return / credit adjustment",0,9,1,"%")],
   defaults:{region:"All",months:12,target:8,cost:53,returns:2}},
  {id:"logistics-bi",label:"Delivery service dashboard",short:"Analyse on-time performance, carriers, cost and operational exceptions.",category:"LOGISTICS INTELLIGENCE",categoryShort:"SERVICE SCORECARD",
   seed:557,inputs:[option("region","Operating region",[["All","All regions"],["North","North"],["East","East"],["South","South"],["West","West"]]),option("carrier","Carrier",[["All","All carriers"],["Atlas","Atlas"],["Faro","Faro"],["Nexa","Nexa"]]),spec("goal","On-time service target",80,98,1,"%"),spec("lateCost","Financial exposure per late order",10,130,5," €")],
   defaults:{region:"All",carrier:"All",goal:92,lateCost:65}},
  {id:"profitability-bi",label:"Portfolio profitability",short:"See contribution by product group as volume and input costs change.",category:"FINANCE INTELLIGENCE",categoryShort:"PROFITABILITY ANALYSIS",
   seed:407,inputs:[option("channel","Commercial channel",[["All","All channels"],["Direct","Direct"],["Partner","Partner"],["Digital","Digital"]]),spec("months","Reporting periods",3,12,3),spec("inflation","Input cost inflation",0,25,1,"%"),spec("discount","Sales discount",0,18,1,"%"),spec("fixed","Monthly shared overhead",10000,90000,5000," €")],
   defaults:{channel:"All",months:12,inflation:7,discount:3,fixed:30000}}
 ]},
 {id:"custom-apps",label:"Custom Business Applications",tag:"CRM / ERP / OPERATIONS",headline:"Your workflow. Your rules. One working application.",intro:"See how a purpose-built internal tool can structure sales, approvals and service work without forcing your team into a generic process.",focus:"Structured records, auditable decisions and process control",cases:[
  {id:"sales-crm",label:"Sales pipeline workspace",short:"Prioritise opportunities, forecast weighted pipeline and identify stalled deals.",category:"CRM / COMMERCIAL",categoryShort:"INTERACTIVE WORKSPACE",
   seed:671,inputs:[option("segment","Business segment",[["All","All sectors"],["Industry","Industry"],["Logistics","Logistics"],["Services","Services"]]),spec("coverage","Forecast closing horizon",1,6,1," months"),spec("uplift","Negotiation win-rate uplift",0,25,5,"%"),spec("stale","Flag untouched opportunities after",7,60,7," days"),spec("target","Quarterly bookings target",50000,650000,25000," €")],
   defaults:{segment:"All",coverage:3,uplift:5,stale:28,target:300000}},
  {id:"purchase-approvals",label:"Purchase approvals",short:"Apply spending limits, identify exceptions and produce an auditable queue.",category:"ERP / PROCUREMENT",categoryShort:"APPROVAL ENGINE",
   seed:698,inputs:[spec("count","Pending purchase requests",100,500,25),spec("threshold","Manager approval limit",500,12000,500," €"),spec("budget","Available approved budget",50000,400000,10000," €"),spec("compliance","Required policy confidence",70,100,5,"%"),spec("reviewCost","Manual review cost",4,35,1," €")],
   defaults:{count:200,threshold:7000,budget:180000,compliance:80,reviewCost:14}},
  {id:"service-workspace",label:"Service operations workspace",short:"Prioritise ticket backlog, assign owners and check incoming SLA risk.",category:"OPERATIONS / SERVICE",categoryShort:"CASE MANAGEMENT",
   seed:432,inputs:[spec("count","Open cases",50,500,25),spec("staff","Available specialist owners",2,18,1),spec("sla","Resolution target",8,72,4," hours"),spec("load","Cases per specialist each day",3,15,1),spec("critical","High-priority escalation after",4,48,4," hours"),spec("cost","Cost per overdue case",30,400,10," €")],
   defaults:{count:250,staff:8,sla:56,load:7,critical:16,cost:130}}
 ]}
];
// Additional generalist business questions to avoid making each discipline look single-purpose.
modules.find(m=>m.id==="automation-ai").cases.push({
 id:"agent-workflow",label:"AI-style case orchestration",short:"Follow document intake, synthetic scoring, evidence checks and human checkpoints through a complete process.",
 category:"OPERATIONS / ASSISTED DECISIONS",categoryShort:"RULE-BASED AGENT PROTOTYPE",
 inputs:[spec("count","Requests in the processing queue",100,700,50),spec("confidence","Mock confidence threshold",65,95,5,"%"),spec("exposure","Sensitive-value escalation limit",500,9000,500," €"),spec("hours","Average manual review minutes",5,30,5," min"),spec("rate","Illustrative review cost per hour",18,75,1," €")],
 defaults:{count:350,confidence:80,exposure:3500,hours:15,rate:34}
});
modules.find(m=>m.id==="modelling-scenarios").cases.push({
 id:"hire-outsource",label:"Hire, outsource or wait?",short:"Compare internal staffing, flexible outsourcing and unmet-demand exposure before committing to fixed capacity.",
 category:"CAPACITY / MAKE OR BUY",categoryShort:"BREAK-EVEN MODEL",
 inputs:[spec("volume","Monthly operating workload",100,1500,50),spec("productivity","Cases per employee / month",80,260,20),spec("salary","Loaded monthly cost / employee",2200,6600,200," €"),spec("outsourced","Outsourced cost per case",10,65,5," €"),spec("penalty","Unserved-case cost",20,120,10," €"),spec("limit","Maximum new employees",0,8,1)],
 defaults:{volume:850,productivity:170,salary:3900,outsourced:32,penalty:65,limit:6}
});
modules.find(m=>m.id==="simulations").cases.push({
 id:"business-stress",label:"Business capacity stress test",short:"Estimate the probability that workload peaks and staff absences overwhelm available capacity.",
 category:"RESILIENCE / CONTINGENCY",categoryShort:"MONTE CARLO",
 inputs:[spec("demand","Average weekly demand",200,1500,50),spec("volatility","Demand variability",5,45,5,"%"),spec("capacity","Nominal weekly capacity",300,1700,50),spec("absence","Expected capacity outage",0,25,5,"%"),spec("penalty","Cost of unmet work",10,110,10," €")],
 defaults:{demand:900,volatility:24,capacity:1050,absence:10,penalty:45}
});
modules.find(m=>m.id==="bi-reporting").cases.push({
 id:"executive-bi",label:"Executive command centre",short:"Combine commercial performance, margin and operational service into a board-level decision view.",
 category:"EXECUTIVE / CROSS-FUNCTION",categoryShort:"MANAGEMENT SCORECARD",
 inputs:[option("region","Business area",[["All","All business areas"],["North","North"],["East","East"],["South","South"],["West","West"]]),spec("target","Revenue target adjustment",-20,25,5,"%"),spec("cost","Variable cost ratio",30,75,5,"%"),spec("service","Target service quality",80,98,2,"%"),spec("penalty","Exposure per late delivery",20,140,10," €")],
 defaults:{region:"All",target:8,cost:53,service:92,penalty:70}
});
modules.find(m=>m.id==="custom-apps").cases.push({
 id:"fleet-assets",label:"Fleet maintenance & renewal",short:"Inspect synthetic assets, compare repair and renewal costs, and identify vehicles needing a decision.",
 category:"ASSETS / LIFE CYCLE",categoryShort:"FLEET DECISION WORKSPACE",
 inputs:[spec("age","Replacement consideration from",3,12,1," years"),spec("repair","Estimated annual repair cost",2000,13000,500," €"),spec("replacement","Annualised replacement cost",5000,17000,500," €"),spec("downtime","Estimated annual downtime cost",1000,12000,500," €"),spec("buffer","Minimum value difference before action",0,5000,500," €")],
 defaults:{age:7,repair:6500,replacement:9500,downtime:4800,buffer:1500}
});
export const moduleById=id=>modules.find(m=>m.id===id)||modules[0];
export const caseById=(moduleId,caseId)=>moduleById(moduleId).cases.find(c=>c.id===caseId)||moduleById(moduleId).cases[0];
export const initial=(moduleId,caseId)=>({...caseById(moduleId,caseId).defaults});
const seedData=(n,seed,fn)=>{const r=rnd(seed);return range(n,i=>fn(i,r))};
function automationInvoices(p){
 const rows=seedData(p.count,123,(i,r)=>{
  const amount=250+Math.round(r()*15000),diff=Math.round(r()*12*10)/10,po=r()>.085,duplicate=r()<.046;
  const suspicious=duplicate||!po||diff>p.tolerance;
  const auto=!suspicious&&amount<=p.limit;
  return {id:"INV-"+String(10001+i),party:["Alba Components","Norte Cargo","Delta Parts","Meridian Supply"][i%4],amount,diff,po,duplicate,suspicious,auto,reason:duplicate?"Duplicate pattern":!po?"Missing purchase order":diff>p.tolerance?"Price variance":amount>p.limit?"Value limit":"Policy valid"};
 });
 const automated=rows.filter(r=>r.auto),manual=p.count-automated.length,reviewCost=p.hourRate*p.time/60;
 const gross=automated.length*reviewCost,net=gross-p.subscription;
 const chart=chartBar([row("Intake",p.count),row("Policy valid",rows.filter(r=>!r.suspicious).length),row("Auto route",automated.length),row("Human queue",manual)],"From document arrival to a decision","Every item is checked against deterministic business rules.");
 const comparison=chartBar([row("Manual before",p.count*p.time),row("Manual after",manual*p.time),row("Time avoided",automated.length*p.time)],"Routine processing workload","Illustrative staff minutes, before and after policy automation.");
 return result({metrics:[measure("VOLUME PROCESSED",unit(p.count,"invoices"),"synthetic invoice batch"),measure("AUTO-ROUTED",percent(automated.length/p.count),"routine, policy-compliant invoices"),measure("EXCEPTIONS",unit(manual,"for review"),"suspicious or above limit"),measure("TIME AVOIDED",unit(round(automated.length*p.time/60,1),"hours"),"based on declared minutes per case")],
  chart,comparison,table:{columns:["Invoice","Supplier","Amount","Policy decision"],rows:rows.slice(0,9).map(r=>[r.id,r.party,money(r.amount),r.auto?"Auto-route":"Review · "+r.reason])},
  impact:{value:money(net),label:"Illustrative net operating value",formula:"Auto-routed invoices × manual minutes avoided × hourly cost − platform allowance.",note:"Not observed savings. Only policy-based routing is implemented here; no OCR, bank transfer or live accounting integration is claimed."},
  decision:{title:"Reserve human attention for exceptions",summary:"A policy engine routes "+unit(automated.length,"low-exception invoices")+" automatically and retains "+unit(manual,"cases")+" for manual verification.",actions:["Keep duplicate, PO and material-variance exceptions in a named review queue.","Allow authorised staff to release payments only after standard accounting checks.","Measure actual correction rate, turnaround and cost before adopting an automatic route."]},
  quality:[["Synthetic source","Invoice values and exception flags"],["Routing method","Deterministic rules"],["Automatic payments","None"],["Human reviews",num(manual)]],scope:"Document intake → policy checks → human queue → review record",
  assumptions:"Automatic approval here means routing for processing, not executing a financial transaction.",
  methodology:"Each of the "+p.count+" invoices is generated deterministically with value, PO and exception flags. Auto-routes must satisfy all policy conditions; exposure is computed from configurable time and operating costs."
 });
}
function automationOrders(p){
 const records=seedData(p.count,204,(i,r)=>{
  const amount=100+Math.round(r()*11000),days=Math.floor(r()*9),stock=20+Math.round(r()*130),qty=10+Math.round(r()*150),credit=r()>.075;
  const failure=days>p.late?"Late shipment":stock<qty*(1+p.inventory/100)?"Stock gap":!credit?"Credit review":amount>p.threshold?"Value approval":"Standard route";
  return {id:"ORD-"+(30000+i),party:["Warehouse A","Regional B","Trade C","Online D"][i%4],amount,days,stock,qty,action:failure,auto:failure==="Standard route"};
 });
 const count=(action)=>records.filter(x=>x.action===action).length,autocount=count("Standard route"),needs=p.count-autocount;
 const byType=["Late shipment","Stock gap","Credit review","Value approval","Standard route"].map(k=>row(k,count(k)));
 const saved=autocount*p.time*p.hourRate/60;
 return result({metrics:[measure("ORDERS CHECKED",num(p.count),"reproducible example orders"),measure("ROUTINE ROUTED",percent(autocount/p.count),"without exception flags"),measure("REVIEW QUEUE",num(needs),"traceable operational exceptions"),measure("STAFF TIME",unit(round(autocount*p.time/60,1),"hours"),"illustrative minutes avoided")],
  chart:chartBar(byType,"Why an order needs attention","Ordered checks assign exactly one decision route to each record."),
  comparison:chartBar([row("Total",p.count),row("Automated",autocount),row("Escalated",needs)],"Operational routing and exception queue","A transparent workload split under the selected controls."),
  table:{columns:["Order","Location","Amount","Assigned route"],rows:records.slice(0,9).map(x=>[x.id,x.party,money(x.amount),x.action])},
  impact:{value:money(saved),label:"Illustrative handling cost avoided",formula:"Routine order count × minutes saved × operating hourly cost.",note:"Assumption-based cost equivalent, not measured profitability or actual employee reductions."},
  decision:{title:"Move routine orders, escalate the real exceptions",summary:num(needs)+" simulated orders need a specialised review. Changes to the thresholds recalculate routing and the queue.",actions:["Send stock gaps to operations and credit holds to finance.","Record the reason and approval owner for exceptions.","Audit routing outcomes before connecting to a live order management system."]},
  quality:[["Routing policy","First matching exception rule"],["Unreviewed exceptions","0 by design"],["Manual escalations",num(needs)],["Automated execution","Not connected"]],
  scope:"Order → exception reason → department → decision record",
  methodology:"Synthetic orders include value, transit delay, on-hand inventory, quantity and credit check. A deterministic rule set assigns exactly one routing outcome. No ERP connection or AI inference is simulated as real."
 });
}
function automationService(p){
 const records=seedData(p.count,399,(i,r)=>{
  const confidence=round(55+r()*45,0),critical=r()<.12,privateInfo=r()<.08,category=["Billing","Support","Technical","Access","Complaint"][i%5];
  const auto=confidence>=p.confidence&&!critical&&!privateInfo;
  return {id:"REQ-"+(9000+i),category,confidence,critical,privateInfo,auto,action:critical?"Sensitive escalation":privateInfo?"Data privacy review":auto?"Routed by policy":"Human clarification"};
 });
 const count=k=>records.filter(x=>x.action===k).length,automated=records.filter(x=>x.auto).length,human=p.count-automated;
 const saved=automated*p.handling*p.hourRate/60-p.fee;
 return result({metrics:[measure("REQUESTS",num(p.count),"synthetic service records"),measure("ASSISTED ROUTING",percent(automated/p.count),"above score threshold with no risk flags"),measure("HUMAN ESCALATIONS",num(human),"uncertain and sensitive requests"),measure("CAPACITY RELEASED",unit(round(automated*p.handling/60,1),"hours"),"estimated handling time")],
  chart:chartBar(["Routed by policy","Human clarification","Sensitive escalation","Data privacy review"].map(k=>row(k,count(k))),"Assisted triage with a human fallback","Illustrative confidence scores, not an actual trained language model."),
  comparison:chartBar([row("Intake",p.count),row("High confidence",records.filter(x=>x.confidence>=p.confidence).length),row("Routed",automated),row("Escalated",human)],"Operational control points","High risk and privacy flags always override automation."),
  table:{columns:["Request","Category","Mock score","Disposition"],rows:records.slice(0,10).map(x=>[x.id,x.category,x.confidence+"%",x.action])},
  impact:{value:money(saved),label:"Indicative net handling value",formula:"Routine route volume × avoided minutes × hourly cost − illustrative overhead.",note:"Mock scores are synthetic, not LLM confidence or verified accuracy. No real language model, ticket API or automatic customer messages run here."},
  decision:{title:"Build the guardrails before the agent",summary:"The current rules route "+num(automated)+" routine requests and send "+num(human)+" for a person to review.",actions:["Require human approval for sensitive customer or privacy cases.","Measure actual misroutes, response time and customer satisfaction.","Integrate a validated classifier or LLM only after quality and privacy testing."]},
  quality:[["Routing signal","Synthetic heuristic score"],["Sensitive cases","Always human review"],["External AI services","None"],["Critical review coverage","100% by policy"]],
  scope:"Intake → assess → route → human decision → audit trail",
  methodology:"Synthetic request scores, category labels and sensitive flags drive threshold-based routing. This is a working workflow proof of concept, not a deployed LLM agent."
 });
}
function modellingPricing(p){
 const base=p.price,baseQ=p.volume,c=p.cost,elas=p.elasticity,cap=p.capacity,lift=1+p.lift/100;
 const demand=price=>baseQ*Math.pow(price/base,-elas)*lift;
 const outcome=price=>{const d=demand(price),sold=Math.min(d,cap);return {price,demand:d,sold,revenue:sold*price,profit:sold*(price-c)}};
 const trials=range(31,i=>outcome(Math.max(c*1.03,base*(.60+i*.028))));
 const best=trials.reduce((a,b)=>a.profit>b.profit?a:b);
 const current=outcome(base),delta=best.profit-current.profit,missed=Math.max(0,current.demand-cap);
 return result({metrics:[measure("CURRENT CONTRIBUTION",money(current.profit),"monthly after variable cost"),measure("MODEL OPTIMAL PRICE",money(best.price),"best candidate in tested price grid"),measure("UPSIDE VS CURRENT",money(Math.max(0,delta)),"assumption-based contribution difference"),measure("UNMET BASE DEMAND",num(missed),"units above stated capacity")],
  chart:chartLine(trials.map(t=>row(money(t.price),round(t.profit),round(t.revenue))),"Contribution and revenue by price","Price-volume elasticity model, evaluated on a discrete candidate grid.",["Contribution €","Revenue €"]),
  comparison:chartBar([row("Current",round(current.profit)),row("Best grid price",round(best.profit)),row("Higher price +10%",round(outcome(base*1.1).profit))],"Contributions by commercial decision","Optimised candidate compared with your original selling price."),
  table:{columns:["Selling price","Expected volume","Units sold","Contribution"],rows:[outcome(base*.9),current,outcome(base*1.1),best].map(x=>[money(x.price),num(x.demand),num(x.sold),money(x.profit)])},
  impact:{value:money(Math.max(0,delta)),label:"Potential contribution improvement",formula:"Contribution at best tested price − contribution at selected current price.",note:"Entirely modelled under a constant-elasticity demand assumption, not observed price response or guaranteed margin improvement."},
  decision:{title:"Choose a price using contribution, not revenue alone",summary:"The tested maximum occurs near "+money(best.price)+", while capacity limits sales at "+num(cap)+" units.",actions:["Validate price response using real sales and competitor information.","Check capacity, customer segments and contractual price constraints.","Pilot the proposed price and monitor conversion and contribution."]},
  quality:[["Price candidates",num(trials.length)],["Demand response","Constant elasticity"],["Capacity ceiling",unit(cap,"units")],["Realised value","Unobserved"]],
  scope:"Commercial inputs → demand curve → capacity → optimal candidate",
  methodology:"Demand follows the synthetic constant-elasticity curve Q(P)=Q0×(P/P0)^(-elasticity). Only demand up to capacity is sold. Contribution equals units sold × (price − variable cost); grid search maximises that quantity."
 });
}
function modellingInvestment(p){
 const g=p.growth/100,d=p.discount/100,adoption=p.adoption/100,flows=[-p.outlay];
 for(let year=1;year<=5;year++)flows.push(p.savings*adoption*Math.pow(1+g,year-1)-p.opex);
 const npv=flows.reduce((s,v,i)=>s+v/Math.pow(1+d,i),0);
 let cumulative=-p.outlay,payback=null;
 const cumulativeRows=[row("Year 0",cumulative)];
 for(let i=1;i<flows.length;i++){const before=cumulative;cumulative+=flows[i];cumulativeRows.push(row("Year "+i,round(cumulative),round(flows[i])));if(payback===null&&cumulative>=0&&flows[i]>0)payback=(i-1)+Math.abs(before)/flows[i];}
 const down=()=>{const a=[-p.outlay];for(let year=1;year<=5;year++)a.push(p.savings*adoption*.75*Math.pow(1+g,year-1)-p.opex);return a.reduce((s,v,i)=>s+v/Math.pow(1+d,i),0)};
 const up=()=>{const a=[-p.outlay];for(let year=1;year<=5;year++)a.push(p.savings*adoption*1.25*Math.pow(1+g,year-1)-p.opex);return a.reduce((s,v,i)=>s+v/Math.pow(1+d,i),0)};
 return result({metrics:[measure("NET PRESENT VALUE",money(npv),"five discounted years less investment"),measure("UN-DISCOUNTED PAYBACK",payback===null?"> 5 years":round(payback,1)+" years","simple cash-flow recovery"),measure("YEAR-ONE NET BENEFIT",money(flows[1]),"gross benefit × adoption − ongoing cost"),measure("DOWNSIDE NPV",money(down()),"25% weaker assumed benefit")],
  chart:chartLine(cumulativeRows,"Cumulative investment cash flow","Investment recovered only when the cumulative value crosses zero.",["Cumulative €","Annual net €"]),
  comparison:chartBar([row("Downside",round(down())),row("Base case",round(npv)),row("Upside",round(up()))],"Present value across assumptions","Downside/upside alter the gross benefit by ±25%."),
  table:{columns:["Year","Net cash flow","Present value","Cumulative cash flow"],rows:flows.map((v,i)=>["Year "+i,money(v),money(v/Math.pow(1+d,i)),money(sum(flows.slice(0,i+1)))])},
  impact:{value:money(npv),label:"Illustrative project NPV",formula:"Upfront outlay + Σ(yearly cash flow ÷ (1 + discount rate)^year).",note:"The outlay, adoption, annual benefits, operating cost and growth rate are assumptions, not validated project cash flows."},
  decision:{title:npv>=0?"The base assumptions support further diligence":"The base assumptions do not clear the value hurdle",
   summary:"Five-year discounted NPV is "+money(npv)+". Compare it with the downside and the organisation's real return requirements.",actions:["Document benefit owners and prove which benefits are cash-realisable.","Review cost overrun, delayed adoption and alternative uses of capital.","Recalculate using finance-approved discount rates and signed-off cost estimates."]},
  quality:[["Projection horizon","5 annual periods"],["Cash-flow basis","Explicit inputs"],["Discount rate",p.discount+"%"],["Historical evidence","None in this demo"]],
  scope:"Investment approval → annual benefits → discounting → decision",
  methodology:"Year-one gross benefit is multiplied by the assumed adoption rate and grown annually. Net benefits deduct annual operating cost; NPV discounts these cash flows and subtracts upfront investment. Simple payback interpolates cumulative undiscounted cash flow."
 });
}
function modellingRecurring(p){
 const months=12;let active=p.customers,acquired=0,acquisitionCost=0,gmProfit=0;const monthly=[];
 for(let i=0;i<months;i++){
  const newAccounts=p.leads*p.conversion/100,loss=active*p.churn/100;
  active=active-loss+newAccounts;acquired+=newAccounts;acquisitionCost+=newAccounts*p.cac;
  const mrr=active*p.arpa,profit=mrr*p.margin/100-newAccounts*p.cac;gmProfit+=profit;
  monthly.push(row("M"+(i+1),round(mrr),round(active),round(profit)));
 }
 const ltv=p.arpa*(p.margin/100)/(p.churn/100),payback=p.cac/(p.arpa*p.margin/100),multiple=ltv/p.cac;
 return result({metrics:[measure("ENDING MRR",money(monthly.at(-1).a),"modelled month 12"),measure("LTV / CAC",round(multiple,1)+"×","simple churn-based economics"),measure("CAC PAYBACK",round(payback,1)+" months","at current contribution / account"),measure("ANNUAL NET CONTRIBUTION",money(gmProfit),"gross profit less acquisition spend")],
  chart:chartLine(monthly,"Monthly recurring revenue outlook","Cohort-level additions and expected churn alter the account base.",["Revenue €","Active accounts"]),
  comparison:chartBar([row("Starting accounts",p.customers),row("New accounts",round(acquired)),row("Ending accounts",round(active))],"Account base bridge","Gross acquisitions are offset by losses from monthly churn."),
  table:{columns:["Period","Active accounts","MRR","Contribution after CAC"],rows:monthly.map(x=>[x.label,num(x.b),money(x.a),money(x.c)])},
  impact:{value:money(ltv),label:"Illustrative gross profit LTV per account",formula:"Monthly revenue × gross margin ÷ monthly churn rate.",note:"Simplified steady-state customer value, not audited cohort LTV. Forecast omits seasonality, discounts, retention heterogeneity and fixed overhead."},
  decision:{title:multiple>=3?"Acquisition economics appear supportive":"Review acquisition costs or retention before scaling",
   summary:"At the assumed churn and margin, customer LTV/CAC is "+round(multiple,1)+"× and payback is "+round(payback,1)+" months.",actions:["Use actual retained cohorts rather than a single average churn rate.","Segment high- and low-value customers and track acquisition sources.","Monitor net contribution and cash runway before increasing acquisition spend."]},
  quality:[["Modelling horizon","12 months"],["Retention model","Constant monthly churn"],["Acquisition model","Constant leads × conversion"],["Unmodelled","Working capital and fixed costs"]],
  scope:"Demand generation → acquisitions → retention → recurring cash flow",
  methodology:"Each month begins with the prior account base, subtracts the chosen monthly churn, and adds leads × conversion. MRR equals active accounts × average revenue. Net contribution deducts acquisition spending from gross profit."
 });
}
function gaussian(random){const a=Math.max(1e-10,random()),b=random();return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b)}
function simulateStock(p){
 const random=rnd(808),n=1100,results=[],leadFactor=.65+p.lead/6;
 for(let i=0;i<n;i++){
  const need=Math.max(0,p.demand*leadFactor*(1+gaussian(random)*p.volatility/100));
  const available=p.stock+p.order,shortage=Math.max(0,need-available),left=Math.max(0,available-need);
  results.push({need,shortage,cost:shortage*p.penalty+left*2.5,fill:need?Math.min(1,available/need):1});
 }
 const stockout=results.filter(x=>x.shortage>0).length/n,avgFill=avg(results.map(x=>x.fill)),loss=avg(results.map(x=>x.cost)),p95=percentile(results.map(x=>x.need),.95);
 const bins=range(10,i=>{const bottom=0+i*p.demand*.18,top=bottom+p.demand*.18;return row(num(bottom)+"–"+num(top),results.filter(x=>x.need>=bottom&&x.need<top).length)});
 return result({metrics:[measure("STOCKOUT PROBABILITY",percent(stockout),"across 1,100 demand trials"),measure("EXPECTED FILL RATE",percent(avgFill),"average service across trials"),measure("95TH PERCENTILE DEMAND",unit(round(p95),"units"),"lead-exposure demand distribution"),measure("EXPECTED EXPOSURE",money(loss),"shortage and remaining-stock costs")],
  chart:chartDistribution(bins,"Demand uncertainty: simulated distribution","1,100 deterministic Monte Carlo trials, each with a separate demand shock."),
  comparison:chartBar([row("Available stock",p.stock+p.order),row("Expected need",round(p.demand*leadFactor)),row("95th percentile",round(p95))],"How much inventory is enough?","Comparison for the selected replenishment lead-time window."),
  table:{columns:["Trial","Simulated demand","Unfilled units","Cost exposure"],rows:results.slice(0,10).map((x,i)=>["Run "+(i+1),num(x.need),num(x.shortage),money(x.cost)])},
  impact:{value:money(loss),label:"Expected cost of service exposure",formula:"Mean over trials of lost-unit penalties plus €2.50 per remaining unit.",note:"The distribution is an assumed normal approximation, not a calibrated demand model. Penalties and holding cost are illustrative."},
  decision:{title:stockout>.2?"Protect service before reducing inventory":"Current inventory covers most simulated outcomes",summary:"Across "+num(n)+" demand trials, the current plan faced a stockout in "+percent(stockout)+" of runs.",actions:["Stress-test the demand distribution with observed spikes and supplier lead times.","Compare incremental buffer costs against the expected stockout penalty.","Set a reorder trigger around the service level required by the business."]},
  quality:[["Trials",num(n)],["Randomness","Seeded/reproducible"],["Distribution","Normal demand approximation"],["Service guarantee","Not calibrated"]],
  scope:"Operational variability → repeated trials → risk distributions → stocking decision",
  methodology:"Each independent trial samples demand from an assumed normal distribution around the expected demand scaled by lead-time exposure. The model computes unmet demand, remaining stock, fill rate and illustrative costs."
 });
}
function poissonArrival(r,lambda){const l=Math.exp(-lambda);let k=0,prod=1;do{k++;prod*=r()}while(prod>l&&k<100);return k-1}
function queueRun(p,r,agents=p.agents){
 const available=Array(agents).fill(0),waits=[];let arrivals=0,busy=0,over=0;
 for(let minute=0;minute<480;minute+=5){
  const n=poissonArrival(r,p.arrivals/12);
  for(let j=0;j<n;j++){
   const arrival=minute+r()*5,service=-Math.log(Math.max(1e-9,1-r()))*p.handling;
   let idx=0;for(let k=1;k<available.length;k++)if(available[k]<available[idx])idx=k;
   const start=Math.max(arrival,available[idx]);const wait=start-arrival;
   available[idx]=start+service;
   waits.push(wait);arrivals++;busy+=service;if(wait>p.sla)over++;
  }
 }
 return {arrivals,wait:avg(waits),p90:percentile(waits,.9),within:arrivals?(arrivals-over)/arrivals:1,util:busy/(agents*480),waits};
}
function simulateQueue(p){
 const r=rnd(244),runs=240,all=range(runs,()=>queueRun(p,r)),waits=all.flatMap(x=>x.waits);
 const avgWait=avg(all.map(x=>x.wait)),p90=percentile(waits,.9),sla=avg(all.map(x=>x.within)),util=avg(all.map(x=>x.util));
 const alternative=range(90,()=>queueRun(p,r,p.agents+1));
 const bins=[0,2,5,10,20,35,60,120,240].map((bottom,i,edges)=>row(bottom+"–"+(edges[i+1]??"240+")+" min",waits.filter(w=>w>=bottom&&(edges[i+1]!==undefined?w<edges[i+1]:true)).length));
 const dailyCost=p.agents*p.cost,extra=p.cost;
 return result({metrics:[measure("SERVICE WITHIN SLA",percent(sla),"average per shift simulation"),measure("AVERAGE WAIT",round(avgWait,1)+" min","mean across 240 shifts"),measure("P90 WAIT",round(p90,1)+" min","90th percentile of requests"),measure("AGENT UTILISATION",percent(util),"mean simulated busy time")],
  chart:chartDistribution(bins,"Customer wait-time distribution","Queue outcomes across repeated eight-hour simulated shifts."),
  comparison:chartBar([row("Current team",round(sla*100)),row("With +1 agent",round(avg(alternative.map(x=>x.within))*100))],"How service responds to staffing","Percentage served within the selected waiting-time target."),
  table:{columns:["Shift","Arrivals","Mean wait","Within SLA"],rows:all.slice(0,10).map((x,i)=>["Run "+(i+1),num(x.arrivals),round(x.wait,1)+" min",percent(x.within)])},
  impact:{value:money(dailyCost),label:"Illustrative daily staffing cost",formula:"Available agents × assumed daily cost per person; an additional agent costs "+money(extra)+"/day.",note:"This is staffing cost, not predicted savings. Simulation uses Poisson arrivals and exponential service durations, which require real-world calibration."},
  decision:{title:sla<.8?"Review capacity or reduce handling time":"Most simulated shifts meet the selected SLA",summary:percent(sla)+" of simulated requests were served within the chosen "+p.sla+"-minute waiting target.",actions:["Compare the incremental staffing cost to customer service and abandonment penalties.","Use real arrival-by-hour patterns rather than one average rate.","Test training, deflection and shift design before adding permanent headcount."]},
  quality:[["Independent shifts",num(runs)],["Shift duration","8 hours"],["Arrivals","Poisson per five-minute interval"],["Handling times","Exponential distribution"]],
  scope:"Arrival pattern → queue → agent assignment → service outcomes",
  methodology:"Within each 8-hour shift, arrivals follow a Poisson process in five-minute increments; tasks have exponential handling durations and are allocated to the soonest-available agent. Simulations are reproducible and hypothetical."
 });
}
function triangular(r,center,relative){const a=center*(1-relative),b=center*(1+relative),u=r();return u<.5?a+(b-a)*Math.sqrt(u/2):b-(b-a)*Math.sqrt((1-u)/2)}
function simulateDelivery(p){
 const r=rnd(918),n=1000,durations=[],expenses=[],stages=[.18,.25,.22,.20,.15];
 for(let i=0;i<n;i++){
  const days=sum(stages.map(w=>triangular(r,p.planned*w,p.uncertainty/100)));
  durations.push(days);expenses.push(days*p.cost*(1+.08*Math.max(0,days/p.planned-1)));
 }
 const ontime=durations.filter(d=>d<=p.deadline).length/n,p90=percentile(durations,.9),p95cost=percentile(expenses,.95),allowed=p.budget*(1+p.contingency/100),overspend=expenses.filter(c=>c>allowed).length/n;
 const bins=range(10,i=>{const min=p.planned*(.60+i*.09),max=min+p.planned*.09;return row(num(min)+"–"+num(max)+"d",durations.filter(d=>d>=min&&d<max).length)});
 return result({metrics:[measure("ON-TIME PROBABILITY",percent(ontime),"1,000 simulated project schedules"),measure("P90 PROJECT DURATION",round(p90,1)+" days","one in ten runs lasted longer"),measure("P95 DELIVERY COST",money(p95cost),"upper-tail estimated operating cost"),measure("BUDGET OVERRUN RISK",percent(overspend),"compared with budget + contingency")],
  chart:chartDistribution(bins,"Possible project completion dates","Repeated draws of five linked activity durations."),
  comparison:chartBar([row("Baseline plan",p.planned),row("Contractual deadline",p.deadline),row("P90 duration",round(p90))],"Commitment and contingency","Durations in calendar-equivalent working days under assumptions."),
  table:{columns:["Scenario","Completion duration","Delivery expense","Deadline met"],rows:durations.slice(0,10).map((d,i)=>["Run "+(i+1),round(d,1)+" days",money(expenses[i]),d<=p.deadline?"Yes":"No"])},
  impact:{value:money(avg(expenses)),label:"Expected simulated delivery expense",formula:"Mean of total duration × assumed daily team expense, including an overrun load factor.",note:"Risk and cost are scenario-dependent and assume independent triangular task durations; no historical project data were used."},
  decision:{title:ontime<.8?"Commit only with a revised buffer":"The proposed deadline may be plausible under these assumptions",summary:"The model completes before "+num(p.deadline)+" days in "+percent(ontime)+" of simulated paths.",actions:["Identify dependencies and bottlenecks in the actual work breakdown structure.","Reserve capacity for high-percentile durations and budget needs.","Track delivery progress and update estimates as real work completes."]},
  quality:[["Trial count",num(n)],["Stages","Five sequential phases"],["Duration variability","Independent triangular distributions"],["Deadline probability","Scenario estimate"]],
  scope:"Plan → vary task durations → completion risk → contingency decision",
  methodology:"Five sequential activities have triangular durations centred on their planned shares. Each Monte Carlo run sums the activities and calculates total expense with a small overrun loading factor."
 });
}
const regionNames=["North","East","South","West"];
function salesSource(){
 return seedData(24*4,559,(i,r)=>{
  const month=i%24,reg=regionNames[Math.floor(i/24)],base=67000*(1+.12*Math.floor(i/24));
  const actual=base*(1+.009*month+.12*Math.sin(month/12*Math.PI*2))*(.91+.18*r());
  const target=base*(1+.010*month);
  return {month,reg,actual,target};
 });
}
function biSales(p){
 const base=salesSource(),selected=base.filter(x=>p.region==="All"||x.reg===p.region),available=selected.filter(x=>x.month>=24-p.months);
 const monthRows=range(p.months,i=>{
  const m=24-p.months+i,part=selected.filter(x=>x.month===m);
  return row("M"+(m+1),round(sum(part.map(x=>x.actual))*(1-p.returns/100)),round(sum(part.map(x=>x.target))*(1+p.target/100)));
 });
 const gross=sum(monthRows.map(x=>x.a)),target=sum(monthRows.map(x=>x.b)),margin=gross*(1-p.cost/100);
 const prev=selected.filter(x=>x.month>=24-p.months-12&&x.month<24-12),prevGross=sum(prev.map(x=>x.actual))*(1-p.returns/100);
 const growth=prevGross?(gross-prevGross)/prevGross:0;
 const byRegion=(p.region==="All"?regionNames:[p.region]).map(name=>row(name,round(sum(available.filter(x=>x.reg===name).map(x=>x.actual))*(1-p.returns/100))));
 return result({metrics:[measure("RECONCILED REVENUE",money(gross),"credits and returns deducted"),measure("TARGET VARIANCE",money(gross-target),"actual − adjusted target"),measure("YEAR-ON-YEAR CHANGE",percent(growth),"matching previous-year window"),measure("GROSS CONTRIBUTION",money(margin),"after selected variable cost ratio")],
  chart:chartLine(monthRows,"Revenue versus management target","Monthly actuals net of credits against adjustable targets.",["Net revenue €","Target €"]),
  comparison:chartBar(byRegion,"Revenue by reporting region","Each bar aggregates the same filtered transactions."),
  table:{columns:["Period","Reported net revenue","Adjusted target","Variance"],rows:monthRows.map(x=>[x.label,money(x.a),money(x.b),money(x.a-x.b)])},
  impact:{value:money(gross-target),label:"Commercial variance requiring explanation",formula:"Reconciled reported revenue minus the selected management target.",note:"A reporting variance is not extra cash or guaranteed sales uplift. Transactions and budgets are fictional and filtered consistently."},
  decision:{title:gross<target?"Investigate below-target performance":"Document the drivers of above-target performance",summary:"Selected region revenue is "+money(gross)+", a "+money(gross-target)+" difference versus the adjusted planning target.",actions:["Investigate major month-on-month deviations and returns.","Agree metric definitions across finance and sales before distributing the report.","Assign an owner to each material negative variance and review next month."]},
  quality:[["Data grain","24 months × four regions"],["Filter applied",p.region],["Reconciling base","Synthetic monthly revenues"],["Duplicates","No duplicate period/region pairs"]],
  scope:"Transactions → consistent KPI definitions → filters → executive scorecard",
  methodology:"A deterministic monthly sales register produces 24 periods for four regions. Reporting aggregates only selected records; credit adjustments, targets and cost ratios are applied to the same filtered base."
 });
}
function logisticsSource(){
 return seedData(700,557,(i,r)=>{
  const region=regionNames[i%4],carrier=["Atlas","Faro","Nexa"][i%3],month=i%12;
  const delay=r()<(.105+.023*(i%4)+.016*(i%3)),cost=35+r()*110+12*(i%3),exception=delay||r()<.07;
  return {id:"SHIP-"+(10001+i),region,carrier,month,delay,cost,exception};
 });
}
function biLogistics(p){
 const shipments=logisticsSource().filter(x=>(p.region==="All"||x.region===p.region)&&(p.carrier==="All"||x.carrier===p.carrier));
 const total=shipments.length,late=shipments.filter(x=>x.delay).length,ontime=total?1-late/total:0,freight=sum(shipments.map(x=>x.cost));
 const months=range(12,i=>{const xs=shipments.filter(x=>x.month===i),on=xs.filter(x=>!x.delay).length;return row("M"+(i+1),round(on/(xs.length||1)*100,1),p.goal)});
 const carrierRows=(p.carrier==="All"?["Atlas","Faro","Nexa"]:[p.carrier]).map(name=>{const xs=shipments.filter(x=>x.carrier===name);return row(name,round(xs.filter(x=>!x.delay).length/(xs.length||1)*100,1))});
 return result({metrics:[measure("SHIPMENTS FILTERED",num(total),"from a 700-shipment sample"),measure("ON-TIME DELIVERY",percent(ontime),"proportion delivered within promise"),measure("FREIGHT COST",money(freight),"all selected shipments"),measure("LATE-DELIVERY EXPOSURE",money(late*p.lateCost),"late count × assumed penalty")],
  chart:chartLine(months,"Service level by operating month","Observed synthetic share on time compared with the selected target.",["On-time %","Target %"]),
  comparison:chartBar(carrierRows,"On-time delivery by carrier","Performance is recalculated after the selected filters."),
  table:{columns:["Shipment","Region","Carrier","Operational status"],rows:shipments.slice(0,10).map(x=>[x.id,x.region,x.carrier,x.delay?"Late":"On time"])},
  impact:{value:money(late*p.lateCost),label:"Illustrative service exposure",formula:"Late shipments in the filtered set × the assumed commercial cost per late order.",note:"Synthetic service records; exposure is not an actual penalty, lost revenue or validated contractual damages. Priority-share control is an exploratory assumption, not a carrier change."},
  decision:{title:ontime<p.goal/100?"Service is below the selected target":"Service exceeds the selected target",summary:"On-time rate is "+percent(ontime)+" across "+num(total)+" selected shipments.",actions:["Investigate lanes, causes and carriers with high delay concentrations.","Validate promised delivery windows and consistent timestamp definitions.","Link service exceptions to claims or remedial processes in an integrated system."]},
  quality:[["Full register","700 synthetic shipment rows"],["Applied region",p.region],["Applied carrier",p.carrier],["On-time denominator",num(total)]],
  scope:"Shipment log → canonical service metrics → segment filters → exception actions",
  methodology:"Every synthetic shipment has a region, carrier, month, on-time outcome and freight cost. The dashboard aggregates counts and monetary exposure from the same selected shipment rows."
 });
}
function biProfit(p){
 const channels=["Direct","Partner","Digital"],r=rnd(407),groups=["Essentials","Components","Premium","Maintenance","Specialty","Consumables"];
 const rows=[];
 for(let month=0;month<12;month++)for(let g=0;g<groups.length;g++)for(const ch of channels){
  const qty=140+g*38+Math.round(r()*145),price=42+g*17,unitCost=price*(.42+(g%3)*.055);
  rows.push({month,g:groups[g],ch,qty,price,cost:unitCost});
 }
 const filtered=rows.filter(x=>x.month>=12-p.months&&(p.channel==="All"||x.ch===p.channel));
 const gross=sum(filtered.map(x=>x.qty*x.price*(1-p.discount/100))),costs=sum(filtered.map(x=>x.qty*x.cost*(1+p.inflation/100))),fixed=p.fixed*p.months;
 const profit=gross-costs-fixed;
 const groupsBar=groups.map(g=>{
  const xs=filtered.filter(x=>x.g===g);
  return row(g,round(sum(xs.map(x=>x.qty*x.price*(1-p.discount/100)))-sum(xs.map(x=>x.qty*x.cost*(1+p.inflation/100)))));
 });
 const monthly=range(p.months,i=>{const m=12-p.months+i,xs=filtered.filter(x=>x.month===m);return row("M"+(m+1),round(sum(xs.map(x=>x.qty*x.price*(1-p.discount/100)))),round(sum(xs.map(x=>x.qty*x.cost*(1+p.inflation/100)))+p.fixed))});
 return result({metrics:[measure("NET SALES",money(gross),"filtered, after sales discount"),measure("GROSS MARGIN",percent(gross?(gross-costs)/gross:0),"net sales minus variable cost"),measure("OPERATING CONTRIBUTION",money(profit),"after allocated shared overhead"),measure("GROUPS BELOW ZERO",num(groupsBar.filter(x=>x.a<0).length),"pre-shared overhead contribution")],
  chart:chartLine(monthly,"Revenue versus operating cost","Net sales compared with variable and shared costs, month by month.",["Net sales €","Total cost €"]),
  comparison:chartBar(groupsBar,"Contribution by product family","Before shared overhead allocation."),
  table:{columns:["Product group","Net sales","Variable cost","Gross contribution"],rows:groups.map(g=>{const xs=filtered.filter(x=>x.g===g),v=sum(xs.map(x=>x.qty*x.price*(1-p.discount/100))),c=sum(xs.map(x=>x.qty*x.cost*(1+p.inflation/100)));return [g,money(v),money(c),money(v-c)]})},
  impact:{value:money(profit),label:"Modelled operating contribution",formula:"Net sales − inflated variable costs − selected monthly overhead × periods.",note:"This is not an audited profit-and-loss statement: prices, volumes and costs are artificial and omit taxes, financing and other expenses."},
  decision:{title:profit>0?"Identify the most resilient product families":"Revisit pricing and the variable-cost structure",summary:"Operating contribution after shared overhead is "+money(profit)+" over the selected "+p.months+" months.",actions:["Confirm variable cost accounting and consistent discount treatment.","Analyse loss-making product groups before reducing or expanding them.","Reconcile management dashboards to the finance ledger before production use."]},
  quality:[["Data grain","Month × group × channel"],["Channels","Three deterministic channels"],["Fixed cost treatment","Monthly overhead added once"],["Financial reconciliation","Synthetic only"]],
  scope:"Sales records → cost attribution → margin analysis → portfolio actions",
  methodology:"Deterministic product records contain quantities, prices, costs and channels across 12 months. Filters are applied before arithmetic. Sales discounts, inflation and shared monthly overhead are then included explicitly."
 });
}
const stageNames=["Discovery","Qualified","Proposal","Negotiation","Won"];
const stageWeights=[.1,.25,.46,.7,1];
function crmSource(){
 return seedData(190,671,(i,r)=>{
  const stage=Math.floor(r()*5),value=2500+Math.round(r()*12000),age=Math.floor(r()*82);
  return {id:"OPP-"+(5000+i),firm:["Calma Works","Logis Norte","Atlas Trade","Punto Sur","Roca Systems"][i%5],segment:["Industry","Logistics","Services"][i%3],stage,value,age,month:1+Math.floor(r()*6)};
 });
}
function appCRM(p){
 const deals=crmSource().filter(x=>p.segment==="All"||x.segment===p.segment);
 const available=deals.filter(x=>x.month<=p.coverage),open=available.filter(x=>x.stage<4),won=available.filter(x=>x.stage===4);
 const weighted=sum(open.map(x=>x.value*Math.min(.98,stageWeights[x.stage]*(1+p.uplift/100))));
 const wonValue=sum(won.map(x=>x.value)),stale=open.filter(x=>x.age>p.stale);
 const totals=stageNames.map((s,i)=>row(s,round(sum(available.filter(x=>x.stage===i).map(x=>x.value))),available.filter(x=>x.stage===i).length));
 const due=wonValue+weighted;
 return result({metrics:[measure("OPEN OPPORTUNITIES",num(open.length),"in the selected closing horizon"),measure("WEIGHTED PIPELINE",money(weighted),"stage probability × open value"),measure("STALE OPPORTUNITIES",num(stale.length),"beyond selected activity cutoff"),measure("TARGET COVERAGE",round(due/(p.target||1),2)+"×","won + weighted open vs bookings goal")],
  chart:chartBar(totals,"Pipeline by commercial stage","Values at each stage are based on the selected CRM register."),
  comparison:chartBar([row("Already won",round(wonValue)),row("Weighted open",round(weighted)),row("Bookings target",p.target)],"Forecast against the team objective","Current closed-won value plus weighted opportunities."),
  table:{columns:["Opportunity","Account","Stage","Priority"],rows:available.slice(0,10).map(x=>[x.id,x.firm,stageNames[x.stage],x.age>p.stale?"Needs update · "+x.age+"d":"Tracked · "+money(x.value)])},
  impact:{value:money(due-p.target),label:"Forecast surplus / gap to target",formula:"Won value + weighted value of open opportunities − bookings target.",note:"A stage-weighted pipeline is not signed revenue or a guarantee of winning any deal. All records and probabilities are hypothetical."},
  decision:{title:stale.length?"Prioritise stale, high-value opportunities":"Keep opportunities progressing through the pipeline",summary:unit(stale.length,"open deals")+" exceed the selected age threshold, while projected bookings coverage is "+round(due/p.target,2)+"×.",actions:["Assign an owner and documented next action to each stale opportunity.","Keep open opportunities distinct from won contracts in forecast reporting.","Connect an actual CRM only with access controls, change history and team consent."]},
  quality:[["Records","190 synthetic opportunities"],["Stage weights","Illustrative, not calibrated"],["Age signal","Days since last activity"],["Real CRM data","None"]],
  scope:"Lead → opportunity → stage → owner → forecast → activity tracking",
  methodology:"Synthetic opportunities have stage, value, segment, month and activity age. A deterministic weighted pipeline multiplies open opportunity value by example stage probabilities. Won deals remain separate from uncertain open deals."
 });
}
function appPurchase(p){
 const items=seedData(p.count,698,(i,r)=>{
  const value=150+Math.round(r()*11500),policy=round(65+r()*35),duplicate=r()<.06,missing=r()<.075;
  const valid=policy>=p.compliance&&!duplicate&&!missing;
  return {id:"REQ-"+(7000+i),party:["Ops","Finance","Facilities","IT"][i%4],value,policy,valid,duplicate,missing,auto:false,budgetHold:false};
 });
 let reserved=0;
 for(const item of items){
  const candidate=item.valid&&item.value<=p.threshold;
  if(candidate&&reserved+item.value<=p.budget){item.auto=true;reserved+=item.value;}
  else if(candidate)item.budgetHold=true;
 }
 const auto=items.filter(x=>x.auto),review=items.length-auto.length,acceptedValue=reserved;
 const budget=acceptedValue<=p.budget,limit=p.budget;
 const approvedBudget=acceptedValue;
 const categories=[row("Policy-eligible",items.filter(x=>x.valid).length),row("Manager route",auto.length),row("Review needed",review),row("Budget holds",items.filter(x=>x.budgetHold).length)];
 return result({metrics:[measure("REQUESTS SCREENED",num(p.count),"fake purchase requisitions"),measure("ROUTINE APPROVAL ROUTES",num(auto.length),"policy-valid and below limit"),measure("HUMAN REVIEW QUEUE",num(review),"requires authorised sign-off"),measure("BUDGET HEADROOM",money(p.budget-approvedBudget),"after capped routine commitments")],
  chart:chartBar(categories,"Approval policy outcomes","Approval routing requires both policy compliance and spending limits."),
  comparison:chartBar([row("Available budget",p.budget),row("Routine commitments",round(acceptedValue)),row("Budget-limited",round(approvedBudget))],"The budget constraint matters","Capped spending is a scenario illustration, not a booked purchase."),
  table:{columns:["Request","Department","Value","Decision"],rows:items.slice(0,10).map(x=>[x.id,x.party,money(x.value),x.auto?"Manager route":"Finance review"])},
  impact:{value:money(auto.length*p.reviewCost),label:"Potential review-cost reduction",formula:"Eligible routine requests × hypothetical manual review cost.",note:"Routing does not actually approve purchases. Budget reservations, authorization matrices and supplier orders are not integrated or executed."},
  decision:{title:!budget?"Check aggregate budget before release":"Keep exceptions with authorised reviewers",summary:num(review)+" requests require human review; the aggregate value of routine routes is "+money(acceptedValue)+".",actions:["Enforce aggregate spending ceilings before approval, not just per-request limits.","Require review for duplicates, missing documents and low compliance scores.","Store identity, timestamps, notes and approvals in an audit log."]},
  quality:[["Record source","Synthetic requests"],["Policy checks","Threshold, missing proof, duplicates"],["Real budget write-back","None"],["Actual authorisations","Never executed"]],
  scope:"Requisition → policy → budget check → authority → audit",
  methodology:"Deterministic purchase requests have department, price, synthetic compliance score and exception indicators. The model checks thresholds on each request. A budget envelope is shown separately; requests are not actually executed."
 });
}
function appService(p){
 const records=seedData(p.count,432,(i,r)=>{
  const priority=r()<.20?"Critical":r()<.47?"High":"Standard",age=Math.round(r()*48),hours=4+r()*38;
  const atRisk=age+hours>p.sla;
  return {id:"CASE-"+(6000+i),subject:["Integration","Billing","Access","Data quality"][i%4],priority,age,hours,atRisk};
 });
 const capacity=p.staff*p.load,open=records.length,due=records.filter(x=>x.atRisk),critical=records.filter(x=>x.priority==="Critical"&&x.age>p.critical),days=open/(capacity||1);
 const stage=[row("Active cases",open),row("Within projected SLA",open-due.length),row("At SLA risk",due.length),row("Critical escalation",critical.length)];
 const prioritized=[...records].sort((a,b)=>({Critical:3,High:2,Standard:1}[b.priority]-{Critical:3,High:2,Standard:1}[a.priority]||b.age-a.age));
 return result({metrics:[measure("OPEN SERVICE CASES",num(open),"synthetic service backlog"),measure("PROJECTED SLA RISK",percent(due.length/open),"current age + hypothetical work"),measure("CRITICAL ESCALATIONS",num(critical.length),"aged beyond chosen threshold"),measure("BACKLOG COVERAGE",round(days,1)+" days","cases ÷ daily staff capacity")],
  chart:chartBar(stage,"Case management operational board","All statuses are computed from the same cases and policy controls."),
  comparison:chartBar([row("Backlog",open),row("Daily capacity",capacity),row("SLA-risk cases",due.length)],"Workload versus team capacity","Simple throughput estimate before more detailed scheduling."),
  table:{columns:["Case","Topic","Priority","Owner action"],rows:prioritized.slice(0,11).map(x=>[x.id,x.subject,x.priority,x.atRisk?"Assign for SLA review":"Standard assignment"])},
  impact:{value:money(due.length*p.cost),label:"Illustrative backlog service exposure",formula:"Projected overdue cases × assumed per-case cost.",note:"Case durations are illustrative; this is not a calibrated SLA prediction or a real service penalty. No service tickets are modified."},
  decision:{title:due.length>open*.3?"Rebalance owners and high-risk queues":"Keep the queue moving with named ownership",summary:num(due.length)+" out of "+num(open)+" sample cases exceed the current estimated SLA risk rule.",actions:["Assign a named owner and due date to critical cases.","Review actual handling durations and escalation causes.","Implement row-level permissions and a change history before operational rollout."]},
  quality:[["Records","Synthetic service cases"],["SLA calculation","Age + estimated remaining work"],["Current staff capacity",num(capacity)+"/day"],["Live ticket system","Not connected"]],
  scope:"Intake → priority → assign owner → SLA tracking → closure",
  methodology:"Each synthetic service case has priority, current age and an assumed handling horizon. Potential breach means age plus assumed resolution time exceeds the selected SLA. Capacity is a transparent daily throughput estimate."
 });
}

function assistedAgent(p){
 const records=seedData(p.count,664,(i,r)=>{
  const score=round(50+r()*50),value=round(100+r()*14000),sensitive=r()<.09,missing=r()<.12,category=["Technical","Billing","Delivery","Account"][i%4];
  const route=sensitive?"Privacy review":missing?"Missing information":value>p.exposure?"Manager approval":score<p.confidence?"Low confidence":"Prepare draft";
  return {id:"REQ-"+(18000+i),score,value,sensitive,missing,category,route};
 });
 const by=type=>records.filter(x=>x.route===type).length,ready=by("Prepare draft"),manual=records.length-ready;
 const counts=["Prepare draft","Low confidence","Missing information","Manager approval","Privacy review"].map(k=>row(k,by(k)));
 return result({
  metrics:[measure("REQUESTS CLASSIFIED",num(records.length),"fictional service request records"),measure("DRAFTS PREPARED",num(ready),"templates suggested for approval"),measure("REQUIRES HUMAN ACTION",num(manual),"policy exceptions and uncertainty"),measure("REVIEW TIME AVOIDED",round(ready*p.hours/60,1)+" h","hypothetical effort, not measured saving")],
  chart:chartBar(counts,"How the case orchestrator routes requests","The mock score is synthetic; no real LLM is called."),
  comparison:chartBar([row("Intake",records.length),row("Template-ready",ready),row("Human queue",manual)],"Automated preparation vs human decisions","No messages or external tasks are actually performed."),
  table:{columns:["Request","Type","Illustrative score","Proposed next step"],rows:records.slice(0,10).map(x=>[x.id,x.category,x.score+"%",x.route])},
  impact:{value:money(ready*p.hours*p.rate/60),label:"Illustrative review-effort equivalent",formula:"Template-ready requests × assumed manual review time × assumed hourly cost.",note:"This is a rule-based demonstration with fictional confidence scores and deterministic templates. No LLM inference, real drafting API, automatic sending or measured savings."},
  decision:{title:"Keep uncertain requests with a person",summary:"The policy prepares a reviewable suggested route for "+ready+" requests, while "+manual+" require human attention.",actions:["Validate decision rules and personal-data safeguards.","Require explicit review before external communications.","Measure actual routing quality before considering connected AI agents."]},
  quality:[["Input source","Synthetic requests"],["AI model","None (illustrative heuristic score)"],["External actions","None"],["Manual escalation",num(manual)]],
  scope:"Receive → check information → score → draft suggestion → human approval",
  methodology:"Each example request has a seeded fictional confidence score, financial amount, category, privacy flag and completeness state. Deterministic policy checks route the record and do not call an external AI model."
 });
}
function hireOutsource(p){
 const plans=range(p.limit+1,i=>{
  const internal=Math.min(p.volume,i*p.productivity),external=p.volume-internal,staffExpense=i*p.salary,outsourcing=external*p.outsourced;
  return {staff:i,internal,external,total:staffExpense+outsourcing,staffExpense,outsourcing};
 });
 const current=plans[0],best=plans.reduce((a,b)=>a.total<b.total?a:b);
 const breakeven=p.salary/p.productivity,loss=best.total;
 return result({
  metrics:[measure("LOWEST MODELLED COST",money(best.total),"per month, before existing overhead"),measure("NEW HIRES",num(best.staff),"in cost-minimising plan"),measure("OUTSOURCED CASES",num(best.external),"remaining variable workload"),measure("SAVINGS VS ALL OUTSOURCE",money(current.total-best.total),"hypothetical cost difference")],
  chart:chartLine(plans.map(x=>row(x.staff+" hires",round(x.total),round(x.staffExpense))),"Staffing vs outsourcing cost","Each point evaluates fixed staff costs plus the cost of variable outsourced work.",["Total monthly €","Staff expense €"]),
  comparison:chartBar([row("All outsourced",round(current.total)),row("Best feasible plan",round(best.total)),row("All internal if possible",round(plans.at(-1).total))],"Make-or-buy cost comparison","The selected plan minimises the specified monthly cost."),
  table:{columns:["New employees","Internal cases","Outsourced cases","Total monthly cost"],rows:plans.map(x=>[num(x.staff),num(x.internal),num(x.external),money(x.total)])},
  impact:{value:money(current.total-best.total),label:"Illustrative monthly savings vs full outsourcing",formula:"All-outsourced monthly cost minus the minimum total cost among staff plans.",note:"The comparison assumes all incoming cases must be covered by employees or outsourced suppliers. It omits hiring delays, onboarding, dismissal costs, skills and contract constraints."},
  decision:{title:best.staff?"Test fixed capacity before hiring":"Maintain flexibility until economics change",summary:"Under the selected assumptions, the lowest modelled operating cost uses "+best.staff+" new employees and "+num(best.external)+" outsourced cases. The cost break-even is "+money(breakeven)+" per internal case.",actions:["Validate internal productivity, hiring costs and demand persistence.","Review service-quality commitments and labour-law constraints.","Recalculate after a verified demand or supplier-pricing change."]},
  quality:[["Decision space",num(plans.length)+" staffing options"],["Objective","Minimum monthly covered-workload cost"],["Demand coverage","100% via internal or external"],["Real contracts","Not modelled"]],
  scope:"Define demand → compare staff levels → optimise variable purchasing → approve",
  methodology:"The model enumerates integer new-hire counts from zero to the allowed maximum. Each employee can handle a fixed monthly volume; all remaining cases are outsourced at the editable per-case price."
 });
}
function businessStress(p){
 const r=rnd(1192),count=1200,rows=[];
 for(let i=0;i<count;i++){
  const shock=gaussian(r),demand=Math.max(0,p.demand*(1+shock*p.volatility/100)),absence=Math.min(.60,Math.max(0,p.absence/100+gaussian(r)*.045)),
  capacity=p.capacity*(1-absence),shortfall=Math.max(0,demand-capacity);
  rows.push({demand,capacity,shortfall,cost:shortfall*p.penalty});
 }
 const fails=rows.filter(x=>x.shortfall>0).length,expected=avg(rows.map(x=>x.cost)),p95=percentile(rows.map(x=>x.shortfall),.95);
 const ranges=range(10,i=>{const a=i*100,b=(i+1)*100;return row(a+"-"+b,rows.filter(x=>x.shortfall>=a&&(i===9||x.shortfall<b)).length)});
 return result({
  metrics:[measure("SERVICE CAPACITY BREACH",percent(fails/count),"across 1,200 workload trials"),measure("EXPECTED EXPOSURE",money(expected),"mean simulated shortfall cost"),measure("P95 SHORTFALL",num(p95),"upper-tail weekly unserved work"),measure("AVERAGE COVERAGE",percent(1-avg(rows.map(x=>x.shortfall/Math.max(1,x.demand)))),"average demand served")],
  chart:chartDistribution(ranges,"Distribution of unmet workload","Simulated demand and staff availability shocks in each scenario."),
  comparison:chartBar([row("Nominal capacity",p.capacity),row("Average demand",p.demand),row("Demand with +20%",round(p.demand*1.2))],"Stress scenarios vs available capacity","Weekly units under different operating conditions."),
  table:{columns:["Trial","Demand","Capacity","Financial exposure"],rows:rows.slice(0,10).map((x,i)=>["Run "+(i+1),num(x.demand),num(x.capacity),money(x.cost)])},
  impact:{value:money(expected),label:"Expected cost of capacity shortfall",formula:"Mean over trials of max(0, demand − available capacity) × unit penalty.",note:"The shock distributions are illustrative normal approximations, not calibrated from actual business data or guarantees of tail risk."},
  decision:{title:fails/count>.2?"Prepare additional resilience options":"Monitor resilience without premature expansion",summary:percent(fails/count)+" of hypothetical operating weeks exceed available capacity under the selected variability and absence assumptions.",actions:["Identify actual demand peaks and staff absence patterns.","Compare temporary capacity with shortfall penalties.","Set observable contingency triggers for peak weeks."]},
  quality:[["Independent trials",num(count)],["Shock distributions","Seeded normal approximations"],["Risk horizon","One operating week"],["Observed client data","None"]],
  scope:"Measure uncertainty → stress capacity → quantify breach probability → contingency",
  methodology:"A seeded simulation samples independent demand and staff absence shocks for 1,200 operating weeks. It calculates capacity shortages and hypothetical exposure costs with the selected per-unit penalty."
 });
}
function executiveBI(p){
 const base=salesSource(),shipping=logisticsSource(),sales=base.filter(x=>x.month>=12&&(p.region==="All"||x.reg===p.region)),
 ships=shipping.filter(x=>p.region==="All"||x.region===p.region);
 const revenue=sum(sales.map(x=>x.actual)),target=sum(sales.map(x=>x.target))*(1+p.target/100),profit=revenue*(1-p.cost/100),
 late=ships.filter(x=>x.delay).length,service=ships.length?1-late/ships.length:1;
 const monthly=range(12,i=>{const items=sales.filter(x=>x.month===12+i);return row("M"+(i+1),round(sum(items.map(x=>x.actual))),round(sum(items.map(x=>x.target))*(1+p.target/100)))});
 return result({
  metrics:[measure("REPORTED REVENUE",money(revenue),"synthetic 12-month sales register"),measure("TARGET VARIANCE",money(revenue-target),"actual minus management target"),measure("OPERATING MARGIN",percent(profit/(revenue||1)),"after editable variable cost ratio"),measure("ON-TIME SERVICE",percent(service),"filtered shipment sample")],
  chart:chartLine(monthly,"Board-level revenue trend","Consistent 12-month period and filter across the synthetic register.",["Reported revenue €","Target €"]),
  comparison:chartBar([row("Sales target",round(target)),row("Reported sales",round(revenue)),row("Cost estimate",round(revenue*p.cost/100))],"Combined executive performance","Net income estimates and targets from the same synthetic sales base."),
  table:{columns:["Function","Observed value","Target","Decision signal"],rows:[
   ["Sales",money(revenue),money(target),revenue>=target?"On plan":"Below target"],
   ["Finance",percent(profit/(revenue||1)),"Positive contribution",profit>0?"Positive":"Review"],
   ["Operations",percent(service),p.service+"%",service>=p.service/100?"Service met":"Service gap"],
   ["Late delivery",num(late),"< "+round(ships.length*(1-p.service/100)),late<=ships.length*(1-p.service/100)?"On plan":"Escalate"]
  ]},
  impact:{value:money((revenue-target)-late*p.penalty),label:"Illustrative combined planning variance",formula:"Sales variance minus the assumed late-delivery exposure on the filtered shipment sample.",note:"Combines two fictional datasets solely to demonstrate management review; the value is not cash flow, incremental profit or audited consolidated reporting."},
  decision:{title:revenue<target||service<p.service/100?"Review commercial and operational gaps together":"Maintain performance monitoring",summary:"The synthetic business reports "+money(revenue-target)+" revenue variance and "+percent(service)+" on-time service versus the selected "+p.service+"% target.",actions:["Confirm definitions and reconcile metrics with finance and operations.","Assign owners to deviations that exceed policy thresholds.","Drill into affected periods, regions and delivery exceptions."]},
  quality:[["Sales source","24 × 4 monthly synthetic records"],["Service source","700 synthetic shipments"],["Reporting filter",p.region],["Live data integration","None"]],
  scope:"Sales and operations → KPI definition → shared filters → executive actions",
  methodology:"Twelve periods of fictional regional sales are aggregated with region-filtered shipment outcomes. Target adjustments, variable cost ratio and service exposure use the same selected management scope, but no actual finance ledger is connected."
 });
}
function fleetAssets(p){
 const cars=seedData(90,2013,(i,r)=>{
  const years=2+Math.floor(r()*12),maintenance=round(p.repair*(.35+years*.11)*(0.85+r()*.3)),down=round(p.downtime*(.15+years*.08)),
  retain=maintenance+down,replace=p.replacement,delta=retain-replace;
  const recommendation=years>=p.age&&delta>p.buffer?"Consider renewal":delta>0?"Prepare replacement":"Continue operating";
  return {id:"VEH-"+String(300+i),years,maintenance,down,retain,replace,delta,recommendation};
 });
 const renew=cars.filter(x=>x.recommendation==="Consider renewal"),prepare=cars.filter(x=>x.recommendation==="Prepare replacement"),
 saved=sum(renew.map(x=>Math.max(0,x.delta))),baseline=sum(cars.map(x=>x.retain)),proposed=baseline-saved;
 const groups=["Continue operating","Prepare replacement","Consider renewal"].map(name=>row(name,cars.filter(x=>x.recommendation===name).length));
 return result({
  metrics:[measure("ASSETS MONITORED",num(cars.length),"fictional vehicles"),measure("RENEWAL CANDIDATES",num(renew.length),"age and lifecycle-cost rule"),measure("PREPARE TO REPLACE",num(prepare.length),"cost warning but limited evidence"),measure("MODELLED COST DIFFERENCE",money(saved),"if all flagged renewals were justified")],
  chart:chartBar(groups,"Fleet renewal decision queue","Age, estimated maintenance and downtime determine the indicative status."),
  comparison:chartBar([row("Continue all vehicles",round(baseline)),row("Replace eligible cases",round(proposed))],"Illustrative annual fleet costs","Repairs and downtime versus annualised replacement costs."),
  table:{columns:["Vehicle","Age","Retain cost","Recommended decision"],rows:cars.slice(0,12).map(x=>[x.id,x.years+" years",money(x.retain),x.recommendation])},
  impact:{value:money(saved),label:"Illustrative lifecycle cost difference",formula:"For assets meeting age and cost-difference criteria, sum(max(0, retain cost − replacement annual cost)).",note:"Not verified savings. A real replacement decision also requires residual values, purchase/lease prices, utilisation, emissions, financing and condition data."},
  decision:{title:renew.length?"Validate the vehicles flagged for renewal":"Maintain assets and monitor rising cost",summary:renew.length+" out of 90 synthetic assets meet the selected age and cost-difference thresholds, while "+prepare.length+" require contingency consideration.",actions:["Review condition, age and actual vehicle repair history.","Compare replacement, leasing and maintenance choices across the full lifecycle.","Require a named budget approver before committing to purchases."]},
  quality:[["Assets","90 fictional vehicles"],["Decision model","Transparent cost and age rule"],["Approval or real purchase","Not connected"],["Register updates","Local demonstration only"]],
  scope:"Vehicle register → lifecycle-cost estimate → replacement threshold → approval",
  methodology:"Each fictional vehicle has an age, derived expected repair and downtime costs. Its rule recommends considering replacement when age exceeds the selected threshold and the retain-versus-replace cost gap exceeds the selected buffer."
 });
}
const runners={
 "invoice-flow":automationInvoices,"order-exceptions":automationOrders,"service-routing":automationService,
 "pricing":modellingPricing,"investment":modellingInvestment,"recurring":modellingRecurring,
 "stock-risk":simulateStock,"queue-risk":simulateQueue,"delivery-risk":simulateDelivery,
 "sales-bi":biSales,"logistics-bi":biLogistics,"profitability-bi":biProfit,
 "sales-crm":appCRM,"purchase-approvals":appPurchase,"service-workspace":appService,
 "agent-workflow":assistedAgent,"hire-outsource":hireOutsource,"business-stress":businessStress,"executive-bi":executiveBI,"fleet-assets":fleetAssets
};
export function run(moduleId,caseId,raw={}){
 const c=caseById(moduleId,caseId),p={...c.defaults,...raw};
 for(const ctrl of c.inputs){
  if(ctrl.kind==="range")p[ctrl.key]=clamp(p[ctrl.key],ctrl.min,ctrl.max);
  else if(!ctrl.values.some(x=>x[0]===p[ctrl.key]))p[ctrl.key]=c.defaults[ctrl.key];
 }
 const answer=runners[c.id](p);
 return {...answer,module:moduleById(moduleId),case:c,params:p};
}
export const presentation={money,num,percent,round};
