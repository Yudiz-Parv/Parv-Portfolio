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
  headline: "Interfaces\nthat feel right",
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
    title: "Enterprise Resource Architecture",
    stack: "React / Node.js / Firebase / Firestore",
    description:
      "A full-stack ERP engine automating multi-currency invoicing, inventory logic, and international tax compliance for distributed teams.",
    links: { live: "https://erpbeta.netlify.app", code: "#" },
    image: "/p1.png",
    cta: "Live Project",
  },
  {
    id: "002",
    title: "Geospatial Workforce Analytics",
    stack: "React / Redux / Google Maps API / Firebase",
    description:
      "Real-time tracking system implementing location-based validation protocols and live route visualization for workforce monitoring.",
    links: { live: "#", code: "#" },
    image: "/p2.png",
    cta: "Live Project",
  },
  {
    id: "003",
    title: "OrderEase: Real-time online table food ordering system",
    stack: "React / Firebase / Node.js",
    description:
      "A real-time restaurant table ordering system that allows customers to place food orders directly from their table while enabling admins to manage menus, waiters, and assign waiters to customers for seamless service coordination.",
    links: { live: "https://github.com/MAHESHPPAI/OrderEase", code: "#" },
    image: "/p3.png",
    cta: "View on Github",
  },
  {
    id: "004",
    title: "BusBuddy: Transit Management Logic",
    stack: "React / Firebase / Springboot / ngrok",
    description:
      "A real-time campus transportation platform that enables students to book seats and track buses live, drivers to stream GPS data during journeys, and transport officers to manage fleet availability, monitoring, and notifications seamlessly.",
    links: { live: "https://github.com/MAHESHPPAI/Busbuddy-latest", code: "#" },
    image: "/p4.png",
    cta: "View on Github",
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
    value: 10,
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
    value: 1,
    suffix: "st",
    label: "Systems First",
    description: "Architecture precedes interface. Structure defines outcome.",
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
