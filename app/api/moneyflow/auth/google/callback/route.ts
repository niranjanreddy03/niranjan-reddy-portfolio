import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { allowedEmail, configured, db, googleRedirectUri, setSession } from "@/lib/moneyflow-server";

export const runtime = "nodejs";
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code"); const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("mf_google_state")?.value; const nonce = request.cookies.get("mf_google_nonce")?.value; const verifier = request.cookies.get("mf_google_verifier")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID; const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const fail = () => NextResponse.redirect(new URL("/moneyflow/signin?error=google", request.url));
  if (!code || !state || !savedState || state !== savedState || !nonce || !verifier || !clientId || !clientSecret || !configured()) return fail();
  try {
    const result = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, code_verifier: verifier, redirect_uri: googleRedirectUri(request), grant_type: "authorization_code" }), cache: "no-store" });
    if (!result.ok) return fail();
    const token = await result.json() as { id_token?: string };
    if (!token.id_token) return fail();
    const { payload } = await jwtVerify(token.id_token, jwks, { audience: clientId, issuer: ["https://accounts.google.com", "accounts.google.com"] });
    if (payload.nonce !== nonce || typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.email_verified !== true) return fail();
    const email = payload.email.trim().toLowerCase();
    if (email !== allowedEmail()) return fail();
    const existing = await db.user.findUnique({ where: { email } });
    if (!existing || (existing.googleSub && existing.googleSub !== payload.sub)) return fail();
    const user = await db.user.update({ where: { id: existing.id }, data: { googleSub: payload.sub, name: existing.name ?? (typeof payload.name === "string" ? payload.name : null) } });
    await db.auditEvent.create({ data: { userId: user.id, action: "account.login.google" } });
    const publicOrigin = new URL(googleRedirectUri(request)).origin;
    const homePath = new URL(publicOrigin).hostname === "moneyflow.niranjanreddy.tech" ? "/" : "/moneyflow";
    const response = NextResponse.redirect(new URL(homePath, publicOrigin));
    await setSession(response, user.id);
    for (const name of ["mf_google_state", "mf_google_nonce", "mf_google_verifier"]) response.cookies.set(name, "", { path: "/api/moneyflow/auth/google", maxAge: 0 });
    return response;
  } catch { return fail(); }
}
