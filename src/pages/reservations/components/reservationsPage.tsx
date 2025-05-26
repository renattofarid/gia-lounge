"use client";

// import { Button } from "@/components/ui/button";
import {  Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
import Layout from "@/components/layouts/layout";
import { useReservationStore } from "../lib/reservation.store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useEventStore } from "@/pages/events/lib/event.store";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useComapanyStore } from "@/pages/company/lib/company.store";
import { AutocompleteFilter } from "@/components/AutocompleteFilter";

export default function ReservationsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { events, loadEvents } = useEventStore();
  const { companyId } = useComapanyStore();

  // const [eventId] = useState<string | undefined>(
  //   eventId
  // );

  //STORE
  const { reservations, loadReservations, stats, loading } =
    useReservationStore();

  const options = [
    { name: "Reservas", link: `/eventos/reservas/${eventId}` },
    { name: "Entradas", link: `/eventos/entradas/${eventId}` },
  ];

  const navigate = useNavigate();

  // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilter(e.target.value);
  // };

  // const handleSearch = () => {
  //   loadReservations(1, Number(eventId));
  // };

  // const handleEventChange = (value: string) => {
  //   setSelectedEventId(value === "all" ? undefined : value);
  //   loadReservations(1, value === "all" ? undefined : Number(value));
  // };

  const handleEventChange = (value: string) => {
    if (value === "all") {
      navigate("/eventos/reservas"); // o una ruta general si tienes
    } else {
      navigate(`/eventos/reservas/${value}`);
    }
  };

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
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-screen-xl">
            {statsData.map((stat, index) => (
              <Card key={index} className="p-4 bg-card rounded-3xl ">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <img src="/icono.png" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-inter text-foreground">
                      {stat.label}
                    </span>
                    <span className="text-xl font-inter font-bold">
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
              <h1 className="text-2xl font-bold font-inter">Reservas</h1>
              <p className="text-gray-500 text-base font-inter">
                Gestione las reservas del evento:{" "}
                {(Array.isArray(events) &&
                  events.find((event) => event.id === Number(eventId))?.name) ||
                  "Evento no encontrado"}
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-4 w-full">
              {/* Input de búsqueda */}
              {/* <div className="flex items-center gap-2">
                <Input
                  placeholder="Búsqueda..."
                  className="sm:w-[300px] font-poppins text-sm"
                  value={filter}
                  onChange={handleFilterChange}
                />
                <Button
                  size="icon"
                  className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
                  onClick={handleSearch}
                >
                  <Search className="min-w-4 min-h-4 text-secondary" />
                </Button>
              </div> */}

              {/* Selects y botón de descarga */}
              <div className="flex items-center gap-2 ">
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
            </div>
            <div className="flex items-center gap-2 justify-end">
              {/* <Button
                variant="default"
                className="flex items-center gap-2 font-poppins"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button> */}
            </div>
          </div>

          {/* Reservations Table */}
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Cod.
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Nombre
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Fecha y hora <br />
                  de reserva
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  N° <br />
                  personas
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Mesa
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Box
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  N° mesa <br />o box
                </TableHead>
                <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Estado
                </TableHead>
                {/* <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                  Acciones
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    {reservation.correlative}
                  </TableCell>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    {reservation.name}
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
                    />{" "}
                  </TableCell>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    <Checkbox
                      className="w-6 h-6 border-secondary"
                      checked={reservation.station.type === "BOX"}
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
                    ) : null}
                  </TableCell>
                  {/* <TableCell className="font-inter text-right py-2 px-2 tcxt-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        classN}               </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Layout>
  );
}
