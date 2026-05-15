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
      top: isMobile ? "0" : "auto",
      bottom: isMobile ? "auto" : "-18vh",
      left: "0",
      width: "100vw",
      height: isMobile ? "100dvh" : "auto",
      minHeight: isMobile ? "100vh" : undefined,
      marginTop: "0",
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
  <svg viewBox="0 0 900 1800" className="w-full h-full" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="14%" stopColor="rgba(255,255,255,0.74)" />
        <stop offset="86%" stopColor="rgba(255,255,255,0.74)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      ref={threadPathRef}
      d="M 450,-80 L 450,210 C 450,390 175,370 175,560 C 175,760 725,740 725,960 C 725,1160 450,1140 450,1340 L 450,1900"
      fill="none"
      stroke="url(#line-gradient)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <g ref={figureGroupRef}>
      <text ref={textAnalyzeRef} x="450" y="136" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dominantBaseline="middle">
        ANALYZE
      </text>
      <circle cx="450" cy="210" r="12" fill="#ffffff" filter="url(#glow)" />

      <text ref={textDesignRef} x="205" y="500" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dominantBaseline="middle">
        DESIGN
      </text>
      <circle cx="175" cy="560" r="12" fill="#ffffff" filter="url(#glow)" />

      <text ref={textBuildRef} x="690" y="900" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dominantBaseline="middle">
        BUILD
      </text>
      <circle cx="725" cy="960" r="12" fill="#ffffff" filter="url(#glow)" />

      <text ref={textDeliverRef} x="450" y="1280" fill="#ffffff" style={mobileTextStyle} textAnchor="middle" dominantBaseline="middle">
        DEPLOY
      </text>
      <circle cx="450" cy="1340" r="15" fill="#ffffff" filter="url(#glow)" />
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
  fontSize: "76px",
  letterSpacing: "3px",
  opacity: 0.24,
};

export default KineticWheel;
