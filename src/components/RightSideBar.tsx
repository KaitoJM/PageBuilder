import { X } from "lucide-react";
import { useRightSidebarStore } from "./rightSidebarStore";

export default function RightSideBar() {
  const open = useRightSidebarStore((state) => state.open);
  const content = useRightSidebarStore((state) => state.content);
  const closeSidebar = useRightSidebarStore((state) => state.closeSidebar);

  return (
    <div
      className={`fixed top-0 z-20 flex h-screen w-80 flex-col overflow-y-auto border-l border-gray-200 bg-white p-2 shadow-xl transition-all duration-300 ease-in-out ${
        open ? "right-0" : "-right-80"
      }`}
    >
      <button
        type="button"
        onClick={closeSidebar}
        className="absolute top-2 right-2 rounded-lg p-1 text-gray-400 hover:bg-gray-100"
        aria-label="Close sidebar"
      >
        <X className="h-4 w-4" />
      </button>
      {content}
    </div>
  );
}
