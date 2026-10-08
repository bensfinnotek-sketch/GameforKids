import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const env = import.meta.env;

const cleanEnvValue = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^["']|["']$/g, '');
};

const cleanApiKey = (value: unknown): string => {
  const cleaned = cleanEnvValue(value);
  // Vercel env values are sometimes pasted with quotes, commas, or whitespace.
  // Extract only the Firebase Web API key shape; never invent a different key.
  const match = cleaned.match(/AIza[0-9A-Za-z_-]+/);
  return match?.[0] ?? '';
};

const firebaseConfig = {
  apiKey: cleanApiKey(env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvValue(env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvValue(env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvValue(env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvValue(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvValue(env.VITE_FIREBASE_APP_ID),
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
  && firebaseConfig.apiKey.startsWith('AIza')
  && firebaseConfig.authDomain.endsWith('.firebaseapp.com')
  && firebaseConfig.projectId.length > 0;

const initializationConfig = firebaseConfigured
  ? firebaseConfig
  : {
      // Safe placeholders keep the React app renderable when Vercel env vars
      // are missing. Authentication remains disabled until real client config exists.
      apiKey: 'MISSING_FIREBASE_WEB_API_KEY',
      authDomain: 'missing-config.invalid',
      projectId: 'missing-config',
      storageBucket: 'missing-config.invalid',
      messagingSenderId: 'missing-config',
      appId: 'missing-config',
    };

const initializeFirebase = (config: typeof initializationConfig) => {
  const firebaseApp = getApps().length ? getApp() : initializeApp(config);
  return {
    app: firebaseApp,
    auth: getAuth(firebaseApp),
    db: getFirestore(firebaseApp),
  };
};

const { app, auth, db } = initializeFirebase(initializationConfig);

export { app, auth, db, firebaseConfigured };
