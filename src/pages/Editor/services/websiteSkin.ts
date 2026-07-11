import type { Editor as GrapesEditor } from "grapesjs";
import type {
  RawWebsiteSkinBackgroundKey,
  RawWebsiteSkinContent,
} from "./UTDApi";

export interface RenderedWebsiteSkin {
  style: string;
  font: string;
  fontsName: string[];
}

const BACKGROUND_SELECTORS: Record<RawWebsiteSkinBackgroundKey, string> = {
  footer: "#footer",
  header: "#header",
  menu: "#primary-menu",
  content: "body",
  pageTitle: "#page-title",
  subFooter: "#sub-footer",
  headerToolbar: "#top-bar",
};

const HEADER_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

// Ported from the old project's _renderStyle(): turns the website-skin
// payload into a single CSS string (custom properties + selector
// overrides) plus a Google Fonts stylesheet URL for the fonts it uses.
export function renderWebsiteSkin(
  skin: RawWebsiteSkinContent,
): RenderedWebsiteSkin {
  const fonts = skin.fonts;
  const fontChecker: string[] = [];
  const fontFiltered: string[] = [];
  let styleOverride = "";
  let rootStyle = ":root {\n";

  const fontLists: (string | undefined)[] = [
    fonts?.menu?.fontFamily,
    fonts?.body?.fontFamily,
    ...(fonts?.header
      ? HEADER_LEVELS.map((level) => fonts.header?.[level]?.fontFamily)
      : []),
  ];

  fontLists.forEach((font) => {
    if (font && !fontChecker.includes(font)) {
      fontChecker.push(font);
      fontFiltered.push(font.replace(" ", "+"));
    }
  });

  let fontLink = "https://fonts.googleapis.com/css?family=";
  fontFiltered.forEach((font) => {
    fontLink += `${font}:400,700|`;
  });
  fontLink = fontLink.slice(0, -1);

  if (fonts?.pageTitle) {
    const s = fonts.pageTitle;
    rootStyle += `
    --page-title-color: ${s.color}
    --page-title-font-size: ${s.fontSize}px;
    --page-title-font-family: ${s.fontFamily};
    --page-title-line-height: ${s.lineHeight};
    --page-title-link: ${s.link};
    --page-title-hover: ${s.linkHover};
    `;
  }

  if (fonts?.headerToolbar) {
    const s = fonts.headerToolbar;
    rootStyle += `
    --topbar-font-size: ${s.fontSize}px;
    --topbar-icon-color: ${s.icon};
    --topbar-font-family: ${s.fontFamily};
    --topbar-color: ${s.color};
    `;
  }

  if (fonts?.menu) {
    const s = fonts.menu;
    rootStyle += `
    --menu-font-size: ${s.fontSize}px;
    --menu-icon-color: ${s.icon};
    --menu-font-family: ${s.fontFamily};
    --menu-color: ${s.color};
    --menu-hover-link: ${s.link};
    --menu-hover-card:  ${s.linkHover};
    --menu-text-transform: ${s.textTransform};
    `;
  }

  if (fonts?.body) {
    const s = fonts.body;
    rootStyle += `
      --body-font-family: '${s.fontFamily}', serif;
      --body-font-color: ${s.color};
      --body-font-size: ${s.fontSize}px;
      --body-link: ${skin.accentColorHover};
      --body-link-hover: ${skin.accentColorHover};
      --body-line-height: ${s.lineHeight ? `${s.lineHeight}em` : "inherit"};
    `;
  }

  if (fonts?.header) {
    HEADER_LEVELS.forEach((level) => {
      const h = fonts.header?.[level];
      if (!h) return;
      styleOverride += `${level} {
            font-family: '${h.fontFamily}', serif;
            font-weight: ${h.fontWeight};
            font-size: ${h.fontSizeRaw ? `${h.fontSizeRaw}px` : "inherit"};
            color: ${h.color ? h.color : "inherit"};
          }`;
    });
  }

  if (fonts?.footer) {
    const s = fonts.footer;
    rootStyle += `
      --footer-font-family: '${s.fontFamily}', serif;
      --footer-color: ${s.color};
      --footer-icon: ${s.icon};
      --footer-font-size: ${s.fontSize}px;
      --footer-link: ${s.link};
      --footer-link-hover: ${s.linkHover};
      --footer-line-height: ${s.lineHeight ? `${s.lineHeight}em` : "inherit"};
    `;
  }

  if (fonts?.subFooter) {
    const s = fonts.subFooter;
    rootStyle += `
      --sub-footer-font-family: '${s.fontFamily}', serif;
      --sub-footer-color: ${s.color};
      --sub-footer-icon: ${s.icon};
      --sub-footer-font-size: ${s.fontSize}px;
      --sub-footer-link: ${s.link};
      --sub-footer-link-hover: ${s.linkHover};
      --sub-footer-line-height: ${s.lineHeight ? `${s.lineHeight}em` : "inherit"};
    `;
  }

  const background = skin.background;
  if (background) {
    (Object.keys(BACKGROUND_SELECTORS) as RawWebsiteSkinBackgroundKey[]).forEach(
      (key) => {
        const entry = background[key];
        if (!entry) return;
        const selector = BACKGROUND_SELECTORS[key];

        if (entry.type === "color") {
          styleOverride += `${selector} {
      background-color: ${entry.value};
    }`;
        } else if (entry.type === "image") {
          styleOverride += `${selector} {
      background-image: url('${entry.value}');
      background-size: ${entry.options?.size};
      background-repeat: ${entry.options?.repeat};
      background-position: ${entry.options?.position};
      background-attachment: ${entry.options?.attachment};
    }`;
        }
      },
    );
  }

  if (skin.accentColor !== undefined) {
    rootStyle += `
  --theme: ${skin.accentColor};
`;
  }

  if (skin.accentColorHover !== undefined) {
    rootStyle += `
--theme-hover: ${skin.accentColorHover};
`;
  }

  if (skin.maxWidth !== undefined) {
    rootStyle += `
--container-max-width: ${skin.maxWidth}px;
`;
  }

  if (skin.blockPadding !== undefined) {
    rootStyle += `
--block-padding: ${skin.blockPadding}rem;
`;
  }

  rootStyle += `--blog-label-text: white;
  --blog-post-title: black; }`;

  styleOverride += rootStyle;

  return {
    style: styleOverride,
    font: fontLink,
    fontsName: fontChecker,
  };
}

const WEBSITE_SKIN_STYLE_ID = "website-skin-style";

function applyWebsiteSkin(editor: GrapesEditor, skin: RenderedWebsiteSkin) {
  editor.Canvas.getFrame(0)?.addLink(skin.font);

  const doc = editor.Canvas.getDocument();
  if (!doc?.head) return;

  let styleEl = doc.head.querySelector<HTMLStyleElement>(
    `#${WEBSITE_SKIN_STYLE_ID}`,
  );
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = WEBSITE_SKIN_STYLE_ID;
    doc.head.appendChild(styleEl);
  }
  styleEl.textContent = skin.style;
}

// Injects the skin into the canvas iframe only (never exported) - applies
// immediately if the frame is already loaded, and again on every future
// frame load (e.g. switching pages) since applyWebsiteSkin is idempotent.
export function loadWebsiteSkin(
  editor: GrapesEditor,
  skin: RenderedWebsiteSkin,
) {
  if (editor.Canvas.getDocument()?.head) {
    applyWebsiteSkin(editor, skin);
  }
  editor.on("canvas:frame:load", () => applyWebsiteSkin(editor, skin));
}
