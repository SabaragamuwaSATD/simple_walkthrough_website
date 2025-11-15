"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { slides } from "@/data/portfolioSlides";
import { usePortfolioState } from "@/hooks/usePortfolioState";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useWheelNavigation } from "@/hooks/useWheelNavigation";
import { createNavigationHandlers } from "@/utils/portfolioNavigation";
import { createDragHandlers } from "@/utils/portfolioDrag";
import { PortfolioBackground } from "./Portfolio/PortfolioBackground";
import { PortfolioContent } from "./Portfolio/PortfolioContent";
import { PortfolioStyles } from "./Portfolio/PortfolioStyles";

export default function Portfolio() {
  const router = useRouter();
  const state = usePortfolioState();
  const {
    activeSlide,
    setActiveSlide,
    activeThumbnail,
    setActiveThumbnail,
    isDragging,
    startX,
    currentX,
    progress,
    setProgress,
    isSlideTransitioning,
    setIsSlideTransitioning,
    isInitialThumbnailPause,
    setIsInitialThumbnailPause,
    isReveal,
    setIsReveal,
    isDarkening,
    setIsDarkening,
    progressInterval,
    revealTimer,
    isHoveringActiveCard,
    wheelAccumX,
    wheelAccumY,
    isWheelLocked,
    prevBodyOverflow,
    wheelLockTimeout,
  } = state;

  const { lockPageScroll, unlockPageScroll } = useScrollLock(prevBodyOverflow);

  const releaseHoverLock = () => {
    isHoveringActiveCard.current = false;
    wheelAccumX.current = 0;
    wheelAccumY.current = 0;
    isWheelLocked.current = false;

    if (wheelLockTimeout.current) {
      clearTimeout(wheelLockTimeout.current);
      wheelLockTimeout.current = null;
    }

    unlockPageScroll();
  };

  useEffect(() => {
    return () => {
      unlockPageScroll();
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

  const {
    handleNext,
    handlePrevious,
    handleThumbnailClick,
    handleThumbnailNavigation,
  } = createNavigationHandlers(slides, state);

  const { handleActiveCardWheel } = useWheelNavigation(state);

  const { handleDragStart, handleDragMove, handleDragEnd } =
    createDragHandlers(state);

  // Auto-progress effect
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

  // Reveal effect
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
      <div
        className="relative w-full h-screen overflow-hidden bg-white"
        style={{ overscrollBehavior: "none" }}
      >
        <PortfolioBackground
          currentSlide={currentSlide}
          activeThumbnail={activeThumbnail}
          isSlideTransitioning={isSlideTransitioning}
          isReveal={isReveal}
          isDarkening={isDarkening}
        />

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

        <div
          className="relative z-10 flex items-center h-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20"
          role="group"
          style={{
            opacity: isSlideTransitioning || isReveal || isDarkening ? 0 : 1,
            transform: isSlideTransitioning ? "scale(0.95)" : "scale(1)",
            transition:
              "opacity 400ms ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            touchAction: "pan-y",
            pointerEvents:
              isSlideTransitioning || isReveal || isDarkening ? "none" : "auto",
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={() => handleDragEnd(slides, handleNext, handlePrevious)}
          onMouseLeave={() => handleDragEnd(slides, handleNext, handlePrevious)}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={() => handleDragEnd(slides, handleNext, handlePrevious)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") handlePrevious();
            else if (e.key === "ArrowRight") handleNext();
          }}
        >
          <PortfolioContent
            currentSlide={currentSlide}
            activeSlide={activeSlide}
            slides={slides}
            activeThumbnail={activeThumbnail}
            isSlideTransitioning={isSlideTransitioning}
            handleThumbnailClick={handleThumbnailClick}
            progress={progress}
            isInitialThumbnailPause={isInitialThumbnailPause}
            router={router}
          />

          {/* Right Slider - Cards Stack */}
          <div
            className="hidden lg:flex w-7/12 justify-center items-center pl-16"
            style={{
              opacity: isSlideTransitioning ? 0.5 : 1,
              transition: "opacity 0.8s ease-out",
            }}
          >
            <div className="relative w-full h-[600px]">
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-500 ease-out hover:scale-110 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-500 ease-out hover:scale-110 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="relative w-full h-full flex items-center justify-center perspective-3d" aria-label="Thumbnails slider" role="listbox">
                {currentSlide.thumbnails.map((thumb, index) => {
                  const isActive = index === activeThumbnail;
                  const offset = index - activeThumbnail;
                  const absOffset = Math.abs(offset);
                  const rotationZ = isDragging ? (currentX - startX) / 100 : 0;

                  return (
                    <div
                      key={`card-${activeSlide}-${index}`}
                      role={!isActive ? "button" : undefined}
                      tabIndex={!isActive ? 0 : undefined}
                      aria-pressed={isActive}
                      onClick={() => !isActive && handleThumbnailClick(index)}
                      onKeyDown={(e) => {
                        if (!isActive && (e.key === "Enter" || e.key === " ")) {
                          handleThumbnailClick(index);
                        }
                      }}
                      onMouseEnter={
                        isActive
                          ? () => {
                              isHoveringActiveCard.current = true;
                              lockPageScroll();
                            }
                          : undefined
                      }
                      onMouseLeave={isActive ? releaseHoverLock : undefined}
                      onWheel={
                        isActive
                          ? (e) => handleActiveCardWheel(e, handleThumbnailNavigation)
                          : undefined
                      }
                      className="absolute cursor-pointer w-[400px] h-[550px] transform-gpu"
                      style={{
                        transform: isSlideTransitioning
                          ? `translateX(${offset * 120}px) translateZ(-200px) scale(0.8) rotateY(${offset * -8 + 30}deg)`
                          : `translateX(${offset * 120 + dragOffset}px) translateZ(${isActive ? 0 : -absOffset * 100}px) scale(${isActive ? 1 : 1 - absOffset * 0.15}) rotateY(${offset * -8}deg) rotateZ(${rotationZ}deg)`,
                        zIndex: 10 - absOffset,
                        opacity: isSlideTransitioning ? 0 : absOffset > 2 ? 0 : 1,
                        pointerEvents: absOffset > 1 ? "none" : "auto",
                        transition: isDragging ? "none" : "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        overscrollBehavior: "contain",
                      }}
                    >
                      <div className={`absolute inset-0 rounded-3xl transition-all duration-1000 shadow-2xl ${isActive ? "bg-white p-[4px] animate-glowPulse" : "bg-white/30 p-[2px]"}`}>
                        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                          <img
                            src={thumb}
                            alt={`View ${index + 1} of ${currentSlide.title}`}
                            className="w-full h-full object-cover"
                            draggable="false"
                            style={{
                              transform: isActive ? "scale(1)" : "scale(1.1)",
                              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          />
                          <div className={`absolute inset-0 transition-all duration-1000 ${isActive ? "bg-gradient-to-t from-black/50 via-transparent to-transparent" : "bg-black/40"}`} />
                          {isActive && (
                            <>
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-opacity duration-700" style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-sm font-medium uppercase tracking-wider">Active View</span>
                                  </div>
                                  <span className="text-sm font-medium text-white/80">{index + 1} / {currentSlide.thumbnails.length}</span>
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" style={{ animation: "shine 5s ease-in-out infinite" }} />
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`absolute inset-0 -z-10 rounded-3xl transition-all duration-1000 ${isActive ? "bg-black/80 shadow-2xl" : "bg-black/60 shadow-xl"}`} style={{ transform: "translateY(20px) scale(0.95)", filter: isActive ? "blur(20px)" : "blur(10px)", opacity: isActive ? 0.7 : 0.5 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Slide Navigation Dots */}
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
              <div className={`transition-all duration-500 ease-out rounded-full ${index === activeSlide ? "w-10 h-3 bg-red-600 shadow-md shadow-red-500/50" : "w-3 h-3 bg-white/40 hover:bg-white/60"}`} />
            </button>
          ))}
        </div>

        <PortfolioStyles />
      </div>
    </div>
  );
}