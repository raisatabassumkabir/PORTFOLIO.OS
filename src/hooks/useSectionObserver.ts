'use client';

import { useEffect, useRef } from 'react';
import { useHudStore, HudThemeMode } from '@/store/useHudStore';

const sectionMap: { id: string; index: number; theme: HudThemeMode }[] = [
  { id: 'home', index: 1, theme: 'dark-cyber' },
  { id: 'profile', index: 2, theme: 'light-profile' },
  { id: 'stack', index: 3, theme: 'dark-cyber' },
  { id: 'work', index: 4, theme: 'project-custom' },
  { id: 'journey', index: 5, theme: 'dark-cyber' },
  { id: 'contact', index: 6, theme: 'neon-lime' },
];

export function useSectionObserver() {
  const setActiveSection = useHudStore((s) => s.setActiveSection);
  const activeSection = useHudStore((s) => s.activeSection);
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // If at or very near bottom, activate contact section
      if (scrollY + windowHeight >= documentHeight - 60) {
        const contactSec = sectionMap[sectionMap.length - 1];
        if (activeSectionRef.current !== contactSec.index) {
          setActiveSection(contactSec.index, contactSec.theme);
        }
        return;
      }

      // Check sections based on scroll offset from top
      const checkY = scrollY + 140;
      let currentSection = sectionMap[0];

      for (const sec of sectionMap) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (checkY >= top) {
            currentSection = sec;
          }
        }
      }

      if (activeSectionRef.current !== currentSection.index) {
        setActiveSection(currentSection.index, currentSection.theme);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run on initial mount
    updateActiveSection();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [setActiveSection]);
}
