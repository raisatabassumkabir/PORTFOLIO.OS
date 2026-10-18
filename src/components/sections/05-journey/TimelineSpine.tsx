'use client';

import React from 'react';
import { CareerNode } from '@/types/portfolio';

interface TimelineSpineProps {
  nodes: CareerNode[];
  activeIndex: number;
  onSelectNode: (index: number) => void;
}

export function TimelineSpine({ nodes, activeIndex, onSelectNode }: TimelineSpineProps) {
  const activeNode = nodes[activeIndex] || nodes[0];
  const nodeNum = (activeNode.nodeNumber || String(activeIndex + 1).padStart(2, '0')).replace(/^0/, 'Ø');

  const handleClick = () => {
    const nextIdx = (activeIndex + 1) % nodes.length;
    onSelectNode(nextIdx);
  };

  return (
    <div className="relative flex flex-col items-center select-none h-full py-0">
      {/* Thin straight vertical line ABOVE circle (Lavender/Purple with soft glow - 1px thin) */}
      <div
        className="w-[1px] flex-1 min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] bg-gradient-to-b from-transparent via-[#8B77E8]/70 to-[#8B77E8]"
        style={{
          boxShadow: '0 0 8px rgba(139, 119, 232, 0.45)',
        }}
      />

      {/* Prominent Circular Ring with THIN 1px border */}
      <button
        type="button"
        onClick={handleClick}
        className="relative my-0 w-[106px] h-[106px] sm:w-[116px] sm:h-[116px] lg:w-[122px] lg:h-[122px] rounded-full border border-[#8B77E8]/80 bg-[#020706] flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none flex-shrink-0"
        style={{
          boxShadow: '0 0 24px rgba(139, 119, 232, 0.22), inset 0 0 10px rgba(139, 119, 232, 0.05)',
        }}
        title="Click to advance role"
        aria-label={`Current Role ${nodeNum}: ${activeNode.role}`}
      >
        <span className="font-mono-hud text-xs sm:text-sm font-bold text-[#a58cff] tracking-widest">
          {nodeNum}
        </span>
      </button>

      {/* Thin straight vertical line BELOW circle (Mint Green - 1px thin) */}
      <div
        className="w-[1px] flex-1 min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] bg-gradient-to-b from-[#00E599] via-[#00E599]/70 to-transparent"
        style={{
          boxShadow: '0 0 8px rgba(0, 229, 153, 0.45)',
        }}
      />
    </div>
  );
}
