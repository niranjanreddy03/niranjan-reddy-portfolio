import Link from "next/link";
import {
  Activity,
  BadgeCheck,
  BookOpenCheck,
  Cloud,
  ExternalLink,
  MapPin,
  Radar,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { InteractiveTimeline } from "@/components/interactive-timeline";
import { Navbar } from "@/components/navbar";
import { ProjectShowcase, type Project } from "@/components/project-showcase";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SocialLinks } from "@/components/social-links";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { value: "5+", label: "Security Projects" },
  { value: "4", label: "Credentials" },
  { value: "40+", label: "TryHackMe Labs" },
  { value: "15+", label: "Security Tools Practiced" },
];

const focusAreas = [
  "SOC workflows",
  "Blue Team practice",
  "Threat detection",
  "Incident response",
];

const terminalLines = [
  { key: "profile", value: "Niranjan Reddy" },
  { key: "learning", value: "blue team + cloud security" },
  { key: "current", value: "SOC workflows + SIEM investigation" },
  { key: "tools", value: "Splunk basics / Wireshark / Nmap / AWS" },
];

const skills = [
  {
    category: "Blue Team",
    icon: Radar,
    items: ["SOC workflows", "SIEM basics", "Log analysis", "Alert triage", "Incident notes"],
  },
  {
    category: "Cloud Security",
    icon: Cloud,
    items: ["AWS IAM", "Secure configuration", "Cloud monitoring", "Basic networking"],
  },
  {
    category: "Security Tools",
    icon: Wrench,
    items: ["Wireshark", "Nmap", "Burp Suite", "Linux", "GitHub secret review"],
  },
  {
    category: "Detection Practice",
    icon: BookOpenCheck,
    items: ["TryHackMe", "Detection thinking", "Purple Team awareness", "Security writeups"],
  },
];

const certifications = [
  {
    title: "Quick Heal Certified Digital Forensics Investigator",
    issuer: "Quick Heal Academy",
    status: "Verified certificate",
    description:
      "Certificate in digital forensics investigation, issued to Indukuri Niranjan Reddy with Unique ID 2023/QH/LPU246.",
    verificationHref: "/certificates/quick-heal-digital-forensics-investigator.pdf",
    actionLabel: "Open certificate",
  },
  {
    title: "TryHackMe Security Labs",
    issuer: "TryHackMe",
    status: "Public profile",
    description:
      "Hands-on rooms and labs covering Linux, network tools, defensive security basics, and investigation practice.",
    verificationHref: "https://tryhackme.com/p/niranjan.123",
    actionLabel: "View profile",
  },
  {
    title: "Python Programming Certificate",
    issuer: "CipherSchools",
    status: "Certificate",
    description:
      "Completed Python programming training, useful for security scripting, log parsing, and automation fundamentals.",
    verificationHref:
      "https://www.cipherschools.com/certificate/preview?id=687db9bf3eaa79325b2d2a24",
    actionLabel: "Verify certificate",
  },
  {
    title: "CompTIA Security+",
    issuer: "CompTIA",
    status: "Verification update soon",
    description:
      "Security+ certificate verification will be updated soon after the verification link is ready.",
    verificationHref: "#",
    actionLabel: "Verify Security+",
    disabled: true,
  },
];

const projects: Project[] = [
  {
    title: "TheVaultSentry",
    description:
      "A secret exposure detection project focused on finding leaked credentials in code and presenting risk clearly for security review.",
    stack: ["Secret Scanning", "Credential Detection", "Risk Review"],
    category: "Blue Team",
    // Add this project's GitHub/repository link here.
    githubHref: "https://github.com/niranjanreddy03/valutsentrynew",
  },
  {
    title: "AWS Cloud Security Practice",
    description:
      "AWS security practice focused on IAM basics, secure configuration, networking foundations, and repeatable cloud setup.",
    stack: ["AWS", "IAM", "Secure Configuration"],
    category: "Cloud Security",
    // Add this project's GitHub/repository link here.
    githubHref: "https://github.com/niranjanreddy03/thevaultsentry-aws-infrastructure",
  },
  {
    title: "SOC Threat Detection & Incident Response Simulation",
    description:
      "Simulated a SOC environment by analyzing logs, detecting suspicious activity, investigating alerts, and documenting incident response procedures.",
    stack: ["SOC", "Log Analysis", "Incident Response"],
    category: "Blue Team",
    githubHref: "https://github.com/niranjanreddy03",
  },
  {
    title: "Blue Team Security Lab Project",
    description:
      "Configured defensive security tools for monitoring, basic exposure review, alert handling, and threat mitigation in a lab environment.",
    stack: ["Blue Team", "Monitoring", "Alert Triage"],
    category: "Blue Team",
    githubHref: "https://github.com/niranjanreddy03",
  },
];

const timeline = [
  {
    title: "Commonwealth Bank Cybersecurity Job Simulation",
    description:
      "Completed a practical security simulation covering analyst workflows and business-focused cyber risk thinking.",
    detail:
      "Practiced how cyber risk is communicated to stakeholders, with emphasis on clear findings, prioritization, and realistic analyst workflows.",
  },
  {
    title: "NSS Summer Camp Activities",
    description:
      "Participated in community-oriented activities that strengthened communication, coordination, and leadership skills.",
    detail:
      "Worked in a collaborative environment where planning, public communication, and quick problem solving mattered every day.",
  },
  {
    title: "AWS Cloud Security Learning",
    description:
      "Building fundamentals around cloud identity, networking, monitoring, and secure configuration.",
    detail:
      "Focused on core AWS ideas including IAM, networking foundations, deployment flow, and how secure configuration affects cloud risk.",
  },
  {
    title: "TryHackMe and Security Lab Practice",
    description:
      "Hands-on TryHackMe practice across defensive security, threat detection basics, Linux, and network tools.",
    detail:
      "Used TryHackMe rooms and tools such as Nmap, Wireshark, and Burp Suite to connect theory with practical security investigation habits.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <section
        id="home"
        className="relative flex min-h-screen items-center border-b border-border pt-24"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(159,179,168,0.13),transparent_28%),linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:auto,72px_72px,72px_72px]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <p className="mb-4 flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                Cybersecurity student at Lovely Professional University
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Hi, I&apos;m Niranjan Reddy, a cybersecurity student focused on Blue
                Team operations and cloud security.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                I&apos;m building practical skills in log analysis, incident
                response, SIEM investigation, AWS security, and defensive
                security labs. This portfolio highlights my progress toward
                becoming a stronger Blue Team analyst.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <Badge key={area}>{area}</Badge>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#projects">See what I&apos;ve built</Link>
                </Button>
              </div>
              <div className="mt-8">
                <SocialLinks align="start" compact />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-lg border border-border bg-[#080b0d]/90 shadow-soft">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Terminal className="h-4 w-4 text-accent" aria-hidden="true" />
                    current-session.log
                  </div>
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                </div>
                <div className="space-y-5 p-5 font-mono text-sm">
                  <div>
                    <p className="text-muted">$ whoami</p>
                    <p className="mt-1 text-slate-100">blue team learner / SOC-focused</p>
                  </div>
                  <div className="space-y-3">
                    {terminalLines.map((line) => (
                      <div
                        key={line.key}
                        className="grid gap-1 rounded-md border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-[6.5rem_1fr]"
                      >
                        <span className="text-accent">{line.key}</span>
                        <span className="text-slate-200">{line.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-accent/25 bg-accent-soft p-4">
                    <div className="mb-3 flex items-center gap-2 text-accent">
                      <Activity className="h-4 w-4" aria-hidden="true" />
                      latest focus
                    </div>
                    <p className="leading-6 text-slate-300">
                      Practicing Blue Team investigations, alert triage, and
                      clear incident notes that show how I approach security
                      problems.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="about" className="container py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="About"
              title="A Blue Team-focused cybersecurity student building cloud security fundamentals."
              description="I am currently studying at Lovely Professional University and building my path in Blue Team operations, SOC workflows, and cloud security. My focus is on understanding alerts, logs, cloud configuration, and practical investigation habits."
            />
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
              My interests sit around SOC operations, AWS security, secure cloud
              configuration, log analysis, and threat detection. I practice with
              security labs and small projects that help me understand how
              defenders investigate, prioritize, and document security events.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.05}>
                <StatCard value={stat.value} label={stat.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="border-y border-border bg-white/[0.015]">
        <div className="container py-24 md:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Skills"
              title="Blue Team, cloud security, and practical lab foundations."
              description="A focused toolkit for investigating alerts, reading logs, reviewing cloud configuration, and understanding attacker behavior at a basic level."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {skills.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.05}>
                <Card className="h-full">
                  <CardHeader>
                    <group.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    <CardTitle>{group.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Badge key={item}>{item}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="certifications" className="container py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Certifications"
            title="Verified learning visitors can check directly."
            description="Credential links and public proof points for security training, labs, and cloud practice."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {certifications.map((certification, index) => (
            <Reveal key={certification.title} delay={index * 0.05}>
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/30 bg-accent-soft">
                      <BadgeCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                    </div>
                    <Badge className="border-accent/35 text-accent">
                      {certification.status}
                    </Badge>
                  </div>
                  <CardTitle>{certification.title}</CardTitle>
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                    {certification.issuer}
                  </p>
                  {certification.disabled ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-fit gap-2"
                      disabled
                    >
                      {certification.actionLabel}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="w-fit gap-2"
                    >
                      <Link
                        href={certification.verificationHref}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {certification.actionLabel}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm leading-6 text-muted">
                    {certification.description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="projects" className="container py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Security projects focused on defense, detection, and cloud security."
            description="Selected work centered on Blue Team practice, SOC-style investigation, cloud security basics, and security risk review."
          />
        </Reveal>
        <ProjectShowcase projects={projects} />
      </section>

      <section id="experience" className="border-y border-border bg-white/[0.015]">
        <div className="container py-24 md:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              title="Certifications, simulations, and hands-on practice."
              description="A growing record of applied learning across cybersecurity, cloud, service, and security lab environments."
            />
          </Reveal>
          <InteractiveTimeline items={timeline} />
        </div>
      </section>

      <section id="contact" className="container py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="Let's connect about Blue Team, SOC, or cloud security opportunities."
              description="Open to internships, learning opportunities, and security projects related to defensive operations and cloud security."
            />
            <div className="mt-8">
              <SocialLinks align="start" compact />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 Niranjan Reddy. All rights reserved.</p>
          <p>TryHackMe practice, security labs, and cloud projects.</p>
        </div>
      </footer>
    </main>
  );
}
