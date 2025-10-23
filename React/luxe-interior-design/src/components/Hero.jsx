import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const scrollTextRightRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const musicRef = useRef(null);

  // 🎵 NEW: Music mute state
  const [isMuted, setIsMuted] = useState(false);

  // Device capability detection
  const [deviceCapability, setDeviceCapability] = useState({
    isLowEnd: false,
    isMobile: false,
    videoQuality: "1080p",
  });

  // Detect device capability on mount
  useEffect(() => {
    const detectDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const cores = navigator.hardwareConcurrency || 2;
      const memory = navigator.deviceMemory || 4;
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      // Determine if device is low-end
      const isLowEnd =
        cores <= 4 ||
        memory <= 4 ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g";

      // Determine video quality
      let videoQuality = "1080p";
      if (isMobile && isLowEnd) {
        videoQuality = "540p";
      } else if (isMobile || isLowEnd) {
        videoQuality = "720p";
      }

      setDeviceCapability({
        isLowEnd,
        isMobile,
        videoQuality,
      });
    };

    detectDevice();
  }, []);

  // 🎵 NEW: Toggle mute/unmute function
  const toggleMute = () => {
    const music = musicRef.current;
    if (!music) return;

    setIsMuted(!isMuted);

    if (!isMuted) {
      // Mute: fade out to 0
      gsap.to(music, { volume: 0, duration: 0.5 });
    } else {
      // Unmute: fade in to 0.7
      gsap.to(music, { volume: 0.7, duration: 0.5 });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const scrollTextRight = scrollTextRightRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const text3 = text3Ref.current;
    const music = musicRef.current;

    if (!container || !video) return;

    // Set video source based on device capability
    const setVideoSource = () => {
      let videoSrc;
      switch (deviceCapability.videoQuality) {
        case "540p":
          videoSrc = "/videos/compressed-540p.mp4";
          break;
        case "720p":
          videoSrc = "/videos/compressed-720p.mp4";
          break;
        default:
          videoSrc = "/videos/compressed1.mp4";
      }
      video.src = videoSrc;
    };

    setVideoSource();

    // Helper function for one-time event listeners
    function once(el, event, fn) {
      const onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
      };
      el.addEventListener(event, onceFn);
      return onceFn;
    }

    // Touch start handler for mobile - fixed to avoid play/pause conflict
    once(document.documentElement, "touchstart", function () {
      video
        .play()
        .then(() => {
          video.pause();
        })
        .catch(() => {
          // Silently handle if play fails
        });
    });

    // --- VIDEO SCRUBBING CONTROL: PERFORMANCE BALANCED ---
    // Adjust scrub value based on device capability
    const scrubValue = deviceCapability.isLowEnd ? 2 : 3;

    let videoTl = gsap.timeline({
      defaults: { duration: 1, ease: "none" },
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: scrubValue,
        anticipatePin: 1,
      },
    });

    // Handle video metadata loading
    const handleVideoLoad = () => {
      videoTl.fromTo(
        video,
        { currentTime: 0 },
        {
          currentTime: video.duration || 1,
          ease: "none",
        }
      );
    };

    once(video, "loadedmetadata", handleVideoLoad);

    // Video Blob Loading (for better performance)
    let src = video.currentSrc || video.src;
    if (window["fetch"]) {
      fetch(src)
        .then((response) => response.blob())
        .then((response) => {
          const blobURL = URL.createObjectURL(response);
          const t = video.currentTime;
          video.setAttribute("src", blobURL);
          video.currentTime = t + 0.01;
        })
        .catch(() => {
          // Fallback if blob loading fails
          console.log("Using direct video source");
        });
    }

    // Force video to be ready for smooth seeking - fixed promise handling
    video.addEventListener("loadeddata", () => {
      gsap.set(video, { force3D: true });
      // Prefetch video buffer with proper promise handling
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(() => {
          // Silently handle if play fails
          video.currentTime = 0;
        });
    });

    // --- MUSIC CONTROL ---
    // 🎵 MODIFIED: Check mute state when controlling volume
    if (music) {
      music.preload = "auto";
      music.load();
      music.volume = 0;

      const primeMusic = () => music.play().catch(() => {});
      once(document.documentElement, "touchstart", primeMusic);
      once(document.documentElement, "pointerdown", primeMusic);
      once(document.documentElement, "click", primeMusic);

      // Music fade in/out on section entry
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
          music.play().catch(() => {});
          // 🎵 MODIFIED: Only fade in if not muted
          if (!isMuted) {
            gsap.to(music, { volume: 0.7, duration: 1.5 });
          }
        },
        onLeave: () => {
          gsap.to(music, { volume: 0, duration: 1 });
        },
        onEnterBack: () => {
          music.play().catch(() => {});
          // 🎵 MODIFIED: Only fade in if not muted
          if (!isMuted) {
            gsap.to(music, { volume: 0.7, duration: 1.5 });
          }
        },
        onLeaveBack: () => {
          gsap.to(music, { volume: 0, duration: 1 });
        },
      });
    }

    // --- ELEGANT TEXT ANIMATIONS TIMELINE ---
    let textTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const duration = 0.03;

    // Right scroll text with smooth slide
    if (scrollTextRight) {
      textTl
        .fromTo(
          scrollTextRight,
          {
            x: 80,
            opacity: 0,
            scale: 0.95,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: duration * 1.3,
          },
          0.15
        )
        .to(
          scrollTextRight,
          {
            x: -80,
            opacity: 0,
            scale: 0.95,
            duration: duration * 1.3,
          },
          0.28
        );
    }

    // Text 1 with elegant entrance
    if (text1) {
      textTl
        .fromTo(
          text1,
          {
            x: -80,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: duration * 1.2,
          },
          0.35
        )
        .to(
          text1,
          {
            x: 80,
            opacity: 0,
            scale: 0.96,
            duration: duration * 1.2,
          },
          0.55
        );
    }

    // Text 2 with refined movement
    if (text2) {
      textTl
        .fromTo(
          text2,
          {
            x: -80,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: duration * 1.2,
          },
          0.6
        )
        .to(
          text2,
          {
            x: 80,
            opacity: 0,
            scale: 0.96,
            duration: duration * 1.2,
          },
          0.8
        );
    }

    // Text 3 with smooth entrance and stays visible
    if (text3) {
      textTl.fromTo(
        text3,
        {
          x: -80,
          opacity: 0,
          scale: 0.96,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: duration * 1.3,
        },
        0.85
      );
    }

    // Cleanup function
    return () => {
      for (const trigger of ScrollTrigger.getAll()) {
        trigger.kill();
      }
    };
  }, [deviceCapability, isMuted]); // 🎵 MODIFIED: Added isMuted dependency

  // --- ADAPTIVE STYLING BASED ON DEVICE ---
  const textStyleModern =
    "text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 font-light tracking-wide text-stone-100";
  const bodyStyleModern =
    "text-sm md:text-base leading-relaxed font-light text-stone-200/95";

  // Conditional backdrop blur based on device
  const getCardStyle = () => {
    if (deviceCapability.isLowEnd) {
      // Low-end: No backdrop blur, solid background
      return "opacity-0 bg-stone-900/75 border border-amber-200/30 px-5 md:px-7 pt-[68px] md:pt-[90px] pb-[24px] md:pb-[28px] rounded-2xl relative shadow-lg transition-all duration-300 hover:bg-stone-800/85 hover:border-amber-200/40";
    } else {
      // High-end: Backdrop blur with gradients
      return "opacity-0 backdrop-blur-md bg-gradient-to-br from-stone-800/30 to-amber-900/20 border border-amber-200/20 px-5 md:px-7 pt-[68px] md:pt-[90px] pb-[24px] md:pb-[28px] rounded-2xl relative shadow-xl transition-all duration-300 hover:from-stone-800/40 hover:to-amber-900/30 hover:border-amber-200/30";
    }
  };

  const getRightCardStyle = () => {
    if (deviceCapability.isLowEnd) {
      return "backdrop-blur-none bg-stone-900/80 border border-amber-200/30";
    } else {
      return "backdrop-blur-md bg-gradient-to-br from-stone-800/30 to-amber-900/20 border border-amber-200/25";
    }
  };

  const cardStyleModern = getCardStyle();
  const rightCardStyle = getRightCardStyle();

  const numStyleModern =
    "absolute top-4 md:top-5 left-5 md:left-7 text-[64px] md:text-[80px] font-light leading-none text-amber-200/15 m-0";

  return (
    <>
      {/* Background Music */}
      <audio ref={musicRef} preload="auto" loop>
        <source src="/music/calm.mp3" type="audio/mpeg" />
        <track kind="captions" srcLang="en" label="English captions" />
      </audio>

      <div
        ref={containerRef}
        className="relative h-[400vh] bg-black"
        style={{
          contain: "layout style paint",
          zIndex: 0,
          isolation: "isolate",
        }}
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ contain: "layout paint", zIndex: 1 }}
        >
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            style={{
              transform: "translateZ(0)",
              filter: "brightness(0.9) contrast(1.1)",
              zIndex: 0,
            }}
          >
            <source src="/videos/compressed1.mp4" type="video/mp4" />
            <track kind="captions" srcLang="en" label="English captions" />
          </video>

          {/* Warm vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-amber-950/40"
            style={{ zIndex: 1 }}
          />

          {/* 🎵 NEW: Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-200/30 flex items-center justify-center hover:bg-stone-800/90 hover:border-amber-200/50 transition-all duration-300 group shadow-xl"
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? (
              // Muted Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-200/70 group-hover:text-amber-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              // Unmuted Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-200/70 group-hover:text-amber-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>

          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white"
            style={{ contain: "layout style", zIndex: 2 }}
          >
            {/* Right scroll text */}
            <div
              ref={scrollTextRightRef}
              className={`absolute right-5 md:right-10 lg:right-20 top-1/2 transform -translate-y-1/2 max-w-[calc(100%-40px)] md:max-w-[400px] lg:max-w-[440px] opacity-0 ${rightCardStyle} text-white px-6 md:px-8 py-6 md:py-8 rounded-2xl shadow-xl`}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
                background: "rgba(24, 24, 27, 0.9)",
                zIndex: 3,
              }}
            >
              <h2 className="text-[36px] md:text-[44px] lg:text-[50px] mb-4 md:mb-5 font-light leading-[1.1] text-stone-100 tracking-wide drop-shadow-lg">
                Design Philosophy
              </h2>
              <p className="text-sm md:text-base lg:text-lg leading-relaxed font-light text-stone-200">
                Crafting harmonious spaces that blend elegance with
                functionality, where every detail tells your story.
              </p>
            </div>
          </div>

          {/* Left scroll text sections */}
          <div
            className="absolute left-5 md:left-10 lg:left-20 opacity-90 max-w-[calc(100%-40px)] md:max-w-[440px] lg:max-w-[500px]"
            style={{
              top: "calc(50% + 30px)",
              transform: "translateY(-50%)",
              contain: "layout style",
              perspective: "1200px",
              transformStyle: "preserve-3d",
              zIndex: 2,
            }}
          >
            {/* Section 01 */}
            <div
              ref={text1Ref}
              className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
              style={{ background: "rgba(24, 24, 27, 0.9)" }}
            >
              <div className={numStyleModern}>01</div>
              <h3 className={textStyleModern}>Timeless Elegance</h3>
              <p className={bodyStyleModern}>
                Curating sophisticated interiors that combine classic beauty
                with contemporary comfort, creating spaces that age gracefully.
              </p>
            </div>

            {/* Section 02 */}
            <div
              ref={text2Ref}
              className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
              style={{ background: "rgba(24, 24, 27, 0.9)" }}
            >
              <div className={numStyleModern}>02</div>
              <h3 className={textStyleModern}>Personalized Spaces</h3>
              <p className={bodyStyleModern}>
                Tailoring every element to reflect your lifestyle and
                personality, ensuring your home truly feels like yours.
              </p>
            </div>

            {/* Section 03 */}
            <div
              ref={text3Ref}
              className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
              style={{ background: "rgba(24, 24, 27, 0.9)" }}
            >
              <div className={numStyleModern}>03</div>
              <h3 className={textStyleModern}>Sustainable Luxury</h3>
              <p className={bodyStyleModern}>
                Embracing eco-conscious materials and artisan craftsmanship to
                create beautiful, responsible living environments.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

        .bg-gradient-radial {
          background: radial-gradient(
            circle at center,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        /* Optimize rendering */
        video {
          will-change: auto;
        }
      `}</style>
    </>
  );
};

export default Hero;

// import React, { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // Register the plugin
// gsap.registerPlugin(ScrollTrigger);

// const Hero = () => {
//   const containerRef = useRef(null);
//   const videoRef = useRef(null);
//   const scrollTextRightRef = useRef(null);
//   const text1Ref = useRef(null);
//   const text2Ref = useRef(null);
//   const text3Ref = useRef(null);
//   const musicRef = useRef(null);

//   // Device capability detection
//   const [deviceCapability, setDeviceCapability] = useState({
//     isLowEnd: false,
//     isMobile: false,
//     videoQuality: "1080p",
//   });

//   // Detect device capability on mount
//   useEffect(() => {
//     const detectDevice = () => {
//       const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//       const cores = navigator.hardwareConcurrency || 2;
//       const memory = navigator.deviceMemory || 4;
//       const connection =
//         navigator.connection ||
//         navigator.mozConnection ||
//         navigator.webkitConnection;

//       // Determine if device is low-end
//       const isLowEnd =
//         cores <= 4 ||
//         memory <= 4 ||
//         connection?.effectiveType === "slow-2g" ||
//         connection?.effectiveType === "2g";

//       // Determine video quality
//       let videoQuality = "1080p";
//       if (isMobile && isLowEnd) {
//         videoQuality = "540p";
//       } else if (isMobile || isLowEnd) {
//         videoQuality = "720p";
//       }

//       setDeviceCapability({
//         isLowEnd,
//         isMobile,
//         videoQuality,
//       });
//     };

//     detectDevice();
//   }, []);

//   useEffect(() => {
//     const container = containerRef.current;
//     const video = videoRef.current;
//     const scrollTextRight = scrollTextRightRef.current;
//     const text1 = text1Ref.current;
//     const text2 = text2Ref.current;
//     const text3 = text3Ref.current;
//     const music = musicRef.current;

//     if (!container || !video) return;

//     // Set video source based on device capability
//     const setVideoSource = () => {
//       let videoSrc;
//       switch (deviceCapability.videoQuality) {
//         case "540p":
//           videoSrc = "/videos/compressed-540p.mp4";
//           break;
//         case "720p":
//           videoSrc = "/videos/compressed-720p.mp4";
//           break;
//         default:
//           videoSrc = "/videos/compressed1.mp4";
//       }
//       video.src = videoSrc;
//     };

//     setVideoSource();

//     // Helper function for one-time event listeners
//     function once(el, event, fn) {
//       const onceFn = function (e) {
//         el.removeEventListener(event, onceFn);
//         fn.apply(this, arguments);
//       };
//       el.addEventListener(event, onceFn);
//       return onceFn;
//     }

//     // Touch start handler for mobile - fixed to avoid play/pause conflict
//     once(document.documentElement, "touchstart", function () {
//       video
//         .play()
//         .then(() => {
//           video.pause();
//         })
//         .catch(() => {
//           // Silently handle if play fails
//         });
//     });

//     // --- VIDEO SCRUBBING CONTROL: PERFORMANCE BALANCED ---
//     // Adjust scrub value based on device capability
//     const scrubValue = deviceCapability.isLowEnd ? 2 : 3;

//     let videoTl = gsap.timeline({
//       defaults: { duration: 1, ease: "none" },
//       scrollTrigger: {
//         trigger: container,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: scrubValue,
//         anticipatePin: 1,
//       },
//     });

//     // Handle video metadata loading
//     const handleVideoLoad = () => {
//       videoTl.fromTo(
//         video,
//         { currentTime: 0 },
//         {
//           currentTime: video.duration || 1,
//           ease: "none",
//         }
//       );
//     };

//     once(video, "loadedmetadata", handleVideoLoad);

//     // Video Blob Loading (for better performance)
//     let src = video.currentSrc || video.src;
//     if (window["fetch"]) {
//       fetch(src)
//         .then((response) => response.blob())
//         .then((response) => {
//           const blobURL = URL.createObjectURL(response);
//           const t = video.currentTime;
//           video.setAttribute("src", blobURL);
//           video.currentTime = t + 0.01;
//         })
//         .catch(() => {
//           // Fallback if blob loading fails
//           console.log("Using direct video source");
//         });
//     }

//     // Force video to be ready for smooth seeking - fixed promise handling
//     video.addEventListener("loadeddata", () => {
//       gsap.set(video, { force3D: true });
//       // Prefetch video buffer with proper promise handling
//       video
//         .play()
//         .then(() => {
//           video.pause();
//           video.currentTime = 0;
//         })
//         .catch(() => {
//           // Silently handle if play fails
//           video.currentTime = 0;
//         });
//     });

//     // --- MUSIC CONTROL ---
//     if (music) {
//       music.preload = "auto";
//       music.load();
//       music.volume = 0;

//       const primeMusic = () => music.play().catch(() => {});
//       once(document.documentElement, "touchstart", primeMusic);
//       once(document.documentElement, "pointerdown", primeMusic);
//       once(document.documentElement, "click", primeMusic);

//       // Music fade in/out on section entry
//       ScrollTrigger.create({
//         trigger: container,
//         start: "top top",
//         end: "bottom bottom",
//         onEnter: () => {
//           music.play().catch(() => {});
//           gsap.to(music, { volume: 0.7, duration: 1.5 });
//         },
//         onLeave: () => {
//           gsap.to(music, { volume: 0, duration: 1 });
//         },
//         onEnterBack: () => {
//           music.play().catch(() => {});
//           gsap.to(music, { volume: 0.7, duration: 1.5 });
//         },
//         onLeaveBack: () => {
//           gsap.to(music, { volume: 0, duration: 1 });
//         },
//       });
//     }

//     // --- ELEGANT TEXT ANIMATIONS TIMELINE ---
//     let textTl = gsap.timeline({
//       scrollTrigger: {
//         trigger: container,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: true,
//       },
//     });

//     const duration = 0.03;

//     // Right scroll text with smooth slide
//     if (scrollTextRight) {
//       textTl
//         .fromTo(
//           scrollTextRight,
//           {
//             x: 80,
//             opacity: 0,
//             scale: 0.95,
//           },
//           {
//             x: 0,
//             opacity: 1,
//             scale: 1,
//             duration: duration * 1.3,
//           },
//           0.15
//         )
//         .to(
//           scrollTextRight,
//           {
//             x: -80,
//             opacity: 0,
//             scale: 0.95,
//             duration: duration * 1.3,
//           },
//           0.28
//         );
//     }

//     // Text 1 with elegant entrance
//     if (text1) {
//       textTl
//         .fromTo(
//           text1,
//           {
//             x: -80,
//             opacity: 0,
//             scale: 0.96,
//           },
//           {
//             x: 0,
//             opacity: 1,
//             scale: 1,
//             duration: duration * 1.2,
//           },
//           0.35
//         )
//         .to(
//           text1,
//           {
//             x: 80,
//             opacity: 0,
//             scale: 0.96,
//             duration: duration * 1.2,
//           },
//           0.55
//         );
//     }

//     // Text 2 with refined movement
//     if (text2) {
//       textTl
//         .fromTo(
//           text2,
//           {
//             x: -80,
//             opacity: 0,
//             scale: 0.96,
//           },
//           {
//             x: 0,
//             opacity: 1,
//             scale: 1,
//             duration: duration * 1.2,
//           },
//           0.6
//         )
//         .to(
//           text2,
//           {
//             x: 80,
//             opacity: 0,
//             scale: 0.96,
//             duration: duration * 1.2,
//           },
//           0.8
//         );
//     }

//     // Text 3 with smooth entrance and stays visible
//     if (text3) {
//       textTl.fromTo(
//         text3,
//         {
//           x: -80,
//           opacity: 0,
//           scale: 0.96,
//         },
//         {
//           x: 0,
//           opacity: 1,
//           scale: 1,
//           duration: duration * 1.3,
//         },
//         0.85
//       );
//     }

//     // Cleanup function
//     return () => {
//       for (const trigger of ScrollTrigger.getAll()) {
//         trigger.kill();
//       }
//     };
//   }, [deviceCapability]);

//   // --- ADAPTIVE STYLING BASED ON DEVICE ---
//   const textStyleModern =
//     "text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 font-light tracking-wide text-stone-100";
//   const bodyStyleModern =
//     "text-sm md:text-base leading-relaxed font-light text-stone-200/95";

//   // Conditional backdrop blur based on device
//   const getCardStyle = () => {
//     if (deviceCapability.isLowEnd) {
//       // Low-end: No backdrop blur, solid background
//       return "opacity-0 bg-stone-900/75 border border-amber-200/30 px-5 md:px-7 pt-[68px] md:pt-[90px] pb-[24px] md:pb-[28px] rounded-2xl relative shadow-lg transition-all duration-300 hover:bg-stone-800/85 hover:border-amber-200/40";
//     } else {
//       // High-end: Backdrop blur with gradients
//       return "opacity-0 backdrop-blur-md bg-gradient-to-br from-stone-800/30 to-amber-900/20 border border-amber-200/20 px-5 md:px-7 pt-[68px] md:pt-[90px] pb-[24px] md:pb-[28px] rounded-2xl relative shadow-xl transition-all duration-300 hover:from-stone-800/40 hover:to-amber-900/30 hover:border-amber-200/30";
//     }
//   };

//   const getRightCardStyle = () => {
//     if (deviceCapability.isLowEnd) {
//       return "backdrop-blur-none bg-stone-900/80 border border-amber-200/30";
//     } else {
//       return "backdrop-blur-md bg-gradient-to-br from-stone-800/30 to-amber-900/20 border border-amber-200/25";
//     }
//   };

//   const cardStyleModern = getCardStyle();
//   const rightCardStyle = getRightCardStyle();

//   const numStyleModern =
//     "absolute top-4 md:top-5 left-5 md:left-7 text-[64px] md:text-[80px] font-light leading-none text-amber-200/15 m-0";

//   return (
//     <>
//       {/* Background Music */}
//       <audio ref={musicRef} preload="auto" loop>
//         <source src="/music/calm.mp3" type="audio/mpeg" />
//         <track kind="captions" srcLang="en" label="English captions" />
//       </audio>

//       <div
//         ref={containerRef}
//         className="relative h-[400vh] bg-black"
//         style={{
//           contain: "layout style paint",
//           zIndex: 0,
//           isolation: "isolate",
//         }}
//       >
//         <div
//           className="sticky top-0 h-screen w-full overflow-hidden"
//           style={{ contain: "layout paint", zIndex: 1 }}
//         >
//           <video
//             ref={videoRef}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             muted
//             playsInline
//             preload="auto"
//             style={{
//               transform: "translateZ(0)",
//               filter: "brightness(0.9) contrast(1.1)",
//               zIndex: 0,
//             }}
//           >
//             <source src="/videos/compressed1.mp4" type="video/mp4" />
//             <track kind="captions" srcLang="en" label="English captions" />
//           </video>

//           {/* Warm vignette overlay */}
//           <div
//             className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-amber-950/40"
//             style={{ zIndex: 1 }}
//           />

//           <div
//             className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white"
//             style={{ contain: "layout style", zIndex: 2 }}
//           >
//             {/* Right scroll text */}
//             <div
//               ref={scrollTextRightRef}
//               className={`absolute right-5 md:right-10 lg:right-20 top-1/2 transform -translate-y-1/2 max-w-[calc(100%-40px)] md:max-w-[400px] lg:max-w-[440px] opacity-0 ${rightCardStyle} text-white px-6 md:px-8 py-6 md:py-8 rounded-2xl shadow-xl`}
//               style={{
//                 perspective: "1000px",
//                 transformStyle: "preserve-3d",
//                 background: "rgba(24, 24, 27, 0.9)",
//                 zIndex: 3,
//               }}
//             >
//               <h2 className="text-[36px] md:text-[44px] lg:text-[50px] mb-4 md:mb-5 font-light leading-[1.1] text-stone-100 tracking-wide drop-shadow-lg">
//                 Design Philosophy
//               </h2>
//               <p className="text-sm md:text-base lg:text-lg leading-relaxed font-light text-stone-200">
//                 Crafting harmonious spaces that blend elegance with
//                 functionality, where every detail tells your story.
//               </p>
//             </div>
//           </div>

//           {/* Left scroll text sections */}
//           <div
//             className="absolute left-5 md:left-10 lg:left-20 opacity-90 max-w-[calc(100%-40px)] md:max-w-[440px] lg:max-w-[500px]"
//             style={{
//               top: "calc(50% + 30px)",
//               transform: "translateY(-50%)",
//               contain: "layout style",
//               perspective: "1200px",
//               transformStyle: "preserve-3d",
//               zIndex: 2,
//             }}
//           >
//             {/* Section 01 */}
//             <div
//               ref={text1Ref}
//               className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
//               style={{ background: "rgba(24, 24, 27, 0.9)" }}
//             >
//               <div className={numStyleModern}>01</div>
//               <h3 className={textStyleModern}>Timeless Elegance</h3>
//               <p className={bodyStyleModern}>
//                 Curating sophisticated interiors that combine classic beauty
//                 with contemporary comfort, creating spaces that age gracefully.
//               </p>
//             </div>

//             {/* Section 02 */}
//             <div
//               ref={text2Ref}
//               className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
//               style={{ background: "rgba(24, 24, 27, 0.9)" }}
//             >
//               <div className={numStyleModern}>02</div>
//               <h3 className={textStyleModern}>Personalized Spaces</h3>
//               <p className={bodyStyleModern}>
//                 Tailoring every element to reflect your lifestyle and
//                 personality, ensuring your home truly feels like yours.
//               </p>
//             </div>

//             {/* Section 03 */}
//             <div
//               ref={text3Ref}
//               className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
//               style={{ background: "rgba(24, 24, 27, 0.9)" }}
//             >
//               <div className={numStyleModern}>03</div>
//               <h3 className={textStyleModern}>Sustainable Luxury</h3>
//               <p className={bodyStyleModern}>
//                 Embracing eco-conscious materials and artisan craftsmanship to
//                 create beautiful, responsible living environments.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .bg-gradient-radial {
//           background: radial-gradient(
//             circle at center,
//             transparent 0%,
//             transparent 60%,
//             rgba(0, 0, 0, 0.3) 100%
//           );
//         }

//         /* Optimize rendering */
//         video {
//           will-change: auto;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Hero;
