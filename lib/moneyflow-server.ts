import { PrismaClient } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";

const globalPrisma = globalThis as unknown as { moneyflowPrisma?: PrismaClient };
export const db = globalPrisma.moneyflowPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalPrisma.moneyflowPrisma = db;

const cookieName = "moneyflow_session";
const secret = () => {
  const value = process.env.MONEYFLOW_AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("MONEYFLOW_AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
};
export const allowedEmail = () => process.env.MONEYFLOW_ALLOWED_EMAIL?.trim().toLowerCase() ?? "";
export const configured = () => Boolean(process.env.DATABASE_URL && process.env.MONEYFLOW_AUTH_SECRET && process.env.MONEYFLOW_AUTH_SECRET.length >= 32 && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(allowedEmail()));
export async function sessionUserToken(token?: string) {
  if (!token || !configured()) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: "moneyflow", audience: "moneyflow-web" });
    if (typeof payload.sub !== "string") return null;
    const user = await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, name: true, googleSub: true, workspaceVersion: true } });
    if (!user || user.email.toLowerCase() !== allowedEmail() || !user.googleSub) return null;
    return { id: user.id, email: user.email, name: user.name, workspaceVersion: user.workspaceVersion };
  } catch { return null; }
}
export async function sessionUser(request: NextRequest) {
  return sessionUserToken(request.cookies.get(cookieName)?.value);
}
export const sessionCookieName = cookieName;
export async function setSession(response: NextResponse, userId: string) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setIssuer("moneyflow").setAudience("moneyflow-web").setIssuedAt().setExpirationTime("8h").sign(secret());
  response.cookies.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}
export function clearSession(response: NextResponse) { response.cookies.set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); }
export function sameOrigin(request: NextRequest) { return request.headers.get("origin") === request.nextUrl.origin; }
