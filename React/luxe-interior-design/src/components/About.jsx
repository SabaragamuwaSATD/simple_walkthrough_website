import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const About = () => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;

    if (!container || !glow) return;

    // Mouse enter - show glow only
    const handleMouseEnter = () => {
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    // Mouse leave - hide glow
    const handleMouseLeave = () => {
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]"
    >
      <h2 className="text-[42px] text-center mb-16 text-white font-light tracking-[3px]">
        About Us
      </h2>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-12">
        <div
          ref={containerRef}
          className="relative w-full h-[500px] overflow-visible cursor-pointer"
        >
          {/* Glow effect */}
          <div
            ref={glowRef}
            className="absolute inset-0 bg-[#c9a961] blur-[40px] opacity-0 rounded-lg"
            style={{
              zIndex: 0,
            }}
          />

          {/* Main image container */}
          <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl">
            <img
              ref={imageRef}
              className="w-full h-full object-cover"
              src="/images/DilushiMendis.jpeg"
              alt="Dilushi Mendis - Chartered Architect"
            />

            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        <div className="about-text">
          <h3 className="text-[32px] mb-5 text-white font-light">
            Dilushi Mendis
          </h3>
          <p className="text-[#b8b8b8] leading-[1.8] mb-5">
            A qualified Chartered Architect with over 20 years of experience in
            the industry, Dilushi boasts an illustrious career with some of Sri
            Lanka's most respected design firms. Throughout her career, she has
            gained deep expertise in creating spaces that balance functionality
            with creativity.
          </p>
          <p className="text-[#b8b8b8] leading-[1.8] mb-5">
            Her passion for art and design drives her to constantly explore new
            ideas, transforming concepts into innovative and meaningful spaces.
            Guided by this passion, in 2014, she embarked on her own venture
            with a clear vision: to bring to life environments that are
            practical, unique, and tailored to each client's needs.
          </p>
          <p className="text-[#b8b8b8] leading-[1.8]">
            With her wealth of experience and dedication to design excellence,
            Dilushi continues to shape spaces that not only serve their purpose
            but also inspire those who experience them.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
