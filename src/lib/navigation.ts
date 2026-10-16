import { useHudStore, HudThemeMode } from '@/store/useHudStore';

export const SECTION_IDS = [
  'home',
  'profile',
  'stack',
  'work',
  'journey',
  'contact',
] as const;

export const SECTION_THEMES: Record<number, HudThemeMode> = {
  1: 'dark-cyber',
  2: 'light-profile',
  3: 'dark-cyber',
  4: 'project-custom',
  5: 'dark-cyber',
  6: 'neon-lime',
};

/**
 * Unified scroll-to-section handler:
 * 1. Unlocks circuit view if locked
 * 2. Updates activeSection in useHudStore
 * 3. Smoothly scrolls to the section element by ID
 */
export function scrollToSection(index: number) {
  const store = useHudStore.getState();

  // 1. Unlock circuit view if locked
  if (store.isCircuitLocked) {
    store.toggleCircuitLock(false);
  }

  // 2. Update activeSection in useHudStore
  const theme = SECTION_THEMES[index] || 'dark-cyber';
  store.setActiveSection(index, theme);

  // 3. Smooth scroll to target element
  const sectionId = SECTION_IDS[index - 1];
  if (sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      try {
        window.history.pushState(null, '', `#${sectionId}`);
      } catch {}
    } else {
      window.location.href = `/#${sectionId}`;
    }
  }
}
