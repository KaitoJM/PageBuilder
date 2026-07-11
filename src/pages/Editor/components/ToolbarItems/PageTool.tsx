import {
  BookOpenText,
  Folder,
  Network,
  Search,
  SquareArrowOutUpRight,
  SquarePen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useUTDPagesStore } from "../../../../stores/utdPagesStore";
import { useState } from "react";

export default function PageTool() {
  const pages = useUTDPagesStore((state) => state.pages);
  const [search, setSearch] = useState("");

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div>
      <Sheet>
        <Tooltip>
          <TooltipTrigger
            render={
              <SheetTrigger className="py-3 px-2 rounded focus:outline-none bg-black/40 hover:bg-black/70 hover:scale-110 transition-all duration-300 text-white" />
            }
          >
            <Network className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Pages</TooltipContent>
        </Tooltip>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Pages</SheetTitle>
            <SheetDescription>List of pages in the website</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4 border-b">
            <Field>
              <FieldLabel htmlFor="input-group-url">Search Pages</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="input-group-url"
                  placeholder="Search by page name"
                  defaultValue={search}
                  onKeyUp={(e) => setSearch(e.currentTarget.value)}
                />
                <InputGroupAddon align="inline-end">
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          <div className="px-4">
            {filteredPages.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Folder />
                  </EmptyMedia>
                  <EmptyTitle>No pages</EmptyTitle>
                  <EmptyDescription>
                    {pages.length === 0
                      ? "No pages found"
                      : "No pages match your search"}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              filteredPages.map((page) => (
                <Item key={page.id} variant="outline" className="mb-2">
                  <ItemMedia variant="icon">
                    <BookOpenText />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{page.name}</ItemTitle>
                    <ItemDescription>No url assigned</ItemDescription>
                    <div className="flex justify-end items-center gap-2 mt-2">
                      <Button variant="default" size="xs">
                        Edit Page <SquarePen />
                      </Button>
                      <Button variant="outline" size="xs">
                        Append Page <SquareArrowOutUpRight />
                      </Button>
                    </div>
                  </ItemContent>
                </Item>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
