import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

const preloaderCompleteEventName = "premium-preloader:complete";
const introEase = [0.16, 1, 0.3, 1] as [number, number, number, number];
const letterStaggerSeconds = 0.021;
const letterBaseDelaySeconds = 0.1;
const letterDurationSeconds = 0.58;

type KineticLetter = {
  id: string;
  char: string;
  order: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  fragmentX: number;
  fragmentY: number;
  fragmentRotate: number;
  fragmentWidth: number;
  fragmentHeight: number;
  showFragment: boolean;
};

type KineticWord = {
  id: string;
  text: string;
  letters: KineticLetter[];
};

const getLinkTarget = (href: string) => (href.startsWith("mailto") ? "_self" : "_blank");

const useHeroIntroReady = () => {
  const [isReady, setIsReady] = useState(() =>
    typeof document !== "undefined" && document.documentElement.dataset.preloaderComplete === "true",
  );

  useEffect(() => {
    const handleComplete = () => {
      setIsReady(true);
    };

    window.addEventListener(preloaderCompleteEventName, handleComplete);

    return () => {
      window.removeEventListener(preloaderCompleteEventName, handleComplete);
    };
  }, []);

  return isReady;
};

const seededUnit = (seed: number) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

const seededRange = (seed: number, min: number, max: number) =>
  min + seededUnit(seed) * (max - min);

const buildKineticHeadline = (text: string) => {
  let order = 0;
  const words = text.trim().split(/\s+/).map<KineticWord>((word, wordIndex) => ({
    id: `${word}-${wordIndex}`,
    text: word,
    letters: Array.from(word).map((char, letterIndex) => {
      const currentOrder = order;
      const seed = char.charCodeAt(0) * 19 + (wordIndex + 1) * 113 + (letterIndex + 1) * 41;

      order += 1;

      return {
        id: `${word}-${wordIndex}-${letterIndex}-${char}`,
        char,
        order: currentOrder,
        x: seededRange(seed + 1, -28, 28),
        y: seededRange(seed + 2, -42, 38),
        rotate: seededRange(seed + 3, -14, 14),
        scale: seededRange(seed + 4, 0.82, 1.2),
        fragmentX: seededRange(seed + 5, -26, 26),
        fragmentY: seededRange(seed + 6, -28, 18),
        fragmentRotate: seededRange(seed + 7, -70, 70),
        fragmentWidth: seededRange(seed + 8, 5, 13),
        fragmentHeight: seededRange(seed + 9, 1.5, 3.5),
        showFragment: seededUnit(seed + 10) > 0.42,
      };
    }),
  }));

  return { words, letterCount: order };
};

const AvailabilityBadge = ({ isIntroReady }: { isIntroReady: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={isIntroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
    transition={{ duration: 0.42, delay: 0.72, ease: "easeOut" }}
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

const SocialStrip = ({ links, isIntroReady }: { links: SocialLink[]; isIntroReady: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={isIntroReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
    transition={{ duration: 0.55, delay: 1.05, ease: "easeOut" }}
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

const SpinningCTA = ({ isIntroReady }: { isIntroReady: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={isIntroReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.55, delay: 1.28, ease: introEase }}
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

const MobileSocialStrip = ({ links, isIntroReady }: { links: SocialLink[]; isIntroReady: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={isIntroReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
    transition={{ duration: 0.55, delay: 1.05, ease: "easeOut" }}
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

const HeroSection = () => {
  const isIntroReady = useHeroIntroReady();
  const shouldReduceMotion = useReducedMotion();
  const headline = useMemo(() => buildKineticHeadline(HERO_COPY.headline), []);
  const headlineSettleDelay = shouldReduceMotion
    ? 0.16
    : letterBaseDelaySeconds + Math.max(0, headline.letterCount - 1) * letterStaggerSeconds + 0.32;

  const headlineVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 1,
          scale: 1.018,
          filter: "drop-shadow(0 0 0 rgba(240, 141, 98, 0))",
        },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "drop-shadow(0 0 0 rgba(240, 141, 98, 0))",
      transition: {
        opacity: { duration: shouldReduceMotion ? 0.24 : 0 },
        scale: {
          duration: shouldReduceMotion ? 0.24 : 0.38,
          delay: headlineSettleDelay,
          ease: introEase,
        },
      },
    },
  };

  const letterVariants: Variants = {
    hidden: (letter: KineticLetter) => shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: letter.x,
          y: letter.y,
          rotateZ: letter.rotate,
          scale: letter.scale,
          filter: "blur(12px)",
          textShadow: "0 0 28px rgba(240, 141, 98, 0.72)",
        },
    visible: (letter: KineticLetter) => shouldReduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0.24, delay: 0.08, ease: "easeOut" },
        }
      : {
          opacity: 1,
          x: 0,
          y: 0,
          rotateZ: 0,
          scale: 1,
          filter: "blur(0px)",
          textShadow: "0 0 0 rgba(255, 255, 255, 0)",
          transition: {
            duration: letterDurationSeconds,
            delay: letterBaseDelaySeconds + letter.order * letterStaggerSeconds,
            ease: introEase,
          },
        },
  };

  const fragmentVariants: Variants = {
    hidden: (letter: KineticLetter) => ({
      opacity: 0,
      x: letter.fragmentX,
      y: letter.fragmentY,
      rotateZ: letter.fragmentRotate,
      scale: 0.5,
    }),
    visible: (letter: KineticLetter) => shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: [0, 0.85, 0],
          x: [letter.fragmentX, letter.x * 0.22, 0],
          y: [letter.fragmentY, letter.y * 0.22, 0],
          rotateZ: [letter.fragmentRotate, letter.rotate * 0.35, 0],
          scale: [0.5, 1, 0.18],
          transition: {
            duration: 0.58,
            delay: letterBaseDelaySeconds + letter.order * letterStaggerSeconds + 0.02,
            ease: introEase,
            times: [0, 0.42, 1],
          },
        },
  };

  const summaryVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: shouldReduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0.24, ease: "easeOut" },
        }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.72, delay: 1.08, ease: introEase },
        },
  };

  return (
    <section className="relative h-screen bg-black flex flex-col px-6 py-12 md:px-16 md:py-16 z-20 overflow-hidden">
      <AvailabilityBadge isIntroReady={isIntroReady} />
      <SocialStrip links={SOCIAL_LINKS} isIntroReady={isIntroReady} />
      <SpinningCTA isIntroReady={isIntroReady} />
      <div className="absolute inset-0 z-[1]">
        <SplashCursor />
      </div>

      <div className="h-[32px] w-full md:hidden" />

      <div className="flex-1 flex flex-col items-end justify-center md:hidden pr-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <MobileSocialStrip links={SOCIAL_LINKS} isIntroReady={isIntroReady} />
        </div>
      </div>

      <div className="z-10 mt-auto mb-6 md:mb-8">
        <motion.div
          initial="hidden"
          animate={isIntroReady ? "visible" : "hidden"}
          variants={headlineVariants}
          className="relative w-fit"
        >
          {/* <MobileCTA /> */}
          <h1
            aria-label={HERO_COPY.headline}
            className="relative z-10 font-sans font-bold text-[clamp(2.75rem,6.5vw+1.25rem,6.5rem)] leading-[0.85] tracking-tighter text-white uppercase text-left text-balance max-w-full"
          >
            {headline.words.map((word, wordIndex) => (
              <span
                key={word.id}
                aria-hidden="true"
                className="inline-flex whitespace-nowrap align-baseline"
                style={{ marginRight: wordIndex === headline.words.length - 1 ? 0 : "0.18em" }}
              >
                {word.letters.map((letter) => (
                  <span
                    key={letter.id}
                    className="relative inline-block align-baseline"
                  >
                    {letter.showFragment && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
                        custom={letter}
                        variants={fragmentVariants}
                        style={{
                          width: letter.fragmentWidth,
                          height: letter.fragmentHeight,
                          marginLeft: letter.fragmentWidth * -0.5,
                          marginTop: letter.fragmentHeight * -0.5,
                          background:
                            "linear-gradient(90deg, rgba(255,246,238,0), rgba(255,246,238,0.95), rgba(240,141,98,0))",
                          boxShadow: "0 0 18px rgba(240, 141, 98, 0.44)",
                          transformOrigin: "50% 50%",
                        }}
                      />
                    )}
                    <motion.span
                      className="inline-block will-change-transform"
                      custom={letter}
                      variants={letterVariants}
                      style={{ transformOrigin: "50% 72%" }}
                    >
                      {letter.char}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.h1
            aria-hidden="true"
            initial={{ opacity: 0, backgroundPosition: "-140% 0%" }}
            animate={
              isIntroReady && !shouldReduceMotion
                ? {
                    opacity: [0, 0.9, 0],
                    backgroundPosition: ["-140% 0%", "45% 0%", "180% 0%"],
                  }
                : { opacity: 0, backgroundPosition: "-140% 0%" }
            }
            transition={{
              duration: 0.82,
              delay: headlineSettleDelay + 0.08,
              ease: "easeOut",
              times: [0, 0.42, 1],
            }}
            className="pointer-events-none absolute inset-0 z-20 font-sans font-bold text-[clamp(2.75rem,6.5vw+1.25rem,6.5rem)] leading-[0.85] tracking-tighter uppercase text-left text-balance max-w-full"
            style={{
              color: "transparent",
              backgroundImage:
                "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 36%, rgba(255,248,238,0.95) 47%, rgba(240,141,98,0.82) 52%, rgba(255,255,255,0) 64%, rgba(255,255,255,0) 100%)",
              backgroundSize: "240% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 18px rgba(240, 141, 98, 0.3))",
            }}
          >
            {headline.words.map((word, wordIndex) => (
              <span
                key={`scan-${word.id}`}
                className="inline-flex whitespace-nowrap align-baseline"
                style={{ marginRight: wordIndex === headline.words.length - 1 ? 0 : "0.18em" }}
              >
                {word.text}
              </span>
            ))}
          </motion.h1>
        </motion.div>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-12 w-full gap-4 mb-8 md:mb-0">
        <motion.div
          initial="hidden"
          animate={isIntroReady ? "visible" : "hidden"}
          variants={summaryVariants}
          className="col-span-1 md:col-span-5 lg:col-span-6 will-change-transform"
        >
          <div className="w-12 h-[2px] bg-white mb-6 md:hidden" />
          <p className="font-sans text-xs md:text-sm font-medium text-white leading-relaxed tracking-wide uppercase text-left">
            {HERO_COPY.summary}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
