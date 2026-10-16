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

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  radius: number;
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
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasUserMoved = useRef(false);

  const addTrailPoint = (x: number, y: number) => {
    const last = lastPosRef.current;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.min(8, Math.max(1, Math.floor(dist / 24)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        trailRef.current.push({
          x: Math.round(last.x + dx * t),
          y: Math.round(last.y + dy * t),
          age: 1.0,
          radius: 140,
        });
      }
    } else {
      trailRef.current.push({
        x: Math.round(x),
        y: Math.round(y),
        age: 1.0,
        radius: 140,
      });
    }
    lastPosRef.current = { x, y };

    if (trailRef.current.length > 18) {
      trailRef.current = trailRef.current.slice(-18);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      hasUserMoved.current = true;
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Track reveal exclusively when cursor is over or directly brushing the portrait
      if (x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40) {
        addTrailPoint(x, y);
      } else {
        lastPosRef.current = null;
      }
    };

    const handleTeaserMove = (e: Event) => {
      if (hasUserMoved.current) return;
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      if (!customEvent.detail || !portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = customEvent.detail.x - rect.left;
      const y = customEvent.detail.y - rect.top;
      addTrailPoint(x, y);
    };

    const handleTeaserEnd = () => {
      lastPosRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('hero-teaser-move', handleTeaserMove as EventListener);
    window.addEventListener('hero-teaser-end', handleTeaserEnd);

    let animId: number;
    let running = true;
    const loop = () => {
      if (!running) return;
      if (trailRef.current.length > 0) {
        trailRef.current.forEach((p) => {
          p.age *= 0.91; // Smooth decay over ~450ms
        });
        trailRef.current = trailRef.current.filter((p) => p.age > 0.04);
        setTrail([...trailRef.current]);
      } else if (trail.length > 0) {
        setTrail([]);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('hero-teaser-move', handleTeaserMove as EventListener);
      window.removeEventListener('hero-teaser-end', handleTeaserEnd);
    };
  }, [trail.length]);

  const isCustomCyber = Boolean(cyberImage && cyberImage.trim().length > 0 && cyberImage !== baseImage);
  const finalCyberImage = isCustomCyber ? cyberImage! : baseImage;

  const maskStyle: React.CSSProperties = isCircuitLocked
    ? {
        WebkitMaskImage: 'none',
        maskImage: 'none',
        opacity: 1,
        filter: isCustomCyber
          ? 'none'
          : 'brightness(1.15) contrast(1.4) hue-rotate(145deg) saturate(2.5)',
      }
    : trail.length > 0
    ? {
        WebkitMaskImage: trail
          .map(
            (p) =>
              `radial-gradient(circle ${Math.round(p.radius * (0.85 + 0.15 * p.age))}px at ${p.x}px ${p.y}px, rgba(0,0,0,${p.age.toFixed(2)}) 35%, rgba(0,0,0,${(p.age * 0.45).toFixed(2)}) 65%, transparent 100%)`
          )
          .join(', '),
        maskImage: trail
          .map(
            (p) =>
              `radial-gradient(circle ${Math.round(p.radius * (0.85 + 0.15 * p.age))}px at ${p.x}px ${p.y}px, rgba(0,0,0,${p.age.toFixed(2)}) 35%, rgba(0,0,0,${(p.age * 0.45).toFixed(2)}) 65%, transparent 100%)`
          )
          .join(', '),
        opacity: 1,
        filter: isCustomCyber
          ? 'none'
          : 'brightness(1.15) contrast(1.4) hue-rotate(145deg) saturate(2.5)',
      }
    : { opacity: 0 };

  return (
    <figure
      id="hero-reveal"
      data-cursor="target"
      ref={(el) => {
        portraitRef.current = el as HTMLDivElement | null;
        if (onContainerRef) onContainerRef(el as HTMLDivElement | null);
      }}
      onClick={onToggleLock}
      className="hero-portrait hero-portrait--reveal scene-copy hero-reveal-ready hero-reveal-active pointer-events-auto cursor-pointer absolute bottom-0 left-1/2 z-10 flex h-[88vh] w-auto -translate-x-1/2 items-end justify-center select-none flex-shrink-0"
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
              : trail.length > 0 || isHoveringHero
              ? 'opacity-40 bg-[#10B981]/25 scale-100'
              : 'opacity-25 bg-[#10B981]/15 scale-95'
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
    </figure>
  );
}
