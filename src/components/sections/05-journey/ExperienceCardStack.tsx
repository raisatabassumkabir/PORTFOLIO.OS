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
  const prevNode = activeIndex > 0 ? nodes[activeIndex - 1] : null;
  const nextNode = activeIndex < nodes.length - 1 ? nodes[activeIndex + 1] : null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl select-none">
      {/* Ghosted Previous Role (activeIndex - 1) Above */}
      {prevNode ? (
        <div
          onClick={() => onSelectNode(activeIndex - 1)}
          className="w-full cursor-pointer transition-all duration-300 mb-2 select-none"
          style={{
            opacity: 0.16,
            transform: 'scale(0.95)',
            filter: 'blur(1px)',
          }}
        >
          <div className="rounded-xl border border-[#162E25] bg-[#07130F] p-2.5 sm:p-3 flex items-center justify-between hover:opacity-100 transition-opacity">
            <div>
              <div className="font-mono-hud text-[9px] sm:text-[10px] text-[#6E857C] uppercase tracking-widest">
                PREVIOUS NODE : {prevNode.role}
              </div>
              <div className="font-mono-hud text-[11px] sm:text-xs text-[#8EA8A0]">
                {prevNode.period} · {prevNode.company}
              </div>
            </div>
            <span className="font-mono-hud text-xs text-[#00E599] font-bold">{prevNode.nodeNumber}</span>
          </div>
        </div>
      ) : (
        <div className="h-4 invisible" />
      )}

      {/* Main Active Role inside bordered dark card */}
      <div
        onMouseEnter={() => setCursorVariant('reticle')}
        onMouseLeave={() => setCursorVariant('default')}
        className="w-full rounded-xl border border-[#162E25] bg-[#07130F] p-5 sm:p-7 lg:p-8 shadow-2xl transition-all duration-300 z-10"
        style={{
          opacity: 1,
          transform: 'translateY(0)',
          boxShadow: '0 25px 50px -10px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 229, 153, 0.05)',
        }}
      >
        {/* Date on Top */}
        <div className="font-mono-hud text-[11px] sm:text-xs tracking-widest uppercase text-[#8B98A5] mb-1.5 sm:mb-2">
          {activeNode.period}
        </div>

        {/* Role Title */}
        <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-1.5 sm:mb-2">
          {activeNode.role}
        </h3>

        {/* Company & Location in Vivid Emerald */}
        <div className="font-mono-hud text-xs sm:text-sm text-[#00E599] font-semibold tracking-wider mb-4 sm:mb-5">
          {activeNode.company}
        </div>

        {/* Highlights with solid round bullets */}
        <div className="space-y-2 sm:space-y-2.5 font-sans text-xs sm:text-sm text-[#D0E2D9] leading-relaxed">
          {activeNode.highlights.map((bullet, idx) => (
            <div key={idx} className="flex items-start space-x-2.5">
              <span className="text-[#00E599] text-sm leading-none mt-0.5">•</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ghosted Next Role (activeIndex + 1) Below */}
      {nextNode ? (
        <div
          onClick={() => onSelectNode(activeIndex + 1)}
          className="w-full cursor-pointer transition-all duration-300 mt-2 select-none"
          style={{
            opacity: 0.16,
            transform: 'scale(0.95)',
            filter: 'blur(1px)',
          }}
        >
          <div className="rounded-xl border border-[#162E25] bg-[#07130F] p-2.5 sm:p-3 flex items-center justify-between hover:opacity-100 transition-opacity">
            <div>
              <div className="font-mono-hud text-[9px] sm:text-[10px] text-[#6E857C] uppercase tracking-widest">
                NEXT NODE : {nextNode.role}
              </div>
              <div className="font-mono-hud text-[11px] sm:text-xs text-[#8EA8A0]">
                {nextNode.period} · {nextNode.company}
              </div>
            </div>
            <span className="font-mono-hud text-xs text-[#00E599] font-bold">{nextNode.nodeNumber}</span>
          </div>
        </div>
      ) : (
        <div className="h-4 invisible" />
      )}
    </div>
  );
}
