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





####Decision 005


## Firebase Authentication Persistence

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

## Decision 005 — Visual direction: parchment editorial, made modern
Status: direction chosen by the user; implementation NOT yet confirmed.

The site should look modern and aesthetic, based on the user's reference screenshots but not a copy of them: warm parchment background, near-black text, wine-red accent, tall serif display font, thin rules, numbered rows, mono-font labels. Modern touches: frosted sticky navbar, staggered load-in animations, hover fills on buttons and rows, subtle film grain.

Reason: the user wants AI Store to feel like a premium discovery platform for AI tools.

If confirmed, this replaces the Session 1 look (Playfair Display / Lora / Inter, cream `#F9F9F7`, red `#CC0000`, hard shadows).

---

## Decision 006 — Centralised design tokens and scoped CSS class names
Status: proposed, NOT yet confirmed.

- Colors, fonts and spacing live as CSS variables in `App.css`. `index.css` holds only minimal resets.
- Each page uses its own class prefix (`mk-` for Marketplace, `td-` for ToolDetails, `tool-row-` for the list rows). Creator Hub rules are scoped under `.seller-dashboard`.

Reason: the project uses plain global CSS, and several files reused the same class names, so styles overwrote each other. `index.css` also still had leftover Vite template styles that broke the layout.

---

## Decision 007 — Generated cover art as the default product image
Status: proposed, NOT yet confirmed.

Products currently have no image field, so `CoverArt.jsx` draws an SVG collage cover seeded from the product ID (the same product always gets the same artwork). If a product later has an `image` URL, that image is used instead, and the generated art is the fallback if the image fails to load.

Reason: the reference design relies on strong cover artwork, and the database has no images. This avoids adding file uploads, which were deliberately postponed in Session 1.

---

## Decision 008 — Read optional product fields without changing the database
Status: proposed, NOT yet confirmed.

The new UI reads `creator`, `image`, `overview`, `useCases` (array) and `features` (array) if a product has them, and hides those sections when missing. Creator falls back to `sellerName`, then "Independent creator". No Firestore schema change or data migration was made, and the Creator Hub form does not collect these fields yet.

Reason: keeps existing seed data working and avoids expanding scope. Adding these inputs to the Creator Hub form is a natural next step once the redesign is confirmed.