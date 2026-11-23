# SC-Analytics | Solutions Lab

Seven independent public demonstrations for commercial discovery and executive presentations. Every example uses synthetic business data, transparent scenario assumptions and working calculation engines. Financial displays use **euros (€)** throughout.

## Open the demonstrations

- [Predictive Intelligence](https://sastree14.github.io/demos-sc_analytics/predictive-models/) — Seven forecasting, regression, risk, anomaly and workforce applications
- [Automation & AI](https://sastree14.github.io/demos-sc_analytics/automation-ai/) — Three operational workflows with exception routing and human review
- [Modelling & Scenarios](https://sastree14.github.io/demos-sc_analytics/modelling-scenarios/) — Three numerical models for pricing, investment and subscription economics
- [Optimisation](https://sastree14.github.io/demos-sc_analytics/optimization/) — Exact inventory replenishment allocation under real resource limits
- [Simulation & Risk](https://sastree14.github.io/demos-sc_analytics/simulations/) — Three Monte Carlo and event-driven simulations
- [BI & Reporting](https://sastree14.github.io/demos-sc_analytics/bi-reporting/) — Three management reporting and financial analyses
- [Custom CRM / ERP](https://sastree14.github.io/demos-sc_analytics/custom-apps/) — Three simulated application workspaces with inspectable sample records

## What works

The five new modules share an executive workbench with 15 distinct scenario engines. You can switch business cases, change assumptions, execute calculations, inspect sample business records and download calculated executive briefs as standalone HTML or browser-generated PDFs. Each module supports CSV export. Automation and CRM/ERP demonstrate **local, nonpersistent** sample record reviews only. No real payment, approval, CRM action, email, agent invocation or external data integration occurs.

The predictive models have seven use cases, out-of-sample checks and risk threshold trade-offs; the optimisation example solves a discrete, constrained inventory allocation problem.

## Reproducibility and integrity

- All entities, datasets and transactions are fictional and constructed deterministically.
- Prices, targets, cost estimates, impact values, margins and penalties are assumptions, not realised customer results.
- Forecast error bands are not statistically calibrated confidence intervals.
- Probabilistic simulation distributions require validation on real operational history.
- LLM-like routing in this showcase is a **synthetic policy and confidence-score demonstration**, not a real connected LLM API.
- Numerical models and report tables calculate in-browser; model outputs are not hardcoded.
- Live customer integrations, legal permissions, security reviews and monitoring belong in the subsequent project.

## Developer instructions

From the repository root, use `python -m http.server 8000`, then open `http://localhost:8000/`. Run `npm test` to validate core models and scenario invariants.

GitHub Pages deployment runs tests and copies all seven service directories and the `shared/` module in the workflow `.github/workflows/pages.yml`. GitHub Pages must have GitHub Actions selected as its source.

© 2026 SC-Analytics. All rights reserved. No general licence granted by default.
