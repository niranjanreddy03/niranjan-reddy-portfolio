import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { contactInboxConfigured, contactPublicOrigin } from "@/lib/contact-inbox-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!contactInboxConfigured()) {
    return NextResponse.json({ error: "Contact inbox SSO is not configured" }, { status: 503 });
  }
  const publicOrigin = contactPublicOrigin(request);
  if (request.nextUrl.origin !== publicOrigin) {
    return NextResponse.redirect(new URL("/api/contact/auth/google/start", publicOrigin));
  }

  const state = randomBytes(24).toString("base64url");
  const nonce = randomBytes(24).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: process.env.CONTACT_GOOGLE_CLIENT_ID!,
    redirect_uri: `${publicOrigin}/api/contact/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const response = NextResponse.redirect(url);
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/api/contact/auth/google", maxAge: 600 };
  response.cookies.set("contact_google_state", state, options);
  response.cookies.set("contact_google_nonce", nonce, options);
  response.cookies.set("contact_google_verifier", verifier, options);
  return response;
}
