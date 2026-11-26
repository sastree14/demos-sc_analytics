/* SC08 Retail & e-commerce — six synthetic decision experiences.
 * No commerce platform, advertising account, customer data or payments.
 * Attribution, demand elasticity, conversion and return rates are assumptions.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(v=>Math.round(v*100)/100)});
const vis=(type,labels,series,unit="number")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,formula,insight:formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100,sum=x=>x.reduce((a,b)=>a+b,0);
const labels=["XS","S","M","L","XL"];

export const retailModels={
 rtPromo:{
  title:L("Promoción: margen incremental frente a volumen","Promoció: marge incremental davant volum","Promotion margin versus incremental sales"),
  inputs:[
   f("base","Unidades sin promoción","Unitats sense promoció","Units without promotion",100,6500,50,1300),
   f("price","Precio habitual (€)","Preu habitual (€)","Normal unit price (€)",10,240,5,65,"eur"),
   f("cost","Coste variable por unidad (€)","Cost variable per unitat (€)","Variable unit cost (€)",2,180,2,27,"eur"),
   f("discount","Descuento aplicado (%)","Descompte aplicat (%)","Promotional discount (%)",0,55,5,20,"pct"),
   f("uplift","Uplift incremental supuesto (%)","Uplift incremental suposat (%)","Assumed incremental uplift (%)",0,150,5,45,"pct"),
   f("stock","Unidades disponibles","Unitats disponibles","Units available",100,9500,100,1750),
   f("adSpend","Gasto en la campaña (€)","Despesa de la campanya (€)","Campaign advertising spend (€)",0,40000,500,2500,"eur"),
   f("missed","Coste por venta que se pierde (€)","Cost per venda perduda (€)","Penalty per lost sale (€)",0,100,5,20,"eur")
  ]
 },
 rtSizes:{
  title:L("Roturas y distribución de tallas","Ruptures i distribució de talles","Size stockouts and demand allocation"),
  inputs:[
   f("demand","Demanda total por tallas","Demanda total per talles","Total size demand",100,4500,50,1050),
   f("mixM","Peso de talla M (%)","Pes de talla M (%)","Demand share for size M (%)",10,60,5,35,"pct"),
   f("stock","Unidades redistribuibles","Unitats redistribuïbles","Reallocatable units",100,3500,50,800),
   f("priority","Prioridad de rotura M (multiplicador)","Prioritat de ruptura M (multiplicador)","Size M stockout priority",1,5,0.5,2),
   f("cost","Contribución perdida por stockout (€)","Contribució perduda per ruptura (€)","Lost contribution per unserved unit (€)",5,120,5,35,"eur"),
   f("holding","Coste de unidad sobrante (€)","Cost d'unitat sobrant (€)","Excess unit cost (€)",0,35,1,4,"eur")
  ]
 },
 rtReturns:{
  title:L("Devoluciones por canal y coste neto","Devolucions per canal i cost net","Returns by channel and net margin"),
  inputs:[
   f("orders","Pedidos del periodo","Comandes del període","Period orders",100,9000,100,1900),
   f("online","Pedidos online (%)","Comandes online (%)","Online order share (%)",10,95,5,65,"pct"),
   f("rateOnline","Devoluciones online (%)","Devolucions online (%)","Online return rate (%)",0,55,1,22,"pct"),
   f("rateStore","Devoluciones tienda (%)","Devolucions botiga (%)","In-store return rate (%)",0,35,1,7,"pct"),
   f("price","Valor medio por pedido (€)","Valor mitjà per comanda (€)","Average order price (€)",10,400,5,75,"eur"),
   f("unitCost","Coste producto por pedido (€)","Cost producte per comanda (€)","Product cost per order (€)",2,250,5,34,"eur"),
   f("processCost","Gestión por devolución (€)","Gestió per devolució (€)","Return handling cost (€)",1,80,2,16,"eur"),
   f("recover","Recuperación de coste del producto (%)","Recuperació del cost del producte (%)","Product cost recovery on returns (%)",0,100,5,70,"pct")
  ]
 },
 rtOmnichannel:{
  title:L("Asignar inventario entre tiendas y web","Assignar estoc entre botigues i web","Omnichannel fulfilment and transfers"),
  inputs:[
   f("storeA","Stock tienda A","Estoc botiga A","Store A stock",0,1000,25,460),
   f("storeB","Stock tienda B","Estoc botiga B","Store B stock",0,1000,25,280),
   f("warehouse","Stock online y almacén","Estoc en línia i magatzem","Warehouse and online stock",0,1500,25,360),
   f("demandA","Pedidos tienda A","Comandes botiga A","Store A demand",0,1200,25,430),
   f("demandB","Pedidos tienda B","Comandes botiga B","Store B demand",0,1200,25,420),
   f("demandWeb","Pedidos online","Comandes en línia","Online demand",0,1500,25,540),
   f("transferCap","Capacidad de transferir unidades","Capacitat de transferir unitats","Transfer unit capacity",0,750,25,220),
   f("transferCost","Coste por transferencia (€)","Cost per transferència (€)","Unit transfer cost (€)",1,60,1,6,"eur"),
   f("missCost","Coste de falta por unidad (€)","Cost de manca per unitat (€)","Unserved unit penalty (€)",5,130,5,50,"eur")
  ]
 },
 rtAcquisition:{
  title:L("CAC, recompra y recuperación de inversión","CAC, recompra i retorn de la inversió","Customer acquisition payback"),
  inputs:[
   f("spend","Inversión publicitaria (€)","Inversió publicitària (€)","Advertising investment (€)",1000,120000,1000,18000,"eur"),
   f("visitors","Visitas atribuidas (supuesto)","Visites atribuïdes (supòsit)","Assumed attributable visits",1000,70000,1000,13500),
   f("conversion","Conversión asumida (%)","Conversió assumida (%)","Assumed conversion rate (%)",0.5,12,0.5,3,"pct"),
   f("aov","Ticket medio (€)","Tiquet mitjà (€)","Average order value (€)",10,350,5,85,"eur"),
   f("margin","Margen de contribución antes de CAC (%)","Marge de contribució abans de CAC (%)","Pre-CAC contribution margin (%)",5,75,5,32,"pct"),
   f("reorder","Recompras por cliente/año","Recompres per client/any","Repeat orders per customer/year",0,6,0.5,1.5),
   f("retention","Clientes retenidos en segunda compra (%)","Clients retinguts en segona compra (%)","Repeat customer retention (%)",10,100,5,45,"pct"),
   f("returns","Coste de devoluciones por venta (%)","Cost de devolucions per venda (%)","Return-cost ratio per sale (%)",0,30,1,8,"pct")
  ]
 },
 rtAssortment:{
  title:L("Productos lentos, markdowns y stock inmóvil","Productes lents, rebaixes i estoc immobilitzat","Slow-moving assortment and markdowns"),
  inputs:[
   f("sku","Referencias activas","Referències actives","Active SKUs",40,2500,20,460),
   f("slowShare","Productos lentos (%)","Productes lents (%)","Slow-moving share (%)",5,70,5,30,"pct"),
   f("units","Unidades por SKU lento","Unitats per SKU lent","Units per slow SKU",5,160,5,35),
   f("sellThrough","Venta prevista sin rebaja (%)","Venda prevista sense rebaixa (%)","Expected full-price sell-through (%)",5,75,5,25,"pct"),
   f("price","Precio normal (€)","Preu normal (€)","Full price (€)",10,280,5,65,"eur"),
   f("cost","Coste de adquisición por unidad (€)","Cost d'adquisició per unitat (€)","Unit purchase cost (€)",2,200,5,28,"eur"),
   f("markdown","Descuento de liquidación (%)","Descompte de liquidació (%)","Markdown depth (%)",5,75,5,30,"pct"),
   f("uplift","Multiplicador de ventas con rebaja","Multiplicador de vendes amb rebaixa","Markdown sell-through multiplier",1,4,0.25,2.5),
   f("holding","Coste por unidad retenida (€)","Cost per unitat retinguda (€)","Per-unit holding cost (€)",0,25,1,4,"eur")
  ]
 }
};
function promo(p){
 const baseSales=Math.min(p.base,p.stock),promoDemand=p.base*(1+p.uplift/100);
 const sold=Math.min(promoDemand,p.stock);
 const original=(p.price-p.cost)*baseSales-Math.max(0,p.base-baseSales)*p.missed;
 const promoted=(p.price*(1-p.discount/100)-p.cost)*sold-p.adSpend-Math.max(0,promoDemand-sold)*p.missed;
 return out([
  m("revenue",sold*p.price*(1-p.discount/100),"eur"),
  m("profit",promoted,"eur"),m("delta",promoted-original,"eur"),
  m("shortage",Math.max(0,promoDemand-sold))
 ],vis("bar",["Sin promoción","Con promoción"],[ser("target",[p.base,promoDemand]),ser("actual",[baseSales,sold])]),
 "Contribución con promoción = unidades vendidas × margen descontado − inversión − penalización por demanda no cubierta. Uplift y ventas son escenarios hipotéticos.",
 "No calcula causalidad de una campaña, coste de adquisición real, desplazamiento de compras futuras ni elasticidad validada.",
 [["Contribución de referencia (€)",rnd(original)],["Contribución promocional (€)",rnd(promoted)],["Unidades no servidas",rnd(promoDemand-sold)],["Precio tras descuento (€)",rnd(p.price*(1-p.discount/100))]],
 promoted<original?"La promoción reduce la contribución bajo estas hipótesis.":"");
}
function sizes(p){
 const mShare=p.mixM/100;
 const weights=[.08,.19,mShare,.30,Math.max(0,.43-mShare)];
 const normalized=weights.map(x=>x/sum(weights));
 const demand=normalized.map(x=>p.demand*x);
 const unitPenalty=normalized.map((_,i)=>p.cost*(i===2?p.priority:1));
 const alloc=[0,0,0,0,0],cap=Math.floor(p.stock);
 let remaining=cap;
 // Fractional allocation with a deterministic priority sorted by penalty, then demand.
 const indices=[0,1,2,3,4].sort((a,b)=>unitPenalty[b]-unitPenalty[a]||demand[b]-demand[a]);
 for(const i of indices){const qty=Math.min(demand[i],remaining);alloc[i]=qty;remaining-=qty;}
 const baseline=normalized.map(x=>x*p.stock);
 const costs=(values)=>sum(values.map((v,i)=>Math.max(0,demand[i]-v)*unitPenalty[i]+Math.max(0,v-demand[i])*p.holding));
 const shortage=sum(alloc.map((v,i)=>Math.max(0,demand[i]-v)));
 const fulfilled=sum(alloc.map((v,i)=>Math.min(v,demand[i])));
 return out([
  m("service",fulfilled/p.demand*100,"pct"),
  m("shortage",shortage),m("cost",costs(alloc),"eur"),m("delta",costs(baseline)-costs(alloc),"eur")
 ],vis("bar",labels,[ser("target",demand),ser("actual",alloc)]),
 "Reparto de stock disponible entre cinco tallas, priorizando las faltas con mayor coste supuesto. Comparación con reparto proporcional al mix previsto.",
 "No representa sustitución entre tallas, inventario comprometido, recepción de pedidos ni disponibilidad real de tiendas. El peso de tallas es un supuesto.",
 [["Stock asignado",rnd(sum(alloc))],["Coste de reparto base (€)",rnd(costs(baseline))],["Coste de reparto calculado (€)",rnd(costs(alloc))],["Talla prioritaria","M"]]);
}
function returns(p){
 const online=p.orders*p.online/100,store=p.orders-online;
 const retOnline=online*p.rateOnline/100,retStore=store*p.rateStore/100,returns=retOnline+retStore;
 const sales=p.orders*p.price,refProfit=p.orders*(p.price-p.unitCost);
 // Cost of returned orders: revenue refunded, product recovery on returned units, and handling.
 const retained=p.orders-returns;
 const profit=retained*(p.price-p.unitCost)+returns*(-p.unitCost*(1-p.recover/100)-p.processCost);
 return out([
  m("profit",profit,"eur"),m("returns",returns),m("margin",sales?profit/sales*100:0,"pct"),
  m("delta",profit-refProfit,"eur")
 ],vis("bar",["Online","Tienda"],[ser("orders",[online,store]),ser("returns",[retOnline,retStore])]),
 "Contribución = pedidos retenidos × (precio − coste) + devoluciones × (−coste no recuperado − coste de gestión). Se asume reembolso total de las devoluciones.",
 "La tasa de devolución por canal no se aprende de datos reales; no se modela fraude, reacondicionamiento detallado, impuestos ni plazos legales.",
 [["Devoluciones online esperadas",rnd(retOnline)],["Devoluciones tienda esperadas",rnd(retStore)],["Contribución sin devoluciones (€)",rnd(refProfit)],["Coste de devoluciones frente a referencia (€)",rnd(refProfit-profit)]]);
}
function omnichannel(p){
 const stocks=[p.storeA,p.storeB,p.warehouse],demand=[p.demandA,p.demandB,p.demandWeb];
 const initial=stocks.map((x,i)=>Math.min(x,demand[i]));
 const missedBefore=sum(initial.map((v,i)=>demand[i]-v));
 const remaining=stocks.map((v,i)=>Math.max(0,v-demand[i]));
 const shortages=demand.map((v,i)=>Math.max(0,v-stocks[i]));
 const flows=[[0,1],[0,2],[1,0],[1,2],[2,0],[2,1]];
 const stock=stocks.slice();const transfers=[];let moved=0;
 // Choose transfers only if cheaper than unserved contribution, with a global transfer bound.
 while(moved<p.transferCap){
  let best=null;
  for(const [source,dest] of flows){
   const can=Math.min(Math.floor(stock[source]-demand[source]),Math.ceil(demand[dest]-stock[dest]),Math.floor(p.transferCap-moved));
   if(can>0&&p.transferCost<p.missCost&&(!best||can>best.quantity))best={source,dest,quantity:can};
  }
  if(!best)break;
  stock[best.source]-=best.quantity;stock[best.dest]+=best.quantity;
  transfers.push(best);moved+=best.quantity;
 }
 const served=stock.map((x,i)=>Math.min(x,demand[i]));
 const missed=sum(served.map((v,i)=>demand[i]-v));
 const cost=missed*p.missCost+moved*p.transferCost;
 const baselineCost=missedBefore*p.missCost;
 return out([
  m("service",sum(served)/Math.max(1,sum(demand))*100,"pct"),
  m("shortage",missed),m("transferUnits",moved),
  m("delta",baselineCost-cost,"eur")
 ],vis("bar",["Tienda A","Tienda B","Web"],[ser("target",demand),ser("actual",served)]),
 "Traslados entre tres nodos cuando existe excedente en origen y faltante en destino; solo se acepta transferencia si el coste unitario es menor que la penalización por no atender.",
 "No representa tiempos de transporte, stock reservado, proveedores, embalaje, trazabilidad ni promesas multicanal reales.",
 [["Pedidos sin servir sin traslados",rnd(missedBefore)],["Traslados propuestos",transfers.map(x=>["A","B","Web"][x.source]+"→"+["A","B","Web"][x.dest]+":"+x.quantity).join(", ")||"Ninguno"],["Coste base (€)",rnd(baselineCost)],["Coste calculado (€)",rnd(cost)]]);
}
function acquisition(p){
 const customers=p.visitors*p.conversion/100;
 const cac=customers>0?p.spend/customers:0;
 const netMargin=p.margin/100-p.returns/100;
 const first=p.aov*netMargin,repeat=p.aov*netMargin*p.reorder*p.retention/100;
 const ltv=first+repeat;
 const total=customers*ltv-p.spend;
 const payback=first>0?cac/first:0;
 return out([
  m("cac",cac,"eur"),m("ltv",ltv,"eur"),m("profit",total,"eur"),
  m("payback",payback)
 ],vis("bar",["Adquisición","Primera compra","Recompra"],[ser("value",[cac,first,repeat])],"eur"),
 "Clientes estimados = visitas atribuidas × conversión. CAC = inversión/clientes. Contribución estimada = primera compra y recompras con retención y margen supuesto, menos gasto.",
 "La atribución de visitas, conversión y retención no está verificada; no es LTV estadístico, previsión de ventas ni prueba de incrementalidad publicitaria.",
 [["Clientes nuevos estimados",rnd(customers)],["Margen neto supuesto (%)",rnd(netMargin*100)],["Contribución por primera compra (€)",rnd(first)],["Compras equivalentes de contribución",rnd(payback)]],
 total<0?"La contribución total estimada no cubre la inversión con estos supuestos.":first<=0?"La primera compra no genera contribución positiva; la recuperación por este canal no es estimable.":"");
}
function assortment(p){
 const slowSkus=p.sku*p.slowShare/100,units=slowSkus*p.units;
 const referenceSold=units*p.sellThrough/100;
 const markedSold=Math.min(units,referenceSold*p.uplift);
 const fullNet=referenceSold*(p.price-p.cost)-(units-referenceSold)*p.holding;
 const markedNet=markedSold*(p.price*(1-p.markdown/100)-p.cost)-(units-markedSold)*p.holding;
 const choice=markedNet>fullNet?"Liquidar":"Mantener precio";
 const best=Math.max(fullNet,markedNet);
 return out([
  m("stock",units),m("profit",best,"eur"),
  m("delta",best-fullNet,"eur"),m("service",Math.max(referenceSold,markedSold)/Math.max(1,units)*100,"pct")
 ],vis("bar",["Precio habitual","Rebaja"],[ser("profit",[fullNet,markedNet])],"eur"),
 "Calcula contribución de referencias lentas según venta estimada al precio habitual y bajo descuento, con costes unitarios y mantenimiento de stock.",
 "El multiplicador de venta por rebaja es supuesto; no hay predicción SKU por SKU, elasticidad causal, pérdida de valor por marca ni restricciones reales.",
 [["SKU lentos estimados",rnd(slowSkus)],["Unidades en referencias lentas",rnd(units)],["Política preferible (supuesto)",choice],["Ventas sin rebaja",rnd(referenceSold)]]);
}
export const retailCalculators={
 rtPromo:promo,rtSizes:sizes,rtReturns:returns,rtOmnichannel:omnichannel,
 rtAcquisition:acquisition,rtAssortment:assortment
};
