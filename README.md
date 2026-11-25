# SC-Analytics | Decision Intelligence Solutions Lab v3

**Seven interactive disciplines, 32 business situations, all monetary examples in euros (€).** Executive-facing business demos with functioning local calculation engines and reproducible, fictional records.

**Public hub:** https://sastree14.github.io/demos-sc_analytics/

These are interactive examples built by [SC-Analytics](https://www.sc-analytics.io/), a data-science and mathematical-optimisation consultancy. For the corresponding professional services, see [demand planning and forecasting](https://www.sc-analytics.io/services/demand-planning), [inventory optimisation](https://www.sc-analytics.io/services/inventory-optimization), and [AI automation](https://www.sc-analytics.io/services/ai-automation). The demos use synthetic data; they are not client results.

## Seven service families

| Discipline | Demo | Questions |
|---|---|---|
| Predictive Intelligence | [Open](https://sastree14.github.io/demos-sc_analytics/predictive-models/) | Demand, revenue, workforce, churn, delivery risk, cost regression, anomalies (7) |
| Mathematical Optimisation | [Open](https://sastree14.github.io/demos-sc_analytics/optimization/) | Resource budgets, shifts, fleet, production, inventory (5) |
| Modelling & Scenarios | [Open](https://sastree14.github.io/demos-sc_analytics/modelling-scenarios/) | Pricing, investment NPV, recurring revenue, hiring vs outsourcing (4) |
| Simulation & Risk | [Open](https://sastree14.github.io/demos-sc_analytics/simulations/) | Inventory Monte Carlo, service queues, project delivery, stress tests (4) |
| BI & Reporting | [Open](https://sastree14.github.io/demos-sc_analytics/bi-reporting/) | Sales, logistics, profitability, executive reporting (4) |
| Automation & AI | [Open](https://sastree14.github.io/demos-sc_analytics/automation-ai/) | Invoice rules, order exceptions, service routing, AI-style workflow prototype (4) |
| Custom Business Applications | [Open](https://sastree14.github.io/demos-sc_analytics/custom-apps/) | CRM, purchasing approvals, service desk, vehicle lifecycle management (4) |

The original detailed solver is still available at [Advanced Inventory Optimisation](https://sastree14.github.io/demos-sc_analytics/optimization/inventory.html).

## The decision workspace

Each service uses a distinct pastel identity and keeps consistent cross-service navigation. The business workbench displays actual calculated KPIs and outputs, then a transparent **What should you do next?** recommendation: act/review options, prepare a contingency, wait and monitor, or request human review. Every state includes a reason, decision threshold, action and next review.

The **Decision Guide** is an interactive browser-only, rules-based explainer. It can answer questions about the current model, thresholds, scenarios, risk and financial assumptions, or explain a clicked KPI or a parameter using its **?** control. It can propose a **+10% what-if** and waits for user confirmation before applying and rerunning. It is not a connected LLM and makes no remote changes.

Use **Alternative A** and **Alternative B** to save two scenarios within the session and compare their calculated outputs with the current plan. Values correspond to the last completed calculation, never an unexecuted slider change.

**Open full report** displays a four-section PDF-like executive reader: decision summary, underlying evidence and chart, scenario comparison, and proposed actions with monitoring thresholds. Users can download a self-contained HTML report or print/save PDF from the browser. Data exports as CSV are also available.

Each workflow progresses visibly for approximately **1.9 seconds per step** in presentation mode; a real policy condition can lead to a warning. **Quick mode** bypasses the artificial presentation delay during ordinary use. Delays are explicitly visual, not claimed compute time.

An optional browser-only **white-label preview** allows a presenter to customise the guide and report name while retaining SC-Analytics attribution. No client information is stored or transmitted.

## Rigour and limitations

All datasets, organisations and transactions are fictional and reproducible. Economic figures are model outputs or explicit assumptions, not verified real client savings. Forecast uncertainty bands and simulation distributions are not guaranteed confidence bounds without real calibration.

The optimisation branch uses exact feasible searches across resource portfolios, staff shifts, vehicle assignments and production batches; the original inventory case continues to use an exact discrete two-constraint dynamic programme. Each case documents what its solver includes and omits.

The AI-style workflows demonstrate deterministic rules and synthetic scores, not real LLM inference. No email, payment, purchase, approval, customer record or external CRM/ERP is changed. The local Decision Guide does not make autonomous business decisions.

## Run and test

Serve the repo with 'python -m http.server 8000' and open http://localhost:8000/. Run 'npm test' for the analytical regression suite.

The GitHub Pages action builds the static release with Node.js 22, runs all tests, and copies all seven service branches and the shared assets into dist. Confirm GitHub Pages is configured to publish from GitHub Actions and the last workflow succeeded before treating the public links as live.

© 2026 SC-Analytics. All rights reserved. No general licence granted by default.
