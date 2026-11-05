import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function createSupabaseServerClient(request?: NextRequest) {
  const cookieStore = request ? null : await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookieOptions: process.env.NODE_ENV === "production" && process.env.SUPABASE_COOKIE_DOMAIN
      ? { domain: process.env.SUPABASE_COOKIE_DOMAIN }
      : undefined,
    cookies: {
      getAll() {
        return request ? request.cookies.getAll() : cookieStore!.getAll();
      },
      setAll(cookiesToSet) {
        if (request) return;
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore!.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; middleware refreshes sessions.
        }
      },
    },
  });
}

export async function getSupabaseUser(request?: NextRequest) {
  const supabase = await createSupabaseServerClient(request);
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const email = data.user.email?.trim().toLowerCase();
  if (!email || !data.user.email_confirmed_at) return null;
  return { ...data.user, email };
}
