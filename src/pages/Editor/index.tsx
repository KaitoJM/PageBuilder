import { useCallback, useState } from "react";
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

const testContent: { html: string; css: string } = {
  css: "section#iu2z{padding-bottom:10px;}.gjs-shape-divider > svg{height:100%;width:100%;transform:scaleY(-1);}.gjs-shape-divider--fl-v > svg{transform:scaleY(1);}.gjs-shape-divider--fl-h > svg{transform:scaleX(-1) scaleY(-1);}.gjs-shape-divider--fl-v-h > svg{transform:scaleY(1) scaleX(-1);}.gjs-shape-divider > svg > path{fill:currentColor;}.gjs-shape-divider-inv > path{transform:scale(-1, -1) translate(-100%, -100%);}#il2zd{background-image:url(https://uptodatewebdesign.s3.eu-west-3.amazonaws.com/uploads/O29A8751-1783596576902.jpeg);background-size:cover;background-position:center center;}",
  html: '<section id="il2zd" class="section-container hero jarallax"><div id="iwy5" class="container"><div id="iw00l" class="relative index-1"><h1 id="i2o09" data-aos="zoom-in-up" class="text-white hero-text mb-0">Interieur</h1></div></div></section><section id="ic6ju" class="section-container"><div class="container"><p class="text-pre-title">Pre title</p><h2>Lorem ipsum dolor amet consec tetur adipiscing.</h2><div class="grid grid-cols-2-res gap-0 mar-t-5"><div class="relative h-55 md:h-full"><img src="https://lh3.googleusercontent.com/-QeZrQf_M688/YMDnvpvpAKI/AAAAAAABSb0/B_BDkW00otYHSFskOVRJDLKcxeoZxwMowCLcBGAsYHQ/s1200/UTD-Example.png" alt="" class="img-fill"/></div><div class="md:pad-5"><div class="relative index-1 pad-5 shadow-custom md:mar-l-n10 bg-theme mar-b-4"><h3 class="mb-0 text-white">\n            Lorem ipsum dolor amet consec tetur adipiscing.\n          </h3></div><p class="mb-0">\n          Dolores eos qui ratione sequi nesciunt neque porro quisquam est qui\n          dolorem ipsum quia dolor sit amet consectetur.\n        </p><a tracker="" href="#" id="ibniw" class="btn-primary button button-blue mar-t-3">Ontdek Meer</a></div></div></div></section>',
};

export default function Editor() {
  const setEditor = useEditorStore((state) => state.setEditor);
  const rightSidebarOpen = useRightSidebarStore((state) => state.open);

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
  }));

  const handleEditorReady = useCallback(
    (editor: GrapesEditor) => {
      setEditor(editor);

      const homePage = editor.Pages.getAll().find(
        (page) => page.getName() === "Home",
      );
      homePage?.getMainComponent().components(testContent.html);
      editor.Css.addRules(testContent.css);
    },
    [setEditor],
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
