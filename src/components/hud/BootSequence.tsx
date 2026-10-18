'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useHudStore } from '@/store/useHudStore';

export function BootSequence() {
  const pathname = usePathname();
  const completeBoot = useHudStore((s) => s.completeBoot);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const onlineRef = useRef<HTMLParagraphElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isDone, setIsDone] = useState(false);

  const handleFinish = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    document.body.classList.remove('booting');
    completeBoot();
    setIsDone(true);
  }, [completeBoot]);

  useEffect(() => {
    // Skip boot sequence on admin routes
    if (pathname?.startsWith('/admin')) {
      completeBoot();
      setIsDone(true);
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let returning = false;
    try {
      returning = sessionStorage.getItem('talha-os-booted-v2') === '1';
    } catch (e) {
      // ignore
    }

    // If reduced motion is requested, complete immediately
    if (reduced) {
      completeBoot();
      setIsDone(true);
      return;
    }

    // Set session storage flag for returning users
    try {
      sessionStorage.setItem('talha-os-booted-v2', '1');
    } catch (e) {
      // ignore
    }

    document.body.classList.add('booting');

    // Escape key skips boot
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          document.body.classList.remove('booting');
          completeBoot();
          setIsDone(true);
        },
      });

      timelineRef.current = tl;

      // 1. Scanner scales in and fades in (matching scratch/deployed/main.js)
      tl.fromTo(
        scannerRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.65 }
      )
        // 2. System copy lines slide up with staggered entrance (-=400ms overlap)
        .fromTo(
          '.boot__copy > *',
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.09, duration: 0.5 },
          '-=0.4'
        )
        // 3. Cybernetic emerald progress bar fills to 100% (-=350ms overlap)
        .fromTo(
          barRef.current,
          { width: '0%' },
          { width: '100%', duration: 0.85, ease: 'power1.inOut' },
          '-=0.35'
        )
        // 4. "SYSTEM ONLINE" status text reveals with expanding letter spacing
        .fromTo(
          onlineRef.current,
          { opacity: 0, letterSpacing: '0.45em' },
          { opacity: 1, letterSpacing: '0.2em', duration: 0.3, ease: 'power2.out' }
        )
        // 5. Scanner radar rings expand outwards and dissolve
        .to(
          scannerRef.current,
          { scale: 1.8, opacity: 0, duration: 0.55, delay: 0.14, ease: 'power2.inOut' }
        )
        // 6. Fullscreen HUD overlay dissolves to reveal the hero section
        .to(overlayRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [pathname, completeBoot, handleFinish]);

  if (isDone) return null;

  return (
    <div
      id="boot"
      ref={overlayRef}
      className={`boot ${isDone ? 'done' : ''}`}
      role="status"
      aria-live="polite"
      onClick={handleFinish}
      style={{ cursor: 'pointer' }}
    >
      {/* Rotating Cybernetic HUD Scanner Radar with Monogram TB */}
      <div ref={scannerRef} className="boot__scanner" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <span>TB</span>
      </div>

      {/* Cybernetic OS Initialization Diagnostics */}
      <div ref={copyRef} className="boot__copy" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow">PORTFOLIO.OS / BOOT SEQUENCE</p>
        <h2>INITIALIZING SYSTEM</h2>
        <ul>
          <li>LOADING EXPERIENCE</li>
          <li>SYNCING PROJECTS</li>
          <li>ACTIVATING PORTFOLIO</li>
        </ul>
        <div className="boot__bar">
          <span ref={barRef} />
        </div>
        <p ref={onlineRef} className="boot__online">
          SYSTEM ONLINE
        </p>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleFinish();
        }}
        className="absolute bottom-6 right-8 font-mono text-[10px] tracking-[0.2em] text-[#6e847d] hover:text-[#62f5b7] uppercase transition-colors pointer-events-auto"
        aria-label="Skip boot sequence"
      >
        [ CLICK ANYWHERE OR PRESS ESC TO SKIP ↗ ]
      </button>
    </div>
  );
}
