import type { SitePageInfo } from "../../../stores/utdPagesStore";

const API_BASE_URL = "https://www.uptodateconnect.com/api/v1/site-builder";

// TODO: replace with a real per-user/session token once auth is wired up.
// This is bundled into the client JS as-is, so it's visible to anyone
// inspecting the app - fine for now, not for production.
const STATIC_BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUwMSwiaWF0IjoxNzgzNDc3MzM0LCJleHAiOjE3ODYwNjkzMzR9.9uEbhnC9ZXMwDvJ5VXQJSpPSlb8V2PTR3f9m0qEbMlw";

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${STATIC_BEARER_TOKEN}` };
}

export interface EditorContent {
  html: string;
  css: string;
}

export interface FetchEditorContentParams {
  siteId: string;
  pageId: string;
}

export async function fetchEditorContent({
  siteId,
  pageId,
}: FetchEditorContentParams): Promise<EditorContent> {
  const url = new URL(`${API_BASE_URL}/editor/load`);
  url.searchParams.set("siteId", siteId);
  url.searchParams.set("pageId", pageId);

  const response = await fetch(url, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(
      `Failed to load editor content: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export interface SiteInfo {
  id: number;
  name: string;
  siteId: string;
  pages: SitePageInfo[];
}

export interface FetchSiteParams {
  siteId: string;
  pageId: string;
}

interface RawSitePage {
  id: number;
  name: string;
  pageId: string;
}

interface RawSiteResponse {
  success: boolean;
  payload: {
    id: number;
    name: string;
    siteId: string;
    SitePages?: RawSitePage[];
  };
}

export async function fetchSite({
  siteId,
  pageId,
}: FetchSiteParams): Promise<SiteInfo> {
  const url = new URL(`${API_BASE_URL}/sites/${siteId}`);
  url.searchParams.set("pageId", pageId);
  url.searchParams.set("limited", "1");

  const response = await fetch(url, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(
      `Failed to load site: ${response.status} ${response.statusText}`,
    );
  }

  const { payload }: RawSiteResponse = await response.json();

  return {
    id: payload.id,
    name: payload.name,
    siteId: payload.siteId,
    pages: (payload.SitePages ?? []).map((page) => ({
      id: page.id,
      name: page.name,
      pageId: page.pageId,
    })),
  };
}

export interface RawUTDBlock {
  id: number;
  name: string;
  category: string;
  code: string;
  screenshot: string | null;
}

interface RawBlocksResponse {
  success: boolean;
  payload: RawUTDBlock[];
}

export async function fetchBlocks(): Promise<RawUTDBlock[]> {
  const url = new URL(`${API_BASE_URL}/blocks`);
  url.searchParams.set("version", "2");
  url.searchParams.set("developer", "true");

  const response = await fetch(url, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(
      `Failed to load blocks: ${response.status} ${response.statusText}`,
    );
  }

  const { payload }: RawBlocksResponse = await response.json();
  return payload;
}

export interface RawWebsiteSkinTextStyle {
  name?: string;
  color?: string;
  icon?: string;
  link?: string;
  linkHover?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  textTransform?: string;
}

export interface RawWebsiteSkinHeaderLevelStyle {
  color?: string;
  fontSize?: string;
  fontSizeRaw?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  textTransform?: string;
}

export interface RawWebsiteSkinHeaderStyle {
  font?: string;
  name?: string;
  lineHeight?: number;
  h1?: RawWebsiteSkinHeaderLevelStyle;
  h2?: RawWebsiteSkinHeaderLevelStyle;
  h3?: RawWebsiteSkinHeaderLevelStyle;
  h4?: RawWebsiteSkinHeaderLevelStyle;
  h5?: RawWebsiteSkinHeaderLevelStyle;
  h6?: RawWebsiteSkinHeaderLevelStyle;
}

export interface RawWebsiteSkinBackgroundEntry {
  name?: string;
  type: "color" | "image" | "none";
  value: string;
  options?: {
    size?: string;
    repeat?: string;
    position?: string;
    attachment?: string;
  };
  htmlAttributes?: Record<string, string> | string;
}

export type RawWebsiteSkinBackgroundKey =
  | "footer"
  | "header"
  | "menu"
  | "content"
  | "pageTitle"
  | "subFooter"
  | "headerToolbar";

export interface RawWebsiteSkinContent {
  fonts?: {
    body?: RawWebsiteSkinTextStyle;
    menu?: RawWebsiteSkinTextStyle;
    footer?: RawWebsiteSkinTextStyle;
    header?: RawWebsiteSkinHeaderStyle;
    general?: RawWebsiteSkinTextStyle;
    pageTitle?: RawWebsiteSkinTextStyle;
    subFooter?: RawWebsiteSkinTextStyle;
    headerToolbar?: RawWebsiteSkinTextStyle;
  };
  background?: Partial<
    Record<RawWebsiteSkinBackgroundKey, RawWebsiteSkinBackgroundEntry>
  >;
  accentColor?: string;
  accentColorHover?: string;
  maxWidth?: string | number;
  blockPadding?: number;
  // Other fields the backend returns that the skin renderer doesn't use.
  logo?: Record<string, string>;
  layout?: string;
  goToTop?: boolean;
  structure?: Record<string, string>;
  selectedLoader?: { html: string; type: string };
  isPreloaderActive?: boolean;
  extraRootVariables?: { key: string; values: string }[];
}

interface RawWebsiteSkinResponse {
  success: boolean;
  payload: {
    id: number;
    siteId: number;
    content: RawWebsiteSkinContent;
    metadata: unknown;
    createdAt: string;
    updatedAt: string;
  };
}

export interface FetchWebsiteSkinParams {
  siteId: string;
}

export async function fetchWebsiteSkin({
  siteId,
}: FetchWebsiteSkinParams): Promise<RawWebsiteSkinContent> {
  const url = new URL(`${API_BASE_URL}/website-skin`);
  url.searchParams.set("siteId", siteId);

  const response = await fetch(url, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error(
      `Failed to load website skin: ${response.status} ${response.statusText}`,
    );
  }

  const { success, payload }: RawWebsiteSkinResponse = await response.json();
  if (!success) {
    throw new Error("Failed to load website skin: request unsuccessful");
  }

  return payload.content;
}
