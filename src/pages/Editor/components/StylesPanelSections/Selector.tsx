import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useStylesStore, type SelectorInfo } from "../../stores/stylesStore";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function Selector() {
  const classes = useStylesStore((state) => state.classes);
  const states = useStylesStore((state) => state.states);
  const currentState = useStylesStore((state) => state.currentState);
  const addClass = useStylesStore((state) => state.addClass);
  const removeClass = useStylesStore((state) => state.removeClass);
  const setState = useStylesStore((state) => state.setState);
  const [newClass, setNewClass] = useState("");

  const selectedState = useMemo(
    () => states.find((state) => state.id === currentState) ?? null,
    [states, currentState],
  );

  const handleAdd = () => {
    if (newClass.trim()) {
      addClass(newClass);
      setNewClass("");
    }
  };

  const selectedName = useStylesStore((state) => state.selectedName);

  return (
    <div className="mb-3 space-y-2 border-b border-accent px-2 pb-3">
      <Field>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor="input-classes">Classes</FieldLabel>
          <Combobox
            items={states}
            value={selectedState}
            itemToStringLabel={(state: SelectorInfo) => state.label}
            isItemEqualToValue={(item: SelectorInfo, value: SelectorInfo) =>
              item.id === value?.id
            }
            onValueChange={(state) => setState(state ? state.id : "")}
          >
            <ComboboxInput placeholder="- State -" showClear />
            <ComboboxContent>
              <ComboboxEmpty>No states found.</ComboboxEmpty>
              <ComboboxList>
                {(state: SelectorInfo) => (
                  <ComboboxItem key={state.id} value={state}>
                    {state.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </Field>
      <InputGroup>
        <InputGroupInput
          type="text"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          onBlur={handleAdd}
          placeholder="+ Add class"
          className="min-w-0 flex-1"
        />
        {classes.length > 0 && (
          <InputGroupAddon align="block-start">
            <div className="flex gap-1 flex-wrap w-full">
              {classes.map((cls) => (
                <Badge key={cls.id} variant="outline">
                  {cls.label}
                  <button
                    type="button"
                    onClick={() => removeClass(cls.id)}
                    aria-label={`Remove ${cls.label}`}
                    className="outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </InputGroupAddon>
        )}
      </InputGroup>
      <div className="opacity-70 text-xs">
        Selected:{" "}
        {selectedName && (
          <>
            <Badge className="mb-2" variant="destructive">
              {selectedName}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
