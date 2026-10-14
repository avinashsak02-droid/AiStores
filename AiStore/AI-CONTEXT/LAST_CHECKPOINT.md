# Last Checkpoint

## Feature
Production deployment on Vercel + Firestore security rules (Phase 0 of the roadmap)

## Status
IMPLEMENTED

## Files Changed
- None in the repository. Hosting settings live in Vercel, rules in Firebase Console.

## What Changed
- The site is deployed on Vercel, auto-deploying from the `main` branch. Production domain: `ai-stores-omega.vercel.app`.
- The first deploy showed a 404 because Vercel built the repo root, which has no `package.json`. Fixed by setting Root Directory to `AiStore` in the Vercel project settings.
- The live domain was added to Firebase Authentication, Authorized domains, so Google sign-in works on the live site.
- The Firestore test-mode rules (which expired 2026-10-17) were replaced with real rules (Decision 016): public read on `tools` and `reviews`, owner-only writes, rating and downloads protected from client edits, review ratings limited to integers 1 to 5.
- Known side effects of the new rules: the seed button (`addSeedData.js`) no longer works, and old tools owned by `seller_1` or `admin-seed` can't be edited from the site (only from the Firebase Console).
- Live site tested: marketplace, search and filters, tool details, gallery, reviews, Google sign-in, Creator Hub add/edit/delete, and Weekly AI Report.

## Confirmed By User
Yes — user published the rules, deployed to Vercel, tested the live site and confirmed everything works.

## Next Task
Clean up fake seed ratings and downloads, then tidy `ToolDetails.jsx` (remove old emoji and leftover fallbacks).