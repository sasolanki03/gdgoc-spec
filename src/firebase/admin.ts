
import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';
import 'server-only';

function getServiceAccount(): ServiceAccount {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Admin features will be disabled.');
  }

  try {
    return JSON.parse(serviceAccountString);
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Please ensure it is a valid JSON string.');
  }
}

let adminApp: App | null = null;

export function initializeAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }
  
  const serviceAccount = getServiceAccount();

  const existingApp = getApps().find(app => app.name === '[DEFAULT]');
  if (existingApp) {
    adminApp = existingApp;
    return adminApp;
  }
  
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });

  return adminApp;
}
