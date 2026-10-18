'use client';

import React from 'react';
import { CareerNode } from '@/types/portfolio';
import { useHudStore } from '@/store/useHudStore';

interface ExperienceCardStackProps {
  nodes: CareerNode[];
  activeIndex: number;
  onSelectNode: (index: number) => void;
}

export function ExperienceCardStack({
  nodes,
  activeIndex,
  onSelectNode,
}: ExperienceCardStackProps) {
  const setCursorVariant = useHudStore((s) => s.setCursorVariant);
  const activeNode = nodes[activeIndex] || nodes[0];

  // Clean hyphenated date matching close-up reference photo
  const formattedPeriod = (activeNode.period || '').replace(/—/g, '-');

  const handleCardClick = () => {
    const nextIdx = (activeIndex + 1) % nodes.length;
    onSelectNode(nextIdx);
  };

  return (
    <div className="relative w-full max-w-[760px] lg:max-w-[800px] xl:max-w-[840px] select-none">
      {/* Main Active Role Card matching close-up reference photo 1:1 */}
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setCursorVariant('reticle')}
        onMouseLeave={() => setCursorVariant('default')}
        className="w-full rounded-none border-[0.5px] border-[#8B77E8]/35 bg-[#040e0b]/95 min-h-[300px] sm:min-h-[330px] lg:min-h-[345px] py-6 sm:py-7 lg:py-8 px-7 sm:px-9 lg:px-10 flex flex-col justify-center shadow-2xl transition-all duration-500 backdrop-blur-md cursor-pointer"
        style={{
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 119, 232, 0.04)',
        }}
      >
        {/* Date on Top in Lavender / Purple */}
        <div className="font-mono-hud text-[11px] sm:text-xs font-normal tracking-[0.24em] uppercase text-[#9d8bf0] mb-2.5 sm:mb-3">
          {formattedPeriod}
        </div>

        {/* Role Title in Modern Clean Sans (matching reference photo) */}
        <h3 className="font-inter font-semibold text-3xl sm:text-4xl lg:text-[44px] text-[#eefbf6] tracking-[-0.025em] leading-[1.1] mb-2.5 sm:mb-3">
          {activeNode.role}
        </h3>

        {/* Company & Location in Crisp Mint Green Sans */}
        <div className="font-inter text-xs sm:text-[13.5px] lg:text-[14px] font-normal tracking-normal text-[#00E599] mb-5 sm:mb-5.5">
          {activeNode.company}
        </div>

        {/* Highlights with subtle bullet points in matching clean sans */}
        <ul className="space-y-2 sm:space-y-2.5 font-inter text-xs sm:text-[13.5px] lg:text-[14px] leading-[1.6] text-[#9db3aa]">
          {activeNode.highlights.map((bullet, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <span className="text-[#7d998e] text-[13px] leading-none select-none mt-1">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
