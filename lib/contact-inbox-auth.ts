import type { NextRequest } from "next/server";
import { getSupabaseUser } from "@/lib/supabase/server";

const allowedInboxEmail = "indukuriniranjanreddy@gmail.com";

export function contactInboxConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function contactAllowedEmail() {
  return allowedInboxEmail;
}

export async function contactInboxSession(request?: NextRequest) {
  if (!contactInboxConfigured()) return false;
  const user = await getSupabaseUser(request);
  return user?.email === contactAllowedEmail();
}
