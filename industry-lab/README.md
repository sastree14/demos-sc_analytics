# SC-Analytics — Industry Decision Lab (draft)

> **Work in progress.** This directory is an interactive catalogue of synthetic business decision examples, not a set of client implementations. Keep the PR in **draft**, do not merge to `main` or deploy publicly until the review checklist is complete.

## What is implemented

- 18 sectors (`SC01` to `SC18`) and 108 challenges (six per sector).
- All 18 sectors (`SC01`–`SC18`) now have six distinct, sector-specific numerical decision experiences each. They remain **synthetic demonstrations**, not validated operational or regulatory software.
- 121 registered decision-model calculators. The 108 sector routes each select a specialised calculator, with common legacy models retained for other demo purposes.
- ES / CAT / EN catalogue, controls, pain-point introductions, caveats, scenario report labels, charts, warnings and contextual questions for 78 cases in SC06–SC18. A final human copy-edit remains necessary, including dynamic values and underlying mathematical descriptions.
- Decision-first UX, language selector, guided tour, responsive sidebar/selector, constrained sliders, SVG charts, scenario A/B comparison, and downloadable local HTML report with metrics, detail table, assumptions and a nonintrusive contact CTA.
- Explicit model limitations, wholly synthetic datasets, brand identity, nonintrusive contextual CTA and links to SC-Analytics web/LinkedIn.

## Architecture

| Path | Purpose |
|---|---|
| `index.html`, `app.css`, `app.js` | Public-facing catalog and guide prototype |
| `experience.html`, `experience.css`, `experience.js` | Shared sector experience layout and navigation |
| `catalog.js` | **Public-only** metadata derived from private sector research; no prospects, emails, or commercial notes |
| `i18n.js` | Labels, sector titles, method/caveat translations, warning notices and contextual copy |
| `problem-copy.js` | 78 sector-specific business questions for SC06–SC18, each manually written in ES/CAT/EN |
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
node industry-lab/final-sectors.test.mjs
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
- [ ] Review examples with domain professionals and confirm demos' synthetic assumptions are not presented as measured client outcomes. All 18 sectors have working code; sector validation is **not** complete.
- [ ] Approve final PR before merging or updating LinkedIn featured links.

Source of truth: the private Industry Decision Lab master plan in Google Drive. The original commercial research stays private in the CMI.

## Additional work in SC13–SC18

The six new modules are `consulting-models.js`, `field-service-models.js`, `saas-models.js`, `education-models.js`, `energy-industrial-models.js`, and `events-models.js`. Their mathematical and multilingual regression checks live in `final-sectors.test.mjs`. They deliberately avoid making individual education or financial decisions, controlling electrical equipment, dispatching real workers, or planning crowd safety. The data are generated assumptions. Expert domain review, privacy review, accessibility checks and customer usability testing remain mandatory before publication.
