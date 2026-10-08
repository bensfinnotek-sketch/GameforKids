import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const env = import.meta.env;

// Firebase Web config is client-side configuration (not a service-account secret).
// Keep environment variables as the primary source, but use the project's public
// web config as a production-safe fallback so a missing Vercel build variable
// cannot crash the entire React app with auth/invalid-api-key.
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyAFE7LL3heze8Ca9Bfc8fqStkFnZEc8zpI',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'math-adventure-kids-web.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'math-adventure-kids-web',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'math-adventure-kids-web.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1084759286468',
  appId: env.VITE_FIREBASE_APP_ID || '1:1084759286468:web:a12d74225194a548efdf91',
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

const initializeFirebase = (config: typeof firebaseConfig) => {
  const firebaseApp = getApps().length ? getApp() : initializeApp(config);
  return {
    app: firebaseApp,
    auth: getAuth(firebaseApp),
    db: getFirestore(firebaseApp),
  };
};

if (firebaseConfigured) {
  try {
    ({ app, auth, db } = initializeFirebase(firebaseConfig));
  } catch (error) {
    // A stale/broken Vercel client env must not prevent React from rendering.
    // Fall back to the known public Firebase Web config used by this project.
    console.warn('Firebase environment configuration failed; using public project config.', error);
    ({ app, auth, db } = initializeFirebase({
      apiKey: 'AIzaSyAFE7LL3heze8Ca9Bfc8fqStkFnZEc8zpI',
      authDomain: 'math-adventure-kids-web.firebaseapp.com',
      projectId: 'math-adventure-kids-web',
      storageBucket: 'math-adventure-kids-web.firebasestorage.app',
      messagingSenderId: '1084759286468',
      appId: '1:1084759286468:web:a12d74225194a548efdf91',
    }));
  }
} else {
  // Use the known public Web config rather than crashing the application during
  // module evaluation. Firebase Web config is not a secret.
  ({ app, auth, db } = initializeFirebase({
    apiKey: 'AIzaSyAFE7LL3heze8Ca9Bfc8fqStkFnZEc8zpI',
    authDomain: 'math-adventure-kids-web.firebaseapp.com',
    projectId: 'math-adventure-kids-web',
    storageBucket: 'math-adventure-kids-web.firebasestorage.app',
    messagingSenderId: '1084759286468',
    appId: '1:1084759286468:web:a12d74225194a548efdf91',
  }));
}

export { app, auth, db, firebaseConfigured };
