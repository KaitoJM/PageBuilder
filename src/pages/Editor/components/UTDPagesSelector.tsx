import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../../components/ui/combobox";
import { useUTDPagesStore, type SitePageInfo } from "../../../stores/utdPagesStore";

export default function UTDPagesSelector() {
  const pages = useUTDPagesStore((state) => state.pages);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPage = useMemo(
    () => pages.find((page) => page.pageId === searchParams.get("pageId")) ?? null,
    [pages, searchParams],
  );

  if (pages.length === 0) {
    return <p className="px-2 text-sm text-gray-400">Loading…</p>;
  }

  return (
    <Combobox
      items={pages}
      value={selectedPage}
      itemToStringLabel={(page: SitePageInfo) => page.name}
      isItemEqualToValue={(item: SitePageInfo, value: SitePageInfo) =>
        item.pageId === value?.pageId
      }
      onValueChange={(page) => {
        if (!page) return;
        const params = new URLSearchParams(searchParams);
        params.set("pageId", page.pageId); // keep siteId unchanged
        setSearchParams(params);
        location.reload(); // reload the page to reflect the new pageId
      }}
    >
      <ComboboxInput placeholder="Search pages…" className="w-48" />
      <ComboboxContent>
        <ComboboxEmpty>No pages found.</ComboboxEmpty>
        <ComboboxList>
          {(page: SitePageInfo) => (
            <ComboboxItem key={page.id} value={page}>
              {page.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
