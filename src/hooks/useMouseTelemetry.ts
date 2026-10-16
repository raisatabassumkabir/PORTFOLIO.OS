'use client';

import { useEffect, useRef, useState } from 'react';

export function useMouseTelemetry() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const rawCoordsRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let lastUpdate = 0;

    const handleMouseMove = (e: MouseEvent) => {
      rawCoordsRef.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      // Throttle telemetry text readout to ~20-30fps to avoid state churn, while RAF handles cursor lerp smoothly
      if (now - lastUpdate > 40) {
        lastUpdate = now;
        setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { coords, rawCoordsRef };
}
