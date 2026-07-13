import { useState } from "react";
import { ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
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

export default function StyleOptions() {
  const [color, setColor] = useState("#000000");

  return (
    <div className="flex flex-col gap-4 my-8 px-2">
      <h4 className="text-xs uppercase text-primary-500">Style Options</h4>
      <div className="flex flex-col gap-2">
        <Label className="opacity-50 text-xs">Visibility</Label>
        <ButtonGroup className="w-full">
          <Button variant="outline" className="flex-1">
            <Eye /> Visible
          </Button>
          <Button variant="outline" className="flex-1">
            <EyeOff />
            Hidden
          </Button>
        </ButtonGroup>
        <div className="flex gap-4">
          <Field>
            <FieldLabel htmlFor="input-width" className="opacity-50 text-xs">
              Width
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="input-width"
                type="text"
                placeholder="auto"
              />
              <InputGroupAddon align="inline-end">
                px
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<InputGroupButton variant="secondary" />}
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>px</DropdownMenuItem>
                      <DropdownMenuItem>%</DropdownMenuItem>
                      <DropdownMenuItem>vw</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-height" className="opacity-50 text-xs">
              Height
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="input-height"
                type="text"
                placeholder="auto"
              />
              <InputGroupAddon align="inline-end">
                px
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<InputGroupButton variant="secondary" />}
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>px</DropdownMenuItem>
                      <DropdownMenuItem>%</DropdownMenuItem>
                      <DropdownMenuItem>vh</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="input-color" className="opacity-50 text-xs">
            Color
          </FieldLabel>
          <InputGroup>
            <HexColorInput
              id="input-color"
              data-slot="input-group-control"
              color={color}
              onChange={setColor}
              prefixed
              placeholder="Select color"
              className={cn(
                "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
                "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent",
              )}
            />
            <InputGroupAddon align="inline-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<InputGroupButton variant="ghost" />}
                >
                  <div
                    className="h-4 w-4 rounded border"
                    style={{ backgroundColor: color }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto p-3">
                  <HexColorPicker color={color} onChange={setColor} />
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
    </div>
  );
}
