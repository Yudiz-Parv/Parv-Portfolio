import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { BRAND, FOOTER_COLUMNS, SOCIAL_LINKS } from "@/data/portfolio";
import type { FooterColumn as FooterColumnConfig } from "@/types/portfolio";

const footerBlobs = [
  {
    className: "ball",
  },
  {
    className: "ball ball2",
  },
  {
    className: "ball ball3",
  },
];

const linkedInHref = SOCIAL_LINKS.find(({ label }) => label === "LinkedIn")?.href ?? "#";

const FooterColumn = ({ column }: { column: FooterColumnConfig }) => (
  <motion.div variants={itemVariants} className="footer-column flex flex-col gap-1">
    <h3 className="footer-column-title font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/80">
      <span>{column.title}</span>
    </h3>
    <div className="footer-column-body flex flex-col gap-1.5 md:gap-2">
      {column.items.map((item) => (
        <p
          key={item}
          className="footer-column-item font-sans text-xs md:text-sm font-medium uppercase tracking-wide leading-relaxed text-white/60"
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
          className="footer-link font-sans text-xs md:text-sm font-semibold uppercase tracking-wide w-fit flex items-center gap-1 text-white transition-colors duration-300 hover:text-[#f08d62]"
        >
          <span>{link.label}</span>
          <span className="footer-link-arrow" aria-hidden="true">↗</span>
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
    <footer
      ref={footerRef}
      className="footer-bg text-white font-sans pt-24 sm:pt-20 md:pt-20 border-t border-white/20 h-screen flex flex-col"
    >
      {footerBlobs.map((blob) => (
        <div key={blob.className} className={blob.className} />
      ))}
      <div className="footer-glow" />

      <motion.div
        className="footer-top-grid relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 sm:gap-y-8 md:gap-x-12 shrink-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {FOOTER_COLUMNS.slice(0, 2).map((column) => (
          <FooterColumn key={column.title} column={column} />
        ))}
        <motion.div variants={itemVariants} className="col-span-1 min-[420px]:col-span-2 md:col-span-1 flex flex-col h-full justify-between">
          <FooterColumn column={FOOTER_COLUMNS[2]} />
        </motion.div>
      </motion.div>

      <motion.div
        className="footer-center relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full flex-1 flex flex-col items-center justify-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p
          variants={itemVariants}
          className="font-sans text-[0.66rem] md:text-xs font-bold uppercase tracking-[0.28em] text-[#f08d62]/80"
        >
          Open to collaborate
        </motion.p>
        <motion.h2
          variants={itemVariants}
          className="mt-3 font-sans text-[1.85rem] min-[380px]:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.88] md:leading-[0.9] tracking-normal text-white"
        >
          Let's build
          <br />
          something sharp
        </motion.h2>
        <motion.div variants={itemVariants} className="footer-cta-row mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${BRAND.email}`} className="footer-cta-button footer-cta-button-primary">
            Email me <span aria-hidden="true">↗</span>
          </a>
          <a href={linkedInHref} target="_blank" rel="noopener noreferrer" className="footer-cta-button">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="footer-text-shell"
        aria-hidden="true"
      >
        <picture className="footer-signature-picture">
          <source media="(max-width: 767px)" srcSet="/Parv.png" />
          <img
            src="/parvs.png"
            alt=""
            className="footer-signature-image"
            draggable={false}
          />
        </picture>
      </motion.div>
    </footer>
  );
};

export default FooterSection;
