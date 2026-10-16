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

  return (
    <div className="relative flex flex-col items-center select-none py-2 h-full">
      {/* Top spine segment */}
      <div className="w-[1.5px] h-28 bg-gradient-to-b from-[#132A21] via-[#8B5CF6]/60 to-[#8B5CF6]" />

      {/* Main Active Node Circular Ring: glowing purple/emerald circle containing active index */}
      <div className="relative my-3">
        {/* Outer glowing purple/emerald ring */}
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#8B5CF6] bg-[#050B09] flex items-center justify-center transition-all duration-300"
          style={{
            boxShadow:
              '0 0 25px rgba(139, 92, 246, 0.45), 0 0 15px rgba(16, 185, 129, 0.35)',
          }}
        >
          {/* Inner emerald accent ring */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#10B981]/60 bg-[#071510] flex items-center justify-center font-mono-hud text-xs sm:text-sm font-bold text-white tracking-widest">
            <span className="text-[#34D399] font-black">{activeNode.nodeNumber}</span>
          </div>
        </div>
      </div>

      {/* Bottom continuous spine line */}
      <div className="w-[1.5px] flex-1 min-h-[140px] bg-gradient-to-b from-[#8B5CF6] via-[#10B981]/50 to-transparent" />
    </div>
  );
}
