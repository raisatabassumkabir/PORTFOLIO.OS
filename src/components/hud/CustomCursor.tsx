'use client';

import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isTarget, setIsTarget] = useState(false);

  const dotRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');
    document.body.classList.add('custom-cursor-active');

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePos.current = { x, y };

      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isTargetArea = !!target.closest('#hero-reveal, .hero-portrait, [data-cursor="target"], [data-cursor="reticle"]');
      setIsTarget(isTargetArea);

      const isHoverArea = !isTargetArea && !!target.closest(
        'a, button, [role="button"], .magnetic, .skill-access li, [data-cursor-hover], [data-skill-cell], .skill-cell, .project-card, [data-hover], .cursor-pointer, input, textarea, select, [tabindex="0"], label'
      );
      setIsHover(isHoverArea);
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);

    let animationFrameId: number;
    const lerpFactor = 0.18; // Exact 0.18 lerp factor from js/main.js

    const render = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div
      className={`cursor ${isHover ? 'hover' : ''} ${isTarget ? 'target' : ''}`}
      aria-hidden="true"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <i ref={dotRef} />
      <span ref={ringRef} />
    </div>
  );
}

