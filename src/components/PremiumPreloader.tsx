import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const counterSteps = [0, 18, 42, 67, 86, 99];
const exitEase = [0.76, 0, 0.24, 1] as [number, number, number, number];
const counterEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

const defaultFont: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: "clamp(96px, 13vw, 220px)",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: 0.86,
};

const themeColors: Record<Exclude<Theme, "custom">, ResolvedColors> = {
  dark: {
    backgroundColor: "#000000",
    counterColor: "#FFFFFF",
    progressColor: "#ff3347",
    trackColor: "transparent",
  },
  light: {
    backgroundColor: "#F4F1EA",
    counterColor: "#050505",
    progressColor: "#ff3347",
    trackColor: "transparent",
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

const formatCounter = (value: number) => value.toString().padStart(2, "0");

const AnimatedCounterDigit = ({
  digit,
  index,
  stepKey,
}: {
  digit: string;
  index: number;
  stepKey: number;
}) => (
  <span
    aria-hidden="true"
    style={{
      position: "relative",
      display: "inline-block",
      width: "0.58em",
      height: "1em",
      overflow: "hidden",
    }}
  >
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={`${stepKey}-${index}-${digit}`}
        initial={{
          y: "88%",
          opacity: 0,
          scale: 0.985,
          clipPath: "inset(100% 0% 0% 0%)",
          filter: "blur(10px)",
        }}
        animate={{
          y: "0%",
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px)",
        }}
        exit={{
          y: "-88%",
          opacity: 0,
          scale: 0.985,
          clipPath: "inset(0% 0% 100% 0%)",
          filter: "blur(10px)",
        }}
        transition={{
          duration: 0.72,
          delay: index * 0.08,
          ease: counterEase,
        }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          lineHeight: "1em",
          willChange: "transform, opacity, clip-path, filter",
        }}
      >
        {digit}
      </motion.span>
    </AnimatePresence>
  </span>
);

const PremiumPreloader = ({
  theme = "dark",
  backgroundColor = "#000000",
  counterColor = "#FFFFFF",
  progressColor = "#ff3347",
  trackColor = "transparent",
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
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [counterValue, setCounterValue] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [travelDistance, setTravelDistance] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const safeDuration = clamp(duration, 1, 6);
  const safeSpeed = clamp(speed, 0.5, 2);
  const safeExitDelay = clamp(exitDelay, 0, 800);
  const safeExitDuration = clamp(exitDuration, 0.2, 1.5);
  const effectiveDurationMs = (safeDuration / safeSpeed) * 1000;
  const progressHeight = clamp(barHeight, 2, 6);
  const colors = resolveColors({
    theme,
    backgroundColor,
    counterColor,
    progressColor,
    trackColor,
  });

  useLayoutEffect(() => {
    if (!showCounter) {
      setTravelDistance(0);
      return;
    }

    const stage = stageRef.current;
    const counter = counterRef.current;

    if (!stage || !counter) {
      return;
    }

    const measure = () => {
      setTravelDistance(Math.max(stage.clientWidth - counter.offsetWidth, 0));
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
    resizeObserver.observe(counter);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [showCounter, font]);

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
      const stepIndex = Math.min(Math.floor(rawProgress * counterSteps.length), counterSteps.length - 1);
      const nextValue = counterSteps[stepIndex];

      setCounterValue(nextValue);
      setProgressValue(rawProgress >= 1 ? 1 : easedProgress);

      if (rawProgress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      setCounterValue(99);
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

  const counterX = progressValue * travelDistance;
  const displayValue = formatCounter(counterValue);
  const displayDigits = displayValue.split("");

  return (
    <motion.div
      role={isExiting ? undefined : "status"}
      aria-live={isExiting ? undefined : "polite"}
      aria-label={isExiting ? undefined : "Loading page"}
      aria-hidden={isExiting}
      tabIndex={-1}
      initial={false}
      animate={isExiting ? { y: "-100%" } : { y: "0%" }}
      transition={{
        duration: safeExitDuration,
        ease: exitEase,
      }}
      onAnimationComplete={() => {
        if (isExiting) {
          setShouldRender(false);
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: colors.backgroundColor,
        pointerEvents: "auto",
        overflow: "hidden",
        willChange: "transform",
      }}
    >
      <span style={visuallyHiddenStyle}>Loading page</span>

      <motion.div
        aria-hidden={isExiting}
        initial={false}
        animate={
          isExiting
            ? {
                opacity: 0,
                y: "-4vh",
                filter: blurOnExit ? "blur(10px)" : "blur(0px)",
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
          willChange: "opacity, transform, filter",
        }}
      >
        {showProgress && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: progressHeight,
              overflow: "hidden",
              backgroundColor: colors.trackColor,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors.progressColor,
                borderRadius: "0 999px 999px 0",
                transform: `scaleX(${progressValue})`,
                transformOrigin: "left center",
                willChange: "transform",
              }}
            />
          </div>
        )}

        {showCounter && (
          <div
            ref={stageRef}
            style={{
              position: "absolute",
              left: "clamp(18px, 2vw, 42px)",
              right: "clamp(18px, 2vw, 42px)",
              bottom: "clamp(32px, 6vh, 82px)",
              height: "clamp(92px, 14vw, 230px)",
              overflow: "hidden",
            }}
          >
            <div
              ref={counterRef}
              style={{
                ...defaultFont,
                ...font,
                color: colors.counterColor,
                position: "absolute",
                left: 0,
                bottom: "-0.03em",
                width: "1.18em",
                height: "1em",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                overflow: "hidden",
                fontVariantNumeric: "tabular-nums",
                userSelect: "none",
                transform: `translate3d(${counterX}px, 0, 0)`,
                willChange: "transform",
              }}
            >
              {displayDigits.map((digit, index) => (
                <AnimatedCounterDigit
                  key={index}
                  digit={digit}
                  index={index}
                  stepKey={counterValue}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={isExiting ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{
          duration: isExiting ? 0.2 : 0,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: progressHeight,
          backgroundColor: colors.progressColor,
          transformOrigin: "left center",
          willChange: "transform, opacity",
        }}
      />
    </motion.div>
  );
};

export default PremiumPreloader;
