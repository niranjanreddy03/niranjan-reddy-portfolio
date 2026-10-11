"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ContactForm() {
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setStatus(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: String(formData.get("website") ?? ""),
        }),
      });
      if (!response.ok) {
        throw new Error("Request submission failed");
      }

      form.reset();
      setStatus({ message: "Request submitted. Thanks for reaching out!", error: false });
    } catch {
      setStatus({ message: "Could not submit your request. Please try again.", error: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
        <CardDescription>
          Send a quick message here. I&apos;ll see it in my private requests inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" aria-label="Contact form" onSubmit={handleSubmit}>
          <input className="hidden" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={100}
              className="h-11 w-full rounded-md border border-border bg-white/[0.03] px-3 text-sm outline-none transition-colors placeholder:text-slate-600 focus:border-accent"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              className="h-11 w-full rounded-md border border-border bg-white/[0.03] px-3 text-sm outline-none transition-colors placeholder:text-slate-600 focus:border-accent"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={5000}
              rows={5}
              className="w-full resize-none rounded-md border border-border bg-white/[0.03] px-3 py-3 text-sm outline-none transition-colors placeholder:text-slate-600 focus:border-accent"
              placeholder="Tell me what you would like to discuss"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Sending…" : "Send Message"}
            </Button>
            {status ? (
              <p role="status" className={`text-sm ${status.error ? "text-red-400" : "text-accent"}`}>
                {status.message}
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
