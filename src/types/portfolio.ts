export type SocialIconName = "github" | "linkedin" | "instagram" | "mail";

export interface NavItem {
  label: string;
  href: string;
  number: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconName;
}

export interface AboutEntry {
  title: string;
  subtitle?: string;
}

export interface AboutGroup {
  number: string;
  label: string;
  entries: AboutEntry[];
}

export interface Project {
  id: string;
  title: string;
  stack: string;
  description: string;
  links: {
    live: string;
    code: string;
  };
  image: string;
  cta: string;
}

export interface SkillItem {
  name: string;
  url: string;
}

export interface SkillCategory {
  link: string;
  text: string;
  items: SkillItem[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface FooterColumn {
  title: string;
  items: string[];
  links?: SocialLink[];
}

export type ContactStatus = "idle" | "sending" | "success" | "error";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFieldName = keyof ContactFormData;

export interface ContactField {
  name: ContactFieldName;
  label: string;
  type: "text" | "email";
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}
