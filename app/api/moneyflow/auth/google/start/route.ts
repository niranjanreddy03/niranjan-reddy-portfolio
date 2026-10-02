import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { configured } from "@/lib/moneyflow-server";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !configured()) return NextResponse.json({ error: "Google sign-in is not configured" }, { status: 503 });
  const state = randomBytes(24).toString("base64url"); const nonce = randomBytes(24).toString("base64url"); const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const redirectUri = `${request.nextUrl.origin}/api/moneyflow/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", state, nonce, code_challenge: challenge, code_challenge_method: "S256", prompt: "select_account" }).toString();
  const response = NextResponse.redirect(url);
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/api/moneyflow/auth/google", maxAge: 600 };
  response.cookies.set("mf_google_state", state, options); response.cookies.set("mf_google_nonce", nonce, options); response.cookies.set("mf_google_verifier", verifier, options);
  return response;
}
