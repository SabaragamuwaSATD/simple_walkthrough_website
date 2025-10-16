import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Contact = () => {
  const mountRef = useRef(null);
  const houseModelRef = useRef(null);
  const controlsRef = useRef(null);
  const autoRotationRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);
  const isInteractingRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    description: "",
  });

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const windowHeight = window.innerHeight;

        const scrollProgress = Math.max(
          0,
          Math.min(1, 1 - sectionTop / windowHeight)
        );

        setScrollY(scrollProgress * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    const updateRendererSize = () => {
      if (mountRef.current) {
        const width = mountRef.current.offsetWidth;
        const height = mountRef.current.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    updateRendererSize();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enablePan = true;
    controls.panSpeed = 1.0;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enabled = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xc9a961, 0.6);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.4);
    rimLight.position.set(0, 3, -8);
    scene.add(rimLight);

    const interiorLight1 = new THREE.PointLight(0xffffff, 1.5, 50);
    interiorLight1.position.set(0, 3, 0);
    scene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xfff4e6, 1.0, 50);
    interiorLight2.position.set(2, 2, 2);
    scene.add(interiorLight2);

    const interiorLight3 = new THREE.PointLight(0xfff4e6, 1.0, 50);
    interiorLight3.position.set(-2, 2, -2);
    scene.add(interiorLight3);

    const loader = new GLTFLoader();

    loader.load(
      "/models/house.glb",
      (gltf) => {
        const model = gltf.scene;
        houseModelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material = child.material.clone();
              child.material.side = THREE.DoubleSide;
              child.material.transparent = false;
            }
          }
        });

        controls.target.set(0, 0, 0);
        scene.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    const handleInteractionStart = () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }

      if (!isInteractingRef.current) {
        if (houseModelRef.current) {
          autoRotationRef.current = houseModelRef.current.rotation.y;
        }
        isInteractingRef.current = true;
        setIsInteracting(true);
        controls.enabled = true;
      }
    };

    const handleInteractionEnd = () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      interactionTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
        setIsInteracting(false);
        controls.enabled = false;
        if (houseModelRef.current) {
          autoRotationRef.current = houseModelRef.current.rotation.y;
        }
      }, 3000);
    };

    renderer.domElement.addEventListener("mousedown", handleInteractionStart);
    renderer.domElement.addEventListener("touchstart", handleInteractionStart);
    renderer.domElement.addEventListener("wheel", handleInteractionStart);

    document.addEventListener("mouseup", handleInteractionEnd);
    document.addEventListener("touchend", handleInteractionEnd);

    controls.addEventListener("change", () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      interactionTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
        setIsInteracting(false);
        controls.enabled = false;
        if (houseModelRef.current) {
          autoRotationRef.current = houseModelRef.current.rotation.y;
        }
      }, 3000);
    });

    const animate = () => {
      requestAnimationFrame(animate);

      if (houseModelRef.current) {
        if (!isInteractingRef.current && !controls.enabled) {
          autoRotationRef.current += 0.005;
          houseModelRef.current.rotation.y = autoRotationRef.current;
        }
      }

      if (controls.enabled) {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      updateRendererSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener(
        "mousedown",
        handleInteractionStart
      );
      renderer.domElement.removeEventListener(
        "touchstart",
        handleInteractionStart
      );
      renderer.domElement.removeEventListener("wheel", handleInteractionStart);
      document.removeEventListener("mouseup", handleInteractionEnd);
      document.removeEventListener("touchend", handleInteractionEnd);

      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000] overflow-hidden"
    >
      <div className="w-full h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE - Form */}
        <div className="relative w-full lg:w-1/2 h-screen overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              transform: `translateY(${scrollY * -0.5}px) scale(${
                1.1 + scrollY * 0.001
              })`,
              transition: "transform 0.05s linear",
            }}
          >
            <img
              src="/images/Agroventures.jpg"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="absolute inset-0 bg-black/30 z-[1]"
            style={{
              transform: `translateY(${scrollY * -0.3}px)`,
              transition: "transform 0.05s linear",
            }}
          />

          <div
            className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 lg:p-16 xl:p-20"
            style={{
              transform: `translateY(${scrollY * -0.15}px)`,
              transition: "transform 0.05s linear",
            }}
          >
            <div className="max-w-xl mx-auto w-full">
              <h2 className="text-[32px] md:text-[42px] lg:text-[48px] font-light tracking-[3px] mb-8 text-white drop-shadow-2xl text-center">
                Let's Create Together
              </h2>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white/90 text-sm font-medium mb-2 drop-shadow-md"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c9a961]/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white/90 text-sm font-medium mb-2 drop-shadow-md"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c9a961]/50 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-white/90 text-sm font-medium mb-2 drop-shadow-md"
                    >
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c9a961]/50 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-white/90 text-sm font-medium mb-2 drop-shadow-md"
                    >
                      Appointment Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c9a961]/50 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-white/90 text-sm font-medium mb-2 drop-shadow-md"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c9a961]/50 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="group relative w-full px-8 py-4 bg-[#c9a961]/90 hover:bg-[#b89851] rounded-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:shadow-[#c9a961]/50 hover:scale-105 backdrop-blur-sm border border-[#c9a961]/30"
                >
                  <span className="relative z-10 font-semibold tracking-wide text-white drop-shadow-md">
                    Schedule Consultation
                  </span>
                  <div className="absolute inset-0 bg-[#b89851] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - 3D House Model with Instructions */}
        <div className="relative w-full lg:w-1/2 h-screen bg-gradient-to-br from-[#0d0d0d] to-[#000000]">
          {!isInteracting && !isLoading && !loadError && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 animate-pulse">
              <p className="text-white text-sm font-medium">
                Click & Drag to Explore • Scroll to Zoom • Right-Click to Pan
              </p>
            </div>
          )}

          <div
            ref={mountRef}
            className="w-full h-full"
            style={{
              cursor: isInteracting ? "grab" : "pointer",
            }}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#c9a961] text-lg animate-pulse">
                Loading 3D Model...
              </div>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-400 text-center px-4">
                Failed to load model
                <br />
                <span className="text-sm text-gray-500">
                  Check console for details
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
