import { API_BASE_URL, apiGet } from "./client";

export interface RawSiteCodeEntry {
  id: number;
  siteId: number;
  type: "site" | "page";
  section: "header" | "footer";
  pageId: string | null;
  code: string;
  isAdded: boolean | null;
  isUpdated: boolean | null;
  createdAt: string;
  updatedAt: string;
}

interface RawSiteCodeResponse {
  success: boolean;
  payload: RawSiteCodeEntry[];
}

export interface FetchSiteCodeParams {
  siteId: string;
  // Omit to fetch the site-wide custom code; pass it for the page-specific
  // override, which supplements (not replaces) the site-wide code.
  pageId?: string;
}

export async function fetchSiteCode({
  siteId,
  pageId,
}: FetchSiteCodeParams): Promise<RawSiteCodeEntry[]> {
  const url = new URL(`${API_BASE_URL}/site-code`);
  url.searchParams.set("siteId", siteId);
  if (pageId) url.searchParams.set("pageId", pageId);

  const { success, payload } = await apiGet<RawSiteCodeResponse>(
    url,
    "load site code",
  );
  if (!success) {
    throw new Error("Failed to load site code: request unsuccessful");
  }

  return payload;
}
