"use client";

import Layout from "@/components/layouts/layout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Loader2, MoreVertical, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/components/delete-dialog";
import { errorToast, successToast } from "@/lib/core.function";
import { format, parse, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Pagination } from "@/components/pagination";
import { usePromotionStore } from "../lib/promotions.store";
import type { PromotionItem } from "../lib/promotions.interface";
import { deletePromotion } from "../lib/promotion.actions";
import CreatePromotion from "./addPromotion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import UpdatePromotion from "./updatePromotion";

export default function PromocionesPage() {
  const options = [
    // {
    //   name: "Mesas",
    //   link: "/empresas",
    //   permission: { name: "Leer", type: "Mesa" },
    // },
    // {
    //   name: "Salones",
    //   link: "/empresas/salones",
    //   permission: { name: "Leer", type: "Salón" },
    // },
    // {
    //   name: "Mesas/Box",
    //   link: "/empresas/mesas",
    //   permission: { name: "Leer", type: "Mesa" },
    // },
    // {
    //   name: "Eventos",
    //   link: "/empresas/eventos",
    //   permission: { name: "Leer", type: "Evento" },
    // },
    { name: "Promociones", link: "/promociones" },
    {
      name: "Productos",
      link: "/productos",
      permission: { name: "Leer", type: "Productos" },
    },
  ];

  const {
    promotions,
    loadPromotions,
    loading,
    links,
    meta,
    setFilter,
    setDateStart,
    promotionsWeek,
    loadPromotionsWeek,
  } = usePromotionStore();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const [promotionSelected, setPromotionSelected] =
    useState<PromotionItem | null>(null);
  const [idDeleteSelected, setIdDeleteSelected] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  // const [dateSelected, setDateSelected] = useState<string | undefined>(
  //   undefined
  // );

  // Efecto para limpiar el filtro cuando el input está vacío
  useEffect(() => {
    if (searchInput === "") {
      setFilter("");
      loadPromotions(1);
    }
  }, [searchInput, setFilter]);

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadPromotions(1);
  };

  const handleSelectDate = (date?: Date) => {
    if (!date) return;
    setDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    setDateStart(formattedDate);
    loadPromotions(1);
  };

  const handleClearDateFilter = () => {
    setDate(undefined);
    setDateStart(undefined);
    loadPromotions(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? undefined : value);
    loadPromotions(1);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadPromotions(1);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdDeleteSelected(id);
  };

  const handleDelete = async () => {
    try {
      await deletePromotion(idDeleteSelected).then(() => {
        setIsDeleteDialogOpen(false);
        successToast("Promoción eliminada correctamente");
        loadPromotions(1);
      });
    } catch (error) {
      errorToast("Error al eliminar la promoción");
    }
  };

  const handleClickUpdate = (promotion: PromotionItem) => {
    setPromotionSelected(promotion);
    setIsUpdateDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    loadPromotions(page);
  };

  useEffect(() => {
    loadPromotions(1);
    loadPromotionsWeek();
  }, [statusFilter]);

  return (
    <Layout options={options}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 md:px-4 max-w-screen-2xl">
          <div className="w-full mb-6 flex flex-col justify-center items-center">
            <h2 className="text-md font-medium text-center mb-4 font-poopins">
              Resumen de promociones de la semana
            </h2>
            <div className="w-full max-w-4xl mx-auto mb-2 relative">
              <div className="pb-4 overflow-x-scroll transparentScroll">
                <div className="flex gap-4 px-2">
                  {promotionsWeek.length > 0 ? (
                    promotionsWeek.map((promotion) => (
                      <div
                        key={promotion.id}
                        className="bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:scale-[1.02] flex-shrink-0 w-40 h-48"
                      >
                        <div className="relative">
                          <img
                            src={promotion.route || "/placeholder.svg"}
                            alt={promotion.name}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            s/.{promotion.precio}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">
                            {promotion.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {promotion.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-4 text-gray-500">
                      No hay promociones para esta semana
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row justify-between items-center mb-6">
            <div className="w-full">
              <h1 className="text-2xl font-bold font-inter">Promociones</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestionar todas las promociones de la semana
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Busqueda"
                    className="sm:w-[300px] w-full font-poopins text-[13px]"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFilter(searchInput);
                        loadPromotions(1);
                      }
                    }}
                  />
                  {searchInput && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchInput("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  size="icon"
                  className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
                  onClick={() => {
                    setFilter(searchInput);
                    loadPromotions(1);
                  }}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <Dialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                modal={false}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-violet-500 hover:bg-violet-600 font-inter"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Agregar promoción
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  {/* Simular fondo difuminado */}
                  <div className="fixed inset-0 z-40 bg-black/50 " />

                  {/* Contenido del Dialog */}
                  <DialogContent className="z-50 max-w-3xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-inter">
                        Agregar Promoción
                      </DialogTitle>
                    </DialogHeader>
                    <CreatePromotion onClose={handleClose} />
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
          </div>
          <div className="w-full flex justify-end mb-4">
            <div className="flex gap-2 w-full">
              <Select
                value={statusFilter || "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder="Seleccionar estado"
                    className="text-sm font-inter"
                  />
                </SelectTrigger>
                <SelectContent className="md:w-[180px]  text-sidebar-accent-foreground">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "md:w-[240px] w-full justify-start text-left font-normal text-sm bg-transparent",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "dd/MM/yyyy", { locale: es })
                    ) : (
                      <span>Fecha inicio</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => handleSelectDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearDateFilter}
                  title="Limpiar filtro de fecha"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col rounded-lg pt-2 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="font-inter text-[15px] text-foreground p-2">
                    Nombre
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground p-2">
                    Fecha Inicio
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground p-2">
                    Fecha Fin
                  </TableHead>
                  <TableHead className="font-inter text-center text-[15px] text-foreground p-2">
                    Stock
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground p-2 text-center">
                    Estado
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground p-2 w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.length > 0 ? (
                  promotions.map((promotion) => (
                    <TableRow key={promotion.id} className="text-nowrap">
                      <TableCell className="font-inter py-2 px-2 text-[13px]">
                        {promotion.name}
                      </TableCell>
                      <TableCell className="py-2 px-2 text-[13px] font-inter">
                        <div className="flex gap-2 items-center">
                          <CalendarIcon className="w-4 h-4" />
                          {format(
                            parseISO(promotion.date_start),
                            "dd/MM/yy  HH:mm",
                            { locale: es }
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-2 text-[13px] font-inter">
                        <div className="flex gap-2 items-center">
                          <CalendarIcon className="w-4 h-4" />
                          {format(
                            parseISO(promotion.date_end),
                            "dd/MM/yy  HH:mm",
                            { locale: es }
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-inter py-2 px-2 text-[13px] text-center">
                        <Badge>{promotion.stock_restante}</Badge>
                      </TableCell>

                      <TableCell className="font-inter py-2 px-2 text-[13px] text-center">
                        <Badge
                          className={`${
                            promotion.stock_restante > 0 &&
                            startOfDay(
                              parse(
                                promotion.date_end,
                                "yyyy-MM-dd",
                                new Date()
                              )
                            ) >= startOfDay(new Date())
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {promotion.stock_restante > 0 &&
                          startOfDay(
                            parse(promotion.date_end, "yyyy-MM-dd", new Date())
                          ) >= startOfDay(new Date())
                            ? "Activo"
                            : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-inter py-2 px-2 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-transparent hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48">
                            <DropdownMenuItem
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleClickUpdate(promotion)}
                            >
                              <span className="font-inter">Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleClickDelete(promotion.id)}
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground">
                          No hay promociones disponibles
                          {date
                            ? ` para la fecha seleccionada (${format(
                                date,
                                "dd/MM/yyyy"
                              )})`
                            : ""}
                          {statusFilter
                            ? ` con el estado "${
                                statusFilter === "Activo"
                                  ? "Activo"
                                  : "Inactivo"
                              }"`
                            : ""}
                          {searchInput
                            ? ` con el término "${searchInput}"`
                            : ""}
                          .
                        </p>
                        {(date || searchInput || statusFilter) && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (date) handleClearDateFilter();
                              if (searchInput) setSearchInput("");
                              if (statusFilter) setStatusFilter(undefined);
                            }}
                            className="mt-2"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Limpiar filtros y mostrar todas las promociones
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-6">
              <Pagination
                links={links}
                meta={meta}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
          <Dialog open={isUpdateDialogOpen} modal={false}>
            <DialogContent className="max-w-2xl p-6 ">
              <DialogHeader>
                <DialogTitle className="font-inter">
                  Actualizar Promoción
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <UpdatePromotion
                onClose={handleUpdateClose}
                promotion={promotionSelected}
              />
            </DialogContent>
          </Dialog>

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />
        </div>
      )}
    </Layout>
  );
}
