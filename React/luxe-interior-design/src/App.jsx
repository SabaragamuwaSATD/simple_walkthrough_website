import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
// import Model from "./components/Model";

const App = () => {
  return (
    <div>
      {/* <Model
        scrollProgress={scrollProgress} // Pass scroll progress from your GSAP timeline
        isVisible={true}
      /> */}
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
