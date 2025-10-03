import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    icon: "🏠",
    title: "Residential Design",
    description:
      "Create stunning living spaces that perfectly balance aesthetics and functionality for your home.",
  },
  {
    icon: "🏢",
    title: "Commercial Spaces",
    description:
      "Professional office and retail environments designed to enhance productivity and brand identity.",
  },
  {
    icon: "💡",
    title: "Lighting Design",
    description:
      "Strategic lighting solutions that transform ambiance and highlight architectural features.",
  },
  {
    icon: "🎨",
    title: "Color Consultation",
    description:
      "Expert color palettes that create harmony and express your unique personality.",
  },
  {
    icon: "🪑",
    title: "Custom Furniture",
    description:
      "Bespoke furniture pieces crafted to fit your space and complement your design vision.",
  },
  {
    icon: "🖼️",
    title: "Art Curation",
    description:
      "Carefully selected artwork and decor to complete your interior design narrative.",
  },
];

const Services = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !cards.length) return;

    // Title animation
    gsap.fromTo(
      title,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Cards staggered animation
    gsap.fromTo(
      cards,
      {
        y: 60,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Add hover animations to each card
    cards.forEach((card, index) => {
      if (!card) return;

      const icon = card.querySelector(".service-icon");
      const title = card.querySelector(".service-title");
      const description = card.querySelector(".service-description");

      // Mouse enter animation
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1.1,
          rotationY: 10,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to([title, description], {
          x: 5,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      // Mouse leave animation
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1,
          rotationY: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to([title, description], {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      // Store cleanup functions
      card._cleanup = () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    // Cleanup
    return () => {
      cards.forEach((card) => {
        if (card && card._cleanup) {
          card._cleanup();
        }
      });

      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-25 mb-20">
      <h2
        ref={titleRef}
        className="text-[42px] text-center mb-16 text-[#2c3e50] font-light tracking-[2px]"
      >
        Our Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1200px] mx-auto px-12">
        {servicesData.map((service, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="p-12 bg-[#f8f9fa] text-center transition-all duration-300 cursor-pointer"
            style={{
              borderRadius: "0px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="service-icon text-[48px] mb-5 text-[#c9a961]">
              {service.icon}
            </div>
            <h3 className="service-title text-2xl mb-4 text-[#2c3e50]">
              {service.title}
            </h3>
            <p className="service-description text-[#1b1a1a] leading-[1.6]">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
