import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

const requiredValues = Object.values(firebaseConfig);
const firebaseConfigured = requiredValues.every(Boolean) &&
  !firebaseConfig.apiKey.includes('Demo') &&
  !firebaseConfig.projectId.includes('math-adventure-kids');

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (firebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Keep the UI renderable even when Vercel/Firebase environment variables
  // are missing. Authentication helpers will surface a clear configuration error.
  app = getApps().length ? getApp() : initializeApp({
    apiKey: 'missing-config',
    authDomain: 'missing-config.invalid',
    projectId: 'missing-config',
    storageBucket: 'missing-config.invalid',
    messagingSenderId: 'missing-config',
    appId: 'missing-config',
  });
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db, firebaseConfigured };
