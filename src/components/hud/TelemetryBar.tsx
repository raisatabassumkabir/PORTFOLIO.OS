'use client';

import React from 'react';
import { useHudStore } from '@/store/useHudStore';
import { useMouseTelemetry } from '@/hooks/useMouseTelemetry';

export function TelemetryBar() {
  const activeSection = useHudStore((s) => s.activeSection);
  const hudTheme = useHudStore((s) => s.hudTheme);
  const { coords } = useMouseTelemetry();
  const isLight = hudTheme === 'light-profile';

  const padNum = (num: number) => String(num).padStart(4, '0');

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 px-5 sm:px-8 py-2 flex items-center justify-between font-mono-hud text-[9px] uppercase tracking-[0.18em] pointer-events-none select-none transition-all duration-300 ${
        isLight
          ? 'bg-[#F4F6F5]/80 border-t border-[#D8E2DC] text-[#42544D]'
          : activeSection === 1
          ? 'text-[#8A9A92] opacity-25 border-transparent'
          : 'bg-[#040A07]/75 border-t border-[#132A21] text-[#8A9A92] opacity-60'
      }`}
    >
      {/* Left OS & Version */}
      <div className="flex items-center space-x-2.5">
        <span className={isLight ? 'text-[#0A1410] font-semibold' : 'text-white/90 font-semibold'}>
          PORTFOLIO.OS
        </span>
        <span className="opacity-40">/</span>
        <span>V / 03.26</span>
      </div>

      {/* Right Coordinates & Status */}
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 font-mono">
          <span className="opacity-60">X</span>
          <span className={isLight ? 'text-[#0A1410]' : 'text-[#10B981]'}>
            {padNum(coords.x)}
          </span>
          <span className="opacity-40">/</span>
          <span className="opacity-60">Y</span>
          <span className={isLight ? 'text-[#0A1410]' : 'text-[#10B981]'}>
            {padNum(coords.y)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span className={isLight ? 'text-[#0A1410] font-semibold' : 'text-[#10B981] font-semibold'}>
            BUILD STATUS: ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}
