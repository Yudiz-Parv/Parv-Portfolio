import { motion } from "framer-motion";

import CursorFollower from "@/components/effects/CursorFollower";
import Navigation from "@/components/Navigation";
import AboutSection from "@/components/sections/about/AboutSection";
import VectorBridgeSection from "@/components/sections/bridge/VectorBridgeSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import FooterSection from "@/components/sections/footer/FooterSection";
import BrandLogo from "@/components/sections/hero/BrandLogo";
import HeroSection from "@/components/sections/hero/HeroSection";
import StatsSection from "@/components/sections/stats/StatsSection";
import SelectedWorksSection from "@/components/sections/work/SelectedWorksSection";
import { useFooterReveal } from "@/hooks/use-footer-reveal";

const Index = () => {
  const { footerContainerRef, footerY } = useFooterReveal();

  return (
    <div className="min-h-screen relative bg-black selection:bg-white selection:text-black">
      <BrandLogo />
      <CursorFollower />
      <Navigation />

      <div className="fixed inset-0 z-0 bg-white text-black">
        <AboutSection />
      </div>

      <HeroSection />

      <div className="relative z-20 w-full bg-transparent">
        <div id="about" className="h-screen w-full pointer-events-none" />

        <div id="work" className="bg-black text-white relative z-20">
          <SelectedWorksSection />
        </div>

        <div className="bg-white text-black relative z-20">
          <VectorBridgeSection />
        </div>

        <div className="bg-black text-white relative z-20">
          <StatsSection />
        </div>

        <div id="contact" className="relative z-20 bg-white text-black">
          <ContactSection />
        </div>
      </div>

      <div ref={footerContainerRef} className="relative z-0 h-screen w-full overflow-hidden bg-black text-white">
        <motion.div style={{ y: footerY }} className="h-full w-full">
          <FooterSection />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
