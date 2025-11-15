export const createNavigationHandlers = (slides, state) => {
  const {
    activeSlide,
    setActiveSlide,
    activeThumbnail,
    setActiveThumbnail,
    setProgress,
    setIsSlideTransitioning,
    setIsInitialThumbnailPause,
  } = state;

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

  return {
    handleNext,
    handlePrevious,
    handleThumbnailClick,
    handleThumbnailNavigation,
  };
};