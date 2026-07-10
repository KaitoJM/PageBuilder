import { create } from "zustand";

interface RightSidebarStoreState {
  open: boolean;
  activeId: "styles" | "properties" | null;
  openSidebar: (id: "styles" | "properties") => void;
  closeSidebar: () => void;
  toggleSidebar: (id: "styles" | "properties") => void;
}

export const useRightSidebarStore = create<RightSidebarStoreState>(
  (set, get) => ({
    open: false,
    activeId: null,
    content: null,

    openSidebar: (id) => set({ open: true, activeId: id }),

    closeSidebar: () => set({ open: false }),

    toggleSidebar: (id) => {
      const { open, activeId } = get();
      if (open && activeId === id) {
        set({ open: false });
      } else {
        set({ open: true, activeId: id });
      }
    },
  }),
);
