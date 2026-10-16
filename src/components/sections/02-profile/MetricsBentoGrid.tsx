'use client';

import React, { useState } from 'react';
import { ProfileMetric } from '@/types/portfolio';

interface MetricsBentoGridProps {
  metrics: ProfileMetric[];
  assemblyProgress?: number;
}

// Directional origins matching the reference profile-assembly.js
const cardOrigins = [
  // Card 0: 4+ years (top-left) - enters from TOP: shifted left, coming down from above
  {
    x: -110,
    y: -340,
    turn: -10,
    stagger: 0.03,
  },
  // Card 1: 12+ projects (top-right) - enters from TOP-RIGHT: shifted right and up
  {
    x: 360,
    y: -240,
    turn: 12,
    stagger: 0.06,
  },
  // Card 2: 99% satisfaction (bottom-left) - enters from BOTTOM-LEFT: shifted left and down
  {
    x: -110,
    y: 360,
    turn: 9,
    stagger: 0.1,
  },
  // Card 3: 8+ technologies (bottom-right) - enters from BOTTOM-RIGHT: shifted right and down
  {
    x: 360,
    y: 360,
    turn: -11,
    stagger: 0.13,
  },
];

function BentoCard({
  m,
  index,
  assemblyProgress,
}: {
  m: ProfileMetric;
  index: number;
  assemblyProgress: number;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const cfg = cardOrigins[index % cardOrigins.length];

  const isAssembled = assemblyProgress >= 0.999;
  const startOffset = cfg.stagger;
  const effectiveProgress = Math.min(1, Math.max(0, (assemblyProgress - startOffset) / (1 - startOffset)));
  const eased = 1 - Math.pow(1 - effectiveProgress, 2.2);
  const remaining = 1 - eased;
  const totalX = cfg.x * remaining;
  const totalY = cfg.y * remaining;
  const totalTurn = cfg.turn * remaining;

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group rounded-[28px] bg-white p-7 sm:p-8 flex flex-col justify-between border border-[#E5EBE8] select-none min-h-[200px] sm:min-h-[220px]"
      style={{
        boxShadow: isHovering
          ? '0 25px 45px -8px rgba(7, 42, 32, 0.12)'
          : '0 10px 30px -5px rgba(7, 42, 32, 0.04)',
        transform: !isAssembled
          ? `perspective(1000px) rotate(${totalTurn.toFixed(2)}deg) translate3d(${totalX.toFixed(1)}px, ${totalY.toFixed(1)}px, 0)`
          : 'none',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        willChange: !isAssembled ? 'transform' : 'auto',
      }}
    >
      <div>
        {/* Top Stat Row: Large Number + Small Label */}
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-sans text-5xl sm:text-6xl lg:text-[64px] font-[350] sm:font-normal text-[#0A1410] tracking-tight leading-none">
            {m.value}
          </span>
          <span className="font-sans text-xs sm:text-[13px] text-[#71877E] lowercase tracking-normal self-end pb-1">
            {m.label}
          </span>
        </div>

        {/* Delicate divider line matching reference screenshot */}
        <div className="w-full h-[1px] bg-black/[0.08] my-3 sm:my-4" />

        {/* Description Text */}
        <p className="font-sans text-xs sm:text-[13px] text-[#52665E] leading-[1.65]">
          {m.description}
        </p>
      </div>
    </div>
  );
}

export function MetricsBentoGrid({
  metrics,
  assemblyProgress = 1,
}: MetricsBentoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full items-stretch">
      {metrics.map((m, idx) => (
        <BentoCard
          key={m.label}
          m={m}
          index={idx}
          assemblyProgress={assemblyProgress}
        />
      ))}
    </div>
  );
}

