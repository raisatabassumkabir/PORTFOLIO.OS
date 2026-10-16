'use client';

import React from 'react';

interface HudButtonProps {
  children: React.ReactNode;
  variant?: 'pill-white' | 'pill-mint' | 'pill-lime' | 'outline-cyber' | 'tactical-dark';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function HudButton({
  children,
  variant = 'outline-cyber',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: HudButtonProps) {
  const base =
    'relative inline-flex items-center justify-center font-mono-hud text-[11px] sm:text-[12px] tracking-wider uppercase font-semibold transition-all duration-200 select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    'pill-white':
      'bg-white text-[#072A20] hover:bg-[#EAF3EE] shadow-lg hover:shadow-xl rounded-full px-6 py-3',
    'pill-mint':
      'bg-[#00E599] text-[#050B09] hover:bg-[#20ffb0] font-bold shadow-[0_0_20px_rgba(0,229,153,0.4)] hover:shadow-[0_0_30px_rgba(0,229,153,0.6)] rounded-full px-6 py-3',
    'pill-lime':
      'bg-[#C8FF00] text-[#0E150E] hover:bg-[#d8ff33] font-bold shadow-[0_0_25px_rgba(200,255,0,0.4)] hover:shadow-[0_0_35px_rgba(200,255,0,0.6)] rounded-full px-6 py-3.5',
    'outline-cyber':
      'border border-[#132A21] bg-[#091410]/80 text-[#00E599] hover:border-[#00E599] hover:bg-[#00E599]/10 rounded-full px-4 py-2 backdrop-blur-sm',
    'tactical-dark':
      'border border-[#132A21] bg-[#050B09] text-[#F3F5F4] hover:border-[#00E599] hover:text-[#00E599] px-4 py-2.5 rounded-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
