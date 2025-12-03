import { NextResponse } from "next/server";
import admin from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");
    const botId = searchParams.get("state");

    if (!code || !botId) {
      return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
    }

    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FB_APP_ID!,
          client_secret: process.env.FB_APP_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_API_URL}/api/instagram/oauth/callback`,
          code,
        })
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 500 });
    }

    await admin.firestore().collection("bots").doc(botId).set(
      {
        instagramAccessToken: tokenData.access_token,
        connectedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/bot/${botId}?connected=1`
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
