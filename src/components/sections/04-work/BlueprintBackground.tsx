'use client';

import React from 'react';
import { ProjectTheme } from '@/types/portfolio';

interface BlueprintBackgroundProps {
  theme?: ProjectTheme;
  bg?: string;
  gridColor?: string;
  glowColor?: string;
}

export function BlueprintBackground({ theme, bg, gridColor, glowColor }: BlueprintBackgroundProps) {
  const finalBg = bg || theme?.bg || '#071013';
  const finalGrid = gridColor || theme?.gridColor || 'rgba(16, 185, 129, 0.08)';
  const finalGlow = glowColor || theme?.borderGlow || 'rgba(16, 185, 129, 0.25)';

  return (
    <div
      className="absolute inset-0 transition-colors duration-700 ease-in-out pointer-events-none"
      style={{
        backgroundColor: finalBg,
        backgroundImage: `
          linear-gradient(to right, ${finalGrid} 1px, transparent 1px),
          linear-gradient(to bottom, ${finalGrid} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Dynamic ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-35 transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: finalGlow,
        }}
      />
    </div>
  );
}
