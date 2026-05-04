import { BRAND } from "@/data/portfolio";

const BrandLogo = () => (
  <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 mix-blend-difference">
    <h1 className="font-sans font-black text-2xl md:text-4xl tracking-tighter text-white flex items-start">
      {BRAND.name}
      <span className="text-xs md:text-lg font-medium ml-1 -mt-1 md:-mt-2">®</span>
    </h1>
  </div>
);

export default BrandLogo;
