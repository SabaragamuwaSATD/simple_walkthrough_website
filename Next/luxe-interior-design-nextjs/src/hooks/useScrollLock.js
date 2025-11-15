export const useScrollLock = (prevBodyOverflow) => {
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

  return { lockPageScroll, unlockPageScroll };
};