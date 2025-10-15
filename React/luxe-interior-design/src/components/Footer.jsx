import React, { useState, useEffect } from "react";

const Footer = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const footer = document.querySelector(".footer-container");
    if (footer) {
      footer.addEventListener("mousemove", handleMouseMove);
      return () => footer.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const handleSubscribe = () => {
    if (email && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const SocialIcon = ({ href, label, icon, delay }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-[1px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        <div className="w-full h-full rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/0 via-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-red-500/0 group-hover:from-rose-500/20 group-hover:to-red-500/20 transition-all duration-700" />
          <span className="relative z-10 text-white/70 group-hover:text-red-400 transition-all duration-300 group-hover:scale-110">
            {icon}
          </span>
          <div className="absolute -inset-10 bg-red-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </a>
  );

  const FooterLink = ({ href, children, delay = 0 }) => (
    <a
      href={href}
      className="group relative inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-red-500 to-rose-500 group-hover:w-full transition-all duration-300" />
      </span>
      <svg
        className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );

  const InfoCard = ({ icon, title, content, delay }) => (
    <div
      className="group relative"
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative h-full rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-[1px] transition-all duration-500 group-hover:scale-[1.02]">
        <div className="h-full rounded-3xl bg-black/60 backdrop-blur-2xl p-6 overflow-hidden relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {title}
              </h4>
            </div>
            <div className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <footer className="footer-container relative overflow-hidden bg-black">
      {/* Dynamic background effects */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/5 to-rose-500/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "30s" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 70%)",
          }}
        />

        {/* Mouse follow gradient */}
        <div
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-20 transition-all duration-300 ease-out"
          style={{
            background:
              "radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)",
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Premium glass divider */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent h-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent h-[1px] blur-sm" />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Main brand section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-3xl blur-2xl" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 p-[1px]">
                <div className="w-full h-full rounded-2xl bg-black/80 backdrop-blur-xl flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                    DM
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              DM Interior Studio
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transforming spaces into extraordinary experiences through
            innovative design and meticulous craftsmanship
          </p>
        </div>

        {/* Interactive cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <InfoCard
            delay={100}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
            title="Design Excellence"
            content={
              <div className="space-y-2">
                <p>Award-winning interior solutions</p>
                <p className="text-xs text-red-400/60">
                  500+ Projects Completed
                </p>
              </div>
            }
          />

          <InfoCard
            delay={200}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Business Hours"
            content={
              <div className="space-y-1">
                <p>Monday - Friday: 9:00 - 18:00</p>
                <p>Saturday: 10:00 - 16:00</p>
                <p className="text-xs text-red-400/60">24/7 Online Support</p>
              </div>
            }
          />

          <InfoCard
            delay={300}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            title="Visit Our Studio"
            content={
              <div className="space-y-1">
                <p>123 Design Avenue</p>
                <p>Colombo, Sri Lanka</p>
                <p className="text-xs text-red-400/60 cursor-pointer hover:text-red-400">
                  Get Directions →
                </p>
              </div>
            }
          />

          <InfoCard
            delay={400}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
            title="Get In Touch"
            content={
              <div className="space-y-1">
                <p className="hover:text-red-400 cursor-pointer transition-colors">
                  +94 11 222 3344
                </p>
                <p className="text-xs hover:text-red-400 cursor-pointer transition-colors">
                  hello@dminterior.com
                </p>
                <p className="text-xs text-red-400/60">Response within 24h</p>
              </div>
            }
          />
        </div>

        {/* Newsletter section */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-[1px]">
              <div className="rounded-3xl bg-black/80 backdrop-blur-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                  Stay Inspired
                </h3>
                <p className="text-gray-400 mb-6">
                  Get exclusive design insights and early access to our latest
                  collections
                </p>
                <div className="flex gap-3 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                      placeholder="Enter your email"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-all duration-300 text-white placeholder-gray-500"
                    />
                    {subscribed && (
                      <div className="absolute -top-8 left-0 text-green-400 text-sm animate-bounce">
                        ✓ Successfully subscribed!
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-black font-bold hover:shadow-[0_20px_40px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Subscribe
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  No spam, unsubscribe anytime. View our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <FooterLink href="#home" delay={100}>
                Home
              </FooterLink>
              <FooterLink href="#portfolio" delay={150}>
                Portfolio
              </FooterLink>
              <FooterLink href="#services" delay={200}>
                Services
              </FooterLink>
              <FooterLink href="#about" delay={250}>
                About
              </FooterLink>
              <FooterLink href="#contact" delay={300}>
                Contact
              </FooterLink>
              <FooterLink href="#blog" delay={350}>
                Blog
              </FooterLink>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Services
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <FooterLink href="#residential">Residential Design</FooterLink>
              <FooterLink href="#commercial">Commercial Spaces</FooterLink>
              <FooterLink href="#consultation">Design Consultation</FooterLink>
              <FooterLink href="#renovation">Renovation Projects</FooterLink>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3 flex-wrap">
              <SocialIcon
                href="https://instagram.com"
                label="Instagram"
                delay={100}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                }
              />
              <SocialIcon
                href="https://facebook.com"
                label="Facebook"
                delay={150}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                }
              />
              <SocialIcon
                href="https://twitter.com"
                label="Twitter"
                delay={200}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                }
              />
              <SocialIcon
                href="https://linkedin.com"
                label="LinkedIn"
                delay={250}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
              <SocialIcon
                href="https://pinterest.com"
                label="Pinterest"
                delay={300}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                  </svg>
                }
              />
              <SocialIcon
                href="https://youtube.com"
                label="YouTube"
                delay={350}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {year} Fianto Solutions. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#privacy"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Cookie Settings
              </a>
              <a
                href="#sitemap"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
