import * as admin from "firebase-admin";

let app: admin.app.App;

// منع إعادة التهيئة في Vercel أو أثناء Hot Reload
if (!admin.apps.length) {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64");
  }

  const jsonString = Buffer.from(base64, "base64").toString("utf8");
  const serviceAccount = JSON.parse(jsonString);

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

} else {
  app = admin.app();
}

export default app;
export { admin };
