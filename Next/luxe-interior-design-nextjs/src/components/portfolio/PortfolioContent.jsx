import { useRouter } from "next/navigation";

export const PortfolioContent = ({
  currentSlide,
  activeSlide,
  slides,
  activeThumbnail,
  isSlideTransitioning,
  handleThumbnailClick,
  progress,
  isInitialThumbnailPause,
  router,
}) => (
  <div className="w-full lg:w-5/12 text-white space-y-6 pr-0 lg:pr-8 pt-20 lg:pt-0">
    {/* Slide Counter */}
    <div
      className="flex items-center gap-4 text-sm font-medium tracking-wider mb-2"
      key={`counter-${activeSlide}`}
      style={{
        animation: isSlideTransitioning
          ? "fadeOut 0.4s ease-in"
          : "fadeIn 1s ease-out 0.1s both",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-white font-bold">
          {String(activeSlide + 1).padStart(2, "0")}
        </span>
        <div className="w-12 h-px bg-white/50" />
        <span className="text-gray-400">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>

    {/* Title */}
    <h1
      className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight text-white drop-shadow-sm"
      key={`title-${activeSlide}`}
      style={{
        animation: isSlideTransitioning
          ? "slideOutRight 0.6s ease-in"
          : "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1)",
        textShadow: "0 4px 20px rgba(0,0,0,0.7)",
      }}
    >
      {currentSlide.title}
    </h1>

    {/* Subtitle */}
    <div
      className="text-white text-base font-medium tracking-wide"
      key={`subtitle-${activeSlide}`}
      style={{
        animation: isSlideTransitioning
          ? "slideOutRight 0.6s ease-in"
          : "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
        textShadow: "0 2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {currentSlide.subtitle}
    </div>

    {/* Description */}
    <p
      className="text-white/90 text-base lg:text-lg leading-relaxed max-w-lg"
      key={`desc-${activeSlide}`}
      style={{
        animation: isSlideTransitioning
          ? "slideOutRight 0.6s ease-in"
          : "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
        textShadow: "0 2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {currentSlide.description}
    </p>

    {/* CTA Button */}
    <div className="flex gap-4 mt-6">
      <button
        onClick={() => router.push("/products")}
        className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:shadow-red-500/50 hover:scale-[1.02]"
        style={{
          animation: isSlideTransitioning
            ? "slideOutRight 0.6s ease-in"
            : "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
        }}
      >
        <span className="relative z-10 font-semibold tracking-wide text-white">
          Explore Now →
        </span>
        <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </div>

    {/* Progress Bar */}
    <div
      className="flex items-center gap-2 pt-6"
      style={{
        opacity: isSlideTransitioning ? 0 : 1,
        transition: "opacity 0.5s ease-out",
      }}
    >
      {currentSlide.thumbnails.map((_, idx) => (
        <button
          key={`progress-bar-${activeSlide}-${idx}`}
          type="button"
          className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80"
          aria-label={`Go to thumbnail ${idx + 1}`}
          tabIndex={0}
          onClick={() => handleThumbnailClick(idx)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleThumbnailClick(idx);
            }
          }}
          style={{ padding: 0, border: "none", background: "none" }}
        >
          {(() => {
            let barWidth;
            if (idx === activeThumbnail) {
              barWidth = isInitialThumbnailPause ? "0%" : `${progress}%`;
            } else if (idx < activeThumbnail) {
              barWidth = "100%";
            } else {
              barWidth = "0%";
            }
            return (
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: barWidth }}
              />
            );
          })()}
        </button>
      ))}
    </div>
  </div>
);