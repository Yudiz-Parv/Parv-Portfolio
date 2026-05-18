import { motion, useReducedMotion } from "framer-motion";

import { PROJECTS } from "@/data/portfolio";

import KineticWheel from "./KineticWheel";
import ProjectCard from "./ProjectCard";
import "./ScrollStack.css";
import WorkMarquee from "./WorkMarquee";
import { useSelectedWorksScroll } from "./useSelectedWorksScroll";

const PROJECT_HEADER_LINES = ["PROJECTS I", "WORKED ON"];
const TEXT_REVEAL_EASE = [0.77, 0, 0.175, 1] as const;

const SelectedWorksSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const {
    figureGroupRef,
    isMobile,
    kineticWheelRef,
    marqueeBackgroundTrackRef,
    marqueeForegroundTrackRef,
    stackInnerRef,
    textAnalyzeRef,
    textBuildRef,
    textDeliverRef,
    textDesignRef,
    threadPathRef,
    voidContainerRef,
  } = useSelectedWorksScroll();

  const revealTextVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0.92,
      y: shouldReduceMotion ? 0 : "112%",
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.12 + index * 0.18,
        duration: shouldReduceMotion ? 0 : 1.45,
        ease: TEXT_REVEAL_EASE,
      },
    }),
  };

  return (
    <section className="min-h-screen bg-black text-white font-sans relative">
      <WorkMarquee
        foregroundTrackRef={marqueeForegroundTrackRef}
        backgroundTrackRef={marqueeBackgroundTrackRef}
      />

      <motion.header
        className="work-reveal-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.36 }}
      >
        <span className="work-reveal-header__kicker">(Portfolio)</span>
        <h2 className="work-reveal-header__title" aria-label="Projects I Worked On">
          {PROJECT_HEADER_LINES.map((line, index) => (
            <span
              key={line}
              className={`work-reveal-header__line work-reveal-header__line--${index + 1}`}
              aria-hidden="true"
            >
              <motion.span
                className="work-reveal-header__line-text"
                custom={index}
                variants={revealTextVariants}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
      </motion.header>

      <div
        ref={stackInnerRef}
        className="scroll-stack-inner px-6 md:px-12 lg:px-16"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={voidContainerRef}
          className="void-container relative w-full flex flex-col items-center justify-center"
          style={{ willChange: "transform, opacity", transformStyle: "preserve-3d" }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="scroll-stack-end pointer-events-none h-[120vh]" />
      </div>

      <KineticWheel
        isMobile={isMobile}
        kineticWheelRef={kineticWheelRef}
        threadPathRef={threadPathRef}
        figureGroupRef={figureGroupRef}
        textAnalyzeRef={textAnalyzeRef}
        textDesignRef={textDesignRef}
        textBuildRef={textBuildRef}
        textDeliverRef={textDeliverRef}
      />
    </section>
  );
};

export default SelectedWorksSection;
