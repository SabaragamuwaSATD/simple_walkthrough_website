import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const videoTextRef = useRef(null);
  const scrollTextRightRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const musicRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const videoTweenRef = useRef(null);
  const tickerRef = useRef(null);
  const targetTimeRef = useRef(0);

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
        (connection &&
          connection.effectiveType &&
          (connection.effectiveType === "slow-2g" ||
            connection.effectiveType === "2g"));

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

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const videoText = videoTextRef.current;
    const scrollTextRight = scrollTextRightRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const text3 = text3Ref.current;
    const music = musicRef.current;

    if (!container || !video) return;

    const once = (el, event, fn) => {
      const onceFn = (e) => {
        el.removeEventListener(event, onceFn);
        fn(e);
      };
      el.addEventListener(event, onceFn, { passive: true });
      return onceFn;
    };

    const triggersToKill = [];

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (videoTweenRef.current) {
      videoTweenRef.current.kill();
      videoTweenRef.current = null;
    }

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
          videoSrc = "/videos/outp1.mp4";
      }
      video.src = videoSrc;
    };

    setVideoSource();
    video.load();

    const scrubAmount = deviceCapability.isLowEnd ? 1 : 0.35;

    const initVideoScroll = () => {
      if (!video.duration) return;
      video.pause();
      video.currentTime = 0.0001;
      gsap.set(video, { force3D: true });

      videoTweenRef.current = gsap.to(video, {
        currentTime: () => Math.max(video.duration - 0.05, 0),
        ease: "none",
        paused: true,
      });

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: scrubAmount,
        anticipatePin: 1,
        animation: videoTweenRef.current,
      });

      triggersToKill.push(scrollTriggerRef.current);
      ScrollTrigger.refresh();
    };

    const handleLoadedMetadata = () => {
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
      initVideoScroll();
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    // --- MUSIC CONTROL ---
    if (music) {
      music.preload = "auto";
      music.load();
      music.volume = 0;

      const primeMusic = () => music.play().catch(() => {});
      once(document.documentElement, "touchstart", primeMusic);
      once(document.documentElement, "pointerdown", primeMusic);
      once(document.documentElement, "click", primeMusic);

      // Music fade in/out on section entry
      const musicTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
          music.play().catch(() => {});
          gsap.to(music, { volume: 0.7, duration: 1.5 });
        },
        onLeave: () => {
          gsap.to(music, { volume: 0, duration: 1 });
        },
        onEnterBack: () => {
          music.play().catch(() => {});
          gsap.to(music, { volume: 0.7, duration: 1.5 });
        },
        onLeaveBack: () => {
          gsap.to(music, { volume: 0, duration: 1 });
        },
      });

      triggersToKill.push(musicTrigger);
    }

    // --- TEXT ANIMATIONS TIMELINE ---
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    triggersToKill.push(textTl.scrollTrigger);

    const duration = 0.03;

    textTl.to(videoText, { opacity: 0, scale: 0.8, duration: duration * 2 }, 0);

    // Scroll Text Right
    textTl
      .fromTo(
        scrollTextRight,
        { x: 100, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: duration },
        0.15
      )
      .to(scrollTextRight, { x: -100, opacity: 0, duration: duration }, 0.28);

    // Text 1
    textTl
      .fromTo(
        text1,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: duration },
        0.35
      )
      .to(text1, { x: 100, opacity: 0, duration: duration }, 0.55);

    // Text 2
    textTl
      .fromTo(
        text2,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: duration },
        0.6
      )
      .to(text2, { x: 100, opacity: 0, duration: duration }, 0.8);

    // Text 3
    textTl.fromTo(
      text3,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: duration },
      0.85
    );

    // Cleanup function
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      triggersToKill.forEach((trigger) => trigger && trigger.kill());

      if (videoTweenRef.current) {
        videoTweenRef.current.kill();
        videoTweenRef.current = null;
      }
    };
  }, [deviceCapability]);

  // --- ADAPTIVE STYLING BASED ON DEVICE ---
  const textStyleModern =
    "text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 font-bold tracking-tight text-white";
  const bodyStyleModern =
    "text-sm md:text-base leading-relaxed font-normal text-white/90";

  // Conditional backdrop blur based on device
  const getCardStyle = () => {
    if (deviceCapability.isLowEnd) {
      // Low-end: No backdrop blur, solid background
      return "opacity-0 bg-black/70 border border-white/30 px-5 md:px-7 pt-[68px] md:pt-[90px] pb-[24px] md:pb-[28px] rounded-2xl relative shadow-lg transition-all duration-300 hover:bg-black/80 hover:border-white/40";
    } else {
      // High-end: Backdrop blur with gradients
      return "opacity-0 backdrop-blur-md bg-gradient-to-br from-violet-600/25 to-fuchsia-600/25 border border-white/20 px-5 md:px-7 pt-[68px] md:pt-[90px] pb-[24px] md:pb-[28px] rounded-2xl relative shadow-xl transition-all duration-300 hover:from-violet-600/30 hover:to-fuchsia-600/30 hover:border-white/30";
    }
  };

  const getRightCardStyle = () => {
    if (deviceCapability.isLowEnd) {
      return "backdrop-blur-none bg-black/75 border border-white/30";
    } else {
      return "backdrop-blur-md bg-gradient-to-br from-violet-600/25 to-fuchsia-600/25 border border-white/25";
    }
  };

  const cardStyleModern = getCardStyle();
  const rightCardStyle = getRightCardStyle();

  const numStyleModern =
    "absolute top-4 md:top-5 left-5 md:left-7 text-[64px] md:text-[80px] font-black leading-none text-white/10 m-0";

  return (
    <div className="relative z-0">
      {/* Background Music */}
      <audio ref={musicRef} preload="auto" loop>
        <source src="/music/calm.mp3" type="audio/mpeg" />
      </audio>

      <div
        ref={containerRef}
        className="relative h-[400vh] bg-black mb-10"
        style={{ contain: "layout style paint" }}
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ contain: "layout paint" }}
        >
          {/* VIDEO - Adaptive quality */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            style={{
              transform: "translateZ(0)",
              filter: "brightness(0.9) contrast(1.1)",
            }}
          >
            {/* Fallback source - will be replaced by JS */}
            <source src="/videos/compressed1.mp4" type="video/mp4" />
          </video>

          {/* Simplified vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/30" />

          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white z-[2]"
            style={{ contain: "layout style" }}
          >
            {/* INITIAL HERO TEXT */}
            <div
              ref={videoTextRef}
              className="text-center p-5 hero-text-overlay"
            >
              <h1 className="text-[52px] md:text-[96px] lg:text-[140px] mb-4 md:mb-6 font-black tracking-tight leading-[0.9] px-4 relative text-white drop-shadow-2xl">
                <span className="block opacity-0 animate-[fadeInUp_0.8s_ease-out_0.1s_forwards] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  ELEVATE
                </span>
                <span className="block opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
                  YOUR SPACE
                </span>
              </h1>
              <p className="text-lg md:text-2xl lg:text-3xl font-medium tracking-wide px-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards] relative text-white/90 max-w-3xl mx-auto drop-shadow-lg">
                Where innovation meets{" "}
                <span className="text-violet-400 font-bold">
                  architectural excellence
                </span>
              </p>
            </div>

            {/* Right scroll text - Adaptive glassmorphism */}
            <div
              ref={scrollTextRightRef}
              className={`absolute right-5 md:right-10 lg:right-20 top-1/2 transform -translate-y-1/2 max-w-[calc(100%-40px)] md:max-w-[400px] lg:max-w-[440px] opacity-0 z-[4] ${rightCardStyle} text-white px-6 md:px-8 py-6 md:py-8 rounded-2xl shadow-xl`}
            >
              <h2 className="text-[36px] md:text-[44px] lg:text-[50px] mb-4 md:mb-5 font-bold leading-[1.1] text-white tracking-tight drop-shadow-lg">
                Modern Vision
              </h2>
              <p className="text-sm md:text-base lg:text-lg leading-relaxed font-normal text-white/90">
                Redefining architectural boundaries with bold designs that
                inspire, spaces that breathe, and innovations that last.
              </p>
            </div>
          </div>

          {/* Left scroll text sections - Adaptive cards */}
          <div
            className="absolute left-5 md:left-10 lg:left-20 opacity-90 z-[2] max-w-[calc(100%-40px)] md:max-w-[440px] lg:max-w-[500px]"
            style={{
              top: "calc(50% + 30px)",
              transform: "translateY(-50%)",
              contain: "layout style",
            }}
          >
            {/* Section 01 */}
            <div
              ref={text1Ref}
              className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
            >
              <div className={numStyleModern}>01</div>
              <h3 className={textStyleModern}>Innovative Design</h3>
              <p className={bodyStyleModern}>
                Pushing creative boundaries with cutting-edge concepts that
                transform ordinary spaces into extraordinary experiences.
              </p>
            </div>

            {/* Section 02 */}
            <div
              ref={text2Ref}
              className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
            >
              <div className={numStyleModern}>02</div>
              <h3 className={textStyleModern}>Smart Integration</h3>
              <p className={bodyStyleModern}>
                Seamlessly blending technology with aesthetics to create
                intelligent environments that adapt to your lifestyle.
              </p>
            </div>

            {/* Section 03 */}
            <div
              ref={text3Ref}
              className={`mb-[30px] md:mb-[20px] ${cardStyleModern}`}
            >
              <div className={numStyleModern}>03</div>
              <h3 className={textStyleModern}>Sustainable Future</h3>
              <p className={bodyStyleModern}>
                Building tomorrow's legacy today with eco-conscious materials
                and forward-thinking sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
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
      `}
      </style>
    </div>
  );
};

export default Hero;
