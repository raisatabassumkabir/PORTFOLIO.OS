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

  // Autonomous Animation State Machine
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isAutoPlayingRef = useRef(true);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  // Lerped smooth positions for proximity calculation and circuit node illumination
  const smoothPosRef = useRef({ x: 700, y: 350 });
  const [smoothPos, setSmoothPos] = useState({ x: 700, y: 350 });

  const isCircuitLocked = useHudStore((s) => s.isCircuitLocked);
  const toggleCircuitLock = useHudStore((s) => s.toggleCircuitLock);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const containerRef = heroRef; // Alias for backward compatibility
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

  // 3. Auto-Play Landing Animation Sequence (4.5s sequence on mount through Waypoints A, B, and C)
  useEffect(() => {
    if (isCircuitLocked) return;

    let animId: number;
    let startTime: number | null = null;
    const totalDuration = 4500; // 4.5s sequence

    const runAutoPlay = (timestamp: number) => {
      if (!isAutoPlayingRef.current || !heroRef.current) return;

      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const rect = heroRef.current.getBoundingClientRect();
      const waypointA = { x: rect.width * 0.52, y: rect.height * 0.38 };
      const waypointB = { x: rect.width * 0.54, y: rect.height * 0.64 };
      const waypointC = { x: rect.width * 0.68, y: rect.height * 0.46 };

      let currentX = waypointA.x;
      let currentY = waypointA.y;

      if (elapsed <= 1400) {
        // 0.0s – 1.4s: Glide smoothly to Waypoint A (mouth/face). Cybernetic jaw & glasses optics reveal!
        const startPos = { x: rect.width * 0.48, y: rect.height * 0.26 };
        const p = Math.min(1, elapsed / 1400);
        const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
        currentX = startPos.x + (waypointA.x - startPos.x) * ease;
        currentY = startPos.y + (waypointA.y - startPos.y) * ease;
      } else if (elapsed <= 2800) {
        // 1.4s – 2.8s: Glide smoothly down to Waypoint B (wrist/watch). Cybernetic watch & arm circuit illuminate!
        const p = Math.min(1, (elapsed - 1400) / 1400);
        const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
        currentX = waypointA.x + (waypointB.x - waypointA.x) * ease;
        currentY = waypointA.y + (waypointB.y - waypointA.y) * ease;
      } else if (elapsed <= 4000) {
        // 2.8s – 4.0s: Glide out to Waypoint C (right HUD nodes).
        const p = Math.min(1, (elapsed - 2800) / 1200);
        const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
        currentX = waypointB.x + (waypointC.x - waypointB.x) * ease;
        currentY = waypointB.y + (waypointC.y - waypointB.y) * ease;
      } else {
        // 4.0s+: Smoothly settle to rest
        currentX = waypointC.x;
        currentY = waypointC.y;
      }

      setPointerPos({ x: Math.round(currentX), y: Math.round(currentY) });

      // Dispatch position for CustomCursor and coordinates HUD
      window.dispatchEvent(
        new CustomEvent('hero-teaser-move', {
          detail: { x: currentX + rect.left, y: currentY + rect.top },
        })
      );

      const coordEl = document.getElementById('coordinates');
      if (coordEl) {
        coordEl.textContent = `X ${Math.round(currentX + rect.left)} / Y ${Math.round(currentY + rect.top)}`;
      }

      if (elapsed < totalDuration && isAutoPlayingRef.current) {
        animId = requestAnimationFrame(runAutoPlay);
      } else {
        isAutoPlayingRef.current = false;
        setIsAutoPlaying(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isAutoPlayingRef.current) {
        animId = requestAnimationFrame(runAutoPlay);
      }
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animId);
    };
  }, [isCircuitLocked]);

  // Immediate User Takeover (Mouse / Touch Interrupt)
  const handleUserInteraction = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    if (isAutoPlayingRef.current) {
      isAutoPlayingRef.current = false;
      setIsAutoPlaying(false); // Instantly kill the auto-play loop
    }
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX ?? 0;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0;
    setPointerPos({ x: clientX - rect.left, y: clientY - rect.top });
    setIsHoveringHero(true);

    const coordEl = document.getElementById('coordinates');
    if (coordEl) {
      coordEl.textContent = `X ${Math.round(clientX)} / Y ${Math.round(clientY)}`;
    }
  };

  // Global listeners so any mouse/touch movement immediately cancels auto-play
  useEffect(() => {
    const handleGlobalInteraction = (e: MouseEvent | TouchEvent) => {
      if (isAutoPlayingRef.current) {
        isAutoPlayingRef.current = false;
        setIsAutoPlaying(false);
      }
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : (e as TouchEvent).touches[0]?.clientX ?? 0;
      const clientY = 'clientY' in e ? e.clientY : (e as TouchEvent).touches[0]?.clientY ?? 0;
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        setPointerPos({ x: clientX - rect.left, y: clientY - rect.top });
        setIsHoveringHero(true);
      } else {
        setIsHoveringHero(false);
      }
    };

    window.addEventListener('mousemove', handleGlobalInteraction, { passive: true });
    window.addEventListener('touchmove', handleGlobalInteraction, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleGlobalInteraction);
      window.removeEventListener('touchmove', handleGlobalInteraction);
    };
  }, []);

  // Smooth lerp loop for proximity intensity on connector lines & HUD cards
  useEffect(() => {
    let animId: number;
    const loop = () => {
      smoothPosRef.current.x += (pointerPos.x - smoothPosRef.current.x) * 0.18;
      smoothPosRef.current.y += (pointerPos.y - smoothPosRef.current.y) * 0.18;
      setSmoothPos({
        x: Math.round(smoothPosRef.current.x * 10) / 10,
        y: Math.round(smoothPosRef.current.y * 10) / 10,
      });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [pointerPos]);

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
    if (!isHoveringHero && !isAutoPlaying) return 0;
    if (activeHoveredNode === node.id) return 1;

    const line = lines[i];
    const vh = heroRef.current ? heroRef.current.offsetHeight : 800;
    const nodeYPx = line ? line.endY : vh * (nodeYPercentages[i] ?? (0.28 + i * 0.11));

    const dist = Math.abs(smoothPos.y - nodeYPx);
    const proximity = Math.max(0, 1 - dist / 110);
    return Math.round(proximity * 100) / 100;
  });

  const nodeIsLit: boolean[] = nodeProximities.map((p) => p > 0.4);

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleUserInteraction}
      onTouchMove={handleUserInteraction}
      onMouseEnter={() => setIsHoveringHero(true)}
      onMouseLeave={() => {
        if (!isAutoPlayingRef.current) setIsHoveringHero(false);
      }}
      className="chapter hero relative h-screen min-h-[700px] w-full flex items-center justify-between overflow-hidden select-none scroll-mt-16 pointer-events-auto"
      style={{
        background:
          'radial-gradient(ellipse 70% 65% at 50% 48%, #082824 0%, #041714 38%, #020907 70%, #010403 100%), #010403',
      }}
    >
      {/* Soft ambient radial emerald glow behind portrait */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(10, 48, 42, 0.45) 0%, rgba(2, 9, 7, 0) 75%)',
        }}
      />

      {/* SVG Interactive Circuit Lines with Moving Pulse Dots */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"
        aria-hidden="true"
      >
        {lines.map((line, index) => {
          const proximity = nodeProximities[index] ?? 0;
          const isHighLit = proximity > 0.4 || isCircuitLocked;
          const pathD = `M ${line.startX} ${line.startY} L ${line.midX1} ${line.startY} L ${line.midX2} ${line.endY} L ${line.boxLeftX} ${line.endY}`;

          return (
            <g
              key={line.id}
              style={{
                opacity: isCircuitLocked ? 1 : isHighLit ? Math.max(0.75, proximity) : 0.35,
                transition: 'opacity 0.25s ease',
              }}
            >
              {/* 3-Segment Circuit Line */}
              <polyline
                points={`${line.startX},${line.startY} ${line.midX1},${line.startY} ${line.midX2},${line.endY} ${line.boxLeftX},${line.endY}`}
                fill="none"
                stroke={isHighLit ? '#00E599' : 'rgba(98, 245, 183, 0.28)'}
                strokeWidth={isHighLit ? 1.5 : 1}
              />

              {/* Start anchor circle on portrait */}
              <circle
                cx={line.startX}
                cy={line.startY}
                r={isHighLit ? 3.5 : 2}
                fill={isHighLit ? '#FFFFFF' : 'rgba(98, 245, 183, 0.45)'}
                style={{
                  transition: 'r 0.25s ease, fill 0.25s ease',
                }}
                className={isHighLit ? 'drop-shadow-[0_0_8px_#00E599]' : ''}
              />

              {/* Elbow 1 circle */}
              <circle
                cx={line.midX1}
                cy={line.startY}
                r={isHighLit ? 2.5 : 1.8}
                fill={isHighLit ? '#FFFFFF' : 'rgba(98, 245, 183, 0.35)'}
                style={{
                  transition: 'r 0.25s ease, fill 0.25s ease',
                }}
                className={isHighLit ? 'drop-shadow-[0_0_6px_#00E599]' : ''}
              />

              {/* Elbow 2 circle */}
              <circle
                cx={line.midX2}
                cy={line.endY}
                r={isHighLit ? 2.5 : 1.8}
                fill={isHighLit ? '#FFFFFF' : 'rgba(98, 245, 183, 0.35)'}
                style={{
                  transition: 'r 0.25s ease, fill 0.25s ease',
                }}
                className={isHighLit ? 'drop-shadow-[0_0_6px_#00E599]' : ''}
              />

              {/* Card connection node circle */}
              <circle
                cx={line.boxLeftX}
                cy={line.endY}
                r={isHighLit ? 3 : 2}
                fill={isHighLit ? '#00E599' : 'rgba(98, 245, 183, 0.4)'}
                style={{
                  transition: 'r 0.25s ease, fill 0.25s ease',
                }}
                className={isHighLit ? 'drop-shadow-[0_0_6px_#00E599]' : ''}
              />

              {/* Continuous Moving Data Dot 1 */}
              <circle
                r={isHighLit ? 3.5 : 2}
                fill={isHighLit ? '#FFFFFF' : 'rgba(98, 245, 183, 0.7)'}
                className={isHighLit ? 'drop-shadow-[0_0_8px_#00E599]' : ''}
              >
                <animateMotion
                  path={pathD}
                  dur={`${7.0 + index * 0.6}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Continuous Moving Data Dot 2 (Staggered offset) */}
              <circle
                r={isHighLit ? 2.5 : 1.6}
                fill={isHighLit ? '#5EEAD4' : 'rgba(98, 245, 183, 0.45)'}
                className={isHighLit ? 'drop-shadow-[0_0_6px_#00E599]' : ''}
              >
                <animateMotion
                  path={pathD}
                  dur={`${7.0 + index * 0.6}s`}
                  begin={`${3.5 + index * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Left Column: Focused Hero Display Typography (Matching Picture 2) */}
      <div className="absolute left-[clamp(2rem,5vw,5.5rem)] top-[50%] -translate-y-1/2 z-20 flex flex-col items-start pointer-events-auto select-none">
        {/* Giant solid white first name with subtle bottom inner shadow */}
        <h1
          className="font-heading font-black select-none m-0 p-0 text-white tracking-[-0.04em] leading-[0.84]"
          style={{
            fontSize: 'clamp(4.5rem, 8.8vw, 9.2rem)',
            textShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          {data.firstName.split('').map((char, i) => (
            <span
              key={`char-fn-${i}`}
              className="char inline-block transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1 hover:text-[#62f5b7]"
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Giant double-wireframe outlined last name tightly stacked underneath */}
        <div className="relative select-none" style={{ marginTop: '-0.04em' }}>
          <span
            className="font-heading font-black block select-none pointer-events-none stroke-text tracking-[-0.04em] leading-[0.84]"
            style={{
              fontSize: 'clamp(4.5rem, 8.8vw, 9.2rem)',
            }}
          >
            {data.lastName.split('').map((char, i) => (
              <span
                key={`char-ln-${i}`}
                className="char inline-block transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1 hover:text-[#62f5b7]"
              >
                {char}
              </span>
            ))}
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
            className="font-sans text-white text-[18px] sm:text-[19px] font-normal"
            style={{ letterSpacing: '0.01em' }}
          >
            {data.role || 'Mobile Application Developer'}
          </span>
        </div>

        {/* Indented Tagline: YOU IMAGINE, I DELIVER */}
        <div
          className="mt-2 font-mono-hud text-[10px] sm:text-[10.5px] uppercase font-medium flex items-center gap-1.5"
          style={{
            paddingLeft: '36px',
            letterSpacing: '0.24em',
          }}
        >
          <span style={{ color: '#52635B' }}>{data.taglinePrefix || 'YOU IMAGINE,'}</span>{' '}
          <span style={{ color: '#10B981' }}>{data.taglineHighlight || 'I DELIVER'}</span>
        </div>
      </div>

      {/* Center Bust: Cybernetic X-Ray Canvas */}
      <PortraitXRayCanvas
        baseImage={data.basePortrait}
        cyberImage={data.cyberPortrait}
        isCircuitLocked={isCircuitLocked}
        onToggleLock={toggleCircuitLock}
        heroPointerPos={pointerPos}
        isHoveringHero={isHoveringHero || isAutoPlaying}
        onContainerRef={(el) => {
          portraitRef.current = el;
        }}
      />

      {/* Bottom Center: Control Bar (Matching Picture 2) */}
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
          type="button"
          onClick={() => toggleCircuitLock()}
          className="transition-all duration-300 font-mono-hud whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          style={
            isCircuitLocked
              ? {
                  borderRadius: '9999px',
                  background: '#62f5b7',
                  color: '#02120b',
                  fontWeight: 600,
                  padding: '6px 16px',
                  fontSize: '11px',
                  boxShadow: '0 0 20px rgba(98, 245, 183, 0.45)',
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
          {isCircuitLocked && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#02120b] animate-pulse" />
          )}
          <span>{isCircuitLocked ? 'Back to scroll ✕' : 'Lock circuit view ↗'}</span>
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
