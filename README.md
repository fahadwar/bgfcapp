# Bowling Green FC Web App

Bowling Green FC (BGFC) Golden Lions responsive web experience built with Vite, React, Tailwind CSS, and Firebase integrations. The project mirrors the feature flow of the LouCity FC mobile application while reimagining the interface for desktop and mobile browsers with BGFC branding.

## Features

- Multi-screen onboarding flow with persistent state
- Firebase Authentication (Google, Facebook, Email/Password, Anonymous) with guest fallback
- Firestore-driven content for promotions, schedule, news, ticket links, and Man of the Match voting (local mock data is used when Firebase is not configured)
- Real-time Man of the Match voting with duplicate-vote prevention
- Push notification opt-in via Firebase Cloud Messaging (FCM) and optional location access prompts
- Responsive layout with sticky bottom navigation on mobile and top navigation on desktop
- Ticket management hub with deep links for all purchase flows
- Fan Zone content hub with quick links, alerts, and stories

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [React Router 6](https://reactrouter.com/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Firebase Web SDK 10](https://firebase.google.com/docs/web/setup)
- [Zustand-compatible Context API](https://react.dev/learn/passing-data-deeply-with-context) for app state
- [Swiper](https://swiperjs.com/react) for the hero carousel

## Getting Started

```bash
npm install
npm run dev
```

The development server defaults to `http://localhost:5173`.

### Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project settings:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_FIREBASE_VAPID_KEY=...
VITE_DEV_ADMIN_BYPASS=false
VITE_ADMIN_EMAILS=you@bgfc.app,another@bgfc.app
```

> The app automatically falls back to mock Firestore data when Firebase is not configured so you can explore the UX immediately.

### Firebase Cloud Messaging service worker

Update `public/firebase-messaging-sw.js` with your Firebase project configuration before deploying push notifications:

```js
const firebaseConfig = {
  apiKey: 'YOUR_KEY',
  authDomain: 'YOUR_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};
```

### Deploying

1. Configure Firebase Hosting or Vercel with the environment variables above.
2. Build the project:

   ```bash
   npm run build
   ```

3. Deploy the generated `dist/` directory via your hosting provider.

For Firebase Hosting:

```bash
firebase login
firebase init hosting
firebase deploy
```

For Vercel:

```bash
vercel
```

## Project Structure

```
src/
├── App.jsx
├── main.jsx
├── assets/
├── components/
├── context/
├── hooks/
├── pages/
├── services/
├── styles/
└── utils/
```

## Testing & Linting

- `npm run dev` – start local development
- `npm run build` – production build validation
- `npm run preview` – preview built application

ESLint and Prettier-ready configuration is included to keep the codebase consistent.

## License

© ${new Date().getFullYear()} Bowling Green FC. All rights reserved.
