import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

import {
  contactAllowedEmail,
  contactInboxConfigured,
  contactPublicOrigin,
  setContactInboxSession,
} from "@/lib/contact-inbox-auth";

export const runtime = "nodejs";

const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export async function GET(request: NextRequest) {
  const publicOrigin = contactPublicOrigin(request);
  const fail = () => NextResponse.redirect(new URL("/requests/signin?error=google", publicOrigin));
  if (!contactInboxConfigured() || request.nextUrl.origin !== publicOrigin) return fail();

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("contact_google_state")?.value;
  const nonce = request.cookies.get("contact_google_nonce")?.value;
  const verifier = request.cookies.get("contact_google_verifier")?.value;
  if (!code || !state || !savedState || state !== savedState || !nonce || !verifier) return fail();

  try {
    const clientId = process.env.CONTACT_GOOGLE_CLIENT_ID!;
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: process.env.CONTACT_GOOGLE_CLIENT_SECRET!,
        code_verifier: verifier,
        redirect_uri: `${publicOrigin}/api/contact/auth/google/callback`,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    if (!response.ok) return fail();
    const token = await response.json() as { id_token?: string };
    if (!token.id_token) return fail();
    const { payload } = await jwtVerify(token.id_token, jwks, {
      audience: clientId,
      issuer: ["https://accounts.google.com", "accounts.google.com"],
    });
    if (payload.nonce !== nonce || typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.email_verified !== true) return fail();
    const email = payload.email.trim().toLowerCase();
    if (email !== contactAllowedEmail()) return fail();

    const signedIn = NextResponse.redirect(new URL("/requests", publicOrigin));
    await setContactInboxSession(signedIn, payload.sub, email);
    for (const name of ["contact_google_state", "contact_google_nonce", "contact_google_verifier"]) {
      signedIn.cookies.set(name, "", { path: "/api/contact/auth/google", maxAge: 0 });
    }
    return signedIn;
  } catch {
    return fail();
  }
}
