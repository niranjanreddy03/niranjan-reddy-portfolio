import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";

export const contactSessionCookie = "contact_inbox_session";

export function contactPublicOrigin(request: NextRequest) {
  try {
    return process.env.CONTACT_PUBLIC_ORIGIN
      ? new URL(process.env.CONTACT_PUBLIC_ORIGIN).origin
      : request.nextUrl.origin;
  } catch {
    return request.nextUrl.origin;
  }
}

export function contactInboxConfigured() {
  const email = process.env.CONTACT_ALLOWED_EMAIL?.trim() ?? "";
  const publicOrigin = process.env.CONTACT_PUBLIC_ORIGIN;
  let validOrigin = process.env.NODE_ENV !== "production" && !publicOrigin;
  if (publicOrigin) {
    try {
      const parsed = new URL(publicOrigin);
      validOrigin = parsed.protocol === "https:" || (process.env.NODE_ENV !== "production" && parsed.protocol === "http:");
    } catch {
      validOrigin = false;
    }
  }
  return Boolean(
    process.env.CONTACT_GOOGLE_CLIENT_ID &&
    process.env.CONTACT_GOOGLE_CLIENT_SECRET &&
    process.env.CONTACT_AUTH_SECRET &&
    process.env.CONTACT_AUTH_SECRET.length >= 32 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    validOrigin,
  );
}

function signingKey() {
  const secret = process.env.CONTACT_AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("CONTACT_AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(secret);
}

export function contactAllowedEmail() {
  return process.env.CONTACT_ALLOWED_EMAIL?.trim().toLowerCase() ?? "";
}

export async function contactInboxSession(token?: string) {
  if (!token || !contactInboxConfigured()) return false;
  try {
    const { payload } = await jwtVerify(token, signingKey(), { issuer: "portfolio-contact", audience: "contact-inbox" });
    return payload.email === contactAllowedEmail() && typeof payload.sub === "string";
  } catch {
    return false;
  }
}

export async function setContactInboxSession(response: NextResponse, googleSub: string, email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(googleSub)
    .setIssuer("portfolio-contact")
    .setAudience("contact-inbox")
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(signingKey());
  response.cookies.set(contactSessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearContactInboxSession(response: NextResponse) {
  response.cookies.set(contactSessionCookie, "", { path: "/", maxAge: 0 });
}
