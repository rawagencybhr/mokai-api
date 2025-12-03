export const runtime = "nodejs"; 
export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";

/**
 * Instagram Webhook GET (Verification)
 * Meta will call this once when you add the webhook
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    console.log("Webhook Verified Successfully!");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Verification failed", { status: 403 });
}

/**
 * Instagram Webhook POST (Messages from IG)
 * Meta sends all messages and events here
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 New Instagram Webhook Event:", JSON.stringify(body, null, 2));

    // TODO: هنا تقوم بمعالجة الرسالة حسب البوت الخاص فيك
    // مثال: استخراج sender ID أو الرسالة
    // const entry = body.entry?.[0];
    // const messaging = entry?.changes?.[0];

    return new Response("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("❌ Error in IG Webhook:", error);
    return new Response("Error", { status: 500 });
  }
}
