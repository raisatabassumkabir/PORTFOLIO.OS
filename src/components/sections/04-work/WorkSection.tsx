'use client';

import React, { useRef, useEffect } from 'react';
import { WorkConfig } from '@/types/portfolio';
import { ProjectMatrixCard, Atmosphere } from './ProjectMatrixCard';
import { BlueprintBackground } from './BlueprintBackground';
import { StrokeHeading } from '@/components/ui/StrokeHeading';
import { useHudStore } from '@/store/useHudStore';
import { ArrowUpRight } from 'lucide-react';

interface WorkSectionProps {
  data: WorkConfig;
}

const atmospheres: Record<string, Atmosphere> = {
  'lets-ryde': {
    bg: '#E1FAEF',
    grid: 'rgba(0, 143, 101, 0.08)',
    cardLeft: 'radial-gradient(ellipse at 50% 55%, rgba(0, 143, 101, 0.16), transparent 70%), #E1FAEF',
    cardRight: '#FFFFFF',
    text: '#07110E',
    muted: '#4C655C',
    accent: '#008F65',
    border: 'rgba(0, 143, 101, 0.28)',
    isLight: true,
  },
  'mia-diagnostic': {
    bg: '#081418',
    grid: 'rgba(132, 220, 238, 0.07)',
    cardLeft: 'radial-gradient(ellipse at 50% 55%, rgba(132, 220, 238, 0.16), transparent 70%), #081418',
    cardRight: '#0C1D22',
    text: '#EEFBF6',
    muted: '#92B3B5',
    accent: '#84DCEE',
    border: 'rgba(132, 220, 238, 0.28)',
    isLight: false,
  },
  'clientbook': {
    bg: '#E2D5B8',
    grid: 'rgba(126, 101, 61, 0.08)',
    cardLeft: 'radial-gradient(ellipse at 50% 55%, rgba(126, 101, 61, 0.16), transparent 70%), #E2D5B8',
    cardRight: '#F2E7CF',
    text: '#2B2216',
    muted: '#69573D',
    accent: '#7E653D',
    border: 'rgba(126, 101, 61, 0.28)',
    isLight: true,
  },
  'saif-locators': {
    bg: '#1A3A54',
    grid: 'rgba(116, 187, 235, 0.08)',
    cardLeft: 'radial-gradient(ellipse at 50% 55%, rgba(116, 187, 235, 0.16), transparent 70%), #1A3A54',
    cardRight: '#1F4563',
    text: '#EFF8FF',
    muted: '#A6C7DC',
    accent: '#74BBEB',
    border: 'rgba(116, 187, 235, 0.28)',
    isLight: false,
  },
  'linear-craze': {
    bg: '#181946',
    grid: 'rgba(128, 117, 255, 0.08)',
    cardLeft: 'radial-gradient(ellipse at 50% 55%, rgba(128, 117, 255, 0.16), transparent 70%), #181946',
    cardRight: '#1F2054',
    text: '#F4F3FF',
    muted: '#AEADDA',
    accent: '#8075FF',
    border: 'rgba(128, 117, 255, 0.28)',
    isLight: false,
  },
  'coffee-brew': {
    bg: '#311B14',
    grid: 'rgba(225, 139, 80, 0.08)',
    cardLeft: 'radial-gradient(ellipse at 50% 55%, rgba(225, 139, 80, 0.16), transparent 70%), #311B14',
    cardRight: '#41241A',
    text: '#FFF4EB',
    muted: '#C7A38D',
    accent: '#E18B50',
    border: 'rgba(225, 139, 80, 0.28)',
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
      muted: '#759087',
      accent: currentProject.theme.accentColor,
      border: 'rgba(16, 185, 129, 0.28)',
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

  const handlePrevProject = prevProject;
  const handleNextProject = nextProject;

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

        <div className="relative z-10 w-full max-w-[1520px] mx-auto h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] gap-8 lg:gap-10 xl:gap-14 items-start w-full">
            {/* Left Column: Heading starts at top */}
            <div className="flex flex-col items-start w-full pt-1">
              {/* Eyebrow: • 04 / PROJECT MATRIX */}
              <div className="flex items-center space-x-2 font-mono-hud text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-5">
                <span
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                  style={{ backgroundColor: currentAtmosphere.accent }}
                />
                <span
                  className="transition-colors duration-500"
                  style={{ color: currentAtmosphere.accent }}
                >
                  {data.sectionCode}
                </span>
              </div>

              {/* Main Heading: Selected systems. Real product territory. */}
              <h2 className="font-heading font-extrabold tracking-[-0.04em] leading-[0.98] transition-colors duration-500 text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px]">
                <span
                  className="block transition-colors duration-500"
                  style={{ color: currentAtmosphere.text }}
                >
                  {data.titleSolid}
                </span>
                <span
                  className="block transition-colors duration-500 font-extrabold"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: `1.2px ${currentAtmosphere.text}45`,
                  }}
                >
                  {data.titleOutline}
                </span>
              </h2>
            </div>

            {/* Right Column: Project Counter + Card + Bottom Controls */}
            <div className="flex flex-col items-end w-full pt-1">
              {/* Top Project Counter: 01 ─────── 06 */}
              <div className="flex items-center justify-end space-x-3 mb-3 font-mono-hud text-xs font-semibold">
                <span
                  className="transition-colors duration-500"
                  style={{ color: currentAtmosphere.accent }}
                >
                  {String(activeProjectIndex + 1).padStart(2, '0')}
                </span>
                <span
                  className="w-16 sm:w-24 h-[1px] transition-colors duration-500"
                  style={{ backgroundColor: `${currentAtmosphere.accent}66` }}
                />
                <span
                  className="transition-colors duration-500"
                  style={{ color: `${currentAtmosphere.text}66` }}
                >
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
                className="w-full mt-3 sm:mt-4 pt-1 flex flex-row items-center justify-between gap-3 font-mono-hud text-[10px] sm:text-[11px] tracking-[0.16em] uppercase transition-colors duration-500"
                style={{ color: currentAtmosphere.muted }}
              >
                {/* Left Prompt */}
                <div className="opacity-75 flex items-center space-x-2">
                  <span>SCROLL TO ADVANCE · CLICK TO INSPECT</span>
                </div>

                {/* Right External Trigger: Underlined text link matching reference photos */}
                <div>
                  <a
                    href="https://github.com/martinking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 pb-0.5 border-b font-mono-hud text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: currentAtmosphere.accent,
                      color: currentAtmosphere.text,
                    }}
                  >
                    <span>COMPLETE PORTFOLIO</span>
                    <ArrowUpRight size={12} style={{ color: currentAtmosphere.accent }} />
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
