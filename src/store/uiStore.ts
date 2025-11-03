import { create } from 'zustand';

interface UIState {
  showSearch: boolean;
  showFilters: boolean;
  toggleSearch: () => void;
  toggleFilters: () => void;
  hideAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showSearch: true,
  showFilters: true,
  toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  hideAll: () => set({ showSearch: false, showFilters: false }),
}));
