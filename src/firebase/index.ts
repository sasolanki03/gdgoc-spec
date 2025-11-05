
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This function ensures Firebase is initialized only once.
function getFirebaseServices() {
  if (!getApps().length) {
    try {
      // Important! In a deployed Firebase App Hosting environment, initializeApp()
      // without arguments will automatically use the backend's service account credentials.
      firebaseApp = initializeApp();
    } catch (e) {
      // During local development, fallback to the client-side config.
      if (process.env.NODE_ENV !== "production") {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        console.error('Automatic Firebase initialization failed in production.', e);
        // In a real production scenario, you might want to handle this more gracefully.
        throw e;
      }
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  } else {
    firebaseApp = getApp();
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
    // Simply return the singleton instance of the services.
    return getFirebaseServices();
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';
export * from './auth/use-admin';
export { useMemoFirebase } from './provider';
