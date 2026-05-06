import type {
  AboutGroup,
  ContactField,
  ContactFormData,
  FooterColumn,
  NavItem,
  Project,
  SkillCategory,
  SocialLink,
  StatItem,
} from "@/types/portfolio";

export const BRAND = {
  name: "PARV",
  legalName: "Parv Gosani",
  role: "Frontend Developer",
  location: "Gujarat, India",
  email: "parvgosani107@gmail.com",
  year: "2026",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about", number: "01" },
  { label: "Work", href: "#work", number: "02" },
  { label: "Philosophy", href: "#philosophy", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", icon: "github", href: "https://github.com/Parv3008" },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/parv-gosani" },
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/parvgosani" },
  { label: "Email", icon: "mail", href: `mailto:${BRAND.email}` },
];

export const HERO_COPY = {
  availability: "Open to collaborate",
  headline: "Building software that feels alive",
  summary:
    "I am a frontend developer obsessed with clean code, AI-assisted workflows, and shipping things that actually feel alive. My focus is on turning complex product ideas into motion-led interfaces that remain fast, readable, and production-safe.",
  cta: "Get in touch",
};

export const ABOUT_CONTEXT_LABEL = "Background & Data";

export const ABOUT_GROUPS: AboutGroup[] = [
  {
    number: "01",
    label: "Education",
    entries: [
      {
        title: "Navrachana University, Vadodara, Gujarat",
        subtitle: "B.Tech, Computer Science & Engineering (2021-2025)",
      },
    ],
  },
  {
    number: "02",
    label: "Experience",
    entries: [
      {
        title: "Yudiz Solutions Pvt. Ltd.",
        subtitle: "Frontend Developer (January 2026 - Present)",
      },
    ],
  },
  {
    number: "03",
    label: "Focus",
    entries: [
      { title: "Fast, readable code & AI-assisted workflows", subtitle: "Production-safe interfaces & Motion-led animations" }
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "001",
    title: "ProcLink",
    stack: "React / Next.js / Tailwind CSS / GSAP / Framer Motion / GraphQL / Apollo Client",
    description:
      "Proclink is a consulting and implementation firm supporting manufacturing and banking organizations in strengthening how their operations run and how decisions are made.",
    links: { live: "https://proclink.com", code: "#" },
    image: "/p1.png",
    cta: "Live Project",
  },
  {
    id: "002",
    title: "Esports Tournament Management",
    stack: "React / Next.js / Tailwind CSS / Framer Motion / TypeScript / React Query",
    description:
      "A web-based platform for managing and organizing esports tournaments. It allows users to create, manage, and track tournaments, teams, and players. It also allows users to view and participate in tournaments.",
    links: { live: "https://esportsverse.lc.webdevprojects.cloud", code: "#" },
    image: "/p2.png",
    cta: "Live Project",
  },
  {
    id: "003",
    title: "Spongein",
    stack: "React / Next.js / Tailwind CSS / TypeScript / React Query",
    description:
      "Spongein is an online streaming platform that offers students the entire CAPS curriculum in video format. Each lesson is presented by teachers as well as tutors for better understanding.",
    links: { live: "https://spongein.com", code: "#" },
    image: "/p3.png",
    cta: "Live Project",
  },
  {
    id: "004",
    title: "Industrial Safety Solutions (ISS)",
    stack: "Progressive Web App (PWA) / offline capabilities / React / Tailwind CSS / TypeScript / React Query",
    description:
      "Industrial Safety Solutions (ISS) is a web-based platform for managing and organizing industrial safety solutions. It allows users to create, manage, and track industrial safety solutions, teams, and players. It also allows users to view and participate in industrial safety solutions. It is a Progressive Web App (PWA) and can be installed on any device.",
    links: { live: "https://iss-dev.lc.webdevprojects.cloud/home", code: "#" },
    image: "/p4.png",
    cta: "Live Project",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    link: "#",
    text: "Languages",
    items: [
      { name: "HTML", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "Tailwind CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Bootstrap", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
      { name: "Material UI", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
      { name: "Javascript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Typescript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "GraphQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
    ],
  },
  {
    link: "#",
    text: "AI & Developer Tools",
    items: [
      { name: "VS Code", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Figma", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "Cursor", url: "https://api.iconify.design/simple-icons:cursor.svg?color=%23ffffff" },
      { name: "OpenAI", url: "https://api.iconify.design/simple-icons:openai.svg?color=%23ffffff" },
      { name: "Claude", url: "https://api.iconify.design/simple-icons:claude.svg?color=%23ffffff" },
      { name: "Perplexity", url: "https://api.iconify.design/simple-icons:perplexity.svg?color=%23ffffff" },
      { name: "Stitch", url: "https://www.gstatic.com/labs-code/stitch/favicon-192x192.png" },
    ],
  },
  {
    link: "#",
    text: "Technologies",
    items: [
      { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Postman", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
      { name: "Jira", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
      { name: "Notion", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg" },
      { name: "Slack", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" },
    ],
  },
];

export const PHILOSOPHY_COPY = {
  label: "Skills & Philosophy",
  quote: "The function of good software is to make the complex appear to be simple.",
  author: "Grady Booch",
};

export const STATS: StatItem[] = [
  {
    value: 4,
    suffix: "+",
    label: "Projects Completed",
    description: "Completed multiple projects from concept to final implementation.",
  },
  {
    value: 2,
    suffix: "+",
    label: "Years Experience",
    description: "Building software with architectural intent and predictable system behavior.",
  },
  {
    value: 500,
    suffix: "+",
    label: "Engineering Hours",
    description: "Engineering judgment refined through real-world constraints.",
  },
  {
    value: Number.POSITIVE_INFINITY,
    suffix: "",
    label: "AI Prompts",
    description: "Used AI to generate code and ideas for projects.",
  },  
];

export const CONTACT_COPY = {
  title: "Contact",
  subtitle: "Me",
  label: "Contact Form",
  description:
    "Send me a message and I'll get back to you as soon as possible. Let's build something great together.",
};

export const CONTACT_FORM_INITIAL_VALUES: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
};

export const CONTACT_FIELDS: ContactField[] = [
  { name: "firstName", label: "First Name*", type: "text", required: true },
  { name: "lastName", label: "Last Name*", type: "text", required: true },
  { name: "email", label: "Email*", type: "email", required: true },
  { name: "subject", label: "Subject*", type: "text", required: true },
  { name: "message", label: "Message*", type: "text", required: true, multiline: true, rows: 3 },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Identification",
    items: [BRAND.legalName, BRAND.role, BRAND.location],
  },
  {
    title: "Channels",
    items: [],
    links: SOCIAL_LINKS.filter(({ label }) => ["Email", "LinkedIn", "GitHub"].includes(label)),
  },
  {
    title: "Colophon",
    items: ["Built With: React / GSAP / Framer / Lenis", "Typeface: Inter / Helvetica", "Deployed On: Vercel"],
  },
];
