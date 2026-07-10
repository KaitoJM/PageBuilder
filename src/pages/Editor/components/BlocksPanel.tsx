import { useBlocksStore, type BlockInfo } from "../stores/blocksStore";

function groupByCategory(blocks: BlockInfo[]): Map<string, BlockInfo[]> {
  const groups = new Map<string, BlockInfo[]>();
  for (const block of blocks) {
    const key = block.category || "Other";
    const group = groups.get(key);
    if (group) {
      group.push(block);
    } else {
      groups.set(key, [block]);
    }
  }
  return groups;
}

export default function BlocksPanel() {
  const blocks = useBlocksStore((state) => state.blocks);
  const startBlockDrag = useBlocksStore((state) => state.startBlockDrag);
  const appendBlock = useBlocksStore((state) => state.appendBlock);
  const groups = groupByCategory(blocks);

  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Blocks
      </h2>
      {blocks.length === 0 ? (
        <p className="px-2 text-sm text-gray-400">Loading…</p>
      ) : (
        Array.from(groups.entries()).map(([category, items]) => (
          <div key={category} className="mb-2">
            <p className="px-2 pb-1 text-xs font-medium text-gray-400">
              {category}
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              {items.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => startBlockDrag(block, e.nativeEvent)}
                  onClick={() => appendBlock(block)}
                  className="flex cursor-grab flex-col items-center gap-1 rounded border border-gray-200 p-2 text-center hover:bg-gray-100 active:cursor-grabbing"
                >
                  <div
                    className="h-6 w-6 text-gray-500"
                    dangerouslySetInnerHTML={{ __html: block.media }}
                  />
                  <span className="text-xs text-gray-700">{block.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
