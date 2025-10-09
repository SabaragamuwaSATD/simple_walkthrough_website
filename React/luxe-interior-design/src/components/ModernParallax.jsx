import React, { useEffect, useRef, useState } from "react";

const ModernParallax = () => {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height - window.innerHeight);
        setScrollY(scrollProgress);

        // Check if the parallax section is still in view
        const sectionBottom = rect.bottom;
        setIsInView(sectionBottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-gray-900">
      {/* Hero Section with Parallax */}
      <div ref={containerRef} className="relative h-[200vh] overflow-hidden">
        {/* Background Layer - Slowest */}
        <div
          className="fixed top-0 left-0 w-full h-screen"
          style={{
            transform: `translateY(${scrollY * 50}px)`,
            transition: "transform 0.1s ease-out",
            display: isInView ? "block" : "none",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 z-10" />
          <img
            src="/images/DmOffice.jpg"
            alt="Office Interior"
            className="w-full h-full object-cover opacity-60 blur-sm"
          />
        </div>

        {/* Mid Layer - Medium Speed */}
        <div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center"
          style={{
            transform: `translateY(${scrollY * 150}px) scale(${
              1 + scrollY * 0.2
            })`,
            opacity: Math.max(0, 1 - scrollY * 1.5),
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            display: isInView ? "flex" : "none",
          }}
        >
          <img
            src="/images/DmOffice.jpg"
            alt="Office Interior Detail"
            className="w-4/5 h-4/5 object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Overlay Pattern - Fast */}
        <div
          className="fixed top-0 left-0 w-full h-screen pointer-events-none"
          style={{
            transform: `translateY(${scrollY * 200}px)`,
            opacity: Math.max(0, 1 - scrollY * 2),
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            display: isInView ? "block" : "none",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900" />
        </div>

        {/* Text Content - Fastest */}
        <div
          className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-20"
          style={{
            transform: `translateY(${scrollY * 300}px)`,
            opacity: Math.max(0, 1 - scrollY * 1.2),
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            display: isInView ? "flex" : "none",
          }}
        >
          <div className="text-center px-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              DM Interior
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
              Experience luxury living with our premium interior design
              solutions
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Explore
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20"
          style={{
            opacity: Math.max(0, 1 - scrollY * 3),
            transition: "opacity 0.3s ease-out",
            display: isInView ? "block" : "none",
          }}
        >
          <div className="flex flex-col items-center gap-2 text-white animate-bounce">
            <span className="text-sm uppercase tracking-wider">Scroll</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section with Clear Background and Glass Effects */}
      <div className="relative h-screen overflow-hidden">
        {/* Clear Background Image - Fixed within this section only */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Agroventures.jpg"
            alt="Interior Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("Background image failed to load:", e.target.src);
              e.target.src = "/images/about.jpg"; // Fallback image
            }}
            onLoad={(e) => {
              console.log(
                "Background image loaded successfully:",
                e.target.src
              );
            }}
          />
          {/* Light overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content with Glass Effects */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-16 h-full flex flex-col justify-center">
          {/* Main Content Cards with Glass Effect */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Innovative Design
              </h2>
              <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                Our interior designs combine elegance with functionality,
                creating environments that inspire creativity and comfort. Every
                detail is carefully crafted to enhance your living experience.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Luxury Experience
              </h2>
              <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                From premium materials to sophisticated lighting solutions,
                every element works in harmony to create spaces where luxury
                meets practicality and style exceeds expectations.
              </p>
            </div>
          </div>

          {/* Feature Cards with Strong Glass Effect */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Modern Aesthetics",
                description:
                  "Contemporary design elements that create stunning visual impact",
              },
              {
                title: "Premium Materials",
                description:
                  "Carefully selected high-quality materials for lasting beauty",
              },
              {
                title: "Custom Solutions",
                description:
                  "Tailored designs that perfectly match your lifestyle and preferences",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400/80 to-purple-500/80 backdrop-blur-sm rounded-full mb-4 flex items-center justify-center border border-white/30 shadow-lg">
                  <div className="w-6 h-6 bg-white rounded-full opacity-90 shadow-inner" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-lg">
                  {feature.title}
                </h3>
                <p className="text-white/90 text-sm drop-shadow-md">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernParallax;
