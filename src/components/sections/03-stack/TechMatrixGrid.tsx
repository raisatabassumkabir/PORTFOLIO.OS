'use client';

import React from 'react';
import { StackItem } from '@/types/portfolio';

interface TechMatrixGridProps {
  items: StackItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onHoverChange?: (hovering: boolean) => void;
}

export function TechMatrixGrid({
  items,
  activeIndex,
  onSelectIndex,
  onHoverChange,
}: TechMatrixGridProps) {
  return (
    <div
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
      className="grid grid-cols-3 gap-[1px] bg-[rgba(117,255,213,0.25)] border border-[rgba(117,255,213,0.25)] select-none w-full max-w-[760px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={item.id}
            data-cursor-hover="true"
            data-skill-cell="true"
            role="button"
            tabIndex={0}
            onMouseEnter={() => onSelectIndex(index)}
            onClick={() => onSelectIndex(index)}
            className={`group skill-cell relative p-4 flex flex-col justify-between min-h-[132px] transition-all duration-350 cursor-pointer ${
              isActive
                ? 'bg-[rgba(25,87,67,0.28)] shadow-[inset_0_0_25px_rgba(98,245,183,0.08)]'
                : 'bg-[rgba(3,12,10,0.72)] hover:bg-[rgba(25,87,67,0.28)] hover:shadow-[inset_0_0_25px_rgba(98,245,183,0.08)]'
            }`}
          >
            {/* Top Row: Module Index */}
            <div className="flex items-start justify-between font-mono-hud text-[10px] leading-none">
              <span
                className={`font-light tracking-[0.1em] transition-colors duration-200 ${
                  isActive ? 'text-[#62f5b7]' : 'text-[#536a62] group-hover:text-[#62f5b7]'
                }`}
              >
                {item.number}
              </span>
            </div>

            {/* Center: Tech Name (Exact 1rem / 16px from browser code) */}
            <div className="my-auto py-1">
              <span
                className={`font-sans text-[16px] font-normal tracking-[-0.01em] block transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#eefbf6] group-hover:text-white'
                }`}
              >
                {item.name}
              </span>
            </div>

            {/* Bottom Row: Category */}
            <div className="font-mono-hud text-[9px] leading-none">
              <span
                className={`font-light tracking-[0.1em] uppercase transition-colors duration-200 ${
                  isActive ? 'text-[#62f5b7]' : 'text-[#536a62] group-hover:text-[#62f5b7]'
                }`}
              >
                {item.category}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
