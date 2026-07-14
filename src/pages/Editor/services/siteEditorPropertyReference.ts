import type { PropertyTypes, SectorProperties } from "grapesjs";
import {
  moduleOwnedPropertyIds,
  moduleProperties,
} from "../components/StyleSettingInputFields/moduleReferences";

interface ReferenceProperty {
  sector: string;
  id: string;
  label: string;
  type?: string;
  default?: string | number;
  units?: string[];
  min?: number;
  max?: number;
  step?: number;
  options?: { id: string; label: string }[];
  properties?: Omit<ReferenceProperty, "sector">[];
}

// One property definition per file (see data/site-editor-property-reference/
// for provenance and rationale) rather than grouped by sector, since that's
// the unit each StyleSettingInputFields/*Input component actually looks up
// (findProperty searches by property id/label, never by sector). Glob-loaded
// so adding a new file here doesn't require touching any loader code.
const modules = import.meta.glob("/data/site-editor-property-reference/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ReferenceProperty>;

// The reference data uses `id` for the CSS property name (what findProperty
// searches on); grapesjs's own config shape calls that same field
// `property`. Recurses for composite properties (margin, padding, ...),
// whose sub-properties carry the same `id`/`property` naming.
function toGrapesProperty(
  prop: Omit<ReferenceProperty, "sector">,
): PropertyTypes {
  const { id, properties, ...rest } = prop;
  return {
    ...rest,
    property: id,
    ...(properties && { properties: properties.map(toGrapesProperty) }),
  } as PropertyTypes;
}

// Two sectors in the source data happen to share the literal name "Extra"
// (see data/site-editor-property-reference's extra-*.json vs
// extra-2-*.json) - grouping by name merges them back into one, which is
// fine here since this project never renders sector UI; sector is only
// used to satisfy grapesjs's registration API shape.
//
// Properties a *Input component already owns (moduleOwnedPropertyIds) are
// skipped here even if a same-named leftover still exists in the ported
// data - the component's own module JSON is the source of truth for those,
// registered separately below, not this ported set.
const bySector = new Map<string, PropertyTypes[]>();
for (const prop of Object.values(modules)) {
  if (moduleOwnedPropertyIds.has(prop.id)) continue;
  const list = bySector.get(prop.sector) ?? [];
  list.push(toGrapesProperty(prop));
  bySector.set(prop.sector, list);
}

export const styleManagerSectors: SectorProperties[] = [
  ...Array.from(bySector.entries()).map(([name, properties]) => ({
    name,
    properties,
  })),
  // Properties owned by StyleSettingInputFields/*Input components (see
  // moduleReferences.ts) - grouped into one sector since none of them carry
  // sector info of their own.
  { name: "Modular Inputs", properties: moduleProperties },
];
