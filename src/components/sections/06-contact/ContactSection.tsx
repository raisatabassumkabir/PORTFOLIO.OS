'use client';

import React from 'react';
import Image from 'next/image';
import { ContactConfig } from '@/types/portfolio';
import { CyberLimeFrame } from './CyberLimeFrame';
import { FloatingTechRow } from './FloatingTechRow';
import { useHudStore } from '@/store/useHudStore';
import { ArrowUpRight, Plus } from 'lucide-react';

interface ContactSectionProps {
  data: ContactConfig;
}

export function ContactSection({ data }: ContactSectionProps) {
  const openBriefModal = useHudStore((s) => s.openBriefModal);

  const pages = [
    { label: 'HOME', href: '#home' },
    { label: 'PROFILE', href: '#profile' },
    { label: 'STACK', href: '#stack' },
    { label: 'WORK', href: '#work' },
    { label: 'JOURNEY', href: '#journey' },
  ];

  const connects = [
    { label: 'EMAIL', href: 'mailto:info.talhabadar@gmail.com' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/talha-badar-85a79726a/' },
    { label: 'GITHUB', href: 'https://github.com/talhabadar' },
    { label: 'CALL', href: 'tel:+923335256437' },
  ];

  return (
    <section id="contact" className="relative w-full min-h-screen scroll-mt-0">
      <CyberLimeFrame copyright={data.copyright || '© 2026 Talha Badar. All rights reserved.'} onOpenBrief={openBriefModal}>
        {/* Subtle Background Contours matching live site */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-80 120C130 10 230 210 420 92S710 30 775 218 1030 342 1110 132s310-78 570 45"
            fill="none"
            stroke="#bbf200"
            strokeWidth="1"
          />
          <path
            d="M-90 340c170-180 310 38 470-82s280-42 355 130 265 92 352-54 300-122 570 38"
            fill="none"
            stroke="#bbf200"
            strokeWidth="0.8"
          />
          <path
            d="M-70 640c180-134 285 52 468-78s330-18 390 150 252 54 350-86 292-92 530 52"
            fill="none"
            stroke="#bbf200"
            strokeWidth="0.8"
          />
          <path
            d="M110 930c-16-224 184-205 260-62s224 88 285-54 246-180 364-30 274 118 404-8 235-90 306 30"
            fill="none"
            stroke="#bbf200"
            strokeWidth="1"
          />
        </svg>

        {/* Top Header Bar inside Dark Card */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-8 sm:pt-9 md:pt-10 px-6 sm:px-10 flex items-center justify-between pointer-events-none">
          {/* Top-Left Brand Monogram */}
          <div className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight select-none pointer-events-auto">
            TB<span className="text-[#bbf200]">.</span>
          </div>

          {/* Top-Right Availability Status */}
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#bbf200] uppercase select-none pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#bbf200] shadow-[0_0_8px_#bbf200] animate-pulse" />
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>
        </div>

        {/* Headline in Top-Center (Signature sign removed) */}
        <div className="relative z-20 flex flex-col items-center text-center pt-3.5 sm:pt-4 md:pt-5 px-4">
          <p className="font-mono text-[10px] sm:text-xs font-bold text-[#bbf200] tracking-[0.24em] uppercase mb-1 sm:mb-2">
            06 // FINAL TRANSMISSION
          </p>

          <div className="relative">
            {/* High-Contrast Editorial Serif Headline matching reference screenshot */}
            <h2 className="font-editorial font-black text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] tracking-[-0.03em] leading-[0.92] select-none text-center">
              <span className="block text-white uppercase font-black drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                YOU IMAGINE,
              </span>
              <span
                className="block font-black uppercase text-transparent italic tracking-[-0.02em]"
                style={{
                  WebkitTextStroke: '2px #bbf200',
                  textShadow: '0 0 20px rgba(187,242,0,0.3)',
                }}
              >
                I DELIVER.
              </span>
            </h2>
          </div>
        </div>

        {/* Two-Column Navigation: PAGES (Left) & CONNECT (Right) */}
        <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 md:px-16 pointer-events-none">
          {/* Left: PAGES */}
          <nav className="pointer-events-auto flex flex-col items-start gap-1 sm:gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#bbf200] tracking-[0.2em] uppercase mb-1">
              PAGES
            </span>
            {pages.map((p) => (
              <a
                key={p.label}
                href={p.href}
                className="font-heading font-extrabold text-lg sm:text-2xl md:text-3xl text-white hover:text-[#bbf200] transition-colors leading-none tracking-tight"
              >
                {p.label}
              </a>
            ))}
          </nav>

          {/* Right: CONNECT */}
          <nav className="pointer-events-auto flex flex-col items-start gap-1 sm:gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#bbf200] tracking-[0.2em] uppercase mb-1">
              CONNECT
            </span>
            {connects.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="font-heading font-extrabold text-lg sm:text-2xl md:text-3xl text-white hover:text-[#bbf200] transition-colors leading-none tracking-tight"
              >
                {c.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Tech Logo Marquee across the bottom behind portrait */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 z-0">
          <FloatingTechRow />
        </div>

        {/* Developer Portrait Cutout (Centered at bottom, enlarged prominent scale) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-[440px] sm:w-[540px] md:w-[620px] lg:w-[680px] xl:w-[740px] max-h-[76vh] sm:max-h-[80vh] md:max-h-[82vh] lg:max-h-[85vh] flex items-end justify-center">
          <Image
            src="/assets/images/talha-badar-cutout.webp"
            alt="Talha Badar"
            width={1535}
            height={1024}
            className="w-full h-auto object-contain object-bottom drop-shadow-[0_15px_50px_rgba(0,0,0,0.9)]"
            priority
          />
        </div>

        {/* Bottom Action Buttons: START A PROJECT (Center) & OPEN PROJECT BRIEF (Right) */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 px-6 sm:px-10 flex items-center justify-between pointer-events-none">
          <div className="w-1/3 hidden sm:block" />

          {/* Center Main CTA: START A PROJECT */}
          <div className="w-full sm:w-1/3 flex justify-center pointer-events-auto">
            <a
              href="mailto:info.talhabadar@gmail.com?subject=Let's%20build%20something"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#bbf200] text-[#020807] font-sans text-xs sm:text-sm font-extrabold tracking-wider uppercase rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:bg-[#d4ff33] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 select-none cursor-pointer"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight size={18} className="stroke-[2.5]" />
            </a>
          </div>

          {/* Right Button: OPEN PROJECT BRIEF */}
          <div className="w-full sm:w-1/3 flex justify-end pointer-events-auto">
            <button
              onClick={openBriefModal}
              className="px-3.5 sm:px-4 py-2 bg-[#020807]/90 border border-[#bbf200]/50 text-[#bbf200] font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-md hover:border-[#bbf200] hover:bg-[#bbf200]/15 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>OPEN PROJECT BRIEF</span>
              <Plus size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </CyberLimeFrame>
    </section>
  );
}
