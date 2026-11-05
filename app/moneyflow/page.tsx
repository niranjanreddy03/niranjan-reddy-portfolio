import type { Metadata } from "next";
import { MoneyFlowApp } from "@/components/moneyflow/moneyflow-app";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieName, sessionUserToken } from "@/lib/moneyflow-server";

export const metadata: Metadata = {
  title: "MoneyFlow — Your money, in focus",
  description: "A personal finance command center for your everyday money.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await sessionUserToken((await cookies()).get(sessionCookieName)?.value);
  if (!user) redirect("/moneyflow/signin");
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "01";
  const todayKey = `${value("year")}-${value("month")}-${value("day")}`;
  return <MoneyFlowApp todayKey={todayKey} />;
}
