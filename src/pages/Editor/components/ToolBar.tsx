import LayerTool from "./ToolbarItems/LayerTool";

export default function ToolBar() {
  return (
    <div className="fixed top-16 left-2 z-20 h-auto flex flex-col gap-1">
      <LayerTool />
    </div>
  );
}
