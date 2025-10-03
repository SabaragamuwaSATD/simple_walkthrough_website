import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const dotsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!container || !section) return;

    const slides = slidesRef.current.filter(Boolean);
    const dots = dotsRef.current.filter(Boolean);

    if (!slides.length) return;

    // Initial setup - exactly like the original
    gsap.set(slides, {
      autoAlpha: 0,
      scale: 1.2,
      x: "100%",
      rotationY: 25,
      y: 0,
      transformOrigin: "center center",
    });

    gsap.set(slides[0], {
      autoAlpha: 1,
      scale: 1,
      x: "0%",
      rotationY: 0,
      y: 0,
    });

    const slideCount = slides.length;

    // Main timeline with ScrollTrigger
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${(slideCount - 1) * 100}%`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate through each slide
    for (let i = 0; i < slides.length - 1; i++) {
      const current = slides[i];
      const next = slides[i + 1];

      tl.to(current, {
        autoAlpha: 0,
        scale: 0.9,
        x: "-80%",
        rotationY: -20,
        y: -30,
        duration: 0.9,
      }).fromTo(
        next,
        {
          autoAlpha: 0,
          scale: 1.3,
          x: "100%",
          rotationY: 30,
          y: 50,
        },
        {
          autoAlpha: 1,
          scale: 1,
          x: "0%",
          rotationY: 0,
          y: 0,
          duration: 1.1,
        },
        "<0.1"
      );
    }

    // Ensure final slide is visible
    tl.add(() => {
      gsap.set(slides[slideCount - 1], {
        autoAlpha: 1,
        scale: 1,
        x: "0%",
        rotationY: 0,
        y: 0,
      });
    });

    // Update dots based on scroll progress
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${(slideCount - 1) * 100}%`,
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(
          slideCount - 1,
          Math.round(self.progress * (slideCount - 1))
        );
        dots.forEach((dot, i) => {
          if (dot) {
            dot.classList.toggle("active", i === idx);
          }
        });
      },
    });

    // Mouse move parallax effect
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 3;
      const yPercent = ((e.clientY - rect.top) / rect.height - 0.5) * 3;

      gsap.to(slides, {
        x: `${xPercent}%`,
        y: `${yPercent}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(slides, {
        x: "0%",
        y: "0%",
        duration: 0.6,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-25 mt-20 mb-20">
      <h2 className="text-[42px] text-center mb-16 text-[#2c3e50] font-light tracking-[2px]">
        About Us
      </h2>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-12">
        <div
          ref={containerRef}
          className="relative w-full h-[500px] overflow-hidden bg-white"
          style={{ perspective: "1000px" }}
        >
          <div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              ref={(el) => (slidesRef.current[0] = el)}
              className="absolute inset-0 w-full h-full object-cover block opacity-0"
              src="/images/about.jpg"
              alt="Studio detail 1"
              style={{
                transform: "scale(1.2) translateX(100%) rotateY(25deg)",
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            />
            <img
              ref={(el) => (slidesRef.current[1] = el)}
              className="absolute inset-0 w-full h-full object-cover block opacity-0"
              src="/images/about-2.jpg"
              alt="Studio detail 2"
              style={{
                transform: "scale(1.2) translateX(100%) rotateY(25deg)",
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            />
            <img
              ref={(el) => (slidesRef.current[2] = el)}
              className="absolute inset-0 w-full h-full object-cover block opacity-0"
              src="/images/about-3.jpg"
              alt="Studio detail 3"
              style={{
                transform: "scale(1.2) translateX(100%) rotateY(25deg)",
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            />
            <img
              ref={(el) => (slidesRef.current[3] = el)}
              className="absolute inset-0 w-full h-full object-cover block opacity-0"
              src="/images/about-4.jpg"
              alt="Studio detail 4"
              style={{
                transform: "scale(1.2) translateX(100%) rotateY(25deg)",
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            />
            <img
              ref={(el) => (slidesRef.current[4] = el)}
              className="absolute inset-0 w-full h-full object-cover block opacity-0"
              src="/images/about-5.jpg"
              alt="Studio detail 5"
              style={{
                transform: "scale(1.2) translateX(100%) rotateY(25deg)",
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            />
          </div>

          {/* Carousel dots */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2.5 z-20">
            {[0, 1, 2, 3, 4].map((index) => (
              <span
                key={index}
                ref={(el) => (dotsRef.current[index] = el)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 border-2 border-transparent ${
                  index === 0
                    ? "bg-[#c9a961] border-white transform scale-130 active"
                    : "bg-white bg-opacity-50"
                }`}
                style={{
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div className="about-text">
          <h3 className="text-[32px] mb-5 text-[#2c3e50]">
            Crafting Spaces, Creating Stories
          </h3>
          <p className="text-[#666] leading-[1.8] mb-5">
            With over 15 years of experience in luxury interior design, we
            specialize in creating timeless spaces that reflect our clients'
            personalities and lifestyles.
          </p>
          <p className="text-[#666] leading-[1.8] mb-5">
            Our team of award-winning designers combines artistic vision with
            practical expertise to deliver exceptional results that exceed
            expectations. We believe that great design is not just about
            aesthetics—it's about creating environments that enhance the way you
            live and work.
          </p>
          <p className="text-[#666] leading-[1.8]">
            From concept to completion, we guide you through every step of the
            design journey, ensuring a seamless and enjoyable experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
