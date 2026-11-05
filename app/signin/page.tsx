import SignIn from "@/components/auth/sign-in";

export default async function PortfolioSignIn({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = (await searchParams).next || "/";
  const nextPath = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return <SignIn nextPath={nextPath} theme="portfolio" />;
}
