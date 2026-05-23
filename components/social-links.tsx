"use client";

import Link from "next/link";
import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TryHackMeIcon,
} from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { socialLinks } from "@/lib/profile";

const icons = {
  Email: Mail,
  GitHub: GitHubIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  TryHackMe: TryHackMeIcon,
};

type SocialLinksProps = {
  align?: "center" | "start";
  compact?: boolean;
};

export function SocialLinks({ align = "center", compact = false }: SocialLinksProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyLink(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div
      className={
        align === "start"
          ? "flex flex-wrap items-center justify-start gap-3"
          : "flex flex-wrap items-center justify-center gap-3"
      }
    >
      {socialLinks.map((social) => {
        const Icon = icons[social.label as keyof typeof icons] ?? Mail;
        const copyValue = social.copyValue ?? social.href;
        const isCopied = copied === social.label;

        return (
          <div key={social.label} className="group relative">
            <Button
              asChild
              variant="secondary"
              size={compact ? "sm" : "default"}
              className="gap-2 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Link
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {social.label}
              </Link>
            </Button>
            <button
              type="button"
              aria-label={`Copy ${social.label} link`}
              onClick={() => copyLink(copyValue, social.label)}
              className="absolute -right-2 -top-2 inline-flex h-7 w-7 scale-90 items-center justify-center rounded-full border border-border bg-background text-muted opacity-0 shadow-soft transition-all hover:text-foreground group-hover:scale-100 group-hover:opacity-100 focus:scale-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
