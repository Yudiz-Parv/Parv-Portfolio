import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { BRAND, FOOTER_COLUMNS } from "@/data/portfolio";
import type { FooterColumn as FooterColumnConfig } from "@/types/portfolio";

const FooterColumn = ({ column }: { column: FooterColumnConfig }) => (
  <motion.div variants={itemVariants} className="flex flex-col gap-1">
    <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-4 text-white/80">
      {column.title}
    </h3>
    <div className="flex flex-col gap-2">
      {column.items.map((item) => (
        <p
          key={item}
          className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide leading-relaxed text-white/60"
        >
          {item}
        </p>
      ))}
      {column.links?.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="font-sans text-xs md:text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-1 w-fit flex items-center gap-1"
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const FooterSection = () => {
  const footerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Dynamically scrubs opacity & scale using scroll progression instead of transition
  const textScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <footer ref={footerRef} className="bg-black text-white font-sans pt-12 md:pt-20 border-t border-white h-screen flex flex-col">

      <motion.div
        className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-12 shrink-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {FOOTER_COLUMNS.slice(0, 2).map((column) => (
          <FooterColumn key={column.title} column={column} />
        ))}
        <motion.div variants={itemVariants} className="flex flex-col h-full justify-between">
          <FooterColumn column={FOOTER_COLUMNS[2]} />
          <div className="mt-8 md:mt-0">
            <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest text-white">
              {BRAND.year}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="w-full flex-1 flex flex-col justify-center items-center overflow-hidden select-none pb-4"
      >
        <h1 className="font-sans font-black text-[23vw] leading-[0.8] text-white uppercase tracking-tighter flex items-start">
          {BRAND.name}
          <span className="text-xl md:text-4xl lg:text-6xl font-medium mt-[2vw] ml-1 opacity-60">
            ®
          </span>
        </h1>
      </motion.div>
    </footer>
  );
};

export default FooterSection;
