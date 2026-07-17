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
import FlexDirectionInput from "./StyleSettingInputFields/FlexDirectionInput/FlexDirectionInput";
import JustifyInput from "./StyleSettingInputFields/JustifyInput/JustifyInput";
import AlignInput from "./StyleSettingInputFields/AlignInput/AlignInput";
import FlexGrowInput from "./StyleSettingInputFields/FlexGrowInput/FlexGrowInput";
import FlexShrinkInput from "./StyleSettingInputFields/FlexShrinkInput/FlexShrinkInput";

export default function StylesPanel() {
  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Styles
      </h2>
      <Selector />
      <StyleSection
        title="Style Options"
        description="Control visibility, size, and color for the selected element."
        open
      >
        <VisibilityInput />
        <SizeInput />
        <ColorInput />
      </StyleSection>
      <StyleSection
        title="General"
        description="Layout, positioning, and object-fit behavior for the selected element."
      >
        <FloatInput />
        <DisplayInput />
        <InsetInput />
        <PositionInput />
        <LayerOrderInput />
        <OverflowInput />
        <ImageFitInput />
        <ObjectPositionInput />
      </StyleSection>
      <StyleSection title="Flex" open>
        <FlexDirectionInput />
        <JustifyInput />
        <AlignInput />
        <FlexGrowInput />
        <FlexShrinkInput />
      </StyleSection>
    </div>
  );
}
