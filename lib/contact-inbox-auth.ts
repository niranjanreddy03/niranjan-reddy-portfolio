import type { NextRequest } from "next/server";
import { getSupabaseUser } from "@/lib/supabase/server";
import { authorizedPortfolioEmail } from "@/lib/auth-authorization";

export function contactInboxConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function contactAllowedEmail() {
  return authorizedPortfolioEmail;
}

export async function contactInboxSession(request?: NextRequest) {
  if (!contactInboxConfigured()) return false;
  const user = await getSupabaseUser(request);
  return user?.email === contactAllowedEmail();
}
