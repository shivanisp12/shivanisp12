'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelebrationProject, CelebrationModule } from '@/types/celebration';
import { WelcomeModule } from '../modules/WelcomeModule';
import { GiftModule } from '../modules/GiftModule';
import { LetterModule } from '../modules/LetterModule';
import { MiniGameModule } from '../modules/MiniGameModule';
import { ProposalModule } from '../modules/ProposalModule';
import { FinaleModule } from '../modules/FinaleModule';
import { ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';

interface StoryEngineProps {
  project: CelebrationProject;
  isStudioPreview?: boolean;
}

export const StoryEngine: React.FC<StoryEngineProps> = ({ project, isStudioPreview = false }) => {
  const activeModules = project.modules.filter((m) => m.enabled);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentModule = activeModules[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === activeModules.length - 1;

  const nextChapter = () => {
    if (!isLast) setCurrentIndex((prev) => prev + 1);
  };

  const prevChapter = () => {
    if (!isFirst) setCurrentIndex((prev) => prev - 1);
  };

  const renderModuleComponent = (module: CelebrationModule) => {
    switch (module.type) {
      case 'welcome':
        return <WelcomeModule config={module} onNext={nextChapter} />;
      case 'gift':
        return <GiftModule config={module} onComplete={nextChapter} />;
      case 'letter':
        return <LetterModule config={module} onComplete={nextChapter} />;
      case 'game':
        return <MiniGameModule config={module} onComplete={nextChapter} />;
      case 'proposal':
        return <ProposalModule config={module} onComplete={nextChapter} />;
      case 'finale':
        return <FinaleModule config={module} />;
      default:
        return (
          <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-serif mb-2">{module.title}</h3>
            <p className="text-slate-400">This module is seamlessly integrated.</p>
          </div>
        );
    }
  };

  if (activeModules.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        No modules active in this story. Add modules in the Creator Studio.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--glow-color), transparent 70%)`,
        }}
      />

      {/* Top Navigation & Story Progress Bar */}
      <header className="relative z-30 p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-2 w-full max-w-xs">
          {activeModules.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-500 ${
                idx === currentIndex
                  ? 'bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] scale-y-125'
                  : idx < currentIndex
                  ? 'bg-white/40'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Audio Toggle */}
        {project.backgroundAudioUrl && (
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="p-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
            title="Toggle Ambient Audio"
          >
            {isPlayingAudio ? <Volume2 className="w-5 h-5 text-pink-300" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
        )}
      </header>

      {/* Main Chapter Content Switcher */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            {renderModuleComponent(currentModule)}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Floating Navigation Controls */}
      {!isStudioPreview && (
        <footer className="relative z-30 p-6 flex justify-between items-center max-w-3xl mx-auto w-full">
          <button
            onClick={prevChapter}
            disabled={isFirst}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full backdrop-blur-lg border border-white/15 transition ${
              isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <span className="text-xs tracking-widest uppercase text-white/50">
            Chapter {currentIndex + 1} of {activeModules.length}
          </span>

          <button
            onClick={nextChapter}
            disabled={isLast}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] text-slate-950 font-semibold shadow-lg shadow-pink-500/20 transition ${
              isLast ? 'opacity-30 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'
            }`}
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      )}
    </div>
  );
};
