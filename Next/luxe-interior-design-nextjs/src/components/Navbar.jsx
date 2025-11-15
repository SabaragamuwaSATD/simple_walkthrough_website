"use client";
import React from "react";

const Navbar = () => {
  const handleNavigation = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-lg p-4 flex justify-between items-center shadow-lg z-50 border-b border-white/10">
      {/* Left group: logo + company name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleNavigation("home")}
          className="logo flex items-center justify-center w-11 h-11 bg-gray-900 border border-red-500 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img
            src="/logo/dm.webp"
            alt="DM Interior Studio Logo"
            className="w-full h-full object-contain p-1"
          />
        </button>
        <button
          onClick={() => handleNavigation("home")}
          className="text-white text-sm md:text-base tracking-wide hover:text-red-500 transition-colors duration-300"
        >
          DM Interior Studio
        </button>
      </div>

      <div className="menu-toggle cursor-pointer flex flex-col gap-1 md:hidden">
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </div>

      <ul className="nav-links hidden md:flex gap-10">
        <li>
          <button
            onClick={() => handleNavigation("home")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("services")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Services
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("portfolio")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Portfolio
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("about")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            About
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("contact")}
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Contact
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;