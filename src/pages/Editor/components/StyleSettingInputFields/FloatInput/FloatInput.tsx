import { AlignEndVertical, AlignStartVertical } from "lucide-react";
import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import reference from "./FloatInput.json";

export default function FloatInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
  const ensureProperty = useStylesStore((state) => state.ensureProperty);

  const float = findProperty(sectors, [reference.id]);

  // "float" may not exist as a property yet (see ensureProperty in
  // stylesStore.ts) - Left/Right are the only actions that actually need it
  // registered, so they create it on demand here rather than up front.
  // ensureProperty's refreshStyles() runs synchronously, so re-reading via
  // getState() immediately after picks up the freshly created property
  // instead of the stale `float` this render closed over.
  const setFloat = (value: string) => {
    if (!float) ensureProperty(reference);
    const fresh = findProperty(useStylesStore.getState().sectors, [
      reference.id,
    ]);
    if (fresh) setPropertyValue(fresh.sectorId, fresh.property.id, value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-50 text-xs">{reference.label}</Label>
      <ButtonGroup className="w-full">
        <Button
          variant={
            !float || float.property.value === "none" ? "default" : "outline"
          }
          className="flex-1"
          onClick={() =>
            float &&
            setPropertyValue(float.sectorId, float.property.id, "none")
          }
        >
          None
        </Button>
        <Button
          variant={float?.property?.value == "left" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setFloat("left")}
        >
          <AlignStartVertical /> Left
        </Button>
        <Button
          variant={float?.property?.value == "right" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setFloat("right")}
        >
          <AlignEndVertical /> Right
        </Button>
      </ButtonGroup>
    </div>
  );
}
