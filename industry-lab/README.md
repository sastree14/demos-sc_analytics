# SC-Analytics — Industry Decision Lab (draft)

> **Work in progress.** This directory is an interactive catalogue of synthetic business decision examples, not a set of client implementations. Keep the PR in **draft**, do not merge to `main` or deploy publicly until the review checklist is complete.

## What is implemented

- 18 sectors (`SC01` to `SC18`) and 108 challenges (six per sector).
- 12 sectors (`SC01`–`SC12`) now have decision-specific models; `SC13`–`SC18` retain shared *illustrative* model families.
- 85 model calculators shared across all 108 problem routes.
- ES / CAT / EN catalogue, controls, model explanations, caveats, warnings, contextual first-screen wording and problem titles. Some calculation-data labels and tabular values in older/shared models remain Spanish; do not advertise full end-to-end localization as complete.
- Problem-first UX, accessible language selector, guided tour, responsive sidebar/selector, input ranges, SVG charts, scenario A/B comparison and downloadable local HTML report.
- Explicit model limitations, wholly synthetic datasets, brand identity, nonintrusive contextual CTA and links to SC-Analytics web/LinkedIn.

## Architecture

| Path | Purpose |
|---|---|
| `index.html`, `app.css`, `app.js` | Public-facing catalog and guide prototype |
| `experience.html`, `experience.css`, `experience.js` | Shared sector experience layout and navigation |
| `catalog.js` | **Public-only** metadata derived from private sector research; no prospects, emails, or commercial notes |
| `i18n.js` | Labels, sector titles, method/caveat translations, warning notices and contextual copy |
| `problem-copy.js` | Forty-two sector-specific first-person business questions for SC06–SC12 |
| `models.js` | Model registry, deterministic inputs, data formatting and execution |
| `*-models.js` | Sector-specific numerical engines |
| `*.test.mjs` | Model invariants, sector acceptance criteria and translation assertions |
| `browser_qa.py` | Chromium navigation / 108-path interactions, mobile, export and screenshot checks |

Every numerical engine **must** describe the decision it illustrates, assumptions, formula, limitations and a relevant warning if results exceed constraints. Claims of customer savings, model accuracy, regulatory conformity, real demand predictions and real-world correctness are prohibited without independent evidence.

## Local development

Serve the repository root with a static HTTP server, for instance `python -m http.server 8765`, then visit `http://localhost:8765/industry-lab/`. JavaScript modules require HTTP, not `file://`.

Run the technical checks from the repository root:

```bash
npm test
node industry-lab/tests.mjs
node industry-lab/manufacturing.test.mjs
node industry-lab/food.test.mjs
node industry-lab/pharma.test.mjs
node industry-lab/restaurant.test.mjs
node industry-lab/hotel.test.mjs
node industry-lab/retail.test.mjs
node industry-lab/clinic.test.mjs
node industry-lab/construction.test.mjs
node industry-lab/real-estate.test.mjs
node industry-lab/finance-insurance.test.mjs
node industry-lab/problem-copy.test.mjs
python industry-lab/browser_qa.py
```

The GitHub Pages workflow runs these checks on pull requests; on PRs it **does not publish the site**.

## Release checklist (must be reviewed manually)

- [ ] Inspect desktop and mobile views across multiple sectors, not just SC01.
- [ ] Confirm each of the 108 cases has meaningful, numerically consistent graphics and nonmisleading assumptions.
- [ ] Perform sector-domain review, particularly SC05 pharma/chemicals, SC09 clinics and SC12 finance/insurance.
- [ ] Confirm Spanish/Catalan/English coverage, including dynamic chart/table values and reports.
- [ ] Verify first-party official branding and all outgoing domain/LinkedIn/contact links.
- [ ] Recheck input bounds, model accuracy claims, accessibility, report export and URL query handling.
- [ ] Decide when and how to release actual public demos; do not imply unbuilt sectors are finished.
- [ ] Approve final PR before merging or updating LinkedIn featured links.

Source of truth: the private Industry Decision Lab master plan in Google Drive. The original commercial research stays private in the CMI.
