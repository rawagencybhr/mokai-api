import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const botId = req.nextUrl.searchParams.get("botId");

  if (!botId) {
    return new Response("Missing botId", { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/instagram/oauth/callback`;

  const authUrl =
    "https://www.facebook.com/v21.0/dialog/oauth?" +
    new URLSearchParams({
      client_id: process.env.FB_APP_ID!,
      redirect_uri: redirectUri,
      scope:
        "instagram_basic,pages_show_list,instagram_manage_messages,pages_manage_metadata",
      response_type: "code",
      state: botId,
    }).toString();

  return Response.redirect(authUrl);
}
