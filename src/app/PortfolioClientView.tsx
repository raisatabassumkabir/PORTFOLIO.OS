'use client';

import React from 'react';
import { PortfolioConfig } from '@/types/portfolio';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { HeroSection } from '@/components/sections/01-hero/HeroSection';
import { ProfileSection } from '@/components/sections/02-profile/ProfileSection';
import { StackSection } from '@/components/sections/03-stack/StackSection';
import { WorkSection } from '@/components/sections/04-work/WorkSection';
import { JourneySection } from '@/components/sections/05-journey/JourneySection';
import { ContactSection } from '@/components/sections/06-contact/ContactSection';

interface PortfolioClientViewProps {
  data: PortfolioConfig;
}

export function PortfolioClientView({ data }: PortfolioClientViewProps) {
  // Observes viewport scroll and updates sequence rail + HUD contrast
  useSectionObserver();

  return (
    <div className="relative w-full flex flex-col">
      {/* 01: HERO & CYBERNETIC X-RAY REVEAL */}
      <HeroSection data={data.hero} />

      {/* 02: PROFILE & 3D BENTO GRID (LIGHT THEME) */}
      <ProfileSection data={data.profile} />

      {/* 03: STACK & TECHNOLOGY ARSENAL */}
      <StackSection data={data.stack} />

      {/* 04: WORK & DYNAMIC THEMED PROJECT MATRIX */}
      <WorkSection data={data.work} />

      {/* 05: JOURNEY & CAREER CONSTELLATION */}
      <JourneySection data={data.journey} />

      {/* 06: CONTACT & FINAL TRANSMISSION */}
      <ContactSection data={data.contact} />
    </div>
  );
}
