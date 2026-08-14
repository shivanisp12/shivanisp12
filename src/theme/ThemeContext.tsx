'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { ThemeId, ThemeConfig } from '@/types/celebration';

export const THEME_PRESETS: Record<ThemeId, ThemeConfig> = {
  'dreamy-pink': {
    id: 'dreamy-pink',
    name: 'Dreamy Pink',
    background: 'linear-gradient(135deg, #1f0010 0%, #3d0026 50%, #1a001a 100%)',
    cardBackground: 'rgba(255, 182, 193, 0.08)',
    primaryAccent: '#ff69b4',
    secondaryAccent: '#ffb6c1',
    textColor: '#fff0f5',
    mutedTextColor: '#dda0dd',
    fontFamily: "'Playfair Display', serif",
    glowColor: 'rgba(255, 105, 180, 0.4)',
  },
  'galaxy': {
    id: 'galaxy',
    name: 'Galaxy Deep Space',
    background: 'linear-gradient(135deg, #020208 0%, #0d0b26 50%, #050014 100%)',
    cardBackground: 'rgba(138, 43, 226, 0.1)',
    primaryAccent: '#a855f7',
    secondaryAccent: '#38bdf8',
    textColor: '#f8fafc',
    mutedTextColor: '#94a3b8',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Luxury Gold & Obsidian',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #050505 100%)',
    cardBackground: 'rgba(212, 175, 55, 0.07)',
    primaryAccent: '#d4af37',
    secondaryAccent: '#f3e5ab',
    textColor: '#fafafa',
    mutedTextColor: '#a3a3a3',
    fontFamily: "'Cinzel', serif",
    glowColor: 'rgba(212, 175, 55, 0.35)',
  },
  'sakura': {
    id: 'sakura',
    name: 'Sakura Blossom',
    background: 'linear-gradient(135deg, #2b1019 0%, #401824 50%, #1f0a12 100%)',
    cardBackground: 'rgba(255, 192, 203, 0.12)',
    primaryAccent: '#f472b6',
    secondaryAccent: '#fbcfe8',
    textColor: '#fff5f7',
    mutedTextColor: '#f472b6',
    fontFamily: "'Noto Serif', serif",
    glowColor: 'rgba(244, 114, 182, 0.4)',
  },
  'aurora': {
    id: 'aurora',
    name: 'Northern Aurora',
    background: 'linear-gradient(135deg, #031b1e 0%, #062c30 50%, #011012 100%)',
    cardBackground: 'rgba(45, 212, 191, 0.08)',
    primaryAccent: '#2dd4bf',
    secondaryAccent: '#34d399',
    textColor: '#f0fdfa',
    mutedTextColor: '#99f6e4',
    fontFamily: "'Inter', sans-serif",
    glowColor: 'rgba(45, 212, 191, 0.4)',
  },
  'midnight-romance': {
    id: 'midnight-romance',
    name: 'Midnight Romance',
    background: 'linear-gradient(135deg, #0f051d 0%, #290832 50%, #0d021a 100%)',
    cardBackground: 'rgba(236, 72, 153, 0.09)',
    primaryAccent: '#ec4899',
    secondaryAccent: '#f43f5e',
    textColor: '#fff1f2',
    mutedTextColor: '#fbcfe8',
    fontFamily: "'Cormorant Garamond', serif",
    glowColor: 'rgba(236, 72, 153, 0.45)',
  },
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Emerald',
    background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #021a14 100%)',
    cardBackground: 'rgba(52, 211, 153, 0.08)',
    primaryAccent: '#34d399',
    secondaryAccent: '#a7f3d0',
    textColor: '#ecfdf5',
    mutedTextColor: '#6ee7b7',
    fontFamily: "'Cinzel', serif",
    glowColor: 'rgba(52, 211, 153, 0.35)',
  },
};

const ThemeContext = createContext<{
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
}>({
  theme: THEME_PRESETS['dreamy-pink'],
  setThemeId: () => {},
});

export const ThemeProvider: React.FC<{
  themeId: ThemeId;
  children: React.ReactNode;
}> = ({ themeId, children }) => {
  const [currentThemeId, setCurrentThemeId] = React.useState<ThemeId>(themeId);
  const activeTheme = THEME_PRESETS[currentThemeId] || THEME_PRESETS['dreamy-pink'];

  useEffect(() => {
    setCurrentThemeId(themeId);
  }, [themeId]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', activeTheme.background);
    root.style.setProperty('--card-bg', activeTheme.cardBackground);
    root.style.setProperty('--primary-accent', activeTheme.primaryAccent);
    root.style.setProperty('--secondary-accent', activeTheme.secondaryAccent);
    root.style.setProperty('--text-main', activeTheme.textColor);
    root.style.setProperty('--text-muted', activeTheme.mutedTextColor);
    root.style.setProperty('--glow-color', activeTheme.glowColor);
    root.style.setProperty('--font-theme', activeTheme.fontFamily);
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, setThemeId: setCurrentThemeId }}>
      <div
        className="min-h-screen text-slate-100 transition-all duration-700 font-sans relative overflow-x-hidden"
        style={{ background: activeTheme.background, fontFamily: activeTheme.fontFamily }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
