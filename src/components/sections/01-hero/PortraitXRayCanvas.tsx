'use client';

import React, { useRef, useState, useEffect } from 'react';

interface PortraitXRayCanvasProps {
  baseImage: string;
  cyberImage?: string | null;
  isCircuitLocked: boolean;
  onToggleLock: () => void;
  portraitMousePos?: { x: number; y: number } | null;
  isHoveringHero: boolean;
  onContainerRef?: (el: HTMLDivElement | null) => void;
}

export function PortraitXRayCanvas({
  baseImage,
  cyberImage,
  isCircuitLocked,
  onToggleLock,
  isHoveringHero,
  onContainerRef,
}: PortraitXRayCanvasProps) {
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const targetPosRef = useRef({ x: 300, y: 220 });
  const currentPosRef = useRef({ x: 300, y: 220 });
  const [pointerPos, setPointerPos] = useState({ x: 300, y: 220 });
  const [isRevealing, setIsRevealing] = useState(false);
  const hasUserMovedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      hasUserMovedRef.current = true;
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetPosRef.current = { x, y };
      setIsRevealing(true);
    };

    const handleTeaserMove = (e: Event) => {
      if (hasUserMovedRef.current) return;
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      if (!customEvent.detail || !portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = customEvent.detail.x - rect.left;
      const y = customEvent.detail.y - rect.top;
      targetPosRef.current = { x, y };
      setIsRevealing(true);
    };

    const handleTeaserEnd = () => {
      if (!hasUserMovedRef.current) {
        setIsRevealing(false);
      }
    };

    const handleMouseLeave = () => {
      if (hasUserMovedRef.current) {
        setIsRevealing(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('hero-teaser-move', handleTeaserMove as EventListener);
    window.addEventListener('hero-teaser-end', handleTeaserEnd);
    document.addEventListener('mouseleave', handleMouseLeave);

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
      window.removeEventListener('hero-teaser-end', handleTeaserEnd);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Sync revealing state with hero hover
  useEffect(() => {
    if (isHoveringHero) {
      setIsRevealing(true);
    } else if (hasUserMovedRef.current) {
      setIsRevealing(false);
    }
  }, [isHoveringHero]);

  const isCustomCyber = Boolean(cyberImage && cyberImage.trim().length > 0 && cyberImage !== baseImage);
  const finalCyberImage = isCustomCyber ? cyberImage! : baseImage;

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
        WebkitMaskImage: `radial-gradient(ellipse 280px 140px at ${pointerPos.x}px ${pointerPos.y}px, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 55%, transparent 100%)`,
        maskImage: `radial-gradient(ellipse 280px 140px at ${pointerPos.x}px ${pointerPos.y}px, rgba(0,0,0,1) 20%, rgba(0,0,0,0.5) 55%, transparent 100%)`,
        opacity: isRevealing ? 1 : 0,
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
    >
      <div className="relative flex h-full w-auto items-end justify-center">
        {/* Soft, organic ambient green spotlight following cursor with ZERO borders */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[48px] transition-opacity duration-300"
          style={{
            left: pointerPos.x,
            top: pointerPos.y,
            width: '360px',
            height: '200px',
            background:
              'radial-gradient(ellipse at center, rgba(0, 229, 153, 0.28) 0%, rgba(16, 185, 129, 0.12) 48%, transparent 75%)',
            opacity: isRevealing && !isCircuitLocked ? 1 : 0,
          }}
        />

        {/* Ambient Backlight Glow behind Bust */}
        <div
          className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${
            isCircuitLocked
              ? 'opacity-80 bg-[#00E599]/35 scale-105'
              : isHoveringHero || isRevealing
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
