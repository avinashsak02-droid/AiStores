# AI Store — Current State

Last updated: 2026-09-22

## Overall status

The AI Store prototype's editorial redesign (started in Session 5) is now fully and consistently applied across the codebase. Previously it was half-applied (new tokens/Marketplace but old App.jsx/AICard/ToolDetails), which caused several visible bugs. Those are now fixed and confirmed working.

## Visual design

Parchment/editorial look confirmed live: warm parchment background (`#e9e1d6`), near-black text, wine-red accent (`#7a1f26`), Instrument Serif / Work Sans / JetBrains Mono, thin rules, numbered rows, mono-font labels, frosted sticky navbar, load-in animations, subtle film grain. This replaces the old Session 1 look (Playfair Display/Lora/Inter, cream `#F9F9F7`, red `#CC0000`, hard shadows) — no trace of the old look remains in the CSS.

Emoji have been removed from the Marketplace and ToolDetails pages (generated `CoverArt` is used instead when a tool has no logo). The Creator Hub (`SellerDashboard.jsx`) still contains emoji (📦, 🔐, 👤, ✕, ✓) — not yet addressed.

## Authentication

Google login authentication works. Log out is available from the navbar and the Creator Hub. Firebase Authentication's built-in persistence is used (Decision 005); no custom login-storage system.

## Navigation

`App.jsx` now correctly wires all page-to-page callbacks: Marketplace → Creator Hub ("Showcase your product"), Marketplace → Tool Details, and Tool Details → Tool Details (via related tools). Page changes scroll to top.

## Data / Firebase

Firestore `tools` collection is the source of truth, with `onSnapshot` real-time sync on both the Marketplace and Seller Dashboard. Firebase Storage is initialized in `firebase.js` but not yet used — no image upload feature exists.

### Current problem

- No image upload for tool details (logo URL / gallery photos are pasted as links, not uploaded).
- Placeholder values (rating default 4.5, downloads default 0) are shown prominently on the details page as if real.
- Seed data logo URLs have not been verified; broken ones now fall back to generated cover art instead of breaking the layout.

## Current priority

Candidates for next session (not yet decided by user):
1. Image upload feature (logo + gallery) — longstanding high-priority TODO.
2. Remove emoji from SellerDashboard.jsx for visual consistency.
3. Decide whether to hide/relabel placeholder rating and download counts until real data exists.

## Important instruction

Whenever asked for implementing a change, never make or change any code file in this repository directly — give the code to the user so they copy and paste it, and specify if the whole file or part of it should be replaced.