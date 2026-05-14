import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

type Theme = "dark" | "light" | "custom";

type PremiumPreloaderProps = {
  theme?: Theme;
  backgroundColor?: string;
  counterColor?: string;
  progressColor?: string;
  trackColor?: string;
  font?: CSSProperties;
  duration?: number;
  speed?: number;
  showCounter?: boolean;
  showProgress?: boolean;
  barHeight?: number;
  exitDelay?: number;
  exitDuration?: number;
  blurOnExit?: boolean;
  zIndex?: number;
};

type ResolvedColors = {
  backgroundColor: string;
  counterColor: string;
  progressColor: string;
  trackColor: string;
};

const exitEase = [0.76, 0, 0.24, 1] as [number, number, number, number];
const counterEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

const defaultFont: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "clamp(76px, 12vw, 196px)",
  fontWeight: 900,
  letterSpacing: 0,
  lineHeight: 0.78,
};

const themeColors: Record<Exclude<Theme, "custom">, ResolvedColors> = {
  dark: {
    backgroundColor: "#FFFFFF",
    counterColor: "#050505",
    progressColor: "#f08d62",
    trackColor: "#050505",
  },
  light: {
    backgroundColor: "#FFFFFF",
    counterColor: "#050505",
    progressColor: "#f08d62",
    trackColor: "#050505",
  },
};

const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

const resolveColors = ({
  theme,
  backgroundColor,
  counterColor,
  progressColor,
  trackColor,
}: Required<Pick<PremiumPreloaderProps, "theme" | "backgroundColor" | "counterColor" | "progressColor" | "trackColor">>) => {
  if (theme === "dark" || theme === "light") {
    return themeColors[theme];
  }

  return {
    backgroundColor,
    counterColor,
    progressColor,
    trackColor,
  };
};

const formatCounter = (value: number) => value.toString().padStart(3, "0");

const PremiumPreloader = ({
  theme = "dark",
  backgroundColor = "#FFFFFF",
  counterColor = "#050505",
  progressColor = "#f08d62",
  trackColor = "#050505",
  font = defaultFont,
  duration = 3.4,
  speed = 1,
  showCounter = true,
  showProgress = true,
  barHeight = 4,
  exitDelay = 340,
  exitDuration = 1.1,
  blurOnExit = true,
  zIndex = 9999,
}: PremiumPreloaderProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [counterValue, setCounterValue] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const safeDuration = clamp(duration, 1, 6);
  const safeSpeed = clamp(speed, 0.5, 2);
  const safeExitDelay = clamp(exitDelay, 0, 800);
  const safeExitDuration = clamp(exitDuration, 0.2, 1.5);
  const effectiveDurationMs = (shouldReduceMotion ? 0.9 : safeDuration / safeSpeed) * 1000;
  const exitDurationSeconds = shouldReduceMotion ? 0.36 : safeExitDuration;
  const progressHeight = clamp(barHeight, 2, 6);
  const colors = resolveColors({
    theme,
    backgroundColor,
    counterColor,
    progressColor,
    trackColor,
  });

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyTouchAction = document.body.style.touchAction;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.touchAction = previousBodyTouchAction;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [shouldRender]);

  useEffect(() => {
    let animationFrame = 0;
    let exitTimer = 0;
    let startTime: number | null = null;

    const tick = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const elapsed = time - startTime;
      const rawProgress = clamp(elapsed / effectiveDurationMs, 0, 1);
      const easedProgress = easeInOutCubic(rawProgress);

      setCounterValue(Math.round(easedProgress * 100));
      setProgressValue(rawProgress >= 1 ? 1 : easedProgress);

      if (rawProgress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      setCounterValue(100);
      setProgressValue(1);
      exitTimer = window.setTimeout(() => {
        setIsExiting(true);
      }, safeExitDelay);
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(exitTimer);
    };
  }, [effectiveDurationMs, safeExitDelay]);

  if (!shouldRender) {
    return null;
  }

  const displayValue = formatCounter(counterValue);

  // Compute SVG path endpoints directly from progress — avoids strokeDasharray pitfalls
  const tipX = progressValue * 100;
  const tipY = progressValue * 100;
  const progressPath = progressValue > 0.001 ? `M0,0 L${tipX},${tipY}` : null;

  const HEAD = 0.09;
  const headStartX = Math.max(0, progressValue - HEAD) * 100;
  const headPath =
    progressValue > HEAD
      ? `M${headStartX},${headStartX} L${tipX},${tipY}`
      : progressPath;

  const TIP = 0.022;
  const tipStartX = Math.max(0, progressValue - TIP) * 100;
  const tipPath =
    progressValue > TIP
      ? `M${tipStartX},${tipStartX} L${tipX},${tipY}`
      : progressPath;
  const tipDotPath = progressValue > 0.025 ? `M${tipX},${tipY} l0.01,0.01` : null;

  return (
    <motion.div
      role={isExiting ? undefined : "status"}
      aria-live={isExiting ? undefined : "polite"}
      aria-label={isExiting ? undefined : "Loading page"}
      aria-hidden={isExiting}
      tabIndex={-1}
      initial={false}
      animate={shouldReduceMotion && isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{
        duration: exitDurationSeconds,
        ease: exitEase,
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "transparent",
        pointerEvents: "auto",
        overflow: "hidden",
        isolation: "isolate",
        willChange: "transform",
      }}
    >
      <span style={visuallyHiddenStyle}>Loading page</span>

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={
          isExiting
            ? { x: "100%", y: "-100%" }
            : { x: "0%", y: "0%" }
        }
        transition={{
          duration: exitDurationSeconds,
          ease: shouldReduceMotion ? "easeOut" : exitEase,
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundColor: colors.backgroundColor,
          clipPath: "polygon(0 0, 100% 0, 100% 100%)",
          willChange: "transform",
        }}
      />

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={
          isExiting
            ? { x: "-100%", y: "100%" }
            : { x: "0%", y: "0%" }
        }
        transition={{
          duration: exitDurationSeconds,
          ease: shouldReduceMotion ? "easeOut" : exitEase,
        }}
        onAnimationComplete={() => {
          if (isExiting) {
            setShouldRender(false);
          }
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundColor: colors.backgroundColor,
          clipPath: "polygon(0 0, 0 100%, 100% 100%)",
          willChange: "transform",
        }}
      />

      <motion.div
        aria-hidden={isExiting}
        initial={false}
        animate={
          isExiting
            ? {
                opacity: 0,
                y: shouldReduceMotion ? "0vh" : "-2vh",
                filter: !shouldReduceMotion && blurOnExit ? "blur(10px)" : "blur(0px)",
              }
            : { opacity: 1, y: "0vh", filter: "blur(0px)" }
        }
        transition={{
          duration: 0.48,
          ease: counterEase,
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          willChange: "opacity, transform, filter",
        }}
      >
        {showProgress && (
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <linearGradient id="pldr-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb06c" />
                <stop offset="45%" stopColor="#ff7030" />
                <stop offset="100%" stopColor="#c84010" />
              </linearGradient>
              <linearGradient id="pldr-tip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8ef" />
                <stop offset="45%" stopColor="#ffc48d" />
                <stop offset="100%" stopColor="#ff6f2f" />
              </linearGradient>
            </defs>

            {/* Static black base track — always full diagonal */}
            <line
              x1="0" y1="0" x2="100" y2="100"
              stroke={colors.trackColor}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />

            {/* Progress fill — grows from top-left corner as load advances */}
            {progressPath && (
              <motion.g
                animate={{ opacity: isExiting ? 0 : 1 }}
                transition={{
                  duration: isExiting ? exitDurationSeconds * 0.5 : 0,
                  ease: "easeOut",
                }}
              >
                {/* Outer ambient glow */}
                <path
                  d={progressPath}
                  stroke="#ff7030"
                  strokeWidth={progressHeight + 22}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                  style={{ opacity: 0.055 }}
                />
                {/* Mid glow */}
                <path
                  d={progressPath}
                  stroke="#ff7030"
                  strokeWidth={progressHeight + 11}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                  style={{ opacity: 0.14 }}
                />
                {/* Tight inner glow */}
                <path
                  d={progressPath}
                  stroke="#ff7030"
                  strokeWidth={progressHeight + 4}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                  style={{ opacity: 0.28 }}
                />
                {/* Sharp colored core */}
                <path
                  d={progressPath}
                  stroke="url(#pldr-core-grad)"
                  strokeWidth={progressHeight}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                  style={{ opacity: 1 }}
                />

                {/* Bright head riding the leading tip */}
                {progressValue > 0.025 && !shouldReduceMotion && headPath && (
                  <>
                    {/* Head outer halo */}
                    <path
                      d={headPath}
                      stroke="#ff9050"
                      strokeWidth={progressHeight + 24}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      style={{
                        opacity: 0.18,
                        filter: "drop-shadow(0 0 18px rgba(255, 112, 48, 0.55))",
                      }}
                    />
                    {/* Polished warm head */}
                    <path
                      d={headPath}
                      stroke="url(#pldr-tip-grad)"
                      strokeWidth={progressHeight + 9}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      style={{
                        opacity: 0.72,
                        filter: "drop-shadow(0 0 8px rgba(255, 196, 141, 0.5))",
                      }}
                    />
                    {/* White-hot tip */}
                    {tipPath && (
                      <path
                        d={tipPath}
                        stroke="#fff6ee"
                        strokeWidth={progressHeight + 3}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        style={{
                          opacity: 0.96,
                          filter: "drop-shadow(0 0 7px rgba(255, 255, 255, 0.9))",
                        }}
                      />
                    )}
                    {tipDotPath && (
                      <>
                        <path
                          d={tipDotPath}
                          stroke="#ff7a32"
                          strokeWidth={progressHeight + 15}
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          fill="none"
                          style={{ opacity: 0.2 }}
                        />
                        <path
                          d={tipDotPath}
                          stroke="#fffaf4"
                          strokeWidth={progressHeight + 5}
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          fill="none"
                          style={{
                            opacity: 0.98,
                            filter: "drop-shadow(0 0 10px rgba(255, 122, 50, 0.72))",
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </motion.g>
            )}
          </svg>
        )}

        {showCounter && (
          <div
            style={{
              position: "absolute",
              left: "clamp(18px, 4vw, 64px)",
              bottom: "clamp(24px, 5.5vh, 68px)",
              width: "min(78vw, 520px)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                ...defaultFont,
                ...font,
                color: colors.counterColor,
                position: "relative",
                display: "block",
                fontVariantNumeric: "tabular-nums",
                userSelect: "none",
                textShadow: shouldReduceMotion
                  ? "none"
                  : "0 0 26px rgba(240, 141, 98, 0.16), 0 14px 44px rgba(211, 64, 0, 0.12)",
                willChange: "opacity, transform, filter",
              }}
            >
              {displayValue}
            </div>
            <div
              aria-hidden="true"
              style={{
                marginTop: "clamp(8px, 1.2vh, 14px)",
                width: "clamp(46px, 9vw, 116px)",
                height: 2,
                background:
                  "linear-gradient(90deg, #f08d62 0%, rgba(255, 122, 60, 0.42) 58%, rgba(240, 141, 98, 0) 100%)",
                boxShadow: shouldReduceMotion
                  ? "none"
                  : "0 0 18px rgba(240, 141, 98, 0.38)",
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PremiumPreloader;
