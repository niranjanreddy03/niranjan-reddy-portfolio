"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const items = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Work" },
  { href: "/skills", label: "Skills" },
  { href: "/credentials", label: "Credentials" },
  { href: "/experience", label: "Experience" },
  { href: "/journey", label: "Journey" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="portfolio-nav">
      <nav className="portfolio-shell portfolio-nav-inner" aria-label="Main navigation">
        <Link className="portfolio-logo" href="/" onClick={() => setOpen(false)}>
          NIRANJAN<span>.</span>
        </Link>
        <div className="portfolio-nav-links">
          {items.map((item) => <Link href={item.href} key={item.href} aria-current={pathname === item.href ? "page" : undefined} className={pathname === item.href ? "is-active" : ""}>{item.label}</Link>)}
        </div>
        <Link className={`portfolio-nav-contact ${pathname === "/contact" ? "is-active" : ""}`} href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>Contact <ArrowUpRight size={17} /></Link>
        <button
          type="button"
          className="portfolio-menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="portfolio-mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      <div id="portfolio-mobile-menu" className={`portfolio-mobile-menu ${open ? "is-open" : ""}`}>
        {[...items, { href: "/contact", label: "Contact" }].map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>
            {item.label}<ArrowUpRight size={17} />
          </Link>
        ))}
      </div>
    </header>
  );
}
