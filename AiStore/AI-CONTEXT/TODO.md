## 🗓️ ROADMAP TO LAUNCH — build phase ends 31 Dec 2026

Plan made on 14 Oct 2026. After 31 Dec the focus moves to marketing and gaining users.

- **Phase 0 — Foundations (14–20 Oct):** deploy ✅, Firestore rules ✅, clean fake seed ratings/downloads, tidy `ToolDetails.jsx`.
- **Phase 1 — Data foundation (21 Oct–3 Nov):** Creator Hub collects `creator`, `overview`, `useCases`, `features` ✅ (done 20 Oct); backfill seed tools; fix the Usage stat by counting Launch clicks; live ratings on the Marketplace list and featured card; image upload for logo and gallery (check whether Firebase Storage needs the Blaze plan).
- **Phase 2 — Discovery (4–17 Nov):** outcome-based search (plan below) with plain-search fallback; comparison page for any two tools; saved/favourite tools.
- **Phase 3 — Money (18 Nov–1 Dec):** payments and monetized accounts. Timebox hard. Launch with the simple option (paid featured listings or creator pro plans); commission and creator payouts are a post-launch goal. Razorpay suits an India-based setup.
- **Phase 4 — Engagement and content (2–15 Dec):** news based on preferences (light version: user picks topics, Gazette filters by them); AI Tests and AI Shorts (meaning to be clarified with the user); Terms, Privacy and Contact pages; admin moderation (report/remove a listing); SEO basics. **Feature freeze 15 Dec.**
- **Phase 5 — Hardening (16–31 Dec):** phone/tablet testing, performance pass, error and empty states, payment and rules testing with a second account, soft-launch checklist, buffer.

**If behind schedule, cut in this order:** AI Shorts, AI Tests, preference-based news, creator public profiles, real payouts. Do not cut Phase 0, Phase 1 or outcome search.

**Trello board "AiStore ToDO":** Done = Basic Functionality, Reviews, Weekly News Gazette. To Do = Payments, Monetize accounts, AI Shorts, News based on preferences, AI Tests, Outcome based searching/NLP, Usage, Comparison page of any two preferred AIs.

---

## 🔵 PLANNED — MAJOR FEATURE (waiting on budget, not started)

### Outcome-based search
Users type a natural-language outcome ("make me a pdf", "convert my txt file to a ppt with transitions and animations") and the site understands the intent and returns the best-matching AI tool(s), instead of requiring exact keyword search.

**Status:** NOT STARTED. Waiting on budget ("next month when I get money"). Do not begin implementation until the user explicitly asks to start. It is scheduled for Phase 2 (4–17 Nov) in the roadmap above.

**Chosen approach:** LLM-powered matching via a Firebase Cloud Function, using per-tool `useCases` tagging as the data the model reasons over. A small budget is acceptable — user wants the best result, not the free option. Catalog size is currently small, so the whole catalog can be sent to the LLM per search; no vector database / embeddings pre-filter needed yet.

**Why this needs a new architectural piece:** AiStore currently has NO backend server — pure React + Firestore, all logic client-side. A paid AI API needs a secret key, which can never live in frontend code. This feature requires adding Firebase Cloud Functions (the project's first backend component) to hold the key privately and be the only thing that calls the AI provider.

**Build plan:**
1. **Data foundation** — finish Decision 009 (`useCases` + `features` fields on tools), add matching inputs to the Creator Hub form, backfill seed data with real, thoughtful use-case tags. Everything else depends on this being done well, not rushed.
2. **Backend** — add Firebase Cloud Functions, store the AI provider's API key as a secret/environment config (never in frontend code or committed to GitHub). Write one function, e.g. `matchToolsToOutcome`: accepts `{ query }`, fetches the tool catalog server-side from Firestore, sends query + compact catalog (name, description, useCases) to a cheap/fast LLM, asks for structured JSON output (tool id + short reasoning), returns it to the frontend.
3. **Frontend** — a distinct "describe what you want to do" search input (separate from or toggled with the existing keyword search), calls the function, renders results using existing tool card components plus the model's reasoning blurb, with a loading state (this won't be instant like client-side search).
4. **Cost & abuse controls (mandatory before public launch)** — rate-limit per user/session in the function; require explicit submit rather than searching on every keystroke; cache repeated/near-identical recent queries; set a billing alert/cap on the AI provider account as a hard safety net.
5. **Fallback** — if the function fails or a budget cap is hit, silently fall back to the existing plain-text Marketplace search rather than showing an error.
6. **Rollout** — test against the real backfilled catalog with varied phrasing before shipping; consider a labeled "beta" search mode first to observe real usage/cost before making it primary.

**Explicitly rejected/deferred approaches** (all zero-cost, reconsider only if budget disappears again):
- Keyword/synonym matching — simplest, most maintainable of the free options; good candidate for the Step 5 fallback path specifically.
- TF-IDF client-side matching — fuzzier than keywords, still zero cost.
- In-browser embeddings (transformers.js) — rejected as first choice: real engineering risk (bundle size, browser/device compatibility, harder debugging) that isn't justified yet at this catalog size.
- Embeddings-based pre-filter ahead of the LLM call — deferred until the catalog grows into the thousands of tools, at which point sending the whole catalog per search stops being efficient/cheap.

**Prerequisite:** Cannot start until Decision 009 (`useCases`/`features` fields) is implemented and confirmed, with seed data properly backfilled.

---

## 🔴 HIGH PRIORITY
- [x] make ratings feature — implemented as user reviews (Decision 012), confirmed working
- [x] common Sign in button in the navbar for buyers and sellers (Decision 013), confirmed working
- [x] Weekly AI Report page + automated weekly data pipeline (Decision 015), confirmed working
- [x] Firestore security rules locked down (tools + reviews), confirmed working (Decision 016). Later features (Usage counter, favourites, user preferences) will need rule additions.
- [x] deploy the site to production — live on Vercel (`ai-stores-omega.vercel.app`), auto-deploys on push to `main` (Decision 017). The Weekly AI Report's Monday commits now go live automatically.
- [x] dark mode with navbar toggle (Decision 018), confirmed working
- [ ] clean up fake seed ratings and downloads(seed data shows invented numbers like 150,000 downloads — misleading for a commercial product)
- [ ] backfill existing tools with `useCases` (and `overview`/`features`), or delete off-brand seed tools and re-list real new-AI startups through the Creator Hub (Firebase Console for old `admin-seed`/`seller_1` tools)
- [ ] delete dead code: `src/components/FeaturedCard.jsx` and `FeaturedCard.css`
- [ ] delete the test listings `SlideSmith` and `QuickNote AI` once no longer needed
- [ ] check the GitHub Actions tab to confirm the Monday 19 Oct weekly report run succeeded
- [ ] fix the downloads stat (still a placeholder default of 0) — plan: count Launch clicks (needs a Firestore rules change)
- [ ] make Marketplace list + featured card rating live (currently only the Tool Details page uses the real review average; related cards on Tool Details also show a placeholder 4.5)
- [ ] save a copy of the Firestore rules in the repo (e.g. `firestore.rules`), since they currently live only in Firebase Console

## 🟡 MEDIUM PRIORITY
- [ ] add more pages to the site (Terms, Privacy, Contact are needed before taking payments)
- [x] clean up `ToolDetails.jsx` — checked against the source on 2026-10-20: already done (no emoji or `tool.icon` fallbacks, footer uses the current year)
- [ ] optional cleanup: reuse `App.jsx` `handleLogin` in SellerDashboard and ReviewSection instead of their own `handleSignIn`
- [x] Creator Hub form: collect `creator`, `overview`, `useCases`, `features` (Decision 009) — confirmed working 2026-10-20
- [ ] restyle `SellerDashboard.css` onto the design tokens (it still has hardcoded white and undefined variables; dark mode currently patches around it)
- [ ] admin/moderation: report a listing, remove a listing
- [ ] saved/favourite tools for signed-in users
- [ ] creator public profile page
- [ ] SEO basics: page titles, sitemap, shareable links per tool
- [ ] consider bumping the Weekly AI Report workflow's `node-version` from 20 to a newer LTS (Node 20 was flagged as deprecating soon in Actions logs) — not urgent, purely maintenance
- [ ] do a final manual browser check of the Weekly AI Report page with real (non-placeholder) data — confirm drift animation and "Reduce motion" toggle behave as expected

## 🟢 FUTURE
- [x] buyer accounts — partially done: buyers can sign in with Google (navbar + reviews). Full buyer profiles, purchase history, etc. still not implemented.
- [ ] image upload for logo and gallery photos (currently pasted URLs)
- [ ] history of visited sites
- [ ] custom domain