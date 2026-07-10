import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useSidebarStore } from "./sidebarStore";

export default function SideBar() {
  const open = useSidebarStore((state) => state.open);
  const content = useSidebarStore((state) => state.content);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeSidebar();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, closeSidebar]);

  return (
    <div
      ref={ref}
      className={`fixed top-0 z-10 flex h-screen w-80 flex-col overflow-y-auto border-r border-gray-200 bg-white p-2 pl-16 shadow-xl transition-all duration-300 ease-in-out ${
        open ? "left-0" : "-left-80"
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
