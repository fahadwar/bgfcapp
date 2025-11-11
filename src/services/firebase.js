import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let app;

if (hasFirebaseConfig && !getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

let messaging;

async function getMessagingInstance() {
  if (!app) return null;
  if (!messaging && (await isSupported())) {
    messaging = getMessaging(app);
  }
  return messaging;
}

export {
  app,
  auth,
  db,
  getMessagingInstance,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInAnonymously,
  firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
  getToken,
  onMessage,
  hasFirebaseConfig
};
