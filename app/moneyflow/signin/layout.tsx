import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Sign in — MoneyFlow", description: "Open your private MoneyFlow workspace." };
export default function Layout({ children }: { children: ReactNode }) { return children; }
