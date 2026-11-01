import { NextRequest, NextResponse } from "next/server";

import { incrementCvDownloadCount } from "@/lib/cv-download-counter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    await incrementCvDownloadCount();
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Could not count CV download" }, { status: 500 });
  }
}
