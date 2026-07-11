import { lazy, Suspense, useRef, useState } from "react";
import { Code, Redo2, StickyNote, Undo2, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useSiteCodeStore,
  type SiteCodeSectionKey,
} from "../../services/siteCode";

// monaco-editor pulls in its full editor-contrib suite as a side effect of
// its HTML language service (~5MB uncompressed) - lazy-load it so that
// weight is only fetched when this dialog is actually opened, not on every
// app load.
const CodeEditor = lazy(() => import("../CodeEditor"));
// Type-only import - erased at compile time, doesn't pull CodeEditor's
// runtime module (and monaco with it) into this chunk.
import type { CodeEditorHandle } from "../CodeEditor";

const TAB_TO_SECTION: Record<string, SiteCodeSectionKey> = {
  "page-header": "pageHeader",
  "page-footer": "pageFooter",
  "site-header": "siteHeader",
  "site-footer": "siteFooter",
};

type SiteCodeDraft = Record<SiteCodeSectionKey, string>;

function snapshotSiteCode(): SiteCodeDraft {
  const state = useSiteCodeStore.getState();
  return {
    siteHeader: state.siteHeader,
    siteFooter: state.siteFooter,
    pageHeader: state.pageHeader,
    pageFooter: state.pageFooter,
  };
}

export default function CustomCodeTool() {
  const [activeTab, setActiveTab] = useState("page-header");
  const codeEditorRef = useRef<CodeEditorHandle>(null);
  const setSiteCode = useSiteCodeStore((state) => state.setSiteCode);

  // Edits stay local until Save - not written to useSiteCodeStore (and so
  // not re-injected into the canvas) on every keystroke. Re-snapshotted
  // from the store each time the dialog opens, so a previous unsaved draft
  // never leaks into a fresh session and freshly loaded data (e.g. from a
  // page switch) is picked up.
  const [draft, setDraft] = useState<SiteCodeDraft>(snapshotSiteCode);

  const sectionKey = TAB_TO_SECTION[activeTab];
  const code = draft[sectionKey];

  const handleOpenChange = (open: boolean) => {
    if (open) setDraft(snapshotSiteCode());
  };

  return (
    <div>
      <Dialog onOpenChange={handleOpenChange}>
        <Tooltip>
          <TooltipTrigger
            render={
              <DialogTrigger className="py-3 px-2 rounded focus:outline-none bg-black/40 hover:bg-black/70 hover:scale-110 transition-all duration-300 text-white" />
            }
          >
            <Code className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Custom Code</TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Site Code</DialogTitle>
            <DialogDescription>
              You can include additional styling and additional code using these
              section. Any changes you added may break the website, make sure
              that the code is syntactically correct to prevent breaking the
              website.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="page-header">
                  <StickyNote /> Page Header
                </TabsTrigger>
                <TabsTrigger value="page-footer">
                  <StickyNote /> Page Footer
                </TabsTrigger>
                <TabsTrigger value="site-header">
                  <Globe /> Global Header
                </TabsTrigger>
                <TabsTrigger value="site-footer">
                  <Globe /> Global Footer
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="Undo"
                onClick={() => codeEditorRef.current?.undo()}
              >
                <Undo2 />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Redo"
                onClick={() => codeEditorRef.current?.redo()}
              >
                <Redo2 />
              </Button>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex h-100 items-center justify-center rounded-md border">
                <Spinner className="size-6" />
              </div>
            }
          >
            <CodeEditor
              ref={codeEditorRef}
              docKey={sectionKey}
              value={code}
              onChange={(value) =>
                setDraft((prev) => ({ ...prev, [sectionKey]: value }))
              }
              language="html"
              height="400px"
              className="overflow-hidden rounded-md border"
            />
          </Suspense>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSiteCode(draft);
                toast.success("Custom code saved");
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
