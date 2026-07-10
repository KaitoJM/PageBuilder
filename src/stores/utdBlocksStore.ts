import { create } from "zustand";
import type { BlockProperties, Editor as GrapesEditor } from "grapesjs";
import { fetchBlocks, type RawUTDBlock } from "../pages/Editor/services/UTDApi";

const CACHE_KEY = "utd-blocks-cache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface BlocksCache {
  timestamp: number;
  blocks: BlockProperties[];
}

function readCache(): BlockProperties[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cache: BlocksCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL_MS) return null;

    return cache.blocks;
  } catch {
    return null;
  }
}

function writeCache(blocks: BlockProperties[]) {
  try {
    const cache: BlocksCache = { timestamp: Date.now(), blocks };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable - caching is a best-effort optimization.
  }
}

function toBlockProperties(block: RawUTDBlock): BlockProperties {
  return {
    id: String(block.id),
    label: block.name,
    category: block.category,
    media: block.screenshot
      ? `<img src="${block.screenshot}" style="width:100%;height:100%;object-fit:cover;" />`
      : undefined,
    content: block.code,
  };
}

interface UTDBlocksStoreState {
  editor: GrapesEditor | null;
  blocks: BlockProperties[];
  setEditor: (editor: GrapesEditor) => void;
  loadBlocks: () => Promise<void>;
}

export const useUTDBlocksStore = create<UTDBlocksStoreState>((set, get) => ({
  editor: null,
  blocks: [],

  setEditor: (editor) => {
    set({ editor });
    for (const block of get().blocks) {
      editor.Blocks.add(block.id as string, block);
    }
  },

  loadBlocks: async () => {
    const cached = readCache();
    const blocks =
      cached ?? (await fetchBlocks()).map(toBlockProperties);

    if (!cached) writeCache(blocks);
    set({ blocks });

    const { editor } = get();
    if (editor) {
      for (const block of blocks) {
        editor.Blocks.add(block.id as string, block);
      }
    }
  },
}));
