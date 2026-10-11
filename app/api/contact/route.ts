import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureContactRequestsTable } from "@/lib/contact-requests-server";
import { db } from "@/lib/database";

export const runtime = "nodejs";

const requestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    const body = await request.text();
    if (body.length > 12000) {
      return NextResponse.json({ error: "Message is too long" }, { status: 413 });
    }
    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const parsed = requestSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check your name, email, and message" }, { status: 400 });
    }
    if (parsed.data.website) return NextResponse.json({ ok: true });

    await ensureContactRequestsTable();
    await db.contactRequest.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.trim().toLowerCase(),
        message: parsed.data.message,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not submit your message" }, { status: 500 });
  }
}
