import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Contact = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const houseModelRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const autoRotationRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 500 / 500, 0.1, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting for dark background
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xc9a961, 0.5);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
    rimLight.position.set(0, 3, -8);
    scene.add(rimLight);

    // Load GLB model
    const loader = new GLTFLoader();

    // IMPORTANT: Replace 'house.glb' with your actual file path
    // Place your GLB file in the public folder and reference it like:
    // '/models/house.glb' or '/house.glb' depending on where you put it
    loader.load(
      "/models/house.glb", // <-- UPDATE THIS PATH TO YOUR GLB FILE
      (gltf) => {
        const model = gltf.scene;
        houseModelRef.current = model;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Scale to reasonable size
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.setScalar(scale);

        // Center the model
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        // Enable shadows
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);
        setIsLoading(false);
      },
      (progress) => {
        // Loading progress
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percentComplete.toFixed(2)}%`);
      },
      (error) => {
        console.error("Error loading model:", error);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handleMouseEnter = () => {
      isHoveringRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
    };

    mountRef.current.addEventListener("mousemove", handleMouseMove);
    mountRef.current.addEventListener("mouseenter", handleMouseEnter);
    mountRef.current.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (houseModelRef.current) {
        if (isHoveringRef.current) {
          // Follow mouse
          const targetRotationY = mouseRef.current.x * Math.PI * 0.3;
          const targetRotationX = mouseRef.current.y * Math.PI * 0.1;

          houseModelRef.current.rotation.y +=
            (targetRotationY - houseModelRef.current.rotation.y) * 0.1;
          houseModelRef.current.rotation.x +=
            (targetRotationX - houseModelRef.current.rotation.x) * 0.1;
        } else {
          // Auto rotate
          autoRotationRef.current += 0.005;
          houseModelRef.current.rotation.y = autoRotationRef.current;
          houseModelRef.current.rotation.x +=
            (0 - houseModelRef.current.rotation.x) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener("mousemove", handleMouseMove);
        mountRef.current.removeEventListener("mouseenter", handleMouseEnter);
        mountRef.current.removeEventListener("mouseleave", handleMouseLeave);
        if (renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="contact"
      className="py-16 md:py-20 lg:py-25 bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000] px-4 md:px-8 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left side - Text content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <h2 className="text-[42px] text-center mb-16 text-white font-light tracking-[3px]">
            Let's Create Together
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#b8b8b8] leading-[1.6] md:leading-[1.8] mb-8 md:mb-10">
            Ready to transform your space? We'd love to hear about your project
            and discuss how we can bring your vision to life. Schedule a
            consultation with our design team today.
          </p>
          <button className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 mt-4">
            <span className="relative z-10 font-semibold tracking-wide text-white">
              Get In Touch
            </span>
            <div className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>

        {/* Right side - 3D House Model */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative w-[500px] h-[500px]">
            <div
              ref={mountRef}
              className="w-full h-full"
              style={{
                cursor: "pointer",
                filter: "drop-shadow(0 20px 40px rgba(201, 169, 97, 0.3))",
              }}
            />

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#c9a961] text-sm animate-pulse">
                  Loading 3D Model...
                </div>
              </div>
            )}

            {/* Error message */}
            {loadError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-400 text-xs text-center px-4">
                  Failed to load model
                  <br />
                  <span className="text-[10px] text-gray-500">
                    Check console for details
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
