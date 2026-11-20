# SC-Analytics — Decision Demonstrations

A collection of interactive, executive-facing examples of the work SC-Analytics delivers. Every demonstration is built around an actual calculation and fictional, reproducible data.

**First published module:** [Predictive Models — Demand & Risk](./predictive-models/).

## Modules

1. Automation & AI — planned
2. Predictive Models (time series, ensembles, classification) — available
3. Modelling & Scenario Analysis — planned
4. Optimization — planned
5. Simulations — planned
6. BI & Reporting — planned
7. Bespoke CRM / ERP Applications — planned

## Publication

GitHub Pages serves the root catalogue and its modules as independent routes using the included Pages workflow. After initial setup, select **GitHub Actions** as the Pages source under Settings → Pages.

Expected URL: https://sastree14.github.io/demos-sc_analytics/predictive-models/

## Data & mathematical integrity

All records and organisations are synthetic. Forecasting uses reproducible seasonal time-series and out-of-sample backtesting; model comparisons, WAPE, MAE, bias and forecast intervals are calculated by browser-side JavaScript. The classification example fits a logistic model to synthetic training observations, with a separate held-out evaluation dataset. Nothing calls an AI API, and no paid services, credentials or customer data are used.

The workflow is a guided visualisation of local processing steps, not a live company integration or asynchronous production job. Results are illustrative and should not be interpreted as client-specific forecasts or guaranteed improvements.

## Usage

Open index.html locally or launch a simple local HTTP server (`python -m http.server 8000`) and navigate to /predictive-models/. No installation or backend required.

© 2026 SC-Analytics. All rights reserved; no code licence is granted by default.
