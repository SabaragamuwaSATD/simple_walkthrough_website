export const PortfolioBackground = ({ currentSlide, activeThumbnail, isSlideTransitioning, isReveal, isDarkening }) => (
  <div className="absolute inset-0">
    <div
      key={`bg-${currentSlide.id}-${activeThumbnail}`}
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${currentSlide.thumbnails[activeThumbnail]})`,
        transform: isSlideTransitioning ? "scale(1.15)" : "scale(1.05)",
        filter: isReveal
          ? "brightness(1) blur(0px)"
          : isSlideTransitioning
          ? "brightness(0.7) blur(4px)"
          : isDarkening
          ? "brightness(0.85) blur(4px)"
          : "brightness(1) blur(4px)",
        transition:
          "filter 700ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
      }}
    />
    <div
      className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"
      style={{
        opacity: isReveal
          ? 0
          : isDarkening
          ? 0.6
          : isSlideTransitioning
          ? 0.3
          : 1,
        transition: "opacity 700ms cubic-bezier(0.4, 0.0, 0.2, 1)",
      }}
    />
    <div
      className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 transition-opacity"
      style={{
        opacity: isReveal ? 0 : isDarkening ? 1 : 1,
        transition: "opacity 700ms cubic-bezier(0.4, 0.0, 0.2, 1)",
      }}
    />
  </div>
);