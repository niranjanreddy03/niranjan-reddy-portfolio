import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, FileText, Inbox, Mail, ShieldCheck } from "lucide-react";

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
  const pageSize = 25;
  const total = await db.contactRequest.count();
  const cvDownloadCount = await getCvDownloadCount();
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, lastPage) : 1;
  const requests = await db.contactRequest.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize });
  const pageStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, total);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-18%,_rgba(66,91,180,0.28),_transparent_56%)]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <header className="flex min-h-[82px] items-center justify-between border-b border-white/[0.08]">
          <Link href="/" className="group flex items-center gap-3" aria-label="Back to portfolio home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-200 transition-colors group-hover:bg-indigo-400/20"><Inbox size={19} /></span>
            <span><span className="block text-sm font-semibold tracking-wide text-white">Niranjan Reddy</span><span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Portfolio inbox</span></span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:inline-flex"><ShieldCheck size={14} className="text-emerald-400" /> Private workspace</span>
            <ContactInboxSignOut />
          </div>
        </header>

        <section className="pt-10 sm:pt-14">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-200"><ArrowLeft size={14} /> Back to portfolio</Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300">Private workspace</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">Contact inbox<span className="text-indigo-300">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Portfolio messages and CV activity, collected in one quiet place.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Inbox is private</div>
          </div>
        </section>

        <section aria-label="Inbox activity" className="mt-8 grid gap-3 sm:grid-cols-2">
          <article className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 transition-colors hover:border-indigo-300/20 hover:bg-white/[0.05] sm:p-6">
            <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300"><ArrowDownLeft size={19} /></span><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">All time</span></div>
            <p className="mt-6 text-3xl font-semibold tracking-tight text-white">{total}</p>
            <p className="mt-1 text-sm text-slate-400">Messages received</p>
          </article>
          <article className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 transition-colors hover:border-violet-300/20 hover:bg-white/[0.05] sm:p-6">
            <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><FileText size={18} /></span><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">All time</span></div>
            <p className="mt-6 text-3xl font-semibold tracking-tight text-white">{cvDownloadCount}</p>
            <p className="mt-1 text-sm text-slate-400">CV downloads</p>
          </article>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div><div className="flex items-center gap-2"><Mail size={16} className="text-indigo-300" /><h2 className="text-base font-semibold text-white">Recent messages</h2></div><p className="mt-1.5 text-xs text-slate-500">Submissions from your portfolio contact form</p></div>
            {total > 0 && <p className="text-xs tabular-nums text-slate-500">Showing <span className="font-medium text-slate-300">{pageStart}–{pageEnd}</span> of {total}</p>}
          </div>

          {requests.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/[0.13] bg-white/[0.025] px-6 py-20 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-slate-400"><Inbox size={21} /></span>
              <h3 className="mt-5 text-base font-semibold text-white">Your inbox is clear</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">New messages sent through your portfolio will appear here.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {requests.map((request) => (
                <article key={request.id} className="rounded-2xl border border-white/[0.08] bg-[#10141e]/90 p-5 transition-colors hover:border-white/[0.14] sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-indigo-300/15 bg-indigo-400/[0.08] text-sm font-semibold text-indigo-200">{request.name.trim().slice(0, 1).toUpperCase() || "?"}</span>
                      <div className="min-w-0"><h3 className="truncate text-sm font-semibold text-white">{request.name}</h3>{request.email ? <a href={`mailto:${request.email}`} className="mt-1 block truncate text-xs text-indigo-300 transition-colors hover:text-indigo-200">{request.email}</a> : <span className="mt-1 block text-xs text-slate-500">No email provided</span>}</div>
                    </div>
                    <time dateTime={request.createdAt.toISOString()} className="shrink-0 rounded-lg border border-white/[0.07] px-2.5 py-1.5 text-[11px] font-medium text-slate-400">{request.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</time>
                  </div>
                  <p className="mt-5 whitespace-pre-wrap break-words border-t border-white/[0.07] pt-4 text-sm leading-7 text-slate-300">{request.message}</p>
                  {request.email && <div className="mt-4 flex justify-end"><a href={`mailto:${request.email}?subject=${encodeURIComponent("Re: your portfolio message")}`} className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.09] px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-300/25 hover:bg-indigo-300/[0.07] hover:text-white">Reply by email <ArrowUpRight size={13} /></a></div>}
                </article>
              ))}
            </div>
          )}

          {total > pageSize && (
            <nav aria-label="Request pages" className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-xs">
              {page > 1 ? <Link href={`/requests?page=${page - 1}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"><ArrowLeft size={14} /> Newer</Link> : <span className="px-3 py-2 text-slate-600">Newest</span>}
              <span className="tabular-nums text-slate-500">Page <span className="text-slate-300">{page}</span> of {lastPage}</span>
              {page < lastPage ? <Link href={`/requests?page=${page + 1}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white">Older <ArrowRight size={14} /></Link> : <span className="px-3 py-2 text-slate-600">Oldest</span>}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
