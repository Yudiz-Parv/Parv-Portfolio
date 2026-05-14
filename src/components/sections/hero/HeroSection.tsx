import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github, Instagram, Linkedin, Mail } from "lucide-react";

import SplashCursor from "@/components/SplashCursor";
import { HERO_COPY, SOCIAL_LINKS } from "@/data/portfolio";
import type { SocialIconName, SocialLink } from "@/types/portfolio";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  mail: Mail,
} satisfies Record<SocialIconName, typeof Github>;

const getLinkTarget = (href: string) => (href.startsWith("mailto") ? "_self" : "_blank");

const AvailabilityBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="absolute z-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 pointer-events-none"
    style={{ top: "2.25rem" }}
  >
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
    </span>
    <span className="font-sans font-black text-[9px] tracking-[0.25em] uppercase text-white">
      {HERO_COPY.availability}
    </span>
  </motion.div>
);

const SocialStrip = ({ links }: { links: SocialLink[] }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="absolute z-20 hidden md:flex flex-col items-center"
    style={{ right: "64px", top: "112px", bottom: "194px", justifyContent: "center", gap: "1rem" }}
  >
    <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
    {links.map(({ label, href }) => (
      <a
        key={label}
        href={href}
        target={getLinkTarget(href)}
        rel="noopener noreferrer"
        title={label}
        className="group flex-shrink-0"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="font-sans font-black text-[10px] tracking-[0.22em] uppercase text-white group-hover:opacity-100 transition-opacity duration-300">
          {label}
        </span>
      </a>
    ))}
    <span className="w-[1px] h-8 bg-white/30 flex-shrink-0" />
  </motion.div>
);

const SpinningCTA = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="absolute md:z-30 lg:z-10 hidden md:flex items-center justify-center"
    style={{ bottom: "4rem", right: "4rem" }}
  >
    <style>{`
      @keyframes ctaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .cta-ring { animation: ctaSpin var(--cta-spin-duration, 10s) linear infinite; transform-origin: center; }
      .cta-wrap:hover .cta-ring { --cta-spin-duration: 3s; }
      .cta-wrap { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .cta-wrap:hover { transform: scale(1.08); }
    `}</style>
    <a
      href="#contact"
      className="cta-wrap group relative flex items-center justify-center w-[130px] h-[130px]"
      aria-label={HERO_COPY.cta}
    >
      <svg viewBox="0 0 130 130" className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx="65" cy="65" r="62" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 130 130" className="cta-ring absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <path id="cta-circle-path" d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text fill="rgba(255,255,255,1)" fontSize="8.5" fontFamily="'Inter', sans-serif" fontWeight="900" letterSpacing="4">
          <textPath href="#cta-circle-path">GET IN TOUCH · GET IN TOUCH · GET IN TOUCH ·&nbsp;</textPath>
        </text>
      </svg>
      <span
        className="absolute inset-4 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out"
        style={{ transformOrigin: "center" }}
      />
      <ArrowUpRight
        className="relative z-10 w-6 h-6 text-white group-hover:text-black"
        strokeWidth={2.5}
        style={{ transition: "color 0.3s ease" }}
      />
    </a>
  </motion.div>
);

const MobileSocialStrip = ({ links }: { links: SocialLink[] }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
    className="flex flex-col items-center gap-6"
  >
    {links.map(({ label, icon, href }) => {
      const Icon = socialIcons[icon];

      return (
        <a
          key={label}
          href={href}
          target={getLinkTarget(href)}
          rel="noopener noreferrer"
          aria-label={label}
          className="text-white hover:opacity-75 transition-opacity duration-300 block"
        >
          <Icon size={18} strokeWidth={2.5} />
        </a>
      );
    })}
  </motion.div>
);

const MobileCTA = () => (
  <a
    href="#contact"
    className="group relative overflow-hidden border border-white/30 px-5 py-3 flex items-center gap-3 hover:border-white transition-colors duration-500 w-fit mb-6 md:hidden"
  >
    <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
    <span className="relative font-sans font-black text-[10px] tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-300 z-10">
      {HERO_COPY.cta}
    </span>
    <ArrowRight className="relative w-3 h-3 text-white group-hover:text-black transition-colors duration-300 z-10" strokeWidth={2.5} />
  </a>
);

const HeroSection = () => (
  <section className="relative h-screen bg-black flex flex-col px-6 py-12 md:px-16 md:py-16 z-20 overflow-hidden">
    <AvailabilityBadge />
    <SocialStrip links={SOCIAL_LINKS} />
    <SpinningCTA />
    <div className="hidden lg:block">
      <SplashCursor />
    </div>

    <div className="h-[32px] w-full md:hidden" />

    <div className="flex-1 flex flex-col items-end justify-center md:hidden pr-0 z-10 pointer-events-none">
      <div className="pointer-events-auto">
        <MobileSocialStrip links={SOCIAL_LINKS} />
      </div>
    </div>

    <div className="z-10 mt-auto mb-6 md:mb-8">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-fit"
      >
        {/* <MobileCTA /> */}
        <h1 className="font-sans font-bold text-[clamp(2.75rem,6.5vw+1.25rem,6.5rem)] leading-[0.85] tracking-tighter text-white uppercase text-left text-balance max-w-full">
          {HERO_COPY.headline.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </motion.div>
    </div>

    <div className="z-10 grid grid-cols-1 md:grid-cols-12 w-full gap-4 mb-8 md:mb-0">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="col-span-1 md:col-span-5 lg:col-span-6"
      >
        <div className="w-12 h-[2px] bg-white mb-6 md:hidden" />
        <p className="font-sans text-xs md:text-sm font-medium text-white leading-relaxed tracking-wide uppercase text-left">
          {HERO_COPY.summary}
        </p>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
