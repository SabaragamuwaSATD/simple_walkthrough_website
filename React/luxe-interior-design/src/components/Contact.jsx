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
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Form state
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

  // 3D Model setup
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

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
          }
        });

        scene.add(model);
        setIsLoading(false);
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percentComplete.toFixed(2)}%`);
      },
      (error) => {
        console.error("Error loading model:", error);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    const handleMouseMove = (e) => {
      if (!mountRef.current) return;
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

    const animate = () => {
      requestAnimationFrame(animate);

      if (houseModelRef.current) {
        if (isHoveringRef.current) {
          const targetRotationY = mouseRef.current.x * Math.PI * 0.3;
          const targetRotationX = mouseRef.current.y * Math.PI * 0.1;

          houseModelRef.current.rotation.y +=
            (targetRotationY - houseModelRef.current.rotation.y) * 0.1;
          houseModelRef.current.rotation.x +=
            (targetRotationX - houseModelRef.current.rotation.x) * 0.1;
        } else {
          autoRotationRef.current += 0.005;
          houseModelRef.current.rotation.y = autoRotationRef.current;
          houseModelRef.current.rotation.x +=
            (0 - houseModelRef.current.rotation.x) * 0.1;
        }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend functionality will be added later
    console.log("Form submitted:", formData);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000] overflow-hidden"
    >
      <div className="w-full h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE - Form with parallax background (50% width) */}
        <div className="relative w-full lg:w-1/2 h-screen overflow-hidden">
          {/* Background Image Layer */}
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

          {/* Overlay - Lighter for better image visibility */}
          <div
            className="absolute inset-0 bg-black/30 z-[1]"
            style={{
              transform: `translateY(${scrollY * -0.3}px)`,
              transition: "transform 0.05s linear",
            }}
          />

          {/* Form Content */}
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

              {/* Glass Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl space-y-5"
              >
                {/* Name Input */}
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

                {/* Email Input */}
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

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Input */}
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

                  {/* Time Input */}
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

                {/* Description Textarea */}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full px-8 py-4 bg-[#c9a961]/90 hover:bg-[#b89851] rounded-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:shadow-[#c9a961]/50 hover:scale-105 backdrop-blur-sm border border-[#c9a961]/30"
                >
                  <span className="relative z-10 font-semibold tracking-wide text-white drop-shadow-md">
                    Schedule Consultation
                  </span>
                  <div className="absolute inset-0 bg-[#b89851] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - 3D House Model (50% width) */}
        <div className="relative w-full lg:w-1/2 h-screen bg-gradient-to-br from-[#0d0d0d] to-[#000000]">
          <div
            ref={mountRef}
            className="w-full h-full"
            style={{
              cursor: "pointer",
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

// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// const Contact = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const houseModelRef = useRef(null);
//   const mouseRef = useRef({ x: 0, y: 0 });
//   const isHoveringRef = useRef(false);
//   const autoRotationRef = useRef(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(false);
//   const sectionRef = useRef(null);
//   const [scrollY, setScrollY] = useState(0);

//   // Parallax scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       if (sectionRef.current) {
//         const rect = sectionRef.current.getBoundingClientRect();
//         const sectionTop = rect.top;
//         const windowHeight = window.innerHeight;

//         const scrollProgress = Math.max(
//           0,
//           Math.min(1, 1 - sectionTop / windowHeight)
//         );

//         setScrollY(scrollProgress * 100);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // 3D Model setup
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     // Update camera for larger viewport
//     const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
//     camera.position.set(0, 3, 10);
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//     });

//     // Set renderer size to match container
//     const updateRendererSize = () => {
//       if (mountRef.current) {
//         const width = mountRef.current.offsetWidth;
//         const height = mountRef.current.offsetHeight;
//         renderer.setSize(width, height);
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//       }
//     };

//     updateRendererSize();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     mountRef.current.appendChild(renderer.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
//     mainLight.position.set(5, 10, 5);
//     mainLight.castShadow = true;
//     scene.add(mainLight);

//     const fillLight = new THREE.DirectionalLight(0xc9a961, 0.5);
//     fillLight.position.set(-5, 5, -5);
//     scene.add(fillLight);

//     const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
//     rimLight.position.set(0, 3, -8);
//     scene.add(rimLight);

//     const loader = new GLTFLoader();

//     loader.load(
//       "/models/house.glb",
//       (gltf) => {
//         const model = gltf.scene;
//         houseModelRef.current = model;

//         const box = new THREE.Box3().setFromObject(model);
//         const center = box.getCenter(new THREE.Vector3());
//         const size = box.getSize(new THREE.Vector3());

//         const maxDim = Math.max(size.x, size.y, size.z);
//         const scale = 3 / maxDim;
//         model.scale.setScalar(scale);

//         model.position.x = -center.x * scale;
//         model.position.y = -center.y * scale;
//         model.position.z = -center.z * scale;

//         model.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//           }
//         });

//         scene.add(model);
//         setIsLoading(false);
//       },
//       (progress) => {
//         const percentComplete = (progress.loaded / progress.total) * 100;
//         console.log(`Loading: ${percentComplete.toFixed(2)}%`);
//       },
//       (error) => {
//         console.error("Error loading model:", error);
//         setLoadError(true);
//         setIsLoading(false);
//       }
//     );

//     const handleMouseMove = (e) => {
//       if (!mountRef.current) return;
//       const rect = mountRef.current.getBoundingClientRect();
//       mouseRef.current = {
//         x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
//         y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
//       };
//     };

//     const handleMouseEnter = () => {
//       isHoveringRef.current = true;
//     };

//     const handleMouseLeave = () => {
//       isHoveringRef.current = false;
//     };

//     mountRef.current.addEventListener("mousemove", handleMouseMove);
//     mountRef.current.addEventListener("mouseenter", handleMouseEnter);
//     mountRef.current.addEventListener("mouseleave", handleMouseLeave);

//     const animate = () => {
//       requestAnimationFrame(animate);

//       if (houseModelRef.current) {
//         if (isHoveringRef.current) {
//           const targetRotationY = mouseRef.current.x * Math.PI * 0.3;
//           const targetRotationX = mouseRef.current.y * Math.PI * 0.1;

//           houseModelRef.current.rotation.y +=
//             (targetRotationY - houseModelRef.current.rotation.y) * 0.1;
//           houseModelRef.current.rotation.x +=
//             (targetRotationX - houseModelRef.current.rotation.x) * 0.1;
//         } else {
//           autoRotationRef.current += 0.005;
//           houseModelRef.current.rotation.y = autoRotationRef.current;
//           houseModelRef.current.rotation.x +=
//             (0 - houseModelRef.current.rotation.x) * 0.1;
//         }
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       updateRendererSize();
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (mountRef.current) {
//         mountRef.current.removeEventListener("mousemove", handleMouseMove);
//         mountRef.current.removeEventListener("mouseenter", handleMouseEnter);
//         mountRef.current.removeEventListener("mouseleave", handleMouseLeave);
//         if (renderer.domElement.parentNode === mountRef.current) {
//           mountRef.current.removeChild(renderer.domElement);
//         }
//       }
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       id="contact"
//       className="relative w-full min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000] overflow-hidden"
//     >
//       <div className="w-full h-screen flex flex-col lg:flex-row">
//         {/* LEFT SIDE - Text content with parallax background (50% width) */}
//         <div className="relative w-full lg:w-1/2 h-screen overflow-hidden">
//           {/* Background Image Layer */}
//           <div
//             className="absolute inset-0 z-0"
//             style={{
//               transform: `translateY(${scrollY * -0.5}px) scale(${
//                 1.1 + scrollY * 0.001
//               })`,
//               transition: "transform 0.05s linear",
//             }}
//           >
//             <img
//               src="/images/Agroventures.jpg"
//               alt="Background"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black/50 z-[1]"
//             style={{
//               transform: `translateY(${scrollY * -0.3}px)`,
//               transition: "transform 0.05s linear",
//             }}
//           />

//           {/* Content */}
//           <div
//             className="relative z-10 h-full flex flex-col justify-center bg-white/5 backdrop-blur-md p-8 md:p-12 lg:p-16 xl:p-20"
//             style={{
//               transform: `translateY(${scrollY * -0.15}px)`,
//               transition: "transform 0.05s linear",
//             }}
//           >
//             <div className="max-w-xl">
//               <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-light tracking-[3px] mb-6 text-white drop-shadow-lg">
//                 Let's Create Together
//               </h2>
//               <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 drop-shadow-md">
//                 Ready to transform your space? We'd love to hear about your
//                 project and discuss how we can bring your vision to life.
//                 Schedule a consultation with our design team today.
//               </p>
//               <button className="group relative px-8 py-4 bg-[#c9a961]/90 hover:bg-[#b89851] rounded-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:shadow-[#c9a961]/50 hover:scale-105 backdrop-blur-sm border border-[#c9a961]/30">
//                 <span className="relative z-10 font-semibold tracking-wide text-white drop-shadow-md">
//                   Get In Touch
//                 </span>
//                 <div className="absolute inset-0 bg-[#b89851] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE - 3D House Model (50% width) */}
//         <div className="relative w-full lg:w-1/2 h-screen bg-gradient-to-br from-[#0d0d0d] to-[#000000]">
//           <div
//             ref={mountRef}
//             className="w-full h-full"
//             style={{
//               cursor: "pointer",
//             }}
//           />

//           {isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-[#c9a961] text-lg animate-pulse">
//                 Loading 3D Model...
//               </div>
//             </div>
//           )}

//           {loadError && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-red-400 text-center px-4">
//                 Failed to load model
//                 <br />
//                 <span className="text-sm text-gray-500">
//                   Check console for details
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;
