
import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';

function getServiceAccount(): ServiceAccount | undefined {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountString) {
    // Don't log this on the server, as it could be noisy.
    // The functions using this will handle the error.
    return undefined;
  }
  try {
    return JSON.parse(serviceAccountString);
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    return undefined;
  }
}

export function initializeAdminApp(): App | null {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    console.error('Firebase Admin SDK service account is not available. Admin features will be disabled.');
    return null;
  }

  const adminAppConfig = {
    credential: cert(serviceAccount),
  };

  const existingApp = getApps().find(app => app.name === '[DEFAULT]');
  if (existingApp) {
    return existingApp;
  }
  
  return initializeApp(adminAppConfig);
}
