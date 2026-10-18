'use client';

import React from 'react';

interface CyberLimeFrameProps {
  children: React.ReactNode;
  copyright?: string;
  onOpenBrief?: () => void;
}

export function CyberLimeFrame({
  children,
  copyright = '© 2026 Talha Badar. All rights reserved.',
  onOpenBrief,
}: CyberLimeFrameProps) {
  return (
    <div className="relative w-full min-h-screen bg-[#bbf200] p-1.5 sm:p-2 md:p-2.5 overflow-hidden select-none">
      {/* Exact SVG ClipPath Definition precisely matched to reference design telemetry */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="contact-capsule-notch" clipPathUnits="objectBoundingBox">
            <path d="M 0.025 0.045 Q 0 0.045 0 0.075 L 0 0.93 Q 0 0.96 0.025 0.96 L 0.16 0.96 C 0.175 0.96 0.18 0.986 0.195 0.986 L 0.805 0.986 C 0.82 0.986 0.825 0.96 0.84 0.96 L 0.975 0.96 Q 1 0.96 1 0.93 L 1 0.075 Q 1 0.045 0.975 0.045 L 0.62 0.045 C 0.6 0.045 0.59 0 0.57 0 L 0.43 0 C 0.41 0 0.4 0.045 0.38 0.045 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Right Side Vertical SEQUENCE Rail on the Lime Outer Frame */}
      <aside
        className="hidden md:flex absolute right-1.5 lg:right-2 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-20 pointer-events-none text-[#020807]"
        aria-hidden="true"
      >
        <span
          className="font-mono text-[9px] font-bold tracking-[0.22em] text-[#020807] mb-2"
          style={{ writingMode: 'vertical-rl' }}
        >
          SEQUENCE
        </span>
        <div className="flex flex-col items-center gap-2 font-mono text-[10px] font-semibold text-[#020807]/60">
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
          <span>05</span>
          <span className="w-5 h-5 rounded-sm bg-[#020807] text-[#bbf200] font-bold flex items-center justify-center text-[10px] shadow-sm">
            06
          </span>
        </div>
      </aside>

      {/* Main Inner Dark Cinematic Card with Precision ClipPath */}
      <div
        className="relative w-full min-h-[calc(100vh-0.75rem)] sm:min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-1.25rem)] overflow-hidden bg-[#030a08] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        style={{
          clipPath: 'url(#contact-capsule-notch)',
          WebkitClipPath: 'url(#contact-capsule-notch)',
        }}
      >
        {children}
      </div>

      {/* Left Bottom Tab: Copyright Text inside lime cutout */}
      <div className="absolute bottom-2 sm:bottom-2.5 left-5 sm:left-7 md:left-8 z-20 pointer-events-auto">
        <p className="font-mono text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#020807] tracking-wider m-0 select-none">
          {copyright}
        </p>
      </div>

      {/* Right Bottom Tab: LET'S BUILD Action Link inside lime cutout */}
      <div className="absolute bottom-2 sm:bottom-2.5 right-5 sm:right-7 md:right-8 z-20 pointer-events-auto">
        <a
          href="mailto:info.talhabadar@gmail.com"
          className="group hover:opacity-80 transition-opacity inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] md:text-[12px] font-black text-[#020807] uppercase tracking-wider select-none"
        >
          <span>LET’S BUILD</span>
          <span className="text-xs sm:text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-sans">↗</span>
        </a>
      </div>
    </div>
  );
}
