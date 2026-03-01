import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!getApps().length) {
  if (serviceAccountJson) {
    initializeApp({
      credential: cert(JSON.parse(serviceAccountJson)),
    });
  } else {
    initializeApp();
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();

export async function verifyAuthToken(token: string) {
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
