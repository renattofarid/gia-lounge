"use client"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { Links, Meta } from "@/lib/global.interface"
import { Button } from "./ui/button"

interface PaginationProps {
  links: Links
  meta: Meta
  onPageChange: (page: number) => void
}

export function Pagination({ links, meta, onPageChange }: PaginationProps) {
  // Determinar qué páginas mostrar
  const createPageNumbers = () => {
    const currentPage = meta.current_page
    const lastPage = meta.last_page
    const delta = 1 // Número de páginas a mostrar a cada lado de la página actual
    const pages = []

    // Siempre mostrar la primera página
    pages.push(1)

    // Calcular el rango de páginas a mostrar
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(lastPage - 1, currentPage + delta)

    // Agregar puntos suspensivos después de la página 1 si es necesario
    if (rangeStart > 2) {
      pages.push(-1) // -1 representa puntos suspensivos
    }

    // Agregar páginas del rango
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    // Agregar puntos suspensivos antes de la última página si es necesario
    if (rangeEnd < lastPage - 1) {
      pages.push(-2) // -2 representa puntos suspensivos
    }

    // Siempre mostrar la última página si hay más de una página
    if (lastPage > 1) {
      pages.push(lastPage)
    }

    return pages
  }

  const pageNumbers = createPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full py-4 px-2  mt-auto">
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{meta.from || 0}</span> a{" "}
        <span className="font-medium">{meta.to || 0}</span> de <span className="font-medium">{meta.total}</span>{" "}
        registros
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={meta.current_page === 1}
          className="h-8 w-8"
          title="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">Primera página</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={!links.prev}
          className="h-8 w-8"
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === -1 || pageNumber === -2) {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            )
          }

          return (
            <Button
              key={pageNumber}
              variant={pageNumber === meta.current_page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className={`h-8 w-8 ${
                pageNumber === meta.current_page ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {pageNumber}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={!links.next}
          className="h-8 w-8"
          title="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Página siguiente</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.last_page)}
          disabled={meta.current_page === meta.last_page}
          className="h-8 w-8"
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  )
}
