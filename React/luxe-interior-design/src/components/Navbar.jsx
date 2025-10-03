import React from 'react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-md p-4 flex justify-between items-center shadow-md z-50">
            <a href="#home" className="logo flex items-center justify-center w-11 h-11 bg-gray-800 border border-yellow-500 rounded-lg">
                <img src="/logo/dm.webp" alt="LUXE Logo" className="w-full h-full object-contain p-1" />
            </a>
            <div className="menu-toggle cursor-pointer flex flex-col gap-1 md:hidden">
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
            </div>
            <ul className="nav-links hidden md:flex gap-10">
                <li><a href="#home" className="text-gray-800 text-sm uppercase tracking-wide hover:text-yellow-500">Home</a></li>
                <li><a href="#services" className="text-gray-800 text-sm uppercase tracking-wide hover:text-yellow-500">Services</a></li>
                <li><a href="#portfolio" className="text-gray-800 text-sm uppercase tracking-wide hover:text-yellow-500">Portfolio</a></li>
                <li><a href="#about" className="text-gray-800 text-sm uppercase tracking-wide hover:text-yellow-500">About</a></li>
                <li><a href="#contact" className="text-gray-800 text-sm uppercase tracking-wide hover:text-yellow-500">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;