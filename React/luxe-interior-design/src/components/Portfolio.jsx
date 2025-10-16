import React, { useState, useEffect, useRef } from "react";

const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

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
    title: "Nature's Secrets",
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

export default function App() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(false);
  const [isInitialThumbnailPause, setIsInitialThumbnailPause] = useState(false);
  const progressInterval = useRef(null);

  const [isReveal, setIsReveal] = useState(false);
  const [isDarkening, setIsDarkening] = useState(false);
  const revealTimer = useRef(null);

  const isHoveringActiveCard = useRef(false);
  const wheelAccumX = useRef(0);
  const wheelAccumY = useRef(0);
  const isWheelLocked = useRef(false);
  const prevBodyOverflow = useRef("");
  const wheelLockTimeout = useRef(null); // NEW: Track the wheel lock timeout

  const lockPageScroll = () => {
    if (typeof document === "undefined") return;
    if (!prevBodyOverflow.current) {
      prevBodyOverflow.current = document.body.style.overflow || "";
    }
    document.body.style.overflow = "hidden";
  };

  const unlockPageScroll = () => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = prevBodyOverflow.current || "";
    prevBodyOverflow.current = "";
  };

  // UPDATED: central unlock with wheel lock timeout clearance
  const releaseHoverLock = () => {
    isHoveringActiveCard.current = false;
    wheelAccumX.current = 0;
    wheelAccumY.current = 0;
    isWheelLocked.current = false;

    // NEW: Clear the wheel lock timeout
    if (wheelLockTimeout.current) {
      clearTimeout(wheelLockTimeout.current);
      wheelLockTimeout.current = null;
    }

    unlockPageScroll();
  };

  useEffect(() => {
    return () => {
      unlockPageScroll();
      // NEW: Clear timeout on unmount
      if (wheelLockTimeout.current) {
        clearTimeout(wheelLockTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSlideTransitioning || isReveal || isDarkening) {
      if (isHoveringActiveCard.current) releaseHoverLock();
    }
  }, [isSlideTransitioning, isReveal, isDarkening]);

  const shouldIgnoreWheel = () =>
    !isHoveringActiveCard.current ||
    isSlideTransitioning ||
    isDragging ||
    isReveal ||
    isDarkening ||
    isWheelLocked.current;

  const getWheelIntent = () => {
    const ax = Math.abs(wheelAccumX.current);
    const ay = Math.abs(wheelAccumY.current);
    const threshold = 50;
    if (ax > ay && ax > threshold) return "horizontal";
    if (ay >= ax && ay > threshold) return "vertical";
    return null;
  };

  const handleThumbnailNavigation = (direction) => {
    const isLast =
      activeThumbnail === slides[activeSlide].thumbnails.length - 1;
    if (direction === "next") {
      if (activeThumbnail < slides[activeSlide].thumbnails.length - 1) {
        setActiveThumbnail((p) => p + 1);
      } else {
        handleNext();
      }
    } else if (direction === "prev") {
      if (activeThumbnail > 0) setActiveThumbnail((p) => p - 1);
      else handlePrevious();
    }
    setProgress(0);
  };

  const handleActiveCardWheel = (e) => {
    if (shouldIgnoreWheel()) return;

    wheelAccumX.current += e.deltaX;
    wheelAccumY.current += e.deltaY;

    const intent = getWheelIntent();
    if (!intent) return;

    if (intent === "horizontal") {
      if (wheelAccumX.current > 0) {
        handleThumbnailNavigation("next");
      } else {
        handleThumbnailNavigation("prev");
      }
    } else if (intent === "vertical") {
      if (wheelAccumY.current > 0) {
        handleThumbnailNavigation("next");
      } else {
        handleThumbnailNavigation("prev");
      }
    }

    isWheelLocked.current = true;
    wheelAccumX.current = 0;
    wheelAccumY.current = 0;

    // UPDATED: Clear any existing timeout and create new one
    if (wheelLockTimeout.current) {
      clearTimeout(wheelLockTimeout.current);
    }

    wheelLockTimeout.current = setTimeout(() => {
      isWheelLocked.current = false;
      wheelLockTimeout.current = null;
    }, 100);
  };

  const handleNext = () => {
    const currentSlide = slides[activeSlide];
    const isLastThumbnail =
      activeThumbnail === currentSlide.thumbnails.length - 1;

    if (isLastThumbnail) {
      setIsSlideTransitioning(true);
      setIsInitialThumbnailPause(true);

      setTimeout(() => {
        const nextSlide = (activeSlide + 1) % slides.length;

        setActiveSlide(nextSlide);
        setActiveThumbnail(0);
        setIsSlideTransitioning(false);

        setTimeout(() => {
          setIsInitialThumbnailPause(false);
          setProgress(0);
        }, 1000);
      }, 1000);
    } else {
      setActiveThumbnail(activeThumbnail + 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    if (!isDragging && !isInitialThumbnailPause) {
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
  }, [activeThumbnail, activeSlide, isDragging, isInitialThumbnailPause]);

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
    // Prevent default touch behavior (like vertical scrolling)
    if (e.type === "touchstart") {
      // We let the 'touch-action: pan-y' CSS property handle this
    }

    setIsDragging(true);
    setIsInitialThumbnailPause(true);
    setStartX(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
    setCurrentX(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    // Prevent default browser behavior (e.g. rubber-banding or navigation gestures)
    if (e.type === "touchmove") {
      e.preventDefault();
    }
    setCurrentX(e.type === "mousemove" ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrevious();
      } else {
        const isLastThumbnail =
          activeThumbnail === slides[activeSlide].thumbnails.length - 1;
        if (!isLastThumbnail) {
          setActiveThumbnail((prev) => prev + 1);
          setProgress(0);
        } else {
          handleNext();
        }
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
    setIsInitialThumbnailPause(false);
  };

  useEffect(() => {
    clearTimeout(revealTimer.current);
    if (!isSlideTransitioning && activeThumbnail === 0) {
      setIsReveal(true);
      setIsDarkening(false);
      setIsInitialThumbnailPause(true);

      revealTimer.current = setTimeout(() => {
        setIsReveal(false);
        setIsDarkening(true);
        revealTimer.current = setTimeout(() => {
          setIsDarkening(false);
          setIsInitialThumbnailPause(false);
        }, 700);
      }, 3000);
    } else {
      setIsReveal(false);
      setIsDarkening(false);
    }
    return () => clearTimeout(revealTimer.current);
  }, [activeSlide, activeThumbnail, isSlideTransitioning]);

  const currentSlide = slides[activeSlide];
  const dragOffset = isDragging ? (currentX - startX) / 10 : 0;

  return (
    <div
      className="relative bg-white"
      style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif" }}
    >
      {/* Portfolio Slider */}
      <div
        className="relative w-full h-screen overflow-hidden bg-white"
        style={{ overscrollBehavior: "none" }} // prevent scroll chaining while hovered
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            key={`bg-${activeSlide}-${activeThumbnail}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              // backgroundImage: `url(${currentSlide.thumbnails[activeThumbnail]}), url(https://placehold.co/1920x1080/000000/cccccc?text=Architecture)`,
              backgroundImage: `url(${currentSlide.thumbnails[activeThumbnail]})`,
              transform: isSlideTransitioning ? "scale(1.15)" : "scale(1.05)",
              // Clean -> Darkening -> Final
              filter: isReveal
                ? "brightness(1) blur(0px)"
                : isSlideTransitioning
                ? "brightness(0.7) blur(4px)"
                : isDarkening
                ? "brightness(0.85) blur(4px)" // ramps from clean to dim/blur
                : "brightness(1) blur(4px)",
              // faster filter ramp during darkening; keep smooth transform
              transition:
                "filter 700ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"
            style={{
              // overlays fade in during darkening
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

        {/* Transition Overlay (unchanged) */}
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
          className="relative z-10 flex items-center h-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20"
          role="group"
          style={{
            // keep content hidden during reveal and darkening
            opacity: isSlideTransitioning || isReveal || isDarkening ? 0 : 1,
            transform: isSlideTransitioning ? "scale(0.95)" : "scale(1)",
            transition:
              "opacity 400ms ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            touchAction: "pan-y",
            pointerEvents:
              isSlideTransitioning || isReveal || isDarkening ? "none" : "auto",
          }}
          // --- DRAG HANDLERS MOVED HERE FOR MOBILE RESPONSIVENESS ---
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
          {/* Left Content */}
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

            {/* Title with Animation */}
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

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate("/products?scrollToHeader=true")}
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
                      // Pause the progress bar accumulation during the initial pause
                      barWidth = isInitialThumbnailPause
                        ? "0%"
                        : `${progress}%`;
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

          {/* Right Slider - Modern Stacked Cards (Hidden on mobile) */}
          <div
            className="hidden lg:flex w-7/12 justify-center items-center pl-16"
            style={{
              opacity: isSlideTransitioning ? 0.5 : 1,
              transition: "opacity 0.8s ease-out",
            }}
          >
            <div className="relative w-full h-[600px]">
              {/* Navigation Arrows (Visible only on desktop) */}
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-500 ease-out hover:scale-110 shadow-lg"
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
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-500 ease-out hover:scale-110 shadow-lg"
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
                // Drag handlers removed from here and moved to parent Content Container
              >
                {currentSlide.thumbnails.map((thumb, index) => {
                  const isActive = index === activeThumbnail;
                  // FIX: define offset and absOffset used below
                  const offset = index - activeThumbnail;
                  const absOffset = Math.abs(offset);

                  // Calculate subtle Z-rotation based on drag
                  const rotationZ = isDragging ? (currentX - startX) / 100 : 0;

                  // Extracted ternary operations
                  const translateZValue = isActive ? 0 : -absOffset * 100;
                  const scaleValue = isActive ? 1 : 1 - absOffset * 0.15;
                  const opacityValue = isSlideTransitioning
                    ? 0
                    : absOffset > 2 // Show up to 2 cards behind
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
                      // Wheel + hover tracking only on active card
                      onMouseEnter={
                        isActive
                          ? () => {
                              isHoveringActiveCard.current = true;
                              lockPageScroll();
                            }
                          : undefined
                      }
                      onMouseLeave={
                        isActive
                          ? () => {
                              releaseHoverLock(); // immediate unlock on leave
                            }
                          : undefined
                      }
                      onWheel={isActive ? handleActiveCardWheel : undefined}
                      className="absolute cursor-pointer w-[400px] h-[550px] transform-gpu"
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
                            rotateZ(${rotationZ}deg) /* ENHANCEMENT: subtle tilt during drag */
                          `,
                        zIndex: 10 - absOffset,
                        opacity: opacityValue,
                        pointerEvents: pointerEventsValue,
                        transition: isDragging
                          ? "none"
                          : "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        overscrollBehavior: "contain", // reduce scroll chaining
                      }}
                    >
                      {/* Border */}
                      <div
                        className={`absolute inset-0 rounded-3xl transition-all duration-1000 shadow-2xl ${
                          isActive
                            ? "bg-white p-[4px] animate-glowPulse" // Active card glow
                            : "bg-white/30 p-[2px]"
                        }`}
                      >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                          {/* Image */}
                          <img
                            src={thumb}
                            alt={`View ${index + 1} of ${currentSlide.title}`}
                            className="w-full h-full object-cover"
                            draggable="false"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/400x550/333333/ffffff?text=Image+Missing";
                            }}
                            style={{
                              transform: isActive ? "scale(1)" : "scale(1.1)",
                              transition:
                                "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          />

                          {/* Gradient Overlay - KEEP ONLY ONE */}
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
                                animation: "fadeInUp 0.8s ease-out 0.3s both",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-sm font-medium uppercase tracking-wider">
                                    Active View
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
                        className={`absolute inset-0 -z-10 rounded-3xl transition-all duration-1000 ${
                          isActive
                            ? "bg-black/80 shadow-2xl"
                            : "bg-black/60 shadow-xl"
                        }`}
                        style={{
                          transform: "translateY(20px) scale(0.95)",
                          filter: isActive ? "blur(20px)" : "blur(10px)",
                          opacity: isActive ? 0.7 : 0.5,
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
        <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => {
                if (index !== activeSlide) {
                  setIsSlideTransitioning(true);
                  setIsInitialThumbnailPause(true);

                  setTimeout(() => {
                    setActiveSlide(index);
                    setActiveThumbnail(0);

                    setIsSlideTransitioning(false);

                    setTimeout(() => {
                      setIsInitialThumbnailPause(false);
                      setProgress(0);
                    }, 1000);
                  }, 1000);
                }
              }}
              className="group relative"
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            >
              <div
                className={`transition-all duration-500 ease-out rounded-full ${
                  index === activeSlide
                    ? "w-10 h-3 bg-red-600 shadow-md shadow-red-500/50"
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

        @keyframes fadeInUp {
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
        
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.4); }
        }

        .perspective-3d {
          perspective: 2000px;
          transform-style: preserve-3d;
        }

        .animate-glowPulse {
          animation: glowPulse 2.5s ease-in-out infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .perspective-3d {
            perspective: 1000px;
          }
        }
      `}</style>
      </div>
    </div>
  );
}
