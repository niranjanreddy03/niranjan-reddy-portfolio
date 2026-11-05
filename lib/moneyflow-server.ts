import type { NextRequest } from "next/server";
import { db } from "@/lib/database";
import { getSupabaseUser } from "@/lib/supabase/server";
import { authorizedPortfolioEmail } from "@/lib/auth-authorization";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
export { db };

export const allowedEmail = () => authorizedPortfolioEmail;
export const configured = () => Boolean(
  (tursoUrl && tursoToken || process.env.DATABASE_URL && !process.env.MONEYFLOW_PUBLIC_ORIGIN) &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export async function sessionUser(request?: NextRequest) {
  if (!configured()) return null;
  const authUser = await getSupabaseUser(request);
  if (!authUser || authUser.email !== allowedEmail()) return null;
  const user = await db.user.findUnique({
    where: { email: authUser.email },
    select: { id: true, email: true, name: true, workspaceVersion: true },
  });
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, workspaceVersion: user.workspaceVersion };
}

export function sameOrigin(request: NextRequest) {
  const publicOrigin = process.env.MONEYFLOW_PUBLIC_ORIGIN && new URL(process.env.MONEYFLOW_PUBLIC_ORIGIN).origin;
  const requestHost = request.headers.get("host")?.split(":")[0].toLowerCase();
  const expectedOrigin = publicOrigin && requestHost === new URL(publicOrigin).hostname ? publicOrigin : request.nextUrl.origin;
  return request.headers.get("origin") === expectedOrigin;
}
