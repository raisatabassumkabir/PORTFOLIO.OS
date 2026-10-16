'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HeroConfig } from '@/types/portfolio';
import { PortraitXRayCanvas } from './PortraitXRayCanvas';
import { CircuitCalloutNodes } from './CircuitCalloutNodes';
import { useHudStore } from '@/store/useHudStore';

interface HeroSectionProps {
  data: HeroConfig;
}

interface ConnectorLine {
  id: string;
  startX: number;
  startY: number;
  midX1: number;
  midX2: number;
  boxLeftX: number;
  endY: number;
}

export function HeroSection({ data }: HeroSectionProps) {
  const [activeHoveredNode, setActiveHoveredNode] = useState<string | null>(null);
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Raw mouse target and lerped smooth positions for proximity calculation
  const targetPosRef = useRef({ x: 700, y: 350 });
  const smoothPosRef = useRef({ x: 700, y: 350 });
  const [smoothPos, setSmoothPos] = useState({ x: 700, y: 350 });

  const isCircuitLocked = useHudStore((s) => s.isCircuitLocked);
  const toggleCircuitLock = useHudStore((s) => s.toggleCircuitLock);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [lines, setLines] = useState<ConnectorLine[]>([]);

  // Keyboard shortcut: ESC exits locked circuit view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCircuitLocked) {
        toggleCircuitLock(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCircuitLocked, toggleCircuitLock]);

  // Track mouse coordinates relative to #home & update coordinates HUD
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (!isHoveringHero) setIsHoveringHero(true);

    const coordEl = document.getElementById('coordinates');
    if (coordEl) {
      coordEl.textContent = `X ${Math.round(e.clientX)} / Y ${Math.round(e.clientY)}`;
    }
  };

  // Smooth mouse lerp loop (requestAnimationFrame with factor 0.12)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      smoothPosRef.current.x += (targetPosRef.current.x - smoothPosRef.current.x) * 0.12;
      smoothPosRef.current.y += (targetPosRef.current.y - smoothPosRef.current.y) * 0.12;
      setSmoothPos({
        x: Math.round(smoothPosRef.current.x * 10) / 10,
        y: Math.round(smoothPosRef.current.y * 10) / 10,
      });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Calculate 3-segment connector polylines from portrait anchors to card left edges
  const updateConnectorLines = useCallback(() => {
    if (!containerRef.current || !portraitRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const portraitRect = portraitRef.current.getBoundingClientRect();

    if (portraitRect.width === 0 || portraitRect.height === 0) return;

    const computedLines: ConnectorLine[] = [];

    data.circuitNodes.forEach((node, index) => {
      const cardEl = cardRefs.current[index];
      if (!cardEl) return;

      const cardRect = cardEl.getBoundingClientRect();

      // Anchor point on portrait edge
      const startX =
        portraitRect.left - containerRect.left + portraitRect.width * (node.anchorX / 100);
      const startY =
        portraitRect.top - containerRect.top + portraitRect.height * (node.anchorY / 100);

      // Card left-edge center point
      const boxLeftX = cardRect.left - containerRect.left;
      const endY = cardRect.top - containerRect.top + cardRect.height / 2;

      // 3-Segment Circuit Line Geometry:
      // points="${startX},${startY} ${midX1},${startY} ${midX2},${endY} ${boxLeftX},${endY}"
      const dx = Math.max(20, boxLeftX - startX);
      const midX1 = startX + dx * 0.35;
      const midX2 = startX + dx * 0.68;

      computedLines.push({
        id: node.id,
        startX,
        startY,
        midX1,
        midX2,
        boxLeftX,
        endY,
      });
    });

    setLines(computedLines);
  }, [data.circuitNodes]);

  useEffect(() => {
    const update = () => {
      requestAnimationFrame(updateConnectorLines);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });

    const t1 = setTimeout(update, 100);
    const t2 = setTimeout(update, 400);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateConnectorLines, isCircuitLocked]);

  // Known vertical centers of the 5 HUD nodes: 28%, 39%, 50%, 61%, 72%
  const nodeYPercentages = [0.28, 0.39, 0.50, 0.61, 0.72];

  // Calculate proximity intensity for each node & line based on smoothPos.y
  const nodeProximities: number[] = data.circuitNodes.map((node, i) => {
    if (isCircuitLocked) return 1;
    if (activeHoveredNode === node.id) return 1;

    const line = lines[i];
    const vh = containerRef.current ? containerRef.current.offsetHeight : 800;
    const nodeYPx = line ? line.endY : vh * (nodeYPercentages[i] ?? (0.28 + i * 0.11));

    const dist = Math.abs(smoothPos.y - nodeYPx);
    const proximity = isCircuitLocked ? 1 : Math.max(0.12, 1 - dist / 180);
    return Math.round(proximity * 100) / 100;
  });

  const nodeIsLit: boolean[] = nodeProximities.map((p) => p > 0.4);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleHeroMouseMove}
      onMouseEnter={() => setIsHoveringHero(true)}
      onMouseLeave={() => {
        setIsHoveringHero(false);
      }}
      className="relative h-screen min-h-[700px] w-full flex items-center justify-between bg-[#040A07] overflow-hidden select-none scroll-mt-16 pointer-events-auto"
    >
      {/* Soft ambient radial emerald glow behind portrait */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.09) 0%, rgba(4, 10, 7, 0) 65%)',
        }}
      />

      {/* SVG Interactive Circuit Lines */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"
        aria-hidden="true"
      >
        {lines.map((line, index) => {
          const proximity = nodeProximities[index] ?? 0.12;
          const isHighLit = proximity > 0.4 || isCircuitLocked;

          return (
            <g key={line.id} style={{ opacity: proximity, transition: 'opacity 0.15s ease' }}>
              {/* 3-Segment Circuit Line:
                  Start -> Horizontal -> Angled bend -> Horizontal into HUD box */}
              <polyline
                points={`${line.startX},${line.startY} ${line.midX1},${line.startY} ${line.midX2},${line.endY} ${line.boxLeftX},${line.endY}`}
                fill="none"
                stroke={isHighLit ? '#34D399' : 'rgba(16, 185, 129, 0.35)'}
                strokeWidth={isHighLit ? 1.5 : 1}
              />

              {/* Glowing 3.5px cyan-emerald circle at (startX, startY) */}
              <circle
                cx={line.startX}
                cy={line.startY}
                r={3.5}
                fill="#34D399"
                className={isHighLit ? 'drop-shadow-[0_0_8px_#34D399]' : ''}
              />

              {/* Second 3px circle at (midX1, startY) */}
              <circle
                cx={line.midX1}
                cy={line.startY}
                r={3}
                fill="#34D399"
                className={isHighLit ? 'drop-shadow-[0_0_6px_#34D399]' : ''}
              />
            </g>
          );
        })}
      </svg>

      {/* Left Column: Bold Display Typography */}
      <div className="absolute left-[5vw] top-[54%] -translate-y-1/2 z-20 flex flex-col items-start pointer-events-auto">
        {/* Giant solid white first name with subtle bottom inner shadow */}
        <h1
          className="font-heading font-black select-none m-0 p-0 text-white"
          style={{
            fontSize: 'clamp(4.5rem, 8.2vw, 8.5rem)',
            lineHeight: 0.84,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          {data.firstName}
        </h1>

        {/* Giant double-wireframe outlined last name tightly stacked underneath */}
        <div className="relative select-none" style={{ marginTop: '-0.05em' }}>
          <span
            className="font-heading font-black block select-none pointer-events-none stroke-text"
            style={{
              fontSize: 'clamp(4.5rem, 8.2vw, 8.5rem)',
              lineHeight: 0.84,
              letterSpacing: '-0.03em',
            }}
          >
            {data.lastName}
          </span>
        </div>

        {/* Horizontal 24px emerald line + Mobile Application Developer */}
        <div className="mt-8 flex items-center gap-3">
          <div
            style={{
              width: '24px',
              height: '1.5px',
              backgroundColor: '#10B981',
              flexShrink: 0,
            }}
          />
          <span
            className="font-sans text-white text-[18px] font-normal"
            style={{ letterSpacing: '0.01em' }}
          >
            {data.role || 'Mobile Application Developer'}
          </span>
        </div>

        {/* Indented Tagline: YOU IMAGINE. I DELIVER */}
        <div
          className="mt-2 font-mono-hud text-[10px] uppercase font-medium flex items-center gap-1.5"
          style={{
            paddingLeft: '36px',
            letterSpacing: '0.24em',
          }}
        >
          <span style={{ color: '#52635B' }}>{data.taglinePrefix || 'YOU IMAGINE.'}</span>{' '}
          <span style={{ color: '#10B981' }}>{data.taglineHighlight || 'I DELIVER'}</span>
        </div>
      </div>

      {/* Center Bust: Cybernetic X-Ray Canvas */}
      <PortraitXRayCanvas
        baseImage={data.basePortrait}
        cyberImage={data.cyberPortrait}
        isCircuitLocked={isCircuitLocked}
        onToggleLock={toggleCircuitLock}
        isHoveringHero={isHoveringHero}
        onContainerRef={(el) => {
          portraitRef.current = el;
        }}
      />

      {/* Bottom Center: Control Bar (Unlocked vs. Locked States) */}
      <div
        className="absolute z-30 flex items-center gap-3.5 select-none pointer-events-auto"
        style={{
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: vertical 16px emerald line */}
        <div
          style={{
            width: '1px',
            height: '16px',
            backgroundColor: '#10B981',
            flexShrink: 0,
          }}
        />

        {/* Center: Monospace instruction label */}
        <span
          className="font-mono-hud whitespace-nowrap"
          style={{
            fontSize: '9.5px',
            letterSpacing: '0.16em',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {isCircuitLocked ? 'CIRCUIT VIEW · ESC TO RETURN' : 'MOVE TO REVEAL · CLICK TO LOCK'}
        </span>

        {/* Right: Rounded pill button */}
        <button
          onClick={() => toggleCircuitLock()}
          className="transition-all duration-300 font-mono-hud whitespace-nowrap cursor-pointer"
          style={
            isCircuitLocked
              ? {
                  borderRadius: '9999px',
                  background: '#5EEAD4',
                  color: '#04120B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  fontSize: '11px',
                  boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)',
                  border: 'none',
                }
              : {
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  backgroundColor: 'rgba(5, 16, 11, 0.8)',
                  padding: '6px 16px',
                  fontSize: '11px',
                  color: '#A7F3D0',
                }
          }
        >
          {isCircuitLocked ? 'Back to scroll ✓' : 'Lock circuit view ↗'}
        </button>
      </div>

      {/* Right Column: 5 Proximity-Illuminated Circuit Callout Nodes */}
      <div className="absolute right-[5vw] top-[50%] -translate-y-1/2 z-20 pointer-events-auto">
        <CircuitCalloutNodes
          nodes={data.circuitNodes}
          isLocked={isCircuitLocked}
          nodeIsLit={nodeIsLit}
          nodeProximities={nodeProximities}
          onHoverNode={setActiveHoveredNode}
          onCardRef={(index, el) => {
            cardRefs.current[index] = el;
          }}
        />
      </div>
    </section>
  );
}
