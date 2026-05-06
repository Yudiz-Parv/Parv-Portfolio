const WorkMarquee = () => (
  <div className="w-full h-[25vh] md:h-[25vh] lg:h-[70vh] border-b border-white/20 overflow-hidden flex items-center relative z-10 bg-black">
    <div className="marquee-selected-works">
      <div className="marquee-selected-works__track">
        {[0, 1, 2, 3].map((blockIndex) => (
          <div
            key={blockIndex}
            className="marquee-selected-works__segment"
            aria-hidden={blockIndex > 0 ? "true" : undefined}
          >
            <span className="marquee-selected-works__text">Selected Works</span>
            <span className="marquee-selected-works__dash"> - </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WorkMarquee;
