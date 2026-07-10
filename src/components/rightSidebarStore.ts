import type { ReactNode } from "react";
import { create } from "zustand";

interface RightSidebarStoreState {
  open: boolean;
  activeId: string | null;
  content: ReactNode | null;
  openSidebar: (id: string, content: ReactNode) => void;
  closeSidebar: () => void;
  toggleSidebar: (id: string, content: ReactNode) => void;
}

export const useRightSidebarStore = create<RightSidebarStoreState>(
  (set, get) => ({
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
  }),
);
