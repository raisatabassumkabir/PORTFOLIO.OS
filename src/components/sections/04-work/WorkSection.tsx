'use client';

import React, { useRef, useEffect } from 'react';
import { WorkConfig } from '@/types/portfolio';
import { ProjectMatrixCard, Atmosphere } from './ProjectMatrixCard';
import { BlueprintBackground } from './BlueprintBackground';
import { StrokeHeading } from '@/components/ui/StrokeHeading';
import { useHudStore } from '@/store/useHudStore';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface WorkSectionProps {
  data: WorkConfig;
}

const atmospheres: Record<string, Atmosphere> = {
  'lets-ryde': {
    bg: '#E3F9F1',
    grid: 'rgba(10,30,22,0.06)',
    cardLeft: '#D4F5E9',
    cardRight: '#FFFFFF',
    text: '#08140E',
    accent: '#059669',
    isLight: true,
  },
  'mia-diagnostic': {
    bg: '#060E12',
    grid: 'rgba(16,185,129,0.06)',
    cardLeft: '#09151B',
    cardRight: '#081217',
    text: '#F3F5F4',
    accent: '#38BDF8',
    isLight: false,
  },
  'clientbook': {
    bg: '#FAF6EE',
    grid: 'rgba(217, 119, 6, 0.08)',
    cardLeft: '#F5EFE0',
    cardRight: '#FFFFFF',
    text: '#1F1A12',
    accent: '#D97706',
    isLight: true,
  },
  'saif-locators': {
    bg: '#132D46',
    grid: 'rgba(255,255,255,0.06)',
    cardLeft: '#163450',
    cardRight: '#163450',
    text: '#F3F5F4',
    accent: '#58A6FF',
    isLight: false,
  },
  'linear-craze': {
    bg: '#0D0B1C',
    grid: 'rgba(129, 140, 248, 0.08)',
    cardLeft: '#14112B',
    cardRight: '#100D22',
    text: '#F5F3FF',
    accent: '#818CF8',
    isLight: false,
  },
  'coffee-brew': {
    bg: '#140C08',
    grid: 'rgba(245, 158, 11, 0.08)',
    cardLeft: '#1C120C',
    cardRight: '#180E09',
    text: '#FEF3C7',
    accent: '#D97706',
    isLight: false,
  },
};

export function WorkSection({ data }: WorkSectionProps) {
  const activeProjectIndex = useHudStore((s) => s.activeProjectIndex);
  const setActiveProjectIndex = useHudStore((s) => s.setActiveProjectIndex);
  const openCaseStudy = useHudStore((s) => s.openCaseStudy);

  const containerRef = useRef<HTMLDivElement>(null);
  const projects = data.projects;
  const currentProject = projects[activeProjectIndex] || projects[0];
  const currentAtmosphere =
    atmospheres[currentProject.id] || {
      bg: currentProject.theme.bg,
      grid: currentProject.theme.gridColor,
      cardLeft: currentProject.theme.cardBg,
      cardRight: currentProject.theme.cardBg,
      text: currentProject.theme.textColor,
      accent: currentProject.theme.accentColor,
      isLight: currentProject.theme.bg === '#E6FAF3' || currentProject.theme.bg === '#FAF6EE',
    };

  const isLight = currentAtmosphere.isLight;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Track scroll progress p (0.0 to 1.0) through #work
      const p = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      const nextIndex = Math.min(projects.length - 1, Math.max(0, Math.floor(p * projects.length)));
      setActiveProjectIndex(nextIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projects.length, setActiveProjectIndex]);

  const nextProject = () => {
    const nextIdx = (activeProjectIndex + 1) % projects.length;
    setActiveProjectIndex(nextIdx);
    if (containerRef.current) {
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const targetScroll = containerRef.current.offsetTop + ((nextIdx + 0.1) / projects.length) * totalScrollable;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  const prevProject = () => {
    const prevIdx = (activeProjectIndex - 1 + projects.length) % projects.length;
    setActiveProjectIndex(prevIdx);
    if (containerRef.current) {
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const targetScroll = containerRef.current.offsetTop + ((prevIdx + 0.1) / projects.length) * totalScrollable;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative w-full select-none scroll-mt-16"
      style={{ height: '240vh' }}
    >
      <span id="portfolio" className="absolute top-0 pointer-events-none invisible" />
      {/* Pinned Sticky Stage */}
      <div
        className="sticky top-0 h-screen w-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 overflow-hidden transition-colors duration-700"
        style={{ backgroundColor: currentAtmosphere.bg }}
      >
        {/* Blueprint Dynamic Morphing Grid Background */}
        <BlueprintBackground
          bg={currentAtmosphere.bg}
          gridColor={currentAtmosphere.grid}
          glowColor={currentAtmosphere.accent}
        />

        <div className="relative z-10 w-full max-w-[1520px] mx-auto flex flex-col justify-center h-full max-h-[calc(100vh-6.5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column (lg:col-span-5 xl:col-span-4): Eyebrow + Heading */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
              <p
                className="font-mono-hud text-xs tracking-widest uppercase mb-4 sm:mb-6"
                style={{ color: currentAtmosphere.accent }}
              >
                {data.sectionCode}
              </p>

              <StrokeHeading
                solidText={data.titleSolid}
                outlineText={data.titleOutline}
                lightTheme={isLight}
                size="lg"
              />
            </div>

            {/* Right Column (lg:col-span-7 xl:col-span-8): Project Counter + Card + Bottom Controls */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center w-full">
              {/* Top Project Counter (e.g. 05 ------- 06) */}
              <div className="flex items-center justify-end space-x-3 mb-3 font-mono-hud text-xs font-semibold">
                <span style={{ color: currentAtmosphere.accent }}>
                  {String(activeProjectIndex + 1).padStart(2, '0')}
                </span>
                <span
                  className="w-16 sm:w-24 h-[1px] opacity-30"
                  style={{ backgroundColor: isLight ? '#08140E' : '#FFFFFF' }}
                />
                <span className={isLight ? 'text-[#08140E]/50' : 'text-white/50'}>
                  {String(projects.length).padStart(2, '0')}
                </span>
              </div>

              {/* The Dual Split Project Card */}
              <div className="w-full">
                <ProjectMatrixCard
                  project={currentProject}
                  atmosphere={currentAtmosphere}
                  onOpenCaseStudy={openCaseStudy}
                />
              </div>

              {/* Bottom Control / Status Bar */}
              <div
                className={`mt-3 sm:mt-4 pt-2 flex flex-row items-center justify-between gap-3 font-mono-hud text-[10px] sm:text-[11px] tracking-wider uppercase transition-colors duration-500 ${
                  isLight ? 'text-[#08140E]/70' : 'text-[#8EA8A0]'
                }`}
              >
                {/* Left Prompt */}
                <div className="opacity-75 flex items-center space-x-2">
                  <span>SCROLL TO ADVANCE · CLICK TO INSPECT</span>
                </div>

                {/* Right External Trigger */}
                <div>
                  <a
                    href="https://github.com/martinking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 rounded-sm border font-mono-hud text-[10px] sm:text-[11px] font-medium tracking-wider uppercase transition-all duration-200 inline-flex items-center space-x-1.5 ${
                      isLight
                        ? 'border-[#08140E]/30 hover:border-[#08140E] text-[#08140E]'
                        : 'border-white/30 hover:border-white text-white'
                    }`}
                  >
                    <span>COMPLETE PORTFOLIO</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
