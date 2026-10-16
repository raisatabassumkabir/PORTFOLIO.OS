'use client';

import React from 'react';

interface TechTagProps {
  label: string;
  theme?: 'dark' | 'light' | 'mint' | 'cyan' | 'lime';
  className?: string;
}

export function TechTag({ label, theme = 'dark', className = '' }: TechTagProps) {
  const styles = {
    dark: 'border-[#132A21] bg-[#091410]/70 text-[#9EBCB0]',
    light: 'border-[#D1DCD6] bg-[#FFFFFF] text-[#0A1410]',
    mint: 'border-[#10B981]/40 bg-[#10B981]/10 text-[#059669]',
    cyan: 'border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8]',
    lime: 'border-[#C8FF00]/40 bg-[#C8FF00]/10 text-[#C8FF00]',
  };

  return (
    <span
      className={`inline-block font-mono-hud text-[10px] md:text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${styles[theme]} ${className}`}
    >
      {label}
    </span>
  );
}
