import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springConfig = { damping: 20, stiffness: 100, mass: 0.8 };

const CursorFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => {
      mouseX.set(event.clientX - 12);
      mouseY.set(event.clientY - 12);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 bg-gray-400/50 rounded-full pointer-events-none z-[9999] hidden lg:block backdrop-blur-[1px]"
      style={{ x, y }}
    />
  );
};

export default CursorFollower;
