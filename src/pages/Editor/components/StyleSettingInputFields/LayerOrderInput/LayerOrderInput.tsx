import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import reference from "./LayerOrderInput.json";

export default function LayerOrderInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const zIndex = findProperty(sectors, [reference.id]);

  const setValue = (value: string) => {
    if (zIndex) setPropertyValue(zIndex.sectorId, zIndex.property.id, value);
  };

  return (
    <Field>
      <FieldLabel htmlFor="input-z-index" className="opacity-50 text-xs">
        {reference.label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="input-z-index"
          type="number"
          min={reference.min}
          step={reference.step}
          placeholder={String(reference.default)}
          value={zIndex?.property.value ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </InputGroup>
    </Field>
  );
}
