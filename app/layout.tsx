import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Niranjan Reddy | Cybersecurity & Cloud Security Portfolio",
  description:
    "Portfolio of Niranjan Reddy, a cybersecurity student and cloud security enthusiast focused on SOC operations, AWS, vulnerability assessment, and threat detection.",
  keywords: [
    "Niranjan Reddy",
    "Cybersecurity",
    "Cloud Security",
    "AWS",
    "SOC Operations",
    "Vulnerability Assessment",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Niranjan Reddy" }],
  creator: "Niranjan Reddy",
  openGraph: {
    title: "Niranjan Reddy | Cybersecurity & Cloud Security Portfolio",
    description:
      "Cybersecurity student and cloud security enthusiast focused on SOC operations, AWS, vulnerability assessment, and threat detection.",
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
