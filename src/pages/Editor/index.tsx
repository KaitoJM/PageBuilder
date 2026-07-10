import { useCallback } from "react";
import StudioEditor from "@grapesjs/studio-sdk/react";
import type { Editor as GrapesEditor } from "grapesjs";
import BlocksPanel from "./components/BlocksPanel";
import LayersPanel from "./components/LayersPanel";
import PagesPanel from "./components/PagesPanel";
import ProjectDataPanel from "./components/ProjectDataPanel";
import { useEditorStore } from "./stores/editorStore";
import { globalPageSettings } from "./siteSettings";
import { bootstrapBlocks } from "./blocks/bootstrapBlocks";

import "@grapesjs/studio-sdk/style";

export default function Editor() {
  const setEditor = useEditorStore((state) => state.setEditor);

  const handleEditorReady = useCallback(
    (editor: GrapesEditor) => {
      setEditor(editor);
    },
    [setEditor],
  );

  return (
    <div className="flex h-screen w-screen flex-col">
      <ProjectDataPanel />
      <div className="flex min-h-0 flex-1">
        <div className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-2">
          <PagesPanel />
          <hr className="my-2 border-gray-200" />
          <BlocksPanel />
          <hr className="my-2 border-gray-200" />
          <LayersPanel />
        </div>
        <div className="h-full flex-1">
          <StudioEditor
            onReady={handleEditorReady}
            options={{
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
                    { type: "sidebarRight" },
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
            }}
          />
        </div>
      </div>
    </div>
  );
}
