'use client';

import React, { useRef, useEffect } from 'react';
import { JourneyConfig } from '@/types/portfolio';
import { TimelineSpine } from './TimelineSpine';
import { ExperienceCardStack } from './ExperienceCardStack';
import { StrokeHeading } from '@/components/ui/StrokeHeading';
import { useHudStore } from '@/store/useHudStore';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface JourneySectionProps {
  data: JourneyConfig;
}

export function JourneySection({ data }: JourneySectionProps) {
  const activeJourneyIndex = useHudStore((s) => s.activeJourneyIndex);
  const setActiveJourneyIndex = useHudStore((s) => s.setActiveJourneyIndex);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = data.nodes;

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
        const targetScroll = containerRef.current.offsetTop + ((idx + 0.1) / nodes.length) * totalScrollable;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeJourneyIndex - 1 + nodes.length) % nodes.length;
    handleSelectNode(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeJourneyIndex + 1) % nodes.length;
    handleSelectNode(nextIdx);
  };

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative w-full select-none scroll-mt-16"
      style={{ height: '220vh' }}
    >
      <span id="experience" className="absolute top-0 pointer-events-none invisible" />
      {/* Pinned Sticky Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-16 pb-14 sm:pt-18 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-[#050B09] transition-colors duration-500 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E599]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between h-full max-h-[calc(100vh-7.5rem)]">
          {/* Top Section Tag */}
          <div className="mb-4 sm:mb-6 flex items-center space-x-2 font-mono-hud text-xs text-[#00E599] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
            <span>{data.sectionCode}</span>
          </div>

          {/* 3-Column Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
            {/* Left Column: Heading & Node Telemetry */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
              <div>
                <StrokeHeading
                  solidText={data.titleSolid}
                  outlineText={data.titleOutline}
                  size="lg"
                />
                <p className="mt-4 sm:mt-6 font-sans text-xs sm:text-sm md:text-base text-[#6E857C] max-w-sm leading-relaxed">
                  Growth measured in shipped systems, verified production metrics, and reliable software delivery.
                </p>
              </div>
            </div>

            {/* Center Spine */}
            <div className="hidden md:flex lg:col-span-2 justify-center items-center">
              <TimelineSpine
                nodes={nodes}
                activeIndex={activeJourneyIndex}
                onSelectNode={handleSelectNode}
              />
            </div>

            {/* Right Column: Card Stack */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <ExperienceCardStack
                nodes={nodes}
                activeIndex={activeJourneyIndex}
                onSelectNode={handleSelectNode}
              />
            </div>
          </div>

          {/* Bottom Status Row with ACTIVE NODE counter */}
          <div className="pt-3 mb-6 sm:mb-8 border-t border-[#132A21] flex items-center justify-between font-mono-hud text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                aria-label="Previous role"
                className="p-1.5 rounded border border-[#132A21] text-[#6E857C] hover:text-[#00E599] hover:border-[#00E599] transition-colors cursor-pointer"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next role"
                className="p-1.5 rounded border border-[#132A21] text-[#6E857C] hover:text-[#00E599] hover:border-[#00E599] transition-colors cursor-pointer"
              >
                <ChevronDown size={16} />
              </button>
              <span className="text-[#6E857C] text-[11px] ml-2 uppercase">
                CYCLE CAREER TIMELINE
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-[#6E857C] text-[10px] sm:text-xs tracking-widest uppercase">
                ACTIVE NODE
              </span>
              <span className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
                {String(activeJourneyIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[#6E857C] text-sm">
                / {String(nodes.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
