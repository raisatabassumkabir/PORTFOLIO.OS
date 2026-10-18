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
  isIdleRunning?: boolean;
  onContainerRef?: (el: HTMLDivElement | null) => void;
}

export function PortraitXRayCanvas({
  baseImage,
  cyberImage,
  isCircuitLocked,
  onToggleLock,
  heroPointerPos,
  isHoveringHero,
  isIdleRunning,
  onContainerRef,
}: PortraitXRayCanvasProps) {
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const [pointerPos, setPointerPos] = useState({ x: 300, y: 220 });

  // Synchronize spotlight position directly with hero animation loop
  useEffect(() => {
    if (!heroPointerPos || !portraitRef.current) return;
    const portraitRect = portraitRef.current.getBoundingClientRect();
    const heroEl = portraitRef.current.closest('#home');
    const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;

    const offsetX = heroRect ? portraitRect.left - heroRect.left : 0;
    const offsetY = heroRect ? portraitRect.top - heroRect.top : 0;

    const localX = heroPointerPos.x - offsetX;
    const localY = heroPointerPos.y - offsetY;

    setPointerPos({ x: Math.round(localX), y: Math.round(localY) });
  }, [heroPointerPos]);

  const isCustomCyber = Boolean(cyberImage && cyberImage.trim().length > 0 && cyberImage !== baseImage);
  const finalCyberImage = isCustomCyber ? cyberImage! : baseImage;

  const pointerX = pointerPos.x;
  const pointerY = pointerPos.y;

  const isVisible = isCircuitLocked || isHoveringHero || Boolean(isIdleRunning);

  // Seamless soft-feathered spotlight mask (zero borders, pure feathered Gaussian-like alpha falloff)
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
        WebkitMaskImage: `radial-gradient(ellipse 280px 220px at ${pointerX}px ${pointerY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)`,
        maskImage: `radial-gradient(ellipse 280px 220px at ${pointerX}px ${pointerY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)`,
        opacity: isVisible ? 1 : 0,
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
        {/* Faint Ambient Green Beam (Background Glow) directly behind the spotlight position */}
        {!isCircuitLocked && (
          <div
            className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
            style={{
              left: `${pointerX}px`,
              top: `${pointerY}px`,
              width: '520px',
              height: '240px',
              background:
                'radial-gradient(ellipse, rgba(22, 247, 192, 0.08) 0%, rgba(22, 247, 192, 0.02) 50%, transparent 80%)',
              filter: 'blur(36px)',
              opacity: isVisible ? 1 : 0,
            }}
          />
        )}

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
