import { create } from "zustand";
import type { Editor as GrapesEditor, Page } from "grapesjs";

export interface PageInfo {
  page: Page;
  id: string;
  name: string;
}

function buildPageInfo(page: Page): PageInfo {
  return { page, id: page.getId(), name: page.getName() };
}

interface PagesStoreState {
  editor: GrapesEditor | null;
  pages: PageInfo[];
  selectedPageId: string | null;
  setEditor: (editor: GrapesEditor) => void;
  refreshPages: () => void;
  selectPage: (page: PageInfo) => void;
}

export const usePagesStore = create<PagesStoreState>((set, get) => ({
  editor: null,
  pages: [],
  selectedPageId: null,

  setEditor: (editor) => {
    set({
      editor,
      selectedPageId: editor.Pages.getSelected()?.getId() ?? null,
    });
    get().refreshPages();

    const refreshPages = () => get().refreshPages();
    editor.on("page:add", refreshPages);
    editor.on("page:remove", refreshPages);
    editor.on("page:update", refreshPages);
    editor.on("page:select", (page?: Page) => {
      set({ selectedPageId: page?.getId() ?? null });
    });
  },

  refreshPages: () => {
    const { editor } = get();
    if (!editor) return;
    set({ pages: editor.Pages.getAll().map(buildPageInfo) });
  },

  selectPage: (page) => {
    get().editor?.Pages.select(page.page);
  },
}));
