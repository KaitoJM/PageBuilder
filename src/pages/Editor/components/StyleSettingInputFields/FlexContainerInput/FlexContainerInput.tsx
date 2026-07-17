import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import reference from "./FlexContainerInput.json";

// Old project's "Flex" sector led with this exact control: the same
// "display" property General/DisplayInput already owns, re-presented here as
// a plain Disable/Enable toggle (block/flex) instead of the full block /
// inline / inline-block / flex / none set - see helpers/siteBuilderHelper.js
// (StyleManagerSectors -> "Flex" -> "Flex Container") in the old project.
export default function FlexContainerInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
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
