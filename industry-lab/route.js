// Exhaustive search over six stops. The objective is maximum stops, then minimum km.
const stops=[[12,49],[23,19],[40,12],[55,34],[70,14],[82,42],[53,62]];
const boxes=[0,3,2,4,2,3,2];
export function solveRoute(cap,minutes,service){
 let best={path:[0],km:0,minutes:0,load:0};
 const d=(a,b)=>Math.hypot(stops[a][0]-stops[b][0],stops[a][1]-stops[b][1])*.24;
 function visit(path,km,load){
  const last=path.at(-1),total=km+d(last,0),duration=total*2+(path.length-1)*service;
  if(duration>minutes)return;
  if(path.length>best.path.length||(path.length===best.path.length&&total<best.km))best={path:[...path],km:total,minutes:duration,load};
  for(let i=1;i<stops.length;i++)if(!path.includes(i)&&load+boxes[i]<=cap)visit([...path,i],km+d(last,i),load+boxes[i]);
 }
 visit([0],0,0);return best;
}
export function routeStudio(host,lang){
 const t=(es,ca,en)=>({es,ca,en})[lang];let run=0;
 host.innerHTML='<h2></h2><p></p><div class="route-inputs"></div><button type="button" class="button-primary"></button><div class="route-progress" role="status"></div><div class="route-plans"></div><svg viewBox="0 0 100 76" role="img"></svg><strong class="route-result"></strong><p class="route-detail"></p><p class="route-method"></p>';
 host.querySelector('h2').textContent=t('Optimización de rutas bajo restricciones','Optimització de rutes amb restriccions','Route optimisation under constraints');
 host.querySelector('p').textContent=t('¿Qué entregas caben en un turno si el vehículo tiene que volver al depósito?','Quins lliuraments caben en un torn si el vehicle ha de tornar al dipòsit?','Which deliveries fit in a shift if the vehicle must return to the depot?');
 const controls=[[t('Capacidad · cajas','Capacitat · caixes','Capacity · boxes'),4,16,12],[t('Turno · minutos','Torn · minuts','Shift · minutes'),40,200,130],[t('Descarga · min/parada','Descàrrega · min/parada','Unloading · min/stop'),3,20,8]];
 const button=host.querySelector('button'),status=host.querySelector('[role=status]');
 const inputs=controls.map(([label,min,max,val])=>{
  const wrap=document.createElement('label'),output=document.createElement('b'),input=document.createElement('input');input.type='range';Object.assign(input,{min,max,value:val});output.textContent=val;wrap.append(label,' ',output,input);host.querySelector('.route-inputs').append(wrap);
  input.oninput=()=>{output.textContent=input.value;run++;button.disabled=false;status.textContent=t('Restricciones modificadas. Vuelve a optimizar.','Restriccions modificades. Torna a optimitzar.','Constraints changed. Optimise again.');};return input;
 });
 const paint=(r,base,index,cap)=>{
  const svg=host.querySelector('svg'),line=[...r.path,0].map(i=>stops[i].join(',')).join(' ');
  svg.innerHTML='<defs><pattern id="street-grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="#dbe9ed" stroke-width=".45"/></pattern></defs><rect width="100" height="76" fill="url(#street-grid)"/><polyline points="'+line+'" fill="none" stroke="'+['#157595','#7956ab','#b25d26'][index]+'" stroke-width="1.25"/>';
  stops.forEach(([x,y],i)=>{svg.innerHTML+='<circle cx="'+x+'" cy="'+y+'" r="3.4" fill="'+(r.path.includes(i)?'#145870':'#829397')+'"/><text x="'+x+'" y="'+(y+1.2)+'" text-anchor="middle" font-size="3.7" fill="white">'+(i||'D')+'</text>';});
  const sequence=[...r.path,0].map(i=>i||'D').join(' → ');
  host.querySelector('.route-result').textContent=sequence+' · '+(r.path.length-1)+'/6 '+t('paradas','parades','stops')+' · '+r.km.toFixed(1)+' km · '+Math.ceil(r.minutes)+' min · '+r.load+' '+t('cajas','caixes','boxes');
  const unserved=stops.map((_,i)=>i).filter(i=>i&&!r.path.includes(i));
  const detail=host.querySelector('.route-detail');
  const delta=r.path.length-base.path.length;
  detail.textContent=t('Capacidad ensayada','Capacitat provada','Tested capacity')+' · '+cap+' '+t('cajas','caixes','boxes')+'  |  '+t('Paradas frente a A','Parades respecte d’A','Stops versus A')+' · '+(delta>0?'+':'')+delta+'  |  '+t('Fuera del plan','Fora del pla','Outside the plan')+' · '+(unserved.join(', ')||'—');
  svg.setAttribute('aria-label',sequence);
 };
 const solve=()=>{
  const [cap,minutes,service]=inputs.map(i=>Number(i.value)),caps=[cap,Math.max(1,cap-3),cap+3];
  return caps.map(capacity=>({cap:capacity,route:solveRoute(capacity,minutes,service)}));
 };
 const show=plans=>{
  const nav=host.querySelector('.route-plans');nav.replaceChildren();
  const select=index=>{paint(plans[index].route,plans[0].route,index,plans[index].cap);[...nav.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));};
  plans.forEach(({cap},index)=>{const b=document.createElement('button');b.type='button';b.textContent='ABC'[index]+' · '+cap+' '+t('cajas','caixes','boxes');b.onclick=()=>select(index);nav.append(b);});select(0);
 };
 show(solve());
 button.textContent=t('Optimizar ruta','Optimitzar ruta','Optimise route');
 host.querySelector('.route-method').textContent=t('Seis paradas sintéticas. Se maximizan las entregas y, en caso de empate, se minimizan los kilómetros. Distancias en línea recta y velocidad supuesta de 30 km/h.','Sis parades sintètiques. Es maximitzen els lliuraments i, en cas d’empat, es minimitzen els quilòmetres. Distàncies en línia recta i velocitat suposada de 30 km/h.','Six illustrative stops. Maximise deliveries, then minimise kilometres. Straight-line distances and an assumed speed of 30 km/h.');
 button.onclick=async()=>{const id=++run;button.disabled=true;
 const stages=[t('Revisar carga y turno','Revisar càrrega i torn','Review load and shift'),t('Evaluar secuencias con regreso al depósito','Avaluar seqüències amb retorn al dipòsit','Evaluate sequences with return to depot'),t('Comparar distancia de las rutas factibles','Comparar distàncies de les rutes factibles','Compare feasible route lengths')];
 const result=solve();for(const stage of stages){if(id!==run||!button.isConnected)return;status.textContent=stage;await new Promise(done=>setTimeout(done,matchMedia('(prefers-reduced-motion: reduce)').matches?0:1500));}
 if(id!==run||!button.isConnected)return;show(result);button.disabled=false;status.textContent=t('Ruta recalculada','Ruta recalculada','Route recalculated');};
}
