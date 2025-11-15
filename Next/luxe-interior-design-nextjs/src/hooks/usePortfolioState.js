import { useState, useRef } from 'react';

export const usePortfolioState = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(false);
  const [isInitialThumbnailPause, setIsInitialThumbnailPause] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [isDarkening, setIsDarkening] = useState(false);

  const progressInterval = useRef(null);
  const revealTimer = useRef(null);
  const isHoveringActiveCard = useRef(false);
  const wheelAccumX = useRef(0);
  const wheelAccumY = useRef(0);
  const isWheelLocked = useRef(false);
  const prevBodyOverflow = useRef("");
  const wheelLockTimeout = useRef(null);

  return {
    activeSlide,
    setActiveSlide,
    activeThumbnail,
    setActiveThumbnail,
    isDragging,
    setIsDragging,
    startX,
    setStartX,
    currentX,
    setCurrentX,
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
  };
};