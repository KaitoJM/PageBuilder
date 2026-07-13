import StyleOptions from "./StylesPanelSections/StyleOptions";
import Selector from "./StylesPanelSections/Selector";
import General from "./StylesPanelSections/General";

export default function StylesPanel() {
  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Styles
      </h2>
      <Selector />
      <StyleOptions />
      <General />
    </div>
  );
}
