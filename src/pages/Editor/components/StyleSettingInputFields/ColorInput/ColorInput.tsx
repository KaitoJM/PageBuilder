import { HexColorInput, HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import reference from "./ColorInput.json";

export default function ColorInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const colorProp = findProperty(sectors, [reference.id]);
  const color = colorProp?.property.value || reference.default;

  const handleColorChange = (value: string) => {
    if (colorProp) {
      setPropertyValue(colorProp.sectorId, colorProp.property.id, value);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="input-color" className="opacity-50 text-xs">
        {reference.label}
      </FieldLabel>
      <InputGroup>
        <HexColorInput
          id="input-color"
          data-slot="input-group-control"
          color={color}
          onChange={handleColorChange}
          prefixed
          placeholder="Select color"
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent",
          )}
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger render={<InputGroupButton variant="ghost" />}>
              <div
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: color }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-3">
              <HexColorPicker color={color} onChange={handleColorChange} />
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
