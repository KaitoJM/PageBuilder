import { Paintbrush } from "lucide-react";
import { useRightSidebarStore } from "../../../../components/rightSidebarStore";
import StylesPanel from "../StylesPanel";

export default function StyleTool() {
  const toggleSidebar = useRightSidebarStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      onClick={() => toggleSidebar("styles", <StylesPanel />)}
    >
      <Paintbrush className="h-4 w-4 text-primary-400" />
    </button>
  );
}
