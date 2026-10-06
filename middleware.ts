import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (host !== "moneyflow.niranjanreddy.tech") return NextResponse.next();
  if (request.nextUrl.pathname === "/") return NextResponse.rewrite(new URL("/moneyflow", request.url));
  if (request.nextUrl.pathname === "/signin") return NextResponse.rewrite(new URL("/moneyflow/signin", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/", "/signin"] };
