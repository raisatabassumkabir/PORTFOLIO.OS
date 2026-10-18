'use client';

import React, { useRef, useEffect } from 'react';
import { JourneyConfig } from '@/types/portfolio';
import { TimelineSpine } from './TimelineSpine';
import { ExperienceCardStack } from './ExperienceCardStack';
import { useHudStore } from '@/store/useHudStore';

interface JourneySectionProps {
  data: JourneyConfig;
}

export function JourneySection({ data }: JourneySectionProps) {
  const activeJourneyIndex = useHudStore((s) => s.activeJourneyIndex);
  const setActiveJourneyIndex = useHudStore((s) => s.setActiveJourneyIndex);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = data.nodes;

  const prevNode = activeJourneyIndex > 0 ? nodes[activeJourneyIndex - 1] : null;
  const nextNode = activeJourneyIndex < nodes.length - 1 ? nodes[activeJourneyIndex + 1] : null;

  // Clean strings for 1st and 2nd lines
  const cleanSolid = (data.titleSolid || 'Growth measured').trim();
  const rawOutline = (data.titleOutline || 'in shipped systems.').trim();
  const cleanOutline = rawOutline.replace(/^in\s+in\s+/i, 'in ');

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Track scroll progress p (0.0 to 1.0) through #journey
      const p = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      const nextIndex = Math.min(nodes.length - 1, Math.max(0, Math.floor(p * nodes.length)));
      setActiveJourneyIndex(nextIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nodes.length, setActiveJourneyIndex]);

  const handleSelectNode = (idx: number) => {
    setActiveJourneyIndex(idx);
    if (containerRef.current) {
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const targetScroll = containerRef.current.offsetTop + ((idx + 0.5) / nodes.length) * totalScrollable;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative w-full select-none scroll-mt-16"
      style={{ height: '320vh' }}
    >
      <span id="experience" className="absolute top-0 pointer-events-none invisible" />
      {/* Pinned Sticky Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-[76px] sm:pt-[84px] lg:pt-[88px] pb-6 sm:pb-8 px-4 sm:px-8 lg:px-10 xl:px-12 bg-[#020706] transition-colors duration-700 overflow-hidden">
        {/* Blueprint subtle cyber background grid & ambient light */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 229, 153, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 153, 0.035) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[700px] h-[700px] bg-[#00E599]/[0.035] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#a58cff]/[0.025] rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1640px] mx-auto flex flex-col justify-between h-full">
          {/* Main Content Area: Side-by-Side 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] gap-6 lg:gap-10 xl:gap-14 items-start w-full my-auto">
            {/* Left Column: Eyebrow + Exact 2-Line Heading (shifted further to the left) */}
            <div className="flex flex-col items-start w-fit pt-6 sm:pt-8 lg:pt-14 -ml-1 sm:-ml-2 lg:-ml-3">
              {/* Eyebrow: • 05 / CAREER CONSTELLATION */}
              <div className="flex items-center space-x-2 font-mono-hud text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#00E599] mb-4 sm:mb-5">
                <span className="w-1.5 h-1.5 bg-[#00E599] shadow-[0_0_8px_#00E599]" />
                <span>{data.sectionCode}</span>
              </div>

              {/* Headline: 1st line "Growth measured", 2nd line "in shipped systems." */}
              <h2 className="font-heading font-bold tracking-[-0.04em] leading-[0.96] text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px]">
                <span className="block text-white mb-1.5 whitespace-nowrap">
                  {cleanSolid}
                </span>
                <span
                  className="block font-bold whitespace-nowrap"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1.1px rgba(238, 251, 246, 0.45)',
                  }}
                >
                  {cleanOutline}
                </span>
              </h2>
            </div>

            {/* Right Column: Spine on left + Previous Node / Card / Next Node on right */}
            <div className="flex items-center space-x-6 sm:space-x-8 lg:space-x-10 w-full pt-4">
              {/* Timeline Spine: Vertical Straight Line (Purple Above, Single Circle, Green Below) */}
              <div className="flex-shrink-0 flex items-center justify-center self-stretch">
                <TimelineSpine
                  nodes={nodes}
                  activeIndex={activeJourneyIndex}
                  onSelectNode={handleSelectNode}
                />
              </div>

              {/* Card Container with Previous Node Peek Above & Next Node Peek Below */}
              <div className="flex flex-col w-full">
                {/* PREVIOUS NODE Shadow Peek (Above Card) - subtle, ghostly, less visible */}
                <div className="min-h-[48px] mb-5 sm:mb-6 lg:mb-8 flex items-center">
                  {prevNode ? (
                    <button
                      type="button"
                      onClick={() => handleSelectNode(activeJourneyIndex - 1)}
                      className="cursor-pointer transition-all duration-300 opacity-20 hover:opacity-85 flex flex-col text-left group focus:outline-none"
                      aria-label={`Previous node: ${prevNode.role}`}
                    >
                      <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#426056] font-medium font-mono-hud mb-0.5">
                        ↑ PREVIOUS NODE
                      </span>
                      <strong className="font-inter text-xs sm:text-[13px] font-semibold text-[#6d6491] tracking-tight group-hover:text-[#a58cff] transition-colors">
                        {prevNode.role}
                      </strong>
                      <small className="text-[10px] sm:text-[10.5px] text-[#41564f] font-inter">
                        {(prevNode.period || '').replace(/—/g, '-')} · {prevNode.company}
                      </small>
                    </button>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>

                {/* Main Active Card */}
                <div className="w-full">
                  <ExperienceCardStack
                    nodes={nodes}
                    activeIndex={activeJourneyIndex}
                    onSelectNode={handleSelectNode}
                  />
                </div>

                {/* NEXT NODE Shadow Peek (Below Card) - subtle, ghostly, less visible */}
                <div className="min-h-[48px] mt-6 sm:mt-7 lg:mt-9 flex items-center">
                  {nextNode ? (
                    <button
                      type="button"
                      onClick={() => handleSelectNode(activeJourneyIndex + 1)}
                      className="cursor-pointer transition-all duration-300 opacity-20 hover:opacity-85 flex flex-col text-left group focus:outline-none"
                      aria-label={`Next node: ${nextNode.role}`}
                    >
                      <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#426056] font-medium font-mono-hud mb-0.5">
                        NEXT NODE ↓
                      </span>
                      <strong className="font-inter text-xs sm:text-[13px] font-semibold text-[#6d6491] tracking-tight group-hover:text-[#a58cff] transition-colors">
                        {nextNode.role}
                      </strong>
                      <small className="text-[10px] sm:text-[10.5px] text-[#41564f] font-inter">
                        {(nextNode.period || '').replace(/—/g, '-')} · {nextNode.company}
                      </small>
                    </button>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Row: ACTIVE NODE counter on right matching Picture 1 */}
          <div className="w-full flex items-end justify-end font-mono-hud pb-8 sm:pb-12 lg:pb-14">
            <div className="flex items-baseline space-x-3 ml-auto">
              <span className="text-[#6E857C] text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-light">
                ACTIVE NODE
              </span>
              <span className="font-mono-hud text-3xl sm:text-4xl lg:text-[44px] font-light text-[#a58cff] tracking-wider leading-none">
                {String(activeJourneyIndex + 1).padStart(2, '0').replace(/^0/, 'Ø')}
              </span>
              <span className="font-mono-hud text-xs sm:text-sm font-light text-[#5d736b]">
                / {String(nodes.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
