import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StudioEditor from "@grapesjs/studio-sdk/react";
import type { CreateEditorOptions } from "@grapesjs/studio-sdk";
import type { Editor as GrapesEditor } from "grapesjs";
import { useEditorStore } from "./stores/editorStore";
import { globalPageSettings } from "./siteSettings";
import { useUTDBlocksStore } from "../../stores/utdBlocksStore";

import ToolBar from "./components/ToolBar";
import AppDialog from "../../components/AppDialog";
import { useRightSidebarStore } from "../../components/rightSidebarStore";
import { fetchEditorContent, fetchSite, fetchWebsiteSkin } from "./services/UTDApi";
import { loadWebsiteSkin, renderWebsiteSkin } from "./services/websiteSkin";
import { useUTDPagesStore } from "../../stores/utdPagesStore";
import HeaderBar from "./components/HeaderBar";
import ToolBarRight from "./components/ToolBarRight";

export default function Editor() {
  const setEditor = useEditorStore((state) => state.setEditor);
  const rightSidebarOpen = useRightSidebarStore((state) => state.open);
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("siteId");
  const pageId = searchParams.get("pageId");

  const setPages = useUTDPagesStore((state) => state.setPages);

  const [options] = useState<CreateEditorOptions>(() => ({
    licenseKey:
      "faba5fc827e343a49a495652d54aba48f632710392f048288c104ddfd6ec3c43",
    project: {
      type: "web",
      // TODO: replace with a unique id for your projects. e.g. an uuid
      id: "UNIQUE_PROJECT_ID",
      default: {
        // A single page: the actual site page being edited is chosen via the
        // pageId query param, and UTDPagesSelector switches between real
        // site pages by updating that param and reloading (see below), so
        // the editor itself never needs to manage more than one page.
        pages: [{ name: "Page", component: "<div></div>" }],
        custom: { globalPageSettings },
      },
    },
    layout: {
      default: {
        type: "row",
        height: "100%",
        children: [
          // No sidebarLeft: Pages and Layers are rendered by our own
          // PagesPanel/LayersPanel components outside the editor.
          // Plain canvas (not canvasSidebarTop) to drop the built-in top
          // toolbar row; ToolBar/ToolBarRight cover those actions instead.
          { type: "canvas" },
        ],
      },
    },
    // identity: {
    //   // TODO: replace with a unique id for your end users. e.g. an uuid
    //   id: "UNIQUE_END_USER_ID",
    // },
    // assets: {
    //   storageType: "cloud",
    // },
    // storage: {
    //   type: "cloud",
    //   autosaveChanges: 100,
    //   autosaveIntervalMs: 10000,
    // },
  }));

  useEffect(() => {
    if (!siteId || !pageId) {
      console.log("Missing siteId/pageId query params.");
      return;
    }

    fetchSite({ siteId, pageId })
      .then((site) => {
        setPages(site.pages);
      })
      .catch((err) => {
        console.error("Failed to load site pages", err);
        console.error("Failed to load site pages.");
      });
  }, [setPages, siteId, pageId]);

  useEffect(() => {
    useUTDBlocksStore
      .getState()
      .loadBlocks()
      .catch((err) => {
        console.error("Failed to load blocks", err);
      });
  }, []);

  const handleEditorReady = useCallback(
    async (editor: GrapesEditor) => {
      setEditor(editor);
      useUTDBlocksStore.getState().setEditor(editor);

      if (!siteId || !pageId) {
        console.error(
          "Missing siteId/pageId query params - skipping content load.",
        );
        return;
      }

      try {
        const content = await fetchEditorContent({ siteId, pageId });

        const [page] = editor.Pages.getAll();
        page?.getMainComponent().components(content.html);
        editor.Css.addRules(content.css);
      } catch (err) {
        console.error("Failed to load editor content", err);
      }

      try {
        const skin = await fetchWebsiteSkin({ siteId });
        loadWebsiteSkin(editor, renderWebsiteSkin(skin));
      } catch (err) {
        console.error("Failed to load website skin", err);
      }
    },
    [setEditor, siteId, pageId],
  );

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* <ProjectDataPanel /> */}
      <ToolBar />
      <ToolBarRight />
      <AppDialog />
      <div className="flex min-h-0 flex-1">
        <div
          className={`flex h-full flex-1 flex-col transition-all duration-300 ease-in-out ${
            rightSidebarOpen ? "mr-96" : "mr-0"
          }`}
        >
          <HeaderBar />
          <div className="min-h-0 flex-1">
            <StudioEditor onReady={handleEditorReady} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
