import Selector from "./StylesPanelSections/Selector";
import StyleSection from "./StylesPanelSections/StyleSection";
import VisibilityInput from "./StyleSettingInputFields/VisibilityInput/VisibilityInput";
import SizeInput from "./StyleSettingInputFields/SizeInput/SizeInput";
import ColorInput from "./StyleSettingInputFields/ColorInput/ColorInput";
import DisplayInput from "./StyleSettingInputFields/DisplayInput/DisplayInput";
import FloatInput from "./StyleSettingInputFields/FloatInput/FloatInput";
import InsetInput from "./StyleSettingInputFields/InsetInput/InsetInput";
import PositionInput from "./StyleSettingInputFields/PositionInput/PositionInput";
import LayerOrderInput from "./StyleSettingInputFields/LayerOrderInput/LayerOrderInput";
import OverflowInput from "./StyleSettingInputFields/OverflowInput/OverflowInput";
import ImageFitInput from "./StyleSettingInputFields/ImageFitInput/ImageFitInput";
import ObjectPositionInput from "./StyleSettingInputFields/ObjectPositionInput/ObjectPositionInput";

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
      <StyleSection title="General">
        <FloatInput />
        <DisplayInput />
        <InsetInput />
        <PositionInput />
        <LayerOrderInput />
        <OverflowInput />
        <ImageFitInput />
        <ObjectPositionInput />
      </StyleSection>
    </div>
  );
}
