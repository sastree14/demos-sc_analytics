/*
 * SC-Analytics | Decision Intelligence Studio, commercial demonstration.
 * All observations are deterministic SYNTHETIC records. Models calculate locally.
 * Financial impacts are assumption-based examples, not realised client benefits.
 */
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const sum=a=>a.reduce((s,v)=>s+v,0);
const mean=a=>sum(a)/Math.max(1,a.length);
const rnd=v=>Math.round(v);
const root=(v)=>Math.sqrt(Math.max(0,v));
const seeded=(seed)=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let x=Math.imul(seed^seed>>>15,1|seed);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296;};
const dot=(a,b)=>sum(a.map((x,i)=>x*b[i]));
const sigmoid=z=>1/(1+Math.exp(-clamp(z,-25,25)));
const std=a=>root(mean(a.map(x=>(x-mean(a))**2)));
const quantile=(xs,p)=>{if(!xs.length)return 0;const a=[...xs].sort((x,y)=>x-y),i=(a.length-1)*clamp(p,0,1),j=Math.floor(i);return a[j]+(a[Math.ceil(i)]-a[j])*(i-j)};
export const cases=[
 {id:"demand",name:"Demand & inventory",short:"Predict future volumes and plan stock.",tag:"Forecasting",sector:"DISTRIBUTION",kind:"forecast",unit:"orders",base:1420,trend:9,season:.16,seed:43,unitValue:32,perEmployee:180},
 {id:"revenue",name:"Revenue & sales",short:"Explore sales outlooks and growth scenarios.",tag:"Forecasting",sector:"COMMERCIAL",kind:"forecast",unit:"£k",base:250,trend:3.5,season:.12,seed:87,unitValue:1000,perEmployee:32},
 {id:"workforce",name:"Workforce planning",short:"Anticipate incoming workload and staffing needs.",tag:"Planning",sector:"OPERATIONS",kind:"forecast",unit:"cases",base:980,trend:8,season:.08,seed:147,unitValue:18,perEmployee:145},
 {id:"churn",name:"Customer retention",short:"Flag accounts likely to disengage.",tag:"Probability",sector:"CUSTOMER SUCCESS",kind:"classification",variant:"churn",seed:552},
 {id:"delivery",name:"Delivery reliability",short:"Prioritise likely delays before escalation.",tag:"Classification",sector:"LOGISTICS",kind:"classification",variant:"delivery",seed:1105},
 {id:"cost",name:"Cost estimation",short:"Estimate operational costs before quoting.",tag:"Regression",sector:"FINANCE",kind:"regression",seed:241},
 {id:"anomaly",name:"Production anomalies",short:"Find unusual operating patterns early.",tag:"Detection",sector:"MANUFACTURING",kind:"anomaly",seed:889}
];
export const byId=id=>cases.find(c=>c.id===id)||cases[0];
export const initial={
 demand:{horizon:6,outlook:0,confidence:90,method:"ensemble",unitCost:13,capacity:1650},
 revenue:{horizon:6,outlook:4,confidence:90,method:"ensemble",unitCost:700,capacity:300},
 workforce:{horizon:6,outlook:0,confidence:90,method:"ensemble",unitCost:16,capacity:1050},
 churn:{threshold:50,portfolio:650,effectiveness:30,cost:2400,spend:145,tenure:18,support:4,engagement:55},
 delivery:{threshold:50,portfolio:650,effectiveness:30,cost:950,backlog:62,distance:580,reliability:87,priority:0},
 cost:{volume:200,distance:330,complexity:3,automation:40,confidence:90,margin:22},
 anomaly:{sensitivity:2.7,shift:0,efficiency:35,incidentCost:4800}
};
export const controlSpecs={
 forecast:[
  {key:"horizon",label:"Planning horizon",kind:"choice",choices:[[3,"3 months"],[6,"6 months"],[12,"12 months"]]},
  {key:"outlook",label:"Business outlook",kind:"slider",min:-25,max:25,step:1,unit:"%",hint:"Scenario growth applied progressively across the horizon"},
  {key:"confidence",label:"Uncertainty range",kind:"choice",choices:[[80,"80%"],[90,"90%"],[95,"95%"]]},
  {key:"unitCost",label:"Cost per planning error",kind:"slider",min:5,max:80,step:1,unit:"£",hint:"For revenue, £k errors are converted into a monetary value"},
  {key:"capacity",label:"Available capacity / month",kind:"slider",min:100,max:2500,step:50,unit:"",hint:"Compare upcoming demand with current operational capacity"}
 ],
 churn:[
  {key:"spend",label:"Monthly account value",kind:"slider",min:30,max:600,step:5,unit:"£"},
  {key:"tenure",label:"Customer relationship",kind:"slider",min:1,max:72,step:1,unit:" months"},
  {key:"support",label:"Recent support cases",kind:"slider",min:0,max:12,step:1,unit:""},
  {key:"engagement",label:"Account engagement",kind:"slider",min:10,max:100,step:5,unit:"%"},
  {key:"threshold",label:"Intervention threshold",kind:"slider",min:20,max:85,step:5,unit:"%"},
  {key:"portfolio",label:"Accounts monitored",kind:"slider",min:100,max:1600,step:50,unit:""},
  {key:"effectiveness",label:"Assumed action effectiveness",kind:"slider",min:10,max:60,step:5,unit:"%"}
 ],
 delivery:[
  {key:"backlog",label:"Orders in queue",kind:"slider",min:10,max:105,step:1,unit:""},
  {key:"distance",label:"Delivery distance",kind:"slider",min:30,max:1100,step:10,unit:" km"},
  {key:"reliability",label:"Carrier on-time record",kind:"slider",min:70,max:99,step:1,unit:"%"},
  {key:"priority",label:"Urgent consignment",kind:"choice",choices:[[0,"Standard"],[1,"Priority"]]},
  {key:"threshold",label:"Review threshold",kind:"slider",min:20,max:85,step:5,unit:"%"},
  {key:"portfolio",label:"Shipments monitored",kind:"slider",min:100,max:1600,step:50,unit:""},
  {key:"effectiveness",label:"Assumed mitigation",kind:"slider",min:10,max:60,step:5,unit:"%"}
 ],
 cost:[
  {key:"volume",label:"Order size",kind:"slider",min:50,max:650,step:10,unit:" units"},
  {key:"distance",label:"Transport distance",kind:"slider",min:20,max:950,step:10,unit:" km"},
  {key:"complexity",label:"Handling complexity",kind:"choice",choices:[[1,"Low"],[2,"Moderate"],[3,"Standard"],[4,"High"],[5,"Very high"]]},
  {key:"automation",label:"Automated processing",kind:"slider",min:0,max:90,step:5,unit:"%"},
  {key:"confidence",label:"Indicative estimate range",kind:"choice",choices:[[80,"80%"],[90,"90%"],[95,"95%"]]},
  {key:"margin",label:"Target commercial margin",kind:"slider",min:10,max:45,step:1,unit:"%"}
 ],
 anomaly:[
  {key:"sensitivity",label:"Alert sensitivity",kind:"choice",choices:[[2.0,"Higher"],[2.7,"Balanced"],[3.5,"Lower"]]},
  {key:"shift",label:"Operating load change",kind:"slider",min:-20,max:30,step:2,unit:"%"},
  {key:"efficiency",label:"Assumed response effectiveness",kind:"slider",min:10,max:60,step:5,unit:"%"},
  {key:"incidentCost",label:"Cost per disruption",kind:"slider",min:1500,max:15000,step:500,unit:"£"}
 ]
};
const monthAt=(start,i)=>new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+i,1));
const monthName=d=>d.toLocaleDateString("en-GB",{month:"short",year:"2-digit",timeZone:"UTC"});
function syntheticHistory(c){
 const random=seeded(c.seed),start=new Date(Date.UTC(2023,4,1));
 return Array.from({length:42},(_,i)=>{
  const month=monthAt(start,i),phase=month.getUTCMonth();
  const seasonal=c.base*c.season*(Math.cos(2*Math.PI*(phase-10)/12)+.25*Math.sin(4*Math.PI*phase/12));
  const irregular=c.base*(random()+random()+random()-1.5)*.055;
  const value=Math.max(1,rnd(c.base+c.trend*i+seasonal+irregular+(i>=27&&i<=29?-c.base*.045:0)));
  return {index:i,label:monthName(month),date:month,value};
 });
}
function seasonPredict(data,h){
 const out=[];
 for(let i=0;i<h;i++){const pos=data.length+i-12;out.push(Math.max(1,rnd(pos<data.length?data[pos].value:out[pos-data.length])))}
 return out;
}
function trendPredict(data,h){
 const n=data.length,mx=(n-1)/2,my=mean(data.map(d=>d.value));
 const slope=sum(data.map((d,i)=>(i-mx)*(d.value-my)))/sum(data.map((d,i)=>(i-mx)**2));
 const intercept=my-slope*mx,residual=Array.from({length:12},()=>[]);
 data.forEach((d,i)=>residual[d.date.getUTCMonth()].push(d.value-intercept-slope*i));
 const months=residual.map(x=>mean(x)),center=mean(months);
 return Array.from({length:h},(_,i)=>{
  const m=monthAt(data.at(-1).date,i+1).getUTCMonth();
  return Math.max(1,rnd(intercept+slope*(n+i)+(months[m]-center)*.9));
 });
}
function predict(data,h,method){
 const a=seasonPredict(data,h),b=trendPredict(data,h);
 return a.map((v,i)=>method==="seasonal"?v:method==="trend"?b[i]:rnd(.30*v+.70*b[i]));
}
const forecastStats=(actual,pred)=>{
 const errs=pred.map((p,i)=>p-actual[i]),abs=errs.map(Math.abs);
 return {mae:mean(abs),wape:100*sum(abs)/Math.max(1,sum(actual)),accuracy:clamp(100-100*sum(abs)/Math.max(1,sum(actual)),0,100),bias:100*sum(errs)/Math.max(1,sum(actual)),errors:errs,absolute:abs};
};
export function runForecastStudio(c,raw={}){
 const params={...initial[c.id],...raw},history=syntheticHistory(c),cut=36;
 const training=history.slice(0,cut),holdout=history.slice(cut),actual=holdout.map(d=>d.value);
 const methods=["seasonal","trend","ensemble"];
 const tests=methods.map(method=>({method,...forecastStats(actual,predict(training,6,method))}));
 const selected=tests.find(t=>t.method===params.method)||tests[2],baseline=tests[0];
 const horizon=Number(params.horizon),outlook=Number(params.outlook),month=history.at(-1).date;
 const forecast=predict(history,horizon,selected.method);
 const scale=quantile(selected.absolute,.8),factor=({80:1,90:1.30,95:1.62})[params.confidence]||1.30;
 const future=forecast.map((v,i)=>{
  const adjusted=rnd(v*(1+outlook/100*(i+1)/horizon));
  const width=Math.max(v*.055,scale)*factor*(1+.035*i);
  return {label:monthName(monthAt(month,i+1)),value:adjusted,reference:v,low:Math.max(0,rnd(adjusted-width)),high:rnd(adjusted+width)};
 });
 const sumFuture=sum(future.map(x=>x.value)),avgFuture=sumFuture/horizon;
 const comparison=forecastStats(actual,predict(training,6,"seasonal"));
 const improvement=Math.max(0,comparison.mae-selected.mae);
 const perUnit=Number(params.unitCost),scaleMoney=c.id==="revenue"?1000:1;
 const planningValue=improvement*horizon*perUnit*scaleMoney;
 const monthlyUnits=avgFuture;
 const beyond=Math.max(0,monthlyUnits-Number(params.capacity));
 const scenarios=[-12,0,12].map(delta=>{
  const effective=outlook+delta,values=forecast.map((v,i)=>Math.max(1,rnd(v*(1+effective/100*(i+1)/horizon))));
  const total=sum(values);
  return {name:delta<0?"Conservative":delta>0?"Accelerated":"Current plan",detail:(effective>=0?"+":"")+effective+"% end-horizon",value:total,capacityGap:Math.max(0,total/horizon-Number(params.capacity))};
 });
 const back=holdout.map((d,i)=>({label:d.label,actual:d.value,predicted:predict(training,6,selected.method)[i]}));
 const first=history.at(-1).value,last=future.at(-1).value;
 const drivers=[
  {label:"Recent actual",value:first},
  {label:"Model direction",value:forecast.at(-1)-first},
  {label:"Scenario override",value:last-forecast.at(-1)}
 ];
 const recommendation=beyond>0?
  "The current outlook is above the stated monthly capacity. Review staffing, replenishment or lead times before committing to a plan.":
  "The current outlook sits within the stated monthly capacity. Use the lower and upper planning ranges to define contingency triggers.";
 return {
  kind:"forecast",case:c,params,history,future,back,tests,selected,
  chart:{kind:"forecast",history:history.slice(-18),future},
  secondary:{kind:"backtest",points:back},
  third:{kind:"bars",title:"Scenario comparison",values:scenarios},
  drivers,scenarios,
  metrics:[
   {label:"MODEL ACCURACY",value:selected.accuracy.toFixed(1)+"%",hint:"100 − WAPE · six held-out months"},
   {label:"EXPECTED VOLUME",value:formatCompact(sumFuture),hint:c.unit+" · "+horizon+"-month horizon"},
   {label:"PLANNING EXPOSURE",value:formatCompact(beyond),hint:"monthly "+c.unit+" above stated capacity"},
   {label:"VS SIMPLE BASELINE",value:(selected.accuracy-baseline.accuracy>=0?"+":"")+(selected.accuracy-baseline.accuracy).toFixed(1)+" pp",hint:"accuracy difference"}
  ],
  quality:[{name:"Mean absolute error",value:formatNum(selected.mae)+" "+c.unit},{name:"Weighted error",value:selected.wape.toFixed(1)+"%"},{name:"Forecast bias",value:(selected.bias>=0?"+":"")+selected.bias.toFixed(1)+"%"},{name:"Validation",value:"Last six months held out"}],
  impact:{value:currency(planningValue),label:"Illustrative planning value",subtitle:"Model error reduction × selected cost per unit × horizon",note:"This is a scenario illustration of error-cost exposure versus the seasonal baseline, not guaranteed savings. The value is zero if the selected method does not outperform it."},
  decision:{headline:"Translate the outlook into a plan",summary:recommendation,actions:[
   "Set a monthly operating plan around "+formatNum(avgFuture)+" "+c.unit+".",
   "Allocate an exception review if volume exceeds "+formatNum(Number(params.capacity))+" "+c.unit+"/month.",
   "Track forecast error monthly and revisit assumptions when actuals diverge."
  ]},
  methodology:"Seasonal baseline, seasonal trend and fixed-weight ensemble. Six recent months are withheld for comparable backtesting. Bounds are illustrative multiples of historical absolute errors, not statistically calibrated confidence intervals.",
  validation:tests.map(t=>({label:t.method==="seasonal"?"Seasonal baseline":t.method==="trend"?"Trend + season":"Weighted ensemble",accuracy:t.accuracy,mae:t.mae,selected:t.method===selected.method}))
 };
}
export const formatNum=n=>new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(n);
export const formatCompact=n=>n>=1000000?(n/1000000).toFixed(2)+"m":n>=10000?(n/1000).toFixed(1)+"k":formatNum(n);
export const currency=n=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n);
function classificationSpec(variant){
 if(variant==="churn")return {
  labels:["Monthly account value","Tenure","Support cases","Engagement"],
  feats:x=>[1,(x.spend-160)/140,(24-x.tenure)/20,(x.support-3)/3,(55-x.engagement)/30],
  inputKeys:["spend","tenure","support","engagement"],
  sample:r=>({spend:35+Math.round(r()*520),tenure:1+Math.round(r()*70),support:Math.round(r()*12),engagement:10+Math.round(r()*90)}),
  truth:[-1.25,.07,.87,.8,1.15],title:"Likelihood of churn",label:"at-risk accounts",event:"churn",
  driverCopy:["Account value","Short tenure","Support activity","Low engagement"]
 };
 return {
  labels:["Queue size","Distance","Carrier reliability","Priority"],
  feats:x=>[1,(x.backlog-45)/35,(x.distance-450)/400,(90-x.reliability)/12,x.priority?1:0],
  inputKeys:["backlog","distance","reliability","priority"],
  sample:r=>({backlog:10+Math.round(r()*95),distance:30+Math.round(r()*1100),reliability:70+Math.round(r()*29),priority:r()>.67?1:0}),
  truth:[-1.30,1.40,1.00,1.75,.65],title:"Likelihood of delay",label:"high-risk shipments",event:"delay",
  driverCopy:["Order backlog","Route distance","Carrier reliability","Urgency"]
 };
}
const fitLogistic=rows=>{
 const w=Array(rows[0].features.length).fill(0);
 for(let step=0;step<520;step++){
  const grad=Array(w.length).fill(0);
  for(const r of rows){const e=sigmoid(dot(w,r.features))-r.y;r.features.forEach((v,i)=>grad[i]+=e*v)}
  w.forEach((v,i)=>w[i]-=.25*(grad[i]/rows.length+(i===0?0:.004*v)));
 }
 return w;
};
function sampleClassification(c){
 const spec=classificationSpec(c.variant),r=seeded(c.seed);
 return Array.from({length:600},()=>{
  const input=spec.sample(r),features=spec.feats(input);
  const p=sigmoid(dot(spec.truth,features));
  return {input,features,y:r()<p?1:0};
 });
}
const confusion=(rows,threshold)=>{
 let tp=0,tn=0,fp=0,fn=0;
 rows.forEach(r=>{const alert=r.prob>=threshold; if(alert&&r.y)tp++;else if(alert&&!r.y)fp++;else if(!alert&&r.y)fn++;else tn++;});
 return {tp,tn,fp,fn,accuracy:(tp+tn)/rows.length,recall:tp/(tp+fn||1),precision:tp/(tp+fp||1),falseAlarms:fp,missed:fn,alerts:tp+fp};
};
export function runClassificationStudio(c,raw={}){
 const params={...initial[c.id],...raw},spec=classificationSpec(c.variant),rows=sampleClassification(c),train=rows.slice(0,470),holdout=rows.slice(470);
 const weights=fitLogistic(train);
 const scored=holdout.map(row=>({...row,prob:sigmoid(dot(weights,row.features))}));
 const prob=sigmoid(dot(weights,spec.feats(params))),threshold=Number(params.threshold)/100;
 const cm=confusion(scored,threshold);
 const histogram=Array.from({length:10},(_,i)=>({label:(i*10)+"–"+(i*10+10)+"%",value:scored.filter(x=>x.prob>=i/10&&x.prob<(i+1)/10).length,events:scored.filter(x=>x.prob>=i/10&&x.prob<(i+1)/10&&x.y).length}));
 const tradeoff=Array.from({length:9},(_,i)=>{const limit=(i+1)/10,m=confusion(scored,limit);return {label:rnd(limit*100)+"%",detected:m.recall*100,reviewed:m.alerts/holdout.length*100}});
 const portfolio=Number(params.portfolio),effect=Number(params.effectiveness)/100;
 const flaggedRate=cm.alerts/scored.length,precision=cm.precision;
 const expectedFlagged=portfolio*flaggedRate;
 const caseCost=Number(params.cost??(c.variant==="churn"?2400:950));
 const opportunity=expectedFlagged*precision*caseCost*effect;
 const profile=spec.feats(params);
 const drivers=spec.driverCopy.map((label,i)=>({label,value:weights[i+1]*profile[i+1]}));
 return {
  kind:"classification",case:c,params,probability:prob,threshold,cm,rows:scored,weights,histogram,tradeoff,drivers,
  chart:{kind:"probability",histogram,score:prob,threshold},
  secondary:{kind:"confusion",cm},
  third:{kind:"tradeoff",points:tradeoff},
  metrics:[
   {label:"CASE RISK",value:(prob*100).toFixed(1)+"%",hint:spec.title+" · illustrative"},
   {label:"CASES DETECTED",value:(cm.recall*100).toFixed(1)+"%",hint:"held-out event recall"},
   {label:"CORRECTLY FLAGGED",value:(cm.precision*100).toFixed(1)+"%",hint:"precision among reviewed cases"},
   {label:"REVIEW QUEUE",value:formatNum(expectedFlagged),hint:"estimated cases at current threshold"}
  ],
  quality:[{name:"Holdout accuracy",value:(cm.accuracy*100).toFixed(1)+"%"},{name:"Missed events",value:formatNum(cm.fn)+" / "+formatNum(cm.tp+cm.fn)},{name:"False alerts",value:formatNum(cm.fp)+" / "+formatNum(cm.fp+cm.tn)},{name:"Evaluation sample",value:holdout.length+" held-out records"}],
  impact:{value:currency(opportunity),label:"Potentially mitigated exposure",subtitle:"Flagged cases × measured precision × event cost × assumed response effectiveness",note:"Scenario maths only. Intervention effectiveness is assumed, not estimated causally. Flagged rate and precision come from synthetic held-out examples."},
  decision:{headline:prob>=threshold?"Route this case for human review":"Keep this case under standard monitoring",
    summary:prob>=threshold?"The estimated risk exceeds the operating review threshold. Prioritise a human check, not an automatic rejection.":"The case falls below the chosen alert threshold. Keep routine controls and monitor new information.",
    actions:[
     "At this threshold, "+formatNum(cm.tp)+" of "+formatNum(cm.tp+cm.fn)+" known events were flagged in synthetic validation.",
     "The same threshold produced "+formatNum(cm.fp)+" false alerts; allow capacity for manual review.",
     "Reassess the threshold using actual cost of missed events and review capacity."
    ]},
  validation:[{label:"Accuracy",value:cm.accuracy*100},{label:"Detected events",value:cm.recall*100},{label:"True among flags",value:cm.precision*100}],
  methodology:"Logistic classification trained on 470 synthetic outcomes and evaluated on 130 held-out cases. Probability threshold trades higher detection against higher review load. The model is not calibrated for a real company."
 };
}
function syntheticCosts(c){
 const r=seeded(c.seed);
 return Array.from({length:520},()=>{
  const x={volume:50+r()*600,distance:20+r()*930,complexity:1+Math.floor(r()*5),automation:r()*90};
  const y=2200+23*x.volume+3.6*x.distance+1100*x.complexity-16*x.automation+(r()+r()+r()-1.5)*1400;
  return {x,y};
 });
}
function solveLinear(matrix,b){
 const n=b.length,a=matrix.map((row,i)=>[...row,b[i]]);
 for(let i=0;i<n;i++){
  let pivot=i;for(let j=i+1;j<n;j++)if(Math.abs(a[j][i])>Math.abs(a[pivot][i]))pivot=j;
  [a[i],a[pivot]]=[a[pivot],a[i]];
  if(Math.abs(a[i][i])<1e-10)throw Error("Ill-conditioned regression matrix");
  const scale=a[i][i];for(let k=i;k<=n;k++)a[i][k]/=scale;
  for(let j=0;j<n;j++){if(j===i)continue;const f=a[j][i];for(let k=i;k<=n;k++)a[j][k]-=f*a[i][k]}
 }
 return a.map(r=>r[n]);
}
function features(x){return [1,x.volume/100,x.distance/100,x.complexity,x.automation/10]}
function fitLinear(rows){
 const n=5,A=Array.from({length:n},()=>Array(n).fill(0)),b=Array(n).fill(0);
 for(const row of rows){
  const v=features(row.x);
  for(let i=0;i<n;i++){b[i]+=v[i]*row.y;for(let j=0;j<n;j++)A[i][j]+=v[i]*v[j]}
 }
 for(let i=1;i<n;i++)A[i][i]+=.05;
 return solveLinear(A,b);
}
export function runRegressionStudio(c,raw={}){
 const params={...initial.cost,...raw},rows=syntheticCosts(c),train=rows.slice(0,420),test=rows.slice(420);
 const coef=fitLinear(train),score=x=>dot(coef,features(x));
 const actual=test.map(r=>r.y),predicted=test.map(r=>score(r.x));
 const errors=actual.map((a,i)=>a-predicted[i]),mae=mean(errors.map(Math.abs)),rmse=root(mean(errors.map(x=>x*x)));
 const meanActual=mean(actual),r2=1-sum(errors.map(x=>x*x))/sum(actual.map(x=>(x-meanActual)**2));
 const estimate=Math.max(0,score(params)),mult=({80:1.28,90:1.64,95:1.96})[params.confidence]||1.64;
 const low=Math.max(0,estimate-rmse*mult),high=estimate+rmse*mult;
 const quote=estimate/(1-Number(params.margin)/100);
 const drivers=[
  {label:"Order volume",value:coef[1]*params.volume/100},
  {label:"Transport distance",value:coef[2]*params.distance/100},
  {label:"Handling complexity",value:coef[3]*params.complexity},
  {label:"Automation effect",value:coef[4]*params.automation/10}
 ];
 const scattered=test.filter((_,i)=>i%2===0).map(r=>({x:r.x.volume,actual:r.y,predicted:score(r.x)}));
 const scenarios=[.8,1,1.2].map(mult=>{const x={...params,volume:rnd(params.volume*mult)};return {name:mult<1?"Smaller job":mult>1?"Larger job":"Current scope",detail:formatNum(x.volume)+" units",value:Math.max(0,score(x))}});
 return {
  kind:"regression",case:c,params,estimate,low,high,quote,drivers,scenarios,validation:[],
  chart:{kind:"scatter",points:scattered,marker:{x:params.volume,y:estimate}},
  secondary:{kind:"drivers",values:drivers},third:{kind:"bars",title:"Cost sensitivity",values:scenarios},
  metrics:[
   {label:"ESTIMATED COST",value:currency(estimate),hint:"for the selected job profile"},
   {label:"INDICATIVE RANGE",value:currency(low)+" – "+currency(high),hint:"illustrative uncertainty"},
   {label:"HOLDOUT MAE",value:currency(mae),hint:"100 unseen job estimates"},
   {label:"MODEL FIT",value:(r2*100).toFixed(1)+"%",hint:"held-out R², variance explained"}
  ],
  quality:[{name:"Validation records",value:"100 separate jobs"},{name:"Absolute estimation error",value:currency(mae)},{name:"Root mean squared error",value:currency(rmse)},{name:"Out-of-sample R²",value:r2.toFixed(3)}],
  impact:{value:currency(quote),label:"Illustrative quoting reference",subtitle:"Estimated cost ÷ (1 − target margin)",note:"The proposed quote follows only from an assumed gross margin, before taxes, commercial conditions or risk provisions. It is not a validated customer price."},
  decision:{headline:"Support pricing with a cost estimate",summary:"Changing volume, distance, complexity or automation recalculates the estimated cost and indicative range using the fitted regression.",
   actions:["Review the most influential cost components before quoting.","Compare the calculated range with historical project outcomes.","Validate the estimate with actual invoices and operational data before deployment."]},
  methodology:"A multiple linear regression is fitted by solving normal equations on 420 synthetic jobs, then evaluated against 100 separate records. The model estimates continuous cost; ranges use held-out residual standard deviation with illustrative multipliers, not calibrated prediction intervals."
 };
}
function syntheticOperations(c,shift=0){
 const r=seeded(c.seed),out=[];
 for(let i=0;i<96;i++){
  const realAnomaly=[14,29,43,60,74,87,92].includes(i);
  const base=69+4*Math.sin(i*.32)+2*Math.cos(i*.11)+(r()+r()+r()-1.5)*2.7;
  const anomaly=realAnomaly?((i%2===0?1:-1)*(10+(i%3)*2)):0;
  const value=base+anomaly+(i>=72?Number(shift)*.24:0);
  out.push({index:i,label:"Hour "+(i+1),value,realAnomaly});
 }
 return out;
}
function median(a){return quantile(a,.5)}
function detectOperations(series,limit){
 return series.map((row,i)=>{
  const recent=series.slice(Math.max(0,i-15),i);
  if(recent.length<10)return {...row,score:0,flagged:false};
  const ref=median(recent.map(x=>x.value));
  const mad=median(recent.map(x=>Math.abs(x.value-ref)));
  const robustSigma=Math.max(1.5,mad*1.4826);
  const score=Math.abs(row.value-ref)/robustSigma;
  return {...row,score,flagged:score>limit};
 });
}
export function runAnomalyStudio(c,raw={}){
 const params={...initial.anomaly,...raw};
 const series=detectOperations(syntheticOperations(c,params.shift),Number(params.sensitivity));
 const positive=series.filter(x=>x.realAnomaly),flags=series.filter(x=>x.flagged);
 const tp=series.filter(x=>x.flagged&&x.realAnomaly).length,fp=flags.length-tp,fn=positive.length-tp;
 const recall=tp/(tp+fn||1),precision=tp/(tp+fp||1);
 const drivers=[
  {label:"Confirmed synthetic events",value:positive.length},
  {label:"Detected injected events",value:tp},
  {label:"Unnecessary alerts",value:fp},
  {label:"Missed injected events",value:fn}
 ];
 const impact=tp*Number(params.incidentCost)*Number(params.efficiency)/100;
 const scenarios=[2,2.7,3.5].map(l=>{
  const rows=detectOperations(syntheticOperations(c,params.shift),l);
  return {name:l===2?"High sensitivity":l===2.7?"Balanced":"Low sensitivity",detail:l.toFixed(1)+" robust deviation",value:rows.filter(x=>x.flagged).length}
 });
 return {
  kind:"anomaly",case:c,params,series,flags,drivers,scenarios,
  chart:{kind:"anomaly",series},secondary:{kind:"anomalyQuality",values:drivers},third:{kind:"bars",title:"Sensitivity comparison",values:scenarios},
  metrics:[
   {label:"SIGNALS FLAGGED",value:formatNum(flags.length),hint:"across 96 simulated observations"},
   {label:"KNOWN EVENTS FOUND",value:(recall*100).toFixed(1)+"%",hint:tp+" of "+positive.length+" injected events"},
   {label:"FALSE ALERTS",value:formatNum(fp),hint:"in synthetic test data"},
   {label:"PRECISION",value:(precision*100).toFixed(1)+"%",hint:"true injected events among alerts"}
  ],
  quality:[{name:"Correctly identified",value:tp+" events"},{name:"False alarms",value:fp+" observations"},{name:"Missed injected events",value:fn+" events"},{name:"Window",value:"Prior 15 observations"}],
  impact:{value:currency(impact),label:"Illustrative avoidable exposure",subtitle:"Known events detected × assumed event cost × assumed response effectiveness",note:"This illustration assumes detected signals result in timely successful action; it is not proven downtime savings or a calibrated production outcome."},
  decision:{headline:flags.length?"Investigate the flagged production signals":"Continue routine monitoring",summary:"The detector compares each observation with a rolling robust baseline. A threshold balances missed events and unnecessary investigation.",
   actions:["Review the "+formatNum(flags.length)+" flagged points and verify whether each is operationally meaningful.","Route confirmed issues to maintenance or quality teams; avoid automatic shutdowns.","Record investigation outcomes to improve detection and response rules."]},
  methodology:"A rolling median and median absolute deviation (MAD) detect unusual readings using preceding observations only. Known injected events permit an illustrative precision/recall check. A sustained load shift may trigger alerts without representing a fault."
 };
}
export function runCase(id,raw={}){
 const c=byId(id);
 if(c.kind==="forecast")return runForecastStudio(c,raw);
 if(c.kind==="classification")return runClassificationStudio(c,raw);
 if(c.kind==="regression")return runRegressionStudio(c,raw);
 return runAnomalyStudio(c,raw);
}
