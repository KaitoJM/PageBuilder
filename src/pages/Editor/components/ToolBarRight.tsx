import { Button } from "@/components/ui/button";
import PropertyTool from "./ToolbarItems/PropertyTool";
import StyleTool from "./ToolbarItems/StyleTool";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRightSidebarStore } from "@/components/rightSidebarStore";
import StylesPanel from "./StylesPanel";
import PropertiesPanel from "./PropertiesPanel";
import {
  Bot,
  Code,
  MessagesSquare,
  Paintbrush,
  Paperclip,
  Settings,
} from "lucide-react";
import CodeTool from "./ToolbarItems/CodeTool";
import CommentTool from "./ToolbarItems/CommentTool";
import AttachmentTool from "./ToolbarItems/AttachmentTool";
import BotTool from "./ToolbarItems/BotTool";
import CodePanel from "./CodePanel";

export default function ToolBar() {
  const open = useRightSidebarStore((state) => state.open);
  const activeId = useRightSidebarStore((state) => state.activeId);
  const closeSidebar = useRightSidebarStore((state) => state.closeSidebar);
  const openSidebar = useRightSidebarStore((state) => state.openSidebar);

  return (
    <div>
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-20 h-auto flex flex-col gap-1 bg-black/60 backdrop-blur-xl rounded-tl-xl rounded-bl-xl py-2 px-1">
        <StyleTool />
        <PropertyTool />
        <CodeTool />
        <CommentTool />
        <AttachmentTool />
        <BotTool />
      </div>
      <Drawer
        open={open}
        modal={false}
        disablePointerDismissal
        swipeDirection="right"
      >
        <DrawerContent>
          <div className="p-4 flex-1 min-h-0 overflow-y-auto">
            <Tabs
              value={activeId ?? undefined}
              onValueChange={(value) =>
                openSidebar(value as "styles" | "properties")
              }
              className="h-full w-full"
            >
              <TabsList className="mb-2 w-full border-b border-gray-200 dark:border-gray-800">
                <TabsTrigger value="styles">
                  <Paintbrush />
                </TabsTrigger>
                <TabsTrigger value="properties">
                  <Settings />
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code />
                </TabsTrigger>
                <TabsTrigger value="comments">
                  <MessagesSquare />
                </TabsTrigger>
                <TabsTrigger value="attachments">
                  <Paperclip />
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Bot />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="styles">
                <StylesPanel />
              </TabsContent>
              <TabsContent value="properties">
                <PropertiesPanel />
              </TabsContent>
              <TabsContent value="code" className="min-h-0">
                <CodePanel />
              </TabsContent>
            </Tabs>
          </div>
          <DrawerFooter>
            <DrawerClose
              render={<Button variant="outline" onClick={closeSidebar} />}
            >
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
