import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEditorStore } from "../stores/editorStore";

export default function ProjectDataPanel() {
  const projectData = useEditorStore((state) => state.projectData);
  const [open, setOpen] = useState(false);

  return (
    <div className="shrink-0 border-b border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
        Project data (what gets saved to the DB)
      </button>
      {open && (
        <pre className="max-h-64 overflow-auto border-t border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          {JSON.stringify(projectData, null, 2)}
        </pre>
      )}
    </div>
  );
}
