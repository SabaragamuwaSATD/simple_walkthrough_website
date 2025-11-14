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

        // Only show fixed layers while any part intersects viewport
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsInView(inView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="w-full bg-gray-900 pb-10 relative"
      style={{ zIndex: 0, isolation: "isolate" }}
    >
      {/* Hero Section with Parallax */}
      <div ref={containerRef} className="relative h-[200vh] overflow-hidden">
        {/* Background Layer - Slowest */}
        <div
          className="fixed top-0 left-0 w-full h-screen z-0"
          style={{
            transform: `translateY(${scrollY * 50}px)`,
            transition: "transform 0.1s ease-out",
            display: isInView ? "block" : "none",
            pointerEvents: "none",
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
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-[1]"
          style={{
            transform: `translateY(${scrollY * 150}px) scale(${
              1 + scrollY * 0.2
            })`,
            opacity: Math.max(0, 1 - scrollY * 1.5),
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            display: isInView ? "flex" : "none",
            pointerEvents: "none",
          }}
        >
          <img
            src="/images/DmOffice.jpg"
            alt="Office Interior Detail"
            className="w-[95%] h-4/5 object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Overlay Pattern - Fast */}
        <div
          className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[2]"
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
          style={{
            position: "fixed",
            right: "5%", // 👈 CHANGE THIS: Distance from right edge (lower = more right)
            top: "50%", // 👈 CHANGE THIS: Vertical position (50% = center)
            transform: `translateY(-50%) translateY(${scrollY * 300}px)`,
            opacity: Math.max(0, 1 - scrollY * 1.2),
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            display: isInView ? "block" : "none",
            width: "45%", // 👈 CHANGE THIS: Width of the card
            maxWidth: "400px", // 👈 CHANGE THIS: Maximum width limit
            zIndex: 20,
          }}
        >
          {/* <div
          className="fixed top-0 right-0 w-auto h-screen flex items-center justify-center z-20"
          style={{
            transform: `translateY(${scrollY * 300}px)`,
            opacity: Math.max(0, 1 - scrollY * 1.2),
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            display: isInView ? "flex" : "none",
            right: "10%",
            width: "35%",
          }}
        > */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-10 md:p-12 w-full border border-white/20 shadow-2xl">
            {/* <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              DM Interior
            </h1> */}
            <p className="text-xl md:text-2xl text-gray-100 mb-10 text-left leading-relaxed">
              Experience luxury living with our premium interior design
              solutions
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-4 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Explore
              </button>
              <button className="px-4 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative h-screen overflow-hidden" style={{ zIndex: 1 }}>
        {/* Clear Background Image - Fixed within this section only */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/DMOffice3.jpg"
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
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-16 h-full flex flex-col items-center justify-center text-center">
          {/* Main Content Cards with Glass Effect */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 place-items-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Innovative Design
              </h2>
              {/* <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                Our interior designs combine elegance with functionality,
                creating environments that inspire creativity and comfort. Every
                detail is carefully crafted to enhance your living experience.
              </p> */}
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Luxury Experience
              </h2>
              {/* <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                From premium materials to sophisticated lighting solutions,
                every element works in harmony to create spaces where luxury
                meets practicality and style exceeds expectations.
              </p> */}
            </div>
          </div>

          {/* Feature Cards with Strong Glass Effect */}
          <div className="grid md:grid-cols-3 gap-6 place-items-center">
            {[
              { title: "Modern Aesthetics" },
              { title: "Premium Materials" },
              { title: "Custom Solutions" },
            ].map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
              >
                {/* <div className="w-12 h-12 bg-gradient-to-br from-red-600/90 to-gray-800 backdrop-blur-sm rounded-full mb-4 flex items-center justify-center border border-red-500/50 shadow-lg mx-auto">
                  <div className="w-6 h-6 backdrop-blur-md rounded-full border border-white/60 bg-white/40 shadow-inner" />
                </div> */}

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
