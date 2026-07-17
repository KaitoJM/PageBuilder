import {
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
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
import reference from "./JustifyInput.json";

const ICONS: Record<string, typeof AlignHorizontalJustifyStart> = {
  "flex-start": AlignHorizontalJustifyStart,
  center: AlignHorizontalJustifyCenter,
  "flex-end": AlignHorizontalJustifyEnd,
  "space-between": AlignHorizontalSpaceBetween,
  "space-around": AlignHorizontalSpaceAround,
};

export default function JustifyInput() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
  const justifyContent = findProperty(sectors, [reference.id]);

  const setJustifyContent = (value: string) => {
    if (justifyContent)
      setPropertyValue(
        justifyContent.sectorId,
        justifyContent.property.id,
        value,
      );
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
                      justifyContent?.property?.value === option.id
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                    aria-label={option.label}
                    onClick={() => setJustifyContent(option.id)}
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
