import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedPath = request.nextUrl.searchParams.get("next") || "/";
  let nextPath = "/";
  try {
    const destination = new URL(requestedPath, request.url);
    if (destination.origin === request.nextUrl.origin) {
      nextPath = `${destination.pathname}${destination.search}${destination.hash}`;
    }
  } catch {
    // Invalid redirect targets fall back to the app home page.
  }
  const supabase = await createSupabaseServerClient();
  if (!code || !supabase) return NextResponse.redirect(new URL("/signin?error=auth", request.url));
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/signin?error=auth", request.url));
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  const allowedEmails = new Set([
    process.env.MONEYFLOW_ALLOWED_EMAIL?.trim().toLowerCase(),
    "indukuriniranjanreddy@gmail.com",
  ].filter((value): value is string => Boolean(value)));
  if (!email || !allowedEmails.has(email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/signin?error=unauthorized", request.url));
  }
  return NextResponse.redirect(new URL(nextPath, request.url));
}
