import PropertyTool from "./ToolbarItems/PropertyTool";
import StyleTool from "./ToolbarItems/StyleTool";

export default function ToolBar() {
  return (
    <div className="fixed top-16 right-0 z-20 h-auto flex flex-col gap-1 bg-black/60 backdrop-blur-xl rounded-tl-xl rounded-bl-xl py-2 px-1">
      <StyleTool />
      <PropertyTool />
    </div>
  );
}
