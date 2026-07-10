import { create } from "zustand";
import type { Component, Editor as GrapesEditor } from "grapesjs";

export interface LayerTreeNode {
  component: Component;
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  open: boolean;
  children: LayerTreeNode[];
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

interface LayersStoreState {
  editor: GrapesEditor | null;
  tree: LayerTreeNode | null;
  selectedId: string | null;
  setEditor: (editor: GrapesEditor) => void;
  refreshLayers: () => void;
  select: (node: LayerTreeNode) => void;
  toggleOpen: (node: LayerTreeNode) => void;
  toggleVisible: (node: LayerTreeNode) => void;
  toggleLocked: (node: LayerTreeNode) => void;
}

export const useLayersStore = create<LayersStoreState>((set, get) => ({
  editor: null,
  tree: null,
  selectedId: null,

  setEditor: (editor) => {
    set({ editor, selectedId: editor.getSelected()?.getId() ?? null });
    get().refreshLayers();

    const refreshLayers = () => get().refreshLayers();
    editor.on("component:add", refreshLayers);
    editor.on("component:remove", refreshLayers);
    editor.on("component:update", refreshLayers);
    editor.on("layer:component", refreshLayers);
    editor.on("layer:root", refreshLayers);
    // The layer tree's root switches with the active page.
    editor.on("page:select", refreshLayers);
    editor.on("component:selected", (component?: Component) => {
      set({ selectedId: component?.getId() ?? null });
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
}));
