import { create } from "zustand";
import { fetchSite } from "../pages/Editor/services/UTDApi";

export interface SitePageInfo {
  id: number;
  name: string;
  pageId: string;
}

const CACHE_KEY_PREFIX = "utd-pages-cache-";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface PagesCache {
  timestamp: number;
  pages: SitePageInfo[];
}

function readCache(siteId: string): SitePageInfo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + siteId);
    if (!raw) return null;

    const cache: PagesCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL_MS) return null;

    return cache.pages;
  } catch {
    return null;
  }
}

function writeCache(siteId: string, pages: SitePageInfo[]) {
  try {
    const cache: PagesCache = { timestamp: Date.now(), pages };
    localStorage.setItem(CACHE_KEY_PREFIX + siteId, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable - caching is a best-effort optimization.
  }
}

export interface LoadPagesParams {
  siteId: string;
  pageId: string;
}

interface UTDPagesStoreState {
  pages: SitePageInfo[];
  setPages: (pages: SitePageInfo[]) => void;
  loadPages: (params: LoadPagesParams) => Promise<void>;
}

export const useUTDPagesStore = create<UTDPagesStoreState>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),

  loadPages: async ({ siteId, pageId }) => {
    const cached = readCache(siteId);
    const pages = cached ?? (await fetchSite({ siteId, pageId })).pages;

    if (!cached) writeCache(siteId, pages);
    set({ pages });
  },
}));
