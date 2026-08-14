'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, PresentationControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface GiftBoxProps {
  boxColor?: string;
  ribbonColor?: string;
  onOpen?: () => void;
}

const GiftBoxMesh: React.FC<GiftBoxProps> = ({
  boxColor = '#e11d48',
  ribbonColor = '#fbbf24',
  onOpen,
}) => {
  const lidRef = useRef<THREE.Group>(null!);
  const [isOpen, setIsOpen] = useState(false);

  // Animate the lid lifting and rotating back when tapped
  useFrame((_, delta) => {
    if (isOpen && lidRef.current) {
      lidRef.current.position.y = THREE.MathUtils.damp(lidRef.current.position.y, 1.8, 4, delta);
      lidRef.current.position.z = THREE.MathUtils.damp(lidRef.current.position.z, -0.6, 4, delta);
      lidRef.current.rotation.x = THREE.MathUtils.damp(lidRef.current.rotation.x, -0.8, 4, delta);
    }
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      if (onOpen) setTimeout(onOpen, 1000);
    }
  };

  return (
    <group onClick={handleClick} className="cursor-pointer">
      {/* GIFT BOX BASE */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color={boxColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* BASE VERTICAL RIBBON */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.62, 1.22, 0.25]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.25, 1.22, 1.62]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
      </mesh>

      {/* ANIMATED LID GROUP */}
      <group ref={lidRef} position={[0, 0.65, 0]}>
        {/* LID CAP */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[1.7, 0.25, 1.7]} />
          <meshStandardMaterial color={boxColor} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* LID RIBBON CROSS */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[1.72, 0.26, 0.27]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.27, 0.26, 1.72]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
        </mesh>

        {/* RIBBON BOW ON TOP */}
        <group position={[0, 0.3, 0]}>
          <mesh position={[-0.2, 0.1, 0]} rotation={[0, 0, 0.4]}>
            <torusGeometry args={[0.18, 0.06, 16, 32]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, -0.4]}>
            <torusGeometry args={[0.18, 0.06, 16, 32]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* MAGIC BURST SPARKLES WHEN OPENED */}
      {isOpen && (
        <Sparkles
          count={80}
          scale={3}
          size={4}
          speed={2}
          color={ribbonColor}
          position={[0, 0.5, 0]}
        />
      )}
    </group>
  );
};

export const GiftBox3DCanvas: React.FC<GiftBoxProps> = (props) => {
  return (
    <div className="w-full h-72 relative">
      <Canvas
        shadows
        camera={{ position: [2.5, 2.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[-3, 2, -2]} intensity={0.5} color="#ffb6c1" />

        {/* Drag to inspect box in 3D space */}
        <PresentationControls
          global={false}
          cursor={true}
          snap={{ mass: 2, tension: 400 }}
          speed={1.5}
          zoom={1}
          polar={[-Math.PI / 6, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <GiftBoxMesh {...props} />
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={6} blur={1.5} far={4} />
      </Canvas>
    </div>
  );
};
