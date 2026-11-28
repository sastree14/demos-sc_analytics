/* Public, synthetic demonstration metadata only. Internal commercial research remains in the private CMI. */
export const INDUSTRY_CATALOG = {
  "version": "1.0-preview",
  "data": "synthetic",
  "sectors": [
    {
      "code": "SC01",
      "name": "Logística y transporte",
      "accent": "#458774",
      "first_screen_hypothesis": "Plan diario, mapa operativo, entregas en riesgo y coste por ruta",
      "pain_points": [
        {
          "id": "SC01-P01",
          "title": "Rentabilidad por ruta y cliente",
          "example_controls": "Tarifa, kilómetros, esperas y costes",
          "indicative_kpi": "Margen por ruta, €/entrega",
          "model": "routeMargin",
          "scenario_seed": 137
        },
        {
          "id": "SC01-P02",
          "title": "Kilómetros vacíos y retornos",
          "example_controls": "Capacidad y posibilidades de retorno",
          "indicative_kpi": "Km sin carga y coste total",
          "model": "backhaul",
          "scenario_seed": 178
        },
        {
          "id": "SC01-P03",
          "title": "Asignación de flota y conductores",
          "example_controls": "Vehículos, turnos, restricciones y pedidos",
          "indicative_kpi": "Utilización, puntualidad, rutas factibles",
          "model": "fleet",
          "scenario_seed": 219
        },
        {
          "id": "SC01-P04",
          "title": "Incidencias y replanificación",
          "example_controls": "Vehículo no disponible, retraso, urgencia",
          "indicative_kpi": "Entregas a tiempo y coste de contingencia",
          "model": "incident",
          "scenario_seed": 260
        },
        {
          "id": "SC01-P05",
          "title": "Previsión de carga por delegación",
          "example_controls": "Demanda estimada, calendario y capacidad",
          "indicative_kpi": "Brecha entre demanda y flota",
          "model": "forecast",
          "scenario_seed": 301
        },
        {
          "id": "SC01-P06",
          "title": "Tarifas y subcontratación",
          "example_controls": "Coste propio, tarifa, margen mínimo",
          "indicative_kpi": "Margen contractual y alternativa viable",
          "model": "subcontract",
          "scenario_seed": 342
        }
      ]
    },
    {
      "code": "SC02",
      "name": "Distribución mayorista",
      "accent": "#4e7992",
      "first_screen_hypothesis": "Tarjetas de stock, disponibilidad por SKU y capital inmovilizado",
      "pain_points": [
        {
          "id": "SC02-P01",
          "title": "Sobrestock y faltas de SKU",
          "example_controls": "Previsión, inventario, coste y demanda",
          "indicative_kpi": "Días de stock y fill rate",
          "model": "inventory",
          "scenario_seed": 388
        },
        {
          "id": "SC02-P02",
          "title": "Reposición entre almacenes",
          "example_controls": "Stock por centro, lead time y demanda",
          "indicative_kpi": "Coste de transferencia y roturas",
          "model": "transfer",
          "scenario_seed": 429
        },
        {
          "id": "SC02-P03",
          "title": "Variabilidad de proveedores",
          "example_controls": "Plazos y fiabilidad de suministro",
          "indicative_kpi": "Nivel de servicio y stock de seguridad",
          "model": "supplierRisk",
          "scenario_seed": 470
        },
        {
          "id": "SC02-P04",
          "title": "Pedidos mínimos y lotes de compra",
          "example_controls": "MOQ, presupuesto y espacio disponible",
          "indicative_kpi": "Inventario y capital comprometido",
          "model": "purchaseLots",
          "scenario_seed": 511
        },
        {
          "id": "SC02-P05",
          "title": "Rentabilidad por cliente y pedido",
          "example_controls": "Tarifa, volumen, logística y devoluciones",
          "indicative_kpi": "Margen de contribución",
          "model": "customerMargin",
          "scenario_seed": 552
        },
        {
          "id": "SC02-P06",
          "title": "Surtido y obsolescencia",
          "example_controls": "Rotación, estacionalidad y caducidad",
          "indicative_kpi": "Valor lento/obsoleto y rotación",
          "model": "assortment",
          "scenario_seed": 593
        }
      ]
    },
    {
      "code": "SC03",
      "name": "Industria manufacturera",
      "accent": "#a27a52",
      "first_screen_hypothesis": "Secuencia de órdenes visible, estado de máquinas y retrasos",
      "pain_points": [
        {
          "id": "SC03-P01",
          "title": "Secuenciación y cuellos de botella",
          "example_controls": "Órdenes, tiempos de cambio y prioridades",
          "indicative_kpi": "Throughput y retraso de pedidos",
          "model": "mfSequence",
          "scenario_seed": 639
        },
        {
          "id": "SC03-P02",
          "title": "Capacidad y turnos",
          "example_controls": "Máquinas, personal, turnos y carga",
          "indicative_kpi": "Horas necesarias y uso de capacidad",
          "model": "mfCapacity",
          "scenario_seed": 680
        },
        {
          "id": "SC03-P03",
          "title": "Paradas y mantenimiento",
          "example_controls": "Disponibilidad, ventanas y riesgo de fallo",
          "indicative_kpi": "Horas de parada y producción no realizada",
          "model": "mfMaintenance",
          "scenario_seed": 721
        },
        {
          "id": "SC03-P04",
          "title": "Calidad y rendimiento de proceso",
          "example_controls": "Parámetros y defectos por lote",
          "indicative_kpi": "Scrap, rendimiento y variación",
          "model": "mfQuality",
          "scenario_seed": 762
        },
        {
          "id": "SC03-P05",
          "title": "Materias primas y aprovisionamiento",
          "example_controls": "Disponibilidad, plazo y órdenes",
          "indicative_kpi": "Riesgo de parada por material",
          "model": "mfMaterials",
          "scenario_seed": 803
        },
        {
          "id": "SC03-P06",
          "title": "Consumo energético por orden",
          "example_controls": "Horas máquina, picos, precio energético",
          "indicative_kpi": "€/unidad y coste por escenario",
          "model": "mfEnergy",
          "scenario_seed": 844
        }
      ]
    },
    {
      "code": "SC04",
      "name": "Alimentación y bebidas",
      "accent": "#71946b",
      "first_screen_hypothesis": "Inventario por lote, demanda diaria y alerta de caducidad",
      "pain_points": [
        {
          "id": "SC04-P01",
          "title": "Demanda volátil y roturas",
          "example_controls": "Calendario, previsión y capacidad",
          "indicative_kpi": "Error de demanda y fill rate",
          "model": "fbDemand",
          "scenario_seed": 890
        },
        {
          "id": "SC04-P02",
          "title": "Merma y caducidad",
          "example_controls": "Vida útil, ritmo de venta y FEFO",
          "indicative_kpi": "Merma € y producto caducado",
          "model": "fbExpiry",
          "scenario_seed": 931
        },
        {
          "id": "SC04-P03",
          "title": "Tamaño óptimo de lote",
          "example_controls": "Pedidos, cambios de línea y stock",
          "indicative_kpi": "Coste de lote y servicio",
          "model": "fbBatch",
          "scenario_seed": 972
        },
        {
          "id": "SC04-P04",
          "title": "Promociones y picos de demanda",
          "example_controls": "Campaña, uplift y capacidad",
          "indicative_kpi": "Ventas no servidas y merma",
          "model": "fbPromo",
          "scenario_seed": 1013
        },
        {
          "id": "SC04-P05",
          "title": "Distribución refrigerada",
          "example_controls": "Ventanas, vehículos y restricciones térmicas",
          "indicative_kpi": "Coste y cumplimiento de ventanas",
          "model": "fbColdRoute",
          "scenario_seed": 1054
        },
        {
          "id": "SC04-P06",
          "title": "Variabilidad de materias primas",
          "example_controls": "Plazos, recetas, stock de seguridad",
          "indicative_kpi": "Coste de falta y exceso de materia",
          "model": "fbSupply",
          "scenario_seed": 1095
        }
      ]
    },
    {
      "code": "SC05",
      "name": "Farmacéutico y químico",
      "accent": "#6888a3",
      "first_screen_hypothesis": "Trazabilidad por lote, estados de validación y rangos aprobados",
      "pain_points": [
        {
          "id": "SC05-P01",
          "title": "Desviaciones de lote y rendimiento",
          "example_controls": "Datos de proceso y lotes sintéticos",
          "indicative_kpi": "Yield y no conformidades",
          "model": "phBatch",
          "scenario_seed": 1141
        },
        {
          "id": "SC05-P02",
          "title": "Liberación y cuellos QA",
          "example_controls": "Cola de lotes, tiempo de revisión",
          "indicative_kpi": "Tiempo de liberación y WIP",
          "model": "phRelease",
          "scenario_seed": 1182
        },
        {
          "id": "SC05-P03",
          "title": "Materias primas críticas",
          "example_controls": "Caducidad, proveedor y lead time",
          "indicative_kpi": "Riesgo de ruptura y stock",
          "model": "phCritical",
          "scenario_seed": 1223
        },
        {
          "id": "SC05-P04",
          "title": "Programación de campañas",
          "example_controls": "Equipos, limpiezas y órdenes",
          "indicative_kpi": "Capacidad, tiempos de cambio",
          "model": "phCampaign",
          "scenario_seed": 1264
        },
        {
          "id": "SC05-P05",
          "title": "Anomalías de proceso",
          "example_controls": "Tendencias multivariantes sintéticas",
          "indicative_kpi": "Señales para revisión experta",
          "model": "phAnomaly",
          "scenario_seed": 1305
        },
        {
          "id": "SC05-P06",
          "title": "Trazabilidad documental",
          "example_controls": "Eventos y excepciones por lote",
          "indicative_kpi": "Tiempo de búsqueda e incidencias",
          "model": "phTrace",
          "scenario_seed": 1346
        }
      ]
    },
    {
      "code": "SC06",
      "name": "Restauración organizada",
      "accent": "#a56f79",
      "first_screen_hypothesis": "Vista por restaurante y franja: tickets, cola, personas y merma",
      "pain_points": [
        {
          "id": "SC06-P01",
          "title": "Turnos frente a demanda por hora",
          "example_controls": "Tickets previstos y personal disponible",
          "indicative_kpi": "Coste laboral y tiempo de espera",
          "model": "rsShifts",
          "scenario_seed": 1392
        },
        {
          "id": "SC06-P02",
          "title": "Desperdicio y mise en place",
          "example_controls": "Recetas, ventas y preparación",
          "indicative_kpi": "Merma y disponibilidad",
          "model": "rsPrep",
          "scenario_seed": 1433
        },
        {
          "id": "SC06-P03",
          "title": "Rentabilidad por local",
          "example_controls": "Ventas, costes, horas y canal",
          "indicative_kpi": "Margen operativo por local",
          "model": "rsStoreProfit",
          "scenario_seed": 1474
        },
        {
          "id": "SC06-P04",
          "title": "Diseño de menú y precios",
          "example_controls": "Mix, coste ingrediente y precio",
          "indicative_kpi": "Contribución por plato",
          "model": "rsMenu",
          "scenario_seed": 1515
        },
        {
          "id": "SC06-P05",
          "title": "Delivery y picos de pedidos",
          "example_controls": "Pedidos por canal y preparación",
          "indicative_kpi": "Tiempo de preparación y servicio",
          "model": "rsDelivery",
          "scenario_seed": 1556
        },
        {
          "id": "SC06-P06",
          "title": "Compras multiestablecimiento",
          "example_controls": "Proveedor, frecuencia, volumen",
          "indicative_kpi": "Coste total y roturas",
          "model": "rsPurchasing",
          "scenario_seed": 1597
        }
      ]
    },
    {
      "code": "SC07",
      "name": "Hoteles y alojamientos",
      "accent": "#b18b5e",
      "first_screen_hypothesis": "Calendario de ocupación, cancelaciones y carga de housekeeping",
      "pain_points": [
        {
          "id": "SC07-P01",
          "title": "Ocupación y cancelaciones",
          "example_controls": "Pick-up, lead time y temporada",
          "indicative_kpi": "Ocupación y riesgo de cancelación",
          "model": "htOccupancy",
          "scenario_seed": 1643
        },
        {
          "id": "SC07-P02",
          "title": "Precio y mix de canales",
          "example_controls": "ADR, comisiones y demanda",
          "indicative_kpi": "RevPAR y margen por canal",
          "model": "htChannels",
          "scenario_seed": 1684
        },
        {
          "id": "SC07-P03",
          "title": "Personal de limpieza",
          "example_controls": "Check-outs, habitaciones y turnos",
          "indicative_kpi": "Tiempo de preparación y horas extra",
          "model": "htHousekeeping",
          "scenario_seed": 1725
        },
        {
          "id": "SC07-P04",
          "title": "Sobrecarga en recepción",
          "example_controls": "Llegadas, turnos y canales",
          "indicative_kpi": "Espera y cumplimiento",
          "model": "htReception",
          "scenario_seed": 1766
        },
        {
          "id": "SC07-P05",
          "title": "Costes de energía por ocupación",
          "example_controls": "Ocupación y tarifa energética",
          "indicative_kpi": "€/habitación ocupada",
          "model": "htEnergy",
          "scenario_seed": 1807
        },
        {
          "id": "SC07-P06",
          "title": "Reservas de grupos y capacidad",
          "example_controls": "Bloques, cancelaciones y opciones",
          "indicative_kpi": "Desplazamiento de demanda y rentabilidad",
          "model": "htGroupBooking",
          "scenario_seed": 1848
        }
      ]
    },
    {
      "code": "SC08",
      "name": "Retail y e-commerce",
      "accent": "#9277a3",
      "first_screen_hypothesis": "Funnel por SKU/canal, margen neto y riesgo de devolución",
      "pain_points": [
        {
          "id": "SC08-P01",
          "title": "Promociones que erosionan margen",
          "example_controls": "Descuento, uplift y costes",
          "indicative_kpi": "Margen incremental y ROI",
          "model": "rtPromo",
          "scenario_seed": 1894
        },
        {
          "id": "SC08-P02",
          "title": "Roturas de talla/SKU",
          "example_controls": "Demanda, inventario y distribución",
          "indicative_kpi": "Ventas perdidas y fill rate",
          "model": "rtSizes",
          "scenario_seed": 1935
        },
        {
          "id": "SC08-P03",
          "title": "Devoluciones por canal",
          "example_controls": "Motivos, tasas y costes logísticos",
          "indicative_kpi": "Margen neto por SKU/canal",
          "model": "rtReturns",
          "scenario_seed": 1976
        },
        {
          "id": "SC08-P04",
          "title": "Stock omnicanal",
          "example_controls": "Disponibilidad, tiendas y pedidos",
          "indicative_kpi": "Transferencias y stockouts",
          "model": "rtOmnichannel",
          "scenario_seed": 2017
        },
        {
          "id": "SC08-P05",
          "title": "Rentabilidad de adquisición",
          "example_controls": "CAC, margen, recompra y devoluciones",
          "indicative_kpi": "Contribución neta y payback",
          "model": "rtAcquisition",
          "scenario_seed": 2058
        },
        {
          "id": "SC08-P06",
          "title": "Surtido y productos lentos",
          "example_controls": "Estacionalidad, rotación y demanda",
          "indicative_kpi": "Stock muerto y conversión",
          "model": "rtAssortment",
          "scenario_seed": 2099
        }
      ]
    },
    {
      "code": "SC09",
      "name": "Clínicas y centros sanitarios",
      "accent": "#648d97",
      "first_screen_hypothesis": "Agenda agregada, salas libres y lista de espera, sin datos clínicos",
      "pain_points": [
        {
          "id": "SC09-P01",
          "title": "No-shows y huecos en agenda",
          "example_controls": "Probabilidades agregadas, avisos y franjas",
          "indicative_kpi": "Huecos recuperables y ocupación",
          "model": "clNoShow",
          "scenario_seed": 2145
        },
        {
          "id": "SC09-P02",
          "title": "Listas de espera y prioridades",
          "example_controls": "Duraciones, disponibilidad y recursos",
          "indicative_kpi": "Espera media por servicio",
          "model": "clWaitlist",
          "scenario_seed": 2186
        },
        {
          "id": "SC09-P03",
          "title": "Asignación de salas",
          "example_controls": "Especialidades, equipamiento y turnos",
          "indicative_kpi": "Utilización de salas",
          "model": "clRooms",
          "scenario_seed": 2227
        },
        {
          "id": "SC09-P04",
          "title": "Carga administrativa",
          "example_controls": "Tipos de trámite y tiempos",
          "indicative_kpi": "Horas de gestión y errores",
          "model": "clAdmin",
          "scenario_seed": 2268
        },
        {
          "id": "SC09-P05",
          "title": "Picos en recepción",
          "example_controls": "Llegadas, recursos y duración",
          "indicative_kpi": "Tiempo de espera",
          "model": "clReception",
          "scenario_seed": 2309
        },
        {
          "id": "SC09-P06",
          "title": "Coste y utilización por servicio",
          "example_controls": "Costes agregados, citas y disponibilidad",
          "indicative_kpi": "Margen de servicio agregado",
          "model": "clUnitCost",
          "scenario_seed": 2350
        }
      ]
    },
    {
      "code": "SC10",
      "name": "Construcción e instalaciones",
      "accent": "#98836e",
      "first_screen_hypothesis": "Cronograma de hitos, coste comprometido y recursos por obra",
      "pain_points": [
        {
          "id": "SC10-P01",
          "title": "Desviación de plazo",
          "example_controls": "Hitos, dependencias y recursos",
          "indicative_kpi": "Retraso esperado y ruta crítica",
          "model": "coTimeline",
          "scenario_seed": 2396
        },
        {
          "id": "SC10-P02",
          "title": "Coste de obra frente a presupuesto",
          "example_controls": "Certificaciones, horas, compras",
          "indicative_kpi": "Desviación de coste y margen",
          "model": "coBudget",
          "scenario_seed": 2437
        },
        {
          "id": "SC10-P03",
          "title": "Asignación de cuadrillas",
          "example_controls": "Competencias, obras y disponibilidad",
          "indicative_kpi": "Horas ociosas y fechas factibles",
          "model": "coCrews",
          "scenario_seed": 2478
        },
        {
          "id": "SC10-P04",
          "title": "Materiales críticos tardíos",
          "example_controls": "Lead time, consumo y órdenes",
          "indicative_kpi": "Probabilidad de parar obra",
          "model": "coMaterials",
          "scenario_seed": 2519
        },
        {
          "id": "SC10-P05",
          "title": "Coordinación de subcontratas",
          "example_controls": "Ventanas, dependencias y capacidad",
          "indicative_kpi": "Retrabajos y replanificaciones",
          "model": "coPartners",
          "scenario_seed": 2560
        },
        {
          "id": "SC10-P06",
          "title": "Caja y pagos por hitos",
          "example_controls": "Cobros, pagos y escenarios de retraso",
          "indicative_kpi": "Caja neta proyectada",
          "model": "coCash",
          "scenario_seed": 2601
        }
      ]
    },
    {
      "code": "SC11",
      "name": "Inmobiliario y gestión de activos",
      "accent": "#688174",
      "first_screen_hypothesis": "Cartera por activo: ocupación, NOI, incidencias y caja",
      "pain_points": [
        {
          "id": "SC11-P01",
          "title": "Vacancia y rotación",
          "example_controls": "Entrada/salida, plazos, mercado simulado",
          "indicative_kpi": "Vacancia y NOI",
          "model": "reVacancy",
          "scenario_seed": 2647
        },
        {
          "id": "SC11-P02",
          "title": "Mantenimiento reactivo",
          "example_controls": "Incidencias, coste y criticidad",
          "indicative_kpi": "Tiempo de resolución y coste",
          "model": "reMaintenance",
          "scenario_seed": 2688
        },
        {
          "id": "SC11-P03",
          "title": "Rentabilidad por activo",
          "example_controls": "Renta, OPEX y CAPEX",
          "indicative_kpi": "NOI y rendimiento",
          "model": "reAssets",
          "scenario_seed": 2729
        },
        {
          "id": "SC11-P04",
          "title": "Planificación de CAPEX",
          "example_controls": "Presupuestos, vida útil, prioridades",
          "indicative_kpi": "VAN y retorno por activo",
          "model": "reCapex",
          "scenario_seed": 2770
        },
        {
          "id": "SC11-P05",
          "title": "Morosidad agregada de alquileres",
          "example_controls": "Vencimientos y cobros agregados",
          "indicative_kpi": "Saldo pendiente y previsión de caja",
          "model": "reArrears",
          "scenario_seed": 2811
        },
        {
          "id": "SC11-P06",
          "title": "Proveedores de mantenimiento",
          "example_controls": "Disponibilidad, coste y SLA",
          "indicative_kpi": "Cumplimiento y coste por intervención",
          "model": "reVendors",
          "scenario_seed": 2852
        }
      ]
    },
    {
      "code": "SC12",
      "name": "Servicios financieros y seguros",
      "accent": "#627e99",
      "first_screen_hypothesis": "Dos entradas separadas: FINANZAS o SEGUROS; trazabilidad y controles",
      "pain_points": [
        {
          "id": "SC12-P01",
          "title": "Finanzas | Alertas de fraude",
          "example_controls": "Umbral, revisión humana y prevalencia simulada",
          "indicative_kpi": "Falsos positivos, recall y carga de revisión",
          "model": "fiAlerts",
          "scenario_seed": 2898
        },
        {
          "id": "SC12-P02",
          "title": "Finanzas | Deterioro de cartera",
          "example_controls": "Exposición y escenarios de impago",
          "indicative_kpi": "Pérdida esperada ilustrativa",
          "model": "fiPortfolio",
          "scenario_seed": 2939
        },
        {
          "id": "SC12-P03",
          "title": "Finanzas | Conciliación y excepciones",
          "example_controls": "Cobros, partidas y reglas",
          "indicative_kpi": "Diferencias y tiempo de resolución",
          "model": "fiReconcile",
          "scenario_seed": 2980
        },
        {
          "id": "SC12-P04",
          "title": "Seguros | Triaje de siniestros",
          "example_controls": "Complejidad, cola y prioridad",
          "indicative_kpi": "Tiempo a primera revisión",
          "model": "fiClaimsDocs",
          "scenario_seed": 3021
        },
        {
          "id": "SC12-P05",
          "title": "Seguros | Reservas y frecuencia",
          "example_controls": "Frecuencia, coste y desarrollo sintético",
          "indicative_kpi": "Coste medio y reservas simuladas",
          "model": "fiReserve",
          "scenario_seed": 3062
        },
        {
          "id": "SC12-P06",
          "title": "Seguros | Capacidad de tramitación",
          "example_controls": "Dotación y volúmenes",
          "indicative_kpi": "Cola y SLA",
          "model": "fiCapacity",
          "scenario_seed": 3103
        }
      ]
    },
    {
      "code": "SC13",
      "name": "Consultorías y servicios profesionales",
      "accent": "#897db0",
      "first_screen_hypothesis": "Pipeline, carga por consultor y márgenes de proyectos; ruta partner diferenciada",
      "pain_points": [
        {
          "id": "SC13-P01",
          "title": "Rentabilidad de proyectos cerrados",
          "example_controls": "Presupuesto fijo, horas y desviaciones",
          "indicative_kpi": "Margen y esfuerzo no facturable",
          "model": "csProjects",
          "scenario_seed": 3149
        },
        {
          "id": "SC13-P02",
          "title": "Planificación de capacidad",
          "example_controls": "Consultores, skills, disponibilidad",
          "indicative_kpi": "Utilización y retrasos",
          "model": "csCapacity",
          "scenario_seed": 3190
        },
        {
          "id": "SC13-P03",
          "title": "Forecast de ventas/proyectos",
          "example_controls": "Pipeline, probabilidad y duración",
          "indicative_kpi": "Ingresos y necesidad de capacidad",
          "model": "csPipeline",
          "scenario_seed": 3231
        },
        {
          "id": "SC13-P04",
          "title": "Scope creep y desviaciones",
          "example_controls": "Cambios, horas y entregables",
          "indicative_kpi": "Coste de ampliaciones",
          "model": "csScope",
          "scenario_seed": 3272
        },
        {
          "id": "SC13-P05",
          "title": "Automatización documental",
          "example_controls": "Plantillas, aprobaciones y errores",
          "indicative_kpi": "Horas y calidad de entrega",
          "model": "csDocs",
          "scenario_seed": 3313
        },
        {
          "id": "SC13-P06",
          "title": "Partner de entrega especializada",
          "example_controls": "Brief cliente, alcance y capacidades internas",
          "indicative_kpi": "Encaje técnico y esfuerzo",
          "model": "csPartner",
          "scenario_seed": 3354
        }
      ]
    },
    {
      "code": "SC14",
      "name": "Servicios y mantenimiento",
      "accent": "#7e9781",
      "first_screen_hypothesis": "Mapa de técnicos, SLA, urgencias y piezas disponibles",
      "pain_points": [
        {
          "id": "SC14-P01",
          "title": "Asignación técnico-aviso",
          "example_controls": "Skills, ubicación, prioridad y turnos",
          "indicative_kpi": "SLA y coste por orden",
          "model": "svDispatch",
          "scenario_seed": 3400
        },
        {
          "id": "SC14-P02",
          "title": "Primer arreglo a la primera",
          "example_controls": "Inventario de piezas, tipo de avería",
          "indicative_kpi": "First-time-fix y segundas visitas",
          "model": "svFirstFix",
          "scenario_seed": 3441
        },
        {
          "id": "SC14-P03",
          "title": "Mantenimiento preventivo",
          "example_controls": "Frecuencia, criticidad y riesgo",
          "indicative_kpi": "Averías y coste preventivo",
          "model": "svPreventive",
          "scenario_seed": 3482
        },
        {
          "id": "SC14-P04",
          "title": "Urgencias y replanificación",
          "example_controls": "Nuevos avisos, disponibilidad",
          "indicative_kpi": "SLA incumplidos y tiempo de llegada",
          "model": "svUrgent",
          "scenario_seed": 3523
        },
        {
          "id": "SC14-P05",
          "title": "Rentabilidad por contrato",
          "example_controls": "Visitas, km y horas",
          "indicative_kpi": "Margen por cliente/contrato",
          "model": "svContract",
          "scenario_seed": 3564
        },
        {
          "id": "SC14-P06",
          "title": "Repuestos en vehículos",
          "example_controls": "Consumo, técnicos y lead times",
          "indicative_kpi": "Roturas y capital en stock",
          "model": "svVans",
          "scenario_seed": 3605
        }
      ]
    },
    {
      "code": "SC15",
      "name": "Tecnología, software y SaaS",
      "accent": "#6677a6",
      "first_screen_hypothesis": "Funnel de activación, retención y costes; transparencia de métricas",
      "pain_points": [
        {
          "id": "SC15-P01",
          "title": "Churn y retención",
          "example_controls": "Cohortes, uso y supuestos",
          "indicative_kpi": "NRR y cuentas en riesgo",
          "model": "saRetention",
          "scenario_seed": 3651
        },
        {
          "id": "SC15-P02",
          "title": "Onboarding que no activa",
          "example_controls": "Eventos de producto y tareas",
          "indicative_kpi": "Time-to-value y activación",
          "model": "saActivation",
          "scenario_seed": 3692
        },
        {
          "id": "SC15-P03",
          "title": "Errores de agentes IA",
          "example_controls": "Umbrales, casos sintéticos y feedback",
          "indicative_kpi": "Tasa de error y escalados",
          "model": "saAgents",
          "scenario_seed": 3733
        },
        {
          "id": "SC15-P04",
          "title": "Coste de inferencia y soporte",
          "example_controls": "Volumen, rutas y modelos",
          "indicative_kpi": "€/ticket y coste mensual",
          "model": "saCost",
          "scenario_seed": 3774
        },
        {
          "id": "SC15-P05",
          "title": "Forecast de MRR/ARR",
          "example_controls": "Altas, expansión y bajas",
          "indicative_kpi": "MRR, ARR y rango",
          "model": "saMRR",
          "scenario_seed": 3815
        },
        {
          "id": "SC15-P06",
          "title": "Colas de soporte e integración",
          "example_controls": "Tickets, SLAs y personal",
          "indicative_kpi": "Tiempo de resolución y backlog",
          "model": "saSupport",
          "scenario_seed": 3856
        }
      ]
    },
    {
      "code": "SC16",
      "name": "Educación y formación",
      "accent": "#a38670",
      "first_screen_hypothesis": "Calendario de grupos, plazas y seguimiento agregado",
      "pain_points": [
        {
          "id": "SC16-P01",
          "title": "Abandono y desvinculación",
          "example_controls": "Asistencia agregada y comportamiento LMS ficticio",
          "indicative_kpi": "Retención y alertas revisables",
          "model": "edEngagement",
          "scenario_seed": 3902
        },
        {
          "id": "SC16-P02",
          "title": "Programación de horarios",
          "example_controls": "Profesores, aulas, disponibilidades",
          "indicative_kpi": "Conflictos y utilización",
          "model": "edTimetable",
          "scenario_seed": 3943
        },
        {
          "id": "SC16-P03",
          "title": "Rentabilidad por curso",
          "example_controls": "Matrículas, costes y capacidad",
          "indicative_kpi": "Margen por cohorte",
          "model": "edCourse",
          "scenario_seed": 3984
        },
        {
          "id": "SC16-P04",
          "title": "Demanda de nuevas matrículas",
          "example_controls": "Canal, calendario y cohorte",
          "indicative_kpi": "Plazas necesarias",
          "model": "edEnroll",
          "scenario_seed": 4025
        },
        {
          "id": "SC16-P05",
          "title": "Atención al alumno",
          "example_controls": "Solicitudes, prioridades y equipo",
          "indicative_kpi": "Tiempo de respuesta",
          "model": "edSupport",
          "scenario_seed": 4066
        },
        {
          "id": "SC16-P06",
          "title": "Distribución de recursos docentes",
          "example_controls": "Asignaturas, carga y restricciones",
          "indicative_kpi": "Horas y cobertura",
          "model": "edResources",
          "scenario_seed": 4107
        }
      ]
    },
    {
      "code": "SC17",
      "name": "Energía y servicios industriales",
      "accent": "#6c918e",
      "first_screen_hypothesis": "Curvas de carga, picos y activos sin automatizar sistemas críticos",
      "pain_points": [
        {
          "id": "SC17-P01",
          "title": "Picos de potencia",
          "example_controls": "Perfil de consumo y restricciones",
          "indicative_kpi": "Potencia pico y coste",
          "model": "enPeak",
          "scenario_seed": 4153
        },
        {
          "id": "SC17-P02",
          "title": "Previsión de demanda energética",
          "example_controls": "Producción, calendario y clima sintético",
          "indicative_kpi": "MWh esperados y rango",
          "model": "enForecast",
          "scenario_seed": 4194
        },
        {
          "id": "SC17-P03",
          "title": "Anomalías en equipos",
          "example_controls": "Sensores ficticios y umbrales",
          "indicative_kpi": "Alertas y paradas",
          "model": "enSensors",
          "scenario_seed": 4235
        },
        {
          "id": "SC17-P04",
          "title": "Mantenimiento por criticidad",
          "example_controls": "Probabilidad de fallo y ventanas",
          "indicative_kpi": "Horas de parada esperadas",
          "model": "enPrevent",
          "scenario_seed": 4276
        },
        {
          "id": "SC17-P05",
          "title": "Tarifas y periodos horarios",
          "example_controls": "Contratos, curvas y desplazamiento posible",
          "indicative_kpi": "Coste y ahorro simulado",
          "model": "enTariff",
          "scenario_seed": 4317
        },
        {
          "id": "SC17-P06",
          "title": "Eficiencia por línea",
          "example_controls": "Energía y unidades producidas",
          "indicative_kpi": "kWh/unidad y desviaciones",
          "model": "enEfficiency",
          "scenario_seed": 4358
        }
      ]
    },
    {
      "code": "SC18",
      "name": "Turismo, ocio y eventos",
      "accent": "#a2788d",
      "first_screen_hypothesis": "Calendario con ocupación, entradas, margen y picos de acceso",
      "pain_points": [
        {
          "id": "SC18-P01",
          "title": "Previsión de asistencia",
          "example_controls": "Reservas, cancelaciones y temporada",
          "indicative_kpi": "Aforo estimado y entradas",
          "model": "evAttendance",
          "scenario_seed": 4404
        },
        {
          "id": "SC18-P02",
          "title": "Precio por zona y día",
          "example_controls": "Capacidad, tarifa y demanda",
          "indicative_kpi": "Ingreso y ocupación",
          "model": "evPricing",
          "scenario_seed": 4445
        },
        {
          "id": "SC18-P03",
          "title": "Dimensionamiento de personal",
          "example_controls": "Aforo, accesos y franjas",
          "indicative_kpi": "Coste y tiempo de espera",
          "model": "evStaff",
          "scenario_seed": 4486
        },
        {
          "id": "SC18-P04",
          "title": "Cancelación y meteorología",
          "example_controls": "Escenarios, cobertura y costes",
          "indicative_kpi": "Margen en contingencias",
          "model": "evWeather",
          "scenario_seed": 4527
        },
        {
          "id": "SC18-P05",
          "title": "Colas de acceso y servicios",
          "example_controls": "Llegadas, capacidad y aperturas",
          "indicative_kpi": "Espera y throughput",
          "model": "evQueue",
          "scenario_seed": 4568
        },
        {
          "id": "SC18-P06",
          "title": "Rentabilidad por evento",
          "example_controls": "Ingresos, comisiones y producción",
          "indicative_kpi": "Margen por evento",
          "model": "evProfit",
          "scenario_seed": 4609
        }
      ]
    }
  ]
};
