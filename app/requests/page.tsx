import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ContactInboxSignOut } from "@/components/contact-inbox-signout";
import { contactInboxSession, contactSessionCookie } from "@/lib/contact-inbox-auth";
import { ensureContactRequestsTable } from "@/lib/contact-requests-server";
import { db } from "@/lib/database";

export const metadata: Metadata = { title: "Contact requests", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const authenticated = await contactInboxSession((await cookies()).get(contactSessionCookie)?.value);
  if (!authenticated) redirect("/requests/signin");

  await ensureContactRequestsTable();
  const requestedPage = Number((await searchParams).page);
  const pageSize = 50;
  const total = await db.contactRequest.count();
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, lastPage) : 1;
  const requests = await db.contactRequest.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize });

  return (
    <main className="min-h-screen bg-[#07090d] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-slate-400 hover:text-white">← Back to portfolio</Link>
          <ContactInboxSignOut />
        </div>
        <div className="mb-8 mt-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Private inbox</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Contact requests</h1>
            <p className="mt-2 text-sm text-slate-400">Messages submitted from the portfolio website.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">{total} total</span>
        </div>
        {requests.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-slate-400">No requests yet.</div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{request.name}</h2>
                    <a href={`mailto:${request.email}`} className="text-sm text-blue-300 hover:underline">{request.email}</a>
                  </div>
                  <time dateTime={request.createdAt.toISOString()} className="text-xs text-slate-400">
                    {request.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">{request.message}</p>
              </article>
            ))}
          </div>
        )}
        {total > pageSize && (
          <nav aria-label="Request pages" className="mt-8 flex items-center justify-between gap-4 text-sm">
            {page > 1 ? <Link href={`/requests?page=${page - 1}`} className="text-blue-300 hover:underline">← Newer requests</Link> : <span />}
            <span className="text-slate-400">Page {page} of {lastPage}</span>
            {page * pageSize < total ? <Link href={`/requests?page=${page + 1}`} className="text-blue-300 hover:underline">Older requests →</Link> : <span />}
          </nav>
        )}
      </div>
    </main>
  );
}
