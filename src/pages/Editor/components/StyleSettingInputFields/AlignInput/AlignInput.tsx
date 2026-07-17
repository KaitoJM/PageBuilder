import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  StretchVertical,
  Baseline,
} from "lucide-react";
import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import reference from "./AlignInput.json";

const ICONS: Record<string, typeof AlignStartVertical> = {
  "flex-start": AlignStartVertical,
  center: AlignCenterVertical,
  "flex-end": AlignEndVertical,
  stretch: StretchVertical,
  baseline: Baseline,
};

export default function AlignInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
  const alignItems = findProperty(sectors, [reference.id]);

  const setAlignItems = (value: string) => {
    if (alignItems)
      setPropertyValue(alignItems.sectorId, alignItems.property.id, value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-50 text-xs">{reference.label}</Label>
      <ButtonGroup className="w-full">
        {reference.options.map((option) => {
          const Icon = ICONS[option.id];
          return (
            <Tooltip key={option.id}>
              <TooltipTrigger
                render={
                  <Button
                    variant={
                      alignItems?.property?.value === option.id
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                    aria-label={option.label}
                    onClick={() => setAlignItems(option.id)}
                  />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent>{option.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
