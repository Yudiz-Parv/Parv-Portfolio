import { PROJECTS } from "@/data/portfolio";

import KineticWheel from "./KineticWheel";
import ProjectCard from "./ProjectCard";
import "./ScrollStack.css";
import WorkMarquee from "./WorkMarquee";
import { useSelectedWorksScroll } from "./useSelectedWorksScroll";

const SelectedWorksSection = () => {
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

  return (
    <section className="min-h-screen bg-black text-white font-sans relative">
      <WorkMarquee
        foregroundTrackRef={marqueeForegroundTrackRef}
        backgroundTrackRef={marqueeBackgroundTrackRef}
      />

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
