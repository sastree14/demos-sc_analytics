/**
 * SC-Analytics / Working optimisation demonstration
 * Exact dynamic programming over 10-unit ordering increments.
 * Data and planning scenarios are deterministic, invented examples.
 * No ML model, real ERP connection or claim of realised savings.
 */
export const BATCH = 10;
export const COST_STEP = 50;

export const catalogue = Object.freeze([
  {id:"essentials",name:"Everyday essentials",category:"High volume",demand:270,stock:85,unitCost:70,contribution:48,penalty:26,carry:6,cv:.16,maxOrder:330},
  {id:"seasonal",name:"Seasonal assortments",category:"Volatile",demand:180,stock:50,unitCost:140,contribution:83,penalty:44,carry:12,cv:.28,maxOrder:290},
  {id:"parts",name:"Service components",category:"Recurring demand",demand:340,stock:130,unitCost:45,contribution:31,penalty:20,carry:4,cv:.19,maxOrder:390},
  {id:"premium",name:"Premium kits",category:"High margin",demand:125,stock:25,unitCost:220,contribution:146,penalty:62,carry:19,cv:.30,maxOrder:230}
]);
export const cases = {
  base:{label:"Expected market",factor:1},
  growth:{label:"Demand surge",factor:1.22},
  soft:{label:"Soft demand",factor:.82}
};
const weights=[.10,.20,.40,.20,.10];
const shocks=[-1.5,-.75,0,.75,1.5];
const sum = values => values.reduce((a,b)=>a+b,0);
const clamp = (x,min,max)=>Math.max(min,Math.min(max,x));
export const money=x=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(x);
export const integer=x=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:0}).format(Math.round(x));
export const percent=x=>(x*100).toFixed(1)+"%";
export function settings(raw={}){
  return {
    budget:clamp(Math.floor(Number(raw.budget??33000)/COST_STEP)*COST_STEP,15000,70000),
    capacity:clamp(Math.floor(Number(raw.capacity??450)/BATCH)*BATCH,200,800),
    market:cases[raw.market]?raw.market:"base",
    uncertainty:clamp(Number(raw.uncertainty??100),60,160),
    service:clamp(Number(raw.service??100),50,200),
    period:[4,8,12].includes(Number(raw.period))?Number(raw.period):4
  };
}
function demandFor(p,s,market=s.market){
  const expected=p.demand*(s.period/4)*cases[market].factor;
  return {expected,variance:p.cv*s.uncertainty/100};
}
export function scoreProduct(p,quantity,s,market=s.market){
  const {expected,variance}=demandFor(p,s,market);
  const stocked=p.stock+quantity;
  let fulfilled=0,lost=0,left=0;
  for(let i=0;i<shocks.length;i++){
    const demand=Math.max(0,Math.round(expected*(1+shocks[i]*variance)));
    const sold=Math.min(stocked,demand);
    fulfilled+=weights[i]*sold;
    lost+=weights[i]*(demand-sold);
    left+=weights[i]*(stocked-sold);
  }
  // Contribution margin is AFTER the unit cost of sold goods.
  // Capital charge applies to ordered stock (whether sold or not).
  // No procurement expense is double-counted in the objective.
  const finance=quantity*p.unitCost*.015*(s.period/4);
  const contribution=fulfilled*p.contribution-lost*p.penalty*(s.service/100)-left*p.carry-finance;
  return {fulfilled,lost,left,expected,spend:quantity*p.unitCost,contribution,stocked,quantity};
}
export function evaluate(quantities,s,market=s.market){
  const products=catalogue.map((p,i)=>({...p,...scoreProduct(p,quantities[i]||0,s,market)}));
  const demand=sum(products.map(x=>x.expected));
  const fulfilled=sum(products.map(x=>x.fulfilled));
  return {
    products,
    demand,fulfilled,
    lost:sum(products.map(x=>x.lost)),
    contribution:sum(products.map(x=>x.contribution)),
    spend:sum(products.map(x=>x.spend)),
    storage:sum(quantities),
    fill:demand>0?fulfilled/demand:1,
    units:quantities.slice()
  };
}
function possibilities(p,s){
  const max=Math.floor(p.maxOrder/BATCH);
  const options=[];
  const zero=scoreProduct(p,0,s).contribution;
  for(let k=0;k<=max;k++){
    const quantity=k*BATCH;
    const cost=quantity*p.unitCost;
    if(cost>s.budget||quantity>s.capacity)break;
    options.push({
      quantity,blocks:k,costUnits:Math.round(cost/COST_STEP),
      incremental:scoreProduct(p,quantity,s).contribution-zero
    });
  }
  return options;
}
/**
 * Multiple-choice exact 2-constraint knapsack on discrete order batches.
 * DP state is (spent EUR/50, used 10-unit slots).
 * At most one order decision per SKU, with predecessor chain for reconstruction.
 * No invented solver outputs; all displayed results derive from these states.
 */
export function optimise(raw={}){
  const s=settings(raw),budgetUnits=s.budget/COST_STEP,capBlocks=s.capacity/BATCH;
  let explored=0;
  let frontier=new Map([[0,{value:0,spent:0,blocks:0,prev:null,choice:0}]]);
  const optionsByProduct=catalogue.map(p=>possibilities(p,s));
  for(const options of optionsByProduct){
    const next=new Map();
    for(const state of frontier.values()){
      for(const option of options){
        const spent=state.spent+option.costUnits,blocks=state.blocks+option.blocks;
        if(spent>budgetUnits||blocks>capBlocks)continue;
        explored++;
        const value=state.value+option.incremental;
        const key=spent*(capBlocks+1)+blocks;
        const prior=next.get(key);
        if(!prior||value>prior.value+1e-8){
          next.set(key,{value,spent,blocks,prev:state,choice:option.quantity});
        }
      }
    }
    frontier=next;
  }
  let winner=null;
  for(const state of frontier.values())if(!winner||state.value>winner.value)winner=state;
  if(!winner)throw new Error("No feasible purchase allocation found.");
  const choices=Array(catalogue.length).fill(0);
  let current=winner;
  for(let i=catalogue.length-1;i>=0;i--){choices[i]=current.choice;current=current.prev;}
  return {quantities:choices,evaluation:evaluate(choices,s),explored,states:frontier.size,method:"Exact discrete dynamic programme (10-unit batches; €50 budget steps)"};
}
/**
 * Transparent, deliberately simple benchmark: share each replenishment batch
 * in rounds, giving priority to items with the lowest relative stock coverage.
 * This is a comparison rule, NOT a representation of a real client's policy.
 */
export function comparisonPolicy(raw={}){
  const s=settings(raw),quantity=Array(catalogue.length).fill(0);
  const available=catalogue.map(p=>Math.floor(p.maxOrder/BATCH));
  let remainingBudget=s.budget,remainingCapacity=s.capacity;
  for(let attempts=0;attempts<1500;attempts++){
    const candidates=catalogue.map((p,i)=>{
      const target=p.demand*(s.period/4)*cases[s.market].factor;
      const currentCoverage=(p.stock+quantity[i])/Math.max(1,target);
      return {i,coverage:currentCoverage,cost:BATCH*p.unitCost};
    }).filter(({i,cost})=>quantity[i]/BATCH<available[i]&&cost<=remainingBudget&&BATCH<=remainingCapacity);
    if(!candidates.length)break;
    candidates.sort((a,b)=>a.coverage-b.coverage||a.i-b.i);
    const choose=candidates[0];
    quantity[choose.i]+=BATCH;
    remainingBudget-=choose.cost;
    remainingCapacity-=BATCH;
  }
  return {quantities:quantity,evaluation:evaluate(quantity,s),method:"Reference policy: restock the lowest-covered SKU in each round"};
}
export function runOptimisation(raw={}){
  const s=settings(raw),optimised=optimise(s),comparison=comparisonPolicy(s);
  const scenarios=Object.keys(cases).map(key=>({key,label:cases[key].label,optimised:evaluate(optimised.quantities,s,key),comparison:evaluate(comparison.quantities,s,key)}));
  const delta=optimised.evaluation.contribution-comparison.evaluation.contribution;
  const fillDelta=optimised.evaluation.fill-comparison.evaluation.fill;
  const diagnostics=catalogue.map((p,i)=>({
    ...p,
    baseline:comparison.quantities[i],
    optimised:optimised.quantities[i],
    change:optimised.quantities[i]-comparison.quantities[i],
    baselineScore:scoreProduct(p,comparison.quantities[i],s),
    optimisedScore:scoreProduct(p,optimised.quantities[i],s)
  }));
  return {settings:s,optimised,comparison,scenarios,delta,fillDelta,diagnostics};
}
export function validateResult(result){
  const s=result.settings;
  const o=result.optimised.evaluation;
  const c=result.comparison.evaluation;
  if(o.spend>s.budget||o.storage>s.capacity)throw new Error("Optimised plan breaches a resource constraint");
  if(c.spend>s.budget||c.storage>s.capacity)throw new Error("Comparison plan breaches a resource constraint");
  if(result.optimised.quantities.some((v,i)=>v<0||v>catalogue[i].maxOrder||v%BATCH!==0))throw new Error("Invalid SKU quantity");
  if(result.delta<-1e-6)throw new Error("Optimisation performed worse than the comparison policy");
  return true;
}
