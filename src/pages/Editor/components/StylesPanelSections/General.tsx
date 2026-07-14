import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import FloatInput from "../StyleSettingInputFields/FloatInput/FloatInput";
import DisplayInput from "../StyleSettingInputFields/DisplayInput/DisplayInput";
import InsetInput from "../StyleSettingInputFields/InsetInput/InsetInput";
import PositionInput from "../StyleSettingInputFields/PositionInput/PositionInput";
import LayerOrderInput from "../StyleSettingInputFields/LayerOrderInput/LayerOrderInput";

export default function General() {
  return (
    <div className="flex flex-col gap-4 my-8 px-2">
      <h4 className="text-xs uppercase text-primary-500">General</h4>
      <div className="flex flex-col gap-2">
        <FloatInput />
        <DisplayInput />
        <InsetInput />
        <PositionInput />
        <LayerOrderInput />
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
