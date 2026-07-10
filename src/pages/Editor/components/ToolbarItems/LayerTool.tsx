import { Layers } from "lucide-react";
import { useSidebarStore } from "../../../../components/sidebarStore";
import LayersPanel from "../LayersPanel";

export default function LayerTool() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={() => toggleSidebar("layers", <LayersPanel />)}
    >
      <Layers className="h-4 w-4 text-gray-400" />
    </button>
  );
}
