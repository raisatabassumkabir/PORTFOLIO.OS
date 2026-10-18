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

  // Determine if a custom pre-rendered cyber image was provided, or if we use the procedural cyber engine
  const isCustomCyber = Boolean(cyberImage && cyberImage.trim().length > 0 && cyberImage !== baseImage);

  const pointerX = pointerPos.x;
  const pointerY = pointerPos.y;

  const isVisible = isCircuitLocked || isHoveringHero || Boolean(isIdleRunning);

  // Soft-feathered Gaussian-like alpha falloff spotlight mask
  const cyberMaskStyle: React.CSSProperties = isCircuitLocked
    ? {
        WebkitMaskImage: 'none',
        maskImage: 'none',
        opacity: 1,
        transition: 'opacity 0.4s ease',
      }
    : {
        WebkitMaskImage: `radial-gradient(ellipse 280px 220px at ${pointerX}px ${pointerY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)`,
        maskImage: `radial-gradient(ellipse 280px 220px at ${pointerX}px ${pointerY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease',
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
      {/* Hardware-accelerated SVG Convolution Matrix for Edge Detection on ANY image */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <filter id="hudCyborgEdgeFilter">
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1" preserveAlpha="true" />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0.04
              0 1 0 0 0.95
              0 0 1 0 0.72
              0 0 0 2.2 -0.1"
          />
        </filter>
      </svg>

      <div className="relative flex h-full w-auto items-end justify-center">
        {/* Ambient Emerald Beam behind spotlight position */}
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

        {/* 1. Base Human Portrait (100% height, aligned to bottom center) */}
        <img
          src={baseImage}
          alt="Base Human Portrait"
          className="h-full w-auto max-w-none object-contain object-bottom select-none transition-opacity duration-500"
          style={{ opacity: isCircuitLocked ? 0 : 1 }}
          draggable={false}
        />

        {/* 2. Cybernetic / Robot Layer (Masked by spotlight or 100% if locked) */}
        {isCustomCyber ? (
          // Dedicated Pre-rendered Cyber Portrait
          <img
            src={cyberImage!}
            alt="Robotic Cyber Portrait"
            style={cyberMaskStyle}
            className="absolute inset-0 h-full w-auto max-w-none object-contain object-bottom select-none"
            draggable={false}
          />
        ) : (
          // Automatic Procedural Cyborg Engine for ANY uploaded photo!
          <div
            style={cyberMaskStyle}
            className="absolute inset-0 h-full w-auto max-w-none overflow-hidden select-none pointer-events-none"
          >
            {/* Layer A: Specular Metallic Titanium Android Skin */}
            <img
              src={baseImage}
              alt="Metallic Robot Base"
              className="h-full w-auto max-w-none object-contain object-bottom select-none"
              style={{
                filter: 'grayscale(100%) contrast(185%) brightness(115%) drop-shadow(0 0 20px rgba(0,229,153,0.35))',
              }}
              draggable={false}
            />

            {/* Layer B: Hardware Edge-Detected Glowing Wireframe Circuit Contours */}
            <img
              src={baseImage}
              alt="Glowing Wireframe Contours"
              className="absolute inset-0 h-full w-auto max-w-none object-contain object-bottom select-none"
              style={{
                filter: 'url(#hudCyborgEdgeFilter)',
                mixBlendMode: 'screen',
                opacity: 0.95,
              }}
              draggable={false}
            />

            {/* Layer C: Electric Cyan/Emerald Cyber Duotone Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 229, 153, 0.35) 0%, rgba(56, 189, 248, 0.45) 50%, rgba(16, 185, 129, 0.3) 100%)',
                mixBlendMode: 'color',
              }}
            />

            {/* Layer D: Sub-surface PCB Motherboard Bus & Circuit Matrix */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 35%, rgba(0, 229, 153, 0.22) 0%, transparent 65%),
                  linear-gradient(rgba(0, 229, 153, 0.16) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 229, 153, 0.16) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 22px 22px, 22px 22px',
                mixBlendMode: 'screen',
                opacity: 0.8,
              }}
            />

            {/* Layer E: Holographic Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 229, 153, 0.12) 3px 4px)',
                mixBlendMode: 'overlay',
                opacity: 0.65,
              }}
            />

            {/* Layer F: Interactive Dynamic Targeting Reticle & HUD Telemetry */}
            {!isCircuitLocked && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pointerX}px`,
                  top: `${pointerY}px`,
                  width: '90px',
                  height: '90px',
                }}
              >
                {/* Rotating Dashed Reticle Ring */}
                <div
                  className="w-full h-full rounded-full border border-dashed border-[#00E599]/70"
                  style={{
                    animation: 'spin 6s linear infinite',
                    boxShadow: '0 0 16px rgba(0, 229, 153, 0.35)',
                  }}
                />
                {/* Center Core Sensor Dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599]" />

                {/* Floating Telemetry Stamp */}
                <div
                  className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono-hud text-[8px] whitespace-nowrap px-1.5 py-0.5 rounded border border-[#00E599]/40 bg-[#020C08]/90 text-[#00E599] tracking-widest shadow-[0_0_8px_rgba(0,229,153,0.2)]"
                >
                  OPTICS // LOCKED [0.98]
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </figure>
  );
}
