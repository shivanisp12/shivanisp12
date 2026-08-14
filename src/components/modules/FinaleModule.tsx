'use client';

import React, { useEffect, useRef } from 'react';
import { FinaleModuleConfig } from '@/types/celebration';

export const FinaleModule: React.FC<{ config: FinaleModuleConfig }> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      alpha: number;
    }> = [];

    const colors = ['#ff69b4', '#ffd700', '#00ffff', '#ff4500', '#7b68ee'];

    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 4,
        vy: -(Math.random() * 8 + 6),
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 3 + 2,
        alpha: 1,
      });
    };

    let animationId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.3) spawnParticle();

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gravity
        p.alpha -= 0.005;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();

        if (p.alpha <= 0) particles.splice(idx, 1);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="relative z-10 max-w-xl p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-amber-100 mb-4">
          {config.title || 'Happy Celebration!'}
        </h1>
        <p className="text-lg text-slate-200 mb-6">{config.closingMessage}</p>
        <p className="text-xs tracking-widest text-pink-300 uppercase">{config.subMessage}</p>
      </div>
    </div>
  );
};
