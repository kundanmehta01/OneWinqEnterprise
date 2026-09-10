import { create } from 'zustand';

export const SCREEN_NAMES = [
  { id: 1, name: 'Overview', key: 'overview', icon: 'Sparkles' },
  { id: 2, name: 'About', key: 'about', icon: 'Info' },
  { id: 3, name: 'Products & Services', key: 'products', icon: 'Layers' },
  { id: 4, name: 'Team Directory', key: 'team', icon: 'Users' },
  { id: 5, name: 'Projects', key: 'projects', icon: 'Briefcase' },
  { id: 6, name: 'Achievements', key: 'achievements', icon: 'Trophy' },
  { id: 7, name: 'Media & Press', key: 'media', icon: 'Image' },
  { id: 8, name: 'Contact Us', key: 'contact', icon: 'PhoneCall' },
];

export const usePreviewStore = create((set) => ({
  activeScreen: 1,
  viewMode: 'desktop', // 'desktop' | 'mobile'
  simulatedZoom: 100,

  // Internal sub-filters
  aboutTab: 'vision',
  teamFilter: 'all',
  projectFilter: 'all',
  mediaFilter: 'all',

  // Modals
  activeMediaModal: null,

  setActiveScreen: (screenId) => set({ activeScreen: screenId }),
  nextScreen: () =>
    set((state) => ({
      activeScreen: state.activeScreen < 8 ? state.activeScreen + 1 : 1,
    })),
  prevScreen: () =>
    set((state) => ({
      activeScreen: state.activeScreen > 1 ? state.activeScreen - 1 : 8,
    })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSimulatedZoom: (zoom) => set({ simulatedZoom: zoom }),

  setAboutTab: (tab) => set({ aboutTab: tab }),
  setTeamFilter: (filter) => set({ teamFilter: filter }),
  setProjectFilter: (filter) => set({ projectFilter: filter }),
  setMediaFilter: (filter) => set({ mediaFilter: filter }),

  openMediaModal: (mediaItem) => set({ activeMediaModal: mediaItem }),
  closeMediaModal: () => set({ activeMediaModal: null }),
}));
