export const createDragHandlers = (state) => {
  const {
    setIsDragging,
    setIsInitialThumbnailPause,
    setStartX,
    setCurrentX,
    startX,
    currentX,
    isDragging,
    activeThumbnail,
    activeSlide,
    setActiveThumbnail,
    setProgress,
  } = state;

  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsInitialThumbnailPause(true);
    setStartX(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
    setCurrentX(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    if (e.type === "touchmove") {
      e.preventDefault();
    }
    setCurrentX(e.type === "mousemove" ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = (slides, handleNext, handlePrevious) => {
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

  return { handleDragStart, handleDragMove, handleDragEnd };
};