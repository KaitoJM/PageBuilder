import { create } from "zustand";
import type { Component, Editor as GrapesEditor, Page } from "grapesjs";

export interface LayerTreeNode {
  component: Component;
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  open: boolean;
  children: LayerTreeNode[];
}

export interface PageInfo {
  page: Page;
  id: string;
  name: string;
}

function buildLayerTree(
  editor: GrapesEditor,
  component: Component,
): LayerTreeNode {
  const { Layers } = editor;
  return {
    component,
    id: component.getId(),
    name: Layers.getName(component) || component.get("tagName") || "Box",
    visible: Layers.isVisible(component),
    locked: Layers.isLocked(component),
    open: Layers.isOpen(component),
    children: Layers.getComponents(component).map((child: Component) =>
      buildLayerTree(editor, child),
    ),
  };
}

function buildPageInfo(page: Page): PageInfo {
  return { page, id: page.getId(), name: page.getName() };
}

interface EditorStoreState {
  editor: GrapesEditor | null;
  tree: LayerTreeNode | null;
  selectedId: string | null;
  pages: PageInfo[];
  selectedPageId: string | null;
  setEditor: (editor: GrapesEditor) => void;
  refreshLayers: () => void;
  select: (node: LayerTreeNode) => void;
  toggleOpen: (node: LayerTreeNode) => void;
  toggleVisible: (node: LayerTreeNode) => void;
  toggleLocked: (node: LayerTreeNode) => void;
  refreshPages: () => void;
  selectPage: (page: PageInfo) => void;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  editor: null,
  tree: null,
  selectedId: null,
  pages: [],
  selectedPageId: null,

  setEditor: (editor) => {
    set({ editor, selectedId: editor.getSelected()?.getId() ?? null });
    get().refreshLayers();
    get().refreshPages();
    set({ selectedPageId: editor.Pages.getSelected()?.getId() ?? null });

    const refreshLayers = () => get().refreshLayers();
    editor.on("component:add", refreshLayers);
    editor.on("component:remove", refreshLayers);
    editor.on("component:update", refreshLayers);
    editor.on("layer:component", refreshLayers);
    editor.on("layer:root", refreshLayers);
    editor.on("component:selected", (component?: Component) => {
      set({ selectedId: component?.getId() ?? null });
    });

    const refreshPages = () => get().refreshPages();
    editor.on("page:add", refreshPages);
    editor.on("page:remove", refreshPages);
    editor.on("page:update", refreshPages);
    editor.on("page:select", (page?: Page) => {
      set({ selectedPageId: page?.getId() ?? null });
      refreshLayers();
    });
  },

  refreshLayers: () => {
    const { editor } = get();
    if (!editor) return;
    set({ tree: buildLayerTree(editor, editor.Layers.getRoot()) });
  },

  select: (node) => {
    get().editor?.select(node.component);
  },

  toggleOpen: (node) => {
    get().editor?.Layers.setOpen(node.component, !node.open);
  },

  toggleVisible: (node) => {
    get().editor?.Layers.setVisible(node.component, !node.visible);
  },

  toggleLocked: (node) => {
    get().editor?.Layers.setLocked(node.component, !node.locked);
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
