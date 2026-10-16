'use client';

import React from 'react';

interface StrokeHeadingProps {
  solidText: string;
  outlineText: string;
  lightTheme?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function StrokeHeading({
  solidText,
  outlineText,
  lightTheme = false,
  className = '',
  size = 'lg',
}: StrokeHeadingProps) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl tracking-tight',
    md: 'text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]',
    lg: 'text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.98]',
    hero: 'text-6xl sm:text-7xl md:text-8xl lg:text-[104px] font-extrabold tracking-tighter leading-[0.92]',
  };

  return (
    <div className={`font-heading select-none ${className}`}>
      <div
        className={`${sizeClasses[size]} ${
          lightTheme ? 'text-[#0A1410]' : 'text-[#F3F5F4]'
        }`}
      >
        {solidText}
      </div>
      <div
        className={`${sizeClasses[size]} ${
          lightTheme ? 'stroke-text-light' : 'stroke-text'
        }`}
      >
        {outlineText}
      </div>
    </div>
  );
}
