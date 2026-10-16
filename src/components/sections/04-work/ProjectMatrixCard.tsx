'use client';

import React from 'react';
import Image from 'next/image';
import { ProjectItem } from '@/types/portfolio';
import { useHudStore } from '@/store/useHudStore';
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';

export interface Atmosphere {
  bg: string;
  grid: string;
  cardLeft: string;
  cardRight: string;
  text: string;
  accent: string;
  isLight: boolean;
}

interface ProjectMatrixCardProps {
  project: ProjectItem;
  atmosphere?: Atmosphere;
  onOpenCaseStudy: (id: string) => void;
}

export function ProjectMatrixCard({ project, atmosphere, onOpenCaseStudy }: ProjectMatrixCardProps) {
  const setCursorVariant = useHudStore((s) => s.setCursorVariant);
  const isLight = atmosphere ? atmosphere.isLight : (project.theme.bg === '#E6FAF3' || project.theme.bg === '#FAF6EE');
  const cardLeftBg = atmosphere?.cardLeft || (isLight ? '#E1F7EE' : '#050D11');
  const cardRightBg = atmosphere?.cardRight || (isLight ? '#FFFFFF' : '#091418');
  const textColor = atmosphere?.text || (isLight ? '#06261C' : '#F3F5F4');
  const accentColor = atmosphere?.accent || project.theme.accentColor;

  // Subtitle descriptions for the preview header matching screenshots
  const previewCaptions: Record<string, string> = {
    'lets-ryde': "Let's Ryde mobile screens showing ride search, signup and driver payment requests",
    'mia-diagnostic': 'MIA mobile application screens with driver tools and accident assistance',
    'clientbook': 'ClientBook mobile application screens with client records, calendar and statistics',
    'saif-locators': 'SaifLocators mobile application screens with map geofencing and admin tools',
    'linear-craze': 'Linear Craze mobile application screens with matrix input and calculation tools',
    'coffee-brew': 'CoffeeBrew mobile application screens with shared crew list and brew preferences',
  };

  const previewDescription = previewCaptions[project.id] || `${project.title} interface screens`;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-700 flex flex-col lg:flex-row ${
        isLight ? 'border-[#C7E3D8]' : 'border-[#162E38]'
      }`}
      style={{
        backgroundColor: cardRightBg,
        color: textColor,
        boxShadow: `0 25px 50px -12px ${isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.6)'}`,
      }}
    >
      {/* Left Preview Canvas with data-cursor="reticle" */}
      <div
        data-cursor="reticle"
        onClick={() => onOpenCaseStudy(project.id)}
        onMouseEnter={() => setCursorVariant('reticle')}
        onMouseLeave={() => setCursorVariant('default')}
        className={`relative flex-1 min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] p-6 sm:p-7 lg:p-8 flex flex-col justify-between cursor-pointer group overflow-hidden border-b lg:border-b-0 lg:border-r transition-colors duration-700 ${
          isLight ? 'border-[#C7E3D8]' : 'border-[#1E3345]/50'
        }`}
        style={{
          backgroundColor: cardLeftBg,
        }}
      >
        {/* Top-Left Project Number (e.g. P / 05) */}
        <div className="z-10 font-mono-hud text-xs font-bold tracking-widest opacity-60">
          {project.code}
        </div>

        {/* Central Mockup Presentation */}
        <div className="relative my-auto w-full h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[370px] flex items-center justify-center py-2">
          {/* Mockup Image */}
          <div
            className="relative w-full h-full max-w-[460px] transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ position: 'relative' }}
          >
            <Image
              src={project.mockupImage}
              alt={project.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 550px"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Bottom Canvas Subtitle (e.g. MATRIX INPUT + LINEAR ALGEBRA TOOLS) */}
        <div
          className={`z-10 text-center font-mono-hud text-[10px] sm:text-[11px] uppercase tracking-widest ${
            isLight ? 'text-[#355246]/80' : 'text-white/60'
          }`}
        >
          {project.canvasSubtitle}
        </div>
      </div>

      {/* Right Specification Panel */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          {/* Category Tag (e.g. MOBILE MATHEMATICS) */}
          <div
            className="font-mono-hud text-xs font-semibold tracking-widest uppercase mb-2 sm:mb-3"
            style={{ color: accentColor }}
          >
            {project.category}
          </div>

          {/* Project Title */}
          <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 leading-none">
            {project.title}
          </h3>

          {/* Summary */}
          <p
            className={`font-sans text-xs sm:text-sm lg:text-base leading-relaxed mb-6 ${
              isLight ? 'text-[#355246]' : 'text-white/70'
            }`}
          >
            {project.summary}
          </p>

          {/* Tech Stack Pills with connected styling */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => (
              <span
                key={t}
                className={`font-mono-hud text-[11px] tracking-wider px-3 py-1 rounded-sm border transition-colors ${
                  isLight
                    ? 'border-[#08140E]/20 bg-[#08140E]/5 text-[#08140E]'
                    : 'border-white/20 bg-white/[0.03] text-white/90'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Read Case Study Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onOpenCaseStudy(project.id)}
            className={`group inline-flex items-center justify-between space-x-8 font-mono-hud text-xs font-bold tracking-widest uppercase pb-1 border-b transition-all duration-200 cursor-pointer ${
              isLight
                ? 'border-[#08140E]/30 text-[#08140E] hover:border-[#059669] hover:text-[#059669]'
                : 'border-white/30 text-white hover:border-[#38BDF8] hover:text-[#38BDF8]'
            }`}
          >
            <span>READ CASE STUDY</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
