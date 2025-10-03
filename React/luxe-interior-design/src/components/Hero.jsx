import React, { useEffect, useRef } from "react";
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

    // Helper function for one-time event listeners
    function once(el, event, fn, opts) {
      var onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
      };
      el.addEventListener(event, onceFn, opts);
      return onceFn;
    }

    // Touch start handler for mobile
    once(document.documentElement, "touchstart", function (e) {
      video.play();
      video.pause();
    });

    // Music setup
    if (music) {
      music.preload = "auto";
      music.load();
      music.volume = 0;

      const primeMusic = function () {
        music
          .play()
          .then(function () {
            music.volume = 0;
          })
          .catch(function () {});
      };

      once(document.documentElement, "touchstart", primeMusic);
      once(document.documentElement, "pointerdown", primeMusic);
      once(document.documentElement, "click", primeMusic);
      once(document, "keydown", primeMusic);

      // Music scroll trigger
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onEnter: function () {
          music.play().catch(function () {});
          gsap.killTweensOf(music);
          gsap.set(music, { volume: Math.max(music.volume || 0, 0.15) });
          gsap.to(music, {
            volume: 0.8,
            duration: 2,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onEnterBack: function () {
          music.play().catch(function () {});
          gsap.killTweensOf(music);
          gsap.set(music, { volume: Math.max(music.volume || 0, 0.15) });
          gsap.to(music, {
            volume: 0.8,
            duration: 2,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onLeave: function () {
          gsap.killTweensOf(music);
          gsap.to(music, {
            volume: 0,
            duration: 1.8,
            ease: "power2.in",
            overwrite: true,
          });
        },
        onLeaveBack: function () {
          gsap.killTweensOf(music);
          gsap.to(music, {
            volume: 0,
            duration: 1.8,
            ease: "power2.in",
            overwrite: true,
          });
        },
        onRefresh: function (self) {
          var active = self.isActive;
          gsap.killTweensOf(music);
          if (active) {
            music.play().catch(function () {});
            gsap.set(music, { volume: 0.15 });
            gsap.to(music, {
              volume: 0.8,
              duration: 2,
              ease: "power2.out",
              overwrite: true,
            });
          } else {
            gsap.set(music, { volume: 0 });
            music.play().catch(function () {});
          }
        },
      });

      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
          var st = ScrollTrigger.getAll().find(function (s) {
            return s.vars && s.vars.trigger === container;
          });
          if (st && st.isActive) {
            music.play().catch(function () {});
          }
        }
      });
    }

    // Video timeline for scrubbing through video on scroll
    let videoTl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Handle video metadata loading
    const handleVideoLoad = () => {
      videoTl.fromTo(
        video,
        { currentTime: 0 },
        { currentTime: video.duration || 1 }
      );
    };

    once(video, "loadedmetadata", handleVideoLoad);

    // Video blob loading for better performance
    let src = video.currentSrc || video.src;
    setTimeout(function () {
      if (window["fetch"]) {
        fetch(src)
          .then((response) => response.blob())
          .then((response) => {
            var blobURL = URL.createObjectURL(response);
            var t = video.currentTime;
            once(document.documentElement, "touchstart", function () {
              video.play();
              video.pause();
            });
            video.setAttribute("src", blobURL);
            video.currentTime = t + 0.01;
          });
      }
    }, 1000);

    // Text animations timeline - exact same as original
    let textTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    textTl.to(videoText, { opacity: 0, duration: 0.05 }, 0);
    textTl
      .fromTo(
        scrollTextRight,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.05 },
        0.05
      )
      .to(scrollTextRight, { x: -100, opacity: 0, duration: 0.05 }, 0.25);
    textTl
      .fromTo(
        text1,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.05 },
        0.35
      )
      .to(text1, { x: 100, opacity: 0, duration: 0.05 }, 0.55);
    textTl
      .fromTo(
        text2,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.05 },
        0.6
      )
      .to(text2, { x: 100, opacity: 0, duration: 0.05 }, 0.8);
    textTl.fromTo(
      text3,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.05 },
      0.85
    );

    // Cleanup function
    return () => {
      video.removeEventListener("loadedmetadata", handleVideoLoad);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Background Music */}
      <audio ref={musicRef} preload="auto" loop>
        <source src="/music/calm.mp3" type="audio/mpeg" />
      </audio>

      <div ref={containerRef} className="relative h-[400vh] mb-10">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          >
            <source src="/videos/outp1.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="/videos/outp1.mp4"
              srcLang="en"
              label="English Subtitles"
              default
            />
            <track
              kind="descriptions"
              src="/videos/output1-descriptions.vtt"
              srcLang="en"
              label="Audio Description"
            />
          </video>

          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-15 flex items-center justify-center text-white z-[2]">
            <div ref={videoTextRef} className="text-center p-5">
              <h1 className="text-[72px] mb-5 font-light tracking-[3px] leading-tight">
                Transform Your Space
              </h1>
              <p className="text-2xl font-light">
                Luxury Interior Design That Reflects Your Style
              </p>
            </div>

            <div
              ref={scrollTextRightRef}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 max-w-[400px] opacity-0 z-[4] bg-[#f5efe6] text-[#2c3e50] px-6 py-5 rounded-xl shadow-2xl"
              style={{
                top: "calc(50% + 48px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              }}
            >
              <h2 className="text-[42px] mb-5 font-light leading-[1.2] text-[#2c3e50]">
                Timeless Elegance
              </h2>
              <p className="text-lg leading-relaxed font-light text-[#2c3e50]">
                We believe in creating spaces that stand the test of time,
                blending classic sophistication with modern functionality.
              </p>
            </div>
          </div>

          <div
            className="absolute left-20 opacity-90 z-[2] text-white max-w-[350px]"
            style={{
              top: "calc(50% + 30px)",
              transform: "translateY(-50%)",
            }}
          >
            <div
              ref={text1Ref}
              className="mb-[10px] opacity-0 bg-[#f5efe6] px-6 pt-[84px] pb-[22px] rounded-xl relative shadow-2xl"
              style={{
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              }}
            >
              <div className="absolute top-3 left-6 text-[56px] font-bold leading-none text-[#c9a961] m-0">
                01
              </div>
              <h3 className="text-4xl mb-4 font-light tracking-[2px] text-[#2c3e50]">
                Design Philosophy
              </h3>
              <p className="text-base leading-[1.8] font-light text-[#2c3e50]">
                Every project begins with understanding your unique vision and
                lifestyle, creating personalized spaces that tell your story.
              </p>
            </div>

            <div
              ref={text2Ref}
              className="mb-[20px] opacity-0 bg-[#f5efe6] px-6 pt-[84px] pb-[22px] rounded-xl relative shadow-2xl"
              style={{
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              }}
            >
              <div className="absolute top-3 left-6 text-[56px] font-bold leading-none text-[#c9a961] m-0">
                02
              </div>
              <h3 className="text-4xl mb-4 font-light tracking-[2px] text-[#2c3e50]">
                Attention to Detail
              </h3>
              <p className="text-base leading-[1.8] font-light text-[#2c3e50]">
                From custom millwork to curated finishes, we obsess over every
                element to ensure perfection in execution.
              </p>
            </div>

            <div
              ref={text3Ref}
              className="opacity-0 bg-[#f5efe6] px-6 pt-[84px] pb-[22px] rounded-xl relative shadow-2xl"
              style={{
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              }}
            >
              <div className="absolute top-3 left-6 text-[56px] font-bold leading-none text-[#c9a961] m-0">
                03
              </div>
              <h3 className="text-4xl mb-4 font-light tracking-[2px] text-[#2c3e50]">
                Sustainable Luxury
              </h3>
              <p className="text-base leading-[1.8] font-light text-[#2c3e50]">
                Beautiful design shouldn't compromise our planet. We integrate
                eco-friendly materials and practices in every project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
