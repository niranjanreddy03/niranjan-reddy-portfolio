import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PortfolioFrame, PortfolioPageHeading } from "@/components/portfolio-frame";

export const metadata: Metadata = { title: "About | Niranjan Reddy" };

export default function AboutPage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-about portfolio-section portfolio-inner-page">
        <div className="portfolio-shell">
          <PortfolioPageHeading index="01 / 06" label="About" title="Security starts with asking the right questions." />
          <div className="portfolio-about-content">
            <p className="portfolio-about-lead">I&apos;m drawn to the moment when a small clue starts to explain a bigger security problem. That curiosity is shaping how I learn to think like a defender: follow the evidence, understand the context, and explain what matters.</p>
            <div>
              <p>At Lovely Professional University, I&apos;m building a foundation in Blue Team operations, incident response, cloud security, and threat detection. Labs and projects give me a place to test what I learn and sharpen how I investigate.</p>
              <p>After time spent with logs, labs, and code, I step away from the screen and go skateboarding. It&apos;s how I enjoy my free time outside my regular work and come back ready for the next problem.</p>
              <Link href="/contact" className="portfolio-underlined-link">Get in touch <ArrowUpRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>
    </PortfolioFrame>
  );
}
