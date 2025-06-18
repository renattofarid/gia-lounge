"use client";

import { Download, Loader2, Search, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layouts/layout";
import { useReservationStore } from "../lib/reservation.store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/pages/events/lib/event.store";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { AutocompleteFilter } from "@/components/AutocompleteFilter";
import { Button } from "@/components/ui/button";
import type { ReservationItem } from "../lib/reservation.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { errorToast, successToast } from "@/lib/core.function";

export default function ReservationsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, loadEvents } = useEventStore();
  const { companyId } = useComapanyStore();

  // Estados para filtros
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredReservations, setFilteredReservations] = useState<
    ReservationItem[]
  >([]);

  //STORE
  const { reservations, loadReservations, stats, loading } =
    useReservationStore();

  const options = [
    { name: "Reservas", link: `/eventos/reservas/${eventId}` },
    { name: "Entradas", link: `/eventos/entradas/${eventId}` },
  ];

  const navigate = useNavigate();

  const handleEventChange = (value: string) => {
    if (value === "all") {
      navigate("/eventos/reservas");
    } else {
      navigate(`/eventos/reservas/${value}`);
    }
  };

  const handleDownloadQR = (reservation: ReservationItem) => {
    if (!reservation.code?.qrcode_path) {
      errorToast("No hay código QR disponible para esta reserva");
      return;
    }

    const link = document.createElement("a");
    link.href = reservation.code.qrcode_path;
    link.setAttribute("download", ""); // Fuerza descarga sin importar el nombre
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    successToast("QR descargado correctamente");
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...reservations];

    // Filtro de búsqueda - solo por correlativo o nombre
    if (searchFilter.trim()) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.person.names
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) ||
          reservation.correlative
            .toLowerCase()
            .includes(searchFilter.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
    }

    // Filtro por fecha
    if (dateFilter) {
      filtered = filtered.filter((reservation) => {
        const reservationDate = format(
          new Date(reservation.reservation_datetime),
          "yyyy-MM-dd"
        );
        return reservationDate === dateFilter;
      });
    }

    setFilteredReservations(filtered);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [reservations, searchFilter, statusFilter, dateFilter]);

  useEffect(() => {
    loadEvents(1, companyId, undefined, 0);
    loadReservations(1, eventId ? Number(eventId) : undefined);
  }, [companyId, eventId, loadEvents, loadReservations]);

  const statsData = [
    { label: "Total Reservas", value: stats.totalReservas },
    { label: "Reservas Mesa", value: stats.reservasMesa },
    { label: "Reservas Box", value: stats.reservasBox },
    { label: "Mesas Libres", value: stats.mesasLibres },
  ];

  return (
    <Layout options={options}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-2 md:px-4 max-w-screen-2xl">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4 mb-8 max-w-screen-xl">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="p-2 md:p-4 bg-card rounded-xl md:rounded-3xl"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="size-6 md:size-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <img
                      src="/icono.png"
                      className="w-4 h-4 md:w-6 md:h-6 object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-inter text-foreground">
                      {stat.label}
                    </span>
                    <span className="text-sm md:text-xl font-inter font-bold">
                      {stat.value}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Header Section */}
          <div className="w-full flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-inter">
                Reservas
              </h1>
              <p className="text-gray-500 text-sm md:text-base font-inter">
                Gestione las reservas del evento:{" "}
                {(Array.isArray(events) &&
                  events.find((event) => event.id === Number(eventId))?.name) ||
                  "Evento no encontrado"}
                .
              </p>
            </div>

            {/* Filtros - Diseño compacto */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
              {/* Búsqueda */}
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por correlativo o nombre..."
                  className="pl-10 font-poppins text-sm"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>

              {/* Filtros agrupados */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Filtro por estado */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] font-poppins text-sm">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Pagado">Pagado</SelectItem>
                    <SelectItem value="Caducado">Caducado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>

                {/* Fecha */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[180px] justify-start text-left font-normal text-sm font-poppins",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFilter
                        ? format(new Date(dateFilter), "dd/MM/yyyy")
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter ? new Date(dateFilter) : undefined}
                      onSelect={(date) => {
                        setDateFilter(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Evento */}
                <div className="w-full sm:w-[200px]">
                  <AutocompleteFilter
                    list={events}
                    label="name"
                    handleSelect={handleEventChange}
                    id="id"
                    condition={!eventId}
                    active={
                      eventId
                        ? events.find(
                            (e) => e.id.toString() === eventId.toString()
                          )?.name || "Evento seleccionado"
                        : "Seleccionar evento"
                    }
                    placeholder="Buscar evento..."
                  />
                </div>

                {/* Botón limpiar */}
                {(searchFilter || statusFilter !== "all" || dateFilter) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setSearchFilter("");
                      setStatusFilter("all");
                      setDateFilter("");
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Reservations Table - Desktop */}
          <div className="hidden md:block w-full overflow-x-auto">
            <Table>
              <TableHeader className="text-nowrap">
                <TableRow>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Código
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Nombre
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Fecha y Hora de reserva
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    N° personas
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Mesa
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Box
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    N° mesa o box
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Estado
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id} className="text-nowrap">
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      {reservation.correlative}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      {reservation.person.names +
                        " " +
                        reservation.person.father_surname +
                        " " +
                        reservation.person.mother_surname}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      {format(
                        new Date(reservation.reservation_datetime),
                        "dd-MM-yyy 'a las' HH:mm"
                      )}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      {reservation.nroPeople}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      <Checkbox
                        className="w-6 h-6 border-secondary"
                        checked={reservation.station.type === "MESA"}
                        disabled
                      />
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      <Checkbox
                        className="w-6 h-6 border-secondary"
                        checked={reservation.station.type === "BOX"}
                        disabled
                      />
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      {reservation.station.name}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      {reservation.status === "Pagado" ? (
                        <Badge className="text-green-700 bg-green-100 hover:bg-green-200 rounded-full dark:text-green-300 dark:bg-green-800 dark:hover:bg-green-700">
                          Pagado
                        </Badge>
                      ) : reservation.status === "Caducado" ? (
                        <Badge className="text-red-700 bg-red-100 hover:bg-red-200 rounded-full dark:text-red-300 dark:bg-red-800 dark:hover:bg-red-700">
                          Caducado
                        </Badge>
                      ) : (
                        <Badge className="text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full dark:text-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-700">
                          {reservation.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-inter py-2 px-2 text-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadQR(reservation)}
                        // disabled={!reservation.code?.qrcode_path}
                        title={
                          reservation.code?.qrcode_path
                            ? "Descargar QR"
                            : "QR no disponible"
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Reservations Cards - Mobile */}
          <div className="md:hidden w-full space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <div className="flex flex-col space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {reservation.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        #{reservation.correlative}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reservation.status === "Pagado" ? (
                        <Badge className="text-green-700 bg-green-100 rounded-full text-xs">
                          Pagado
                        </Badge>
                      ) : reservation.status === "Caducado" ? (
                        <Badge className="text-red-700 bg-red-100 rounded-full text-xs">
                          Caducado
                        </Badge>
                      ) : (
                        <Badge className="text-yellow-700 bg-yellow-100 rounded-full text-xs">
                          {reservation.status}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownloadQR(reservation)}
                        disabled={!reservation.code?.qrcode_path}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Fecha:</span>
                      <p className="font-medium">
                        {format(
                          new Date(reservation.reservation_datetime),
                          "dd-MM-yyy"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Hora:</span>
                      <p className="font-medium">
                        {format(
                          new Date(reservation.reservation_datetime),
                          "HH:mm"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Personas:</span>
                      <p className="font-medium">{reservation.nroPeople}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">{reservation.station.type}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Mesa/Box:</span>
                      <p className="font-medium">{reservation.station.name}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* No results message */}
          {filteredReservations.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No se encontraron reservas con los filtros aplicados.
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
