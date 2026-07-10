import { Settings } from "lucide-react";
import { useRightSidebarStore } from "../../../../components/rightSidebarStore";
import PropertiesPanel from "../PropertiesPanel";

export default function PropertyTool() {
  const toggleSidebar = useRightSidebarStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      className="p-2 rounded-lg outline-none cursor-pointer"
      onClick={() => toggleSidebar("properties", <PropertiesPanel />)}
    >
      <Settings className="h-4 w-4 text-white hover:text-primary-400" />
    </button>
  );
}
