import BlockTool from "./ToolbarItems/BlockTool";
import LayerTool from "./ToolbarItems/LayerTool";

export default function ToolBar() {
  return (
    <div className="fixed top-1/2 left-2 z-20 h-auto -translate-y-1/2 flex flex-col gap-1 rounded-lg bg-white p-2 shadow-xl border border-gray-100">
      <BlockTool />
      <LayerTool />
    </div>
  );
}
