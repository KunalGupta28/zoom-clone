import { create } from "zustand";

interface AppState {
  activePanel: "none" | "chat" | "participants";
  isJoinModalOpen: boolean;
  isScheduleModalOpen: boolean;
  
  setActivePanel: (panel: "none" | "chat" | "participants") => void;
  setJoinModalOpen: (isOpen: boolean) => void;
  setScheduleModalOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePanel: "none",
  isJoinModalOpen: false,
  isScheduleModalOpen: false,
  
  setActivePanel: (panel) => set({ activePanel: panel }),
  setJoinModalOpen: (isOpen) => set({ isJoinModalOpen: isOpen }),
  setScheduleModalOpen: (isOpen) => set({ isScheduleModalOpen: isOpen }),
}));
