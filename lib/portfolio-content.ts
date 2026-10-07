export const projects = [
  {
    title: "TheVaultSentry",
    description: "A tool for spotting exposed credentials in source code and turning findings into a clear risk review.",
    stack: ["Secret scanning", "Credential detection", "Risk review"],
    category: "Blue Team",
    githubHref: "https://github.com/niranjanreddy03/valutsentrynew",
  },
  {
    title: "AWS Cloud Security Practice",
    description: "Hands-on infrastructure work around IAM, secure configuration, and cloud networking foundations.",
    stack: ["AWS", "IAM", "Configuration"],
    category: "Cloud Security",
    githubHref: "https://github.com/niranjanreddy03/thevaultsentry-aws-infrastructure",
  },
  {
    title: "SOC Threat Detection Simulation",
    description: "A simulated analyst workflow covering log review, alert investigation, and incident documentation.",
    stack: ["SOC", "Log analysis", "Incident response"],
    category: "Blue Team",
    githubHref: "https://github.com/niranjanreddy03",
  },
  {
    title: "Blue Team Security Lab",
    description: "A defensive lab for monitoring, exposure review, alert handling, and threat mitigation practice.",
    stack: ["Monitoring", "Alert triage", "Defense"],
    category: "Blue Team",
    githubHref: "https://github.com/niranjanreddy03",
  },
];

export const capabilities = [
  { number: "01", title: "Investigate", detail: "SOC workflows, SIEM basics, log analysis, alert triage, and incident notes.", tools: "Splunk basics · Wireshark · TryHackMe" },
  { number: "02", title: "Secure", detail: "Identity, configuration, monitoring, and networking fundamentals in AWS.", tools: "AWS IAM · Cloud monitoring · Networking" },
  { number: "03", title: "Build", detail: "Small security projects that turn a concept into something testable and useful.", tools: "Linux · Nmap · Burp Suite · GitHub" },
];

export const credentials = [
  { title: "Digital Forensics Investigator", issuer: "Quick Heal Academy", href: "/certificates/quick-heal-digital-forensics-investigator.pdf", label: "Certificate" },
  { title: "TryHackMe Security Labs", issuer: "TryHackMe", href: "https://tryhackme.com/p/niranjan.123", label: "Public profile" },
  { title: "Python Programming", issuer: "CipherSchools", href: "https://www.cipherschools.com/certificate/preview?id=687db9bf3eaa79325b2d2a24", label: "Certificate" },
];

export const experiences = [
  { title: "Commonwealth Bank Cybersecurity Job Simulation", type: "Simulation", detail: "Analyst workflows and communicating cyber risk in a business context." },
  { title: "TryHackMe & security labs", type: "Ongoing practice", detail: "Defensive security, Linux, and network investigation exercises." },
  { title: "AWS cloud security", type: "Current focus", detail: "Identity, networking, monitoring, and secure configuration." },
  { title: "NSS Summer Camp", type: "Community", detail: "Communication, coordination, and leadership through community work." },
];

export const journeySteps = [
  { phase: "Undergraduate · 7th semester", title: "Lovely Professional University", detail: "Computer Science and Engineering, specializing in Cybersecurity. Currently in the 7th semester." },
  { phase: "Classes 11–12", title: "BGS International Residential School", detail: "Higher secondary education." },
  { phase: "Class 10", title: "V V Model School", detail: "Class 10 schooling in Anantapur." },
  { phase: "Classes 6–9", title: "Akshara International School", detail: "Schooling from Class 6 through Class 9 in Anantapur." },
];
