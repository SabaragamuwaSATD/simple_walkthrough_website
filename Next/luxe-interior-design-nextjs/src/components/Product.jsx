"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";

// Loading Animation Component
const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Loader */}
        <motion.div
          className="relative w-20 h-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-red-600/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full"></div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white font-medium"
        >
          Loading Image...
        </motion.div>

        {/* Animated Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-red-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Image Modal Component with Animations
const ImageModal = ({
  isOpen,
  onClose,
  project,
  currentIndex,
  totalImages,
  onNext,
  onPrev,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset loading state when project changes
  useEffect(() => {
    if (project) {
      setIsLoading(true);
      setImageLoaded(false);

      // Preload the image
      const img = new Image();
      img.src = project.image;
      img.onload = () => {
        // Add a minimum loading time for smooth animation
        setTimeout(() => {
          setImageLoaded(true);
          setIsLoading(false);
        }, 800); // 800ms minimum loading time
      };
      img.onerror = () => {
        setImageLoaded(true);
        setIsLoading(false);
      };
    }
  }, [project]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          {/* Navigation Counter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
          >
            <span className="text-white font-medium text-sm">
              {currentIndex + 1} / {totalImages}
            </span>
          </motion.div>

          {/* Previous Button */}
          {currentIndex > 0 && !isLoading && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          )}

          {/* Next Button */}
          {currentIndex < totalImages - 1 && !isLoading && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )}

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl mx-4 h-[80vh] flex flex-col"
          >
            {/* Loading Animation */}
            <AnimatePresence>
              {isLoading && <LoadingAnimation />}
            </AnimatePresence>

            {/* Image Container with 3D Effect */}
            <AnimatePresence>
              {imageLoaded && (
                <motion.div
                  className="relative z-10 flex-1 flex items-center justify-center p-8"
                  initial={{ rotateY: -15, opacity: 0, scale: 0.9 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 15, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="relative max-w-4xl w-full">
                    <motion.img
                      key={project.id}
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-2xl"
                      initial={{ scale: 0.95, rotateY: 10 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Project Info */}
            <AnimatePresence>
              {imageLoaded && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-10 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-md p-6 rounded-b-2xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-2"
                      >
                        {project.category.toLowerCase()}({currentIndex + 1})
                      </motion.div>
                      <motion.h3
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="text-2xl font-bold text-white mb-2"
                      >
                        {project.title}
                      </motion.h3>
                      <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 text-sm"
                      >
                        {project.description}
                      </motion.p>
                    </div>
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Product() {
  const [activeCategory, setActiveCategory] = useState("House");
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const imageRefs = useRef([]);
  const observerRef = useRef();
  const containerRef = useRef();
  const headerRef = useRef();

  // Project data for each category
  const projectData = {
    House: [
      {
        id: 1,
        title: "Modern Villa - Miami",
        category: "House",
        image: "/images/home (1).jpeg",
        description:
          "This simple black shows how each house that can stimulate to a general breathe.",
      },
      {
        id: 2,
        title: "Cozy Modern House with Pool",
        category: "House",
        image: "/images/home (2).jpeg",
        description:
          "This simple black shows how each house that can stimulate to a general breathe.",
      },
      {
        id: 3,
        title: "Luxury House Exterior",
        category: "House",
        image: "/images/home (3).jpeg",
        description:
          "This simple black shows how each house that can stimulate to a general breathe.",
      },
      {
        id: 4,
        title: "Contemporary Luxury Home",
        category: "House",
        image: "/images/home (4).jpeg",
        description:
          "This simple black shows how each house that can stimulate to a general breathe.",
      },
      {
        id: 5,
        title: "Modern Family House",
        category: "House",
        image: "/images/home (5).jpeg",
        description:
          "This simple black shows how each house that can stimulate to a general breathe.",
      },
      {
        id: 6,
        title: "Designer House Complex",
        category: "House",
        image: "/images/home (6).jpeg",
        description:
          "This simple black shows how each house that can stimulate to a general breathe.",
      },
    ],
    Residentials: [
      {
        id: 1,
        title: "Luxury Residential Complex",
        category: "Residentials",
        image: "/images/Viana.jpg",
        description: "Premium residential development with modern amenities and spacious living areas.",
      },
      {
        id: 2,
        title: "Modern Apartment Building",
        category: "Residentials",
        image: "/images/home (1).jpeg",
        description: "Contemporary apartment complex with state-of-the-art facilities.",
      },
      {
        id: 3,
        title: "Executive Residences",
        category: "Residentials",
        image: "/images/home (2).jpeg",
        description: "High-end residential units designed for comfort and luxury.",
      },
      {
        id: 4,
        title: "Urban Living Spaces",
        category: "Residentials",
        image: "/images/home (3).jpeg",
        description: "Modern urban residences with contemporary architecture.",
      },
    ],
    "Corporate offices": [
      {
        id: 1,
        title: "Modern Corporate Office",
        category: "Corporate offices",
        image: "/images/CLB1.jpg",
        description: "Contemporary office space designed for productivity and collaboration.",
      },
      {
        id: 2,
        title: "Executive Office Suite",
        category: "Corporate offices",
        image: "/images/DmOffice.jpg",
        description: "Premium office environment with cutting-edge design.",
      },
      {
        id: 3,
        title: "Corporate Headquarters",
        category: "Corporate offices",
        image: "/images/home (4).jpeg",
        description: "Flagship office building with innovative workspace solutions.",
      },
      {
        id: 4,
        title: "Business Center",
        category: "Corporate offices",
        image: "/images/home (5).jpeg",
        description: "Modern business hub designed for efficiency and style.",
      },
    ],
    "Retail Showrooms": [
      {
        id: 1,
        title: "Premium Retail Space",
        category: "Retail Showrooms",
        image: "/images/NS1.jpg",
        description: "Elegant retail showroom with modern design elements and customer-focused layout.",
      },
      {
        id: 2,
        title: "Luxury Brand Showroom",
        category: "Retail Showrooms",
        image: "/images/Viana.jpg",
        description: "High-end retail space designed to showcase premium products.",
      },
      {
        id: 3,
        title: "Contemporary Retail Gallery",
        category: "Retail Showrooms",
        image: "/images/home (6).jpeg",
        description: "Modern showroom with innovative display solutions.",
      },
      {
        id: 4,
        title: "Flagship Store Design",
        category: "Retail Showrooms",
        image: "/images/CLB1.jpg",
        description: "Iconic retail space with unique architectural features.",
      },
    ],
    "DM Factory Complex": [
      {
        id: 1,
        title: "Industrial Complex Design",
        category: "DM Factory Complex",
        image: "/images/SEBSA1.jpg",
        description: "Modern industrial facility with functional design and efficiency.",
      },
      {
        id: 2,
        title: "Manufacturing Hub",
        category: "DM Factory Complex",
        image: "/images/home (1).jpeg",
        description: "State-of-the-art manufacturing facility with advanced infrastructure.",
      },
      {
        id: 3,
        title: "Production Center",
        category: "DM Factory Complex",
        image: "/images/home (2).jpeg",
        description: "Contemporary production facility with optimized workflow design.",
      },
      {
        id: 4,
        title: "Industrial Park",
        category: "DM Factory Complex",
        image: "/images/home (3).jpeg",
        description: "Comprehensive industrial complex with modern amenities.",
      },
    ],
    "Restaurants and Coffee bars": [
      {
        id: 1,
        title: "Modern Restaurant Interior",
        category: "Restaurants and Coffee bars",
        image: "/images/DmOffice.jpg",
        description: "Contemporary dining space with welcoming atmosphere and elegant design.",
      },
      {
        id: 2,
        title: "Artisan Coffee Bar",
        category: "Restaurants and Coffee bars",
        image: "/images/about.jpg",
        description: "Stylish coffee bar with cozy ambiance and modern aesthetics.",
      },
      {
        id: 3,
        title: "Fine Dining Restaurant",
        category: "Restaurants and Coffee bars",
        image: "/images/Viana.jpg",
        description: "Upscale restaurant interior with sophisticated design elements.",
      },
      {
        id: 4,
        title: "Casual Dining Space",
        category: "Restaurants and Coffee bars",
        image: "/images/NS1.jpg",
        description: "Relaxed dining environment with contemporary comfort.",
      },
    ],
    Hotels: [
      {
        id: 1,
        title: "Luxury Hotel Design",
        category: "Hotels",
        image: "/images/about.jpg",
        description: "Elegant hotel interior with premium finishes and world-class amenities.",
      },
      {
        id: 2,
        title: "Boutique Hotel Suite",
        category: "Hotels",
        image: "/images/Viana.jpg",
        description: "Exclusive hotel rooms designed for ultimate comfort and luxury.",
      },
      {
        id: 3,
        title: "Resort Hotel Complex",
        category: "Hotels",
        image: "/images/home (4).jpeg",
        description: "Comprehensive hotel resort with stunning architecture and design.",
      },
      {
        id: 4,
        title: "Urban Hotel Lobby",
        category: "Hotels",
        image: "/images/CLB1.jpg",
        description: "Modern hotel entrance with impressive architectural features.",
      },
    ],
  };

  const categories = [
    "House",
    "Residentials",
    "Corporate offices",
    "Retail Showrooms",
    "DM Factory Complex",
    "Restaurants and Coffee bars",
    "Hotels",
  ];
  const currentProjects = projectData[activeCategory] || [];

  // Modal handlers
  const openModal = (project, index) => {
    setSelectedProject(project);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = "unset";
  };

  const goToNext = () => {
    if (currentImageIndex < currentProjects.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setSelectedProject(currentProjects[nextIndex]);
    }
  };

  const goToPrev = () => {
    if (currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setSelectedProject(currentProjects[prevIndex]);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  // Intersection Observer for progressive image loading
  useEffect(() => {
    // ALL images should always be visible immediately
    setVisibleImages(new Set([0, 1, 2, 3, 4, 5]));

    // We can remove the intersection observer since all images show immediately
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe images when they mount
  useEffect(() => {
    // No need to observe since all images show immediately
    // All images are visible from the start
  }, [activeCategory]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const scrollTop = window.pageYOffset;
        const containerTop = container.offsetTop;
        const containerHeight = container.scrollHeight;
        const windowHeight = window.innerHeight;

        const progress = Math.min(
          Math.max(
            (scrollTop - containerTop + windowHeight) / containerHeight,
            0
          ),
          1
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  // Reset when category changes
  useEffect(() => {
    setVisibleImages(new Set([0, 1, 2, 3, 4, 5])); // Show ALL images immediately
    setScrollProgress(0);
    imageRefs.current = [];
    
    // Scroll to top of page when category changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-gray-900">Projects</h1>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeCategory === category
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Section */}
      <>
        {/* Vertical Image Slider - All Categories */}
        <div
          ref={containerRef}
          className="max-w-7xl mx-auto px-4 py-8 relative"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
            {activeCategory} Projects
          </h2>

          {/* Animated Progress Line */}
          <div className="absolute left-1/2 top-20 bottom-20 w-1 -translate-x-1/2 z-10">
            {/* Background line */}
            <div className="absolute inset-0 bg-gray-200 rounded-full"></div>

            {/* Animated progress line */}
            <div
              className="absolute top-0 left-0 w-full rounded-full transition-all duration-300 ease-out"
              style={{
                height: `${scrollProgress * 100}%`,
                background: `linear-gradient(to bottom, 
                  #ef4444 0%, 
                  #f97316 25%, 
                  #eab308 50%, 
                  #22c55e 75%, 
                  #3b82f6 100%)`,
              }}
            ></div>

            {/* Progress dots */}
            {currentProjects.map((_, index) => (
              <div
                key={index}
                className="absolute w-4 h-4 rounded-full border-2 border-white bg-red-600 scale-110 shadow-lg -translate-x-1/2 transition-all duration-500"
                style={{
                  top: `${(index / (currentProjects.length - 1)) * 100}%`,
                  left: "50%",
                }}
              ></div>
            ))}
          </div>

          <div className="space-y-16">
            {currentProjects.map((project, index) => {
              // Determine if this row should have image on right (even index) or left (odd index)
              const isEvenIndex = index % 2 === 0;

              return (
                <div
                  key={project.id}
                  ref={(el) => (imageRefs.current[index] = el)}
                  data-image-index={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative"
                >
                  {/* Description Section */}
                  <div
                    className={`space-y-6 ${
                      isEvenIndex ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {activeCategory.toLowerCase()}({index + 1})
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {project.title}
                    </h3>

                    <div className="h-1 w-16 bg-red-600 rounded"></div>

                    <p className="text-gray-600 text-lg leading-relaxed">
                      {project.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Category:</span>{" "}
                        {project.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Project ID:</span>{" "}
                        {project.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span> Completed
                      </p>
                    </div>

                    <button
                      onClick={() => openModal(project, index)}
                      className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      View Details
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Image Section */}
                  <div
                    className={`relative ${
                      isEvenIndex ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div
                      className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg group cursor-pointer"
                      onClick={() => openModal(project, index)}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/images/DmOffice.jpg"; // Fallback
                        }}
                      />

                      {/* Image overlay on hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
                          <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>

      {/* Image Modal with 3D Animations */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
        currentIndex={currentImageIndex}
        totalImages={currentProjects.length}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    </div>
  );
}