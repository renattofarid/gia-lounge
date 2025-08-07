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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../lib/event.store";
import type { EventItem } from "../lib/event.interface";
import CreateEvent from "./addEventPage";
import DeleteDialog from "@/components/delete-dialog";
import { errorToast, successToast } from "@/lib/core.function";
import { deleteEvent } from "../lib/event.actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import UpdateEvent from "./updateEventPage";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
// import { useAuthStore } from "@/pages/auth/lib/auth.store";
// import { useHasPermission } from "@/hooks/useHasPermission";

export default function EventPage() {
  const options = [
    {
      name: "Empresas",
      link: "/empresas",
      permission: {
        name: "Leer",
        type: "Empresa",
        link: "/empresas",
      },
    },
    {
      name: "Salones",
      link: "/empresas/salones",
      permission: {
        name: "Leer",
        type: "Salón",
        link: "/empresas/salones",
      },
    },
    {
      name: "Mesas/Box",
      link: "/empresas/mesas",
      permission: {
        name: "Leer",
        type: "Mesa",
        link: "/empresas/mesas",
      },
    },

    {
      name: "Eventos",
      link: "/empresas/eventos",
      permission: {
        name: "Leer",
        type: "Evento",
        link: "/empresas/eventos",
      },
    },
    {
      name: "Sorteos",
      link: "/empresas/sorteos",
      permission: {
        name: "Leer",
        type: "Lotería",
        link: "/empresas/sorteos",
      },
    },
  ];

  const { companyId } = useComapanyStore();
  // const { permisos } = useAuthStore();

  // const filteredOptions = options.filter((option) =>
  //   permisos.some(
  //     (p) =>
  //       p.name === option.permission.name && p.type === option.permission.type
  //   )
  // );

  const filteredOptions = options;

  // const canCreateEvent = useHasPermission("Crear", "Evento");
  // const canUpdateEvent = useHasPermission("Actualizar", "Evento");
  // const canDeleteEvent = useHasPermission("Eliminar", "Evento");

  const canCreateEvent = true;
  const canUpdateEvent = true;
  const canDeleteEvent = true;

  const { events, loadEvents, loading, meta, links } = useEventStore();

  // NAVIGATOR
  const navigator = useNavigate();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [eventSelected, setEventSelected] = useState({} as EventItem);
  const [idSelected, setIdSelected] = useState(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateSelected, setDateSelected] = useState<string | undefined>(
    undefined
  );

  const handleClose = () => {
    setIsAddDialogOpen(false);
    loadEvents(1, companyId, dateSelected);
  };

  const handleSelectDate = (date?: Date) => {
    if (!date) return;
    setDate(date);
    setDateSelected(format(date, "dd-MM-yyyy"));
    loadEvents(1, companyId, format(date, "yyyy-MM-dd"));
  };

  const handleClearDateFilter = () => {
    setDate(undefined);
    setDateSelected(undefined);
    loadEvents(1, companyId);
  };

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadEvents(1, companyId, dateSelected);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setIdSelected(id);
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(idSelected).then(() => {
        setIsDeleteDialogOpen(false);
        successToast("Evento eliminado correctamente");
        loadEvents(1, companyId, dateSelected);
      });
    } catch (error: any) {
      errorToast("Error al eliminar el evento");
    }
  };

  const handleClickUpdate = (event: EventItem) => {
    setEventSelected(event);
    setIsUpdateDialogOpen(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    loadEvents(page, companyId, dateSelected);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (companyId) loadEvents(1, companyId, dateSelected);
    else navigator("/empresas");
  }, []);

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          <div className="flex w-full justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="w-full sm:w-auto flex flex-col items-start">
              <h1 className="text-2xl font-bold font-inter">Eventos</h1>
              <p className="text-gray-500 font-inter text-sm">
                Gestionar todos los eventos del mes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar..."
                  className="w-full sm:w-[300px] font-poopins text-[13px]"
                  value={search}
                  onChange={handleFilterChange}
                />
                <Button
                  size="icon"
                  className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {canCreateEvent && (
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                  modal={false}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-violet-500 hover:bg-violet-600 font-inter w-full sm:w-auto"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Agregar evento
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <div className="fixed inset-0 z-40 bg-black/50 " />
                    <DialogContent className="max-w-2xl p-6">
                      <DialogHeader>
                        <DialogTitle className="font-inter">
                          Agregar Evento
                        </DialogTitle>
                      </DialogHeader>
                      <CreateEvent
                        onCloseModal={() => setIsAddDialogOpen(false)}
                        onClose={handleClose}
                        companyId={companyId}
                      />
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              )}
            </div>
          </div>

          <div className="w-full mb-4 flex justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal text-sm bg-transparent",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "yyyy-MM-dd", { locale: es })
                  ) : (
                    <span>Seleccionar Fecha</span>
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
                variant="ghost"
                size="icon"
                onClick={handleClearDateFilter}
                title="Limpiar filtro de fecha"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="overflow-auto w-full flex relative flex-col rounded-lg pt-2 h-[39vh] bg-gradient-to-t from-muted via-transparent via-10%">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Nombre del Evento
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Fecha
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Comentario
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Precios
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Estado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} className="text-nowrap">
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        <div className="flex items-center gap-2 justify-start">
                          {event.route && (
                            <img
                              src={event.route}
                              alt={event.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          )}
                          <span className="text-left">{event.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center py-2 px-2 text-[13px] font-inter">
                        <div className="flex gap-2 justify-center items-center">
                          <CalendarIcon className="w-5 h-5" />
                          {format(
                            new Date(event.event_datetime),
                            "dd 'de' MMMM 'del' yyyy 'a las' HH:mm",
                            {
                              locale: es,
                            }
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        {event.comment}
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        <div className="flex flex-row gap-2 items-center justify-center">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-violet-50/50 text-violet-700 border-violet-200 hover:bg-violet-100/50 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50 dark:hover:bg-violet-900/30 font-normal py-0.5"
                            >
                              Mesa S/{event.pricetable}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-emerald-50/50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50 dark:hover:bg-emerald-900/30 font-normal py-0.5"
                            >
                              Box S/ {event.pricebox}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-emerald-50/50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50 dark:hover:bg-emerald-900/30 font-normal py-0.5"
                            >
                              Precio Entrada S/ {event.price_entry}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        <Badge
                          className={`${
                            event.status === "Próximo"
                              ? "text-[#2F8F2F] bg-[#78d8784f] hover:bg-[#5fbf5f] hover:text-white dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-800"
                              : "text-[#E84747] bg-[#FFA5A54F] hover:bg-[#FFA5A5] dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-[#742828]"
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-inter py-2 px-2 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-transparent hover:bg-gray-100 "
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-32">
                            {event.is_daily_event === "0" && (
                              <>
                                {canUpdateEvent && (
                                  <DropdownMenuItem
                                    className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleClickUpdate(event)}
                                  >
                                    <span className="font-inter">Editar</span>
                                  </DropdownMenuItem>
                                )}

                                {canDeleteEvent && (
                                  <DropdownMenuItem
                                    onClick={() => handleClickDelete(event.id)}
                                    className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <span>Eliminar</span>
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}

                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                <span>Detalles</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-48">
                                <DropdownMenuItem
                                  className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    navigator(`/eventos/reservas/${event.id}`)
                                  }
                                >
                                  <span>Reservas</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    navigator(`/eventos/entradas/${event.id}`)
                                  }
                                >
                                  <span>Entradas</span>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground">
                          {search ? (
                            `No se encontró evento con el nombre "${search}".`
                          ) : (
                            <>
                              No hay eventos disponibles
                              {date
                                ? ` para la fecha seleccionada (${format(
                                    date,
                                    "dd/MM/yyyy"
                                  )})`
                                : ""}
                              .
                            </>
                          )}
                        </p>
                        {date && !search && (
                          <Button
                            variant="outline"
                            onClick={handleClearDateFilter}
                            className="mt-2"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Limpiar filtro y mostrar todos los eventos
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 justify-between w-full flex ">
            <Pagination
              links={links}
              meta={meta}
              onPageChange={handlePageChange}
            />
          </div>

          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            modal={true}
          >
            <DialogPortal>
              <DialogContent className="max-w-2xl p-6 ">
                <DialogHeader>
                  <DialogTitle className="font-inter">
                    Actualizar Evento
                  </DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <UpdateEvent
                  onCloseModal={() => setIsUpdateDialogOpen(false)}
                  onClose={handleUpdateClose}
                  event={eventSelected}
                />
              </DialogContent>
            </DialogPortal>
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
