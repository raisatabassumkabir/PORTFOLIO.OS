'use client';

import React from 'react';
import { useHudStore } from '@/store/useHudStore';
import { scrollToSection } from '@/lib/navigation';

import { portfolioConfig } from '@/config/portfolio.config';

const sections = [
  { index: 1, label: '01', href: '#home' },
  { index: 2, label: '02', href: '#profile' },
  { index: 3, label: '03', href: '#stack' },
  { index: 4, label: '04', href: '#work' },
  { index: 5, label: '05', href: '#journey' },
  { index: 6, label: '06', href: '#contact' },
];

const projectRailAccents: Record<string, { accent: string; isLight: boolean }> = {
  'lets-ryde': { accent: '#008F65', isLight: true },
  'mia-diagnostic': { accent: '#84DCEE', isLight: false },
  'clientbook': { accent: '#7E653D', isLight: true },
  'saif-locators': { accent: '#74BBEB', isLight: false },
  'linear-craze': { accent: '#8075FF', isLight: false },
  'coffee-brew': { accent: '#E18B50', isLight: false },
};

export function SequenceRail() {
  const activeSection = useHudStore((s) => s.activeSection);
  const activeProjectIndex = useHudStore((s) => s.activeProjectIndex);
  const hudTheme = useHudStore((s) => s.hudTheme);

  const currentProject = portfolioConfig.work.projects[activeProjectIndex] || portfolioConfig.work.projects[0];
  const pTheme = activeSection === 4 ? (projectRailAccents[currentProject.id] || { accent: '#008F65', isLight: false }) : null;

  const isLight = pTheme ? pTheme.isLight : hudTheme === 'light-profile';
  const accentColor = pTheme ? pTheme.accent : '#10B981';

  // 4px glowing dot position along the 56px line
  const clampedSection = Math.min(Math.max(activeSection, 1), 6);
  const dotTop = ((clampedSection - 1) / 5) * 52; // 0px to 52px

  const handleRailClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    scrollToSection(index);
  };

  return (
    <aside
      aria-label="Sequence Navigation"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-[70] hidden lg:flex flex-col items-center select-none transition-all duration-300 pointer-events-auto opacity-100 translate-x-0"
    >
      {/* Top: SEQUENCE rotated 90deg */}
      <div
        className={`font-mono-hud text-[9px] uppercase tracking-[0.25em] mb-3 rotate-90 origin-center transition-colors duration-300 pointer-events-none ${
          isLight ? 'text-[#0A1410]/40' : 'text-white/22'
        }`}
      >
        SEQUENCE
      </div>

      {/* Middle: Thin 56px vertical line with single 4px glowing dot */}
      <div
        className={`relative w-[1px] h-[56px] my-3 transition-colors duration-300 pointer-events-none ${
          isLight ? 'bg-[#0A1410]/15' : 'bg-white/12'
        }`}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300"
          style={{
            top: `${dotTop}px`,
            backgroundColor: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />
      </div>

      {/* Bottom (below the line): Stack numbers 01..06 vertically */}
      <div className="flex flex-col items-center gap-[10px] mt-2 pointer-events-auto">
        {sections.map((sec) => {
          const isActive = activeSection === sec.index;
          return (
            <a
              key={sec.label}
              href={sec.href}
              onClick={(e) => handleRailClick(e, sec.index)}
              className="font-mono-hud text-[9px] tracking-wider transition-colors duration-200 cursor-pointer pointer-events-auto p-1"
              style={{
                color: isActive ? accentColor : isLight ? 'rgba(10, 20, 16, 0.35)' : 'rgba(255, 255, 255, 0.25)',
                fontWeight: isActive ? 700 : 500,
                textShadow: isActive && !isLight ? `0 0 6px ${accentColor}80` : 'none',
              }}
              title={`Jump to section ${sec.label}`}
            >
              {sec.label}
            </a>
          );
        })}
      </div>
    </aside>
  );
}
