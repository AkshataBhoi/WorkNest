"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Handle client-side initialization with singleton protection
let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;
let firebaseDb: Firestore;

if (typeof window !== "undefined") {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseDb = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    firebaseAuth = getAuth(firebaseApp);
  } else {
    firebaseApp = getApp();
    firebaseDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
  }
} else {
  // Mock/Empty for SSR to prevent crashes
  firebaseApp = {} as FirebaseApp;
  firebaseAuth = {} as Auth;
  firebaseDb = {} as Firestore;
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firebaseDb;
export const googleProvider = new GoogleAuthProvider();

export default app;
