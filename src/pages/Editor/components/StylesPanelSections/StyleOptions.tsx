import { HexColorInput, HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import {
  useStylesStore,
  type StyleSectorInfo,
  type StylePropertyInfo,
} from "../../stores/stylesStore";
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
import SizeInput from "../StyleSettingInputFields/SizeInput";
import VisibilityInput from "../StyleSettingInputFields/VisibilityInput";

// The style manager doesn't expose a stable, documented sector layout, so
// rather than hardcoding a sectorId (which a config change could silently
// break) this searches every sector's properties for an id/label match -
// same shape setPropertyValue needs (sectorId + propertyId) either way.
function findProperty(
  sectors: StyleSectorInfo[],
  candidates: string[],
): { sectorId: string; property: StylePropertyInfo } | undefined {
  const wanted = candidates.map((c) => c.toLowerCase());
  for (const sector of sectors) {
    const property = sector.properties.find(
      (p) =>
        wanted.includes(p.id.toLowerCase()) ||
        wanted.includes(p.label.toLowerCase()),
    );
    if (property) return { sectorId: sector.id, property };
  }
  return undefined;
}

export default function StyleOptions() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const colorProp = findProperty(sectors, ["color"]);

  const color = colorProp?.property.value || "#000000";

  const handleColorChange = (value: string) => {
    if (colorProp) {
      setPropertyValue(colorProp.sectorId, colorProp.property.id, value);
    }
  };

  return (
    <div className="flex flex-col gap-4 my-8 px-2">
      <h4 className="text-xs uppercase text-primary-500">Style Options</h4>
      <div className="flex flex-col gap-2">
        <VisibilityInput />
        <SizeInput />
        <Field>
          <FieldLabel htmlFor="input-color" className="opacity-50 text-xs">
            Color
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
                <DropdownMenuTrigger
                  render={<InputGroupButton variant="ghost" />}
                >
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
      </div>
    </div>
  );
}
