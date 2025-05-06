import { create } from 'zustand';

type GlobalStoreState = {
  showSubtitle: boolean;
};

type GlobalStoreActions = {
  setShowSubtitle: (show: boolean) => void;
};

export const useGlobalStore = create<GlobalStoreState & GlobalStoreActions>((set) => ({
  showSubtitle: false,
  setShowSubtitle: (show: boolean) => set({ showSubtitle: show }),
})); 