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
const hasPlaceholderValues = [
  'YOUR_FIREBASE_WEB_API_KEY',
  'YOUR_PROJECT_ID',
  'YOUR_MESSAGING_SENDER_ID',
  'YOUR_FIREBASE_APP_ID',
].some((placeholder) => Object.values(firebaseConfig).some((value) => value.includes(placeholder)));

const firebaseConfigured = requiredValues.every(Boolean)
  && !hasPlaceholderValues
  && !firebaseConfig.apiKey.includes('Demo')
  && firebaseConfig.authDomain !== 'missing-config.invalid'
  && firebaseConfig.projectId !== 'missing-config';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (firebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
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
