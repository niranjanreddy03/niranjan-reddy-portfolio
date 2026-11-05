import { NextRequest, NextResponse } from "next/server";
import { configured, sameOrigin, sessionUser } from "@/lib/moneyflow-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ready = configured();
  const user = ready ? await sessionUser(request) : null;
  return NextResponse.json({ configured: ready, user }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  const response = NextResponse.json({ ok: true });
  return response;
}
