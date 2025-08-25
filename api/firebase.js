import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FB_PROJECT_ID as string;
  const clientEmail = process.env.FB_CLIENT_EMAIL as string;
  const privateKey = (process.env.FB_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
}

export const db = admin.firestore();