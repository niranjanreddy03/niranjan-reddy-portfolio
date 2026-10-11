import { NextRequest, NextResponse } from "next/server";

import {
  clearContactInboxSession,
  contactInboxConfigured,
  contactInboxSession,
  contactSessionCookie,
} from "@/lib/contact-inbox-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    configured: contactInboxConfigured(),
    authenticated: await contactInboxSession(request.cookies.get(contactSessionCookie)?.value),
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  clearContactInboxSession(response);
  return response;
}
