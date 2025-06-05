import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!,
  FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  ),
  JWT_SECRET: (process.env.JWT_SECRET || "").toString(),
};
