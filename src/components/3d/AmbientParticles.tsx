'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleProps {
  count?: number;
  color?: string;
}

const ParticleField: React.FC<ParticleProps> = ({ count = 300, color = '#ff69b4' }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate random positions and scales for particles
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;     // X spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z depth
      sz[i] = Math.random() * 0.08 + 0.02;
    }

    return [pos, sz];
  }, [count]);

  // Subtle ambient rotation loop
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const AmbientParticlesCanvas: React.FC<{ color?: string }> = ({ color = '#ff69b4' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
          <ParticleField color={color} />
        </Float>
      </Canvas>
    </div>
  );
};
