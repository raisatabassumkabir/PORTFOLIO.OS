'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProfileConfig } from '@/types/portfolio';
import { TiltedBioCard } from './TiltedBioCard';
import { MetricsBentoGrid } from './MetricsBentoGrid';

interface ProfileSectionProps {
  data: ProfileConfig;
}

export function ProfileSection({ data }: ProfileSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [assemblyProgress, setAssemblyProgress] = useState(1);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowH = window.innerHeight;

          // Start assembly when top of profile enters the viewport
          // Complete assembly (1.0) when top reaches near top of viewport (e.g. 10% of window height)
          const start = windowH * 0.9;
          const end = windowH * 0.08;

          let progress = 1;
          if (rect.top > end) {
            progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
          } else {
            progress = 1;
          }

          setAssemblyProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="profile"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-12 bg-[#F4F6F5] transition-colors duration-500 overflow-hidden scroll-mt-16 select-none"
    >
      <span id="about" className="absolute top-0 pointer-events-none" />
      {/* Subtle organic ambient background atmosphere */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#072A20]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#10B981]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1360px] mx-auto">
        {/* 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-stretch">
          {/* Left Bio Card (5 columns) */}
          <div className="lg:col-span-5 w-full flex">
            <TiltedBioCard
              greeting={data.greeting}
              paragraphs={data.bioParagraphs}
              resumeUrl={data.resumeUrl}
              assemblyProgress={assemblyProgress}
            />
          </div>

          {/* Right Metrics Grid (7 columns) */}
          <div className="lg:col-span-7 w-full flex">
            <MetricsBentoGrid
              metrics={data.metrics}
              assemblyProgress={assemblyProgress}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

