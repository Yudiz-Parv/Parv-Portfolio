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
  legalName: "Mahesh P Pai",
  role: "Full Stack Engineer",
  location: "Kerala, India [Lat: 9.7, Long: 76.5]",
  email: "maheshpailinked@gmail.com",
  year: "2026",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about", number: "01" },
  { label: "Work", href: "#work", number: "02" },
  { label: "Philosophy", href: "#philosophy", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", icon: "github", href: "https://github.com/MAHESHPPAI" },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/mahesh-p-pai-b0987b2a8/" },
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/mahesh_3.14_/" },
  { label: "Email", icon: "mail", href: `mailto:${BRAND.email}` },
];

export const HERO_COPY = {
  availability: "Available for work",
  headline: "Driven\nby logic",
  summary:
    "Building robust software, automating the complex and focused on transforming static systems into intelligent ones.",
  cta: "Get in touch",
};

export const ABOUT_CONTEXT_LABEL = "Background & Data";

export const ABOUT_GROUPS: AboutGroup[] = [
  {
    number: "01",
    label: "Education",
    entries: [
      {
        title: "Indian Institute of Information Technology, Kottayam",
        subtitle: "B.Tech, Computer Science & Engineering (2023-2027)",
      },
    ],
  },
  {
    number: "02",
    label: "Experience",
    entries: [
      {
        title: "aiRender Technologies",
        subtitle: "Full Stack Developer (May 2025 - May 2026)",
      },
      {
        title: "Infosys Springboard",
        subtitle: "Web Development Intern (Oct 2024 - Dec 2024)",
      },
    ],
  },
  {
    number: "03",
    label: "Focus",
    entries: [
      { title: "Software Engineering Architecture" },
      { title: "Artificial Intelligence & Process Automation" },
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
      { name: "C++", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Java", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Javascript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "PHP", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "SQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "HTML/CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "Numpy", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
      { name: "Pandas", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    ],
  },
  {
    link: "#",
    text: "Developer Tools",
    items: [
      { name: "VS Code", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "PyCharm", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg" },
      { name: "Jupyter", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
      { name: "Bash", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
      { name: "Spyder", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spyder/spyder-original.svg" },
      { name: "Colab", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecolab/googlecolab-original.svg" },
    ],
  },
  {
    link: "#",
    text: "Technologies",
    items: [
      { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Node", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "Postman", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
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
