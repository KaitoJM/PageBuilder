import { usePagesStore } from "../stores/pagesStore";

export default function PagesPanel() {
  const pages = usePagesStore((state) => state.pages);
  const selectedPageId = usePagesStore((state) => state.selectedPageId);
  const selectPage = usePagesStore((state) => state.selectPage);

  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Pages
      </h2>
      {pages.length === 0 ? (
        <p className="px-2 text-sm text-gray-400">Loading…</p>
      ) : (
        <select
          value={selectedPageId ?? ""}
          onChange={(e) => {
            const page = pages.find((p) => p.id === e.target.value);
            if (page) selectPage(page);
          }}
          className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
