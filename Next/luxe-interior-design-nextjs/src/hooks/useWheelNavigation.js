export const useWheelNavigation = (state) => {
  const {
    isHoveringActiveCard,
    wheelAccumX,
    wheelAccumY,
    isWheelLocked,
    wheelLockTimeout,
    isSlideTransitioning,
    isDragging,
    isReveal,
    isDarkening,
  } = state;

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

  const handleActiveCardWheel = (e, handleThumbnailNavigation) => {
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

    if (wheelLockTimeout.current) {
      clearTimeout(wheelLockTimeout.current);
    }

    wheelLockTimeout.current = setTimeout(() => {
      isWheelLocked.current = false;
      wheelLockTimeout.current = null;
    }, 100);
  };

  return { handleActiveCardWheel, shouldIgnoreWheel, getWheelIntent };
};