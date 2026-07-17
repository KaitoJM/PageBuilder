import { ChevronsUpDown } from "lucide-react";
import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { parseSize } from "../parseSize";
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
import reference from "./FlexBasisInput.json";

export default function FlexBasisInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const flexBasis = findProperty(sectors, [reference.id]);

  const parsed = parseSize(flexBasis?.property.value ?? "", reference.units[0]);

  const setFlexBasis = (number: string, unit: string) => {
    if (!flexBasis) return;
    setPropertyValue(
      flexBasis.sectorId,
      flexBasis.property.id,
      number.trim() === "" ? "" : `${number}${unit}`,
    );
  };

  return (
    <Field>
      <FieldLabel htmlFor="input-flex-basis" className="opacity-50 text-xs">
        {reference.label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="input-flex-basis"
          type="text"
          placeholder="auto"
          value={parsed.number}
          onChange={(e) => setFlexBasis(e.target.value, parsed.unit)}
        />
        <InputGroupAddon align="inline-end">
          {parsed.unit}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<InputGroupButton variant="secondary" />}
            >
              <ChevronsUpDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {reference.units.map((unit) => (
                  <DropdownMenuItem
                    key={unit}
                    onClick={() => setFlexBasis(parsed.number || "0", unit)}
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
  );
}
