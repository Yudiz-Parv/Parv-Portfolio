import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";

import { STATS } from "@/data/portfolio";
import { useCountOnVisible } from "@/hooks/use-count-on-visible";
import type { StatItem } from "@/types/portfolio";

import "./MagicBento.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const smootherStep = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);

const CLOSE_SCROLL_START = 0.48;
const CLOSE_SCROLL_DISTANCE = 0.5;
const MOBILE_BREAKPOINT = 768;
const INFINITY_PATH =
  "M58 58C58 34 84 34 110 58C136 82 162 82 162 58C162 34 136 34 110 58C84 82 58 82 58 58Z";

const MagicBento = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionTopRef = useRef(0);
  const sectionRangeRef = useRef(1);
  const frameRef = useRef(0);
  const resizeFrameRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const canCountRef = useRef(false);
  const [canCount, setCanCount] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const getMeasuredViewportHeight = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const previousWidth = viewportWidthRef.current;
    const previousHeight = viewportHeightRef.current || height;
    const isMobile = width < MOBILE_BREAKPOINT;
    const widthChanged = Math.abs(width - previousWidth) > 1;

    viewportWidthRef.current = width;

    if (!isMobile || widthChanged) {
      viewportHeightRef.current = height;
      return height;
    }

    viewportHeightRef.current = Math.min(previousHeight, height);
    return viewportHeightRef.current;
  }, []);

  const renderProgress = useCallback((scroll: number) => {
    const section = sectionRef.current;
    if (!section) return;

    if (shouldReduceMotion) {
      section.style.setProperty("--stats-lens-open", "1");
      section.style.setProperty("--stats-lens-height", "118%");
      section.style.setProperty("--stats-lens-scale-y", "1");
      section.style.setProperty("--stats-lens-blur", "0px");
      section.style.setProperty("--stats-lens-content-opacity", "1");
      section.style.setProperty("--stats-lens-content-y", "0px");
      section.style.setProperty("--stats-lens-content-scale", "1");
      section.style.setProperty("--stats-lens-ghost-scale", "1");
      section.style.setProperty("--stats-lens-orb-scale", "1");
      section.style.setProperty("--stats-lens-orb-opacity", "0");
      section.style.setProperty("--stats-lens-rim-opacity", "0");
      section.style.setProperty("--stats-lens-eye-opacity", "1");
      section.style.setProperty("--stats-lens-close", "0");
      section.style.setProperty("--stats-lens-close-circle-opacity", "0");
      section.style.setProperty("--stats-lens-close-circle-scale", "1");
      section.style.setProperty("--stats-lens-fill", "0");
      section.style.setProperty("--stats-lens-ink", "0, 0, 0");
      section.style.setProperty("--stats-lens-contrast", "255, 255, 255");
      section.style.setProperty("--stats-lens-bg", "0, 0, 0");
      if (!canCountRef.current) {
        canCountRef.current = true;
        setCanCount(true);
      }
      return;
    }

    const rawProgress = clamp((scroll - sectionTopRef.current) / sectionRangeRef.current);
    const introProgress = easeOutCubic(clamp((rawProgress + 0.08) / 0.2));
    const openProgress = easeOutCubic(clamp((rawProgress - 0.12) / 0.56));
    const settleProgress = easeOutCubic(clamp((rawProgress - 0.48) / 0.3));
    const orbFadeProgress = easeOutCubic(clamp((rawProgress - 0.3) / 0.16));
    const closeProgress = smootherStep(clamp((rawProgress - CLOSE_SCROLL_START) / CLOSE_SCROLL_DISTANCE));
    const apertureProgress = openProgress * (1 - closeProgress);
    // Keep the blink on black instead of washing the viewport white during the handoff.
    const fillProgress = 0;
    const rimExitProgress = easeOutCubic(clamp((closeProgress - 0.35) / 0.65));
    const contentExitProgress = easeOutCubic(clamp((closeProgress - 0.2) / 0.8));
    const eyeOpacity = openProgress * (1 - closeProgress * 0.12);
    const rimOpacity = Math.min(openProgress * 2.4, 1) * (1 - Math.max(rimExitProgress, closeProgress * 0.78));
    const closeCircleOpacity = Math.sin(closeProgress * Math.PI) * 0.42;
    const closeCircleScale = 0.78 + closeProgress * 0.42;
    const introOrbOpacity = 1 - orbFadeProgress;
    const outroOrbOpacity = easeOutCubic(clamp((closeProgress - 0.72) / 0.22));
    const orbOpacity = Math.max(introOrbOpacity, outroOrbOpacity);
    const orbScale = outroOrbOpacity > introOrbOpacity ? 0.82 : 0.82 + openProgress * 0.18;
    const darkInkMix = Math.max(openProgress, fillProgress);
    const inkValue = Math.round(255 * (1 - darkInkMix));
    const contrastValue = 255 - inkValue;
    const bgValue = 0;

    if (!canCountRef.current && rawProgress > 0.42) {
      canCountRef.current = true;
      setCanCount(true);
    }

    section.style.setProperty("--stats-lens-open", apertureProgress.toFixed(4));
    section.style.setProperty("--stats-lens-height", `${(apertureProgress * 122).toFixed(2)}%`);
    section.style.setProperty("--stats-lens-scale-y", Math.max(apertureProgress, 0.001).toFixed(4));
    section.style.setProperty("--stats-lens-blur", `${(12 * (1 - openProgress) + closeProgress * 3).toFixed(2)}px`);
    section.style.setProperty("--stats-lens-content-opacity", (introProgress * (0.28 + openProgress * 0.72) * (1 - contentExitProgress)).toFixed(4));
    section.style.setProperty("--stats-lens-content-y", `${(((1 - settleProgress) * 22) - closeProgress * 18).toFixed(2)}px`);
    section.style.setProperty("--stats-lens-content-scale", (0.965 + openProgress * 0.035 - closeProgress * 0.018).toFixed(4));
    section.style.setProperty("--stats-lens-ghost-scale", (1.32 - openProgress * 0.24 + closeProgress * 0.08).toFixed(4));
    section.style.setProperty("--stats-lens-orb-scale", orbScale.toFixed(4));
    section.style.setProperty("--stats-lens-orb-opacity", orbOpacity.toFixed(4));
    section.style.setProperty("--stats-lens-rim-opacity", rimOpacity.toFixed(4));
    section.style.setProperty("--stats-lens-eye-opacity", eyeOpacity.toFixed(4));
    section.style.setProperty("--stats-lens-close", closeProgress.toFixed(4));
    section.style.setProperty("--stats-lens-close-circle-opacity", closeCircleOpacity.toFixed(4));
    section.style.setProperty("--stats-lens-close-circle-scale", closeCircleScale.toFixed(4));
    section.style.setProperty("--stats-lens-fill", fillProgress.toFixed(4));
    section.style.setProperty("--stats-lens-ink", `${inkValue}, ${inkValue}, ${inkValue}`);
    section.style.setProperty("--stats-lens-contrast", `${contrastValue}, ${contrastValue}, ${contrastValue}`);
    section.style.setProperty("--stats-lens-bg", `${bgValue}, ${bgValue}, ${bgValue}`);
  }, [shouldReduceMotion]);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const viewportHeight = getMeasuredViewportHeight();
    sectionTopRef.current = section.getBoundingClientRect().top + window.scrollY;
    sectionRangeRef.current = Math.max(section.offsetHeight - viewportHeight, 1);
    renderProgress(window.scrollY);
  }, [getMeasuredViewportHeight, renderProgress]);

  useEffect(() => {
    measure();
    const measureTimer = window.setTimeout(measure, 150);
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(measure);
    };

    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("orientationchange", scheduleMeasure, { passive: true });

    return () => {
      window.clearTimeout(measureTimer);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
      window.cancelAnimationFrame(frameRef.current);
      window.cancelAnimationFrame(resizeFrameRef.current);
    };
  }, [measure]);

  useLenis(({ scroll }) => {
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      renderProgress(scroll);
    });
  });

  return (
    <section ref={sectionRef} className="stats-lens-section" aria-labelledby="stats-lens-title">
      <div className="stats-lens-sticky">
        <div className="stats-lens-eye-surface" aria-hidden="true" />

        <div className="stats-lens-content">
          <p className="stats-lens-ghost" aria-hidden="true">About</p>

          <div className="stats-lens-container">
            <div className="stats-lens-header">
              <h2 id="stats-lens-title" className="stats-lens-heading">
                More About Me
              </h2>
            </div>

            <div className="stats-lens-grid">
              {STATS.map((item) => (
                <SwissItem key={item.label} item={item} canCount={canCount} />
              ))}
            </div>
          </div>
        </div>

        <div className="stats-lens-iris" aria-hidden="true" />
        <div className="stats-lens-rim" aria-hidden="true" />
        <div className="stats-lens-close-circles" aria-hidden="true" />

        <div className="stats-lens-orb" aria-hidden="true">
          More
        </div>

        <div className="stats-lens-vignette" aria-hidden="true" />
      </div>
    </section>
  );
};

const SwissItem = ({ item, canCount }: { item: StatItem; canCount: boolean }) => {
  const { ref, count } = useCountOnVisible(item.value, 1200, canCount);
  const isInfiniteValue = !Number.isFinite(item.value);
  const isInfinityActive = isInfiniteValue && !Number.isFinite(count);

  return (
    <div ref={ref} className="stats-lens-item">
      <span className="stats-lens-item__label">
        {item.label}
      </span>

      <h3
        className={[
          "stats-lens-item__value",
          isInfiniteValue ? "stats-lens-item__value--infinity" : "",
          isInfinityActive ? "is-active" : "",
        ].filter(Boolean).join(" ")}
      >
        {isInfiniteValue ? (
          <span className="stats-lens-infinity" role="img" aria-label="Infinite">
            <svg className="stats-lens-infinity__svg" viewBox="0 0 220 116" aria-hidden="true" focusable="false">
              <path className="stats-lens-infinity__track" d={INFINITY_PATH} pathLength={100} />
              <path className="stats-lens-infinity__core" d={INFINITY_PATH} pathLength={100} />
              <path className="stats-lens-infinity__echo" d={INFINITY_PATH} pathLength={100} />
              <path className="stats-lens-infinity__highlight" d={INFINITY_PATH} pathLength={100} />
            </svg>
          </span>
        ) : (
          <>
            {count.toLocaleString()}
            {item.suffix}
          </>
        )}
      </h3>

      <p className="stats-lens-item__description">
        {item.description}
      </p>
    </div>
  );
};

export default MagicBento;
