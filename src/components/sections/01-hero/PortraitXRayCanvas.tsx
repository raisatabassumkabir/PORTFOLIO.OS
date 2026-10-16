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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      setLocalMouse({ x: localX, y: localY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const finalCyberImage = cyberImage && cyberImage.trim().length > 0 ? cyberImage : baseImage;

  const localX = localMouse ? localMouse.x : -999;
  const localY = localMouse ? localMouse.y : -999;

  const maskStyle: React.CSSProperties = isCircuitLocked
    ? { WebkitMaskImage: 'none', maskImage: 'none', opacity: 1 }
    : isHoveringHero
    ? {
        WebkitMaskImage: `radial-gradient(circle 145px at ${localX}px ${localY}px, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)`,
        maskImage: `radial-gradient(circle 145px at ${localX}px ${localY}px, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)`,
        opacity: 1,
      }
    : { opacity: 0 };

  return (
    <div
      ref={(el) => {
        portraitRef.current = el;
        if (onContainerRef) onContainerRef(el);
      }}
      onClick={onToggleLock}
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        height: '88vh',
        width: 'auto',
        aspectRatio: '1 / 1.15',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
      className="select-none cursor-pointer flex-shrink-0"
    >
      {/* Ambient Backlight Glow behind Bust */}
      <div
        className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${
          isCircuitLocked
            ? 'opacity-70 bg-[#00E599]/30 scale-105'
            : isHoveringHero
            ? 'opacity-40 bg-[#10B981]/25 scale-100'
            : 'opacity-20 bg-[#10B981]/15 scale-95'
        }`}
      />

      {/* Perimeter Feathering to melt outer photo edges seamlessly into #040A07 without cutting head, hair or shoulders */}
      <div
        className="relative w-full h-full pointer-events-none"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 7%, #000 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 7%, #000 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        {/* Bottom Layer: Human Portrait */}
        <img
          src={baseImage}
          alt="Martin King - Human Portrait"
          className="w-full h-full object-contain object-bottom select-none pointer-events-none transition-opacity duration-500"
          style={{ opacity: isCircuitLocked ? 0 : 1 }}
          draggable={false}
        />

        {/* Top Layer: Robotic Portrait */}
        <img
          src={finalCyberImage}
          alt="Martin King - Robotic Portrait"
          className="absolute inset-0 w-full h-full object-contain object-bottom select-none pointer-events-none"
          style={maskStyle}
          draggable={false}
        />
      </div>
    </div>
  );
}
