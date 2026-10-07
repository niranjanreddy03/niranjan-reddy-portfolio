import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { PortfolioFrame } from "@/components/portfolio-frame";
import { PortfolioHashRedirect } from "@/components/portfolio-hash-redirect";

const destinations = [
  { number: "01", title: "About", detail: "The person behind the work", href: "/about" },
  { number: "02", title: "Projects", detail: "Selected security work", href: "/projects" },
  { number: "03", title: "Capabilities", detail: "What I work on", href: "/skills" },
  { number: "04", title: "Journey", detail: "How I got here", href: "/journey" },
];

export default function Home() {
  return (
    <PortfolioFrame>
      <PortfolioHashRedirect />
      <section className="portfolio-hero" aria-labelledby="hero-title">
        <div className="portfolio-shell">
          <div className="portfolio-hero-meta">
            <span>CYBERSECURITY PORTFOLIO / 2026</span>
          </div>
          <h1 id="hero-title">Niranjan<br /><span>Reddy.</span></h1>
          <div className="portfolio-hero-content">
            <div>
              <p className="portfolio-role">Blue Team <span>/</span> Cloud Security</p>
              <p className="portfolio-intro">I investigate security problems, build practical tools, and keep learning how to defend systems well.</p>
              <div className="portfolio-hero-actions">
                <Link className="portfolio-primary-link" href="/projects">View selected work <ArrowUpRight size={19} /></Link>
                <Link className="portfolio-secondary-link" href="/about">About me <ArrowRight size={17} /></Link>
              </div>
            </div>
            <div className="portfolio-hero-aside">
              <span>BASED IN INDIA</span>
              <p>Cybersecurity student at Lovely Professional University. Focused on SOC operations, detection, and AWS security.</p>
              <span className="portfolio-aside-index">NR / 01</span>
            </div>
          </div>
          <div className="portfolio-hero-strip" aria-label="Areas of focus">
            <Link href="/skills">01 <b>Threat detection</b></Link>
            <Link href="/skills">02 <b>Cloud security</b></Link>
            <Link href="/projects">03 <b>Defensive tooling</b></Link>
          </div>
        </div>
      </section>

      <section className="portfolio-home-directory portfolio-section" aria-labelledby="explore-title">
        <div className="portfolio-shell">
          <div className="portfolio-section-label"><span>EXPLORE</span> THE PORTFOLIO</div>
          <h2 id="explore-title">Start somewhere.</h2>
          <div className="portfolio-directory-list">
            {destinations.map((item) => (
              <Link href={item.href} key={item.title}>
                <span>{item.number}</span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
                <ArrowUpRight size={23} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PortfolioFrame>
  );
}
