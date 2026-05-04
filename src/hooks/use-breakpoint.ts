import { useEffect, useState } from "react";

export function useMaxWidth(maxWidth: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const update = () => setMatches(window.innerWidth < maxWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [maxWidth]);

  return matches;
}

export function useWindowHeight(fallback = 800) {
  const [height, setHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : fallback,
  );

  useEffect(() => {
    const update = () => setHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return height;
}
