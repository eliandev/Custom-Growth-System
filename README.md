# Marketing Boost Planner

Custom dashboard for content operations built with React, Vite, TypeScript, React Router, and Firebase.

## Included

- Black/red custom UI
- Routes for overview, ideas, production, calendar, playbook, and settings
- Firestore seed flow for the initial marketing system

## Run

```bash
npm install
npm run dev
```

## Firebase setup

1. Copy `.env.example` to `.env`
2. Fill in your Firebase project credentials
3. In Firebase Authentication, enable `Email/Password`
4. Create at least one admin user in Firebase Auth
5. Add `SEED_FIREBASE_EMAIL` and `SEED_FIREBASE_PASSWORD` in `.env` using that admin user
6. Open the app, sign in, and use the planner normally
7. Run `npm run seed` when you need to recreate the default Leveling Academy seed under the authenticated rules

## Next ideas

- Replace static views with live Firestore queries
- Add editing, filtering, and analytics panels
