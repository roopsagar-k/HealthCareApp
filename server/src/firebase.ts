import admin from "firebase-admin";
import { initialize as initializeFireorm } from "fireorm";
import { ENV } from "./config";

let initialized = false;

export function initializeFirebase() {
  if (initialized) return;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: ENV.FIREBASE_PROJECT_ID,
      clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
      privateKey: ENV.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

  const firestore = admin.firestore();
  initializeFireorm(firestore);

  initialized = true;
  console.log("✅ Firebase Firestore connection initialized successfully");
}
