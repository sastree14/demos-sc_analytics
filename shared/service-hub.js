import {capabilities} from '../industry-lab/capabilities.js';
import {chooseLanguage} from '../industry-lab/language.js';
const copy = {
 es:['Demostraciones por servicio','Elige qué quieres prever, optimizar o simular. Puedes cambiar los supuestos y comparar los resultados con datos ilustrativos.','Explora por servicio','7 servicios · 32 casos','Abrir demo','Prefiero explorar por sector','Comentar mi caso con SC-Analytics','Ver servicios y trabajos de SC-Analytics'],
 ca:['Demostracions per servei','Tria què vols preveure, optimitzar o simular. Pots canviar els supòsits i comparar els resultats amb dades il·lustratives.','Explora per servei','7 serveis · 32 casos','Obrir demo','Prefereixo explorar per sector','Comentar el meu cas amb SC-Analytics','Veure serveis i projectes de SC-Analytics'],
 en:['Demonstrations by service','Choose what to forecast, optimise or simulate. Change assumptions and compare results using illustrative data.','Explore by service','7 services · 32 cases','Open demo','Explore by industry','Discuss my case with SC-Analytics','Explore SC-Analytics services and projects']
};
function render(lang){
 const [title,intro,heading,count,open,sectors,contact,website]=copy[lang];
 const q=s=>document.querySelector(s);
 const i={es:1,ca:2,en:3}[lang];
 document.documentElement.lang=lang;
 document.title=title+' · SC-Analytics';
 q('#service-language').value=lang;
 q('h1').textContent=title;q('.lead').textContent=intro;
 const company=document.createElement('a');company.href='https://www.sc-analytics.io/services';company.textContent=website;
 q('.lead + .lead').replaceChildren(company);
 q('.rule span').textContent=heading;q('.rule span:last-child').textContent=count;
 for(const card of document.querySelectorAll('.grid a')){
  const family=capabilities.find(row=>card.getAttribute('href')==='./'+row[0]+'/');
  card.querySelector('h2').textContent=family[i];card.querySelector('p').textContent=family[i+3];card.querySelector('.num').hidden=true;
  card.querySelector('.bottom span').textContent=open;
 }
 q('#sector-hub').textContent=sectors+' ↗';q('#service-contact').textContent=contact+' ↗';
 q('.footer span').textContent='© SC-Analytics';q('.footer a').textContent='SC-Analytics ↗';
}
const initial=navigator.language.startsWith('ca')?'ca':navigator.language.startsWith('es')?'es':'en';
render(initial);chooseLanguage(initial,render);
document.querySelector('#service-language').addEventListener('change',event=>render(event.target.value));
