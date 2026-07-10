import { ChevronRight, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { useEditorStore, type LayerTreeNode } from "../stores/editorStore";

interface LayerNodeProps {
  node: LayerTreeNode;
  depth: number;
}

function LayerNode({ node, depth }: LayerNodeProps) {
  const selectedId = useEditorStore((state) => state.selectedId);
  const select = useEditorStore((state) => state.select);
  const toggleOpen = useEditorStore((state) => state.toggleOpen);
  const toggleVisible = useEditorStore((state) => state.toggleVisible);
  const toggleLocked = useEditorStore((state) => state.toggleLocked);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded pr-1 hover:bg-gray-100 ${
          selectedId === node.id ? "bg-purple-100" : ""
        }`}
        style={{ paddingLeft: depth * 14 + 4 }}
      >
        <button
          type="button"
          onClick={() => toggleOpen(node)}
          className={`flex h-5 w-5 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600 ${
            hasChildren ? "" : "invisible"
          }`}
          aria-label={node.open ? "Collapse" : "Expand"}
        >
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform ${node.open ? "rotate-90" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={() => select(node)}
          className={`flex-1 truncate py-1 text-left text-sm ${
            selectedId === node.id
              ? "font-medium text-purple-700"
              : "text-gray-700"
          } ${node.visible === false ? "opacity-50" : ""}`}
        >
          {node.name}
        </button>

        <button
          type="button"
          onClick={() => toggleVisible(node)}
          className={`flex h-5 w-5 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600 ${
            node.visible ? "opacity-0 group-hover:opacity-100" : ""
          }`}
          aria-label={node.visible ? "Hide layer" : "Show layer"}
        >
          {node.visible ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => toggleLocked(node)}
          className={`flex h-5 w-5 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600 ${
            node.locked ? "" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={node.locked ? "Unlock layer" : "Lock layer"}
        >
          {node.locked ? (
            <Lock className="h-3.5 w-3.5" />
          ) : (
            <Unlock className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {node.open &&
        node.children.map((child) => (
          <LayerNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function LayersPanel() {
  const tree = useEditorStore((state) => state.tree);

  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Layers
      </h2>
      {tree ? (
        <LayerNode node={tree} depth={0} />
      ) : (
        <p className="px-2 text-sm text-gray-400">Loading…</p>
      )}
    </div>
  );
}
