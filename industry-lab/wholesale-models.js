/* SC02 — wholesale distribution. Distinct deterministic mechanisms for five
 * questions; all data/costs/lead-time distributions are illustrative.
 */
const L=(es,ca,en)=>({es,ca,en});
const f=(key,es,ca,en,min,max,step,value,unit="number")=>({key,label:L(es,ca,en),min,max,step,value,unit});
const m=(key,value,unit="number")=>({key,value,unit});
const ser=(key,values)=>({key,values:values.map(x=>Math.round(x*100)/100)});
const vis=(labels,series,unit="number",type="bar")=>({type,labels,series,unit});
const out=(metrics,visual,formula,limits,table,warning="")=>({metrics,visual,insight:formula,formula,limitations:limits,table,warning});
const rnd=x=>Math.round(x*100)/100;
const sum=a=>a.reduce((x,y)=>x+y,0);
export const wholesaleModels={
transfer:{
 title:L("Redistribuir stock entre almacenes","Redistribuir estoc entre magatzems","Reallocate inventory across warehouses"),
 inputs:[
 f("stockA","Stock en almacén A","Estoc al magatzem A","Warehouse A stock",0,1800,25,650),
 f("stockB","Stock en almacén B","Estoc al magatzem B","Warehouse B stock",0,1800,25,340),
 f("demandA","Demanda en A","Demanda a A","Demand at A",0,1900,25,400),
 f("demandB","Demanda en B","Demanda a B","Demand at B",0,1900,25,730),
 f("moveCap","Máximo transferible","Màxim transferible","Maximum transferable units",0,900,25,300),
 f("moveCost","Coste transferir unidad (€)","Cost de transferir unitat (€)","Transfer cost per unit (€)",0.5,40,0.5,5,"eur"),
 f("missCost","Coste de falta por unidad (€)","Cost de falta per unitat (€)","Shortage penalty per unit (€)",2,100,2,25,"eur"),
 f("holdCost","Coste de exceso por unidad (€)","Cost d'excés per unitat (€)","Excess holding cost per unit (€)",0,20,1,3,"eur")
]},
supplierRisk:{
 title:L("Retrasos y variabilidad de suministro","Retards i variabilitat de subministrament","Supplier lead-time uncertainty"),
 inputs:[
 f("demand","Demanda media semanal","Demanda mitjana setmanal","Mean weekly demand",20,1500,20,400),
 f("stock","Stock y pedido previsto","Estoc i comanda prevista","Available and planned stock",0,5000,50,1200),
 f("lead","Plazo normal (semanas)","Termini normal (setmanes)","Normal lead time (weeks)",1,8,1,2),
 f("delayChance","Probabilidad de retraso (%)","Probabilitat de retard (%)","Delay probability (%)",0,80,5,35,"pct"),
 f("extraWeeks","Retraso adicional (semanas)","Retard addicional (setmanes)","Additional delay (weeks)",0,6,1,2),
 f("variability","Variabilidad de demanda (%)","Variabilitat de demanda (%)","Demand variability (%)",5,50,5,20,"pct"),
 f("missCost","Penalización por falta (€)","Penalització per manca (€)","Shortage cost per unit (€)",5,150,5,40,"eur")
]},
purchaseLots:{
 title:L("Pedidos mínimos, presupuesto y espacio","Comandes mínimes, pressupost i espai","Minimum-order constraints and capacity"),
 inputs:[
 f("demand","Demanda del periodo","Demanda del període","Period demand",40,2400,20,820),
 f("onHand","Stock actual","Estoc actual","Current stock",0,1200,20,240),
 f("moq","Pedido mínimo (unidades)","Comanda mínima (unitats)","Minimum order quantity",10,400,10,140),
 f("unitCost","Precio de compra unitario (€)","Preu de compra unitari (€)","Unit purchasing cost (€)",5,160,5,35,"eur"),
 f("budget","Presupuesto (€)","Pressupost (€)","Budget (€)",5000,130000,1000,30000,"eur"),
 f("capacity","Espacio total de almacenamiento","Espai total d'emmagatzematge","Total storage capacity",300,3200,50,1600),
 f("shortage","Penalización por falta (€)","Penalització per manca (€)","Shortage penalty (€)",5,160,5,65,"eur"),
 f("holding","Coste por unidad excedente (€)","Cost per unitat excedent (€)","Excess unit holding cost (€)",0,30,1,5,"eur")
]},
customerMargin:{
 title:L("Margen neto y coste de servir al cliente","Marge net i cost de servir el client","Customer contribution and cost-to-serve"),
 inputs:[
 f("orders","Pedidos del cliente","Comandes del client","Customer orders",5,250,5,65),
 f("ticket","Ingreso bruto por pedido (€)","Ingrés brut per comanda (€)","Gross revenue per order (€)",50,2500,25,480,"eur"),
 f("productCost","Coste de producto por pedido (€)","Cost de producte per comanda (€)","Product cost per order (€)",20,1900,20,270,"eur"),
 f("handling","Preparación por pedido (€)","Preparació per comanda (€)","Picking and packing per order (€)",2,100,2,18,"eur"),
 f("delivery","Distribución por pedido (€)","Distribució per comanda (€)","Delivery cost per order (€)",2,120,2,25,"eur"),
 f("returns","Devoluciones (%)","Devolucions (%)","Return rate (%)",0,35,1,9,"pct"),
 f("refundCost","Coste de gestión por devolución (€)","Cost de gestió per devolució (€)","Return processing cost (€)",5,200,5,60,"eur"),
 f("discount","Descuento comercial (%)","Descompte comercial (%)","Commercial discount (%)",0,40,1,8,"pct")
]},
assortment:{
 title:L("Stock lento y riesgo de obsolescencia","Estoc lent i risc d'obsolescència","Slow-moving inventory and obsolescence"),
 inputs:[
 f("skus","Referencias en el surtido","Referències a l'assortiment","SKUs in assortment",20,2500,20,380),
 f("slow","Referencias de baja rotación (%)","Referències de baixa rotació (%)","Slow-moving SKU share (%)",5,75,5,35,"pct"),
 f("units","Unidades por SKU lento","Unitats per SKU lent","Units per slow-moving SKU",5,240,5,65),
 f("cost","Coste medio unitario (€)","Cost mitjà unitari (€)","Average unit purchase cost (€)",5,240,5,35,"eur"),
 f("obsolete","Riesgo de obsolescencia (%)","Risc d'obsolescència (%)","Obsolescence probability (%)",0,90,5,25,"pct"),
 f("markdown","Descuento de liquidación (%)","Descompte de liquidació (%)","Markdown discount (%)",5,85,5,35,"pct"),
 f("holding","Coste de mantener unidad (€)","Cost de mantenir unitat (€)","Holding cost per unit (€)",0,30,1,5,"eur")
]}
};
function transfer(p){
 const possibleA=Math.min(p.moveCap,p.stockA);
 const possibleB=Math.min(p.moveCap,p.stockB);
 function evalMove(t){
  const stockA=p.stockA-t,stockB=p.stockB+t;
  const missA=Math.max(0,p.demandA-stockA),missB=Math.max(0,p.demandB-stockB);
  const excessA=Math.max(0,stockA-p.demandA),excessB=Math.max(0,stockB-p.demandB);
  return {t,stockA,stockB,missA,missB,cost:(missA+missB)*p.missCost+(excessA+excessB)*p.holdCost+Math.abs(t)*p.moveCost};
 }
 let best=evalMove(0);
 for(let t=-possibleB;t<=possibleA;t++){
  const cand=evalMove(t);if(cand.cost<best.cost)best=cand;
 }
 const base=evalMove(0),total=p.demandA+p.demandB;
 const coverage=total?100*(total-best.missA-best.missB)/total:100;
 return out([
  m("service",coverage,"pct"),m("unserved",best.missA+best.missB),
  m("transferUnits",Math.abs(best.t)),m("delta",base.cost-best.cost,"eur")
 ],vis(["Almacén A","Almacén B"],[ser("target",[p.demandA,p.demandB]),ser("actual",[best.stockA,best.stockB])]),
 "Enumeración de movimientos enteros A↔B dentro de stock y límite de traslado. Se minimizan transporte, faltas y exceso de stock con costes supuestos.",
 "No incluye tiempos de tránsito, estado de pedidos, lotes, caducidades ni transferencias entre más de dos almacenes.",
 [["Dirección",best.t>0?"A → B":best.t<0?"B → A":"Sin traslado"],["Unidades transferidas",Math.abs(best.t)],["Coste base",rnd(base.cost)],["Coste con traslado",rnd(best.cost)]]
 );
}
function normalCDF(z){
 const t=1/(1+.2316419*Math.abs(z));
 const phi=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
 const poly=.319381530*t-.356563782*t*t+1.781477937*t**3-1.821255978*t**4+1.330274429*t**5;
 const pos=1-phi*poly;return z>=0?pos:1-pos;
}
function normalShortage(available,mu,sigma){
 const z=(available-mu)/sigma;
 return Math.max(0,(mu-available)*(1-normalCDF(z))+sigma*Math.exp(-z*z/2)/Math.sqrt(2*Math.PI));
}
function supplierRisk(p){
 const muNormal=p.demand*p.lead,muDelayed=p.demand*(p.lead+p.extraWeeks);
 const sigmaNormal=p.demand*p.variability/100*Math.sqrt(p.lead);
 const sigmaDelayed=p.demand*p.variability/100*Math.sqrt(p.lead+p.extraWeeks);
 const n=normalShortage(p.stock,muNormal,Math.max(1,sigmaNormal));
 const d=normalShortage(p.stock,muDelayed,Math.max(1,sigmaDelayed));
 const r=p.delayChance/100;
 const short=n*(1-r)+d*r;
 const avgDemand=muNormal*(1-r)+muDelayed*r;
 const leftover=Math.max(0,p.stock-avgDemand+short);
 const cost=short*p.missCost;
 const coverage=avgDemand>0?Math.max(0,100*(1-short/avgDemand)):100;
 return out([
  m("service",coverage,"pct"),m("shortage",short),
  m("stock",leftover),m("cost",cost,"eur")
 ],vis(["Plazo normal","Con retraso","Combinado"],[ser("shortage",[n,d,short])]),
 "Mezcla de dos escenarios de plazo (normal/retrasado), cada uno con demanda normal supuesta. Se ponderan faltantes y costes por la probabilidad hipotética de retraso.",
 "No utiliza datos reales de proveedor, capacidad de fábrica ni distribuciones empíricas de plazo. La normalidad y la probabilidad son hipótesis.",
 [["Demanda durante plazo normal",rnd(muNormal)],["Demanda durante plazo retrasado",rnd(muDelayed)],["Falta esperada con plazo normal",rnd(n)],["Falta esperada con retraso",rnd(d)]]
 );
}
function purchaseLots(p){
 const cap=Math.max(0,p.capacity-p.onHand);
 const upper=Math.floor(Math.min(p.budget/p.unitCost,cap)/p.moq);
 const evalOrder=k=>{
  const q=k*p.moq,stock=p.onHand+q;
  const miss=Math.max(0,p.demand-stock);
  const excess=Math.max(0,stock-p.demand);
  return {q,miss,excess,cost:q*p.unitCost+miss*p.shortage+excess*p.holding};
 };
 let best=evalOrder(0);
 for(let k=1;k<=upper;k++){const v=evalOrder(k);if(v.cost<best.cost)best=v;}
 const target=Math.max(0,p.demand-p.onHand),naive=evalOrder(Math.min(upper,Math.ceil(target/p.moq)));
 return out([
  m("order",best.q),m("shortage",best.miss),
  m("stock",best.excess),m("delta",naive.cost-best.cost,"eur")
 ],vis(["Pedido heurístico","Plan calculado"],[ser("actual",[naive.q,best.q]),ser("shortage",[naive.miss,best.miss])]),
 "Búsqueda exacta entre múltiplos del pedido mínimo, respetando presupuesto y capacidad. Coste = compras + demanda no cubierta + exceso de stock.",
 "No contempla descuentos escalonados, recepción parcial, caducidad por lote, proveedores múltiples ni contratos reales.",
 [["Máximo de lotes factibles",upper],["Coste escenario calculado",rnd(best.cost)],["Coste heurístico",rnd(naive.cost)],["Unidades disponibles tras pedido",p.onHand+best.q]],
 upper===0&&target>0?"Presupuesto o capacidad insuficiente para comprar el lote mínimo.":""
 );
}
function customerMargin(p){
 const gross=p.orders*p.ticket*(1-p.discount/100);
 const returned=p.orders*p.returns/100;
 const costs=p.orders*(p.productCost+p.handling+p.delivery)+returned*p.refundCost;
 const profit=gross-costs,margin=gross?profit/gross*100:0;
 const referenceGross=p.orders*p.ticket;
 const referenceProfit=referenceGross-costs;
 return out([
  m("revenue",gross,"eur"),m("profit",profit,"eur"),
  m("margin",margin,"pct"),m("cost",costs,"eur")
 ],vis(["Ingresos","Producto","Operación","Devoluciones"],[ser("amount",[gross,p.orders*p.productCost,p.orders*(p.handling+p.delivery),returned*p.refundCost])],"eur"),
 "Contribución del periodo = facturación neta de descuento menos producto, preparación, reparto y gestión de devoluciones esperadas.",
 "No incluye efectos causales de descuentos en demanda, costes fiscales, rentabilidad futura ni datos reales de clientes.",
 [["Pedidos devueltos (esperados)",rnd(returned)],["Ingreso sin descuento",rnd(referenceGross)],["Diferencia por descuento",rnd(referenceProfit-profit)],["Coste operacional",rnd(p.orders*(p.handling+p.delivery))]],
 profit<0?"El cliente resulta deficitario con los costes y descuentos supuestos.":""
 );
}
function assortment(p){
 const slowSkus=p.skus*p.slow/100;
 const slowUnits=slowSkus*p.units;
 const carrying=slowUnits*p.holding;
 const obsolete=slowUnits*p.obsolete/100*p.cost;
 const holdExpected=carrying+obsolete;
 const liquidationRevenue=slowUnits*p.cost*(1-p.markdown/100);
 const initialValue=slowUnits*p.cost;
 const lossOnLiquidation=initialValue-liquidationRevenue;
 const shouldLiquidate=lossOnLiquidation<holdExpected;
 const selectedCost=Math.min(lossOnLiquidation,holdExpected);
 return out([
  m("stock",slowUnits),m("cost",selectedCost,"eur"),m("delta",Math.abs(holdExpected-lossOnLiquidation),"eur"),
  m("coverage",p.slow,"pct")
 ],vis(["Mantener","Liquidar"],[ser("total",[holdExpected,lossOnLiquidation])],"eur"),
 "Comparación de dos políticas ilustrativas: mantener inventario lento (coste de posesión y pérdida esperada por obsolescencia) o liquidar con descuento sobre coste.",
 "No estima demanda, elasticidad real, valor residual ni contratos de liquidación. Las unidades son aproximaciones agregadas, no un plan SKU a SKU.",
 [["SKU de baja rotación (estimados)",rnd(slowSkus)],["Valor de compra en stock lento",rnd(initialValue)],["Pérdida esperada por mantener",rnd(holdExpected)],["Política más barata (supuesto)",shouldLiquidate?"Liquidar":"Mantener"]]
 );
}
export const wholesaleCalculators={transfer,supplierRisk,purchaseLots,customerMargin,assortment};
