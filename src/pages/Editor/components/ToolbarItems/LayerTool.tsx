import { Layers } from "lucide-react";
import { useSidebarStore } from "../../../../components/sidebarStore";
import LayersPanel from "../LayersPanel";
import { Button } from "@/components/ui/button";

export default function LayerTool() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <Button
      type="button"
      className="py-5 px-2 rounded-lg focus:outline-none bg-black/40 hover:bg-black/70 hover:scale-110 transition-all duration-300 text-white"
      onClick={() => toggleSidebar("layers", <LayersPanel />)}
    >
      <Layers className="size-4" />
    </Button>
  );
}
