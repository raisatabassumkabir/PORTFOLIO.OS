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
  const finalGrid = gridColor || 'rgba(16, 185, 129, 0.07)';
  const finalGlow = glowColor ? `${glowColor}25` : 'rgba(16, 185, 129, 0.16)';

  return (
    <div
      className="absolute inset-0 transition-colors duration-700 ease-in-out pointer-events-none"
      style={{
        backgroundColor: finalBg,
        backgroundImage: `
          radial-gradient(circle at 74% 38%, ${finalGlow}, transparent 34%),
          linear-gradient(${finalGrid} 1px, transparent 1px),
          linear-gradient(90deg, ${finalGrid} 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 54px 54px, 54px 54px',
      }}
    />
  );
}
