import { create } from "zustand";
import type { Editor as GrapesEditor } from "grapesjs";
import {
  fetchEditorContent,
  fetchWebsiteSkin,
  fetchSiteCode,
  type EditorContent,
} from "./UTDApi";
import { loadWebsiteSkin, renderWebsiteSkin } from "./websiteSkin";
import { loadSiteCode } from "./siteCode";

export interface LoadPageDataParams {
  siteId: string;
  pageId: string;
}

/**
 * Loads the page's actual content into GrapesJS's own component/CSS model:
 * sets the main component's children from `content.html` and adds
 * `content.css` as real CssRules. This is the only one of the three
 * `loadPageData` steps that goes through GrapesJS's model rather than
 * injecting raw DOM into the canvas iframe - so it's the one that's
 * selectable in the canvas, visible in Layers, and editable via the Style
 * Manager and Code panel.
 *
 * @param editor The live GrapesJS editor instance.
 * @param content The page's HTML/CSS, as fetched from the API.
 */
function applyEditorContent(editor: GrapesEditor, content: EditorContent) {
  const [page] = editor.Pages.getAll();
  // addRules() only adds - without clearing first, switching pages would
  // leave every previously loaded page's CSS mixed into the current one.
  editor.Css.clear();
  page?.getMainComponent().components(content.html);
  editor.Css.addRules(content.css);
}

interface PageDataStoreState {
  isLoading: boolean;
  loadPageData: (
    editor: GrapesEditor,
    params: LoadPageDataParams,
  ) => Promise<void>;
}

// Everything needed to render one page in the editor: page content,
// website skin, and site/page custom code. Fired together (not chained)
// since they're independent of each other, exposed as a single isLoading
// flag so a caller can show one loader for the whole batch instead of
// three staggered ones. Each piece still fails independently so one bad
// request doesn't block the others.
//
// Also the entry point for switching pages in place (no full editor
// remount) - see PageTool.tsx's "Edit Page" - so applyEditorContent clears
// previously loaded CSS before adding the new page's, and
// loadWebsiteSkin/loadSiteCode are themselves safe to call repeatedly
// (they track and reapply their own latest state on every canvas frame
// load instead of leaking a new listener per call).
export const usePageDataStore = create<PageDataStoreState>((set) => ({
  isLoading: false,

  loadPageData: async (editor, { siteId, pageId }) => {
    set({ isLoading: true });

    try {
      const [content, skin, siteEntries, pageEntries] =
        await Promise.allSettled([
          fetchEditorContent({ siteId, pageId }),
          fetchWebsiteSkin({ siteId }),
          fetchSiteCode({ siteId }),
          fetchSiteCode({ siteId, pageId }),
        ]);

      if (content.status === "fulfilled") {
        applyEditorContent(editor, content.value);
      } else {
        console.error("Failed to load editor content", content.reason);
      }

      if (skin.status === "fulfilled") {
        loadWebsiteSkin(editor, renderWebsiteSkin(skin.value));
      } else {
        console.error("Failed to load website skin", skin.reason);
      }

      if (
        siteEntries.status === "fulfilled" &&
        pageEntries.status === "fulfilled"
      ) {
        loadSiteCode(editor, siteEntries.value, pageEntries.value);
      } else {
        if (siteEntries.status === "rejected") {
          console.error("Failed to load site-wide code", siteEntries.reason);
        }
        if (pageEntries.status === "rejected") {
          console.error(
            "Failed to load page-specific code",
            pageEntries.reason,
          );
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
