import { create } from 'zustand';

export type CursorVariant = 'default' | 'reticle' | 'magnetic' | 'hidden';
export type HudThemeMode = 'dark-cyber' | 'light-profile' | 'project-custom' | 'neon-lime';

interface HudState {
  activeSection: number; // 1 to 6
  hudTheme: HudThemeMode;
  isCircuitLocked: boolean;
  activeStackIndex: number; // 0 to 8 for Section 03
  activeProjectIndex: number; // 0 to N for Section 04
  activeJourneyIndex: number; // 0 to N for Section 05
  cursorVariant: CursorVariant;
  isBriefModalOpen: boolean;
  activeCaseStudyId: string | null;
  isBooting: boolean;
  hasBooted: boolean;

  setActiveSection: (index: number, theme?: HudThemeMode) => void;
  toggleCircuitLock: (locked?: boolean) => void;
  setCursorVariant: (variant: CursorVariant) => void;
  setActiveStackIndex: (index: number) => void;
  setActiveProjectIndex: (index: number) => void;
  setActiveJourneyIndex: (index: number) => void;
  openBriefModal: () => void;
  closeBriefModal: () => void;
  openCaseStudy: (id: string) => void;
  closeCaseStudy: () => void;
  completeBoot: () => void;
}

export const useHudStore = create<HudState>((set) => ({
  activeSection: 1,
  hudTheme: 'dark-cyber',
  isCircuitLocked: false,
  activeStackIndex: 0,
  activeProjectIndex: 0,
  activeJourneyIndex: 0,
  cursorVariant: 'default',
  isBriefModalOpen: false,
  activeCaseStudyId: null,
  isBooting: true,
  hasBooted: false,

  setActiveSection: (index, theme) => {
    let computedTheme: HudThemeMode = theme || 'dark-cyber';
    if (!theme) {
      if (index === 2) computedTheme = 'light-profile';
      else if (index === 4) computedTheme = 'project-custom';
      else if (index === 6) computedTheme = 'neon-lime';
      else computedTheme = 'dark-cyber';
    }
    set({ activeSection: index, hudTheme: computedTheme });
  },

  toggleCircuitLock: (locked) =>
    set((state) => ({
      isCircuitLocked: locked !== undefined ? locked : !state.isCircuitLocked,
    })),

  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  setActiveStackIndex: (index) => set({ activeStackIndex: index }),

  setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),

  setActiveJourneyIndex: (index) => set({ activeJourneyIndex: index }),

  openBriefModal: () => set({ isBriefModalOpen: true }),

  closeBriefModal: () => set({ isBriefModalOpen: false }),

  openCaseStudy: (id) => set({ activeCaseStudyId: id }),

  closeCaseStudy: () => set({ activeCaseStudyId: null }),

  completeBoot: () => set({ isBooting: false, hasBooted: true }),
}));
