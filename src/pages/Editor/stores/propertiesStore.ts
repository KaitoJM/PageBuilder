import { create } from "zustand";
import type { Component, Editor as GrapesEditor } from "grapesjs";

export interface TraitOptionInfo {
  id: string;
  label: string;
}

export interface TraitInfo {
  name: string;
  label: string;
  type: string;
  value: string;
  options: TraitOptionInfo[];
}

export interface AttributeInfo {
  key: string;
  value: string;
}

interface PropertiesStoreState {
  editor: GrapesEditor | null;
  traits: TraitInfo[];
  customAttributes: AttributeInfo[];
  isImageComponent: boolean;
  imageSrc: string;
  setEditor: (editor: GrapesEditor) => void;
  refreshProperties: () => void;
  setTraitValue: (name: string, value: string) => void;
  setImageSrc: (src: string) => void;
  openAssetManager: () => void;
  addCustomAttribute: (key: string, value: string) => void;
  removeCustomAttribute: (key: string) => void;
}

function getSelectedComponent(editor: GrapesEditor): Component | undefined {
  // Read the live selection directly rather than editor.Traits.getComponent(),
  // whose internal sync is debounced and lags one click behind.
  return editor.getSelected();
}

export const usePropertiesStore = create<PropertiesStoreState>(
  (set, get) => ({
    editor: null,
    traits: [],
    customAttributes: [],
    isImageComponent: false,
    imageSrc: "",

    setEditor: (editor) => {
      set({ editor });
      get().refreshProperties();

      const refresh = () => get().refreshProperties();
      editor.on("component:selected", refresh);
      editor.on("component:update", refresh);
      editor.on("trait:value", refresh);
    },

    refreshProperties: () => {
      const { editor } = get();
      if (!editor) return;

      const component = getSelectedComponent(editor);
      const isImageComponent = component?.is("image") ?? false;

      const traits = (component?.getTraits() ?? [])
        .filter((trait) => !(isImageComponent && trait.getName() === "src"))
        .map((trait) => ({
          name: trait.getName(),
          label: trait.getLabel(),
          type: trait.getType(),
          value: String(trait.getValue() ?? ""),
          options: trait.getOptions().map((option) => ({
            id: trait.getOptionId(option),
            label: trait.getOptionLabel(option),
          })),
        }));

      const traitNames = new Set(traits.map((t) => t.name));
      const attrs =
        component?.getAttributes({ noClass: true, noStyle: true }) ?? {};
      const customAttributes = Object.entries(attrs)
        .filter(([key]) => !traitNames.has(key) && key !== "src")
        .map(([key, value]) => ({ key, value: String(value) }));

      set({
        traits,
        customAttributes,
        isImageComponent,
        imageSrc: isImageComponent ? String(attrs.src ?? "") : "",
      });
    },

    setTraitValue: (name, value) => {
      const { editor } = get();
      if (!editor) return;
      const component = getSelectedComponent(editor);
      component
        ?.getTraits()
        .find((t) => t.getName() === name)
        ?.setValue(value);
      get().refreshProperties();
    },

    setImageSrc: (src) => {
      const { editor } = get();
      if (!editor) return;
      getSelectedComponent(editor)?.addAttributes({ src });
      get().refreshProperties();
    },

    openAssetManager: () => {
      const { editor } = get();
      if (!editor) return;
      const component = getSelectedComponent(editor);
      if (!component) return;

      editor.AssetManager.open({
        select: (asset, complete) => {
          component.addAttributes({ src: asset.getSrc() });
          get().refreshProperties();
          if (complete) editor.AssetManager.close();
        },
      });
    },

    addCustomAttribute: (key, value) => {
      const { editor } = get();
      if (!editor || !key.trim()) return;
      getSelectedComponent(editor)?.addAttributes({ [key.trim()]: value });
      get().refreshProperties();
    },

    removeCustomAttribute: (key) => {
      const { editor } = get();
      if (!editor) return;
      getSelectedComponent(editor)?.removeAttributes([key]);
      get().refreshProperties();
    },
  }),
);
