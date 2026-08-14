'use client';

import React, { useState } from 'react';
import { CelebrationProject, ThemeId, CelebrationModule } from '@/types/celebration';
import { StoryEngine } from '../engine/StoryEngine';
import { ThemeProvider } from '@/theme/ThemeContext';
import { encodeProjectPayload } from '@/utils/payloadEncoder';
import { Layout, Smartphone, Tablet, Monitor, Share2, Plus, Trash2, Eye } from 'lucide-react';

const INITIAL_PROJECT: CelebrationProject = {
  id: 'demo-1',
  title: 'Happy Birthday Alex!',
  occasion: 'birthday',
  themeId: 'dreamy-pink',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  modules: [
    {
      id: 'm1',
      type: 'welcome',
      title: 'Welcome Chapter',
      enabled: true,
      recipientName: 'Alex',
      headline: 'A Magical Journey Awaits',
      subheadline: 'Created with love just for you',
      callToActionText: 'Begin Celebration',
    },
    {
      id: 'm2',
      type: 'gift',
      title: 'A Special Gift',
      enabled: true,
      giftStyle: 'luxury-box',
      boxColor: '#ff69b4',
      ribbonColor: '#ffd700',
      revealTitle: 'Your Special Surprise!',
      revealMessage: 'Hope your birthday is filled with unbridled joy and laughter.',
    },
    {
      id: 'm3',
      type: 'letter',
      title: 'Personal Letter',
      enabled: true,
      senderName: 'Sam',
      waxSealSymbol: 'A',
      pages: [
        'Happy Birthday!\n\nLooking back on all our memories, I wanted to create something unforgettable.',
        'Here is to another year of amazing adventures, success, and pure happiness!',
      ],
    },
    {
      id: 'm4',
      type: 'finale',
      title: 'Celebration Finale',
      enabled: true,
      effectType: 'fireworks',
      closingMessage: 'Here is to an extraordinary year ahead!',
      subMessage: 'CelebrationVerse Experience',
    },
  ],
};

export const CreatorStudio = () => {
  const [project, setProject] = useState<CelebrationProject>(INITIAL_PROJECT);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [shareUrl, setShareUrl] = useState<string>('');

  const handlePublish = () => {
    const encoded = encodeProjectPayload(project);
    const url = `${window.location.origin}/view/share#${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    alert('Shareable celebration link copied to clipboard!');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar - Chapter Manager */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <Layout className="w-6 h-6 text-pink-400" />
            <span className="font-serif text-xl font-bold">CelebrationVerse</span>
          </div>

          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Story Chapters
          </h3>

          <div className="space-y-3">
            {project.modules.map((m, idx) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500 font-mono">{idx + 1}</span>
                  <span className="text-sm font-medium">{m.title}</span>
                </div>
                <button
                  onClick={() =>
                    setProject({
                      ...project,
                      modules: project.modules.filter((mod) => mod.id !== m.id),
                    })
                  }
                  className="p-1 hover:text-red-400 text-slate-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePublish}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold flex items-center justify-center space-x-2 hover:brightness-110 shadow-lg shadow-pink-500/20"
        >
          <Share2 className="w-4 h-4" />
          <span>Publish & Copy Link</span>
        </button>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Viewport Controls */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded-md ${previewDevice === 'mobile' ? 'bg-slate-700 text-pink-400' : 'text-slate-400'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-2 rounded-md ${previewDevice === 'tablet' ? 'bg-slate-700 text-pink-400' : 'text-slate-400'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded-md ${previewDevice === 'desktop' ? 'bg-slate-700 text-pink-400' : 'text-slate-400'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400">Live Preview Engine</div>
        </header>

        {/* Live Device Frame Render */}
        <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-auto">
          <div
            className={`transition-all duration-500 overflow-hidden shadow-2xl border border-slate-800 ${
              previewDevice === 'mobile'
                ? 'w-[375px] h-[720px] rounded-[40px]'
                : previewDevice === 'tablet'
                ? 'w-[768px] h-[850px] rounded-[24px]'
                : 'w-full h-full rounded-xl'
            }`}
          >
            <ThemeProvider themeId={project.themeId}>
              <StoryEngine project={project} isStudioPreview={true} />
            </ThemeProvider>
          </div>
        </div>
      </main>
    </div>
  );
};
