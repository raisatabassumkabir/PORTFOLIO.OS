'use client';

import { useEffect, useCallback } from 'react';
import { useHudStore } from '@/store/useHudStore';

export function useCircuitReveal() {
  const isCircuitLocked = useHudStore((s) => s.isCircuitLocked);
  const toggleCircuitLock = useHudStore((s) => s.toggleCircuitLock);

  // Listen for ESC key to exit locked circuit mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCircuitLocked) {
        toggleCircuitLock(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCircuitLocked, toggleCircuitLock]);

  const unlock = useCallback(() => {
    toggleCircuitLock(false);
  }, [toggleCircuitLock]);

  const lock = useCallback(() => {
    toggleCircuitLock(true);
  }, [toggleCircuitLock]);

  return {
    isCircuitLocked,
    toggleCircuitLock,
    unlock,
    lock,
  };
}
