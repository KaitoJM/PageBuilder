import { Plus } from "lucide-react";
import { useSidebarStore } from "../../../../components/sidebarStore";
import BlocksPanel from "../BlocksPanel";

export default function BlockTool() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={() => toggleSidebar("blocks", <BlocksPanel />)}
    >
      <Plus className="h-4 w-4 text-gray-400" />
    </button>
  );
}
