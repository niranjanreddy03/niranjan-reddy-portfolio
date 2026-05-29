import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Niranjan Reddy | Cybersecurity & Cloud Security Portfolio",
  description:
    "Portfolio of Niranjan Reddy, a cybersecurity student focused on Blue Team operations, SOC workflows, AWS security, and cloud security fundamentals.",
  keywords: [
    "Niranjan Reddy",
    "Cybersecurity",
    "Blue Team",
    "Cloud Security",
    "AWS",
    "SOC Operations",
    "SIEM",
    "Incident Response",
  ],
  authors: [{ name: "Niranjan Reddy" }],
  creator: "Niranjan Reddy",
  openGraph: {
    title: "Niranjan Reddy | Cybersecurity & Cloud Security Portfolio",
    description:
      "Cybersecurity student focused on Blue Team operations, SOC workflows, AWS security, and cloud security fundamentals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
