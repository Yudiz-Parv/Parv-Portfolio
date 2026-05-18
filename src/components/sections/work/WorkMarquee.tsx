import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface WorkMarqueeProps {
  foregroundTrackRef: RefObject<HTMLDivElement>;
  backgroundTrackRef: RefObject<HTMLDivElement>;
}

const MARQUEE_COPY = {
  front: ["Visual Design", "Product Design", "Brand Design & Strategy"],
  back: ["Vibe Coder", "AI Developer", "Frontend Developer", "Creative Developer"],
};
const MARQUEE_GROUPS = [0, 1];
const SPARK_ARMS = [0, 1, 2, 3, 4, 5];
const MAIN_GLOW_SPRING = { damping: 30, stiffness: 150, mass: 0.72 };
const TRAIL_GLOW_SPRING = { damping: 38, stiffness: 108, mass: 0.9 };
const DEPTH_GLOW_SPRING = { damping: 48, stiffness: 72, mass: 1.08 };
const GLOW_MOVEMENT_X = 0.24;
const GLOW_MOVEMENT_Y = 0.18;

const WorkMarquee = ({ foregroundTrackRef, backgroundTrackRef }: WorkMarqueeProps) => {
  const [isBackHovered, setIsBackHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mainGlowX = useSpring(pointerX, MAIN_GLOW_SPRING);
  const mainGlowY = useSpring(pointerY, MAIN_GLOW_SPRING);
  const trailGlowX = useSpring(pointerX, TRAIL_GLOW_SPRING);
  const trailGlowY = useSpring(pointerY, TRAIL_GLOW_SPRING);
  const depthGlowX = useSpring(pointerX, DEPTH_GLOW_SPRING);
  const depthGlowY = useSpring(pointerY, DEPTH_GLOW_SPRING);

  useEffect(() => {
    if (!reducedMotion) return;

    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY, reducedMotion]);

  const resetGlowPosition = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) * GLOW_MOVEMENT_X);
    pointerY.set((event.clientY - rect.top - rect.height / 2) * GLOW_MOVEMENT_Y);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    resetGlowPosition();
    setIsBackHovered(false);
  };

  return (
    <div
      className={`work-marquee-shell${isBackHovered ? " work-marquee-shell--back-hovered" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <h2 className="sr-only">Design and development capabilities</h2>
      <div className="work-marquee-glow-field" aria-hidden="true">
        <motion.div className="work-marquee-glow-anchor" style={{ x: depthGlowX, y: depthGlowY }}>
          <span className="work-marquee-glow work-marquee-glow--depth" />
        </motion.div>
        <motion.div className="work-marquee-glow-anchor" style={{ x: trailGlowX, y: trailGlowY }}>
          <span className="work-marquee-glow work-marquee-glow--trail" />
        </motion.div>
        <motion.div className="work-marquee-glow-anchor" style={{ x: mainGlowX, y: mainGlowY }}>
          <span className="work-marquee-glow work-marquee-glow--core" />
        </motion.div>
      </div>
      <MarqueeLayer
        refTarget={backgroundTrackRef}
        layer="back"
        onPointerEnter={() => setIsBackHovered(true)}
        onPointerLeave={() => setIsBackHovered(false)}
      />
      <MarqueeLayer refTarget={foregroundTrackRef} layer="front" />
    </div>
  );
};

interface MarqueeLayerProps {
  refTarget: RefObject<HTMLDivElement>;
  layer: "front" | "back";
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

const MarqueeLayer = ({ refTarget, layer, onPointerEnter, onPointerLeave }: MarqueeLayerProps) => (
  <div
    className={`work-marquee work-marquee--${layer}`}
    aria-hidden="true"
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
  >
    <div ref={refTarget} className="work-marquee__track">
      {MARQUEE_GROUPS.map((groupIndex) => (
        <div key={groupIndex} className="work-marquee__group">
          {MARQUEE_COPY[layer].map((label) => (
            <span key={`${groupIndex}-${label}`} className="work-marquee__segment">
              <span className="work-marquee__label">{label}</span>
              <span className="work-marquee__separator">
                <span className="work-marquee__spark">
                  {SPARK_ARMS.map((arm) => (
                    <span key={arm} className="work-marquee__spark-arm" />
                  ))}
                </span>
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default WorkMarquee;
