import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ContactInboxSignOut } from "@/components/contact-inbox-signout";
import { contactInboxSession } from "@/lib/contact-inbox-auth";
import { ensureContactRequestsTable } from "@/lib/contact-requests-server";
import { getCvDownloadCount } from "@/lib/cv-download-counter";
import { db } from "@/lib/database";

export const metadata: Metadata = { title: "Contact requests", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const authenticated = await contactInboxSession();
  if (!authenticated) redirect("/requests/signin");

  await ensureContactRequestsTable();
  const requestedPage = Number((await searchParams).page);
  const pageSize = 50;
  const total = await db.contactRequest.count();
  const cvDownloadCount = await getCvDownloadCount();
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, lastPage) : 1;
  const requests = await db.contactRequest.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize });

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e4eaff_0%,_#f4f6fa_48%,_#eef1f6_100%)] px-5 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">← Back to portfolio</Link>
          <ContactInboxSignOut />
        </div>
        <div className="mb-8 mt-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.17em] text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Private inbox
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">Contact requests</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">Messages and CV activity from your portfolio, in one place.</p>
          </div>
        </div>
        <div className="mb-9 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white bg-white/85 p-5 shadow-[0_12px_40px_rgba(28,43,72,0.07)] sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Messages received</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{total}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/80 p-5 shadow-[0_12px_40px_rgba(28,43,72,0.07)] sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">CV downloads</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{cvDownloadCount}</p>
          </div>
        </div>
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/65 px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-800">Your inbox is clear</p>
            <p className="mt-2 text-sm text-slate-500">New portfolio messages will show up here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-white bg-white/90 p-5 shadow-[0_10px_35px_rgba(28,43,72,0.06)] transition-shadow hover:shadow-[0_14px_42px_rgba(28,43,72,0.1)] sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-slate-900">{request.name}</h2>
                    {request.email ? (
                      <a href={`mailto:${request.email}`} className="text-sm text-blue-700 hover:underline">{request.email}</a>
                    ) : (
                      <span className="text-sm text-slate-500">No email provided</span>
                    )}
                  </div>
                  <time dateTime={request.createdAt.toISOString()} className="text-xs font-medium text-slate-500">
                    {request.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words border-t border-slate-100 pt-4 text-sm leading-7 text-slate-700">{request.message}</p>
              </article>
            ))}
          </div>
        )}
        {total > pageSize && (
          <nav aria-label="Request pages" className="mt-8 flex items-center justify-between gap-4 text-sm">
            {page > 1 ? <Link href={`/requests?page=${page - 1}`} className="text-blue-300 hover:underline">← Newer requests</Link> : <span />}
            <span className="text-slate-500">Page {page} of {lastPage}</span>
            {page * pageSize < total ? <Link href={`/requests?page=${page + 1}`} className="text-blue-700 hover:underline">Older requests →</Link> : <span />}
          </nav>
        )}
      </div>
    </main>
  );
}
