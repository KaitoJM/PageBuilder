import { SlidersHorizontal } from "lucide-react";
import { useRightSidebarStore } from "../../../../components/rightSidebarStore";
import PropertiesPanel from "../PropertiesPanel";

export default function PropertyTool() {
  const toggleSidebar = useRightSidebarStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      onClick={() => toggleSidebar("properties", <PropertiesPanel />)}
    >
      <SlidersHorizontal className="h-4 w-4 text-primary-400" />
    </button>
  );
}
