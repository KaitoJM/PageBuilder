# CLAUDE.md

Instructions for Claude Code (and any other AI assistant) working in this repo.

## Adding a new StyleSettingInputFields component

The right-hand style panel (`src/pages/Editor/components/StylesPanel.tsx`) is
being migrated section-by-section off hardcoded placeholder JSX and onto
small, modular components that each own one CSS property (or a tightly
related pair, like width/height). When asked to "do `<some property>`" for
one of these sections, follow this exact pattern.

### 1. Directory + file layout

Each component gets its own directory under
`src/pages/Editor/components/StyleSettingInputFields/`:

```
StyleSettingInputFields/
  <Name>Input/
    <Name>Input.tsx
    <Name>Input.json
```

Both files always exist together, even if the component doesn't need
`ensureProperty` (see below) - the JSON is the single source of truth for
that property's id/label/default/options, not just an `ensureProperty`
payload.

### 2. The JSON reference file

Schema (all fields except `id`/`label` are optional, include only what's
relevant to the property):

```json
{
  "id": "the-actual-css-property-name",
  "label": "Human Label",
  "default": "some-value",
  "units": ["px", "%", "vw"],
  "options": [{ "id": "value", "label": "Label" }]
}
```

- `id` **must** be the literal CSS property name (`"float"`, `"object-fit"`,
  `"top"`, ...) - this is what `findProperty` searches on and what
  `stylesStore.ts` passes to `editor.StyleManager.getProperty()`.
- For a component managing multiple related properties (e.g. `SizeInput`
  handling width+height, `InsetInput` handling top/right/bottom/left), the
  JSON is an array of the schema above instead of a single object.

**Before writing one from scratch**, check
`data/site-editor-property-reference/*.json` for an existing entry with a
matching `id` (search `grep -l '"id": "the-property"' data/site-editor-property-reference/*.json`).
That directory holds properties ported from the predecessor project's
GrapesJS config. If a match exists:
- Reuse its `options`/`units` as a starting point, but **verify** the values
  against real CSS semantics before trusting them - the ported data has
  known issues: labels are inconsistently cased (`"static"` vs `"Sticky"`),
  and some `default` values aren't even valid values for that property
  (`object-fit`'s ported default was `"normal"`, which isn't a real
  `object-fit` keyword at all - the actual CSS initial value is `"fill"`).
  Check MDN/the CSS spec for the real initial value rather than assuming the
  ported default is correct.
- Once the new component's own JSON exists, **delete** the corresponding
  file(s) from `data/site-editor-property-reference/` - the component's JSON
  supersedes it. (`moduleReferences.ts`'s de-dup would silently prefer the
  module version anyway, but leaving the stale ported copy around invites
  someone reading it later to trust the wrong values.)

If no match exists (e.g. `float`, `visibility`, `top`/`right`/`bottom`/`left`
aren't in the ported data at all), just author the JSON directly with
correct real-world CSS defaults/options.

### 3. The component file

```tsx
import { useStylesStore } from "../../../stores/stylesStore";
import { findProperty } from "../findProperty";
// ...UI imports...
import reference from "./<Name>Input.json";

export default function <Name>Input() {
  const sectors = useStylesStore((state) => state.sectors);
  const setPropertyValue = useStylesStore((state) => state.setPropertyValue);
  const found = findProperty(sectors, [reference.id]);

  const setValue = (value: string) => {
    if (found) setPropertyValue(found.sectorId, found.property.id, value);
  };

  // render using reference.label / reference.options / reference.units
}
```

- **Always** import the shared `findProperty` from `../findProperty` - never
  reimplement the lookup. It matches by `id` **only**, never by label. This
  is deliberate, not an oversight: the ported reference data reuses generic
  labels across unrelated properties (`display` is labeled `"Visibility"` in
  one sector; `flex-basis` is labeled `"Width"` in another), and matching by
  label caused real, hard-to-notice bugs (a "visibility" lookup silently
  hijacking the `display` property; a "width" lookup silently hijacking
  `flex-basis`). Don't add label-matching back.
- For a discrete set of mutually exclusive values (radio/select-shaped
  properties - `display`, `position`, `overflow`, `object-fit`,
  `object-position`), render by `.map()`-ing over `reference.options` into a
  `ButtonGroup`, rather than one hardcoded `<Button>` per option. See
  `DisplayInput.tsx` or `PositionInput.tsx` for the exact shape.
- For a unit-bearing numeric CSS value (`"100px"`), use the shared
  `parseSize` helper from `../parseSize` to split the number from the unit
  for editing, then rejoin on write. See `SizeInput.tsx`/`InsetInput.tsx`.
- Do **not** add an `ensureProperty` fallback unless the property is
  genuinely absent from both the ported reference data *and* every other
  module's JSON (verified, not assumed - grep for it). `moduleReferences.ts`
  (see below) eagerly registers every `*Input/*Input.json` at editor init
  now, so a fresh component's own JSON is enough on its own; `ensureProperty`
  is a leftover fallback from before that auto-registration existed and is
  only still load-bearing for a couple of older components.

### 4. Wiring - mostly automatic

`src/pages/Editor/components/StyleSettingInputFields/moduleReferences.ts`
glob-loads every `*Input/*Input.json` in this directory automatically (no
manual list/index to update) and registers them all into GrapesJS's style
manager config via `siteEditorPropertyReference.ts` → `index.tsx`'s
`gjsOptions.styleManager.sectors`. A new component's JSON is live from the
moment the file exists - nothing else needs to be told about it.

The one manual step: import the new component into
`src/pages/Editor/components/StylesPanel.tsx` and render it inside the
appropriate `<StyleSection title="...">` block (or start a new
`<StyleSection title="New Group Name">` if it doesn't belong in an existing
one) - replacing any hardcoded placeholder JSX for that same property, and
removing whatever imports that placeholder needed if they're now unused
elsewhere in the file. `StylesPanel.tsx` is the only place these components
get mounted; `Selector.tsx` is the one exception that isn't a
`StyleSettingInputFields` component (it renders the class/state selector
row, not a single CSS property).

### 5. Verify

Run `npx tsc --noEmit -p tsconfig.app.json` after each new component. This
repo has a handful of pre-existing unrelated `noUnusedLocals`/`noUnusedParameters`
warnings in files unrelated to this work (e.g. `Selector.tsx`,
`ToolBarRight.tsx`, `PageTool.tsx`) - don't fix those unless asked; just
confirm no *new* errors appeared.
