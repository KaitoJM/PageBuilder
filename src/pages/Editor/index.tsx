import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StudioEditor from "@grapesjs/studio-sdk/react";
import type { CreateEditorOptions } from "@grapesjs/studio-sdk";
import type { Editor as GrapesEditor } from "grapesjs";
import DeviceSelector from "./components/DeviceSelector";
import { useEditorStore } from "./stores/editorStore";
import { globalPageSettings } from "./siteSettings";
import { bootstrapBlocks } from "./blocks/bootstrapBlocks";

import "@grapesjs/studio-sdk/style";
import ToolBar from "./components/ToolBar";
import SideBar from "../../components/SideBar";
import RightSideBar from "../../components/RightSideBar";
import { useRightSidebarStore } from "../../components/rightSidebarStore";
import { fetchEditorContent } from "./services/UTDApi";

export default function Editor() {
  const setEditor = useEditorStore((state) => state.setEditor);
  const rightSidebarOpen = useRightSidebarStore((state) => state.open);
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("siteId");
  const pageId = searchParams.get("pageId");

  const [options] = useState<CreateEditorOptions>(() => ({
    licenseKey:
      "faba5fc827e343a49a495652d54aba48f632710392f048288c104ddfd6ec3c43",
    project: {
      type: "web",
      // TODO: replace with a unique id for your projects. e.g. an uuid
      id: "UNIQUE_PROJECT_ID",
      default: {
        pages: [
          { name: "Home", component: "<h1>Home page</h1>" },
          { name: "About", component: "<h1>About page</h1>" },
          { name: "Contact", component: "<h1>Contact page</h1>" },
        ],
        custom: { globalPageSettings },
      },
    },
    blocks: {
      default: bootstrapBlocks,
    },
    layout: {
      default: {
        type: "row",
        height: "100%",
        children: [
          // No sidebarLeft: Pages and Layers are rendered by our own
          // PagesPanel/LayersPanel components outside the editor.
          { type: "canvasSidebarTop" },
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

  const handleEditorReady = useCallback(
    async (editor: GrapesEditor) => {
      setEditor(editor);

      if (!siteId || !pageId) {
        console.error(
          "Missing siteId/pageId query params - skipping content load.",
        );
        return;
      }

      try {
        const content = await fetchEditorContent({ siteId, pageId });

        const homePage = editor.Pages.getAll().find(
          (page) => page.getName() === "Home",
        );
        homePage?.getMainComponent().components(content.html);
        editor.Css.addRules(content.css);
      } catch (err) {
        console.error("Failed to load editor content", err);
      }
    },
    [setEditor, siteId, pageId],
  );

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* <ProjectDataPanel /> */}
      <ToolBar />
      <SideBar />
      <RightSideBar />
      <div className="flex min-h-0 flex-1">
        <div
          className={`flex h-full flex-1 flex-col transition-all duration-300 ease-in-out ${
            rightSidebarOpen ? "mr-80" : "mr-0"
          }`}
        >
          <DeviceSelector />
          <div className="min-h-0 flex-1">
            <StudioEditor onReady={handleEditorReady} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
