'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HeroConfig } from '@/types/portfolio';
import { PortraitXRayCanvas } from './PortraitXRayCanvas';
import { CircuitCalloutNodes } from './CircuitCalloutNodes';
import { useHudStore } from '@/store/useHudStore';

interface HeroSectionProps {
  data: HeroConfig;
}

interface SkillNodeConfig {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  top: string;
  node: [number, number]; // [u, v] where u is x fraction, v is 1 - y fraction
  offset: number;
}

interface RenderedLine {
  id: string;
  pathD: string;
  start: { x: number; y: number };
  pulse: { x: number; y: number };
  activation: number;
}

// Exact skill definitions and node coordinates from talhadevelops.vercel.app (config.js)
const SKILL_NODES: SkillNodeConfig[] = [
  { id: 'ai', code: 'AI', title: 'AI / ML', subtitle: 'INTELLIGENT SYSTEMS', top: '25%', node: [0.585, 0.69], offset: 0 * 0.173 },
  { id: 'api', code: 'API', title: 'BACKEND', subtitle: 'SCALABLE SERVICES', top: '36.5%', node: [0.61, 0.59], offset: 1 * 0.173 },
  { id: 'app', code: 'APP', title: 'MOBILE', subtitle: 'FLUTTER EXPERIENCES', top: '48%', node: [0.625, 0.48], offset: 2 * 0.173 },
  { id: 'cld', code: 'CLD', title: 'CLOUD', subtitle: 'DEPLOYED INFRA', top: '59.5%', node: [0.64, 0.37], offset: 3 * 0.173 },
  { id: 'sec', code: 'SEC', title: 'SECURITY', subtitle: 'PROTECTED DATA', top: '71%', node: [0.62, 0.25], offset: 4 * 0.173 },
];

// Exact polyline traversal function from deployed SkillModules.js
function pointOnPolyline(points: { x: number; y: number }[], progress: number) {
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const length = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lengths.push(length);
    total += length;
  }
  let distance = (progress % 1) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i]) {
      const t = lengths[i] ? distance / lengths[i] : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
      };
    }
    distance -= lengths[i];
  }
  return points[points.length - 1] || { x: 0, y: 0 };
}

export function HeroSection({ data }: HeroSectionProps) {
  const isCircuitLocked = useHudStore((s) => s.isCircuitLocked);
  const toggleCircuitLock = useHudStore((s) => s.toggleCircuitLock);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [linesData, setLinesData] = useState<RenderedLine[]>([]);
  const [proximities, setProximities] = useState<number[]>([0.08, 0.08, 0.08, 0.08, 0.08]);
  const [pointerPos, setPointerPos] = useState({ x: 600, y: 350 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Timing constants from deployed HERO_CONFIG.idle
  const returnDelay = 2.5; // 2.5s inactivity before idle starts
  const idleDuration = 2.5; // 2.5s duration for Lissajous sweep
  const idleCycle = 7.0; // 7.0s full cycle

  // On page load, start idle sweep immediately (inactive = returnDelay)
  const lastMeaningfulRef = useRef<number>(performance.now() - returnDelay * 1000);
  const currentPosRef = useRef({ x: 600, y: 350 });
  const userMousePosRef = useRef({ x: 600, y: 350 });
  const isUserInteractingRef = useRef(false);
  const isIdleRunningRef = useRef(true);
  const timeRef = useRef(0);
  const previousTimeRef = useRef(performance.now());
  const activationsRef = useRef<number[]>([0.08, 0.08, 0.08, 0.08, 0.08]);
  const activeHoveredNodeRef = useRef<string | null>(null);

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

  // Master Unified Animation & Interaction Loop (Matching HeroScene.js and SkillModules.js)
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const now = performance.now();
      const dt = Math.max(0.001, Math.min(0.033, (now - previousTimeRef.current) / 1000));
      previousTimeRef.current = now;
      timeRef.current += dt;

      if (!heroRef.current || !portraitRef.current) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const heroRect = heroRef.current.getBoundingClientRect();
      const portraitRect = portraitRef.current.getBoundingClientRect();

      const inactive = (now - lastMeaningfulRef.current) / 1000;
      const isIdle = !isCircuitLocked && inactive > returnDelay;

      let targetX = userMousePosRef.current.x;
      let targetY = userMousePosRef.current.y;

      if (isIdle) {
        const elapsed = inactive - returnDelay;
        const cycle = elapsed % idleCycle;
        if (cycle < idleDuration) {
          const t = cycle / idleDuration;
          // Exact 4π / π Lissajous parametric curve from HeroScene.js lines 273-276:
          // targetPoint.x = 0.5 - Math.cos(t * Math.PI * 4) * 0.32;
          // targetPoint.y = 0.5 + Math.cos(t * Math.PI) * 0.29; (v=1 is top in WebGL)
          const targetU = 0.5 - Math.cos(t * Math.PI * 4) * 0.32;
          const targetV = 0.5 + Math.cos(t * Math.PI) * 0.29;
          targetX = portraitRect.left - heroRect.left + targetU * portraitRect.width;
          targetY = portraitRect.top - heroRect.top + (1 - targetV) * portraitRect.height;
          isIdleRunningRef.current = true;
        } else {
          isIdleRunningRef.current = false;
          targetX = currentPosRef.current.x;
          targetY = currentPosRef.current.y;
        }
      } else {
        isIdleRunningRef.current = false;
      }

      // Exact lerp damping formula from HeroScene.js line 288:
      // step = 1 - Math.exp(-18 * dt)
      const step = 1 - Math.exp(-18 * dt);
      currentPosRef.current.x += (targetX - currentPosRef.current.x) * step;
      currentPosRef.current.y += (targetY - currentPosRef.current.y) * step;

      const currentX = currentPosRef.current.x;
      const currentY = currentPosRef.current.y;

      // Dispatch teaser move for custom cursor during autonomous sweep
      if (isIdleRunningRef.current) {
        window.dispatchEvent(
          new CustomEvent('hero-teaser-move', {
            detail: { x: currentX + heroRect.left, y: currentY + heroRect.top },
          })
        );
      }

      const coordEl = document.getElementById('coordinates');
      if (coordEl) {
        coordEl.textContent = `X ${String(Math.round(currentX + heroRect.left)).padStart(3, '0')} / Y ${String(Math.round(currentY + heroRect.top)).padStart(3, '0')}`;
      }

      // Calculate 3-segment polylines, proximity, activations, and traveling pulse dots
      const nextLines: RenderedLine[] = [];
      const nextProximities: number[] = [];

      SKILL_NODES.forEach((skill, index) => {
        const start = {
          x: portraitRect.left - heroRect.left + skill.node[0] * portraitRect.width,
          y: portraitRect.top - heroRect.top + (1 - skill.node[1]) * portraitRect.height,
        };

        const cardEl = cardRefs.current[index];
        let endX = heroRect.width - 160;
        let endY = heroRect.height * (0.25 + index * 0.115);

        if (cardEl) {
          const cardRect = cardEl.getBoundingClientRect();
          endX = cardRect.left - heroRect.left;
          endY = cardRect.top - heroRect.top + cardRect.height * 0.5;
        }

        const elbowX = Math.min(endX - 28, start.x + Math.max(42, (endX - start.x) * 0.46));
        const elbowY = start.y;
        const mid2X = Math.max(elbowX, endX - 24);
        const mid2Y = endY;

        const points = [
          start,
          { x: elbowX, y: elbowY },
          { x: mid2X, y: mid2Y },
          { x: endX, y: endY },
        ];

        const pathD = `M ${start.x} ${start.y} L ${elbowX} ${elbowY} L ${mid2X} ${mid2Y} L ${endX} ${endY}`;

        // Proximity calculation matching SkillModules.js line 43-44:
        // const distance = Math.hypot(mouse.x - start.x, mouse.y - start.y);
        // const target = locked ? 1 : clamp(1 - (distance - radius * 0.7) / 230, 0.035, 1);
        const distance = Math.hypot(currentX - start.x, currentY - start.y);
        const targetAct = isCircuitLocked
          ? 1
          : activeHoveredNodeRef.current === skill.id
          ? 1
          : Math.max(0.08, Math.min(1, 1 - (distance - 77) / 230));

        activationsRef.current[index] += (targetAct - activationsRef.current[index]) * 0.1;
        const act = activationsRef.current[index];
        nextProximities.push(act);

        // Moving pulse dot along polyline at time * 0.08 (SkillModules.js line 46)
        const pulse = pointOnPolyline(points, (timeRef.current * 0.08 + skill.offset) % 1);

        nextLines.push({
          id: skill.id,
          pathD,
          start,
          pulse,
          activation: act,
        });
      });

      setLinesData(nextLines);
      setProximities(nextProximities);
      setPointerPos({ x: Math.round(currentX), y: Math.round(currentY) });
      setIsHoveringHero(isUserInteractingRef.current || isIdleRunningRef.current);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isCircuitLocked]);

  // Handle immediate user interaction on the Hero container
  const handleUserInteraction = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    lastMeaningfulRef.current = performance.now();
    isUserInteractingRef.current = true;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX ?? 0;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0;
    userMousePosRef.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Global mousemove/touchmove listener so any user activity immediately takes over
  useEffect(() => {
    const handleGlobal = (e: MouseEvent | TouchEvent) => {
      lastMeaningfulRef.current = performance.now();
      isUserInteractingRef.current = true;
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : (e as TouchEvent).touches[0]?.clientX ?? 0;
      const clientY = 'clientY' in e ? e.clientY : (e as TouchEvent).touches[0]?.clientY ?? 0;
      userMousePosRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    };

    window.addEventListener('mousemove', handleGlobal, { passive: true });
    window.addEventListener('touchmove', handleGlobal, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleGlobal);
      window.removeEventListener('touchmove', handleGlobal);
    };
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleUserInteraction}
      onTouchMove={handleUserInteraction}
      onMouseEnter={() => {
        isUserInteractingRef.current = true;
        setIsHoveringHero(true);
      }}
      onMouseLeave={() => {
        isUserInteractingRef.current = false;
        if (!isIdleRunningRef.current) setIsHoveringHero(false);
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

      {/* SVG Interactive Circuit Lines with Slow Moving Pulse Dots (Matching SkillModules.js) */}
      <svg
        className="hero-skill-connectors pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"
        aria-hidden="true"
      >
        {linesData.map((item) => (
          <g key={item.id}>
            {/* 3-Segment Polyline Path */}
            <path
              className="hero-skill-path"
              d={item.pathD}
              style={{
                opacity: isCircuitLocked ? 1 : Math.max(0.1, item.activation),
              }}
            />

            {/* Source Anchor Node on Bust (r=2.2) */}
            <circle
              className="hero-skill-node"
              cx={item.start.x}
              cy={item.start.y}
              r="2.2"
              style={{
                opacity: isCircuitLocked ? 1 : Math.max(0.12, item.activation),
              }}
            />

            {/* Continuous Slow Traveling Pulse Dot (r=2.4) */}
            <circle
              className="hero-skill-pulse"
              cx={item.pulse.x}
              cy={item.pulse.y}
              r="2.4"
              style={{
                opacity: isCircuitLocked ? 1 : Math.max(0.14, item.activation),
              }}
            />
          </g>
        ))}
      </svg>

      {/* Left Column: Focused Hero Display Typography (Matching Reference Layout) */}
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
        isHoveringHero={isHoveringHero}
        onContainerRef={(el) => {
          portraitRef.current = el;
        }}
      />

      {/* Bottom Center: Control Bar (Matching Reference Layout) */}
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

      {/* Right: 5 Proximity-Illuminated Skill HUD Modules (Exact match to SkillModules.js) */}
      <CircuitCalloutNodes
        nodes={data.circuitNodes}
        isLocked={isCircuitLocked}
        nodeIsLit={proximities.map((p) => p > 0.4)}
        nodeProximities={proximities}
        onHoverNode={(id) => {
          activeHoveredNodeRef.current = id;
        }}
        onCardRef={(index, el) => {
          cardRefs.current[index] = el;
        }}
      />
    </section>
  );
}
