'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftModuleConfig } from '@/types/celebration';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';

export const GiftModule: React.FC<{ config: GiftModuleConfig; onComplete: () => void }> = ({
  config,
  onComplete,
}) => {
  const [stage, setStage] = useState<'LOCKED' | 'UNWRAPPING' | 'REVEALED'>('LOCKED');

  const handleBoxClick = () => {
    if (stage === 'LOCKED') {
      setStage('UNWRAPPING');
      setTimeout(() => setStage('REVEALED'), 1200);
    }
  };

  return (
    <div className="text-center max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
      <h2 className="text-3xl font-serif font-bold mb-2 text-[var(--primary-accent)]">
        {config.title}
      </h2>
      <p className="text-sm text-slate-300 mb-8">Tap the gift box to open your surprise</p>

      {/* Interactive Gift Box */}
      <div className="relative my-8 cursor-pointer group" onClick={handleBoxClick}>
        <AnimatePresence mode="wait">
          {stage !== 'REVEALED' ? (
            <motion.div
              key="box"
              animate={
                stage === 'UNWRAPPING'
                  ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1.2] }
                  : { y: [0, -8, 0] }
              }
              transition={{ repeat: stage === 'LOCKED' ? Infinity : 0, duration: 3 }}
              className="w-44 h-44 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 p-1 shadow-2xl relative flex items-center justify-center border border-white/30"
            >
              {/* Ribbon */}
              <div className="absolute inset-y-0 w-8 bg-amber-300/80 blur-[1px]" />
              <div className="absolute inset-x-0 h-8 bg-amber-300/80 blur-[1px]" />
              <Gift className="w-16 h-16 text-white z-10 drop-shadow-md" />
              <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-amber-300 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center"
            >
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-[var(--primary-accent)] shadow-2xl mb-4 bg-black/40 flex items-center justify-center">
                {config.surpriseMediaUrl ? (
                  <img src={config.surpriseMediaUrl} alt="Gift reveal" className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="w-16 h-16 text-amber-300" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage === 'REVEALED' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-xl font-bold">{config.revealTitle}</h3>
          <p className="text-slate-200 text-sm leading-relaxed">{config.revealMessage}</p>
          <button
            onClick={onComplete}
            className="mt-4 px-6 py-3 rounded-full bg-[var(--primary-accent)] text-slate-950 font-bold flex items-center space-x-2 mx-auto hover:brightness-110 transition"
          >
            <span>Continue Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
