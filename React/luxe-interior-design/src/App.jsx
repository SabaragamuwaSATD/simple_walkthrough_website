import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ModernParallax from "./components/ModernParallax";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";

// Home Page Component
const HomePage = () => {
  return (
    <>
      {/* Parallax Background - Lowest z-index */}
      <div style={{ position: "relative", zIndex: 1, isolation: "isolate" }}>
        <ModernParallax />
      </div>

      {/* Hero Section - Low z-index */}
      <div style={{ position: "relative", zIndex: 10, isolation: "isolate" }}>
        <Hero />
      </div>

      {/* Services Section - Higher z-index with white background */}
      <div
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
        {/* Navbar - Always on top */}
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
