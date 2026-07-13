import { ChevronsUpDown, Eye, EyeOff } from "lucide-react";
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
  return (
    <div className="flex flex-col gap-4 my-4 px-2">
      <h4 className="text-xs uppercase text-primary-500">Style Options</h4>
      <div className="flex flex-col gap-2">
        <Label>Visibility</Label>
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
            <FieldLabel htmlFor="input-width">Width</FieldLabel>
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
            <FieldLabel htmlFor="input-height">Height</FieldLabel>
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
          <FieldLabel htmlFor="input-color">Color</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="input-color"
              type="text"
              placeholder="Select color"
            />
            <InputGroupAddon align="inline-end">
              px
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<InputGroupButton variant="ghost" />}
                >
                  <div className="w-4 h-4 border rounded"></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>Color picker here</DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
    </div>
  );
}
