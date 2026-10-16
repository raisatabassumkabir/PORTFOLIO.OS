'use client';

import React from 'react';

interface CyberLimeFrameProps {
  children: React.ReactNode;
  copyright?: string;
  onOpenBrief?: () => void;
}

export function CyberLimeFrame({
  children,
  copyright = '© 2026 Martin King. All rights reserved.',
  onOpenBrief,
}: CyberLimeFrameProps) {
  return (
    <div className="relative w-full min-h-screen bg-[#bbf200] p-3 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between overflow-hidden select-none">
      {/* SVG ClipPath Definition for the Futuristic Top Notch */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="contact-capsule-notch" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.035 Q 0,0 0.025,0 L 0.36,0 C 0.38,0 0.39,0.038 0.415,0.038 L 0.585,0.038 C 0.61,0.038 0.62,0 0.64,0 L 0.975,0 Q 1,0 1,0.035 L 1,0.965 Q 1,1 0.975,1 L 0.025,1 Q 0,1 0,0.965 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Right Side Vertical SEQUENCE Rail on the Lime Outer Frame */}
      <aside
        className="hidden md:flex absolute right-2.5 lg:right-3.5 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-20 pointer-events-none text-[#020807]"
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

      {/* Main Inner Dark Cinematic Card with Notch */}
      <div
        className="relative w-full flex-1 rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#030a08] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        style={{
          clipPath: 'url(#contact-capsule-notch)',
          WebkitClipPath: 'url(#contact-capsule-notch)',
        }}
      >
        {children}
      </div>

      {/* Bottom Lime Bar Footer */}
      <footer className="w-full pt-3 px-2 flex items-center justify-between font-mono text-[11px] sm:text-[12px] font-bold text-[#020807] tracking-wider z-20">
        <p className="m-0 text-[#020807]">{copyright}</p>
        <a
          href="mailto:contact@martinking.dev"
          className="hover:opacity-75 transition-opacity inline-flex items-center gap-1.5 text-[#020807] font-black uppercase"
        >
          <span>LET’S BUILD</span>
          <span className="text-sm">↗</span>
        </a>
      </footer>
    </div>
  );
}
