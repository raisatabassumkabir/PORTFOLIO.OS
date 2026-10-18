'use client';

import React, { useState, useEffect } from 'react';
import { useHudStore } from '@/store/useHudStore';
import { scrollToSection } from '@/lib/navigation';
import { portfolioConfig } from '@/config/portfolio.config';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'HOME', href: '#home', index: 1 },
  { label: 'PROFILE', href: '#profile', index: 2 },
  { label: 'STACK', href: '#stack', index: 3 },
  { label: 'WORK', href: '#work', index: 4 },
  { label: 'JOURNEY', href: '#journey', index: 5 },
  { label: 'CONTACT', href: '#contact', index: 6 },
];

export function TopNavbar() {
  const activeSection = useHudStore((s) => s.activeSection);
  const activeProjectIndex = useHudStore((s) => s.activeProjectIndex);
  const openBriefModal = useHudStore((s) => s.openBriefModal);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const monogram = portfolioConfig.meta.monogram || 'TB';
  const brandPrefix = monogram.endsWith('.') || monogram.endsWith('|') ? monogram.slice(0, -1) : monogram;
  const brandSuffix = monogram.endsWith('|') ? '|' : '.';


  // Dynamic Project Theming for Section 04 (Work) matching deployed RYDE, MIA, CB, SL, LC, CBR palettes
  const projectNavThemes: Record<string, { bg: string; text: string; muted: string; accent: string; border: string; isLight: boolean }> = {
    'lets-ryde': {
      bg: 'rgba(255, 255, 255, 0.92)',
      text: '#07110E',
      muted: '#4C655C',
      accent: '#008F65',
      border: 'rgba(0, 143, 101, 0.28)',
      isLight: true,
    },
    'mia-diagnostic': {
      bg: 'rgba(12, 29, 34, 0.90)',
      text: '#EEFBF6',
      muted: '#92B3B5',
      accent: '#84DCEE',
      border: 'rgba(132, 220, 238, 0.28)',
      isLight: false,
    },
    'clientbook': {
      bg: 'rgba(242, 231, 207, 0.92)',
      text: '#2B2216',
      muted: '#69573D',
      accent: '#7E653D',
      border: 'rgba(126, 101, 61, 0.28)',
      isLight: true,
    },
    'saif-locators': {
      bg: 'rgba(31, 69, 99, 0.90)',
      text: '#EFF8FF',
      muted: '#A6C7DC',
      accent: '#74BBEB',
      border: 'rgba(116, 187, 235, 0.28)',
      isLight: false,
    },
    'linear-craze': {
      bg: 'rgba(31, 32, 84, 0.90)',
      text: '#F4F3FF',
      muted: '#AEADDA',
      accent: '#8075FF',
      border: 'rgba(128, 117, 255, 0.28)',
      isLight: false,
    },
    'coffee-brew': {
      bg: 'rgba(65, 36, 26, 0.90)',
      text: '#FFF4EB',
      muted: '#C7A38D',
      accent: '#E18B50',
      border: 'rgba(225, 139, 80, 0.28)',
      isLight: false,
    },
  };

  // Compute theme styles dynamically across sections
  let navStyle = {
    bg: 'rgba(2, 7, 6, 0.85)',
    border: 'rgba(117, 255, 213, 0.18)',
    text: '#F3F5F4',
    muted: '#759087',
    accentColor: '#10B981',
    isLight: false,
  };

  if (activeSection === 2) {
    // Section 02: Profile
    navStyle = {
      bg: 'rgba(244, 246, 245, 0.95)',
      border: '#D8E2DC',
      text: '#0A1410',
      muted: '#6E847D',
      accentColor: '#072A20',
      isLight: true,
    };
  } else if (activeSection === 4) {
    // Section 04: Project Matrix (Exact dynamic project theme)
    const project = portfolioConfig.work.projects[activeProjectIndex] || portfolioConfig.work.projects[0];
    const pt = projectNavThemes[project.id] || {
      bg: project.theme.bg,
      text: project.theme.textColor,
      muted: '#759087',
      accent: project.theme.accentColor,
      border: 'rgba(16, 185, 129, 0.28)',
      isLight: project.theme.bg === '#E6FAF3' || project.theme.bg === '#FAF6EE',
    };
    navStyle = {
      bg: pt.bg,
      border: pt.border,
      text: pt.text,
      muted: pt.muted,
      accentColor: pt.accent,
      isLight: pt.isLight,
    };
  } else if (activeSection === 6) {
    // Section 06: Final Transmission
    navStyle = {
      bg: 'rgba(16, 22, 16, 0.95)',
      border: 'rgba(200, 255, 0, 0.4)',
      text: '#FFFFFF',
      muted: '#A3B19B',
      accentColor: '#C8FF00',
      isLight: false,
    };
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollToSection(index);
  };

  return (
    <>
      <header
        className={`fixed left-4 right-4 sm:left-8 sm:right-8 lg:left-9 lg:right-9 top-3.5 sm:top-5 h-[62px] sm:h-[68px] z-[70] transition-all duration-500 border rounded-none backdrop-blur-xl ${
          activeSection === 6
            ? 'opacity-0 -translate-y-[150%] pointer-events-none'
            : activeSection === 1 && scrollProgress < 2
            ? 'bg-transparent border-transparent pointer-events-auto'
            : 'shadow-[0_12px_40px_rgba(0,0,0,0.08)] pointer-events-auto'
        }`}
        style={{
          backgroundColor: activeSection === 1 && scrollProgress < 2 ? 'transparent' : navStyle.bg,
          borderColor: activeSection === 1 && scrollProgress < 2 ? 'transparent' : navStyle.border,
          color: navStyle.text,
        }}
      >
        <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 pointer-events-auto relative">
          {/* Top-left Brand Monogram: TB / MK with vertical accent bar */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 1)}
            className="flex items-center cursor-pointer select-none group pointer-events-auto"
            aria-label={`${monogram} Home`}
          >
            <span
              className="font-heading font-black text-2xl tracking-[-0.04em] transition-colors duration-300 leading-none"
              style={{ color: navStyle.text }}
            >
              {brandPrefix}
            </span>
            <b
              className="font-heading font-black text-2xl transition-colors duration-300 ml-0.5 leading-none"
              style={{
                color: navStyle.accentColor,
                textShadow: navStyle.isLight ? 'none' : `0 0 10px ${navStyle.accentColor}80`,
              }}
            >
              |
            </b>
          </a>

          {/* Desktop Nav Items Centered via mx-auto */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-9 mx-auto pointer-events-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.index;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.index)}
                  className="relative font-mono-hud text-[11px] tracking-[0.18em] transition-all duration-200 py-1 cursor-pointer select-none pointer-events-auto uppercase"
                  style={{
                    color: isActive ? navStyle.text : navStyle.muted,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-2 left-0 right-0 h-[1.5px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: navStyle.accentColor,
                        boxShadow: navStyle.isLight ? 'none' : `0 0 6px ${navStyle.accentColor}99`,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Top-Right Action Trigger: Clean borderless dot + text matching reference photos */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={openBriefModal}
              className="group flex items-center gap-2 font-mono-hud text-[11px] font-medium tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer pointer-events-auto"
              style={{ color: navStyle.text }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                style={{
                  backgroundColor: navStyle.accentColor,
                  boxShadow: navStyle.isLight ? 'none' : `0 0 8px ${navStyle.accentColor}`,
                }}
              />
              <span>LET&apos;S CONNECT</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded transition-colors cursor-pointer pointer-events-auto"
              style={{ color: navStyle.text }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Dynamic Accent / Progress Line along bottom border of navbar */}
        <div
          className="absolute -bottom-[1px] left-0 right-0 h-[1.5px] overflow-hidden pointer-events-none"
          style={{
            backgroundColor: `${navStyle.accentColor}25`,
          }}
        >
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${Math.max(scrollProgress, activeSection === 4 ? 66 : 10)}%`,
              background: `linear-gradient(90deg, ${navStyle.accentColor}, #54D9FF)`,
              boxShadow: `0 0 10px ${navStyle.accentColor}`,
            }}
          />
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[75] bg-[#040A07]/95 backdrop-blur-xl flex flex-col justify-center items-center p-8 space-y-6 md:hidden pointer-events-auto">
          <div className="font-mono-hud text-xs text-[#10B981] tracking-widest uppercase mb-4">
            // SEQUENCE NAVIGATION
          </div>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.index)}
              className={`font-heading text-2xl font-bold tracking-wider transition-colors cursor-pointer pointer-events-auto ${
                activeSection === item.index
                  ? 'text-[#10B981]'
                  : 'text-[#6E857C] hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openBriefModal();
            }}
            className="mt-6 w-full max-w-xs py-3 rounded-full bg-[#10B981] text-[#040A07] font-mono-hud font-bold text-sm tracking-widest uppercase cursor-pointer pointer-events-auto"
          >
            OPEN PROJECT BRIEF +
          </button>
        </div>
      )}
    </>
  );
}
