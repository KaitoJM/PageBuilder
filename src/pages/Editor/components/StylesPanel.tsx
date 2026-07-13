import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useStylesStore, type SelectorInfo } from "../stores/stylesStore";
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
import StyleOptions from "./StylesPanelSections/StyleOptions";

function SelectorRow() {
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

  return (
    <div className="mb-3 space-y-2 border-b border-accent px-2 pb-3">
      <div className="flex flex-wrap items-center gap-1">
        {classes.map((cls) => (
          <span
            key={cls.id}
            className="flex items-center justify-between gap-1 rounded-lg border border-primary-100 bg-primary-100/50 px-2 py-1 text-xs text-white"
          >
            {cls.label}
            <button
              type="button"
              onClick={() => removeClass(cls.id)}
              aria-label={`Remove ${cls.label}`}
              className="outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
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
      </div>
      <Combobox
        items={states}
        value={selectedState}
        itemToStringLabel={(state: SelectorInfo) => state.label}
        isItemEqualToValue={(item: SelectorInfo, value: SelectorInfo) =>
          item.id === value?.id
        }
        onValueChange={(state) => setState(state ? state.id : "")}
      >
        <ComboboxInput placeholder="- State -" showClear className="w-full" />
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
  );
}

export default function StylesPanel() {
  const selectedName = useStylesStore((state) => state.selectedName);

  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Styles
      </h2>
      {selectedName ? (
        <>
          <Badge className="mb-2 ml-2" variant="destructive">
            {selectedName}
          </Badge>
          <SelectorRow />
        </>
      ) : (
        <p className="px-2 text-sm text-gray-400">
          Select a component to edit styles.
        </p>
      )}
      <StyleOptions />
    </div>
  );
}
