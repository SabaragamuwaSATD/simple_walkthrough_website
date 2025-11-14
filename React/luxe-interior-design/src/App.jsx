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
    <>
      {/* Parallax Background - Lowest z-index */}
      <div
        id="home"
        style={{ position: "relative", zIndex: 1, isolation: "isolate" }}
      >
        <ModernParallax />
      </div>

      {/* Hero Section - Low z-index */}
      <div style={{ position: "relative", zIndex: 10, isolation: "isolate" }}>
        <Hero />
      </div>

      {/* Services Section - Higher z-index with white background */}
      <div
        id="services"
        style={{
          position: "relative",
          zIndex: 100,
          isolation: "isolate",
          backgroundColor: "#ffffff",
        }}
      >
        <Services />
      </div>

      {/* Portfolio Section - Higher z-index */}
      <div
        id="portfolio"
        style={{
          position: "relative",
          zIndex: 100,
          isolation: "isolate",
          backgroundColor: "#ffffff",
        }}
      >
        <Portfolio />
      </div>

      {/* About Section - Higher z-index */}
      <div
        id="about"
        style={{
          position: "relative",
          zIndex: 100,
          isolation: "isolate",
          backgroundColor: "#ffffff",
        }}
      >
        <About />
      </div>

      {/* Contact Section - Higher z-index */}
      <div
        id="contact"
        style={{
          position: "relative",
          zIndex: 100,
          isolation: "isolate",
          backgroundColor: "#ffffff",
        }}
      >
        <Contact />
      </div>

      {/* Footer - Highest z-index */}
      <div
        style={{
          position: "relative",
          zIndex: 100,
          isolation: "isolate",
          backgroundColor: "#1a1a1a",
        }}
      >
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div style={{ position: "relative", zIndex: 1000 }}>
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
