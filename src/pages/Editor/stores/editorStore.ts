import { create } from "zustand";
import type { Editor as GrapesEditor, ProjectData } from "grapesjs";
import { useBlocksStore } from "./blocksStore";
import { useDevicesStore } from "./devicesStore";
import { useLayersStore } from "./layersStore";
import { usePagesStore } from "./pagesStore";
import { usePropertiesStore } from "./propertiesStore";
import { useStylesStore } from "./stylesStore";

interface EditorStoreState {
  editor: GrapesEditor | null;
  projectData: ProjectData | null;
  setEditor: (editor: GrapesEditor) => void;
  refreshProjectData: () => void;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  editor: null,
  projectData: null,

  setEditor: (editor) => {
    set({ editor });
    get().refreshProjectData();
    useBlocksStore.getState().setEditor(editor);
    usePagesStore.getState().setEditor(editor);
    useLayersStore.getState().setEditor(editor);
    useDevicesStore.getState().setEditor(editor);
    useStylesStore.getState().setEditor(editor);
    usePropertiesStore.getState().setEditor(editor);

    editor.on("update", () => get().refreshProjectData());
  },

  refreshProjectData: () => {
    const { editor } = get();
    if (!editor) return;
    set({ projectData: editor.getProjectData() });
  },
}));
