"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import { ReservationDetails } from "./detailReserva";
import CreateStation from "./addStation";
import UpdateStation from "./updateStation";
import { AutocompleteFilter } from "@/components/AutocompleteFilter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Hash,
  MoreVertical,
  Loader2,
  Search,
  CalendarIcon,
  X,
} from "lucide-react";
import { useStationStore } from "../lib/station.store";
import { useEnvironmentStore } from "@/pages/environment/lib/environment.store";
// import { useAuthStore } from "@/pages/auth/lib/auth.store"
// import { useHasPermission } from "@/hooks/useHasPermission"
import { deleteStation } from "../lib/station.actions";
import { errorToast, successToast } from "@/lib/core.function";
import type { StationItem } from "../lib/station.interface";
import DeleteDialog from "@/components/delete-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { useEventStore } from "@/pages/events/lib/event.store";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StationPage() {
  const navigator = useNavigate();
  const { environmentId, setEnvironmentId, environments } =
    useEnvironmentStore();
  const { stations, loadStations, loading, links, meta } = useStationStore();
  const { events, loadEvents } = useEventStore();
  const { companyId } = useComapanyStore();

  // const { permisos } = useAuthStore()

  const [stationUpdate, setStationUpdate] = useState<StationItem>(
    {} as StationItem
  );
  const [idDeleteSelected, setIdDeleteSelected] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isShowReservationDialogOpen, setIsShowReservationDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationItem | null>(
    null
  );
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateSelected, setDateSelected] = useState<string | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");
  const [statusFilter] = useState("Todos");
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(
    undefined
  );

  // const canCreateStation = useHasPermission("Crear", "Mesa")
  // const canUpdateStation = useHasPermission("Actualizar", "Mesa")
  // const canDeleteStation = useHasPermission("Eliminar", "Mesa")

  const canCreateStation = true;
  const canUpdateStation = true;
  const canDeleteStation = true;

  useEffect(() => {
    loadEvents(1, companyId, undefined, 0);

    if (environmentId) {
      loadStations(1, environmentId, dateSelected, selectedEventId);
    } else {
      navigator("/empresas/salones");
    }
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelectDate = (date?: Date) => {
    if (!date) return;
    setDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    setDateSelected(formattedDate);
    loadStations(1, environmentId, formattedDate, selectedEventId);
  };

  const handleClearDateFilter = () => {
    setDate(undefined);
    setDateSelected(undefined);
    loadStations(1, environmentId, undefined, selectedEventId);
  };

  const handleEventChange = (value: string) => {
    setSelectedEventId(value === "all" ? undefined : value);
    loadStations(
      1,
      environmentId,
      dateSelected,
      value === "all" ? undefined : value
    );
  };

  const filteredStations = stations.filter((station) => {
    const matchesName = station.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || station.status === statusFilter;
    return matchesName && matchesStatus;
  });

  // const handlePageChange = (page: number) => {
  //   loadStations(page, environmentId, dateSelected, selectedEventId)
  // }

  const handlePageChange = (page: number) => {
    loadStations(
      page,
      environmentId && environmentId !== 0 ? environmentId : undefined,
      dateSelected,
      selectedEventId
    );
  };

  const handleEnvironmentChange = (value: string) => {
    if (value === "all") {
      setEnvironmentId(undefined);
      loadStations(1, undefined, dateSelected, selectedEventId);
    } else {
      setEnvironmentId(Number(value));
      loadStations(1, Number(value), dateSelected, selectedEventId);
    }
  };

  const handleClickUpdate = (station: StationItem) => {
    setStationUpdate(station);
    setIsUpdateDialogOpen(true);
  };

  const handleClickDelete = (id: number) => {
    setIdDeleteSelected(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteStation(idDeleteSelected);
      loadStations(1, environmentId, dateSelected, selectedEventId);
      successToast("Mesa eliminada correctamente");
      setIsDeleteDialogOpen(false);
    } catch {
      errorToast("Error al eliminar la mesa");
    }
  };

  const handleCloseCreate = () => {
    setIsDialogOpen(false);
    loadStations(1, environmentId, dateSelected, selectedEventId);
  };

  const handleCloseUpdate = () => {
    setIsUpdateDialogOpen(false);
    loadStations(1, environmentId, dateSelected, selectedEventId);
  };

  const handleShowDetails = (station: StationItem) => {
    setSelectedStation(station);
    setIsShowReservationDialogOpen(true);
  };

  const handleCloseReservationDetails = () => {
    setSelectedStation(null);
    setIsShowReservationDialogOpen(false);
  };

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
  ];

  // const filteredOptions = options.filter((option) =>
  //   permisos.some(
  //     (p) =>
  //       p.name === option.permission.name && p.type === option.permission.type
  //   )
  // )

  const filteredOptions = options;

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-4 px-4 max-w-screen-2xl">
          {/* Header */}
          <div className="flex w-full justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="w-full sm:w-auto flex flex-col items-start">
              <h1 className="text-2xl font-bold font-inter">Mesas</h1>
              <p className="text-gray-500 text-base font-inter">
                Gestione las mesas de la empresa seleccionada.
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

              {canCreateStation && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-violet-500 hover:bg-violet-600 font-inter w-full sm:w-auto">
                      Agregar mesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-6 max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Agregar Mesa</DialogTitle>
                      <DialogDescription>
                        Gestione las mesas de la empresa seleccionada.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateStation
                      environmentId={environmentId}
                      onClose={handleCloseCreate}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="w-full flex flex-col sm:flex-row justify-end gap-2 mb-6">
            {" "}
            {/* Filtro de Evento */}
            <div className="w-full sm:w-auto">
              <AutocompleteFilter
                list={events}
                label="name"
                handleSelect={handleEventChange}
                id="id"
                condition={!selectedEventId}
                active={
                  selectedEventId
                    ? events.find(
                        (e) => e.id.toString() === selectedEventId.toString()
                      )?.name || "Evento seleccionado"
                    : "Seleccionar evento"
                }
                placeholder="Buscar evento..."
              />
            </div>
            {/* Filtro de Salón */}
            <div className="w-full sm:w-auto">
              <Select
                onValueChange={handleEnvironmentChange}
                value={environmentId ? environmentId.toString() : "all"}
              >
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Seleccionar salón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Ver todos</SelectItem>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id.toString()}>
                      {`${env.name} - ${env.company.business_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto flex gap-2">
              {/* Filtro de Fecha */}
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
                      format(date, "dd/MM/yyyy", { locale: es })
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
          </div>

          {/* Table */}
          <ScrollArea className="w-full flex relative flex-col rounded-lg pt-2 h-[39vh] bg-gradient-to-t from-muted via-transparent via-10%">
                        <div className="w-full overflow-x-auto pb-2">

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Nombre
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Tipo
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Fecha de reserva
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Estado
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Detalles
                  </TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStations.length > 0 ? (
                  filteredStations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell className="font-inter text-center gap-2">
                        <div className="flex items-center">
                          <Hash className="w-3 h-3" />
                          {station.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        <Badge>{station.type}</Badge>
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        {station.date_reservation ?? "No hay fecha de reserva"}
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        <Badge className={getStatusClass(station.status)}>
                          {station.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                        <div className="flex flex-row gap-2 items-center justify-center">
                          <div className="flex items-center gap-2 font-inter text-[13px]">
                            <Badge
                              variant="outline"
                              className="bg-violet-50/50 text-violet-700 border-violet-200 hover:bg-violet-100/50 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50 dark:hover:bg-violet-900/30 font-normal py-0.5"
                            >
                              Precio S/ {station.price}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-gray-50/50 text-gray-700 border-gray-200 hover:bg-gray-100/50 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/50 dark:hover:bg-gray-900/30 font-normal py-0.5"
                            >
                              Orden: {station.sort ?? 0}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {canUpdateStation && (
                              <DropdownMenuItem
                                onClick={() => handleClickUpdate(station)}
                              >
                                Actualizar
                              </DropdownMenuItem>
                            )}
                            {canDeleteStation && (
                              <DropdownMenuItem
                                onClick={() => handleClickDelete(station.id)}
                              >
                                Eliminar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleShowDetails(station)}
                            >
                              Detalles
                            </DropdownMenuItem>
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
                          {dateSelected
                            ? "No existe ninguna reservación para esa mesa en la fecha seleccionada"
                            : "No hay mesas disponibles"}
                          {selectedEventId
                            ? " para el evento seleccionado"
                            : ""}
                          {environmentId ? " en el salón seleccionado" : ""}
                          {search ? ` con el término "${search}"` : ""}.
                        </p>
                        {(dateSelected || selectedEventId || search) && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (dateSelected) handleClearDateFilter();
                              if (selectedEventId)
                                setSelectedEventId(undefined);
                              if (search) setSearch("");
                              loadStations(1, environmentId);
                            }}
                            className="mt-2"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Limpiar filtros y mostrar todas las mesas
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          </ScrollArea>

          <div className="mt-4 justify-between w-full flex ">
            <Pagination
              links={links}
              meta={meta}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Update Dialog */}
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent className="p-6 max-w-3xl">
              <DialogHeader>
                <DialogTitle>Actualizar Mesa</DialogTitle>
              </DialogHeader>
              <UpdateStation
                environmentId={environmentId}
                onClose={handleCloseUpdate}
                station={stationUpdate}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />

          {/* Reservation Details Dialog */}
          <Dialog
            open={isShowReservationDialogOpen}
            onOpenChange={setIsShowReservationDialogOpen}
          >
            <DialogContent className="p-6 max-w-5xl">
              <DialogHeader>
                <DialogTitle>Detalle de la Reserva</DialogTitle>
                <DialogDescription>
                  {selectedStation && `Mesa: ${selectedStation.name}`}
                </DialogDescription>
              </DialogHeader>
              {selectedStation && (
                <ReservationDetails
                  station={selectedStation}
                  onClose={handleCloseReservationDetails}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Layout>
  );
}

// Helper: color para estados
function getStatusClass(status: string) {
  switch (status) {
    case "Reservado":
      return "text-[#FC6C28] bg-[#FFC8AE8F] hover:bg-[#FFC8AE] dark:text-[#FF8A50] dark:bg-[#5A1E0E] dark:hover:bg-[#7A2F1A]";
    case "Disponible":
      return "text-[#2F8F2F] bg-[#78d8784f] hover:bg-[#5fbf5f] hover:text-white dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-800";
    default:
      return "text-[#E84747] bg-[#FFA5A54F] hover:bg-[#FF8A8A] dark:text-[#FF6B6B] dark:bg-[#5A1E1E] dark:hover:bg-[#7A2F2F]";
  }
}
