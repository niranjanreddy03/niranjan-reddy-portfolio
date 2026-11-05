import { NextRequest, NextResponse } from "next/server";

import {
  contactInboxConfigured,
  contactInboxSession,
} from "@/lib/contact-inbox-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    configured: contactInboxConfigured(),
    authenticated: await contactInboxSession(request),
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  const response = NextResponse.json({ ok: true });
  return response;
}
