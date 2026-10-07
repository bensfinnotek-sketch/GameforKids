import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration from environment variables with safe development defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemo-MathAdventureKidsKey',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'math-adventure-kids.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'math-adventure-kids',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'math-adventure-kids.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '897272610768',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:897272610768:web:7b8e9f1a2c3d4e5f',
};

// Singleton initialization to prevent multiple instances
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization warning, falling back to simulated mode:', error);
  // Ensure non-null instances if network/env is limited
  if (!getApps().length) {
    app = initializeApp({ ...firebaseConfig, apiKey: 'AIzaSyDemoPlaceholderKeyForLocalApplet' });
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
