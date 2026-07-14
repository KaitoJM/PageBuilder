import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import reference from "./DisplayInput.json";

export default function DisplayInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
  // "display" is registered up front by the wired style manager reference
  // data (see data/site-editor-property-reference/) - no ensureProperty
  // fallback needed here, unlike "float"/"visibility", which aren't in that
  // data and still rely on it.
  const display = findProperty(sectors, [reference.id]);

  const setDisplay = (value: string) => {
    if (display) setPropertyValue(display.sectorId, display.property.id, value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-50 text-xs">{reference.label}</Label>
      <ButtonGroup className="w-full">
        {reference.options.map((option) => (
          <Button
            key={option.id}
            variant={
              display?.property?.value === option.id ? "default" : "outline"
            }
            className="flex-1"
            onClick={() => setDisplay(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
