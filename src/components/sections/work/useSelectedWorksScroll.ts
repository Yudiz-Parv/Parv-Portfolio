import { useCallback, useEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import { useLenis } from "lenis/react";

import { useMaxWidth } from "@/hooks/use-breakpoint";

const STACK_CONFIG = {
  itemDistance: 100,
  itemScale: 0.015,
  itemStackDistance: 18,
  stackPosition: 0.08,
  scaleEndPosition: 0.05,
  baseScale: 0.92,
};

const MARQUEE_CONFIG = {
  foregroundBaseSpeed: 86,
  backgroundBaseSpeed: 52,
  reducedForegroundSpeed: 7,
  reducedBackgroundSpeed: 4,
  scrollBoostMultiplier: 24,
  maxScrollBoost: 1100,
};

interface MarqueeMotionState {
  backgroundLoopWidth: number;
  backgroundX: number;
  direction: 1 | -1;
  foregroundLoopWidth: number;
  foregroundX: number;
  hasScrollSample: boolean;
  lastTime: number;
  rafId: number;
  reducedMotion: boolean;
  scrollBoost: number;
  previousScroll: number;
}

export function useSelectedWorksScroll() {
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardOffsetsRef = useRef<number[]>([]);
  const endOffsetRef = useRef<number>(0);
  const stackInnerRef = useRef<HTMLDivElement>(null);
  const stackInnerTopRef = useRef<number>(0);
  const voidContainerRef = useRef<HTMLDivElement>(null);
  const marqueeForegroundTrackRef = useRef<HTMLDivElement>(null);
  const marqueeBackgroundTrackRef = useRef<HTMLDivElement>(null);
  const kineticWheelRef = useRef<HTMLDivElement>(null);
  const threadPathRef = useRef<SVGPathElement>(null);
  const figureGroupRef = useRef<SVGGElement>(null);
  const threadLenRef = useRef(0);
  const textAnalyzeRef = useRef<SVGTextElement>(null);
  const textDesignRef = useRef<SVGTextElement>(null);
  const textBuildRef = useRef<SVGTextElement>(null);
  const textDeliverRef = useRef<SVGTextElement>(null);
  const marqueeMotionRef = useRef<MarqueeMotionState>({
    backgroundLoopWidth: 1,
    backgroundX: 0,
    direction: 1,
    foregroundLoopWidth: 1,
    foregroundX: 0,
    hasScrollSample: false,
    lastTime: 0,
    rafId: 0,
    reducedMotion: false,
    scrollBoost: 0,
    previousScroll: 0,
  });

  const [ready, setReady] = useState(false);
  const isMobile = useMaxWidth(1024);

  const updateMarqueeScrollState = useCallback((scroll: number) => {
    const state = marqueeMotionRef.current;

    if (!state.hasScrollSample) {
      state.previousScroll = scroll;
      state.hasScrollSample = true;
      return;
    }

    const scrollDelta = scroll - state.previousScroll;
    state.previousScroll = scroll;

    if (Math.abs(scrollDelta) < 0.1) return;

    state.direction = scrollDelta > 0 ? 1 : -1;

    if (state.reducedMotion) {
      state.scrollBoost = 0;
      return;
    }

    const nextBoost = Math.min(
      Math.abs(scrollDelta) * MARQUEE_CONFIG.scrollBoostMultiplier,
      MARQUEE_CONFIG.maxScrollBoost,
    );

    state.scrollBoost += (nextBoost - state.scrollBoost) * 0.45;
  }, []);

  useLenis(({ scroll }) => {
    updateMarqueeScrollState(scroll);

    if (!ready) return;

    const cards = cardsRef.current;
    const cardOffsets = cardOffsetsRef.current;
    const endElementTop = endOffsetRef.current;
    const stackInnerTop = stackInnerTopRef.current;

    if (!cards.length || !cardOffsets.length) return;

    const containerHeight = window.innerHeight;
    const firstCardHeight = cards[0].offsetHeight;

    const stackPositionPx = (containerHeight - firstCardHeight) / 2;
    const scaleEndPositionPx =
      stackPositionPx - (STACK_CONFIG.stackPosition - STACK_CONFIG.scaleEndPosition) * containerHeight;

    const lastCardTop = cardOffsets[cards.length - 1];
    const triggerEndLast = lastCardTop - scaleEndPositionPx;
    const voidStart = triggerEndLast;
    const voidDistance = containerHeight * 1.2;
    const voidProgress = getVoidProgress(scroll, voidStart, voidDistance);

    cards.forEach((card, index) => {
      const cardTop = cardOffsets[index];
      const triggerStart = cardTop - stackPositionPx - STACK_CONFIG.itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinEnd = Math.max(endElementTop - containerHeight * 0.5, voidStart + voidDistance);
      const scaleProgress = getScaleProgress(scroll, triggerStart, triggerEnd);
      const targetScale = STACK_CONFIG.baseScale + index * STACK_CONFIG.itemScale;
      const scale = Number((1 - scaleProgress * (1 - targetScale)).toFixed(4));
      const translateY = getCardTranslateY(scroll, cardTop, triggerStart, pinEnd, stackPositionPx, index);

      card.style.transform = `translate3d(0, ${Math.round(translateY * 10) / 10}px, 0) scale(${scale})`;
    });

    updateVoidContainer({
      containerHeight,
      isMobile,
      scroll,
      stackInnerRef,
      stackInnerTop,
      voidContainerRef,
      voidProgress,
    });

    updateMobileThread({
      figureGroupRef,
      isMobile,
      textAnalyzeRef,
      textBuildRef,
      textDeliverRef,
      textDesignRef,
      threadLenRef,
      threadPathRef,
      voidProgress,
    });

    updateKineticWheel({
      containerHeight,
      endElementTop,
      figureGroupRef,
      isMobile,
      kineticWheelRef,
      scroll,
      voidProgress,
    });
  });

  const cachePositions = useCallback(() => {
    setReady(false);
    const cards = Array.from(document.querySelectorAll(".scroll-stack-card")) as HTMLElement[];
    cardsRef.current = cards;
    cards.forEach((card) => {
      card.style.transform = "";
    });

    if (voidContainerRef.current) {
      voidContainerRef.current.style.transform = "";
      voidContainerRef.current.style.transformOrigin = "";
    }

    if (kineticWheelRef.current) kineticWheelRef.current.style.transform = "";

    if (threadPathRef.current && isMobile) {
      try {
        const len = threadPathRef.current.getTotalLength();
        if (len > 0) {
          threadLenRef.current = len;
          threadPathRef.current.style.strokeDasharray = `${len}`;
          threadPathRef.current.style.strokeDashoffset = `${len}`;
        }
      } catch {
        threadLenRef.current = 0;
      }
    }

    const scrollY = window.scrollY;
    cardOffsetsRef.current = cards.map((card) => card.getBoundingClientRect().top + scrollY);

    const endElement = document.querySelector(".scroll-stack-end") as HTMLElement;
    if (endElement) endOffsetRef.current = endElement.getBoundingClientRect().top + scrollY;
    if (stackInnerRef.current) stackInnerTopRef.current = stackInnerRef.current.getBoundingClientRect().top + scrollY;

    setReady(true);
  }, [isMobile]);

  const measureMarquee = useCallback(() => {
    const state = marqueeMotionRef.current;
    state.foregroundLoopWidth = getMarqueeLoopWidth(marqueeForegroundTrackRef.current);
    state.backgroundLoopWidth = getMarqueeLoopWidth(marqueeBackgroundTrackRef.current);

    applyMarqueeTransform(
      marqueeForegroundTrackRef.current,
      state.foregroundX,
      state.foregroundLoopWidth,
    );
    applyMarqueeTransform(
      marqueeBackgroundTrackRef.current,
      state.backgroundX,
      state.backgroundLoopWidth,
    );
  }, []);

  const calculateAndRender = useCallback(() => {
    cachePositions();
  }, [cachePositions]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll(".scroll-stack-card")) as HTMLElement[];

    cards.forEach((card, index) => {
      if (index < cards.length - 1) card.style.marginBottom = `${STACK_CONFIG.itemDistance}px`;
      card.style.willChange = "transform";
      card.style.transformOrigin = "top center";
    });

    const resizeObserver = new ResizeObserver(() => calculateAndRender());
    cards.forEach((card) => resizeObserver.observe(card));
    calculateAndRender();

    const initTimer = setTimeout(calculateAndRender, 100);
    window.addEventListener("resize", calculateAndRender, { passive: true });

    return () => {
      clearTimeout(initTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateAndRender);
    };
  }, [calculateAndRender]);

  useEffect(() => {
    const state = marqueeMotionRef.current;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncReducedMotion = () => {
      state.reducedMotion = mediaQuery.matches;
      if (state.reducedMotion) state.scrollBoost = 0;
    };

    const animateMarquee = (time: number) => {
      if (!state.lastTime) state.lastTime = time;

      const deltaSeconds = Math.min((time - state.lastTime) / 1000, 0.05);
      state.lastTime = time;

      const foregroundSpeed = state.reducedMotion
        ? MARQUEE_CONFIG.reducedForegroundSpeed
        : MARQUEE_CONFIG.foregroundBaseSpeed + state.scrollBoost;
      const backgroundSpeed = state.reducedMotion
        ? MARQUEE_CONFIG.reducedBackgroundSpeed
        : MARQUEE_CONFIG.backgroundBaseSpeed + state.scrollBoost * 0.45;

      state.foregroundX = wrapMarqueeValue(
        state.foregroundX - state.direction * foregroundSpeed * deltaSeconds,
        state.foregroundLoopWidth,
      );
      state.backgroundX = wrapMarqueeValue(
        state.backgroundX + state.direction * backgroundSpeed * deltaSeconds,
        state.backgroundLoopWidth,
      );
      state.scrollBoost *= Math.exp(-deltaSeconds * 3.4);

      if (state.scrollBoost < 0.1) state.scrollBoost = 0;

      applyMarqueeTransform(
        marqueeForegroundTrackRef.current,
        state.foregroundX,
        state.foregroundLoopWidth,
      );
      applyMarqueeTransform(
        marqueeBackgroundTrackRef.current,
        state.backgroundX,
        state.backgroundLoopWidth,
      );

      state.rafId = requestAnimationFrame(animateMarquee);
    };

    syncReducedMotion();
    measureMarquee();

    const foregroundTrack = marqueeForegroundTrackRef.current;
    const backgroundTrack = marqueeBackgroundTrackRef.current;
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureMarquee);

    if (foregroundTrack) resizeObserver?.observe(foregroundTrack);
    if (backgroundTrack) resizeObserver?.observe(backgroundTrack);

    window.addEventListener("resize", measureMarquee, { passive: true });
    mediaQuery.addEventListener("change", syncReducedMotion);
    state.rafId = requestAnimationFrame(animateMarquee);

    return () => {
      cancelAnimationFrame(state.rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureMarquee);
      mediaQuery.removeEventListener("change", syncReducedMotion);
      state.lastTime = 0;
    };
  }, [measureMarquee]);

  return {
    isMobile,
    stackInnerRef,
    voidContainerRef,
    marqueeForegroundTrackRef,
    marqueeBackgroundTrackRef,
    kineticWheelRef,
    threadPathRef,
    figureGroupRef,
    textAnalyzeRef,
    textDesignRef,
    textBuildRef,
    textDeliverRef,
  };
}

function getVoidProgress(scroll: number, voidStart: number, voidDistance: number) {
  if (scroll <= voidStart) return 0;
  return clamp((scroll - voidStart) / voidDistance);
}

function getScaleProgress(scroll: number, triggerStart: number, triggerEnd: number) {
  if (scroll >= triggerEnd) return 1;
  if (scroll <= triggerStart) return 0;
  return clamp((scroll - triggerStart) / (triggerEnd - triggerStart));
}

function getCardTranslateY(
  scroll: number,
  cardTop: number,
  pinStart: number,
  pinEnd: number,
  stackPositionPx: number,
  index: number,
) {
  if (scroll >= pinStart && scroll <= pinEnd) {
    return scroll - cardTop + stackPositionPx + STACK_CONFIG.itemStackDistance * index;
  }

  if (scroll > pinEnd) {
    return pinEnd - cardTop + stackPositionPx + STACK_CONFIG.itemStackDistance * index;
  }

  return 0;
}

function updateVoidContainer({
  containerHeight,
  isMobile,
  scroll,
  stackInnerRef,
  stackInnerTop,
  voidContainerRef,
  voidProgress,
}: {
  containerHeight: number;
  isMobile: boolean;
  scroll: number;
  stackInnerRef: RefObject<HTMLDivElement>;
  stackInnerTop: number;
  voidContainerRef: RefObject<HTMLDivElement>;
  voidProgress: number;
}) {
  const voidContainer = voidContainerRef.current;
  const stackInner = stackInnerRef.current;
  if (!voidContainer || !stackInner) return;

  const originY = scroll + containerHeight / 2 - stackInnerTop;
  stackInner.style.perspectiveOrigin = `50% ${originY}px`;
  stackInner.style.perspective = "1500px";

  if (voidProgress <= 0) {
    voidContainer.style.transformOrigin = "";
    voidContainer.style.transform = "";
    voidContainer.style.opacity = "1";
    voidContainer.style.visibility = "visible";
    return;
  }

  if (isMobile) {
    const fadeOutProgress = Math.min(voidProgress / 0.25, 1);
    const currentOpacity = 1 - fadeOutProgress;

    voidContainer.style.transformOrigin = `50% ${originY}px`;
    voidContainer.style.transform = "translate3d(0, 0, 0) scale(1)";
    voidContainer.style.opacity = Math.max(0, currentOpacity).toFixed(3);
    voidContainer.style.visibility = fadeOutProgress >= 1 ? "hidden" : "visible";
    return;
  }

  const easeScale = Math.pow(voidProgress, 1.5);
  const currentZ = -easeScale * 3000;
  const currentScale = 1 - easeScale;
  const currentOpacity = 1 - Math.pow(voidProgress, 2.5);

  voidContainer.style.transformOrigin = `50% ${originY}px`;
  voidContainer.style.transform = `translate3d(0, 0, ${currentZ}px) scale(${Math.max(0, currentScale).toFixed(4)})`;
  voidContainer.style.opacity = Math.max(0, currentOpacity).toFixed(3);
  voidContainer.style.visibility = voidProgress >= 1 ? "hidden" : "visible";
}

function updateMobileThread({
  figureGroupRef,
  isMobile,
  textAnalyzeRef,
  textBuildRef,
  textDeliverRef,
  textDesignRef,
  threadLenRef,
  threadPathRef,
  voidProgress,
}: {
  figureGroupRef: RefObject<SVGGElement>;
  isMobile: boolean;
  textAnalyzeRef: RefObject<SVGTextElement>;
  textBuildRef: RefObject<SVGTextElement>;
  textDeliverRef: RefObject<SVGTextElement>;
  textDesignRef: RefObject<SVGTextElement>;
  threadLenRef: MutableRefObject<number>;
  threadPathRef: RefObject<SVGPathElement>;
  voidProgress: number;
}) {
  const thread = threadPathRef.current;
  const threadLen = threadLenRef.current;
  if (!thread || threadLen <= 0 || !isMobile) return;

  const drawP = voidProgress > 0.2 ? clamp((voidProgress - 0.2) / 0.8) : 0;
  thread.style.strokeDasharray = `${threadLen}`;
  thread.style.strokeDashoffset = `${(threadLen * (1 - drawP)).toFixed(2)}`;

  animateText(textAnalyzeRef, drawP, 0.08);
  animateText(textDesignRef, drawP, 0.3);
  animateText(textBuildRef, drawP, 0.54);
  animateText(textDeliverRef, drawP, 0.76);

  if (figureGroupRef.current && voidProgress < 0.8) {
    figureGroupRef.current.style.opacity = "1";
  }
}

function updateKineticWheel({
  containerHeight,
  endElementTop,
  figureGroupRef,
  isMobile,
  kineticWheelRef,
  scroll,
  voidProgress,
}: {
  containerHeight: number;
  endElementTop: number;
  figureGroupRef: RefObject<SVGGElement>;
  isMobile: boolean;
  kineticWheelRef: RefObject<HTMLDivElement>;
  scroll: number;
  voidProgress: number;
}) {
  const kineticWheel = kineticWheelRef.current;
  if (!kineticWheel) return;

  if (scroll > endElementTop + containerHeight * 1.4) {
    kineticWheel.style.display = "none";
    kineticWheel.style.visibility = "hidden";
    return;
  }

  if (voidProgress <= 0) {
    kineticWheel.style.display = "block";
    kineticWheel.style.opacity = "0";
    kineticWheel.style.visibility = "hidden";

    if (isMobile) {
      kineticWheel.style.transformOrigin = "50% 50%";
      kineticWheel.style.transform = "translate3d(42vw, 2vh, 0) rotate(18deg) scale(0.94)";
      if (figureGroupRef.current) figureGroupRef.current.style.opacity = "1";
    } else {
      kineticWheel.style.transform = "rotate(180deg)";
    }
    return;
  }

  kineticWheel.style.display = "block";
  kineticWheel.style.visibility = "visible";

  if (isMobile) {
    const figOpacity =
      voidProgress <= 0.25
        ? 0.5 * (voidProgress / 0.25)
        : voidProgress <= 0.5
          ? 0.5 + 0.5 * ((voidProgress - 0.25) / 0.25)
          : 1;
    const travelProgress = easeOutCubic(clamp(voidProgress / 0.74));
    const translateX = lerp(42, 0, travelProgress);
    const translateY = lerp(2, 0, travelProgress);
    const rotation = lerp(18, 0, travelProgress);
    const scale = lerp(0.94, 1, travelProgress);

    kineticWheel.style.opacity = figOpacity.toFixed(3);
    kineticWheel.style.transformOrigin = "50% 50%";
    kineticWheel.style.transform = `translate3d(${translateX.toFixed(2)}vw, ${translateY.toFixed(2)}vh, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

    if (figureGroupRef.current && voidProgress >= 0.8) {
      const textFade = 1 - (voidProgress - 0.8) / 0.2;
      figureGroupRef.current.style.opacity = Math.max(0, textFade).toFixed(3);
    }
    return;
  }

  kineticWheel.style.opacity = Math.min(voidProgress * 4, 1).toFixed(3);
  kineticWheel.style.transformOrigin = "50% 100%";
  kineticWheel.style.transform = `rotate(${180 * (1 - voidProgress)}deg)`;
}

function animateText(ref: RefObject<SVGTextElement>, drawProgress: number, targetProgress: number) {
  if (!ref.current) return;

  const revealProgress = clamp((drawProgress - targetProgress + 0.08) / 0.18);
  const focusDistance = Math.abs(drawProgress - targetProgress);
  const focus = focusDistance < 0.16 ? 1 - focusDistance / 0.16 : 0;
  const easedReveal = easeOutCubic(revealProgress);
  const opacity = 0.18 + easedReveal * 0.52 + focus * 0.3;
  const scale = 0.92 + easedReveal * 0.08 + focus * 0.04;
  const translateY = (1 - easedReveal) * 24;

  ref.current.style.opacity = opacity.toFixed(2);
  ref.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
  ref.current.style.transformOrigin = "center";
  ref.current.style.transformBox = "fill-box";
  ref.current.style.filter = focus > 0.05 ? `drop-shadow(0 0 ${(focus * 14).toFixed(1)}px rgba(255,255,255,0.45))` : "";
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getMarqueeLoopWidth(track: HTMLDivElement | null) {
  if (!track) return 1;
  return Math.max(track.scrollWidth / 2, 1);
}

function wrapMarqueeValue(value: number, loopWidth: number) {
  if (loopWidth <= 1) return 0;
  return ((((value % loopWidth) + loopWidth) % loopWidth) - loopWidth);
}

function applyMarqueeTransform(track: HTMLDivElement | null, x: number, loopWidth: number) {
  if (!track) return;
  track.style.transform = `translate3d(${wrapMarqueeValue(x, loopWidth).toFixed(2)}px, 0, 0)`;
}
