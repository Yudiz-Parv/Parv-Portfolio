import type { ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

import { ABOUT_CONTEXT_LABEL, ABOUT_GROUPS } from "@/data/portfolio";
import { useWindowHeight } from "@/hooks/use-breakpoint";
import type { AboutGroup } from "@/types/portfolio";

interface AboutGroupBlockProps {
  group: AboutGroup;
  progress: MotionValue<number>;
}

interface RevealTextProps {
  as?: "h2" | "h3" | "p";
  children: ReactNode;
  className: string;
  progress: MotionValue<number>;
  start?: number;
  end?: number;
}

const RevealText = ({ as = "p", children, className, progress, start = 0, end = 1 }: RevealTextProps) => {
  const revealY = useTransform(progress, [start, end], ["118%", "0%"]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const filter = useTransform(progress, [start, end], ["blur(8px)", "blur(0px)"]);

  const content = (
    <span className="block overflow-hidden">
      <motion.span
        className="block will-change-transform"
        style={{ y: revealY, opacity, filter }}
      >
        {children}
      </motion.span>
    </span>
  );

  if (as === "h2") {
    return <h2 className={className}>{content}</h2>;
  }

  if (as === "h3") {
    return <h3 className={className}>{content}</h3>;
  }

  return <p className={className}>{content}</p>;
};

const AboutGroupBlock = ({ group, progress }: AboutGroupBlockProps) => (
  <div className="flex flex-col gap-2">
    <RevealText
      as="h3"
      className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-1"
      progress={progress}
      start={0}
      end={0.36}
    >
      {group.number}. {group.label}
    </RevealText>

    <div className="flex flex-col gap-6">
      {group.entries.map((entry, entryIndex) => {
        const titleStart = Math.min(0.2 + entryIndex * 0.1, 0.58);
        const titleEnd = Math.min(titleStart + 0.42, 0.9);
        const subtitleStart = Math.min(titleStart + 0.16, 0.72);
        const subtitleEnd = Math.min(subtitleStart + 0.42, 1);

        return (
          <div key={`${group.label}-${entry.title}`}>
            <RevealText
              className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight"
              progress={progress}
              start={titleStart}
              end={titleEnd}
            >
              {entry.title}
            </RevealText>

            {entry.subtitle && (
              <RevealText
                className="font-sans text-xl md:text-2xl lg:text-3xl font-normal text-black/70 leading-tight tracking-tight"
                progress={progress}
                start={subtitleStart}
                end={subtitleEnd}
              >
                {entry.subtitle}
              </RevealText>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const AboutSection = () => {
  const vh = useWindowHeight();

  const { scrollY } = useScroll();

  const revealStart = vh * 0.66;
  const sectionY = useTransform(
    scrollY,
    [revealStart - vh * 0.08, revealStart + vh * 0.34, revealStart + vh * 0.88, revealStart + vh * 1.2],
    [44, 0, 0, -96],
  );
  const contextProgress = useTransform(scrollY, [revealStart, revealStart + vh * 0.24], [0, 1]);
  const educationProgress = useTransform(scrollY, [revealStart + vh * 0.08, revealStart + vh * 0.46], [0, 1]);
  const experienceProgress = useTransform(scrollY, [revealStart + vh * 0.28, revealStart + vh * 0.66], [0, 1]);
  const focusProgress = useTransform(scrollY, [revealStart + vh * 0.5, revealStart + vh * 0.88], [0, 1]);

  return (
    <section className="h-screen w-full bg-white text-black font-sans px-6 md:px-12 lg:px-16 overflow-hidden flex items-center justify-center relative">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 w-full max-w-[1600px] mx-auto will-change-transform"
        style={{ y: sectionY }}
      >

        <div className="md:col-span-3 lg:col-span-3 pt-2">
          <RevealText
            as="h2"
            className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest"
            progress={contextProgress}
          >
            {ABOUT_CONTEXT_LABEL}
          </RevealText>
        </div>

        <div className="md:col-span-9 lg:col-span-9 flex flex-col gap-10 md:gap-12">
          <AboutGroupBlock group={ABOUT_GROUPS[0]} progress={educationProgress} />
          <AboutGroupBlock group={ABOUT_GROUPS[1]} progress={experienceProgress} />
          <AboutGroupBlock group={ABOUT_GROUPS[2]} progress={focusProgress} />
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
