# AI Store — Current State

Last updated: 2026-09-24

## Overall status

The AI Store prototype is working and confirmed by the user through the following features:
- Editorial redesign (parchment look), applied in full in Session 6.
- Seller Dashboard sign-in fix and photo carousel (Session 7).
- User reviews with a live average rating on the Tool Details page (Decision 012).
- A common Sign in button in the navbar for buyers and sellers (Decision 013).

See `LAST_CHECKPOINT.md` for the most recent checkpoint.

## Visual design

Parchment/editorial look. Design tokens live in `App.css`, with per-page class prefixes (`mk-`, `td-`, `tool-row-`), and Creator Hub rules are scoped under `.seller-dashboard`. See Decisions 006–010.

## Authentication

- Google login via Firebase Auth. `App.jsx` tracks the user with `onAuthStateChanged` and owns `handleLogin` and `handleLogout`.
- Buyers and sellers share one login. The navbar shows a "Sign in" button when signed out, and the user's name plus Logout when signed in (Decision 013, supersedes Decision 011).
- Buyers can browse with no account. They sign in to write a review.
- The Seller Dashboard (Creator Hub) is only usable by signed-in users. Signed-out visitors see a locked screen with a sign-in button.
- Firebase persists the login session automatically (Decision 005).

## Navigation

`App.jsx` uses a `currentPage` state (`marketplace`, `tool-details`, `seller`) and passes callbacks (`onViewTool`, `onOpenCreatorHub`, `onLogin`, `onLogout`). It also passes the global `user` to `ToolDetails` and `SellerDashboard`.

## Data / Firebase

- `tools` collection: product listings, including `photos` (1–5 URLs, required in the Creator Hub form) and `logo`.
- `reviews` collection: one review per user per tool, doc id `${toolId}_${userId}`, editable and deletable by its author.
- Firebase Storage is initialized in `firebase.js` but unused.
- No Firestore security rules are visible in the repo. Reviews worked without rule changes, which suggests open/test-mode rules.

## Product pages

- Marketplace: hero and search, category chips, featured entry, numbered index, creator call-to-action.
- Tool Details: header with logo and Launch button, info grid (category, status, live rating, users), photo carousel, reviews, related tools.
- Creator Hub: add, edit and delete tools, with the photo fields.

## Known issues / open items

- The downloads/users stat is a placeholder (default 0, never incremented).
- The Marketplace list and featured card do not show the live review average. Related cards on Tool Details still fall back to a placeholder rating of 4.5.
- `ToolDetails.jsx` still uses a `🚀` emoji in the Launch button, `tool.icon` fallbacks, and a hardcoded "© 2024" footer.
- No image upload: the logo and gallery photos are pasted URLs.
- The Creator Hub form does not collect `creator`, `overview`, `useCases` or `features` (Decision 009, not confirmed).
- Seed logo URLs are unverified. Broken logos fall back to generated cover art.
- Firestore security rules need reviewing before going commercial.
- Mobile and tablet layouts have had limited testing.

## Current priority

1. Making the Marketplace list and featured rating live
2. Fixing the downloads stat
3. Reviewing Firestore security rules
4. Adding more pages to the site

## Important instruction

Whenever asked for implementing a change, never make or change any code file in this repository directly. Give the user the code to copy and paste, in the patch format from the project instructions (FIND / REPLACE WITH, ADD AT, REMOVE), with a full file only when genuinely necessary.