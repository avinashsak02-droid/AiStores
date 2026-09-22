# AI Store — Important Decisions

## Decision 001 — Marketplace concept

AI Store will be a marketplace for AI tools and AI agents.

Users should be able to discover, use and purchase AI products.

Sellers should be able to list and sell their AI products.

---

## Decision 002 — Development approach

AI coding assistants are being used heavily to develop the project.

The developer has basic coding knowledge and therefore AI assistants should provide clear explanations when making complicated changes.

---

## Decision 003 — Authentication

Google login authentication has been implemented.

---

## Decision 004 — Shared AI project memory

GitHub is being used as the central source of truth for project context.

AI assistants working on the project should use the files inside:

AI-CONTEXT/

as project memory.

---

## Decision 005 — Firebase Authentication Persistence

### Decision

Use Firebase Authentication's built-in browser persistence to remember authenticated users rather than implementing a separate custom login-storage mechanism.

### Reason

The existing application already uses Firebase `onAuthStateChanged` to restore the authenticated user when the application loads.

Firebase Authentication handles persistence of the authentication session, while the application uses the current Firebase user state to determine whether the user is logged in.

### Implementation

- `onAuthStateChanged` in `App.jsx` monitors authentication state.
- `signOut(auth)` is used to log the user out.
- The navbar and Creator Hub receive the current user and logout handler.
- No separate localStorage-based authentication system is required.

### Status

Implemented and confirmed as part of the logout/login-state work.

---

## Decision 006 — Visual direction: parchment editorial, made modern

Status: **IMPLEMENTED and confirmed.**

The site look is based on the user's reference screenshots but not a copy of them: warm parchment background, near-black text, wine-red accent, tall serif display font, thin rules, numbered rows, mono-font labels. Modern touches: frosted sticky navbar, staggered load-in animations, hover fills on buttons and rows, subtle film grain.

Reason: the user wants AI Store to feel like a premium discovery platform for AI tools.

This replaces the Session 1 look (Playfair Display / Lora / Inter, cream `#F9F9F7`, red `#CC0000`, hard shadows). No trace of the Session 1 look remains in the codebase.

---

## Decision 007 — Centralised design tokens and scoped CSS class names

Status: **IMPLEMENTED and confirmed.**

- Colors, fonts and spacing live as CSS variables in `App.css`. `index.css` holds only minimal resets.
- Each page uses its own class prefix: `mk-` for Marketplace, `td-` for ToolDetails, `tool-row-` for the marketplace list rows. Creator Hub rules are scoped under `.seller-dashboard`.

Reason: the project uses plain global CSS, and several files reused the same class names, so styles overwrote each other. `index.css` also still had leftover Vite template styles that broke the layout.

Note: this session found and fixed two remaining unscoped collisions left over from the partial redesign: `.tool-logo` (defined in both old ToolDetails.css and SellerDashboard.css) and `.divider-h` (defined in both App.css and old ToolDetails.css). The new `td-` prefix resolves both.

---

## Decision 008 — Generated cover art as the default product image

Status: **IMPLEMENTED and confirmed.**

Products currently have no reliable image field, so `CoverArt.jsx` draws an SVG collage cover seeded from the product ID (the same product always gets the same artwork). If a product has an `image` URL, that image is used instead; generated art is the fallback if the image fails to load or is absent.

This session extended the fallback to product **logos** too: `AICard.jsx` and `ToolDetails.jsx` now show `CoverArt` instead of an emoji whenever a tool has no logo URL or the logo fails to load (`onError`).

Reason: the reference design relies on strong cover artwork, and the database has no guaranteed images. This avoids adding file uploads, which are still planned separately (see TODO).

---

## Decision 009 — Read optional product fields without changing the database

Status: PROPOSED, NOT YET CONFIRMED — unchanged this session.

The UI is intended to read `creator`, `image`, `overview`, `useCases` (array) and `features` (array) if a product has them, and hide those sections when missing. Creator falls back to `sellerName`, then "Independent creator" (this fallback, in `utils/tool.jsx`, is confirmed working). No Firestore schema change or data migration has been made, and the Creator Hub form does not collect `overview`, `useCases` or `features` yet — the current `ToolDetails.jsx` does not render those sections. Adding these inputs to the Creator Hub form is a natural next step.

---

## Decision 010 — Category list matches what sellers can actually create

Status: **IMPLEMENTED and confirmed.**

Marketplace category filter chips changed from `All, Video, Image, Writing, Coding, Music, SEO, Design, Other` to `All, Coding, Writing, Image, Video, Audio, Music, Other`.

Reason: the Creator Hub form's category dropdown never offered "SEO" or "Design", so those chips could never match a real product. It also lacked "Audio", so existing Audio seed products (e.g. Eleven Labs) were only reachable via "All". The chip list must match the Creator Hub form's `categories` array.



---

## Decision 011 — Seller-only accounts (for now)

Status: **CONFIRMED by user.**

Only sellers require accounts at this stage. Buyers browse and use the Marketplace with no login at all.

Consequence: no sign-in control is being added to `Navbar.jsx`. Sign-in is only surfaced inside the Creator Hub (`SellerDashboard.jsx`), triggered when a signed-out user opens it.

Reason: matches the current product scope — buyer accounts are a "Future" item (see `TODO.md`), not needed yet.

Note: this session found that `Navbar.jsx` currently has no sign-in UI at all (not even a "Sign in" link), which contradicts `DECISIONS.md` Decision 003 and `CONVERSATIONS.md` Session 2's claim that Google auth was "confirmed working." Since this decision means navbar sign-in is intentionally not being added, that discrepancy is now moot rather than a bug — but it's recorded here in case it resurfaces.