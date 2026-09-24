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
- [ ] Creator Hub form: collect `creator`, `overview`, `useCases`, `features` (Decision 009)

## 🟢 FUTURE
- [x] buyer accounts — partially done: buyers can sign in with Google (navbar + reviews). Full buyer profiles, purchase history, etc. still not implemented.
- [ ] image upload for logo and gallery photos (currently pasted URLs)
- [ ] history of visited sites