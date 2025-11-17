import { create } from "zustand";

type UiState = {
  activeTab: string;
  isCollapsed: boolean;
  isMobileSettingsOpen: boolean;
};

type UiActions = {
  setActiveTab: (tab: string) => void;
  toggleCollapsed: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleMobileSettings: () => void;
  setIsMobileSettingsOpen: (open: boolean) => void;
};

const initialState: UiState = {
  activeTab: "original",
  isCollapsed: false,
  isMobileSettingsOpen: false,
};

export const useUiStore = create<UiState & UiActions>((set) => ({
  ...initialState,
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setIsCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleMobileSettings: () =>
    set((state) => ({ isMobileSettingsOpen: !state.isMobileSettingsOpen })),
  setIsMobileSettingsOpen: (open) => set({ isMobileSettingsOpen: open }),
}));
