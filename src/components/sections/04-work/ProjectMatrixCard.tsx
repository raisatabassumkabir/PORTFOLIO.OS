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
  muted: string;
  accent: string;
  border: string;
  isLight: boolean;
}

interface ProjectMatrixCardProps {
  project: ProjectItem;
  atmosphere: Atmosphere;
  onOpenCaseStudy: (id: string) => void;
}

export function ProjectMatrixCard({ project, atmosphere, onOpenCaseStudy }: ProjectMatrixCardProps) {
  const setCursorVariant = useHudStore((s) => s.setCursorVariant);

  return (
    <div
      className="relative w-full h-[440px] sm:h-[460px] lg:h-[480px] xl:h-[500px] rounded-none overflow-hidden border shadow-2xl transition-all duration-700 grid grid-cols-1 lg:grid-cols-2"
      style={{
        backgroundColor: atmosphere.cardRight,
        borderColor: atmosphere.border,
        color: atmosphere.text,
        boxShadow: `0 24px 70px ${atmosphere.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.45)'}`,
      }}
    >
      {/* Left Preview Canvas with data-cursor="reticle" */}
      <div
        data-cursor="reticle"
        onClick={() => onOpenCaseStudy(project.id)}
        onMouseEnter={() => setCursorVariant('reticle')}
        onMouseLeave={() => setCursorVariant('default')}
        className="relative h-full p-5 sm:p-7 flex flex-col justify-between cursor-pointer group overflow-hidden border-b lg:border-b-0 lg:border-r transition-colors duration-700"
        style={{
          background: atmosphere.cardLeft,
          borderColor: atmosphere.border,
        }}
      >
        {/* Top-Left Project Number (e.g. P / 01) */}
        <div
          className="absolute top-4 left-5 z-10 font-mono-hud text-[11px] font-medium tracking-[0.2em]"
          style={{ color: atmosphere.accent }}
        >
          {project.code}
        </div>

        {/* Central 3-Phone Mockup Presentation */}
        <div className="relative my-auto w-full h-[74%] max-h-[340px] flex items-center justify-center py-2">
          <div className="relative w-full h-full max-w-[420px] transition-transform duration-500 group-hover:scale-[1.025]">
            <Image
              src={project.mockupImage}
              alt={project.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.25)]"
              priority
            />
          </div>
        </div>

        {/* Bottom Canvas Subtitle (e.g. PASSENGER + DRIVER EXPERIENCES) */}
        <div
          className="absolute bottom-3 left-0 right-0 z-10 text-center font-mono-hud text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em]"
          style={{ color: `${atmosphere.text}90` }}
        >
          {project.canvasSubtitle}
        </div>
      </div>

      {/* Right Specification Panel - Vertically Centered Writing */}
      <div
        className="h-full p-6 sm:p-8 lg:p-9 xl:p-10 flex flex-col justify-center transition-colors duration-700"
        style={{ backgroundColor: atmosphere.cardRight }}
      >
        {/* Category Tag (e.g. REAL-TIME MOBILITY) */}
        <div
          className="font-mono-hud text-[10px] sm:text-[10.5px] font-medium tracking-[0.2em] uppercase mb-2 sm:mb-2.5"
          style={{ color: atmosphere.accent }}
        >
          {project.category}
        </div>

        {/* Project Title */}
        <h3
          className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] tracking-[-0.035em] leading-[0.98] mb-3 sm:mb-3.5"
          style={{ color: atmosphere.text }}
        >
          {project.title}
        </h3>

        {/* Summary Paragraph */}
        <p
          className="font-sans text-[13px] sm:text-[13.5px] lg:text-[14px] leading-[1.6] mb-5 sm:mb-6 max-w-[390px]"
          style={{ color: atmosphere.muted }}
        >
          {project.summary}
        </p>

        {/* Tech Stack Pills matching reference photos */}
        <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono-hud text-[10px] sm:text-[10.5px] uppercase tracking-[0.06em] px-2.5 py-1 rounded-none border transition-colors"
              style={{
                borderColor: atmosphere.border,
                backgroundColor: `${atmosphere.accent}12`,
                color: atmosphere.muted,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Horizontal Divider + Read Case Study Action Button */}
        <div
          className="w-full pt-3 sm:pt-4 border-t transition-colors duration-500"
          style={{ borderColor: atmosphere.border }}
        >
          <button
            type="button"
            onClick={() => onOpenCaseStudy(project.id)}
            className="group inline-flex items-center space-x-2 font-mono-hud text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer"
            style={{ color: atmosphere.text }}
          >
            <span>READ CASE STUDY</span>
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: atmosphere.accent }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
