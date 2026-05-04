import { STATS } from "@/data/portfolio";
import { useCountOnVisible } from "@/hooks/use-count-on-visible";
import type { StatItem } from "@/types/portfolio";

const MagicBento = () => {
  return (
    <section className="w-full bg-black text-white py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-24">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em]">
            More About Me
          </h2>
        </div>

        {/* Strict Swiss Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-40">

          {STATS.map((item) => (
            <SwissItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SwissItem = ({ item }: { item: StatItem }) => {
  const { ref, count } = useCountOnVisible(item.value);

  return (
    <div ref={ref} className="flex flex-col items-start">
      <span className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white">
        {item.label}
      </span>

      <h3 className="mb-6 font-sans text-8xl md:text-9xl font-bold tracking-tight leading-none">
        {count.toLocaleString()}
        {item.suffix}
      </h3>

      <p className="max-w-sm font-sans text-base leading-6 text-white/65">
        {item.description}
      </p>
    </div>
  );
};

export default MagicBento;
