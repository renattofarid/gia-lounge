"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import type { Links, Meta } from "@/lib/global.interface"
import { Button } from "./ui/button"

interface PaginationProps {
  links: Links
  meta: Meta
  onPageChange: (page: number) => void
}

export function Pagination({ links, meta, onPageChange }: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = []
    const totalPages = meta.last_page
    const currentPage = meta.current_page

    pages.push(
      <Button key={1} variant={currentPage === 1 ? "default" : "outline"} size="icon" onClick={() => onPageChange(1)}>
        1
      </Button>,
    )

    if (currentPage > 3) {
      pages.push(
        <Button key="start-ellipsis" variant="ghost" size="icon" disabled>
          <MoreHorizontal className="h-4 w-4" />
        </Button>,
      )
    }

    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= currentPage + 1 && i >= currentPage - 1) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>,
        )
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <Button key="end-ellipsis" variant="ghost" size="icon" disabled>
          <MoreHorizontal className="h-4 w-4" />
        </Button>,
      )
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>,
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex w-[100px] items-center justify-start text-sm text-muted-foreground">
        Página {meta.current_page} de {meta.last_page}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={!links.prev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">{renderPageNumbers()}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={!links.next}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex w-[100px] items-center justify-end text-sm text-muted-foreground">
        {meta.total} registros
      </div>
    </div>
  )
}

