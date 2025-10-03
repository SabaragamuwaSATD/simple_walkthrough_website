import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  const projects = [
    {
      title: "Modern Penthouse",
      location: "New York, NY",
      image: "/images/penth.webp",
    },
    {
      title: "Coastal Retreat",
      location: "Malibu, CA",
      image: "/images/coastal.jpg",
    },
    {
      title: "Urban Loft",
      location: "Chicago, IL",
      image: "/images/urban.jpg",
    },
    {
      title: "Classic Elegance",
      location: "Boston, MA",
      image: "/images/about.jpg",
    },
    {
      title: "Modern Villa",
      location: "Miami, FL",
      image: "/images/about-2.jpg",
    },
    {
      title: "Mountain Retreat",
      location: "Aspen, CO",
      image: "/images/about-3.jpg",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const items = itemsRef.current.filter(Boolean);

    if (!section || !items.length) return;

    // Portfolio reveal animation - exactly like the original
    gsap.from(items, {
      autoAlpha: 0,
      x: 150,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none none",
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="bg-[#f8f9fa] pt-10 pb-25"
    >
      <h2 className="text-[42px] text-center mb-16 text-[#2c3e50] font-light tracking-[2px]">
        Featured Projects
      </h2>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
        {projects.map((project, index) => (
          <div
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className="h-[400px] bg-[#ddd] rounded-[10px] overflow-hidden relative cursor-pointer group"
          >
            {/* Overlay gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <h4 className="text-2xl mb-2">{project.title}</h4>
              <p className="text-base">{project.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
