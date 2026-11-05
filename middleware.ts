import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const isMoneyFlowHost = host === "moneyflow.niranjanreddy.tech";
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!isMoneyFlowHost && supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    try {
      await supabase.auth.getUser();
    } catch {
      // Public pages and server-side authorization checks remain available if Supabase is unreachable.
    }
  }

  if (!isMoneyFlowHost) return response;
  if (request.nextUrl.pathname.startsWith("/requests")) {
    return NextResponse.redirect(new URL(request.nextUrl.pathname + request.nextUrl.search, "https://niranjanreddy.tech"));
  }
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/signin") {
    const rewritten = NextResponse.rewrite(new URL(request.nextUrl.pathname === "/" ? "/moneyflow" : "/moneyflow/signin", request.url));
    response.cookies.getAll().forEach(({ name, value, ...options }) => rewritten.cookies.set(name, value, options));
    return rewritten;
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
