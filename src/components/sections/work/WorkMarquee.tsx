import { useState } from "react";
import type { RefObject } from "react";

interface WorkMarqueeProps {
  foregroundTrackRef: RefObject<HTMLDivElement>;
  backgroundTrackRef: RefObject<HTMLDivElement>;
}

const MARQUEE_COPY = {
  front: ["Visual Design", "Product Design", "Brand Design & Strategy"],
  back: ["Vibe Coder", "AI Developer", "Frontend Developer", "Creative Developer"],
};
const MARQUEE_GROUPS = [0, 1];

const WorkMarquee = ({ foregroundTrackRef, backgroundTrackRef }: WorkMarqueeProps) => {
  const [isBackHovered, setIsBackHovered] = useState(false);

  return (
    <div className={`work-marquee-shell${isBackHovered ? " work-marquee-shell--back-hovered" : ""}`}>
      <h2 className="sr-only">Design and development capabilities</h2>
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
              <span className="work-marquee__separator">-</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default WorkMarquee;
