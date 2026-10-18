'use client';

import React from 'react';
import { useHudStore } from '@/store/useHudStore';
import { useMouseTelemetry } from '@/hooks/useMouseTelemetry';

import { portfolioConfig } from '@/config/portfolio.config';

const projectTelemetryThemes: Record<string, { text: string; muted: string; accent: string; isLight: boolean }> = {
  'lets-ryde': { text: '#07110E', muted: '#4C655C', accent: '#008F65', isLight: true },
  'mia-diagnostic': { text: '#EEFBF6', muted: '#92B3B5', accent: '#84DCEE', isLight: false },
  'clientbook': { text: '#2B2216', muted: '#69573D', accent: '#7E653D', isLight: true },
  'saif-locators': { text: '#EFF8FF', muted: '#A6C7DC', accent: '#74BBEB', isLight: false },
  'linear-craze': { text: '#F4F3FF', muted: '#AEADDA', accent: '#8075FF', isLight: false },
  'coffee-brew': { text: '#FFF4EB', muted: '#C7A38D', accent: '#E18B50', isLight: false },
};

export function TelemetryBar() {
  const activeSection = useHudStore((s) => s.activeSection);
  const activeProjectIndex = useHudStore((s) => s.activeProjectIndex);
  const hudTheme = useHudStore((s) => s.hudTheme);
  const { coords } = useMouseTelemetry();

  const currentProject = portfolioConfig.work.projects[activeProjectIndex] || portfolioConfig.work.projects[0];
  const pTheme = activeSection === 4 ? (projectTelemetryThemes[currentProject.id] || { text: '#07110E', muted: '#4C655C', accent: '#008F65', isLight: false }) : null;

  const isLight = pTheme ? pTheme.isLight : hudTheme === 'light-profile';
  const accentColor = pTheme ? pTheme.accent : '#10B981';
  const textColor = pTheme ? pTheme.text : isLight ? '#0A1410' : '#FFFFFF';
  const mutedColor = pTheme ? pTheme.muted : isLight ? '#42544D' : '#8A9A92';

  const padNum = (num: number) => String(num).padStart(4, '0');

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 px-5 sm:px-8 py-2 flex items-center justify-between font-mono-hud text-[9px] uppercase tracking-[0.18em] pointer-events-none select-none transition-all duration-300 ${
        activeSection === 6
          ? 'opacity-0 translate-y-full pointer-events-none'
          : activeSection === 4
          ? 'bg-transparent border-transparent'
          : isLight
          ? 'bg-[#F4F6F5]/80 border-t border-[#D8E2DC]'
          : activeSection === 1
          ? 'text-[#8A9A92] opacity-25 border-transparent'
          : 'bg-[#040A07]/75 border-t border-[#132A21] opacity-60'
      }`}
      style={{ color: mutedColor }}
    >
      {/* Left OS & Version */}
      <div className="flex items-center space-x-2.5">
        <span className="font-semibold" style={{ color: textColor }}>
          PORTFOLIO.OS
        </span>
        <span className="opacity-40">/</span>
        <span>V / 03.26</span>
      </div>

      {/* Right Coordinates & Status */}
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 font-mono">
          <span className="opacity-60">X</span>
          <span style={{ color: accentColor }}>
            {padNum(coords.x)}
          </span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">Y</span>
          <span style={{ color: accentColor }}>
            {padNum(coords.y)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: accentColor,
              boxShadow: isLight ? 'none' : `0 0 6px ${accentColor}`,
            }}
          />
          <span className="font-semibold" style={{ color: accentColor }}>
            BUILD STATUS: ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}
