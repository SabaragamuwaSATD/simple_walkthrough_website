import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, sectionId) => {
    // Prevent default anchor behavior
    if (e && e.preventDefault) e.preventDefault();

    // If already on homepage, just scroll to the section
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Otherwise navigate to home and pass the section id in state
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-lg p-4 flex justify-between items-center shadow-lg z-50 border-b border-white/10">
      {/* Left group: logo + company name */}
      <div className="flex items-center gap-3">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="logo flex items-center justify-center w-11 h-11 bg-gray-900 border border-red-500 rounded-lg"
        >
          <img
            src="/logo/dm.webp"
            alt="DM Interior Studio Logo"
            className="w-full h-full object-contain p-1"
          />
        </a>
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="text-white text-sm md:text-base tracking-wide hover:text-red-500 transition-colors duration-300"
        >
          DM Interior Studio
        </a>
      </div>

      <div className="menu-toggle cursor-pointer flex flex-col gap-1 md:hidden">
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </div>

      <ul className="nav-links hidden md:flex gap-10">
        <li>
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#services"
            onClick={(e) => handleNavClick(e, "services")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#portfolio"
            onClick={(e) => handleNavClick(e, "portfolio")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Portfolio
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "about")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
