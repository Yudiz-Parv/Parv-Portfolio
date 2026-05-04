import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

type Theme = "dark" | "light" | "custom"
type Position = "top" | "center" | "bottom"
type BarPlacement = "above" | "below"

interface PremiumPreloaderProps {
    style?: React.CSSProperties
    theme: Theme
    backgroundColor: string
    counterColor: string
    progressColor: string
    trackColor: string
    font?: React.CSSProperties
    duration: number
    speed: number
    position: Position
    showCounter: boolean
    showProgress: boolean
    barPlacement: BarPlacement
    barWidth: number
    barHeight: number
    exitDelay: number
    exitDuration: number
    blurOnExit: boolean
    zIndex: number
}

type ResolvedColors = Pick<
    PremiumPreloaderProps,
    "backgroundColor" | "counterColor" | "progressColor" | "trackColor"
>

const DIGITS = Array.from({ length: 10 }, (_, index) => index)
const ONES_DIGITS = Array.from({ length: 100 }, (_, index) => index % 10)
const EXIT_EASE = [0.76, 0, 0.24, 1] as [number, number, number, number]
const DIGIT_EASE = "cubic-bezier(0.76, 0, 0.24, 1)"

const DEFAULT_PROPS: PremiumPreloaderProps = {
    theme: "dark",
    backgroundColor: "#000000",
    counterColor: "#FFFFFF",
    progressColor: "#FFFFFF",
    trackColor: "rgba(255,255,255,0.18)",
    font: {
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "clamp(72px, 15vw, 176px)",
        fontWeight: 900,
        letterSpacing: 0,
        lineHeight: 1,
    },
    duration: 2.5,
    speed: 1,
    position: "center",
    showCounter: true,
    showProgress: true,
    barPlacement: "below",
    barWidth: 36,
    barHeight: 3,
    exitDelay: 300,
    exitDuration: 0.7,
    blurOnExit: true,
    zIndex: 9999,
}

const THEME_COLORS: Record<Exclude<Theme, "custom">, ResolvedColors> = {
    dark: {
        backgroundColor: "#000000",
        counterColor: "#FFFFFF",
        progressColor: "#FFFFFF",
        trackColor: "rgba(255,255,255,0.18)",
    },
    light: {
        backgroundColor: "#F4F1EA",
        counterColor: "#050505",
        progressColor: "#050505",
        trackColor: "rgba(5,5,5,0.16)",
    },
}

const POSITION_STYLES: Record<Position, React.CSSProperties> = {
    top: {
        justifyContent: "flex-start",
        paddingTop: "18vh",
    },
    center: {
        justifyContent: "center",
    },
    bottom: {
        justifyContent: "flex-end",
        paddingBottom: "16vh",
    },
}

const visuallyHiddenStyle: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

function easeInOutCubic(value: number) {
    return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function resolveColors(props: PremiumPreloaderProps): ResolvedColors {
    if (props.theme === "dark" || props.theme === "light") {
        return THEME_COLORS[props.theme]
    }

    return {
        backgroundColor: props.backgroundColor,
        counterColor: props.counterColor,
        progressColor: props.progressColor,
        trackColor: props.trackColor,
    }
}

function DigitColumn({
    digits,
    index,
    transitionDuration,
}: {
    digits: number[]
    index: number
    transitionDuration: number
}) {
    return (
        <span
            aria-hidden="true"
            style={{
                display: "inline-block",
                width: "0.64em",
                height: "1em",
                overflow: "hidden",
                verticalAlign: "top",
            }}
        >
            <span
                style={{
                    display: "block",
                    transform: `translate3d(0, -${index}em, 0)`,
                    transition: `transform ${transitionDuration}s ${DIGIT_EASE}`,
                    willChange: "transform",
                }}
            >
                {digits.map((digit, digitIndex) => (
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
    )
}

export const PremiumPreloader: React.FC<Partial<PremiumPreloaderProps>> = (
    props
) => {
    const settings = { ...DEFAULT_PROPS, ...props }
    const [counterValue, setCounterValue] = React.useState(0)
    const [isExiting, setIsExiting] = React.useState(false)
    const [shouldRender, setShouldRender] = React.useState(true)

    const safeDuration = clamp(settings.duration, 1, 6)
    const safeSpeed = clamp(settings.speed, 0.5, 2)
    const safeExitDelay = clamp(settings.exitDelay, 0, 800)
    const safeExitDuration = clamp(settings.exitDuration, 0.2, 1.5)
    const effectiveDurationMs = (safeDuration / safeSpeed) * 1000
    const digitTransitionDuration = clamp(
        (effectiveDurationMs / 1000 / 99) * 2.4,
        0.04,
        0.16
    )

    const colors = resolveColors(settings)

    React.useEffect(() => {
        if (!shouldRender || typeof document === "undefined") {
            return
        }

        const previousBodyOverflow = document.body.style.overflow
        const previousBodyTouchAction = document.body.style.touchAction
        const previousHtmlOverflow = document.documentElement.style.overflow

        document.body.style.overflow = "hidden"
        document.body.style.touchAction = "none"
        document.documentElement.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousBodyOverflow
            document.body.style.touchAction = previousBodyTouchAction
            document.documentElement.style.overflow = previousHtmlOverflow
        }
    }, [shouldRender])

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return
        }

        let animationFrame = 0
        let exitTimer = 0
        let startTime: number | null = null

        setShouldRender(true)
        setIsExiting(false)
        setCounterValue(0)

        const tick = (time: number) => {
            if (startTime === null) {
                startTime = time
            }

            const elapsed = time - startTime
            const rawProgress = clamp(elapsed / effectiveDurationMs, 0, 1)
            const easedProgress = easeInOutCubic(rawProgress)
            const nextValue = Math.min(99, Math.floor(easedProgress * 100))

            setCounterValue(nextValue)

            if (rawProgress < 1) {
                animationFrame = window.requestAnimationFrame(tick)
                return
            }

            setCounterValue(99)
            exitTimer = window.setTimeout(() => {
                setIsExiting(true)
            }, safeExitDelay)
        }

        animationFrame = window.requestAnimationFrame(tick)

        return () => {
            window.cancelAnimationFrame(animationFrame)
            window.clearTimeout(exitTimer)
        }
    }, [effectiveDurationMs, safeExitDelay])

    if (!shouldRender) {
        return null
    }

    const tensIndex = Math.floor(counterValue / 10)
    const onesIndex = counterValue
    const progressScale = counterValue >= 99 ? 1 : counterValue / 100
    const progressWidth = `${clamp(settings.barWidth, 20, 80)}vw`
    const progressHeight = clamp(settings.barHeight, 2, 6)
    const hasCounter = settings.showCounter
    const hasProgress = settings.showProgress
    const contentGap = hasCounter && hasProgress ? "clamp(20px, 3vw, 40px)" : 0

    const counter = hasCounter ? (
        <div
            style={{
                ...DEFAULT_PROPS.font,
                ...settings.font,
                color: colors.counterColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                userSelect: "none",
            }}
        >
            <DigitColumn
                digits={DIGITS}
                index={tensIndex}
                transitionDuration={digitTransitionDuration}
            />
            <DigitColumn
                digits={ONES_DIGITS}
                index={onesIndex}
                transitionDuration={digitTransitionDuration}
            />
        </div>
    ) : null

    const progressBar = hasProgress ? (
        <div
            aria-hidden="true"
            style={{
                width: progressWidth,
                maxWidth: "min(720px, calc(100vw - 48px))",
                minWidth: "160px",
                height: progressHeight,
                overflow: "hidden",
                backgroundColor: colors.trackColor,
            }}
        >
            <motion.div
                animate={{ scaleX: progressScale }}
                transition={{
                    duration: digitTransitionDuration,
                    ease: EXIT_EASE,
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: colors.progressColor,
                    transformOrigin: "left center",
                    willChange: "transform",
                }}
            />
        </div>
    ) : null

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
                          scale: 0.98,
                          filter: settings.blurOnExit
                              ? "blur(8px)"
                              : "blur(0px)",
                      }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={{
                duration: safeExitDuration,
                ease: EXIT_EASE,
            }}
            onAnimationComplete={() => {
                if (isExiting) {
                    setShouldRender(false)
                }
            }}
            style={{
                ...settings.style,
                position: "fixed",
                inset: 0,
                zIndex: settings.zIndex,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                paddingInline: "24px",
                backgroundColor: colors.backgroundColor,
                pointerEvents: "auto",
                overflow: "hidden",
                willChange: "opacity, transform, filter",
                ...POSITION_STYLES[settings.position],
            }}
        >
            <span style={visuallyHiddenStyle}>Loading page</span>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: contentGap,
                }}
            >
                {settings.barPlacement === "above" && progressBar}
                {counter}
                {settings.barPlacement === "below" && progressBar}
            </div>
        </motion.div>
    )
}

PremiumPreloader.defaultProps = DEFAULT_PROPS

addPropertyControls(PremiumPreloader, {
    theme: {
        type: ControlType.Enum,
        title: "Theme",
        defaultValue: "dark",
        options: ["dark", "light", "custom"],
        optionTitles: ["Dark", "Light", "Custom"],
        displaySegmentedControl: true,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#000000",
        hidden: ({ theme }) => theme !== "custom",
    },
    counterColor: {
        type: ControlType.Color,
        title: "Counter",
        defaultValue: "#FFFFFF",
        hidden: ({ theme }) => theme !== "custom",
    },
    progressColor: {
        type: ControlType.Color,
        title: "Progress",
        defaultValue: "#FFFFFF",
        hidden: ({ theme }) => theme !== "custom",
    },
    trackColor: {
        type: ControlType.Color,
        title: "Track",
        defaultValue: "rgba(255,255,255,0.18)",
        hidden: ({ theme }) => theme !== "custom",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        defaultValue: DEFAULT_PROPS.font,
        defaultFontType: "sans-serif",
        defaultFontSize: "128px",
        displayFontSize: true,
        displayTextAlignment: false,
        controls: "extended",
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 2.5,
        min: 1,
        max: 6,
        step: 0.1,
        unit: "s",
    },
    speed: {
        type: ControlType.Number,
        title: "Speed",
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.1,
    },
    position: {
        type: ControlType.Enum,
        title: "Position",
        defaultValue: "center",
        options: ["top", "center", "bottom"],
        optionTitles: ["Top", "Center", "Bottom"],
        displaySegmentedControl: true,
    },
    showCounter: {
        type: ControlType.Boolean,
        title: "Counter",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    showProgress: {
        type: ControlType.Boolean,
        title: "Progress",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    barPlacement: {
        type: ControlType.Enum,
        title: "Bar Place",
        defaultValue: "below",
        options: ["above", "below"],
        optionTitles: ["Above", "Below"],
        displaySegmentedControl: true,
        hidden: ({ showProgress }) => !showProgress,
    },
    barWidth: {
        type: ControlType.Number,
        title: "Bar Width",
        defaultValue: 36,
        min: 20,
        max: 80,
        step: 1,
        unit: "vw",
        hidden: ({ showProgress }) => !showProgress,
    },
    barHeight: {
        type: ControlType.Number,
        title: "Bar Height",
        defaultValue: 3,
        min: 2,
        max: 6,
        step: 1,
        unit: "px",
        hidden: ({ showProgress }) => !showProgress,
    },
    exitDelay: {
        type: ControlType.Number,
        title: "Exit Delay",
        defaultValue: 300,
        min: 0,
        max: 800,
        step: 50,
        unit: "ms",
    },
    exitDuration: {
        type: ControlType.Number,
        title: "Exit Time",
        defaultValue: 0.7,
        min: 0.2,
        max: 1.5,
        step: 0.1,
        unit: "s",
    },
    blurOnExit: {
        type: ControlType.Boolean,
        title: "Exit Blur",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    zIndex: {
        type: ControlType.Number,
        title: "Z Index",
        defaultValue: 9999,
        min: 1,
        max: 99999,
        step: 1,
        displayStepper: true,
    },
})

export default PremiumPreloader
