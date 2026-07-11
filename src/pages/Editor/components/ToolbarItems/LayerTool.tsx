import { Layers } from "lucide-react";
import LayersPanel from "../LayersPanel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LayerTool() {
  return (
    <div>
      <Sheet>
        <Tooltip>
          <TooltipTrigger
            render={
              <SheetTrigger className="py-3 px-2 rounded-lg focus:outline-none bg-black/40 hover:bg-black/70 hover:scale-110 transition-all duration-300 text-white" />
            }
          >
            <Layers className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Layers</TooltipContent>
        </Tooltip>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Layers</SheetTitle>
            <SheetDescription>Manage page layers</SheetDescription>
          </SheetHeader>
          <div className="px-2">
            <LayersPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
