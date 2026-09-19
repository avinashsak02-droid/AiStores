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
