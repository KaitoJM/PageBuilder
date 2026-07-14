import { ChevronsUpDown } from "lucide-react";
import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import reference from "./SizeInput.json";

const [widthReference, heightReference] = reference;

// CSS size values are a number glued to a unit (e.g. "100px") - split them
// so the number and unit can be edited independently, then rejoined on
// write. Values like "auto" have no numeric part, so there's nothing to
// split - fall back to the field's default unit for the dropdown to show.
function parseSize(
  value: string,
  defaultUnit: string,
): { number: string; unit: string } {
  const match = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(value.trim());
  if (!match) return { number: "", unit: defaultUnit };
  return { number: match[1], unit: match[2] || defaultUnit };
}

export default function SizeInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const width = findProperty(sectors, [widthReference.id]);
  const height = findProperty(sectors, [heightReference.id]);

  const widthParsed = parseSize(
    width?.property.value ?? "",
    widthReference.units[0],
  );
  const heightParsed = parseSize(
    height?.property.value ?? "",
    heightReference.units[0],
  );

  const setWidth = (number: string, unit: string) => {
    if (!width) return;
    setPropertyValue(
      width.sectorId,
      width.property.id,
      number.trim() === "" ? "" : `${number}${unit}`,
    );
  };

  const setHeight = (number: string, unit: string) => {
    if (!height) return;
    setPropertyValue(
      height.sectorId,
      height.property.id,
      number.trim() === "" ? "" : `${number}${unit}`,
    );
  };

  return (
    <div className="flex gap-4">
      <Field>
        <FieldLabel htmlFor="input-width" className="opacity-50 text-xs">
          {widthReference.label}
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="input-width"
            type="text"
            placeholder="auto"
            value={widthParsed.number}
            onChange={(e) => setWidth(e.target.value, widthParsed.unit)}
          />
          <InputGroupAddon align="inline-end">
            {widthParsed.unit}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<InputGroupButton variant="secondary" />}
              >
                <ChevronsUpDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {widthReference.units.map((unit) => (
                    <DropdownMenuItem
                      key={unit}
                      onClick={() => setWidth(widthParsed.number || "0", unit)}
                    >
                      {unit}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-height" className="opacity-50 text-xs">
          {heightReference.label}
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="input-height"
            type="text"
            placeholder="auto"
            value={heightParsed.number}
            onChange={(e) => setHeight(e.target.value, heightParsed.unit)}
          />
          <InputGroupAddon align="inline-end">
            {heightParsed.unit}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<InputGroupButton variant="secondary" />}
              >
                <ChevronsUpDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {heightReference.units.map((unit) => (
                    <DropdownMenuItem
                      key={unit}
                      onClick={() =>
                        setHeight(heightParsed.number || "0", unit)
                      }
                    >
                      {unit}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
