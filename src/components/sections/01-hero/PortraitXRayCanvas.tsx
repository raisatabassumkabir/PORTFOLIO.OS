'use client';

import React, { useRef, useState, useEffect } from 'react';

interface PortraitXRayCanvasProps {
  baseImage: string;
  cyberImage?: string | null;
  isCircuitLocked: boolean;
  onToggleLock: () => void;
  portraitMousePos?: { x: number; y: number } | null;
  heroPointerPos?: { x: number; y: number };
  isHoveringHero: boolean;
  onContainerRef?: (el: HTMLDivElement | null) => void;
}

export function PortraitXRayCanvas({
  baseImage,
  cyberImage,
  isCircuitLocked,
  onToggleLock,
  heroPointerPos,
  isHoveringHero,
  onContainerRef,
}: PortraitXRayCanvasProps) {
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const targetPosRef = useRef({ x: 300, y: 220 });
  const currentPosRef = useRef({ x: 300, y: 220 });
  const [pointerPos, setPointerPos] = useState({ x: 300, y: 220 });
  const hasUserMovedRef = useRef(false);

  // Sync target coordinates from heroPointerPos
  useEffect(() => {
    if (!heroPointerPos || !portraitRef.current) return;
    const portraitRect = portraitRef.current.getBoundingClientRect();
    const heroEl = portraitRef.current.closest('#home');
    const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;

    const offsetX = heroRect ? portraitRect.left - heroRect.left : 0;
    const offsetY = heroRect ? portraitRect.top - heroRect.top : 0;

    targetPosRef.current = {
      x: heroPointerPos.x - offsetX,
      y: heroPointerPos.y - offsetY,
    };
  }, [heroPointerPos]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      hasUserMovedRef.current = true;
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetPosRef.current = { x, y };
    };

    const handleTeaserMove = (e: Event) => {
      if (hasUserMovedRef.current) return;
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      if (!customEvent.detail || !portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = customEvent.detail.x - rect.left;
      const y = customEvent.detail.y - rect.top;
      targetPosRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('hero-teaser-move', handleTeaserMove as EventListener);

    let animId: number;
    const loop = () => {
      const dx = targetPosRef.current.x - currentPosRef.current.x;
      const dy = targetPosRef.current.y - currentPosRef.current.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        currentPosRef.current.x += dx * 0.22;
        currentPosRef.current.y += dy * 0.22;
        setPointerPos({
          x: Math.round(currentPosRef.current.x),
          y: Math.round(currentPosRef.current.y),
        });
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('hero-teaser-move', handleTeaserMove as EventListener);
    };
  }, []);

  const isCustomCyber = Boolean(cyberImage && cyberImage.trim().length > 0 && cyberImage !== baseImage);
  const finalCyberImage = isCustomCyber ? cyberImage! : baseImage;

  const pointerX = pointerPos.x;
  const pointerY = pointerPos.y;

  // Seamless soft-feathered spotlight mask (zero borders, pure feathered alpha-mask)
  const cyberMaskStyle: React.CSSProperties = isCircuitLocked
    ? {
        WebkitMaskImage: 'none',
        maskImage: 'none',
        opacity: 1,
        filter: isCustomCyber
          ? 'none'
          : 'brightness(1.15) contrast(1.4) hue-rotate(145deg) saturate(2.5)',
      }
    : {
        WebkitMaskImage: `radial-gradient(ellipse 280px 140px at ${pointerX}px ${pointerY}px, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 55%, transparent 100%)`,
        maskImage: `radial-gradient(ellipse 280px 140px at ${pointerX}px ${pointerY}px, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 55%, transparent 100%)`,
        opacity: isHoveringHero ? 1 : 0,
        transition: 'opacity 0.4s ease',
        filter: isCustomCyber
          ? 'none'
          : 'brightness(1.15) contrast(1.4) hue-rotate(145deg) saturate(2.5)',
      };

  return (
    <figure
      id="hero-reveal"
      ref={(el) => {
        portraitRef.current = el as HTMLDivElement | null;
        if (onContainerRef) onContainerRef(el as HTMLDivElement | null);
      }}
      onClick={onToggleLock}
      className="hero-portrait hero-portrait--reveal scene-copy hero-reveal-ready hero-reveal-active pointer-events-auto cursor-pointer absolute bottom-0 left-1/2 z-10 flex h-[88vh] w-auto -translate-x-1/2 items-end justify-center select-none flex-shrink-0"
      style={{
        WebkitMaskImage:
          'radial-gradient(ellipse 88% 85% at 50% 55%, #000 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.3) 88%, transparent 100%)',
        maskImage:
          'radial-gradient(ellipse 88% 85% at 50% 55%, #000 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.3) 88%, transparent 100%)',
      }}
    >
      <div className="relative flex h-full w-auto items-end justify-center">
        {/* Faint Ambient Green Beam (Background Glow) directly behind the portrait layer */}
        {!isCircuitLocked && (
          <div
            className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${pointerX}px`,
              top: `${pointerY}px`,
              width: '520px',
              height: '180px',
              background:
                'radial-gradient(ellipse, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 50%, transparent 80%)',
              filter: 'blur(32px)',
            }}
          />
        )}

        {/* Ambient Backlight Glow behind Bust */}
        <div
          className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${
            isCircuitLocked
              ? 'opacity-80 bg-[#00E599]/35 scale-105'
              : isHoveringHero
              ? 'opacity-35 bg-[#10B981]/22 scale-100'
              : 'opacity-20 bg-[#10B981]/12 scale-95'
          }`}
        />

        {/* Both base and cyber images fill 100% height and align to bottom center */}
        <img
          src={baseImage}
          alt="Base Portrait"
          className="h-full w-auto max-w-none object-contain object-bottom select-none transition-opacity duration-500"
          style={{ opacity: isCircuitLocked ? 0 : 1 }}
          draggable={false}
        />
        <img
          src={finalCyberImage}
          alt="Robotic Cyber Portrait"
          style={cyberMaskStyle}
          className="absolute inset-0 h-full w-auto max-w-none object-contain object-bottom select-none"
          draggable={false}
        />
      </div>
    </figure>
  );
}
