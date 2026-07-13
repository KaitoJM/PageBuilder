import Selector from "./StylesPanelSections/Selector";
import General from "./StylesPanelSections/General";
import StyleSection from "./StylesPanelSections/StyleSection";
import VisibilityInput from "./StyleSettingInputFields/VisibilityInput";
import SizeInput from "./StyleSettingInputFields/SizeInput";
import ColorInput from "./StyleSettingInputFields/ColorInput";

export default function StylesPanel() {
  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Styles
      </h2>
      <Selector />
      <StyleSection title="Style Options">
        <VisibilityInput />
        <SizeInput />
        <ColorInput />
      </StyleSection>
      <General />
    </div>
  );
}
