import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getFunctions, type Functions } from 'firebase/functions';

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
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const analytics: Analytics | undefined = import.meta.env.PROD ? getAnalytics(app) : undefined;
const functions: Functions = getFunctions(app);
const performance: FirebasePerformance | undefined = import.meta.env.PROD ? getPerformance(app) : undefined;

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((error) => {
  if (error.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (error.code === 'unimplemented') {
    console.warn('The current browser does not support all features for persistence.');
  }
});

export {
  app,
  auth,
  db,
  analytics,
  functions,
  performance,
};
