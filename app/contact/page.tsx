import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { PortfolioFrame } from "@/components/portfolio-frame";
import { SocialLinks } from "@/components/social-links";

export const metadata: Metadata = { title: "Contact | Niranjan Reddy" };

export default function ContactPage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-contact portfolio-section portfolio-inner-page">
        <div className="portfolio-shell portfolio-contact-grid">
          <div>
            <div className="portfolio-section-label"><span>LET&apos;S TALK</span> CONTACT</div>
            <h1 className="portfolio-contact-title">Let&apos;s build<br /><em>something safer.</em></h1>
            <p>Open to internships, security projects, and conversations about Blue Team and cloud security.</p>
            <SocialLinks align="start" compact />
          </div>
          <ContactForm />
        </div>
      </section>
    </PortfolioFrame>
  );
}
