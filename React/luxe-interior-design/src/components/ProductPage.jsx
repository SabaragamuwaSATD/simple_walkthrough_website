import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProductPage = () => {
  const [activeCategory, setActiveCategory] = useState("House");
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
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
        description: "This simple black shows how each house that can stimulate to a general breathe."
      },
      {
        id: 2,
        title: "Cozy Modern House with Pool",
        category: "House", 
        image: "/images/home (2).jpeg",
        description: "This simple black shows how each house that can stimulate to a general breathe."
      },
      {
        id: 3,
        title: "Luxury House Exterior",
        category: "House",
        image: "/images/home (3).jpeg", 
        description: "This simple black shows how each house that can stimulate to a general breathe."
      },
      {
        id: 4,
        title: "Contemporary Luxury Home",
        category: "House",
        image: "/images/home (4).jpeg",
        description: "This simple black shows how each house that can stimulate to a general breathe."
      },
      {
        id: 5,
        title: "Modern Family House",
        category: "House",
        image: "/images/home (5).jpeg",
        description: "This simple black shows how each house that can stimulate to a general breathe."
      },
      {
        id: 6,
        title: "Designer House Complex",
        category: "House",
        image: "/images/home (6).jpeg",
        description: "This simple black shows how each house that can stimulate to a general breathe."
      }
    ],
    Residentials: [
      {
        id: 1,
        title: "Luxury Residential Complex",
        category: "Residentials",
        image: "/images/Viana.jpg",
        description: "Premium residential development with modern amenities."
      }
    ],
    "Corporate offices": [
      {
        id: 1,
        title: "Modern Corporate Office",
        category: "Corporate offices",
        image: "/images/CLB1.jpg",
        description: "Contemporary office space designed for productivity."
      }
    ],
    "Retail Showrooms": [
      {
        id: 1,
        title: "Premium Retail Space",
        category: "Retail Showrooms", 
        image: "/images/NS1.jpg",
        description: "Elegant retail showroom with modern design elements."
      }
    ],
    "DM Factory Complex": [
      {
        id: 1,
        title: "Industrial Complex Design",
        category: "DM Factory Complex",
        image: "/images/SEBSA1.jpg",
        description: "Modern industrial facility with functional design."
      }
    ],
    "Restaurants and Coffee bars": [
      {
        id: 1,
        title: "Modern Restaurant Interior",
        category: "Restaurants and Coffee bars",
        image: "/images/DmOffice.jpg",
        description: "Contemporary dining space with welcoming atmosphere."
      }
    ],
    Hotels: [
      {
        id: 1,
        title: "Luxury Hotel Design",
        category: "Hotels",
        image: "/images/about.jpg",
        description: "Elegant hotel interior with premium finishes."
      }
    ]
  };

  const categories = ["House", "Residentials", "Corporate offices", "Retail Showrooms", "DM Factory Complex", "Restaurants and Coffee bars", "Hotels"];
  const currentProjects = projectData[activeCategory] || [];

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
          Math.max((scrollTop - containerTop + windowHeight) / containerHeight, 0),
          1
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  // Reset when category changes
  useEffect(() => {
    setVisibleImages(new Set([0, 1, 2, 3, 4, 5])); // Show ALL images immediately
    setScrollProgress(0);
    imageRefs.current = [];
  }, [activeCategory]);

  // Auto-scroll to header when coming from "View More" button
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('scrollToHeader') === 'true' && headerRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        headerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Clear the URL parameter after scrolling
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div ref={headerRef} className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-gray-900">Projects</h1>
            <button 
              onClick={() => navigate('/')}
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

      {/* Vertical Image Slider - House Category */}
      {activeCategory === "House" && (
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-8 relative">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">House Projects</h2>
          
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
                  #3b82f6 100%)`
              }}
            ></div>
            
            {/* Progress dots */}
            {currentProjects.map((_, index) => (
              <div
                key={index}
                className="absolute w-4 h-4 rounded-full border-2 border-white bg-red-600 scale-110 shadow-lg -translate-x-1/2 transition-all duration-500"
                style={{
                  top: `${(index / (currentProjects.length - 1)) * 100}%`,
                  left: '50%'
                }}
              ></div>
            ))}
          </div>
          
          <div className="space-y-16">
            {currentProjects.map((project, index) => (
              <div 
                key={project.id} 
                ref={el => imageRefs.current[index] = el}
                data-image-index={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative"
              >
                
                {/* Left Section - Description */}
                <div className={`space-y-6 transition-all duration-700 ${
                  visibleImages.has(index) 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-100 translate-x-0'
                }`}>
                  <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    home({index + 1})
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {project.title}
                  </h3>
                  
                  <div className={`h-1 bg-red-600 rounded transition-all duration-1000 delay-300 ${
                    visibleImages.has(index) ? 'w-16' : 'w-16'
                  }`}></div>
                  
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Category:</span> {project.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Project ID:</span> {project.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Status:</span> Completed
                    </p>
                  </div>
                  
                  <button className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300">
                    View Details
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Right Section - Image */}
                <div className="relative">
                  <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg group">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/DmOffice.jpg'; // Fallback
                      }}
                    />
                    
                    {/* Image overlay on hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Image quality indicator */}
                    <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                      HD Quality
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Categories - Simple Grid */}
      {activeCategory !== "House" && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-light text-gray-900 mb-6">{activeCategory} projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/DmOffice.jpg'; // Fallback
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.category}</p>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;