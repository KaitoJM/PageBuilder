// CSS size values are a number glued to a unit (e.g. "100px") - split them
// so the number and unit can be edited independently, then rejoined on
// write. Values like "auto" have no numeric part, so there's nothing to
// split - fall back to the field's default unit for the dropdown to show.
export function parseSize(
  value: string,
  defaultUnit: string,
): { number: string; unit: string } {
  const match = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(value.trim());
  if (!match) return { number: "", unit: defaultUnit };
  return { number: match[1], unit: match[2] || defaultUnit };
}
