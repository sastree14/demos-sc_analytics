const ns='http://www.w3.org/2000/svg';
function shape(parent,tag,attrs={},text=''){
  const el=document.createElementNS(ns,tag);
  for(const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
  if(text)el.textContent=text;
  parent.append(el);return el;
}
const words={
 es:['Lotes A','Lotes B','Combinaciones factibles','Óptimo','Comparación proporcional','Agrupar referencias','Volumen mensual (unidades)','Variación de demanda (%)','Grupos','Cada punto es una referencia sintética. Los grupos reúnen perfiles con volumen y variabilidad similares. La cruz marca el centro del grupo.','Centro'],
 ca:['Lots A','Lots B','Combinacions factibles','Òptim','Comparació proporcional','Agrupar referències','Volum mensual (unitats)','Variació de demanda (%)','Grups','Cada punt és una referència sintètica. Els grups reuneixen perfils amb volum i variabilitat semblants. La creu marca el centre del grup.','Centre'],
 en:['Batches A','Batches B','Feasible combinations','Optimum','Proportional baseline','Group stock items','Monthly volume (units)','Demand variation (%)','Groups','Each point is a synthetic stock item. Groups combine items with similar volume and variability. Crosses mark group centres.','Centre']
};
function axes(svg,xMax,yMax,xLabel,yLabel){
  svg.replaceChildren();shape(svg,'title',{},xLabel+' / '+yLabel);
  const x=v=>74+v/(xMax||1)*630,y=v=>242-v/(yMax||1)*180;
  for(let i=0;i<=4;i++){
    const a=Math.round(xMax*i/4),b=Math.round(yMax*i/4);
    shape(svg,'line',{x1:74,x2:704,y1:y(b),y2:y(b),stroke:'#d2ded9'});
    shape(svg,'text',{x:x(a),y:263,'text-anchor':'middle'},String(a));
    shape(svg,'text',{x:62,y:y(b)+4,'text-anchor':'end'},String(b));
  }
  shape(svg,'text',{x:74,y:32},yLabel);shape(svg,'text',{x:390,y:291,'text-anchor':'middle'},xLabel);
  return {x,y};
}
export function allocationPlot(svg,legend,plan,lang){
 const w=words[lang],{x,y}=axes(svg,plan.ordersA,plan.ordersB,w[0],w[1]);
 let strokes='';
 for(const [a,low,high] of plan.columns)strokes+='M'+x(a)+' '+y(low)+'V'+(y(high)-0.6);
 shape(svg,'path',{d:strokes,stroke:'#91c8af','stroke-width':Math.min(7,620/plan.ordersA),fill:'none'});
 const [a,b]=plan.optimum,[ra,rb]=plan.reference;
 shape(svg,'circle',{cx:x(ra),cy:y(rb),r:9,fill:'white',stroke:'#7d548b','stroke-width':3});
 shape(svg,'circle',{cx:x(a),cy:y(b),r:5,fill:'#0b4939'});
 legend.textContent=w[2]+' · '+w[3]+' ● ('+a+', '+b+') · '+w[4]+' ○ ('+ra+', '+rb+')';
}
// Small deterministic catalogue; standardisation gives both features equal weight.
const items=Array.from({length:24},(_,i)=>[12+(i%4)*48+((i*41)%32),12+((i*17)%61)]);
export function groupItems(k){
 const mean=[0,1].map(d=>items.reduce((sum,p)=>sum+p[d],0)/items.length);
 const sd=mean.map((m,d)=>Math.sqrt(items.reduce((sum,p)=>sum+(p[d]-m)**2,0)/items.length));
 let centres=Array.from({length:k},(_,i)=>items[Math.floor(i*items.length/k)]),groups=[];
 for(let iter=0;iter<60;iter++){
  const next=items.map(point=>{
    const distances=centres.map(c=>c.reduce((s,v,d)=>s+((point[d]-v)/sd[d])**2,0));
    return distances.indexOf(Math.min(...distances));
  });
  if(next.every((g,i)=>g===groups[i]))break;
  groups=next;
  centres=centres.map((prev,g)=>{const members=items.filter((_,i)=>groups[i]===g);return members.length?mean.map((_,d)=>members.reduce((s,p)=>s+p[d],0)/members.length):prev;});
 }
 return {centres,groups};
}
export function stockGroups(container,lang){
 const w=words[lang],colors=['#256857','#784c80','#976103','#345d9d'];
 const previous=container.querySelector('select')?.value||'3';
 container.replaceChildren();
 const h=document.createElement('h3');h.textContent=w[5];container.append(h);
 const label=document.createElement('label');label.textContent=w[8]+' ';
 const select=document.createElement('select');for(const k of [2,3,4])select.add(new Option(String(k),String(k)));select.value=previous;label.append(select);container.append(label);
 const svg=shape(container,'svg',{viewBox:'0 0 760 300',role:'img',width:'100%'});
 const info=document.createElement('p');container.append(info);
 function draw(){
  const {x,y}=axes(svg,200,80,w[6],w[7]);
  const {groups,centres}=groupItems(Number(select.value));
  items.forEach(([volume,variation],i)=>{
   const dot=shape(svg,'circle',{cx:x(volume),cy:y(variation),r:6,fill:colors[groups[i]]});
   shape(dot,'title',{},'SKU '+(i+1)+' · '+volume+' / '+variation+'%');
  });
  centres.forEach(([a,b],i)=>shape(svg,'text',{x:x(a),y:y(b)+4,'text-anchor':'middle',fill:colors[i],stroke:'white','stroke-width':0.5,'font-size':22},'✚'));
  info.textContent=w[9]+' '+groups.reduce((s,g)=>(s[g]++,s),centres.map(()=>0)).map((v,i)=>'G'+(i+1)+': '+v+' SKU').join(' · ');
 }
 select.onchange=draw;draw();
}
