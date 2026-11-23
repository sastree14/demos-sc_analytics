# SC-Analytics — Solutions Lab

Independent, interactive, executive-facing demonstrations of SC-Analytics services. Each module uses actual algorithms with synthetic, reproducible data—not scripted results or confidential client records.

## Live demonstrations

- [Predictive Intelligence Studio](./predictive-models/) — seven business applications with editable controls, model-quality indicators, executive decision guidance and self-contained reporting
- [Inventory Optimisation](./optimization/) — constraint-aware replenishment with a real discrete allocation solver

## Service roadmap

1. Automation & AI — planned
2. Predictive Models — **available**
3. Modelling & Scenario Analysis — planned
4. Optimisation — **available**
5. Simulation — planned
6. BI & Reporting — planned
7. Custom CRM / ERP — planned

## GitHub Pages deployment

Source: GitHub Actions under Settings → Pages. The workflow runs all analytical tests with Node.js 22 before publishing static assets. Everything is hosted in a single repository, with separate routes:

- https://sastree14.github.io/demos-sc_analytics/
- https://sastree14.github.io/demos-sc_analytics/predictive-models/
- https://sastree14.github.io/demos-sc_analytics/optimization/

## Predictive Intelligence Studio — technical integrity

Built as a static app with native SVG charts, no paid dependencies or external model APIs. Seven reproducible synthetic applications:

- **Demand, revenue and workload**: seasonal baseline, trend-seasonal and weighted ensemble methods, assessed on six held-out months. WAPE, bias and MAE are calculated. Scenario forecasts and uncertainty bands derive from forecast outputs and historical holdout error. Bands are *illustrative*, not statistically calibrated confidence intervals.
- **Retention and delivery risk**: locally fitted logistic classification, with 470 training examples and 130 separate holdout records. Adjustable action thresholds, probability distributions, confusion matrices and precision/recall trade-offs.
- **Cost estimation**: locally fitted multiple linear regression on 420 synthetic jobs, 100 held out; scope controls, numerical uncertainty, input sensitivity and illustrative pricing assumptions.
- **Production anomalies**: rolling median/MAD detector using prior observations; sensitivity adjustment and detection precision/recall against *injected synthetic events*.

The impact section never reports realised customer savings. All financial values are planning scenarios derived from explicit assumptions (error costs, hypothetical intervention effectiveness, events found or proposed commercial margin).

The **executive brief is functional**: it can be downloaded as standalone HTML or printed/saved as a PDF by the browser. The underlying synthetic calculations can be exported as CSV.

A user-requested, visibly paced workflow illustrates preparation → validation → calculation → interpretation → monitoring. It does **not** imply the app is connecting to a live ERP, running remote data pipelines or continuously improving models.

## Inventory Optimisation

A discrete, constrained solver allocates purchasing quantities to four synthetic product lines. It respects total budget, warehouse capacity and SKU limits, maximising a defined expected contribution metric. A disclosed reference heuristic provides comparison; scenarios stress-test the same plan. Any calculated uplift is illustrative.

## Run locally

From the repository root:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/predictive-models/`.

Run regression tests using:

```sh
npm test
```

© 2026 SC-Analytics. All rights reserved. No general code licence is granted by default.
