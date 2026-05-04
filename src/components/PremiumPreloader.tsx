import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion } from "framer-motion";

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

const digits = Array.from({ length: 10 }, (_, index) => index);
const onesDigits = Array.from({ length: 100 }, (_, index) => index % 10);
const exitEase = [0.76, 0, 0.24, 1] as [number, number, number, number];
const digitEase = "cubic-bezier(0.76, 0, 0.24, 1)";

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

const DigitColumn = ({
  values,
  index,
  transitionDuration,
}: {
  values: number[];
  index: number;
  transitionDuration: number;
}) => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-block",
      width: "0.58em",
      height: "1em",
      overflow: "hidden",
      verticalAlign: "top",
    }}
  >
    <span
      style={{
        display: "block",
        transform: `translate3d(0, -${index}em, 0)`,
        transition: `transform ${transitionDuration}s ${digitEase}`,
        willChange: "transform",
      }}
    >
      {values.map((digit, digitIndex) => (
        <span
          key={`${digit}-${digitIndex}`}
          style={{
            display: "block",
            height: "1em",
            lineHeight: "1em",
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {digit}
        </span>
      ))}
    </span>
  </span>
);

const PremiumPreloader = ({
  theme = "dark",
  backgroundColor = "#000000",
  counterColor = "#FFFFFF",
  progressColor = "#ff3347",
  trackColor = "transparent",
  font = defaultFont,
  duration = 2.8,
  speed = 1,
  showCounter = true,
  showProgress = true,
  barHeight = 4,
  exitDelay = 340,
  exitDuration = 0.75,
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
  const digitTransitionDuration = clamp((effectiveDurationMs / 1000 / 99) * 2.6, 0.05, 0.18);
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
      const nextValue = Math.min(99, Math.floor(easedProgress * 100));

      setCounterValue(nextValue);
      setProgressValue(nextValue >= 99 ? 1 : easedProgress);

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

  const tensIndex = Math.floor(counterValue / 10);
  const counterX = progressValue * travelDistance;

  return (
    <motion.div
      role={isExiting ? undefined : "status"}
      aria-live={isExiting ? undefined : "polite"}
      aria-label={isExiting ? undefined : "Loading page"}
      aria-hidden={isExiting}
      tabIndex={-1}
      initial={false}
      animate={
        isExiting
          ? {
              opacity: 0,
              y: "-3vh",
              filter: blurOnExit ? "blur(8px)" : "blur(0px)",
            }
          : { opacity: 1, y: "0vh", filter: "blur(0px)" }
      }
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
        willChange: "opacity, transform, filter",
      }}
    >
      <span style={visuallyHiddenStyle}>Loading page</span>

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
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              fontVariantNumeric: "tabular-nums",
              userSelect: "none",
              transform: `translate3d(${counterX}px, 0, 0)`,
              willChange: "transform",
            }}
          >
            <DigitColumn values={digits} index={tensIndex} transitionDuration={digitTransitionDuration} />
            <DigitColumn values={onesDigits} index={counterValue} transitionDuration={digitTransitionDuration} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PremiumPreloader;
