import {chooseLanguage} from "./language.js";
const labels = {
 es:{skip:"Saltar al contenido",allDemos:"Todas las demos",website:"Web oficial",heroTitle:"Empieza por el problema. Descubre cómo tomar mejores decisiones.",heroLead:"Explora situaciones empresariales ilustrativas y demostraciones técnicas. Los sistemas reales se diseñan a medida de los datos, procesos y restricciones de cada organización.",explore:"Explorar experiencias",tour:"¿Cómo navegar?",synthetic:"Los datos son sintéticos y no representan resultados obtenidos para clientes.",discoverEyebrow:"ENCUENTRA TU PUNTO DE PARTIDA",discoverTitle:"¿Qué te gustaría explorar?",industryTab:"Por industria",capabilityTab:"Por capacidad",industriesIntro:"Explora 18 industrias, cada una con 16 herramientas de decisión. Son ejemplos cuantitativos para experimentar, no soluciones validadas con datos de clientes.",capabilitiesIntro:"Siete familias de capacidades técnicas con demostraciones públicas e interactivas.",pilotEyebrow:"SC01 / PRIMERA EXPERIENCIA SECTORIAL",pilotTitle:"Logística y transporte: del plan al escenario.",pilotCopy:"Explora 16 retos logísticos con variables ajustables, escenarios A, B y C, resultados calculados y explicaciones transparentes. Los motores son ilustrativos, no un plan operativo real.",pilotExisting:"Explorar las 16 herramientas logísticas",pilotContact:"Comentar un problema logístico",ctaTitle:"¿Y si las restricciones fueran las de tu organización?",ctaCopy:"Estas demostraciones son ejemplos. En SC-Analytics diseñamos modelos, algoritmos y aplicaciones adaptados a los sistemas y decisiones de cada empresa. También nos interesa intercambiar perspectivas con profesionales de distintos sectores.",ctaButton:"Conversemos sobre tu caso",ctaLinkedIn:"Seguir el trabajo en LinkedIn",footer:"Experiencias ilustrativas; soluciones a medida.",backDemos:"Volver a las demos",pilotStatus:"6 escenarios simulados",upcoming:"6 escenarios simulados",related:"Explorar esta industria",industryAvailable:"6 escenarios simulados",industryExplore:"Explorar esta industria",suggest:"Sugerir un problema",open:"Abrir demo",tourBack:"Anterior",tourNext:"Continuar",tourFinish:"Empezar a explorar",tourSkip:"Saltar guía"},
 ca:{skip:"Saltar al contingut",allDemos:"Totes les demos",website:"Web oficial",heroTitle:"Comença pel problema. Descobreix com prendre millors decisions.",heroLead:"Explora situacions empresarials il·lustratives i demostracions tècniques. Els sistemes reals es dissenyen a mida de les dades, els processos i les restriccions de cada organització.",explore:"Explorar experiències",tour:"Com navegar?",synthetic:"Les dades són sintètiques i no representen resultats aconseguits per a clients.",discoverEyebrow:"TROBA EL TEU PUNT DE PARTIDA",discoverTitle:"Què t'agradaria explorar?",industryTab:"Per indústria",capabilityTab:"Per capacitat",industriesIntro:"Explora 18 indústries, cadascuna amb 16 eines de decisió. Són exemples quantitatius per experimentar, no solucions validades amb dades de clients.",capabilitiesIntro:"Set famílies de capacitats tècniques amb demostracions públiques i interactives.",pilotEyebrow:"SC01 / PRIMERA EXPERIÈNCIA SECTORIAL",pilotTitle:"Logística i transport: del pla a l'escenari.",pilotCopy:"Explora 16 reptes logístics amb variables ajustables, escenaris A, B i C, resultats calculats i explicacions transparents. Els models són il·lustratius.",pilotExisting:"Explorar les 16 eines logístiques",pilotContact:"Comentar un problema logístic",ctaTitle:"I si les restriccions fossin les de la teva organització?",ctaCopy:"Aquestes demostracions són exemples. A SC-Analytics dissenyem models, algoritmes i aplicacions adaptats als sistemes i decisions de cada empresa. També ens interessa intercanviar punts de vista amb professionals de diferents sectors.",ctaButton:"Parlem del teu cas",ctaLinkedIn:"Seguir la feina a LinkedIn",footer:"Experiències il·lustratives; solucions a mida.",backDemos:"Tornar a les demos",pilotStatus:"6 escenaris simulats",upcoming:"6 escenaris simulats",related:"Explorar aquesta indústria",industryAvailable:"6 escenaris simulats",industryExplore:"Explorar aquesta indústria",suggest:"Suggerir un problema",open:"Obrir demo",tourBack:"Anterior",tourNext:"Continuar",tourFinish:"Començar a explorar",tourSkip:"Saltar la guia"},
 en:{skip:"Skip to content",allDemos:"All demos",website:"Official website",heroTitle:"Start with the problem. Explore better decisions.",heroLead:"Explore illustrative business situations and technical demonstrations. Real systems are built around each organization's data, processes and constraints.",explore:"Explore experiences",tour:"How to navigate",synthetic:"All data is synthetic, not verified client outcomes.",discoverEyebrow:"CHOOSE WHERE TO START",discoverTitle:"What would you like to explore?",industryTab:"By industry",capabilityTab:"By capability",industriesIntro:"Explore 18 industries, each with 16 interactive decision tools. These are interactive quantitative examples, not validated client systems.",capabilitiesIntro:"Seven technical capability families with public interactive demos.",pilotEyebrow:"SC01 / FIRST INDUSTRY EXPERIENCE",pilotTitle:"Logistics and transport: from plan to scenario.",pilotCopy:"Explore 16 logistics tools with adjustable inputs, A, B and C scenarios, modelled outcomes and transparent explanations. The engines are illustrative, not deployable business plans.",pilotExisting:"Explore 16 logistics tools",pilotContact:"Discuss a logistics problem",ctaTitle:"What if these constraints were your organization's?",ctaCopy:"These demonstrations are examples. SC-Analytics designs models, algorithms and applications tailored to the systems and decisions of each organization. We also welcome technical conversations with professionals in any industry.",ctaButton:"Discuss your situation",ctaLinkedIn:"Follow us on LinkedIn",footer:"Illustrative experiences; tailored business solutions.",backDemos:"Back to demos",pilotStatus:"6 simulated scenarios",upcoming:"6 simulated scenarios",related:"Explore this industry",industryAvailable:"6 simulated scenarios",industryExplore:"Explore this industry",suggest:"Suggest a problem",open:"Open demo",tourBack:"Previous",tourNext:"Continue",tourFinish:"Start exploring",tourSkip:"Skip guide"}
};
const industries=[
["SC01","Logística y transporte","Logística i transport","Logistics & transport","Rutas, asignación, puntualidad y margen","Rutes, assignació, puntualitat i marge","Routing, capacity, delivery performance and margin"],
["SC02","Distribución mayorista","Distribució majorista","Wholesale distribution","Stock, reposición y capital","Estoc, reposició i capital","Stock, replenishment and working capital"],
["SC03","Industria manufacturera","Indústria manufacturera","Manufacturing","Producción, cuellos de botella y recursos","Producció, colls d'ampolla i recursos","Production, bottlenecks and resources"],
["SC04","Alimentación y bebidas","Alimentació i begudes","Food & beverage","Demanda, caducidad y merma","Demanda, caducitat i minva","Demand, shelf life and waste"],
["SC05","Farmacéutico y químico","Farmacèutic i químic","Pharma & chemicals","Lotes, rendimiento y trazabilidad","Lots, rendiment i traçabilitat","Batches, yield and traceability"],
["SC06","Restauración organizada","Restauració organitzada","Restaurant groups","Turnos, ingredientes y servicio","Torns, ingredients i servei","Staffing, ingredients and service"],
["SC07","Hoteles y alojamientos","Hotels i allotjaments","Hotels & accommodation","Ocupación, ingresos y personal","Ocupació, ingressos i personal","Occupancy, revenue and staffing"],
["SC08","Retail y e-commerce","Retail i comerç electrònic","Retail & e-commerce","Promociones, margen y devoluciones","Promocions, marge i devolucions","Promotions, margins and returns"],
["SC09","Clínicas y centros sanitarios","Clíniques i centres sanitaris","Healthcare clinics","Agendas y capacidad","Agendes i capacitat","Scheduling and capacity"],
["SC10","Construcción e instalaciones","Construcció i instal·lacions","Construction & installation","Coste, planificación y materiales","Cost, planificació i materials","Costs, schedules and materials"],
["SC11","Inmobiliario y gestión de activos","Immobiliari i gestió d'actius","Real estate & asset management","Ocupación, caja y mantenimiento","Ocupació, caixa i manteniment","Occupancy, cash flow and maintenance"],
["SC12","Finanzas y seguros","Finances i assegurances","Finance & insurance","Riesgo, alertas y siniestros","Risc, alertes i sinistres","Risk, alerts and claims"],
["SC13","Consultorías y servicios profesionales","Consultories i serveis professionals","Consulting & professional services","Proyectos, capacidad y rentabilidad","Projectes, capacitat i rendibilitat","Projects, capacity and profitability"],
["SC14","Servicios y mantenimiento","Serveis i manteniment","Field service & maintenance","Técnicos, SLA y repuestos","Tècnics, SLA i recanvis","Technicians, SLAs and spare parts"],
["SC15","Tecnología, software y SaaS","Tecnologia, software i SaaS","Technology, software & SaaS","Retención, activación e IA","Retenció, activació i IA","Retention, activation and AI"],
["SC16","Educación y formación","Educació i formació","Education & training","Abandono, horarios y recursos","Abandonament, horaris i recursos","Retention, schedules and resources"],
["SC17","Energía y servicios industriales","Energia i serveis industrials","Energy & industrial services","Picos, consumo y equipos","Pics, consum i equips","Peaks, energy usage and equipment"],
["SC18","Turismo, ocio y eventos","Turisme, oci i esdeveniments","Tourism, leisure & events","Aforo, demanda y precios","Aforament, demanda i preus","Attendance, demand and pricing"]
];
import {capabilities} from "./capabilities.js";
const tourContent={
 es:[["Elige tu idioma","Puedes cambiar el idioma en cualquier momento. Este catálogo está traducido; la traducción completa de los cálculos y reportes existentes forma parte del siguiente desarrollo."],["Elige un sector o una capacidad","En el catálogo sectorial verás 18 industrias; podrás explorar 16 herramientas por industria."],["Experimenta con un caso realista","En las demos técnicas puedes modificar condiciones y ejecutar cálculos con datos sintéticos. Las 18 experiencias sectoriales incluyen 16 herramientas cada una."],["Conversemos cuando te resulte útil","Si un escenario te interesa, puedes comentar tu caso o visitar nuestras páginas. No necesitas dejar tus datos para explorar."]],
 ca:[["Tria l'idioma","Pots canviar l'idioma sempre que vulguis. Aquest catàleg ja està traduït; la traducció completa dels càlculs i informes és una fase posterior."],["Tria un sector o una capacitat","Hi ha 18 indústries; podràs explorar 16 eines per indústria."],["Experimenta amb un cas realista","A les demos tècniques pots canviar condicions i executar càlculs amb dades sintètiques. Les 18 experiències sectorials inclouen 16 eines cadascuna."],["Parlem quan et sigui útil","Si un escenari t'interessa, pots comentar el teu cas o visitar les nostres pàgines sense donar dades per explorar."]],
 en:[["Choose your language","You can change languages at any time. This catalog is translated; full translation of calculations and reports in the existing demos is a later development phase."],["Choose an industry or capability","The catalog features 18 industries, with 16 interactive tools per industry alongside the existing technical demos."],["Explore a realistic scenario","Existing technical demos let you adjust assumptions and run calculations on synthetic data. Each of the 18 industries now has 16 illustrative interactive tools."],["Discuss an idea when ready","If a scenario looks relevant, you can contact us or explore our website. No sign-up is required."]]
};
let lang=(navigator.language||"").toLowerCase().startsWith("ca")?"ca":(navigator.language||"").toLowerCase().startsWith("en")?"en":"es";
let step=0;
const byId=(id)=>document.getElementById(id);
function tr(key){return (labels[lang]&&labels[lang][key])||labels.es[key]||key;}
function cardTitle(entry){return entry[lang==="ca"?2:lang==="en"?3:1];}
function cardDesc(entry){return entry[lang==="ca"?5:lang==="en"?6:4];}
function applyLanguage(next){
 lang=next;document.documentElement.lang=next;
 document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=tr(node.dataset.i18n));
 document.querySelectorAll("[data-lang]").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.lang===lang)));
 renderIndustries();renderCapabilities();renderTour();
 const pilot=byId("logistics-pilot").querySelector("a.primary");
 pilot.href=sectorLink("SC01");
 if(onPublicPages && !publicSectors.has("SC01"))pilot.textContent=requestLabel[lang];
 try{sessionStorage.setItem("scLabLocale",lang);}catch(_){}
}
const onPublicPages=location.hostname==="sastree14.github.io" || !new URLSearchParams(location.search).has("review");
let publicSectors=new Set(Array.from({length:18},(_,i)=>"SC"+String(i+1).padStart(2,"0")));
const requestLabel={es:"Solicitar una demostración",ca:"Demanar una demostració",en:"Request a walkthrough"};
const upcoming={es:"Presentación previa bajo solicitud",ca:"Presentació prèvia a petició",en:"Preview on request"};
function sectorLink(code){
 const available=!onPublicPages || publicSectors.has(code);
 return available ? "./"+code.toLowerCase()+"/?lang="+lang : "https://www.sc-analytics.io/contact?intent=problem&sector="+code;
}
function renderIndustries(){
 const grid=byId("industry-grid");grid.replaceChildren();
 industries.forEach(item=>{
  const code=item[0],pilot=code==="SC01";
  const card=document.createElement("article");card.className="industry-card";
  const codeEl=document.createElement("span");codeEl.className="code";codeEl.style.display="flex";codeEl.style.alignItems="center";codeEl.style.gap="13px";
  const n=Number(code.slice(2))-1, tone=["#537d8c","#7386a3","#9a7256","#718a56","#6a80a6","#b07871","#b19162","#987caf","#5d8991","#9d815e","#719384","#637eaa","#8176aa","#7b967e","#687db3","#a18065","#558e8a","#a67b96"][n], paths=["<rect x=\"5\" y=\"12\" width=\"29\" height=\"22\" rx=\"3\"/><path d=\"M34 20h11l8 9v5H34Z\"/><circle cx=\"16\" cy=\"37\" r=\"5\"/><circle cx=\"44\" cy=\"37\" r=\"5\"/>","<path d=\"m7 16 21-10 21 10v27L28 53 7 43Z\"/><path d=\"m7 16 21 10 21-10M28 26v27M17 11l22 11\"/>","<path d=\"M7 48V25l14-9v9l15-9v9h15v23Z\"/><path d=\"M40 25V8h8v17M16 34v5m12-5v5m12-5v5\"/>","<rect x=\"12\" y=\"12\" width=\"28\" height=\"36\" rx=\"5\"/><path d=\"M12 20h28M12 40h28M47 7v39M44 7v13m6-13v13\"/>","<path d=\"M20 7h16M24 7v19L12 45a4 4 0 0 0 4 5h24a4 4 0 0 0 4-5L32 26V7M18 36h20\"/><circle cx=\"27\" cy=\"41\" r=\"2\"/>","<circle cx=\"29\" cy=\"29\" r=\"16\"/><circle cx=\"29\" cy=\"29\" r=\"10\"/><path d=\"M6 9v17m-4-17v11h8V9M6 26v24M51 9v41m0-41c-7 5-8 17 0 20\"/>","<rect x=\"9\" y=\"7\" width=\"40\" height=\"44\" rx=\"4\"/><path d=\"M20 51V40h16v11M17 16h5m12 0h5m-22 11h5m12 0h5\"/>","<path d=\"M12 19h32l4 30H8Z\"/><path d=\"M20 21v-8a8 8 0 0 1 16 0v8\"/>","<rect x=\"7\" y=\"12\" width=\"42\" height=\"37\" rx=\"6\"/><path d=\"M22 20h12v7h7v11h-7v7H22v-7h-7V27h7Z\"/>","<path d=\"M8 49h44M14 49V9h28M14 13h34l-8-8M32 13v18m-5 0h10m-22-8 9 9-9 9\"/>","<path d=\"M7 28 28 9l21 19M12 25v25h32V25M22 50V35h12v15\"/>","<rect x=\"6\" y=\"15\" width=\"44\" height=\"32\" rx=\"5\"/><path d=\"M6 25h44M12 36h12M38 36h6\"/>","<rect x=\"8\" y=\"16\" width=\"40\" height=\"32\" rx=\"5\"/><path d=\"M20 16v-6h16v6M8 28h40M24 28v6h8v-6\"/>","<path d=\"m12 45 23-23a13 13 0 0 1 14-15l-8 8 5 5 8-8a13 13 0 0 1-15 14L16 49Z\"/><circle cx=\"16\" cy=\"45\" r=\"2\"/>","<rect x=\"7\" y=\"9\" width=\"42\" height=\"32\" rx=\"4\"/><path d=\"M20 49h16M28 41v8m-6-30-7 6 7 6m12-12 7 6-7 6\"/>","<path d=\"m5 22 23-13 23 13-23 13Z\"/><path d=\"M14 28v13c8 8 20 8 28 0V28m9-6v18\"/>","<path d=\"m33 5-21 29h15l-4 17 23-31H30Z\"/>","<path d=\"M8 13h40v12a7 7 0 0 0 0 14v12H8V39a7 7 0 0 0 0-14Z\"/><path d=\"M29 19v6m0 5v5m0 5v5\"/>"][n];
  const icon=document.createElement("span");icon.setAttribute("aria-hidden","true");icon.style.cssText="display:grid;place-items:center;width:68px;height:68px;border-radius:15px;background:"+tone+"24;box-shadow:inset 0 1px 0 #ffffffc0,0 3px 9px "+tone+"20;color:"+tone;
  icon.innerHTML='<svg width="43" height="43" viewBox="0 0 60 60" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(2px 3px 1px '+tone+'32)">'+paths+'</svg>';codeEl.append(icon,document.createTextNode(code));
  const h=document.createElement("h3");h.textContent=cardTitle(item);
  const p=document.createElement("p");p.textContent=cardDesc(item);
  const status=document.createElement("span");status.className="status"+(pilot?" pilot-status":"");status.textContent=({es:"16 herramientas interactivas",ca:"16 eines interactives",en:"16 interactive tools"})[lang];
  const link=document.createElement("a");link.href="./experience.html?sector="+encodeURIComponent(code)+"&lang="+encodeURIComponent(lang);link.textContent=tr("industryExplore");
  link.href=sectorLink(code);
  if(onPublicPages && !publicSectors.has(code)){status.textContent=upcoming[lang];link.textContent=requestLabel[lang];}
 card.append(codeEl,h,p,status,link);grid.append(card);
 });
}
function renderCapabilities(){
 const grid=byId("capability-grid");grid.replaceChildren();
 capabilities.forEach(item=>{
  const card=document.createElement("article");card.className="capability-card";
  const h=document.createElement("h3");h.textContent=cardTitle(item);
  const p=document.createElement("p");p.textContent=cardDesc(item);
  const a=document.createElement("a");a.href="../"+item[0]+"/";a.textContent=tr("open");
  card.append(h,p,a);grid.append(card);
 });
}
function selectTab(target){
 const industriesTab=target==="industries";
 byId("industries").hidden=!industriesTab;byId("capabilities").hidden=industriesTab;
 byId("tab-industries").setAttribute("aria-selected",String(industriesTab));
 byId("tab-capabilities").setAttribute("aria-selected",String(!industriesTab));
}
function renderTour(){
 const t=tourContent[lang][step];
 byId("tour-counter").textContent=(step+1)+" / 4";
 byId("tour-title").textContent=t[0];byId("tour-text").textContent=t[1];
 byId("tour-back").textContent=tr("tourBack");byId("tour-back").disabled=step===0;
 byId("tour-next").textContent=step===3?tr("tourFinish"):tr("tourNext");
 byId("tour-skip").textContent=tr("tourSkip");
 const choices=byId("tour-language");choices.replaceChildren();
 if(step===0){
 [["es","Español"],["ca","Català"],["en","English"]].forEach(([code,label])=>{
 const btn=document.createElement("button");btn.type="button";btn.textContent=label;btn.setAttribute("aria-pressed",String(code===lang));btn.addEventListener("click",()=>applyLanguage(code));choices.append(btn);
 });
 }
}
const tour=byId("tour");
function closeTour(){tour.close();try{sessionStorage.setItem("scLabTourSeen","1");}catch(_){}}
byId("open-tour").addEventListener("click",()=>{step=0;renderTour();tour.showModal();});
byId("close-tour").addEventListener("click",closeTour);byId("tour-skip").addEventListener("click",closeTour);
byId("tour-back").addEventListener("click",()=>{step=Math.max(0,step-1);renderTour();});
byId("tour-next").addEventListener("click",()=>{if(step<3){step++;renderTour();}else{closeTour();byId("discover").scrollIntoView({behavior:"smooth"});}});
tour.addEventListener("close",()=>{try{sessionStorage.setItem("scLabTourSeen","1");}catch(_){}});
document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>applyLanguage(btn.dataset.lang)));
byId("tab-industries").addEventListener("click",()=>selectTab("industries"));byId("tab-capabilities").addEventListener("click",()=>selectTab("capabilities"));
try{const stored=sessionStorage.getItem("scLabLocale");if(["es","ca","en"].includes(stored))lang=stored;}catch(_){}
applyLanguage(lang);
chooseLanguage(lang,applyLanguage);

if(onPublicPages)fetch("./releases.json").then(r=>r.json()).then(data=>{publicSectors=new Set(data.publicSectors);applyLanguage(lang);}).catch(()=>{});
