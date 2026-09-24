# AI Store — Current State

Last updated: 2026-09-22

## Overall status

The AI Store prototype's editorial redesign is fully applied and confirmed working (see `LAST_CHECKPOINT.md`). This session (still same day) diagnosed a Seller Dashboard bug and proposed a photo carousel feature — **both are unconfirmed / not yet tested by the user.**

## Visual design

Unchanged since last checkpoint — parchment/editorial look confirmed live. See `LAST_CHECKPOINT.md` and Decisions 006–010.

## Authentication

Google login via Firebase Auth. **Scope decision (Decision 011, confirmed):** only sellers get accounts; buyers browse with no login. Sign-in is surfaced only inside the Creator Hub, not the navbar.

Open bug (pending test): `SellerDashboard.jsx`'s data-fetch effect previously never called `setLoading(false)` when `user` was `null`, causing an infinite "Loading..." screen for signed-out visitors to the Creator Hub. A fix (adds an early `if (!user)` branch and a "Sign in with Google" prompt) has been written but not yet copied into the project or tested.

Discrepancy noted (not a current blocker, see Decision 011): `Navbar.jsx` has no sign-in UI at all, which contradicts older claims in `DECISIONS.md` Decision 003 / `CONVERSATIONS.md` Session 2 that auth was fully working end-to-end. Source code is authoritative — treat navbar sign-in as not present.

## Navigation

Unchanged — `App.jsx` correctly wires all page-to-page callbacks (confirmed in last checkpoint).

## Data / Firebase

Firestore `tools` collection is the source of truth, `onSnapshot`/`getDocs` used as before. Firebase Storage still initialized but unused.

### Photo carousel (pending test)

A bug was found in the existing carousel: `PhotoCarousel.jsx`'s markup didn't match `PhotoCarousel.css`'s expected structure (missing `.carousel-image-wrapper`, arrows placed outside `.carousel-main`, wrong dot/counter class names), so it rendered unstyled and non-responsive even though `ToolDetails.jsx` already passed `tool.photos` correctly. A rewrite of `PhotoCarousel.jsx` (no CSS changes needed) plus a new required "Product Photos" field (1–5 URLs) in `SellerDashboard.jsx`/`.css` has been provided. **Not yet copied into the project or tested.**
### Current problem

- No image upload for tool details (logo URL / gallery photos are pasted as links, not uploaded).
- Downloads stat is still a placeholder (default 0, never incremented by anything real).
- Marketplace list and featured card still show the old placeholder `tool.rating` field (not live) — only the Tool Details page computes a live average from real reviews. See Decision 012 scope note.
- Seed data logo URLs have not been verified; broken ones now fall back to generated cover art instead of breaking the layout.
- Seller Dashboard loading bug and photo carousel feature: IMPLEMENTED and confirmed by the user.
- Firestore currently has no visible/reviewed security rules in the repo; reviews worked without any rules changes, which suggests the project is still in open/test-mode rules. Should be locked down before going commercial.

### User Reviews (confirmed)

Buyers can sign in with Google directly on the Tool Details page to post a star rating + text review (one per user per tool, stored in a new `reviews` Firestore collection, editable/deletable by the author). The Tool Details page's Rating stat now shows the live average of real reviews instead of a placeholder. See Decision 012.

## Current priority

1. Adding more pages to the site
2. Fixing the downloads stat
3. Making the Marketplace list/featured rating live (currently only Tool Details is live)
4. Reviewing Firestore security rules before going commercial

## Important instruction

Whenever asked for implementing a change, never make or change any code file in this repository directly — give the code to the user so they copy and paste it, and specify if the whole file or part of it should be replaced.