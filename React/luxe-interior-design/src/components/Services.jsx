import React, { useEffect, useRef, useState } from "react";

const servicesData = [
  {
    icon: "🏠",
    title: "Residential Design",
    description:
      "Create stunning living spaces that perfectly balance aesthetics and functionality for your home.",
    image: "/images/resident.jpeg",
  },
  {
    icon: "🏢",
    title: "Commercial Spaces",
    description:
      "Professional office and retail environments designed to enhance productivity and brand identity.",
    image: "/images/commercial.jpg",
  },
  {
    icon: "💡",
    title: "Lighting Design",
    description:
      "Strategic lighting solutions that transform ambiance and highlight architectural features.",
    image: "/images/Lighting.jpg",
  },
  {
    icon: "🎨",
    title: "Color Consultation",
    description:
      "Expert color palettes that create harmony and express your unique personality.",
    image: "/images/NS1.jpg",
  },
  {
    icon: "🪑",
    title: "Custom Furniture",
    description:
      "Bespoke furniture pieces crafted to fit your space and complement your design vision.",
    image: "/images/furniture.jpg",
  },
  {
    icon: "🖼️",
    title: "Art Curation",
    description:
      "Carefully selected artwork and decor to complete your interior design narrative.",
    image: "/images/art.jpeg",
  },
];

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="services"
        className="relative py-24 mb-20 bg-white scroll-mt-32"
        style={{
          isolation: "isolate",
          zIndex: 1,
          position: "relative",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            className={`text-[42px] text-center mb-16 text-[#2c3e50] font-light tracking-[2px] transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            style={{ position: "relative", zIndex: 2 }}
          >
            Our Services
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1200px] mx-auto px-12"
            style={{ position: "relative", zIndex: 2 }}
          >
            {servicesData.map((service, index) => (
              <div
                key={service.title}
                className={`service-card relative p-12 bg-[#f8f9fa] text-center transition-all duration-700 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-16 scale-90"
                }`}
                style={{
                  borderRadius: "0px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                  position: "relative",
                  zIndex: 3,
                  backgroundColor: "#f8f9fa",
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {service.image && (
                  <div className="mb-6 -mx-12 -mt-12 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-500"
                      style={{ display: "block" }}
                    />
                  </div>
                )}
                <h3 className="service-title text-2xl mb-4 text-[#2c3e50] transition-transform duration-300">
                  {service.title}
                </h3>
                <p className="service-description text-[#1b1a1a] leading-[1.6] transition-transform duration-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .service-card:hover .service-title,
        .service-card:hover .service-description {
          transform: translateX(5px);
        }

        .service-card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default Services;
