$(document).ready(function () {
  console.clear();
  $("video").addClass("video-background");

  const video = document.querySelector(".video-background");
  const music = document.getElementById("bg-music");
  let src = video.currentSrc || video.src;
  console.log(video, src);

  /* Make sure the video is 'activated' on iOS */
  function once(el, event, fn, opts) {
    var onceFn = function (e) {
      el.removeEventListener(event, onceFn);
      fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  }

  once(document.documentElement, "touchstart", function (e) {
    video.play();
    video.pause();
  });

  // Prime and warm-up background music for instant entry playback
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
  }

  gsap.registerPlugin(ScrollTrigger);

  // About slider (GSAP-powered)
  (function initAboutSlider() {
    const container = document.querySelector("#about .about-image");
    if (!container) return;
    const slides = Array.from(container.querySelectorAll(".about-slide"));
    if (!slides.length) return;

    let index = 0,
      busy = false;
    let xTo, yTo;

    gsap.set(slides, { autoAlpha: 0, scale: 1.05 });
    gsap.set(slides[0], { autoAlpha: 1, scale: 1 });

    function activeSlide() {
      return slides[index];
    }
    function updateQuickTo() {
      if (gsap.quickTo) {
        xTo = gsap.quickTo(activeSlide(), "xPercent", {
          duration: 0.6,
          ease: "power2.out",
        });
        yTo = gsap.quickTo(activeSlide(), "yPercent", {
          duration: 0.6,
          ease: "power2.out",
        });
      } else {
        xTo = (v) =>
          gsap.to(activeSlide(), {
            xPercent: v,
            duration: 0.6,
            ease: "power2.out",
          });
        yTo = (v) =>
          gsap.to(activeSlide(), {
            yPercent: v,
            duration: 0.6,
            ease: "power2.out",
          });
      }
    }
    updateQuickTo();

    function showSlide(next, dir = 1) {
      if (busy || next === index) return;
      busy = true;
      const cur = slides[index];
      const nxt = slides[next];
      gsap
        .timeline({ defaults: { duration: 0.8, ease: "power3.out" } })
        .set(nxt, { autoAlpha: 0, xPercent: 10 * dir, scale: 1.05 })
        .to(cur, { autoAlpha: 0, xPercent: -10 * dir, scale: 1.02 }, 0)
        .to(nxt, { autoAlpha: 1, xPercent: 0, scale: 1 }, 0)
        .add(() => {
          slides.forEach((s) => s.classList.remove("is-active"));
          nxt.classList.add("is-active");
          index = next;
          busy = false;
          updateQuickTo();
        });
    }
    function nextSlide() {
      showSlide((index + 1) % slides.length, 1);
    }
    function prevSlide() {
      showSlide((index - 1 + slides.length) % slides.length, -1);
    }

    // Wheel to navigate when hovered
    container.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        (e.deltaY > 0 ? nextSlide : prevSlide)();
      },
      { passive: false }
    );

    // Click advances
    container.addEventListener("click", nextSlide);

    // Subtle parallax on mouse move
    container.addEventListener("mousemove", (e) => {
      const r = container.getBoundingClientRect();
      const xp = ((e.clientX - r.left) / r.width - 0.5) * 4;
      const yp = ((e.clientY - r.top) / r.height - 0.5) * 4;
      xTo && xTo(xp);
      yTo && yTo(yp);
    });
    container.addEventListener("mouseleave", () => {
      gsap.to(activeSlide(), {
        xPercent: 0,
        yPercent: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    // Scroll-driven step-through
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 80%",
      end: "bottom 20%",
      onUpdate: (self) => {
        const step = Math.min(
          slides.length - 1,
          Math.floor(self.progress * slides.length)
        );
        if (step !== index) showSlide(step, step > index ? 1 : -1);
      },
    });
  })();

  let tl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: "#container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  once(video, "loadedmetadata", () => {
    tl.fromTo(video, { currentTime: 0 }, { currentTime: video.duration || 1 });
  });

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

  // Control background music during video section
  if (music) {
    ScrollTrigger.create({
      trigger: "#container",
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
          return s.vars && s.vars.trigger === "#container";
        });
        if (st && st.isActive) {
          music.play().catch(function () {});
        }
      }
    });
  }

  // Text animation timeline
  let textTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  // Main title fade out at 5% scroll
  textTl.to(".video-text", { opacity: 0, duration: 0.05 }, 0);

  // Right side text (5-30% scroll)
  textTl
    .fromTo(
      ".scroll-text-right",
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.05 },
      0.05
    )
    .to(".scroll-text-right", { x: -100, opacity: 0, duration: 0.05 }, 0.25);

  // Left text sections
  textTl
    .fromTo(
      "#text-1",
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.05 },
      0.35
    )
    .to("#text-1", { x: 100, opacity: 0, duration: 0.05 }, 0.55);

  textTl
    .fromTo(
      "#text-2",
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.05 },
      0.6
    )
    .to("#text-2", { x: 100, opacity: 0, duration: 0.05 }, 0.8);

  textTl.fromTo(
    "#text-3",
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.05 },
    0.85
  );

  // Smooth scrolling for navigation links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    var target = $(this.getAttribute("href"));
    if (target.length) {
      $("html, body")
        .stop()
        .animate({ scrollTop: target.offset().top - 80 }, 1000);
    }
  });
});
