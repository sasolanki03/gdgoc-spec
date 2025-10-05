
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

const adminAppConfig = {
  credential: cert(serviceAccount),
};

export async function initializeAdminApp(): Promise<App> {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  return initializeApp(adminAppConfig);
}
