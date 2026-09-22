# AI Store — TODO

## 🔴 HIGH PRIORITY
- [ ] app images (preview images on tool details) upload feature — Firebase Storage is initialized but unused.
- [ ] verify seed data logo URLs are still valid (some look guessed/hashed, e.g. Udio, and Stable Diffusion currently reuses the Hugging Face logo).

## 🟡 MEDIUM PRIORITY
- [ ] remove emoji from SellerDashboard.jsx (📦, 🔐, 👤, ✕, ✓) for consistency with Marketplace/ToolDetails, which are now emoji-free.
- [ ] decide whether to hide or relabel placeholder rating (4.5) and users (0) values on the tool details page until real data exists.
- [ ] Firestore security rules not yet reviewed in this project's context — confirm only the owning seller (`sellerId`) can edit/delete their own tools.
- [ ] URL validation in the Creator Hub form uses `new URL()`, which accepts any scheme — should require http/https.
- [ ] description field is marked required in the Creator Hub form but not actually enforced.

## 🟢 FUTURE
- [ ] buyer accounts
- [ ] history of visited sites
- [ ] Creator Hub form: collect `overview`, `useCases`, `features` fields (see Decision 009) so ToolDetails can render them.
- [ ] show the tool's real logo (not generated cover art) on the Marketplace featured entry block — it currently always shows cover art.
- [ ] remove dead code: FeaturedCard.jsx/css (unused), Vite template assets (react.svg, vite.svg, README.md), addSeedData.js (not wired to any UI button, no duplicate-entry check).
- [ ] update footer copyright year (currently hardcoded checks; ToolDetails now uses current year dynamically, verify Marketplace footer too).
- [ ] favicon.svg still uses the old Session 1 color palette.

## ✅ RECENTLY COMPLETED
- [x] fix the showcase your product button (was calling an undefined prop; fixed in App.jsx).
- [x] fix seller dashboard design (Navbar + Seller Dashboard editorial redesign, confirmed in prior checkpoint).
- [x] complete the editorial redesign consistently across App.jsx, AICard, ToolDetails (previously half-applied since Session 5).