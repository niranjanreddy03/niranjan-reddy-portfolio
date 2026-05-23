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
import { contactEmail } from "@/lib/profile";

export function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name || "visitor"}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setStatus("Opening your email app with the message ready to send.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a message</CardTitle>
        <CardDescription>
          Reach me directly at {contactEmail} or send a quick message here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" aria-label="Contact form" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
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
              rows={5}
              className="w-full resize-none rounded-md border border-border bg-white/[0.03] px-3 py-3 text-sm outline-none transition-colors placeholder:text-slate-600 focus:border-accent"
              placeholder="Tell me what you would like to discuss"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" className="w-full sm:w-auto">
              Send Message
            </Button>
            {status ? <p className="text-sm text-accent">{status}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
