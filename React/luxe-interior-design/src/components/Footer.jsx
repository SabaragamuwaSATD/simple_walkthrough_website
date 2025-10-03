import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2c3e50] text-white py-16 px-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div className="footer-section">
          <h4 className="text-xl mb-5 text-[#c9a961] font-normal">
            LUXE Studio
          </h4>
          <p className="text-[#bbb] leading-[1.8] text-base">
            Creating beautiful spaces that inspire and delight. Your vision, our
            expertise.
          </p>
        </div>
        <div className="footer-section">
          <h4 className="text-xl mb-5 text-[#c9a961] font-normal">Contact</h4>
          <p className="text-[#bbb] leading-[1.8] block mb-2.5 text-base">
            123 Design Avenue
            <br />
            New York, NY 10001
          </p>
          <p className="text-[#bbb] leading-[1.8] block mb-2.5 text-base">
            Phone: (555) 123-4567
            <br />
            Email: hello@luxestudio.com
          </p>
        </div>
        <div className="footer-section">
          <h4 className="text-xl mb-5 text-[#c9a961] font-normal">Hours</h4>
          <p className="text-[#bbb] leading-[1.8] text-base">
            Monday - Friday: 9AM - 6PM
            <br />
            Saturday: 10AM - 4PM
            <br />
            Sunday: Closed
          </p>
        </div>
        <div className="footer-section">
          <h4 className="text-xl mb-5 text-[#c9a961] font-normal">Follow Us</h4>
          <div className="flex flex-col gap-2.5">
            <a
              href="#"
              className="text-[#bbb] hover:text-[#c9a961] transition-colors duration-300 block mb-2.5 text-base"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[#bbb] hover:text-[#c9a961] transition-colors duration-300 block mb-2.5 text-base"
            >
              Pinterest
            </a>
            <a
              href="#"
              className="text-[#bbb] hover:text-[#c9a961] transition-colors duration-300 block mb-2.5 text-base"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-[#bbb] hover:text-[#c9a961] transition-colors duration-300 block mb-2.5 text-base"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-[#444] text-[#888] text-sm">
        <p>&copy; 2025 Luxe Interior Design Studio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
