import { useStylesStore } from "../../stores/stylesStore";
import { findProperty } from "./findProperty";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";

export default function DisplayInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
  const ensureProperty = useStylesStore((state) => state.ensureProperty);
  const display = findProperty(sectors, ["display"]);

  const setDisplay = (value: string) => {
    if (!display) {
      ensureProperty({
        id: "display",
        label: "Display",
        default: "block",
        options: [
          { id: "block", label: "Block" },
          { id: "none", label: "None" },
        ],
      });
    }
    const fresh = findProperty(useStylesStore.getState().sectors, ["display"]);
    if (fresh) setPropertyValue(fresh.sectorId, fresh.property.id, value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-50 text-xs">Display</Label>
      <ButtonGroup className="w-full">
        <Button
          variant={display?.property?.value == "block" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setDisplay("block")}
        >
          Block
        </Button>
        <Button
          variant={display?.property?.value == "inline" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setDisplay("inline")}
        >
          Inline
        </Button>
        <Button
          variant={
            display?.property?.value == "inline-block" ? "default" : "outline"
          }
          className="flex-1"
          onClick={() => setDisplay("inline-block")}
        >
          Inline-Block
        </Button>
        <Button
          variant={display?.property?.value == "flex" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setDisplay("flex")}
        >
          Flex
        </Button>
        <Button
          variant={display?.property?.value == "none" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setDisplay("none")}
        >
          None
        </Button>
      </ButtonGroup>
    </div>
  );
}
