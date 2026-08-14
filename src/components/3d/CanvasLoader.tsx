'use client';

import React from 'react';
import { Html, useProgress } from '@react-three/drei';

export const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/90 border border-white/10 backdrop-blur-md text-white min-w-[140px]">
        <div className="w-7 h-7 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs font-mono text-slate-300">{Math.round(progress)}% loaded</span>
      </div>
    </Html>
  );
};
