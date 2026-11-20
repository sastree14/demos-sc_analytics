// Deterministic, browser-side analytical models. All input records are synthetic.
// No model endpoint, AI API, customer systems, or fabricated performance claims.
export const segments = {
  distribution: { label: "Distribution", base: 1470, trend: 9.2, amplitude: .18, seed: 21, unit: "orders" },
  retail: { label: "Multi-site retail", base: 2180, trend: 13.5, amplitude: .28, seed: 67, unit: "units" },
  manufacturing: { label: "Manufacturing", base: 870, trend: 5.7, amplitude: .11, seed: 113, unit: "units" }
};
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const avg = xs => xs.reduce((s, x) => s + x, 0) / (xs.length || 1);
const sum = xs => xs.reduce((s, x) => s + x, 0);
const round = x => Math.round(x);
const nextMonth = (month, offset) => new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + offset, 1));
const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 };
export const monthText = month => month.toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });
export function historicalSeries(segment = "distribution") {
  const c = segments[segment] || segments.distribution;
  const random = rng(c.seed);
  const start = new Date(Date.UTC(2023, 4, 1));
  return Array.from({ length: 42 }, (_, i) => {
    const month = nextMonth(start, i), m = month.getUTCMonth();
    const season = c.amplitude * Math.cos(2 * Math.PI * (m - 10) / 12)
      + c.amplitude * .31 * Math.cos(4 * Math.PI * (m - 10) / 12);
    const noise = (random() + random() + random() - 1.5) * c.base * .066;
    const variation = (i > 26 && i < 31 ? -c.base * .07 : 0);
    return { month, value: Math.max(50, round(c.base + c.trend * i + c.base * season + noise + variation)) };
  });
}
function regression(rows) {
  const n = rows.length, xMean = (n - 1) / 2, yMean = avg(rows.map(x => x.value));
  const den = sum(rows.map((_, i) => (i - xMean) ** 2)) || 1;
  const slope = sum(rows.map((x, i) => (i - xMean) * (x.value - yMean))) / den;
  return { slope, intercept: yMean - slope * xMean };
}
function seasonalPrediction(training, horizon) {
  const n = training.length, observed = training.map(r => r.value), result = [];
  for (let i = 0; i < horizon; i++) {
    const lagIndex = n + i - 12;
    const lagged = lagIndex < n ? observed[lagIndex] : result[lagIndex - n];
    result.push(round(Math.max(1, lagged)));
  }
  return result;
}
function trendSeasonalPrediction(training, horizon) {
  const n = training.length, model = regression(training);
  const residuals = Array.from({ length: 12 }, () => []);
  training.forEach((r, i) => residuals[r.month.getUTCMonth()].push(r.value - model.intercept - i * model.slope));
  const means = residuals.map(v => v.length ? avg(v) : 0);
  const overall = avg(means);
  return Array.from({length:horizon},(_,i)=>{
    const m=nextMonth(training[n-1].month,i+1).getUTCMonth();
    return round(Math.max(1,model.intercept+(n+i)*model.slope+(means[m]-overall)*.88));
  });
}
export const models = {
  ensemble: {label:"Weighted ensemble",short:"Blends seasonal and trend forecasts"},
  seasonalTrend: {label:"Seasonal + trend",short:"Linear trend with month-specific effects"},
  seasonal: {label:"Seasonal baseline",short:"Repeats the same months from last year"}
};
function forecast(training, horizon, method) {
  if (method === "seasonal") return seasonalPrediction(training,horizon);
  if (method === "seasonalTrend") return trendSeasonalPrediction(training,horizon);
  const seasonal = seasonalPrediction(training,horizon), trend = trendSeasonalPrediction(training,horizon);
  return trend.map((v,i)=>round(v*.72+seasonal[i]*.28));
}
function metrics(actual, predicted) {
  const errors=predicted.map((v,i)=>v-actual[i]);
  const abs=errors.map(Math.abs);
  const wape=100*sum(abs)/Math.max(1,sum(actual));
  const mae=avg(abs);
  const bias=100*sum(errors)/Math.max(1,sum(actual));
  return {wape,mae,bias,accuracy:clamp(100-wape,0,100),errors,abs};
}
function percentile(sorted,p){
  if(!sorted.length)return 0;
  const i=clamp((sorted.length-1)*p,0,sorted.length-1);
  const lo=Math.floor(i),hi=Math.ceil(i);
  return sorted[lo]+(sorted[hi]-sorted[lo])*(i-lo);
}
export function runForecast({segment="distribution",horizon=6,method="ensemble",growth=0,volatility=0}={}) {
  const series=historicalSeries(segment),cutoff=series.length-8;
  const train=series.slice(0,cutoff),observed=series.slice(cutoff).map(r=>r.value);
  const comparisons=Object.keys(models).map(key=>{
    const prediction=forecast(train,8,key);
    return {key,...metrics(observed,prediction)};
  });
  const chosen=comparisons.find(x=>x.key===method)||comparisons[0];
  const baseline=comparisons.find(x=>x.key==="seasonal");
  const base=forecast(series,horizon,method),dates=Array.from({length:horizon},(_,i)=>nextMonth(series.at(-1).month,i+1));
  const abs=chosen.abs.slice().sort((a,b)=>a-b);
  const scale=Math.max(percentile(abs,.78),chosen.mae*.8);
  const future=base.map((value,i)=>{
    const factor=1+growth/100*((i+1)/horizon);
    const adjusted=round(Math.max(0,value*factor));
    const width=Math.max(value*.055,scale*(.78+.08*i))*(1+volatility/100);
    return {month:dates[i],baseline:value,value:adjusted,low:round(Math.max(0,adjusted-width)),high:round(adjusted+width)};
  });
  const allBase=sum(future.map(x=>x.baseline)),total=sum(future.map(x=>x.value));
  const backtest=series.slice(cutoff).map((row,i)=>({month:row.month,actual:row.value,predicted:forecast(train,8,method)[i]}));
  return {
    series,future,backtest,chosen,baseline,comparisons,segment,horizon,method,growth,volatility,
    total,allBase,impact:total-allBase,accuracy:chosen.accuracy,
    referenceYear:series.at(-1).month.getUTCFullYear(),
    intervalNote:"Indicative range based on historical holdout errors; not a calibrated guarantee."
  };
}
const sigmoid=x=>1/(1+Math.exp(-clamp(x,-30,30)));
const riskFeatures = ({backlog, distance, reliability,priority}) =>
  [1,(backlog-45)/35,(distance-450)/400,(90-reliability)/12,priority?1:0];
function trainingCases(){
  const random=rng(5537);
  return Array.from({length:480},()=>{
    const backlog=round(10+random()*95),distance=round(30+random()*1100);
    const reliability=round(70+random()*29),priority=random()>.67;
    const input={backlog,distance,reliability,priority},x=riskFeatures(input);
    const p=sigmoid(-1.30+1.40*x[1]+1.00*x[2]+1.75*x[3]+.65*x[4]);
    const delayed=random()<p?1:0;
    return {input,x,delayed};
  });
}
function fitLogistic(rows){
  const w=new Array(5).fill(0);
  for(let pass=0;pass<680;pass++){
    const grad=new Array(w.length).fill(0);
    for(const r of rows){
      const err=sigmoid(sum(w.map((v,i)=>v*r.x[i])))-r.delayed;
      for(let i=0;i<w.length;i++)grad[i]+=err*r.x[i];
    }
    for(let i=0;i<w.length;i++)w[i]-=.26*(grad[i]/rows.length+(i===0?0:.003*w[i]));
  }
  return w;
}
export function runRisk(input={backlog:62,distance:600,reliability:88,priority:false}){
  const rows=trainingCases(),train=rows.slice(0,380),test=rows.slice(380),weights=fitLogistic(train);
  let tp=0,tn=0,fp=0,fn=0;
  for(const row of test){
    const prob=sigmoid(sum(weights.map((v,i)=>v*row.x[i]))),pred=prob>=.5;
    if(pred&&row.delayed)tp++;else if(pred&&!row.delayed)fp++;else if(!pred&&row.delayed)fn++;else tn++;
  }
  const x=riskFeatures(input);
  const probability=sigmoid(sum(weights.map((v,i)=>v*x[i])));
  const precision=tp/(tp+fp||1),recall=tp/(tp+fn||1);
  return {input,probability,band:probability>=.65?"High":probability>=.35?"Elevated":"Low",validation:{size:test.length,accuracy:(tp+tn)/test.length,precision,recall,f1:2*precision*recall/(precision+recall||1),tp,tn,fp,fn},samples:rows.length,method:"Logistic regression",data:"Synthetic order and carrier records"};
}
