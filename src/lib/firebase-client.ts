import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  type Firestore,
} from "firebase/firestore";

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedFirestore: Firestore | null = null;

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !projectId) {
    throw new Error(
      "Firebase client SDK missing config. Set NEXT_PUBLIC_FIREBASE_API_KEY, " +
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local"
    );
  }

  return { apiKey, authDomain, projectId };
}

function initApp(): FirebaseApp {
  if (cachedApp) return cachedApp;

  const existing = getApps().find((a) => a.name === "[DEFAULT]");
  if (existing) {
    cachedApp = existing;
    return cachedApp;
  }

  const config = getFirebaseConfig();

  cachedApp = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
  });

  return cachedApp;
}

function getClientAuth(): Auth {
  if (cachedAuth) return cachedAuth;
  cachedAuth = getAuth(initApp());
  return cachedAuth;
}

function getClientFirestore(): Firestore {
  if (cachedFirestore) return cachedFirestore;
  cachedFirestore = getFirestore(initApp());
  return cachedFirestore;
}

// ── Types ──

export interface Newsletter {
  title: string;
  markdown: string;
  status: "draft" | "scheduled" | "sent";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Newsletter Persistence ──

const NEWSLETTERS_COLLECTION = "newsletters";

/**
 * Create a new newsletter draft in Firestore.
 * Returns the auto-generated document ID.
 * Throws if title is empty.
 */
export async function createNewsletter(title: string, markdown: string): Promise<string> {
  if (!title.trim()) {
    throw new Error("Title is required");
  }

  const db = getClientFirestore();
  const now = Timestamp.now();

  const docRef = await addDoc(collection(db, NEWSLETTERS_COLLECTION), {
    title: title.trim(),
    markdown,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

/**
 * Update an existing newsletter draft.
 * Updates `updatedAt` to current time. Preserves `createdAt`.
 * Throws if the document does not exist.
 */
export async function updateNewsletter(id: string, title: string, markdown: string): Promise<void> {
  if (!title.trim()) {
    throw new Error("Title is required");
  }

  const db = getClientFirestore();
  const docRef = doc(db, NEWSLETTERS_COLLECTION, id);

  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error("Document not found");
  }

  await updateDoc(docRef, {
    title: title.trim(),
    markdown,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Retrieve a newsletter by its Firestore document ID.
 * Returns the Newsletter object or null if not found.
 */
export async function getNewsletter(id: string): Promise<Newsletter | null> {
  const db = getClientFirestore();
  const docRef = doc(db, NEWSLETTERS_COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    title: data.title,
    markdown: data.markdown,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Newsletter;
}

// Only export `auth` for use in browser components
const auth = typeof window !== "undefined" ? getClientAuth() : (null as unknown as Auth);

export { auth };
