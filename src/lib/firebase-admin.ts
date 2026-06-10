import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

function getCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK missing credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local"
    );
  }

  return { projectId, clientEmail, privateKey };
}

function initApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps().find((a) => a.name === "[DEFAULT]");
  if (existing) {
    cachedApp = existing;
    return cachedApp;
  }

  const { projectId, clientEmail, privateKey } = getCredentials();

  cachedApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });

  return cachedApp;
}

function getDb(): Firestore {
  if (cachedDb) return cachedDb;
  cachedDb = getFirestore(initApp());
  return cachedDb;
}

export { initApp, getDb };
