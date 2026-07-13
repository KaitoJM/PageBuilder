import { create } from "zustand";
import type { Editor as GrapesEditor } from "grapesjs";
import type { RawSiteCodeEntry } from "./UTDApi";

function getSection(
  entries: RawSiteCodeEntry[],
  section: "header" | "footer",
): string {
  return entries.find((entry) => entry.section === section)?.code ?? "";
}

export type SiteCodeSectionKey =
  | "siteHeader"
  | "siteFooter"
  | "pageHeader"
  | "pageFooter";

export interface SiteCodeStoreState {
  siteHeader: string;
  siteFooter: string;
  pageHeader: string;
  pageFooter: string;
  setSiteCode: (sections: Record<SiteCodeSectionKey, string>) => void;
  setSection: (key: SiteCodeSectionKey, value: string) => void;
}

// Holds the 4 code sections (site header/footer, page header/footer) so
// any component - e.g. the Custom Code editor UI - can read/edit them,
// independent of applySiteCode's canvas injection below (which only uses
// 3 of the 4: site-wide footer isn't rendered, matching the old project,
// but it's still fetched/editable).
export const useSiteCodeStore = create<SiteCodeStoreState>((set) => ({
  siteHeader: "",
  siteFooter: "",
  pageHeader: "",
  pageFooter: "",
  setSiteCode: (sections) => set(sections),
  setSection: (key, value) => set({ [key]: value }),
}));

const SITE_CODE_HEADER_ID = "site-code-header";
const PAGE_CODE_HEADER_ID = "page-code-header";
const PAGE_CODE_FOOTER_ID = "page-code-footer";

function upsertHtml(doc: Document, container: Element, id: string, html: string) {
  let el = container.querySelector<HTMLDivElement>(`#${id}`);
  if (!el) {
    el = doc.createElement("div");
    el.id = id;
    container.appendChild(el);
  }
  el.innerHTML = html;
}

interface SiteCodeSections {
  siteHeader: string;
  pageHeader: string;
  pageFooter: string;
}

function applySiteCode(editor: GrapesEditor, sections: SiteCodeSections) {
  const doc = editor.Canvas.getDocument();
  const body = editor.Canvas.getBody();
  if (!doc?.head || !body) return;

  // Always upsert, even with an empty string: a page switch where the new
  // page has no header/footer code must clear out the previous page's
  // leftover content, not skip past it and leave it stale.
  upsertHtml(doc, doc.head, SITE_CODE_HEADER_ID, sections.siteHeader);
  upsertHtml(doc, doc.head, PAGE_CODE_HEADER_ID, sections.pageHeader);
  upsertHtml(doc, body, PAGE_CODE_FOOTER_ID, sections.pageFooter);
}

// Same rationale as websiteSkin.ts's listenerRegistered/latestSkin: avoid
// piling up duplicate frame-load listeners (with stale closures) every
// time loadSiteCode runs again, e.g. on every page switch.
const listenerRegistered = new WeakSet<GrapesEditor>();
const latestSections = new WeakMap<GrapesEditor, SiteCodeSections>();

/**
 * Applies the "Custom Code" feature's user-authored HTML/script snippets
 * (site-wide header, page-specific header, page-specific footer) to the
 * canvas iframe only - never included in page export. Site-wide and
 * page-specific code both apply at once (the old project loads them
 * together too, not one overriding the other); only the header sections
 * are used for the site-wide code, matching the old project (its footer
 * injection was present but disabled/commented out). Like the website
 * skin, this is injected as raw DOM (`innerHTML` on upserted wrapper
 * `<div>`s) rather than through GrapesJS's component model, so it isn't
 * selectable/editable via Layers or the Style Manager - it's edited via
 * `CustomCodeTool`/`useSiteCodeStore` instead.
 *
 * Safe to call repeatedly (e.g. once per page load): registers at most one
 * `canvas:frame:load` listener per editor instance, which re-applies the
 * most recently loaded sections on every future frame load - necessary
 * because switching pages recreates the iframe document, wiping any raw
 * DOM injection that isn't backed by GrapesJS's own model.
 *
 * @param editor The live GrapesJS editor instance.
 * @param siteEntries Site-wide header/footer code entries, as fetched from the API.
 * @param pageEntries Page-specific header/footer code entries, as fetched from the API.
 */
export function loadSiteCode(
  editor: GrapesEditor,
  siteEntries: RawSiteCodeEntry[],
  pageEntries: RawSiteCodeEntry[],
) {
  const siteHeader = getSection(siteEntries, "header");
  const siteFooter = getSection(siteEntries, "footer");
  const pageHeader = getSection(pageEntries, "header");
  const pageFooter = getSection(pageEntries, "footer");

  useSiteCodeStore
    .getState()
    .setSiteCode({ siteHeader, siteFooter, pageHeader, pageFooter });

  const sections: SiteCodeSections = { siteHeader, pageHeader, pageFooter };
  latestSections.set(editor, sections);

  if (editor.Canvas.getDocument()?.head) {
    applySiteCode(editor, sections);
  }

  if (!listenerRegistered.has(editor)) {
    listenerRegistered.add(editor);
    editor.on("canvas:frame:load", () => {
      const latest = latestSections.get(editor);
      if (latest) applySiteCode(editor, latest);
    });
  }
}
