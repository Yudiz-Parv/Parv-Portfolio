import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";

import { STATS } from "@/data/portfolio";
import { useCountOnVisible } from "@/hooks/use-count-on-visible";
import type { StatItem } from "@/types/portfolio";

import "./MagicBento.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const MagicBento = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionTopRef = useRef(0);
  const sectionRangeRef = useRef(1);
  const frameRef = useRef(0);
  const canCountRef = useRef(false);
  const [canCount, setCanCount] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const renderProgress = useCallback((scroll: number) => {
    const section = sectionRef.current;
    if (!section) return;

    if (shouldReduceMotion) {
      section.style.setProperty("--stats-lens-open", "1");
      section.style.setProperty("--stats-lens-height", "118%");
      section.style.setProperty("--stats-lens-blur", "0px");
      section.style.setProperty("--stats-lens-content-opacity", "1");
      section.style.setProperty("--stats-lens-content-y", "0px");
      section.style.setProperty("--stats-lens-content-scale", "1");
      section.style.setProperty("--stats-lens-ghost-scale", "1");
      section.style.setProperty("--stats-lens-orb-scale", "1");
      section.style.setProperty("--stats-lens-orb-opacity", "0");
      section.style.setProperty("--stats-lens-rim-opacity", "0");
      section.style.setProperty("--stats-lens-eye-opacity", "0");
      section.style.setProperty("--stats-lens-ink", "255, 255, 255");
      section.style.setProperty("--stats-lens-contrast", "0, 0, 0");
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
    const orbFadeProgress = easeOutCubic(clamp((rawProgress - 0.58) / 0.18));
    const eyeExitProgress = easeOutCubic(clamp((rawProgress - 0.7) / 0.2));
    const rimExitProgress = easeOutCubic(clamp((rawProgress - 0.82) / 0.16));
    const eyeOpacity = openProgress * (1 - eyeExitProgress);
    const rimOpacity = Math.min(openProgress * 2.4, 1) * (1 - rimExitProgress);
    const darkInkMix = eyeOpacity;
    const inkValue = Math.round(255 * (1 - darkInkMix));
    const contrastValue = 255 - inkValue;

    if (!canCountRef.current && rawProgress > 0.42) {
      canCountRef.current = true;
      setCanCount(true);
    }

    section.style.setProperty("--stats-lens-open", openProgress.toFixed(4));
    section.style.setProperty("--stats-lens-height", `${(openProgress * 122).toFixed(2)}%`);
    section.style.setProperty("--stats-lens-blur", `${(12 * (1 - openProgress)).toFixed(2)}px`);
    section.style.setProperty("--stats-lens-content-opacity", (introProgress * (0.28 + openProgress * 0.72)).toFixed(4));
    section.style.setProperty("--stats-lens-content-y", `${((1 - settleProgress) * 22).toFixed(2)}px`);
    section.style.setProperty("--stats-lens-content-scale", (0.965 + openProgress * 0.035).toFixed(4));
    section.style.setProperty("--stats-lens-ghost-scale", (1.32 - openProgress * 0.24).toFixed(4));
    section.style.setProperty("--stats-lens-orb-scale", (0.82 + openProgress * 0.18).toFixed(4));
    section.style.setProperty("--stats-lens-orb-opacity", (1 - orbFadeProgress).toFixed(4));
    section.style.setProperty("--stats-lens-rim-opacity", rimOpacity.toFixed(4));
    section.style.setProperty("--stats-lens-eye-opacity", eyeOpacity.toFixed(4));
    section.style.setProperty("--stats-lens-ink", `${inkValue}, ${inkValue}, ${inkValue}`);
    section.style.setProperty("--stats-lens-contrast", `${contrastValue}, ${contrastValue}, ${contrastValue}`);
  }, [shouldReduceMotion]);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    sectionTopRef.current = section.getBoundingClientRect().top + window.scrollY;
    sectionRangeRef.current = Math.max(section.offsetHeight - window.innerHeight, 1);
    renderProgress(window.scrollY);
  }, [renderProgress]);

  useEffect(() => {
    measure();
    const measureTimer = window.setTimeout(measure, 150);

    window.addEventListener("resize", measure, { passive: true });

    return () => {
      window.clearTimeout(measureTimer);
      window.removeEventListener("resize", measure);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [measure]);

  useLenis(({ scroll }) => {
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => renderProgress(scroll));
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

  return (
    <div ref={ref} className="stats-lens-item">
      <span className="stats-lens-item__label">
        {item.label}
      </span>

      <h3 className="stats-lens-item__value">
        {count.toLocaleString()}
        {item.suffix}
      </h3>

      <p className="stats-lens-item__description">
        {item.description}
      </p>
    </div>
  );
};

export default MagicBento;
