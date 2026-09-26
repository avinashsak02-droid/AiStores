## 🔵 PLANNED — MAJOR FEATURE (waiting on budget, not started)

### Outcome-based search
Users type a natural-language outcome ("make me a pdf", "convert my txt file to a ppt with transitions and animations") and the site understands the intent and returns the best-matching AI tool(s), instead of requiring exact keyword search.

**Status:** NOT STARTED. Waiting on budget ("next month when I get money"). Do not begin implementation until the user explicitly asks to start.

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
- [ ] fix the downloads stat (still a placeholder default of 0)
- [ ] make Marketplace list + featured card rating live (currently only the Tool Details page uses the real review average; related cards on Tool Details also show a placeholder 4.5)
- [ ] review/lock down Firestore security rules before going commercial (reviews worked with no rules changes — likely still open/test-mode)

## 🟡 MEDIUM PRIORITY
- [ ] add more pages to the site
- [ ] clean up `ToolDetails.jsx`: remove the 🚀 emoji and `tool.icon` fallbacks (use CoverArt), replace the hardcoded "© 2024" footer
- [ ] optional cleanup: reuse `App.jsx` `handleLogin` in SellerDashboard and ReviewSection instead of their own `handleSignIn`
- [ ] Creator Hub form: collect `creator`, `overview`, `useCases`, `features` (Decision 009) — now also a prerequisite for outcome-based search above

## 🟢 FUTURE
- [x] buyer accounts — partially done: buyers can sign in with Google (navbar + reviews). Full buyer profiles, purchase history, etc. still not implemented.
- [ ] image upload for logo and gallery photos (currently pasted URLs)
- [ ] history of visited sites
