import { lazy, Suspense, useState } from "react";
import { Code } from "lucide-react";
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

// monaco-editor pulls in its full editor-contrib suite as a side effect of
// its HTML language service (~5MB uncompressed) - lazy-load it so that
// weight is only fetched when this dialog is actually opened, not on every
// app load.
const CodeEditor = lazy(() => import("../CodeEditor"));

export default function CustomCodeTool() {
  const [code, setCode] = useState("");

  return (
    <div>
      <Dialog>
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
          <Suspense
            fallback={
              <div className="flex h-100 items-center justify-center rounded-md border">
                <Spinner className="size-6" />
              </div>
            }
          >
            <CodeEditor
              value={code}
              onChange={setCode}
              language="html"
              height="400px"
              className="overflow-hidden rounded-md border"
            />
          </Suspense>
          <DialogFooter>
            <Button variant="outline">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
