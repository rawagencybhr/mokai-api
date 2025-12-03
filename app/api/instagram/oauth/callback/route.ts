import { NextResponse } from "next/server";
import admin from "@/lib/firebase";

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

    const appId = process.env.FACEBOOK_APP_ID!;
    const appSecret = process.env.FACEBOOK_APP_SECRET!;
    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/instagram/oauth/callback`;

    const tokenUrl =
      "https://graph.facebook.com/v21.0/oauth/access_token?" +
      new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        client_secret: appSecret,
        code,
      }).toString();

    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 500 });
    }

    await admin
      .firestore()
      .collection("bots")
      .doc(botId)
      .set(
        {
          instagramAccessToken: tokenData.access_token,
          connectedAt: new Date(),
        },
        { merge: true }
      );

    return NextResponse.json({
      success: true,
      message: "Instagram connected successfully",
      token: tokenData.access_token,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
