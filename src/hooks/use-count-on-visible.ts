import { useEffect, useRef, useState } from "react";

export function useCountOnVisible(targetValue: number, duration = 1200, enabled = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled || hasAnimated.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        if (!Number.isFinite(targetValue)) {
          setCount(targetValue);
          return;
        }

        const startTime = performance.now();

        const update = (time: number) => {
          const progress = Math.min((time - startTime) / duration, 1);
          setCount(Math.floor(progress * targetValue));

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        };

        requestAnimationFrame(update);
      },
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [duration, enabled, targetValue]);

  return { ref, count };
}
