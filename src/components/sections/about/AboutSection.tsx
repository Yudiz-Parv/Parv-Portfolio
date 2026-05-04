import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

import { ABOUT_CONTEXT_LABEL, ABOUT_GROUPS } from "@/data/portfolio";
import { useWindowHeight } from "@/hooks/use-breakpoint";
import type { AboutGroup } from "@/types/portfolio";

interface AboutGroupBlockProps {
  group: AboutGroup;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

const AboutGroupBlock = ({ group, y, opacity }: AboutGroupBlockProps) => (
  <motion.div style={{ y, opacity }} className="flex flex-col gap-2">
    <h3 className="font-sans text-xs md:text-sm font-bold uppercase tracking-wide opacity-100 mb-1">
      {group.number}. {group.label}
    </h3>

    <div className="flex flex-col gap-6">
      {group.entries.map((entry) => (
        <div key={`${group.label}-${entry.title}`}>
          <p className="font-sans text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
            {entry.title}
          </p>
          {entry.subtitle && (
            <p className="font-sans text-xl md:text-2xl lg:text-3xl font-normal text-black/70 leading-tight tracking-tight">
              {entry.subtitle}
            </p>
          )}
        </div>
      ))}
    </div>
  </motion.div>
);

const AboutSection = () => {
  const vh = useWindowHeight();

  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, vh * 0.4], [80, 0]);
  const opacity1 = useTransform(scrollY, [0, vh * 0.3], [0, 1]);
  const y2 = useTransform(scrollY, [vh * 0.1, vh * 0.5], [80, 0]);
  const opacity2 = useTransform(scrollY, [vh * 0.1, vh * 0.4], [0, 1]);
  const y3 = useTransform(scrollY, [vh * 0.2, vh * 0.6], [80, 0]);
  const opacity3 = useTransform(scrollY, [vh * 0.2, vh * 0.5], [0, 1]);
  const y4 = useTransform(scrollY, [vh * 0.3, vh * 0.7], [80, 0]);
  const opacity4 = useTransform(scrollY, [vh * 0.3, vh * 0.6], [0, 1]);

  return (
    <section className="h-screen w-full bg-white text-black font-sans px-6 md:px-12 lg:px-16 overflow-hidden flex items-center justify-center relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 w-full max-w-[1600px] mx-auto">

        <motion.div
          className="md:col-span-3 lg:col-span-3 pt-2"
          style={{ y: y1, opacity: opacity1 }}
        >
          <h2 className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest">
            {ABOUT_CONTEXT_LABEL}
          </h2>
        </motion.div>

        <div className="md:col-span-9 lg:col-span-9 flex flex-col gap-10 md:gap-12">
          <AboutGroupBlock group={ABOUT_GROUPS[0]} y={y2} opacity={opacity2} />
          <AboutGroupBlock group={ABOUT_GROUPS[1]} y={y3} opacity={opacity3} />
          <AboutGroupBlock group={ABOUT_GROUPS[2]} y={y4} opacity={opacity4} />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
