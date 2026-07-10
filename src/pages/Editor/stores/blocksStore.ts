import { create } from "zustand";
import type { Block, Editor as GrapesEditor } from "grapesjs";

export interface BlockInfo {
  block: Block;
  id: string;
  label: string;
  media: string;
  category: string;
}

function buildBlockInfo(block: Block): BlockInfo {
  return {
    block,
    id: block.getId(),
    label: block.getLabel(),
    media: block.getMedia() ?? "",
    category: block.category?.getLabel() ?? "",
  };
}

interface BlocksStoreState {
  editor: GrapesEditor | null;
  blocks: BlockInfo[];
  setEditor: (editor: GrapesEditor) => void;
  refreshBlocks: () => void;
  startBlockDrag: (block: BlockInfo, ev: DragEvent) => void;
  appendBlock: (block: BlockInfo) => void;
}

export const useBlocksStore = create<BlocksStoreState>((set, get) => ({
  editor: null,
  blocks: [],

  setEditor: (editor) => {
    set({ editor });
    get().refreshBlocks();

    const refreshBlocks = () => get().refreshBlocks();
    editor.on("block:add", refreshBlocks);
    editor.on("block:remove", refreshBlocks);
    editor.on("block:update", refreshBlocks);
  },

  refreshBlocks: () => {
    const { editor } = get();
    if (!editor) return;
    set({ blocks: editor.Blocks.getAll().models.map(buildBlockInfo) });
  },

  startBlockDrag: (blockInfo, ev) => {
    get().editor?.Blocks.startDrag(blockInfo.block, ev);
  },

  appendBlock: (blockInfo) => {
    const { editor } = get();
    if (!editor) return;
    const target = editor.getSelected() ?? editor.getWrapper();
    if (!target) return;

    const rawContent = blockInfo.block.getContent();
    const content =
      typeof rawContent === "function" ? rawContent() : rawContent;
    if (content == null) return;

    const [added] = target.append(content);
    if (added) editor.select(added);
  },
}));
