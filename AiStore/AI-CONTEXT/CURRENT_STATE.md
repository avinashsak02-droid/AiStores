# AI Store — Current State

Last updated: 2026-10-14

## Overall status

The AI Store prototype is working, deployed, and confirmed by the user through the following:
- Editorial redesign (parchment look), applied in full in Session 6.
- Seller Dashboard sign-in fix and photo carousel (Session 7).
- User reviews with a live average rating on the Tool Details page (Decision 012).
- A common Sign in button in the navbar for buyers and sellers (Decision 013).
- Weekly AI Report — an animated newspaper-style page with automatically updating AI news (Decision 015).
- Real Firestore security rules (Decision 016).
- Production deployment on Vercel (Decision 017).
- Dark mode with a navbar toggle (Decision 018).

See `LAST_CHECKPOINT.md` for the most recent checkpoint. The roadmap to the 31 Dec 2026 deadline is in `TODO.md`.

## Hosting

Deployed on Vercel at `ai-stores-omega.vercel.app`, auto-deploying on push to `main`. Vercel's Root Directory is set to `AiStore` because of the nested project folder. Any new domain must be added to Firebase Authentication, Authorized domains, or Google sign-in fails. The weekly GitHub Actions commit now surfaces on the live site automatically.

## Visual design

Light and dark themes. The parchment/editorial look is the light theme. Dark mode is chosen by `useTheme` (saved choice, else OS preference), applied as `data-theme` on `<html>`, and toggled from the navbar. The dark tokens and overrides for hardcoded colors are at the end of `App.css`. The Weekly AI Report keeps its parchment look in both themes. Design tokens live in `App.css`, with per-page class prefixes (`mk-`, `td-`, `tool-row-`, `gz-` for the Weekly Report page), and Creator Hub rules are scoped under `.seller-dashboard`. See Decisions 006–010.

## Authentication

- Google login via Firebase Auth. `App.jsx` tracks the user with `onAuthStateChanged` and owns `handleLogin` and `handleLogout`.
- Buyers and sellers share one login. The navbar shows a "Sign in" button when signed out, and the user's name plus Logout when signed in (Decision 013, supersedes Decision 011).
- Buyers can browse with no account. They sign in to write a review.
- The Seller Dashboard (Creator Hub) is only usable by signed-in users. Signed-out visitors see a locked screen with a sign-in button.
- Firebase persists the login session automatically (Decision 005).

## Navigation

`App.jsx` uses a `currentPage` state (`marketplace`, `tool-details`, `seller`, `weekly-report`) and passes callbacks (`onViewTool`, `onOpenCreatorHub`, `onLogin`, `onLogout`). It also passes the global `user` to `ToolDetails` and `SellerDashboard`.

## Data / Firebase

- `tools` collection: product listings, including `photos` (1–5 URLs, required in the Creator Hub form) and `logo`.
- `reviews` collection: one review per user per tool, doc id `${toolId}_${userId}`, editable and deletable by its author.
- Firestore security rules are set in Firebase Console (not stored in the repo) and confirmed working: public read on `tools` and `reviews`, owner-only writes, rating and downloads protected from client edits, review ratings limited to integers 1–5. See Decision 016.
- Side effects of the rules: the seed button (`addSeedData.js`) no longer works from the client, and old tools owned by `seller_1` or `admin-seed` can't be edited from the site (only from the Firebase Console).
- Firebase Storage is initialized in `firebase.js` but unused.
- The Weekly AI Report does **not** use Firebase at all — it reads a static JSON file (`public/weekly-report.json`) that's committed to the repo by a scheduled GitHub Actions workflow, not fetched from any database or live API at runtime.

## Product pages

- Marketplace: hero and search, category chips, featured entry, numbered index, creator call-to-action.
- Tool Details: header with logo and Launch button, info grid (category, status, live rating, users), photo carousel, reviews, related tools.
- Creator Hub: add, edit and delete tools, with the photo fields.
- Weekly AI Report: newspaper-style page listing recent AI news headlines pulled from free RSS feeds, each with a subtle CSS-only drift animation (in-view only, respects `prefers-reduced-motion` + a manual toggle).

## Weekly AI Report — pipeline detail

- `scripts/fetch-weekly-report.js` (Node, uses `rss-parser`) pulls from TechCrunch AI, VentureBeat AI, MIT Technology Review, The Verge AI, and Google News RSS, dedupes, sorts by recency, keeps the top ~8, and writes `public/weekly-report.json`.
- `.github/workflows/weekly-ai-report.yml` runs that script weekly (Monday cron) and on manual trigger, committing the updated JSON if changed. Confirmed working via a manual trigger.
- The workflow lives at the true repo root (`.github/workflows/`), not inside the nested `AiStore/` project folder — this tripped up the first setup attempt (see `LAST_CHECKPOINT.md` history in `CONVERSATIONS.md`).
- The frontend page fetches `/weekly-report.json` once, caches it in `sessionStorage`, and never calls any external API or Firestore for this feature — zero ongoing cost, no billing plan required.

## Known issues / open items

- Seed data shows invented ratings and downloads (e.g. 150,000), which is misleading for a commercial product.
- The downloads/users stat is a placeholder (default 0, never incremented).
- The Marketplace list and featured card do not show the live review average. Related cards on Tool Details still fall back to a placeholder rating of 4.5.
- `ToolDetails.jsx` still uses a `🚀` emoji in the Launch button, `tool.icon` fallbacks, and a hardcoded "© 2024" footer.
- No image upload: the logo and gallery photos are pasted URLs.
- The Creator Hub form does not collect `creator`, `overview`, `useCases` or `features` (Decision 009, not confirmed).
- Seed logo URLs are unverified. Broken logos fall back to generated cover art.
- The Firestore rules exist only in Firebase Console, not in the repo.
- Mobile and tablet layouts have had limited testing.
- `SellerDashboard.css` is still the old Session 1 stylesheet (hardcoded `white`, undefined `--accent` and `--border-thin`, unscoped class names), despite earlier notes saying it was restyled. Dark mode works around it with overrides in `App.css`; a proper restyle onto the design tokens would remove the need for them.

## Current priority

1. Cleaning up fake seed ratings and downloads
2. Tidying `ToolDetails.jsx` (emoji, old fallbacks)
3. Phase 1 of the roadmap: Creator Hub data fields, Usage stat, live ratings on the Marketplace

## Important instruction

Whenever asked for implementing a change, never make or change any code file in this repository directly. Give the user the code to copy and paste, in the patch format from the project instructions (FIND / REPLACE WITH, ADD AT, REMOVE), with a full file only when genuinely necessary.