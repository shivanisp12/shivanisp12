'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterModuleConfig } from '@/types/celebration';
import { Mail, ChevronRight, ChevronLeft } from 'lucide-react';

export const LetterModule: React.FC<{ config: LetterModuleConfig; onComplete: () => void }> = ({
  config,
  onComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const isLastPage = currentPage === config.pages.length - 1;

  return (
    <div className="max-w-xl w-full flex flex-col items-center">
      {!isOpen ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsOpen(true)}
          className="cursor-pointer w-full max-w-md p-10 rounded-2xl bg-amber-50/10 border border-amber-200/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center group"
        >
          <div className="w-20 h-20 rounded-full bg-red-900/80 border-2 border-amber-400 flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition">
            <span className="font-serif text-amber-300 font-bold text-xl">{config.waxSealSymbol || 'CV'}</span>
          </div>
          <Mail className="w-8 h-8 text-amber-200/60 mb-2" />
          <h3 className="text-2xl font-serif text-amber-100">A Personal Letter</h3>
          <p className="text-xs text-amber-200/60 mt-1">From {config.senderName} • Tap to break wax seal</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-8 md:p-12 rounded-2xl bg-amber-50/95 text-slate-900 shadow-2xl border border-amber-200/50 min-h-[380px] flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-amber-900/10 mb-6">
              <span className="font-serif text-xs uppercase tracking-widest text-amber-900/60">
                Page {currentPage + 1} of {config.pages.length}
              </span>
              <span className="font-serif text-xs italic text-amber-900/70">With love, {config.senderName}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentPage}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-serif text-lg leading-relaxed text-slate-800 whitespace-pre-line"
              >
                {config.pages[currentPage]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-amber-900/10 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full hover:bg-amber-900/10 disabled:opacity-20 text-amber-900 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {isLastPage ? (
              <button
                onClick={onComplete}
                className="px-6 py-2 rounded-full bg-amber-900 text-amber-50 font-serif text-sm hover:bg-amber-800 transition"
              >
                Continue Story
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-full hover:bg-amber-900/10 text-amber-900 transition flex items-center space-x-1"
              >
                <span className="text-xs font-serif font-bold">Turn Page</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
