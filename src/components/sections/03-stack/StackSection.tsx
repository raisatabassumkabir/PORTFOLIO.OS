'use client';

import React, { useRef, useEffect, useState } from 'react';
import { StackConfig } from '@/types/portfolio';
import { TechMatrixGrid } from './TechMatrixGrid';
import { ActiveModuleReadout } from './ActiveModuleReadout';
import { StrokeHeading } from '@/components/ui/StrokeHeading';
import { useHudStore } from '@/store/useHudStore';

interface StackSectionProps {
  data: StackConfig;
}

export function StackSection({ data }: StackSectionProps) {
  const activeStackIndex = useHudStore((s) => s.activeStackIndex);
  const setActiveStackIndex = useHudStore((s) => s.setActiveStackIndex);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);
  const isHoveringGridRef = useRef(false);

  const activeItem = data.items[activeStackIndex] || data.items[0];

  const handleHoverChange = (hovering: boolean) => {
    setIsHoveringGrid(hovering);
    isHoveringGridRef.current = hovering;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Track scroll progress p (0.0 to 1.0) through #stack
      const p = Math.min(1, Math.max(0, -rect.top / totalScrollable));

      if (!isHoveringGridRef.current) {
        const scrollIndex = Math.min(8, Math.max(0, Math.floor(p * 9)));
        setActiveStackIndex(scrollIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveStackIndex]);

  return (
    <section
      id="stack"
      ref={containerRef}
      className="relative w-full select-none scroll-mt-16"
      style={{ height: '220vh' }}
    >
      {/* Pinned Sticky Stage */}
      <div
        className="sticky top-0 h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-14 lg:pb-16 px-6 sm:px-10 lg:px-16 xl:px-20 bg-[#020706] transition-colors duration-500 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 75% 25%, rgba(43, 163, 131, 0.18) 0%, rgba(7, 28, 22, 0.08) 35%, transparent 65%), #020706',
        }}
      >
        {/* Background atmospheric glow node matching reference image */}
        <div className="absolute top-[18%] right-[5%] w-[820px] h-[680px] bg-[radial-gradient(circle,rgba(43,163,131,0.22)_0%,rgba(22,101,74,0.09)_45%,transparent_72%)] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1520px] mx-auto flex flex-col justify-between h-full">
          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center h-full">
            {/* Left Column: Headline at top, Active Module Inspector at bottom */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full py-2 lg:py-4">
              <div>
                {/* Eyebrow */}
                <p className="font-mono-hud text-[11px] sm:text-[12px] tracking-[0.18em] uppercase mb-4 text-[#62f5b7]">
                  {data.sectionCode}
                </p>

                {/* Main Headline (Larger size, positioned at the top) */}
                <h2 className="font-heading font-[500] text-5xl sm:text-6xl lg:text-[66px] xl:text-[78px] tracking-[-0.065em] leading-[0.93] text-white">
                  Tools, aligned<br />
                  <span className="stroke-text block font-heading font-[500] tracking-[-0.065em]">around the</span>
                  <span className="stroke-text block font-heading font-[500] tracking-[-0.065em]">mission.</span>
                </h2>

                {/* Subtext */}
                <p className="mt-5 sm:mt-6 font-heading text-sm sm:text-base lg:text-[15px] text-[#88a099] max-w-[420px] leading-[1.7]">
                  {data.helperText}
                </p>
              </div>

              {/* Bottom-left dynamic inspector panel anchored at bottom */}
              <div className="mt-8 lg:mt-0">
                <ActiveModuleReadout activeItem={activeItem} />
              </div>
            </div>

            {/* Right Column: 3x3 Bordered Tech Matrix (Exact 760px max-width from browser code) */}
            <div className="lg:col-span-7 w-full flex justify-end items-center">
              <div className="w-full max-w-[760px]">
                <TechMatrixGrid
                  items={data.items}
                  activeIndex={activeStackIndex}
                  onSelectIndex={setActiveStackIndex}
                  onHoverChange={handleHoverChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
