import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const About = () => {
  // Dilushi refs
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  // Studio refs
  const studioImageRef = useRef(null);
  const studioContainerRef = useRef(null);
  const studioGlowRef = useRef(null);

  // Award hover state
  const [hoveredAward, setHoveredAward] = useState(null);

  // Awards data with positions (percentage-based for responsiveness)
  const awards = [
    {
      id: 1,
      title: "International Women Achievers Award",
      year: "2023",
      organization: "Taj Pedavura Colombo Crystal Haven",
      // description:
      //   "Honoring exceptional women leaders who have made significant contributions to their industries and communities through innovation and excellence",
      image: "/images/women-achievers-award.jpg",
      position: { left: "85%", top: "78%" },
    },
    {
      id: 2,
      title: "Sri Lanka Wanithabhimana",
      year: "2023",
      organization: "NDB Bank & Sinhala Media",
      // description:
      //   "Prestigious recognition for women who have excelled in their professional fields and contributed significantly to Sri Lankan society",
      image: "/images/wanithabhimana-award.jpg",
      position: { left: "58%", top: "80%" },
    },
    {
      id: 3,
      title: "Global CEO Top Businesswomen Awards",
      year: "2025",
      organization: "Global CEO Excellence Awards",
      // description:
      //   "Recognized for outstanding leadership and innovation in interior design, acknowledging excellence in entrepreneurship and business management",
      image: "/images/global-ceo-award.jpg",
      position: { left: "38%", top: "82%" },
    },
    {
      id: 4,
      title: "Women Entrepreneur Excellence",
      year: "2023",
      organization: "Business Excellence Foundation",
      // description:
      //   "Leadership excellence in building and managing a successful interior design enterprise with innovative business strategies",
      image: "/images/entrepreneur-award.jpg",
      position: { left: "18%", top: "85%" },
    },
  ];

  useEffect(() => {
    const pairs = [
      { container: containerRef.current, glow: glowRef.current },
      { container: studioContainerRef.current, glow: studioGlowRef.current },
    ].filter((p) => p.container && p.glow);

    if (!pairs.length) return;

    const enter = (glow) =>
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out",
      });
    const leave = (glow) =>
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });

    const handlers = pairs.map(({ container, glow }) => {
      const onEnter = () => enter(glow);
      const onLeave = () => leave(glow);
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      return { container, onEnter, onLeave };
    });

    return () => {
      for (const { container, onEnter, onLeave } of handlers) {
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] "
    >
      <h2 className="text-[42px] text-center mb-16 text-white font-light tracking-[3px]">
        About Us
      </h2>

      {/* DM Interior Studio (text left, image right) */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-12">
        {/* Text left */}
        <div className="about-text">
          <h3 className="text-[32px] mb-5 text-white font-light">
            DM Interior Studio
          </h3>
          <p className="text-[#b8b8b8] leading-[1.8] mb-5">
            Looking for interior designer in Sri Lanka? DM Interior Studio a
            interior design company in Sri Lanka was established with the
            purpose of delivering of Total interior design services in Sri
            Lanka.Our portfolio ranges from commercial, residential, industrial,
            home, office and recreational spaces alike. Since our launch, we
            have been always on the lookout to improvise our creativity through
            innovation. We offer some of the best of the class interior designs
            and layouts for interior designing projects in Colombo Sri Lanka Our
            creations are often unique just for the client's taste.
          </p>
          <p className="text-[#b8b8b8] leading-[1.8]">
            As a famous interior designers in Sri Lanka We understand that every
            client has a unique requirement in constructing their interior
            spaces. That it can have personalized choices which not everyone
            satisfies altogether.That is why we have our services range from
            interior design only service, interior construction only and the
            entire interior designing and construction projects as well which
            make us one of the best interior design companies in Sri Lanka. This
            gives us the opportunity to be able to offer flexibility to our
            clients based on the conveniences of their requirement. Whatever we
            do, we believe in three fundamental values that we will never
            compromise no matter what service we provide. So click below for
            more about interior design in Sri Lanka.
          </p>
        </div>

        {/* Image right */}
        <div
          ref={studioContainerRef}
          className="relative w-full h-[500px] overflow-visible cursor-pointer"
        >
          <div
            ref={studioGlowRef}
            className="absolute inset-0 bg-[#c9a961] blur-[40px] opacity-0 rounded-lg"
            style={{ zIndex: 0 }}
          />
          <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl">
            <img
              ref={studioImageRef}
              className="w-full h-full object-cover"
              src="/images/DMOffice4.jpg"
              alt="DM Interior Studio"
              onError={(e) => {
                if (e.currentTarget.src.includes("DMOffice4.jpg")) {
                  e.currentTarget.src = "/images/DMOffice4.jpeg";
                }
              }}
            />
            {/* Make overlay non-blocking for hotspot hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Dilushi Mendis (image left, text right) */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-12 mt-20">
        <div
          ref={containerRef}
          className="relative w-full h-[500px] overflow-visible cursor-pointer"
        >
          <div
            ref={glowRef}
            className="absolute inset-0 bg-[#c9a961] blur-[40px] opacity-0 rounded-lg"
            style={{ zIndex: 0 }}
          />

          {/* Image wrapper: keep overflow-hidden only around the image */}
          <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl">
            <img
              ref={imageRef}
              className="w-full h-full object-cover"
              src="/images/DilushiMendis.jpeg"
              alt="Dilushi Mendis - Chartered Architect"
            />
            {/* Make this overlay non-blocking for pointer events */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          {/* Awards overlay: moved OUTSIDE the overflow-hidden wrapper to avoid clipping */}
          <div className="absolute inset-0 z-20">
            {awards.map((award) => (
              <div
                key={award.id}
                className="absolute"
                style={{
                  left: award.position.left,
                  top: award.position.top,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredAward(award.id)}
                onMouseLeave={() => setHoveredAward(null)}
              >
                {/* Pulsing white dot */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75 w-4 h-4"></div>
                  <div className="relative bg-white rounded-full w-4 h-4 cursor-pointer shadow-lg hover:scale-150 transition-transform duration-300 border-2 border-gray-800/20"></div>
                </div>

                {/* Award Card */}
                {hoveredAward === award.id && (
                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-4 animate-fadeIn">
                    <div
                      className="bg-gradient-to-br from-white via-white to-gray-50 text-gray-800 p-7 rounded-xl shadow-2xl border border-gray-200 w-[420px]"
                      style={{
                        boxShadow:
                          "0 25px 60px rgba(0,0,0,0.35), 0 0 120px rgba(201,169,97,0.1)",
                      }}
                    >
                      {/* Gold accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#c9a961] via-[#e8c47a] to-[#c9a961] rounded-t-xl"></div>

                      {/* Subtle pattern overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.03] rounded-xl"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 1px 1px, #c9a961 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      ></div>

                      <div className="flex gap-4 relative z-10">
                        {/* Award Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 shadow-inner border border-gray-200">
                            <img
                              src={award.image}
                              alt={award.title}
                              className="w-full h-full object-contain"
                              data-base={award.image.replace(
                                /\.(jpg|jpeg|png|webp)$/i,
                                ""
                              )}
                              data-attempts="0"
                              onError={(e) => {
                                const img = e.currentTarget;
                                const base = img.dataset.base || "";
                                const attempts = Number.parseInt(
                                  img.dataset.attempts || "0",
                                  10
                                );
                                const exts = [".jpeg", ".jpg", ".webp", ".png"];
                                if (attempts < exts.length) {
                                  img.dataset.attempts = String(attempts + 1);
                                  img.src = `${base}${exts[attempts]}`;
                                } else {
                                  img.style.display = "none";
                                  const fallback = img.nextElementSibling;
                                  if (fallback) fallback.style.display = "flex";
                                }
                              }}
                            />
                            <div
                              className="hidden w-full h-full items-center justify-center"
                              aria-hidden="true"
                            >
                              <svg
                                className="w-14 h-14 text-[#c9a961]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Award Details */}
                        <div className="flex-1 min-w-0">
                          {/* Year badge */}
                          <div className="inline-flex items-center bg-gradient-to-r from-[#c9a961] to-[#e8c47a] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md">
                            {award.year}
                          </div>

                          <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-snug">
                            {award.title}
                          </h3>

                          <p className="text-[#c9a961] text-[13px] font-semibold mb-3">
                            {award.organization}
                          </p>

                          {/* <p className="text-gray-600 text-[13px] leading-relaxed whitespace-normal">
                            {award.description}
                          </p> */}
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-3 right-3 z-10">
                        <svg
                          className="w-8 h-8 text-[#c9a961] opacity-15"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#c9a961]/15 rounded-br-lg z-10"></div>
                    </div>

                    {/* Arrow pointing to dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
                      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                      <div className="absolute -top-[11px] left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default About;
