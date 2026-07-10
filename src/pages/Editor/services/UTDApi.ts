const API_BASE_URL = "https://www.uptodateconnect.com/api/v1/site-builder/editor";

// TODO: replace with a real per-user/session token once auth is wired up.
// This is bundled into the client JS as-is, so it's visible to anyone
// inspecting the app - fine for now, not for production.
const STATIC_BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUwMSwiaWF0IjoxNzgzNDc3MzM0LCJleHAiOjE3ODYwNjkzMzR9.9uEbhnC9ZXMwDvJ5VXQJSpPSlb8V2PTR3f9m0qEbMlw";

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
  const url = new URL(`${API_BASE_URL}/load`);
  url.searchParams.set("siteId", siteId);
  url.searchParams.set("pageId", pageId);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STATIC_BEARER_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load editor content: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
