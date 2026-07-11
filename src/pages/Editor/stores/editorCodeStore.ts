import { create } from "zustand";
import type { Editor as GrapesEditor } from "grapesjs";

interface EditorCodeStoreState {
  editor: GrapesEditor | null;
  html: string;
  css: string;
  setEditor: (editor: GrapesEditor) => void;
  refreshCode: () => void;
}

export const useEditorCodeStore = create<EditorCodeStoreState>((set, get) => ({
  editor: null,
  html: "",
  css: "",

  setEditor: (editor) => {
    set({ editor });
    get().refreshCode();

    const refresh = () => get().refreshCode();
    editor.on("component:selected", refresh);
    editor.on("component:deselected", refresh);
    editor.on("component:update", refresh);
    editor.on("component:styleUpdate", refresh);
    editor.on("style:property:update", refresh);
    editor.on("style:sector:update", refresh);
    editor.on("selector", refresh);
  },

  refreshCode: () => {
    const { editor } = get();
    if (!editor) return;

    const component = editor.getSelected();
    if (!component) {
      set({ html: "", css: "" });
      return;
    }

    set({
      html: editor.getHtml({ component }) ?? "",
      css: editor.getCss({ component, onlyMatched: true }) ?? "",
    });
  },
}));
