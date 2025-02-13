import Layout from "@/components/layouts/layout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, MoreVertical, Search } from "lucide-react";
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
import SkeletonTable from "@/components/skeleton-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export default function EventPage() {
  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
    { name: "Eventos", link: "/empresas/eventos" },
    // { name: "Reservas", link: "/eventos/reservas" },
    // { name: "Entradas", link: "/eventos/entradas" },
  ];

  const { companyId } = useComapanyStore();

  const { events, loadEvents, filter, setFilter, loading } = useEventStore();

  // NAVIGATOR
  const navigator = useNavigate();

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    } catch (error) {
      errorToast("Error al eliminar el evento");
    }
  };

  const handleClickUpdate = (event: EventItem) => {
    setEventSelected(event);
    setIsUpdateDialogOpen(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
  };

  const handleSearch = () => {
    loadEvents(1, companyId, dateSelected);
  };

  useEffect(() => {
    if (companyId) loadEvents(1, companyId, dateSelected);
    else navigator("/empresas");
  }, []);

  return (
    <Layout options={options}>
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="flex w-full justify-center items-start">
          <div className="flex flex-col gap-4 w-full justify-between items-center mb-6 px-4 max-w-screen-2xl">
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <div className="w-full flex flex-col">
                <h1 className="text-2xl font-bold font-inter">Eventos</h1>
                <p className="text-gray-500 font-inter text-sm">
                  Gestionar todos los eventos del mes
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full">
                <div className="flex gap-2 flex-col sm:flex-row w-full justify-end">
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal text-sm bg-transparent",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
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
                    <Input
                      placeholder="Busqueda ..."
                      className="sm:w-[300px] font-poopins text-sm"
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
                        Agregar evento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl p-6">
                      <DialogHeader>
                        <DialogTitle className="font-inter">
                          Agregar Evento
                        </DialogTitle>
                      </DialogHeader>
                      <CreateEvent
                        onClose={handleClose}
                        companyId={companyId}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* <div className="w-full mb-4 flex justify-end">
            <Select onValueChange={handleEnvironmentChange} value={selectedEnvironmentId || "all"}>
              <SelectTrigger className="w-[200px] items-center">
                <SelectValue placeholder="Seleccionar Salón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Salones</SelectItem>
                {environments.map((env) => (
                  <SelectItem key={env.id} value={env.id.toString()}>
                    {env.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

            <div className="rounded-lg w-full py-8">
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-inter text-base text-foreground text-center p-2">
                      Fecha
                    </TableHead>
                    <TableHead className="font-inter text-base text-foreground text-center p-2">
                      Nombre del Evento
                    </TableHead>
                    <TableHead className="font-inter text-base text-foreground text-center p-2">
                      Comentario
                    </TableHead>
                    <TableHead className="font-inter text-base text-foreground text-center p-2">
                      Estado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="flex gap-2 justify-start items-center text-sm font-inter py-2 px-2 ">
                        <CalendarIcon className="w-5 h-5" />
                        {format(
                          new Date(event.event_datetime),
                          "dd 'de' MMMM 'del' yyyy 'a las' HH:mm",
                          { locale: es }
                        )}
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-sm">
                        {event.name}
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-sm">
                        {event.comment}
                      </TableCell>
                      <TableCell className="font-inter text-center py-2 px-2 text-sm">
                        <Badge
                          className={`${
                            event.status === "Próximo"
                              ? "text-[#7A37B8] bg-[#7A37B84F] hover:bg-[#7A37B8] hover:text-white dark:bg-violet-950 dark:text-violet-200 dark:hover:bg-violet-900"
                              : "text-[#E84747] bg-[#FFA5A54F] hover:bg-[#FFA5A5] dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-[#742828]"
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-inter er py-2 px-2 text-sm">
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
                            {/* Editar opción */}
                            <DropdownMenuItem
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleClickUpdate(event)}
                            >
                              <span className="font-inter">Editar</span>
                            </DropdownMenuItem>

                            {/* Eliminar opción */}
                            <DropdownMenuItem
                              onClick={() => handleClickDelete(event.id)}
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <span>Eliminar</span>
                            </DropdownMenuItem>

                            {/* Detalles opción con submenú */}
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                                <span>Detalles</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-48">
                                {/* Subopciones dentro de Detalles */}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            modal={false}
          >
            <DialogContent className="max-w-5xl p-6">
              <DialogHeader>
                <DialogTitle className="font-inter">
                  Actualizar Evento
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <UpdateEvent onClose={handleUpdateClose} event={eventSelected} />
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
