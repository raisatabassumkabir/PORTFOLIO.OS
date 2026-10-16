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
  const [localMouse, setLocalMouse] = useState<{ x: number; y: number } | null>(null);
  const [teaserPos, setTeaserPos] = useState<{ x: number; y: number } | null>(null);
  const [isTeaserActive, setIsTeaserActive] = useState(false);
  const hasUserMoved = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      hasUserMoved.current = true;
      setIsTeaserActive(false);
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      setLocalMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleTeaserMove = (e: Event) => {
      if (hasUserMoved.current) return;
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      if (!customEvent.detail || !portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      setIsTeaserActive(true);
      setTeaserPos({
        x: customEvent.detail.x - rect.left,
        y: customEvent.detail.y - rect.top,
      });
    };

    const handleTeaserEnd = () => {
      setIsTeaserActive(false);
      setTeaserPos(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('hero-teaser-move', handleTeaserMove as EventListener);
    window.addEventListener('hero-teaser-end', handleTeaserEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('hero-teaser-move', handleTeaserMove as EventListener);
      window.removeEventListener('hero-teaser-end', handleTeaserEnd);
    };
  }, []);

  const isCustomCyber = Boolean(cyberImage && cyberImage.trim().length > 0 && cyberImage !== baseImage);
  const finalCyberImage = isCustomCyber ? cyberImage! : baseImage;

  // Active mask coordinate: real cursor if user moved, else teaser position if active
  const activePos = hasUserMoved.current ? localMouse : teaserPos || localMouse;
  const isRevealing = isHoveringHero || isTeaserActive;

  const localX = activePos ? activePos.x : -999;
  const localY = activePos ? activePos.y : -999;

  const maskStyle: React.CSSProperties = isCircuitLocked
    ? {
        WebkitMaskImage: 'none',
        maskImage: 'none',
        opacity: 1,
        filter: isCustomCyber
          ? 'none'
          : 'brightness(1.15) contrast(1.4) hue-rotate(145deg) saturate(2.5)',
      }
    : isRevealing && activePos
    ? {
        WebkitMaskImage: `radial-gradient(circle 145px at ${localX}px ${localY}px, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)`,
        maskImage: `radial-gradient(circle 145px at ${localX}px ${localY}px, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)`,
        opacity: 1,
        filter: isCustomCyber
          ? 'none'
          : 'brightness(1.15) contrast(1.4) hue-rotate(145deg) saturate(2.5)',
      }
    : { opacity: 0 };

  return (
    <div
      ref={(el) => {
        portraitRef.current = el;
        if (onContainerRef) onContainerRef(el);
      }}
      onClick={onToggleLock}
      className="pointer-events-auto cursor-pointer absolute bottom-0 left-1/2 z-10 flex h-[88vh] w-auto -translate-x-1/2 items-end justify-center select-none flex-shrink-0"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)',
      }}
    >
      {/* Inner container applying vertical top-fade mask with zero bottom clipping */}
      <div
        className="relative flex h-full w-auto items-end justify-center"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, #000 8%, #000 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, #000 8%, #000 100%)',
        }}
      >
        {/* Ambient Backlight Glow behind Bust */}
        <div
          className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${
            isCircuitLocked
              ? 'opacity-80 bg-[#00E599]/35 scale-105'
              : isHoveringHero || isTeaserActive
              ? 'opacity-40 bg-[#10B981]/25 scale-100'
              : 'opacity-25 bg-[#082824]/60 scale-95'
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
          style={maskStyle}
          className="absolute inset-0 h-full w-auto max-w-none object-contain object-bottom select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
