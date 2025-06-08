import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.includes("\\n")
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : process.env.FIREBASE_PRIVATE_KEY,
  JWT_SECRET: (process.env.JWT_SECRET || "").toString(),
  CLIENT_URL: (process.env.CLIENT_URL || "").toString(),
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
