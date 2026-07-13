import { Eye, EyeOff } from "lucide-react";
import {
  useStylesStore,
  type StyleSectorInfo,
  type StylePropertyInfo,
} from "../../stores/stylesStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";

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

export default function VisibilityInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  const display = findProperty(sectors, ["display", "visibility"]);
  const isHidden = display?.property.value === "none";

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-50 text-xs">Visibility</Label>
      <ButtonGroup className="w-full">
        <Button
          variant={isHidden ? "outline" : "default"}
          className="flex-1"
          disabled={!display}
          onClick={() =>
            display &&
            setPropertyValue(display.sectorId, display.property.id, "block")
          }
        >
          <Eye /> Visible
        </Button>
        <Button
          variant={isHidden ? "default" : "outline"}
          className="flex-1"
          disabled={!display}
          onClick={() =>
            display &&
            setPropertyValue(display.sectorId, display.property.id, "none")
          }
        >
          <EyeOff />
          Hidden
        </Button>
      </ButtonGroup>
    </div>
  );
}
