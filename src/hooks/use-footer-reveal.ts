import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export function useFooterReveal() {
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerContainerRef,
    offset: ["start end", "end end"],
  });

  const footerY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  return { footerContainerRef, footerY };
}
