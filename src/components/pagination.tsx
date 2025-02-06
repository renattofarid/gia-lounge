"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Links, Meta } from "@/lib/global.interface";
import { Button } from "./ui/button";

interface SimplePaginationProps {
  links: Links;
  meta: Meta;
  onPageChange: (page: number) => void;
}

export function Pagination({
  links,
  meta,
  onPageChange,
}: SimplePaginationProps) {
  return (
    <div className="flex items-center justify-end px-2 py-4 w-full">
      {/* <div className="text-sm text-muted-foreground">
        Página {meta.current_page} de {meta.last_page}
      </div> */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={!links.prev}
          className="bg-transparent text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={!links.next}
          className="bg-transparent text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {/* <div className="text-sm text-muted-foreground">
        {meta.total} registros
      </div> */}
    </div>
  );
}
