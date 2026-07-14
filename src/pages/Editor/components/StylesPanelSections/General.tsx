import { useState } from "react";
import {
  AlignEndVertical,
  AlignStartVertical,
  ChevronsUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
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
import FloatInput from "../StyleSettingInputFields/FloatInput/FloatInput";
import DisplayInput from "../StyleSettingInputFields/DisplayInput/DisplayInput";

export default function General() {
  return (
    <div className="flex flex-col gap-4 my-8 px-2">
      <h4 className="text-xs uppercase text-primary-500">General</h4>
      <div className="flex flex-col gap-2">
        <FloatInput />
        <DisplayInput />
        <div className="flex gap-4">
          <Field>
            <FieldLabel htmlFor="input-width" className="opacity-50 text-xs">
              Top
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
              Right
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
        <div className="flex gap-4">
          <Field>
            <FieldLabel htmlFor="input-width" className="opacity-50 text-xs">
              Left
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
              Bottom
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
        {/* Position */}
        <div className="flex flex-col gap-2">
          <Label className="opacity-50 text-xs">Position</Label>
          <ButtonGroup className="w-full">
            <Button variant="outline" className="flex-1">
              Static
            </Button>
            <Button variant="outline" className="flex-1">
              Relative
            </Button>
            <Button variant="outline" className="flex-1">
              Absolute
            </Button>
            <Button variant="outline" className="flex-1">
              Sticky
            </Button>
            <Button variant="outline" className="flex-1">
              Fixed
            </Button>
          </ButtonGroup>
        </div>
        <Field>
          <FieldLabel htmlFor="input-width" className="opacity-50 text-xs">
            Layer Order (z-index)
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-width" type="number" />
          </InputGroup>
        </Field>
        {/* Overflow */}
        <div className="flex flex-col gap-2">
          <Label className="opacity-50 text-xs">Overflow</Label>
          <ButtonGroup className="w-full">
            <Button variant="outline" className="flex-1">
              Hidden
            </Button>
            <Button variant="outline" className="flex-1">
              Unset
            </Button>
          </ButtonGroup>
        </div>
        {/* Image Fit */}
        <div className="flex flex-col gap-2">
          <Label className="opacity-50 text-xs">Image Fit</Label>
          <ButtonGroup className="w-full">
            <Button variant="outline" className="flex-1">
              Contain
            </Button>
            <Button variant="outline" className="flex-1">
              Cover
            </Button>
            <Button variant="outline" className="flex-1">
              Fill
            </Button>
            <Button variant="outline" className="flex-1">
              Scale-down
            </Button>
          </ButtonGroup>
        </div>
        {/* Object Position */}
        <div className="flex flex-col gap-2">
          <Label className="opacity-50 text-xs">Object Position</Label>
          <ButtonGroup className="w-full">
            <Button variant="outline" className="flex-1">
              RT
            </Button>
            <Button variant="outline" className="flex-1">
              RB
            </Button>
            <Button variant="outline" className="flex-1">
              LT
            </Button>
            <Button variant="outline" className="flex-1">
              LB
            </Button>
            <Button variant="outline" className="flex-1">
              CC
            </Button>
            <Button variant="outline" className="flex-1">
              CT
            </Button>
            <Button variant="outline" className="flex-1">
              CB
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
