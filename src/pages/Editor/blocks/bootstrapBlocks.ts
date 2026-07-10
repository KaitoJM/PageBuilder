import type { BlockProperties, ComponentDefinition } from "grapesjs";

function columnsIcon(cols: number): string {
  const gap = 2;
  const colWidth = (24 - gap * (cols - 1)) / cols;
  const rects = Array.from({ length: cols }, (_, i) => {
    const x = i * (colWidth + gap);
    return `<rect x="${x.toFixed(1)}" y="4" width="${colWidth.toFixed(1)}" height="16" rx="1" />`;
  }).join("");
  return `<svg viewBox="0 0 24 24" fill="currentColor">${rects}</svg>`;
}

// Explicit `type: "default"` keeps these as generic droppable containers.
// A raw HTML string with only text content (eg. `<div>Column 1</div>`) gets
// auto-classified as `type: "text"` during parsing, which blocks further
// nesting - so structural wrappers are built as component definitions instead.
function columnDef(label: string): ComponentDefinition {
  return {
    tagName: "div",
    type: "default",
    name: "Column",
    classes: ["col"],
    components: label,
  };
}

function rowDef(cols: number): ComponentDefinition {
  return {
    tagName: "div",
    type: "default",
    name: "Container",
    classes: ["container"],
    components: {
      tagName: "div",
      type: "default",
      name: "Row",
      classes: ["row"],
      components: Array.from({ length: cols }, (_, i) =>
        columnDef(`Column ${i + 1}`),
      ),
    },
  };
}

const containerDef: ComponentDefinition = {
  tagName: "div",
  type: "default",
  name: "Container",
  classes: ["container"],
  components: "Container",
};

export const bootstrapBlocks: BlockProperties[] = [
  {
    id: "bs-container",
    label: "Container (Bootstrap)",
    category: "Bootstrap",
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="1"/></svg>',
    content: containerDef,
  },
  {
    id: "bs-row-2col",
    label: "2 Columns (Bootstrap)",
    category: "Bootstrap",
    media: columnsIcon(2),
    content: rowDef(2),
  },
  {
    id: "bs-row-3col",
    label: "3 Columns (Bootstrap)",
    category: "Bootstrap",
    media: columnsIcon(3),
    content: rowDef(3),
  },
  {
    id: "bs-row-4col",
    label: "4 Columns (Bootstrap)",
    category: "Bootstrap",
    media: columnsIcon(4),
    content: rowDef(4),
  },
  {
    id: "bs-button",
    label: "Button (Bootstrap)",
    category: "Bootstrap",
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="6" rx="2"/></svg>',
    content: '<button type="button" class="btn btn-primary">Button</button>',
  },
  {
    id: "bs-card",
    label: "Card (Bootstrap)",
    category: "Bootstrap",
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    content: {
      tagName: "div",
      type: "default",
      name: "Card",
      classes: ["card"],
      style: { width: "18rem" },
      components: {
        tagName: "div",
        type: "default",
        name: "Card Body",
        classes: ["card-body"],
        components: [
          { tagName: "h5", classes: ["card-title"], components: "Card title" },
          {
            tagName: "p",
            classes: ["card-text"],
            components:
              "Some quick example text for this card's content.",
          },
          {
            tagName: "a",
            classes: ["btn", "btn-primary"],
            attributes: { href: "#" },
            components: "Go somewhere",
          },
        ],
      },
    },
  },
];
