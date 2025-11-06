'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export function initializeFirebase() {
  let app: FirebaseApp;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { firebaseApp: app, auth, firestore };
}

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-admin';
export { useMemoFirebase } from './provider';
