import React from "react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-16 md:py-20 lg:py-25 bg-[#f8f9fa] px-4 md:px-8 lg:px-12"
    >
      <div className="max-w-[800px] mx-auto text-center">
        <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-light tracking-[2px] mb-4 md:mb-6 text-[#2c3e50]">
          Let's Create Together
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-[#666] leading-[1.6] md:leading-[1.8] mb-8 md:mb-10 px-2 md:px-0">
          Ready to transform your space? We'd love to hear about your project
          and discuss how we can bring your vision to life. Schedule a
          consultation with our design team today.
        </p>
        <a
          href="#"
          className="inline-block px-6 md:px-8 py-3 md:py-4 bg-[#c9a961] text-white text-base md:text-lg font-normal transition-all duration-300 hover:bg-[#b89851] hover:transform hover:scale-105 shadow-md hover:shadow-lg"
          style={{
            borderRadius: "0px",
            letterSpacing: "1px",
          }}
        >
          Get In Touch
        </a>
      </div>
    </section>
  );
};

export default Contact;
