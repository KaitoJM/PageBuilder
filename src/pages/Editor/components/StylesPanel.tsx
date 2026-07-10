import { useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  useStylesStore,
  type StyleSectorInfo,
  type SelectorInfo,
} from "../stores/stylesStore";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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

function SectorSection({ sector }: { sector: StyleSectorInfo }) {
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);

  return (
    <AccordionItem value={sector.id} className="px-2">
      <AccordionTrigger className="text-sm">{sector.name}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {sector.properties.map((property) => (
            <label key={property.id} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-gray-500">
                {property.label}
              </span>
              <Input
                type="text"
                value={property.value}
                onChange={(e) =>
                  setPropertyValue(sector.id, property.id, e.target.value)
                }
                className="min-w-0 flex-1 "
              />
            </label>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function StylesPanel() {
  const sectors = useStylesStore((state) => state.sectors);
  const selectedName = useStylesStore((state) => state.selectedName);
  const toggleSector = useStylesStore((state) => state.toggleSector);

  const openValues = sectors
    .filter((sector) => sector.open)
    .map((sector) => sector.id);

  const handleValueChange = (value: string[]) => {
    const changed =
      value.length > openValues.length
        ? value.find((id) => !openValues.includes(id))
        : openValues.find((id) => !value.includes(id));
    if (changed) toggleSector(changed);
  };

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
      <Accordion multiple value={openValues} onValueChange={handleValueChange}>
        {sectors.map((sector) => (
          <SectorSection key={sector.id} sector={sector} />
        ))}
      </Accordion>
    </div>
  );
}
