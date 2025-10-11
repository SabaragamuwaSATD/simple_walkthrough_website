import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

function ModelScene({ progress = 0 }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/building.glb"); // must exist in public/models
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = progress * Math.PI;
    const s = 0.8 + progress * 0.4;
    ref.current.scale.setScalar(s);
  });
  return <primitive ref={ref} object={scene} />;
}

const Model = ({ scrollProgress = 0, isVisible = true }) => {
  if (!isVisible) return null;
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <ModelScene progress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload("/models/building.glb");
export default Model;
