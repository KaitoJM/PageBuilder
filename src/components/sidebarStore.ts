import type { ReactNode } from "react";
import { create } from "zustand";

interface SidebarStoreState {
  open: boolean;
  activeId: string | null;
  content: ReactNode | null;
  openSidebar: (id: string, content: ReactNode) => void;
  closeSidebar: () => void;
  toggleSidebar: (id: string, content: ReactNode) => void;
}

export const useSidebarStore = create<SidebarStoreState>((set, get) => ({
  open: false,
  activeId: null,
  content: null,

  openSidebar: (id, content) => set({ open: true, activeId: id, content }),

  closeSidebar: () => set({ open: false }),

  toggleSidebar: (id, content) => {
    const { open, activeId } = get();
    if (open && activeId === id) {
      set({ open: false });
    } else {
      set({ open: true, activeId: id, content });
    }
  },
}));
