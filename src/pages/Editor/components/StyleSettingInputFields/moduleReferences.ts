import type { PropertyTypes } from "grapesjs";

interface ModuleProperty {
  id: string;
  label: string;
  type?: string;
  default?: string | number;
  units?: string[];
  min?: number;
  max?: number;
  step?: number;
  options?: { id: string; label: string }[];
  properties?: ModuleProperty[];
}

// Each *Input component owns a JSON file describing the CSS property(ies) it
// manages (e.g. DisplayInput/DisplayInput.json) - some (FloatInput,
// VisibilityInput) also use theirs directly as an ensureProperty fallback,
// since those properties aren't in the ported data/site-editor-property-
// reference/ set at all; others (Display, Size, Color) use theirs for
// labels/defaults, with the actual style manager registration happening
// here instead. Glob-loaded (relative to this file, so it resolves to
// StyleSettingInputFields/*/*.json) so a new <Name>Input/<Name>Input.json
// is picked up automatically - no manual list to keep in sync.
const modules = import.meta.glob("./*/*.json", {
  eager: true,
  import: "default",
}) as Record<string, ModuleProperty | ModuleProperty[]>;

// Same id -> property rename as siteEditorPropertyReference.ts - `id` is
// what findProperty searches on, `property` is grapesjs's own config field
// name for the same thing.
function toGrapesProperty(prop: ModuleProperty): PropertyTypes {
  const { id, properties, ...rest } = prop;
  return {
    ...rest,
    property: id,
    ...(properties && { properties: properties.map(toGrapesProperty) }),
  } as PropertyTypes;
}

export const moduleProperties: PropertyTypes[] = Object.values(
  modules,
).flatMap((entry) => (Array.isArray(entry) ? entry : [entry]).map(toGrapesProperty));

// The CSS property names these modules already own - siteEditorPropertyReference.ts
// uses this to make sure a module's own definition always wins over a
// same-named leftover in the ported reference data, rather than registering
// the same property twice from two different sources.
export const moduleOwnedPropertyIds = new Set(
  moduleProperties.map((p) => (p as { property: string }).property),
);
