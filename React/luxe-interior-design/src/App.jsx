import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ModernParallax from "./components/ModernParallax";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";

// Home Page Component - supports scrolling to sections when navigated with state
const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // If navigation provided a target section in state, scroll to it after mount
    if (location && location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

        // Clear history state so subsequent reloads don't re-trigger the scroll
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          // no-op
        }
      }, 120);
    }
  }, [location]);

  return (
    <div id="home">
      <ModernParallax />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
