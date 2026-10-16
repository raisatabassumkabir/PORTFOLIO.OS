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


  // Compute theme styles dynamically across sections and project matrix
  let navStyle = {
    bg: 'bg-[#040A07]/80 border-transparent text-[#F3F5F4]',
    accentColor: '#10B981',
    isLight: false,
    dotBg: 'bg-[#10B981]',
  };

  if (activeSection === 2) {
    // Section 02: Profile
    navStyle = {
      bg: 'bg-[#F4F6F5]/90 border-[#D8E2DC] text-[#0A1410]',
      accentColor: '#072A20',
      isLight: true,
      dotBg: 'bg-[#10B981]',
    };
  } else if (activeSection === 4) {
    // Section 04: Project Matrix (Dynamic theme from active project)
    const project = portfolioConfig.work.projects[activeProjectIndex] || portfolioConfig.work.projects[0];
    const isLight =
      project.theme.bg === '#E6FAF3' ||
      project.theme.bg === '#FAF6EE' ||
      project.id === 'lets-ryde' ||
      project.id === 'clientbook';
    navStyle = {
      bg: isLight
        ? 'bg-[#E3F9F1]/95 border-[#C7E3D8] text-[#0A1410]'
        : 'bg-[#071013]/90 border-[#162E38] text-[#F1F5F9]',
      accentColor: project.theme.accentColor,
      isLight,
      dotBg: project.theme.accentColor,
    };
  } else if (activeSection === 6) {
    // Section 06: Final Transmission
    navStyle = {
      bg: 'bg-[#101610]/90 border-[#C8FF00]/40 text-white',
      accentColor: '#C8FF00',
      isLight: false,
      dotBg: 'bg-[#C8FF00]',
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
        className={`fixed z-[70] transition-all duration-500 pointer-events-auto ${
          activeSection === 1
            ? 'top-0 left-0 right-0 h-16 sm:h-20 bg-transparent border-transparent'
            : `top-3 sm:top-5 left-3 sm:left-7 lg:left-9 right-3 sm:right-7 lg:right-9 h-16 backdrop-blur-md border ${
                navStyle.isLight
                  ? 'bg-[#F4F6F5]/90 border-[#D8E2DC] text-[#0A1410]'
                  : activeSection === 6
                  ? 'bg-[#101610]/90 border-[#C8FF00]/40 text-white'
                  : 'bg-[#020706]/80 border-[rgba(117,255,213,0.18)] text-[#F1F5F9]'
              }`
        }`}
      >
        <div
          className={`w-full h-full flex items-center justify-between pointer-events-auto relative ${
            activeSection === 1 ? 'px-6 sm:px-12 lg:px-16' : 'px-4 sm:px-6 lg:px-8'
          }`}
        >
          {/* Top-left Brand Monogram: TB / MK with green accent */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 1)}
            className="flex items-center cursor-pointer select-none group pointer-events-auto"
            aria-label={`${monogram} Home`}
          >
            <span
              className={`font-heading font-extrabold text-2xl tracking-[-0.06em] transition-colors duration-300 leading-none ${
                navStyle.isLight ? 'text-[#0A1410]' : 'text-white'
              }`}
            >
              {brandPrefix}
            </span>
            <b
              className={`font-heading font-black text-2xl transition-colors duration-300 ${
                navStyle.isLight ? 'text-[#08795A]' : 'text-[#00E599]'
              }`}
              style={{
                textShadow: navStyle.isLight ? 'none' : '0 0 10px rgba(0, 229, 153, 0.7)',
              }}
            >
              {brandSuffix}
            </b>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 pointer-events-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.index;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.index)}
                  className={`relative font-mono-hud text-[11px] tracking-[0.22em] transition-all duration-200 py-1 cursor-pointer select-none pointer-events-auto ${
                    isActive
                      ? navStyle.isLight
                        ? 'text-[#0A1410] font-bold'
                        : 'text-white font-semibold'
                      : navStyle.isLight
                      ? 'text-[#6E847D] hover:text-[#0A1410]'
                      : 'text-[#759087] hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className={`absolute -bottom-1.5 left-0 right-0 h-[2px] ${
                        navStyle.isLight ? 'bg-[#08795A]' : 'bg-[#00E599]'
                      }`}
                      style={{
                        boxShadow: navStyle.isLight ? 'none' : '0 0 6px rgba(0, 229, 153, 0.6)',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Top-Right Action Trigger */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={openBriefModal}
              className={`group flex items-center gap-2.5 px-3 py-1.5 font-mono-hud text-[11px] tracking-[0.2em] transition-all duration-200 cursor-pointer pointer-events-auto ${
                activeSection === 1
                  ? 'text-white border border-[rgba(16,185,129,0.25)] bg-[rgba(7,19,18,0.45)] hover:border-[#00E599] hover:bg-[#00E599]/10'
                  : navStyle.isLight
                  ? 'text-[#0A1410] hover:text-[#08795A]'
                  : 'text-[#D1D5DB] hover:text-white'
              }`}
            >
              <span
                className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                  navStyle.isLight ? 'bg-[#08795A]' : 'bg-[#00E599] shadow-[0_0_8px_#00E599]'
                }`}
              />
              <span>LET&apos;S CONNECT</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1.5 rounded transition-colors cursor-pointer pointer-events-auto ${
                navStyle.isLight ? 'text-[#0A1410]' : 'text-white'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Dynamic Scroll Progress Bar along bottom border */}
        {activeSection !== 1 && (
          <div className="absolute -bottom-[1px] left-0 right-0 h-[1.5px] overflow-hidden pointer-events-none">
            <div
              className="h-full transition-all duration-150"
              style={{
                width: `${scrollProgress}%`,
                background: 'linear-gradient(90deg, #62f5b7, #54d9ff)',
              }}
            />
          </div>
        )}
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
