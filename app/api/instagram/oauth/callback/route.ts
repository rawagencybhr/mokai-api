export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import app, { admin } from "@/lib/firebase"; // ← الاستيراد الصحيح

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");
    const botId = searchParams.get("state");

    if (!code || !botId) {
      return NextResponse.json(
        { error: "Missing code or state" },
        { status: 400 }
      );
    }

    const client_id = process.env.FB_APP_ID;
    const client_secret = process.env.FB_APP_SECRET;
    const redirect_uri = `${process.env.NEXT_PUBLIC_API_URL}/api/instagram/oauth/callback`;

    if (!client_id || !client_secret) {
      return NextResponse.json(
        { error: "Missing FB APP env vars" },
        { status: 500 }
      );
    }

    // 1) Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          client_id,
          client_secret,
          redirect_uri,
          code,
        })
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 500 });
    }

    // 2) Save Token into Firestore
    const db = admin.firestore();
    await db.collection("bots").doc(botId).set(
      {
        instagramAccessToken: tokenData.access_token,
        connectedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // 3) Redirect back to dashboard
    const redirectURL = `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/bot/${botId}?connected=1`;
    return NextResponse.redirect(redirectURL);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
