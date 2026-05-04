import type { RefObject } from "react";

interface KineticWheelProps {
  isMobile: boolean;
  kineticWheelRef: RefObject<HTMLDivElement>;
  threadPathRef: RefObject<SVGPathElement>;
  figureGroupRef: RefObject<SVGGElement>;
  textAnalyzeRef: RefObject<SVGTextElement>;
  textDesignRef: RefObject<SVGTextElement>;
  textBuildRef: RefObject<SVGTextElement>;
  textDeliverRef: RefObject<SVGTextElement>;
}

const KineticWheel = ({
  isMobile,
  kineticWheelRef,
  threadPathRef,
  figureGroupRef,
  textAnalyzeRef,
  textDesignRef,
  textBuildRef,
  textDeliverRef,
}: KineticWheelProps) => (
  <div
    ref={kineticWheelRef}
    className="kinetic-wheel pointer-events-none"
    style={{
      position: "fixed",
      top: isMobile ? "50%" : "auto",
      bottom: isMobile ? "auto" : "-18vh",
      left: "0",
      width: "100vw",
      height: isMobile ? "100vw" : "auto",
      marginTop: isMobile ? "calc(-50vw)" : "0",
      zIndex: 0,
      visibility: "hidden",
      opacity: 0,
      willChange: "transform, opacity",
    }}
  >
    {isMobile ? (
      <MobileKineticWheel
        threadPathRef={threadPathRef}
        figureGroupRef={figureGroupRef}
        textAnalyzeRef={textAnalyzeRef}
        textDesignRef={textDesignRef}
        textBuildRef={textBuildRef}
        textDeliverRef={textDeliverRef}
      />
    ) : (
      <DesktopKineticWheel />
    )}
  </div>
);

const MobileKineticWheel = ({
  threadPathRef,
  figureGroupRef,
  textAnalyzeRef,
  textDesignRef,
  textBuildRef,
  textDeliverRef,
}: Omit<KineticWheelProps, "isMobile" | "kineticWheelRef">) => (
  <svg viewBox="0 0 1500 2000" className="w-full h-full" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="15%" stopColor="rgba(255,255,255,0.7)" />
        <stop offset="85%" stopColor="rgba(255,255,255,0.7)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      ref={threadPathRef}
      d="M 750,0 L 750,250 C 750,550 250,500 250,800 C 250,1100 1250,1050 1250,1350 C 1250,1650 750,1600 750,1900 L 750,3000"
      fill="none"
      stroke="url(#line-gradient)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <g ref={figureGroupRef}>
      <text ref={textAnalyzeRef} x="750" y="150" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dy=".3em">
        ANALYZE
      </text>
      <circle cx="750" cy="250" r="15" fill="#ffffff" filter="url(#glow)" />

      <text ref={textDesignRef} x="250" y="700" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dy=".3em">
        DESIGN
      </text>
      <circle cx="250" cy="800" r="15" fill="#ffffff" filter="url(#glow)" />

      <text ref={textBuildRef} x="1250" y="1250" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dy=".3em">
        BUILD
      </text>
      <circle cx="1250" cy="1350" r="15" fill="#ffffff" filter="url(#glow)" />

      <text ref={textDeliverRef} x="750" y="1800" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dy=".3em">
        DELIVER
      </text>
      <circle cx="750" cy="1900" r="20" fill="#ffffff" filter="url(#glow)" />
    </g>
  </svg>
);

const desktopItems = [
  { text: "ANALYZE", offset: "15%" },
  { text: "●", offset: "27%" },
  { text: "DESIGN", offset: "38%" },
  { text: "●", offset: "50%" },
  { text: "BUILD", offset: "62%" },
  { text: "●", offset: "73%" },
  { text: "DELIVER", offset: "85%" },
];

const DesktopKineticWheel = () => (
  <svg viewBox="0 0 3000 1500" className="w-full h-auto" style={{ overflow: "visible" }}>
    <path id="arc-path" d="M 400,1500 A 1100,1100 0 0,1 2600,1500" fill="none" stroke="none" />
    {desktopItems.map((item) => (
      <text
        key={`${item.text}-${item.offset}`}
        fill="#ffffff"
        style={{
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: item.text === "●" ? "50px" : "100px",
          textTransform: "uppercase",
        }}
        dy={item.text === "●" ? "-18" : "0"}
      >
        <textPath href="#arc-path" startOffset={item.offset} textAnchor="middle">
          {item.text}
        </textPath>
      </text>
    ))}
  </svg>
);

const mobileTextStyle = {
  fontFamily: "sans-serif",
  fontWeight: 800,
  fontSize: "100px",
  opacity: 0.3,
};

export default KineticWheel;
