import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLenis } from "lenis/react";

import { BRAND, NAV_ITEMS, SOCIAL_LINKS } from "@/data/portfolio";

const ease = [0.76, 0, 0.24, 1] as [number, number, number, number];
const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const overlayVariants: Variants = {
  closed: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 1.0, ease },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.0, ease },
  },
};

const itemVariants: Variants = {
  closed: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.8, ease },
  },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.0,
      delay: 0.4 + i * 0.1,
      ease: easeOut,
    },
  }),
};

const socialVariants: Variants = {
  closed: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.6, ease },
  },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6 + i * 0.08,
      ease: "easeOut",
    },
  }),
};

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const wasLenisStopped = lenis?.isStopped ?? false;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscrollBehavior = html.style.overscrollBehavior;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousBodyTouchAction = body.style.touchAction;

    lenis?.stop();
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.touchAction = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscrollBehavior;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousBodyTouchAction;
      window.scrollTo(0, scrollY);
      lenis?.scrollTo(scrollY, { immediate: true, force: true });
      if (!wasLenisStopped) {
        lenis?.start();
      }
    };
  }, [lenis, open]);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <div
        className="fixed top-6 right-6 md:top-8 md:right-10 z-[200]"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-center justify-center gap-[5px] w-14 h-14 md:w-16 md:h-16 rounded-full bg-black transition-colors duration-300 relative"
          style={{
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.6)",
            WebkitFontSmoothing: "antialiased",
          }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {/* Top Line */}
          <motion.span
            animate={open ? { rotate: 45, y: 6.5, scaleX: 0.8 } : { rotate: 0, y: 0, scaleX: 1 }}
            transition={{ duration: 0.6, ease }}
            className="absolute block h-[1.5px] w-[22px] bg-white origin-center"
            style={{ top: "35%" }}
          />
          {/* Middle Line */}
          <motion.span
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, ease }}
            className="absolute block h-[1.5px] w-[22px] bg-white origin-center"
            style={{ top: "50%", marginTop: "-0.75px" }}
          />
          {/* Bottom Line */}
          <motion.span
            animate={open ? { rotate: -45, y: -6.5, scaleX: 0.8 } : { rotate: 0, y: 0, scaleX: 1 }}
            transition={{ duration: 0.6, ease }}
            className="absolute block h-[1.5px] w-[22px] bg-white origin-center"
            style={{ bottom: "35%" }}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[100] bg-[#f7f5ef] flex flex-col justify-between px-8 md:px-16 pt-16 pb-10 md:pt-20 md:pb-14"
          >
            {/* Socials row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 pt-10 md:pt-0">
              <p className="text-sm text-black/55 uppercase tracking-widest font-mono mr-2">
                Socials
              </p>
              {SOCIAL_LINKS.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  custom={i}
                  variants={socialVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="text-base md:text-lg font-medium text-black hover:opacity-45"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-0">
              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  className="overflow-hidden border-b border-black/20 py-3 md:py-4"
                >
                  <motion.a
                    href={item.href}
                    onClick={handleNavClick}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="flex items-baseline justify-between group cursor-pointer"
                  >
                    <span className="text-5xl md:text-7xl lg:text-8xl font-semibold text-black uppercase tracking-tight leading-none group-hover:translate-x-3 transition-transform duration-300 ease-out">
                      {item.label}
                    </span>
                    <span className="text-xs text-black/45 font-mono tracking-widest self-start mt-2">
                      {item.number}
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>

            {/* Bottom copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.8 } }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              className="text-xs text-black/30 font-mono tracking-widest mt-8 md:mt-0 md:self-end"
            >
              © {BRAND.year} {BRAND.name}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
