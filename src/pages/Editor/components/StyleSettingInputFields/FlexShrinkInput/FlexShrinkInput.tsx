import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import reference from "./FlexShrinkInput.json";

export default function FlexShrinkInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const flexShrink = findProperty(sectors, [reference.id]);

  const setValue = (value: string) => {
    if (flexShrink)
      setPropertyValue(flexShrink.sectorId, flexShrink.property.id, value);
  };

  return (
    <Field>
      <FieldLabel htmlFor="input-flex-shrink" className="opacity-50 text-xs">
        {reference.label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="input-flex-shrink"
          type="number"
          min={reference.min}
          step={reference.step}
          placeholder={String(reference.default)}
          value={flexShrink?.property.value ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </InputGroup>
    </Field>
  );
}
