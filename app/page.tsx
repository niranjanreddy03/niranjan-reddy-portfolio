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
  { value: "5+", label: "Projects Completed" },
  { value: "4", label: "Credentials" },
  { value: "40+", label: "TryHackMe Labs" },
  { value: "15+", label: "Technologies Learned" },
];

const focusAreas = [
  "SOC workflows",
  "AWS security basics",
  "Mobile app testing",
  "Threat monitoring",
];

const terminalLines = [
  { key: "profile", value: "Niranjan Reddy" },
  { key: "learning", value: "cybersecurity + cloud security" },
  { key: "current", value: "building TheVaultSentry" },
  { key: "tools", value: "Burp Suite / Nmap / Wireshark / AWS" },
];

const skills = [
  {
    category: "Cybersecurity",
    icon: Radar,
    items: ["SIEM basics", "Log analysis", "Burp Suite", "Nmap", "Wireshark"],
  },
  {
    category: "Cloud",
    icon: Cloud,
    items: ["AWS", "Cloud deployment", "Docker", "CI/CD"],
  },
  {
    category: "Tools",
    icon: Wrench,
    items: ["Burp Suite", "Nmap", "Wireshark", "Linux", "Git/GitHub"],
  },
  {
    category: "Practice",
    icon: BookOpenCheck,
    items: ["TryHackMe", "CTF basics", "Security labs", "Writeups"],
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
      "Hands-on rooms and labs covering Linux, network tools, vulnerability assessment, and defensive security basics.",
    verificationHref: "https://tryhackme.com/p/niranjan.123",
    actionLabel: "View profile",
  },
  {
    title: "Python Programming Certificate",
    issuer: "CipherSchools",
    status: "Certificate",
    description:
      "Completed Python programming training through CipherSchools, strengthening core programming fundamentals and problem-solving practice.",
    verificationHref:
      "https://www.cipherschools.com/certificate/preview?id=687db9bf3eaa79325b2d2a24",
    actionLabel: "Verify certificate",
  },
  {
    title: "CompTIA Security+",
    issuer: "CompTIA",
    status: "Security certification",
    description:
      "Security+ credential entry for cybersecurity fundamentals, risk management, threats, architecture, and operations.",
    verificationHref: "#",
    actionLabel: "Verification unavailable",
    disabled: true,
  },
];

const projects: Project[] = [
  {
    title: "TheVaultSentry",
    description:
      "A cybersecurity news and threat monitoring platform designed to surface relevant security updates with a clean analyst-friendly interface.",
    stack: ["Threat Intel", "Security Dashboard", "Security News"],
    category: "Security",
    // Add this project's GitHub/repository link here.
    githubHref: "https://github.com/niranjanreddy03/valutsentrynew",
  },
  {
    title: "AWS Cloud Infrastructure Deployment",
    description:
      "Cloud deployment practice focused on AWS services, secure configuration basics, and repeatable infrastructure patterns.",
    stack: ["AWS", "Cloud", "Deployment"],
    category: "Cloud",
    // Add this project's GitHub/repository link here.
    githubHref: "https://github.com/niranjanreddy03/thevaultsentry-aws-infrastructure",
  },
  {
    title: "SOC Threat Detection & Incident Response Simulation",
    description:
      "Simulated a SOC environment by analyzing logs, detecting suspicious activity, investigating alerts, and documenting incident response procedures.",
    stack: ["SOC", "Log Analysis", "Incident Response"],
    category: "Security",
    // Add this project's GitHub/repository link here when the repo is public.
    githubHref: "",
  },
  {
    title: "Blue Team Security Lab Project",
    description:
      "Configured and tested defensive security tools for vulnerability assessment, monitoring, and basic threat mitigation in a lab environment.",
    stack: ["Blue Team", "Monitoring", "Vulnerability Assessment"],
    category: "Security",
    // Add this project's GitHub/repository link here when the repo is public.
    githubHref: "",
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
    title: "AWS Related Learning",
    description:
      "Building fundamentals around cloud infrastructure, deployment models, identity, networking, and secure configuration.",
    detail:
      "Focused on core AWS ideas including IAM, networking foundations, deployment flow, and how secure configuration affects cloud risk.",
  },
  {
    title: "TryHackMe and Security Lab Practice",
    description:
      "Hands-on TryHackMe practice across vulnerability assessment, threat detection basics, Linux, network tools, and mobile app analysis.",
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
                Hi, I&apos;m Niranjan. I build small security projects and learn by
                breaking things carefully.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                I&apos;m focused on SOC operations, AWS security, vulnerability
                assessment, and turning messy security notes into useful systems.
                This site is a working notebook for the projects I&apos;m building.
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
                <Button asChild variant="secondary" size="lg">
                  <Link href="#contact">Add / update socials</Link>
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
                    <p className="mt-1 text-slate-100">security learner / cloud builder</p>
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
                      Practicing threat detection basics and writing cleaner
                      project notes so recruiters can understand the work fast.
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
              title="A security-focused builder with a design-informed background."
              description="I am currently studying at Lovely Professional University and building my path in cybersecurity and cloud security. My earlier interior design background shaped how I think about structure, clarity, and user experience, and that perspective now supports my transition into security."
            />
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
              My interests sit around SOC operations, AWS, secure cloud
              deployment, vulnerability assessment, and threat detection. I like
              working on practical projects that turn security concepts into
              visible, usable systems. I also practice regularly on TryHackMe to
              build stronger hands-on investigation and problem-solving habits.
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
              title="Security, cloud, and development foundations."
              description="A focused toolkit for analyzing systems, deploying cloud infrastructure, and building polished interfaces."
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
            title="Practical work across security, cloud, research, and innovation."
            description="Selected projects presented with the same clarity expected from a modern security consultant portfolio."
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
              title="Let's connect about security, cloud, or practical projects."
              description="Open to project discussions, collaboration, internships, and learning opportunities in cybersecurity and cloud security."
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
