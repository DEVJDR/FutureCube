import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCube({ onClick, isTransitioning }) {
  const cubeRef = useRef();

  // Rotate the cube continuously on x, y, and z axes, and apply transition effects
  useFrame(() => {
    cubeRef.current.rotation.x += isTransitioning ? 0.01 : 0.003;
    cubeRef.current.rotation.y += isTransitioning ? 0.01 : 0.003;
    cubeRef.current.rotation.z += isTransitioning ? 0.01 : 0.003;

    if (isTransitioning && cubeRef.current.scale.x < 8) {
      cubeRef.current.scale.x += 0.3;
      cubeRef.current.scale.y += 0.3;
      cubeRef.current.scale.z += 0.3;
      cubeRef.current.material.opacity = Math.max(cubeRef.current.material.opacity - 0.04, 0);
    }
  });

  return (
    <RoundedBox
      ref={cubeRef}
      args={[2, 2, 2]}
      radius={0.2}
      smoothness={8}
      onClick={onClick}
    >
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.8}
        roughness={0.1}
        emissive="#222222"
        emissiveIntensity={0.1}
        transparent
        opacity={1}
      />
     
    </RoundedBox>
  );
}

function InsideImageWorld({ texture, isInside, onClick }) {
  const meshRef = useRef();

  // Control opacity of inside world based on isInside state
  useFrame(() => {
    meshRef.current.material.opacity = isInside ? 1 : 0;
    meshRef.current.rotation.y += 0.0005;
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]} onClick={onClick}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        transparent
        opacity={isInside ? 1 : 0} // Start fully visible if isInside
      />
    </mesh>
  );
}

export default function FutureCube() {  
  const [isInside, setIsInside] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textureIndex, setTextureIndex] = useState(0);

  const textures = useLoader(THREE.TextureLoader, [
    '/textures/image-asset4.jpeg',
    '/textures/image-asset5.jpeg',
    '/textures/i.jpg',
  ]);

  const handleTextureChange = () => {
    setTextureIndex((prevIndex) => (prevIndex + 1) % textures.length);
  };

  const startTransition = () => {
    setIsInside(true); // Set to true immediately to show inner world image instantly
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <Canvas
      style={{
        height: '100vh',
        background: 'radial-gradient(circle, #141e30, #243b55)',
      }}
    >
      <ambientLight intensity={0.5} color="#ffffff" />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#88c0d0"
        castShadow
      />
      <OrbitControls
        enableZoom={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        minDistance={3}
        maxDistance={10}
        dampingFactor={0.1}
      />
      <Environment preset="sunset" />

      {!isInside ? (
        <RotatingCube
          onClick={startTransition}
          isTransitioning={isTransitioning}
        />
      ) : (
        <InsideImageWorld
          texture={textures[textureIndex]}
          isInside={isInside}
          onClick={handleTextureChange}
        />
      )}
    </Canvas>
  );
}
