import { NextRequest, NextResponse } from "next/server";
import { clearSession, configured, sameOrigin, sessionUser } from "@/lib/moneyflow-server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ready = configured();
  const user = ready ? await sessionUser(request) : null;
  return NextResponse.json({ configured: ready, googleConfigured: ready, user }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  clearSession(response);
  return response;
}
