import React, { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    title: "CBL",
    subtitle: "Modern Architecture",
    description:
      "Lorem ipsum dolor sit amet consectetur. Sem sed ut est augue diam vulputate. Sit quam morbi egestas in sagittis adipiscing arcu.",
    mainImage: "/images/CLB1.jpg",
    thumbnails: [
      "/images/CLB1.jpg",
      "/images/CLB2.jpg",
      "/images/CLB3.jpg",
      "/images/CLB4.jpg",
    ],
  },
  {
    id: 2,
    title: "Viana",
    subtitle: "Luxury Interiors",
    description:
      "Lorem ipsum dolor sit amet consectetur. Sem sed ut est augue diam vulputate. Sit quam morbi egestas in sagittis adipiscing arcu.",
    mainImage: "/images/Viana.jpg",
    thumbnails: [
      "/images/Viana.jpg",
      "/images/Viana2.jpg",
      "/images/Viana3.jpg",
      "/images/Viana4.jpg",
    ],
  },
  {
    id: 3,
    title: "nature's Secrets",
    subtitle: "Urban Design",
    description:
      "Lorem ipsum dolor sit amet consectetur. Sem sed ut est augue diam vulputate. Sit quam morbi egestas in sagittis adipiscing arcu.",
    mainImage: "/images/NS1.jpg",
    thumbnails: [
      "/images/NS1.jpg",
      "/images/NS2.jpg",
      "/images/NS3.jpg",
      "/images/NS4.jpg",
    ],
  },
  {
    id: 4,
    title: "SEBSA",
    subtitle: "Office Space",
    description:
      "Lorem ipsum dolor sit amet consectetur. Sem sed ut est augue diam vulputate. Sit quam morbi egestas in sagittis adipiscing arcu.",
    mainImage: "/images/SEBSA1.jpg",
    thumbnails: [
      "/images/SEBSA1.jpg",
      "/images/SEBSA2.jpg",
      "/images/SEBSA3.jpg",
      "/images/SEBSA4.jpg",
    ],
  },
];

export default function AdvancedSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(false);
  const sliderRef = useRef(null);
  const progressInterval = useRef(null);

  // Auto-play with progress
  useEffect(() => {
    if (!isDragging) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 20);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [activeThumbnail, activeSlide, isDragging]);

  const handleNext = () => {
    const isLastThumbnail =
      activeThumbnail === slides[activeSlide].thumbnails.length - 1;

    if (isLastThumbnail) {
      // Trigger big slide transition
      setIsSlideTransitioning(true);

      setTimeout(() => {
        const nextSlide = (activeSlide + 1) % slides.length;
        setActiveSlide(nextSlide);
        setActiveThumbnail(0);

        setTimeout(() => {
          setIsSlideTransitioning(false);
        }, 100);
      }, 1000);
    } else {
      setActiveThumbnail(activeThumbnail + 1);
    }
    setProgress(0);
  };

  const handlePrevious = () => {
    if (activeThumbnail > 0) {
      setActiveThumbnail(activeThumbnail - 1);
      setProgress(0);
    } else if (activeSlide > 0) {
      setIsSlideTransitioning(true);

      setTimeout(() => {
        setActiveSlide(activeSlide - 1);
        setActiveThumbnail(slides[activeSlide - 1].thumbnails.length - 1);
        setProgress(0);

        setTimeout(() => {
          setIsSlideTransitioning(false);
        }, 100);
      }, 1000);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveThumbnail(index);
    setProgress(0);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
    setCurrentX(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.type === "mousemove" ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const currentSlide = slides[activeSlide];
  const dragOffset = isDragging ? (currentX - startX) / 10 : 0;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          key={`bg-${activeSlide}-${activeThumbnail}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentSlide.thumbnails[activeThumbnail]})`,
            transform: isSlideTransitioning ? "scale(1.15)" : "scale(1.05)",
            filter: isSlideTransitioning
              ? "blur(10px) brightness(0.7)"
              : "blur(0px) brightness(1)",
            transition: "all 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"
          style={{
            opacity: isSlideTransitioning ? 0.3 : 1,
            transition: "opacity 1s ease-out",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 transition-opacity duration-1000" />
      </div>

      {/* Transition Overlay */}
      {isSlideTransitioning && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.8) 100%)",
            animation: "fadeOverlay 1s ease-in-out",
          }}
        />
      )}

      {/* Content Container */}
      <div
        className="relative z-10 flex items-center h-full max-w-[1800px] mx-auto px-12 lg:px-20"
        style={{
          opacity: isSlideTransitioning ? 0 : 1,
          transform: isSlideTransitioning ? "scale(0.95)" : "scale(1)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Left Content */}
        <div className="w-full lg:w-5/12 text-white space-y-6 pr-8">
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
              <div className="w-12 h-px bg-gradient-to-r from-white to-transparent" />
              <span className="text-white/50">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Title with Animation */}
          <h1
            className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight text-white drop-shadow-2xl"
            key={`title-${activeSlide}`}
            style={{
              animation: isSlideTransitioning
                ? "slideOutRight 0.6s ease-in"
                : "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1)",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          <div
            className="text-white/90 text-base font-medium tracking-wide"
            key={`subtitle-${activeSlide}`}
            style={{
              animation: isSlideTransitioning
                ? "fadeOut 0.4s ease-in"
                : "fadeIn 1s ease-out 0.15s both",
            }}
          >
            {currentSlide.subtitle}
          </div>

          {/* Description */}
          <p
            className="text-white/80 text-base lg:text-lg leading-relaxed max-w-lg"
            key={`desc-${activeSlide}`}
            style={{
              animation: isSlideTransitioning
                ? "fadeOut 0.4s ease-in"
                : "fadeIn 1s ease-out 0.3s both",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {currentSlide.description}
          </p>

          {/* CTA Button */}
          <button
            className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 mt-4"
            style={{
              animation: isSlideTransitioning
                ? "fadeOut 0.4s ease-in"
                : "fadeIn 1s ease-out 0.45s both",
            }}
          >
            <span className="relative z-10 font-semibold tracking-wide text-white">
              Explore Now
            </span>
            <div className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

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
                className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
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
                    barWidth = `${progress}%`;
                  } else if (idx < activeThumbnail) {
                    barWidth = "100%";
                  } else {
                    barWidth = "0%";
                  }
                  return (
                    <div
                      className="h-full bg-white transition-all duration-500 ease-out"
                      style={{
                        width: barWidth,
                      }}
                    />
                  );
                })()}
              </button>
            ))}
          </div>
        </div>

        {/* Right Slider - Modern Stacked Cards */}
        <div
          className="hidden lg:flex w-7/12 justify-center items-center pl-16"
          style={{
            opacity: isSlideTransitioning ? 0.5 : 1,
            transition: "opacity 0.8s ease-out",
          }}
        >
          <div className="relative w-full h-[600px]">
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-500 ease-out hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-500 ease-out hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Cards Stack */}
            <div
              className="relative w-full h-full flex items-center justify-center perspective-3d"
              aria-label="Thumbnails slider"
              role="listbox"
              tabIndex={0}
              style={{
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  handlePrevious();
                } else if (e.key === "ArrowRight") {
                  handleNext();
                }
              }}
            >
              {currentSlide.thumbnails.map((thumb, index) => {
                const offset = index - activeThumbnail;
                const isActive = index === activeThumbnail;
                const absOffset = Math.abs(offset);

                // Extracted ternary operations
                const translateZValue = isActive ? 0 : -absOffset * 100;
                const scaleValue = isActive ? 1 : 1 - absOffset * 0.15;
                const opacityValue = isSlideTransitioning
                  ? 0
                  : absOffset > 1
                  ? 0
                  : 1;
                const pointerEventsValue = absOffset > 1 ? "none" : "auto";

                // Keyboard accessibility handler
                const handleKeyDown = (e) => {
                  if (!isActive && (e.key === "Enter" || e.key === " ")) {
                    handleThumbnailClick(index);
                  }
                };

                return (
                  <div
                    key={`card-${activeSlide}-${index}`}
                    role={!isActive ? "button" : undefined}
                    tabIndex={!isActive ? 0 : undefined}
                    aria-pressed={isActive}
                    onClick={() => !isActive && handleThumbnailClick(index)}
                    onKeyDown={handleKeyDown}
                    className="absolute cursor-pointer w-[400px] h-[550px]"
                    style={{
                      transform: isSlideTransitioning
                        ? `translateX(${
                            offset * 120
                          }px) translateZ(-200px) scale(0.8) rotateY(${
                            offset * -8 + 30
                          }deg)`
                        : `
                          translateX(${offset * 120 + dragOffset}px)
                          translateZ(${translateZValue}px)
                          scale(${scaleValue})
                          rotateY(${offset * -8}deg)
                        `,
                      zIndex: 10 - absOffset,
                      opacity: opacityValue,
                      pointerEvents: pointerEventsValue,
                      transition: isDragging
                        ? "none"
                        : "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Border */}
                    <div
                      className={`absolute inset-0 rounded-3xl transition-all duration-1000 ${
                        isActive ? "bg-white p-[4px]" : "bg-white/30 p-[2px]"
                      }`}
                    >
                      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                        {/* Image */}
                        <img
                          src={thumb}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                          draggable="false"
                          style={{
                            transform: isActive ? "scale(1)" : "scale(1.1)",
                            transition:
                              "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div
                          className={`absolute inset-0 transition-all duration-1000 ${
                            isActive
                              ? "bg-gradient-to-t from-black/50 via-transparent to-transparent"
                              : "bg-black/40"
                          }`}
                        />

                        {/* Active Card Content */}
                        {isActive && (
                          <div
                            className="absolute bottom-0 left-0 right-0 p-6 text-white transition-opacity duration-700"
                            style={{
                              animation: "fadeIn 0.8s ease-out 0.3s both",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-sm font-medium">
                                  Active
                                </span>
                              </div>
                              <span className="text-sm font-medium text-white/80">
                                {index + 1} / {currentSlide.thumbnails.length}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Shine Effect */}
                        {isActive && (
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                            style={{
                              animation: "shine 5s ease-in-out infinite",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {/* Card Shadow */}
                    <div
                      className={`absolute inset-0 -z-10 rounded-3xl blur-2xl transition-all duration-1000 ${
                        isActive ? "bg-white/30" : "bg-black/60"
                      }`}
                      style={{
                        transform: "translateY(20px)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Slide Navigation */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => {
              if (index !== activeSlide) {
                setIsSlideTransitioning(true);
                setTimeout(() => {
                  setActiveSlide(index);
                  setActiveThumbnail(0);
                  setProgress(0);
                  setTimeout(() => {
                    setIsSlideTransitioning(false);
                  }, 100);
                }, 1000);
              }
            }}
            className="group relative"
          >
            <div
              className={`transition-all duration-500 ease-out rounded-full ${
                index === activeSlide
                  ? "w-10 h-3 bg-white"
                  : "w-3 h-3 bg-white/40 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(60px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @keyframes fadeOverlay {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .perspective-3d {
          perspective: 2000px;
          transform-style: preserve-3d;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 1024px) {
          .perspective-3d {
            perspective: 1000px;
          }
        }
      `}</style>
    </div>
  );
}
