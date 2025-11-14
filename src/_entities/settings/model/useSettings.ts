import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TSettings, TRefreshInterval } from "./types";

type State = {
  settings: TSettings;
};

type Actions = {
  updateRefreshEnabled: (enabled: boolean) => void;
  updateRefreshInterval: (interval: TRefreshInterval) => void;
  resetSettings: () => void;
};

const defaultSettings: TSettings = {
  refresh: {
    enabled: false,
    interval: 10, // default 10 seconds
  },
};

const useSettingsStore = create<State & Actions>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateRefreshEnabled: (enabled: boolean) =>
        set((state) => ({
          settings: {
            ...state.settings,
            refresh: {
              ...state.settings.refresh,
              enabled,
            },
          },
        })),
      
      updateRefreshInterval: (interval: TRefreshInterval) =>
        set((state) => ({
          settings: {
            ...state.settings,
            refresh: {
              ...state.settings.refresh,
              interval,
            },
          },
        })),
      
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    { name: "app-settings" }
  )
);

export const useSettings = () => useSettingsStore((state) => state);
