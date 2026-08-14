'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedGLTFModelProps {
  modelUrl: string;
  animationName?: string; // Name of the clip inside the GLTF (e.g. "Open_Lid", "Bloom")
  loop?: boolean;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  onClick?: () => void;
}

export const AnimatedGLTFModel: React.FC<AnimatedGLTFModelProps> = ({
  modelUrl,
  animationName,
  loop = false,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  // 1. Fetch GLTF scene and embedded animation clips
  const { scene, animations } = useGLTF(modelUrl);

  // 2. Bind clips to the THREE.AnimationMixer controlled by Drei
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (!actions || names.length === 0) return;

    // Fallback to the first animation clip if no animationName is provided
    const targetClipName = animationName && actions[animationName] ? animationName : names[0];
    const currentAction = actions[targetClipName];

    if (currentAction) {
      currentAction.reset().fadeIn(0.3);
      currentAction.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
      currentAction.clampWhenFinished = !loop; // Freeze on the final frame when finished
      currentAction.play();
    }

    return () => {
      currentAction?.fadeOut(0.3);
    };
  }, [actions, animationName, names, loop]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <primitive object={scene} />
    </group>
  );
};
