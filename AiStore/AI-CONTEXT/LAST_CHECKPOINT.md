# Last Checkpoint

## Feature
Weekly AI Report — animated newspaper-style page showing weekly AI news, updated automatically

## Status
IMPLEMENTED

## Files Changed
- .github/workflows/weekly-ai-report.yml (new)
- scripts/fetch-weekly-report.js (new)
- public/weekly-report.json (new — generated/committed by the workflow)
- src/hooks/useInView.js (new)
- src/pages/WeeklyReport.jsx (new)
- src/pages/WeeklyReport.css (new)
- src/App.jsx (added `weekly-report` page route)
- src/components/Navbar.jsx (added "WEEKLY AI REPORT" nav link)
- package.json (added `rss-parser` devDependency, used only by the fetch script)

## What Changed
- A new page (`WeeklyReport.jsx`) shows a newspaper-style front page of recent AI news, styled to match the site's existing editorial aesthetic (parchment background, Instrument Serif, wine accent).
- Each headline has a subtle CSS-only drift/tilt animation (transform + opacity only), applied only once the card scrolls into view (`useInView` hook via IntersectionObserver), and respecting `prefers-reduced-motion` plus a manual "Reduce motion" toggle stored in `localStorage`.
- News data comes from free RSS feeds (TechCrunch AI, VentureBeat AI, MIT Technology Review, The Verge AI, Google News), fetched by `scripts/fetch-weekly-report.js` (Node + `rss-parser`) and written to `public/weekly-report.json`. No paid API, no LLM summarization, no Firestore reads at runtime — the frontend just fetches the static JSON file.
- A GitHub Actions workflow (`.github/workflows/weekly-ai-report.yml`) runs the script weekly (cron, Mondays) and on manual trigger (`workflow_dispatch`), committing the updated JSON back to the repo if it changed.
- This deliberately avoids Firebase Cloud Functions (which would require the paid Blaze plan just to make outbound HTTP calls to RSS feeds) — zero ongoing cost, no billing account needed.

## Setup issues hit and resolved during this session
1. `rss-parser` import failed locally — `npm install` had not been run after the `package.json` edit. Fixed by running `npm install` in the correct project folder.
2. The `.github/workflows/` folder was initially created inside the nested `AiStore/AiStore/` project folder instead of at the true git repo root — GitHub Actions only detects workflows at the actual repo root, so the workflow was invisible on GitHub ("Get started with GitHub Actions" screen shown instead of the real workflow). Fixed by moving `.github` up to sit alongside the `AiStore` project folder, and adding `working-directory: AiStore` to the workflow's job so npm/node steps run in the right place.
3. First real workflow run failed (exit code 128) because the commit step's `git add AiStore/public/weekly-report.json` double-counted the `AiStore/` prefix (the job's `working-directory: AiStore` already puts it there). Fixed to `git add public/weekly-report.json`.

## Confirmed By User
Yes — user ran the fetch script locally, and separately triggered the GitHub Actions workflow manually via `workflow_dispatch`, which completed successfully and committed the updated `weekly-report.json`.

## Next Task
Not specified. Open items: full site deployment still hasn't happened (this is a pre-existing TODO item, unrelated to this feature) — until it does, the weekly commit updates the repo but won't appear on a live site. Also worth a final visual/manual check that the WeeklyReport page renders correctly with real (non-placeholder) data and that the drift animation and motion toggle behave as expected in the browser.