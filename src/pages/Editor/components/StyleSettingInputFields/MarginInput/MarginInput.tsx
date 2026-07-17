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
import reference from "./MarginInput.json";
import { Card, CardContent } from "@/components/ui/card";

export default function MarginInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const fields = reference.map((ref) => {
    const found = findProperty(sectors, [ref.id]);
    const parsed = parseSize(found?.property.value ?? "", ref.units[0]);

    const setValue = (number: string, unit: string) => {
      if (!found) return;
      setPropertyValue(
        found.sectorId,
        found.property.id,
        number.trim() === "" ? "" : `${number}${unit}`,
      );
    };

    return { ref, parsed, setValue };
  });

  const renderField = ({ ref, parsed, setValue }: (typeof fields)[number]) => (
    <Field key={ref.id}>
      <FieldLabel htmlFor={`input-${ref.id}`} className="opacity-50 text-xs">
        {ref.label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={`input-${ref.id}`}
          type="text"
          placeholder="0"
          value={parsed.number}
          onChange={(e) => setValue(e.target.value, parsed.unit)}
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
                {ref.units.map((unit) => (
                  <DropdownMenuItem
                    key={unit}
                    onClick={() => setValue(parsed.number || "0", unit)}
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

  return (
    <>
      <h5 className="mt-2 color-accent">Margin</h5>
      <Card>
        <CardContent>
          <div className="flex gap-4">
            {fields.slice(0, 2).map(renderField)}
          </div>
          <div className="flex gap-4">
            {fields.slice(2, 4).map(renderField)}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
