// A common scale preserves sign and makes the three calculated plans comparable.
import {MODELS,calculate,metricLabel} from './models.js';
const names=['A','B','C'];
export function scenarioBoard(host,model,params,lang,format,saved,metricIndex,onMetric){
 const words=(es,ca,en)=>({es,ca,en})[lang];
 const controls=MODELS[model].inputs;
 const driver=controls.find(c=>c.key===({forecast:'trend',subcontract:'externalCap',routeMargin:'empty',backhaul:'loaded'}[model]))||controls[0];
 const nominal=params[driver.key], step=driver.step;
 const shift=Math.max(step,Math.round((driver.max-driver.min)*.12/step)*step);
 const variation=direction=>Math.max(driver.min,Math.min(driver.max,nominal+direction*shift));
 const plans=[params,{...params,[driver.key]:variation(-1)},{...params,[driver.key]:variation(1)}].map((v,i)=>{
  const custom=saved[names[i]];
  return {params:custom?.values||v,result:calculate(model,custom?.values||v),saved:!!custom};
 });
 const k=Math.min(metricIndex,plans[0].result.metrics.length-1);
 const metrics=plans.map(p=>p.result.metrics[k]);
 const lo=Math.min(0,...metrics.map(m=>m.value)),hi=Math.max(0,...metrics.map(m=>m.value)),span=hi-lo||1;
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 host.replaceChildren();
 const header=el('div','board-head');header.append(el('h3','',words('Simula tres escenarios','Simula tres escenaris','Simulate three scenarios')));
 const selector=el('select','');selector.setAttribute('aria-label',words('Indicador que se compara','Indicador que es compara','Metric to compare'));
 plans[0].result.metrics.forEach((m,i)=>selector.add(new Option(metricLabel(m.key,lang),i)));selector.value=k;
 selector.onchange=()=>onMetric(Number(selector.value));header.append(selector);host.append(header);
 const note=el('p','board-note',words('A es la referencia. B y C cambian un supuesto. Puedes guardar tus propios planes debajo.','A és la referència. B i C canvien un supòsit. Pots desar els teus plans a sota.','A is the reference. B and C vary one assumption. Save your own plans below.'));host.append(note);
 plans.forEach((p,i)=>{
  const m=metrics[i],row=el('div','plan-row plan-'+i),diff=m.value-metrics[0].value;
  const changed=controls.filter(c=>p.params[c.key]!==plans[0].params[c.key]);
  const summary=(i&&changed.length?changed:[driver]).map(c=>c.label[lang]+' · '+format(p.params[c.key],c.unit)).join(' / ');
  row.append(el('b','plan-key',names[i]),el('span','plan-input',summary));
  const track=el('div','plan-track'),bar=el('span','plan-fill');
  bar.style.left=(Math.min(0,m.value)-lo)/span*100+'%';bar.style.width=Math.abs(m.value)/span*100+'%';track.append(bar);
  const zero=el('i','plan-zero');zero.style.left=(-lo/span*100)+'%';track.append(zero);row.append(track);
  const value=el('strong','plan-value',format(m.value,m.unit));
  const delta=(diff>0?'+':'')+(m.unit==='pct'?format(diff,'number')+' pp':format(diff,m.unit));
  value.append(el('small','',i?delta+' vs A':words('Referencia','Referència','Reference')));row.append(value);host.append(row);
 });
}
