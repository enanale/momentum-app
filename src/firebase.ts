import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from 'firebase/firestore';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getFunctions, type Functions } from 'firebase/functions';
import { getAI, VertexAIBackend } from 'firebase/ai';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate environment variables
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value && key !== 'measurementId') { // measurementId is optional
    console.error(`Missing Firebase environment variable: ${key}`);
  }
}

// Initialize Firebase Services
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize App Check
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck: AppCheck | undefined = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  ? initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  })
  : undefined;

if (!appCheck) {
  console.error('Firebase App Check not initialized. Missing VITE_RECAPTCHA_SITE_KEY.');
}
const auth: Auth = getAuth(app);
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
const analytics: Analytics | undefined = import.meta.env.PROD ? getAnalytics(app) : undefined;
const functions: Functions = getFunctions(app);
const performance: FirebasePerformance | undefined = import.meta.env.PROD ? getPerformance(app) : undefined;
const ai = getAI(app, { backend: new VertexAIBackend() });

export {
  app,
  auth,
  db,
  analytics,
  functions,
  performance,
  ai,
  appCheck,
};
