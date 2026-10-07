"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const legacyHashRoutes: Record<string, string> = {
  about: "/about",
  projects: "/projects",
  skills: "/skills",
  certifications: "/credentials",
  experience: "/experience",
  journey: "/journey",
  contact: "/contact",
};

export function PortfolioHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const route = legacyHashRoutes[window.location.hash.slice(1).toLowerCase()];
    if (route) router.replace(route);
  }, [router]);

  return null;
}
