const labels = {
 es:{skip:"Saltar al contenido",allDemos:"Todas las demos",website:"Web oficial",heroTitle:"Empieza por el problema. Descubre cómo tomar mejores decisiones.",heroLead:"Explora situaciones empresariales ilustrativas y demostraciones técnicas. Los sistemas reales se diseñan a medida de los datos, procesos y restricciones de cada organización.",explore:"Explorar experiencias",tour:"¿Cómo navegar?",synthetic:"Los datos son sintéticos y no representan resultados obtenidos para clientes.",discoverEyebrow:"ENCUENTRA TU PUNTO DE PARTIDA",discoverTitle:"¿Qué te gustaría explorar?",industryTab:"Por industria",capabilityTab:"Por capacidad",industriesIntro:"Explora 18 industrias, cada una con seis decisiones empresariales simuladas. Son ejemplos cuantitativos para experimentar, no soluciones validadas con datos de clientes.",capabilitiesIntro:"Siete familias de capacidades técnicas con demostraciones públicas e interactivas.",pilotEyebrow:"SC01 / PRIMERA EXPERIENCIA SECTORIAL",pilotTitle:"Logística y transporte: del plan al escenario.",pilotCopy:"Explora seis retos logísticos con variables ajustables, escenarios A/B, resultados calculados y explicaciones transparentes. Los motores son ilustrativos, no un plan operativo real.",pilotExisting:"Explorar los seis problemas logísticos",pilotContact:"Comentar un problema logístico",ctaTitle:"¿Y si las restricciones fueran las de tu organización?",ctaCopy:"Estas demostraciones son ejemplos. En SC-Analytics diseñamos modelos, algoritmos y aplicaciones adaptados a los sistemas y decisiones de cada empresa. También nos interesa intercambiar perspectivas con profesionales de distintos sectores.",ctaButton:"Conversemos sobre tu caso",ctaLinkedIn:"Seguir el trabajo en LinkedIn",footer:"Experiencias ilustrativas; soluciones a medida.",backDemos:"Volver a las demos",pilotStatus:"6 escenarios simulados",upcoming:"6 escenarios simulados",related:"Explorar esta industria",industryAvailable:"6 escenarios simulados",industryExplore:"Explorar esta industria",suggest:"Sugerir un problema",open:"Abrir demo",tourBack:"Anterior",tourNext:"Continuar",tourFinish:"Empezar a explorar",tourSkip:"Saltar guía"},
 ca:{skip:"Saltar al contingut",allDemos:"Totes les demos",website:"Web oficial",heroTitle:"Comença pel problema. Descobreix com prendre millors decisions.",heroLead:"Explora situacions empresarials il·lustratives i demostracions tècniques. Els sistemes reals es dissenyen a mida de les dades, els processos i les restriccions de cada organització.",explore:"Explorar experiències",tour:"Com navegar?",synthetic:"Les dades són sintètiques i no representen resultats aconseguits per a clients.",discoverEyebrow:"TROBA EL TEU PUNT DE PARTIDA",discoverTitle:"Què t'agradaria explorar?",industryTab:"Per indústria",capabilityTab:"Per capacitat",industriesIntro:"Explora 18 indústries, cadascuna amb sis decisions empresarials simulades. Són exemples quantitatius per experimentar, no solucions validades amb dades de clients.",capabilitiesIntro:"Set famílies de capacitats tècniques amb demostracions públiques i interactives.",pilotEyebrow:"SC01 / PRIMERA EXPERIÈNCIA SECTORIAL",pilotTitle:"Logística i transport: del pla a l'escenari.",pilotCopy:"Explora sis reptes logístics amb variables ajustables, escenaris A/B, resultats calculats i explicacions transparents. Els models són il·lustratius.",pilotExisting:"Explorar els sis problemes logístics",pilotContact:"Comentar un problema logístic",ctaTitle:"I si les restriccions fossin les de la teva organització?",ctaCopy:"Aquestes demostracions són exemples. A SC-Analytics dissenyem models, algoritmes i aplicacions adaptats als sistemes i decisions de cada empresa. També ens interessa intercanviar punts de vista amb professionals de diferents sectors.",ctaButton:"Parlem del teu cas",ctaLinkedIn:"Seguir la feina a LinkedIn",footer:"Experiències il·lustratives; solucions a mida.",backDemos:"Tornar a les demos",pilotStatus:"6 escenaris simulats",upcoming:"6 escenaris simulats",related:"Explorar aquesta indústria",industryAvailable:"6 escenaris simulats",industryExplore:"Explorar aquesta indústria",suggest:"Suggerir un problema",open:"Obrir demo",tourBack:"Anterior",tourNext:"Continuar",tourFinish:"Començar a explorar",tourSkip:"Saltar la guia"},
 en:{skip:"Skip to content",allDemos:"All demos",website:"Official website",heroTitle:"Start with the problem. Explore better decisions.",heroLead:"Explore illustrative business situations and technical demonstrations. Real systems are built around each organization's data, processes and constraints.",explore:"Explore experiences",tour:"How to navigate",synthetic:"All data is synthetic, not verified client outcomes.",discoverEyebrow:"CHOOSE WHERE TO START",discoverTitle:"What would you like to explore?",industryTab:"By industry",capabilityTab:"By capability",industriesIntro:"Explore 18 industries, each with six simulated business decisions. These are interactive quantitative examples, not validated client systems.",capabilitiesIntro:"Seven technical capability families with public interactive demos.",pilotEyebrow:"SC01 / FIRST INDUSTRY EXPERIENCE",pilotTitle:"Logistics and transport: from plan to scenario.",pilotCopy:"Explore six logistics challenges with adjustable inputs, A/B scenarios, modelled outcomes and transparent explanations. The engines are illustrative, not deployable business plans.",pilotExisting:"Explore six logistics challenges",pilotContact:"Discuss a logistics problem",ctaTitle:"What if these constraints were your organization's?",ctaCopy:"These demonstrations are examples. SC-Analytics designs models, algorithms and applications tailored to the systems and decisions of each organization. We also welcome technical conversations with professionals in any industry.",ctaButton:"Discuss your situation",ctaLinkedIn:"Follow us on LinkedIn",footer:"Illustrative experiences; tailored business solutions.",backDemos:"Back to demos",pilotStatus:"6 simulated scenarios",upcoming:"6 simulated scenarios",related:"Explore this industry",industryAvailable:"6 simulated scenarios",industryExplore:"Explore this industry",suggest:"Suggest a problem",open:"Open demo",tourBack:"Previous",tourNext:"Continue",tourFinish:"Start exploring",tourSkip:"Skip guide"}
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
const capabilities=[
["predictive-models","Predicción y ML","Predicció i ML","Predictive intelligence","Pronósticos, riesgo, clasificación","Pronòstics, risc i classificació","Forecasts, risk and classification"],
["optimization","Optimización matemática","Optimització matemàtica","Mathematical optimisation","Asignación, inventario y planificación","Assignació, inventari i planificació","Allocation, inventory and planning"],
["automation-ai","Automatización e IA","Automatització i IA","Automation & AI","Workflows, reglas y supervisión","Fluxos, regles i supervisió","Workflows, rules and review"],
["modelling-scenarios","Modelización y escenarios","Modelització i escenaris","Modelling & scenarios","Precio, inversión y rentabilidad","Preu, inversió i rendibilitat","Pricing, investment and profit"],
["simulations","Simulación y riesgo","Simulació i risc","Simulation & risk","Incertidumbre y contingencias","Incertesa i contingències","Uncertainty and contingencies"],
["bi-reporting","BI y reporting","BI i reporting","BI & reporting","Indicadores y reporting ejecutivo","Indicadors i reporting executiu","Metrics and executive reports"],
["custom-apps","Aplicaciones a medida","Aplicacions a mida","Custom applications","CRM, aprobaciones y gestión","CRM, aprovacions i gestió","CRM, approvals and management"]
];
const tourContent={
 es:[["Elige tu idioma","Puedes cambiar el idioma en cualquier momento. Este catálogo está traducido; la traducción completa de los cálculos y reportes existentes forma parte del siguiente desarrollo."],["Elige un sector o una capacidad","En el catálogo sectorial verás 18 industrias; podrás explorar seis simulaciones por industria."],["Experimenta con un caso realista","En las demos técnicas puedes modificar condiciones y ejecutar cálculos con datos sintéticos. Las 18 experiencias sectoriales incluyen seis problemas simulados cada una."],["Conversemos cuando te resulte útil","Si un escenario te interesa, puedes comentar tu caso o visitar nuestras páginas. No necesitas dejar tus datos para explorar."]],
 ca:[["Tria l'idioma","Pots canviar l'idioma sempre que vulguis. Aquest catàleg ja està traduït; la traducció completa dels càlculs i informes és una fase posterior."],["Tria un sector o una capacitat","Hi ha 18 indústries; podràs explorar sis simulacions per indústria."],["Experimenta amb un cas realista","A les demos tècniques pots canviar condicions i executar càlculs amb dades sintètiques. Les 18 experiències sectorials inclouen sis problemes simulats cadascuna."],["Parlem quan et sigui útil","Si un escenari t'interessa, pots comentar el teu cas o visitar les nostres pàgines sense donar dades per explorar."]],
 en:[["Choose your language","You can change languages at any time. This catalog is translated; full translation of calculations and reports in the existing demos is a later development phase."],["Choose an industry or capability","The catalog features 18 industries, with six illustrative challenges per industry alongside the existing technical demos."],["Explore a realistic scenario","Existing technical demos let you adjust assumptions and run calculations on synthetic data. Each of the 18 industries now has six illustrative interactive problems."],["Discuss an idea when ready","If a scenario looks relevant, you can contact us or explore our website. No sign-up is required."]]
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
 try{sessionStorage.setItem("scLabLocale",lang);}catch(_){}
}
function renderIndustries(){
 const grid=byId("industry-grid");grid.replaceChildren();
 industries.forEach(item=>{
  const code=item[0],pilot=code==="SC01";
  const card=document.createElement("article");card.className="industry-card "+(pilot?"pilot":"");
  const codeEl=document.createElement("span");codeEl.className="code";codeEl.textContent=code;
  const h=document.createElement("h3");h.textContent=cardTitle(item);
  const p=document.createElement("p");p.textContent=cardDesc(item);
  const status=document.createElement("span");status.className="status"+(pilot?" pilot-status":"");status.textContent=tr("industryAvailable");
  const link=document.createElement("a");link.href="./experience.html?sector="+encodeURIComponent(code)+"&lang="+encodeURIComponent(lang);link.textContent=tr("industryExplore");
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
try{if(sessionStorage.getItem("scLabTourSeen")!=="1"){step=0;renderTour();tour.showModal();}}catch(_){}
