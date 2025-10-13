import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-lg p-4 flex justify-between items-center shadow-lg z-50 border-b border-white/10">
      <a
        href="#home"
        className="logo flex items-center justify-center w-11 h-11 bg-gray-900 border border-red-500 rounded-lg"
      >
        <img
          src="/logo/dm.webp"
          alt="LUXE Logo"
          className="w-full h-full object-contain p-1"
        />
      </a>
      <div className="menu-toggle cursor-pointer flex flex-col gap-1 md:hidden">
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </div>
      <ul className="nav-links hidden md:flex gap-10">
        <li>
          <a
            href="#home"
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#services"
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#portfolio"
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            Portfolio
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="text-white text-sm uppercase tracking-wide hover:text-red-500 transition-colors duration-300"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#contact"
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
