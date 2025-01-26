import Layout from "@/components/layouts/layout"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MoreVertical, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useEventStore } from "../lib/event.store"
import type { EventItem } from "../lib/event.interface"
import CreateEvent from "./addEventPage"
import DeleteDialog from "@/components/delete-dialog"
import { errorToast, successToast } from "@/lib/core.function"
import { deleteEvent } from "../lib/event.actions"
import UpdateEventPage from "./updateEventPage"

export default function EventPage() {
  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
    { name: "Eventos", link: "/empresas/eventos" },
    // { name: "Reservas", link: "/eventos/reservas" },
    // { name: "Entradas", link: "/eventos/entradas" },
  ]

  // STORE
  const { events, loadEvents, filter, setFilter } = useEventStore()

  // NAVIGATOR
  const navigator = useNavigate()

  // STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [eventSelected, setEventSelected] = useState({} as EventItem)
  const [idSelected, setIdSelected] = useState(0)

  const handleClose = () => {
    setIsAddDialogOpen(false)
    loadEvents(1)
  }

  const handleUpdateClose = () => {
    setIsUpdateDialogOpen(false);
    loadEvents(1);
  };

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true)
    setIdSelected(id)
  }

  const handleDelete = async () => {
    try {
      await deleteEvent(idSelected).then(() => {
        setIsDeleteDialogOpen(false)
        successToast("Evento eliminado correctamente")
        loadEvents(1)
      })
    } catch (error) {
      errorToast("Error al eliminar el evento")
    }
  }

  const handleClickUpdate = (event: EventItem) => {
    setEventSelected(event);
    setIsUpdateDialogOpen(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }

  const handleSearch = () => {
    loadEvents(1)
  }

  useEffect(() => {
    loadEvents(1)
  }, [loadEvents])

  return (
    <Layout options={options}>
      <div className="flex w-full justify-center items-start">
        <div className="flex flex-col gap-4 w-full justify-between items-center mb-6 px-4 max-w-screen-2xl">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <div className="w-full flex flex-col">
              <h1 className="text-2xl font-bold font-inter">Eventos</h1>
              <p className="text-gray-500 font-inter text-sm">Gestionar todos los eventos del mes</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full">
              <div className="flex gap-2 flex-col sm:flex-row w-full justify-end">
                <div className="flex gap-2">
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
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-violet-500 hover:bg-violet-600 font-inter"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Agregar evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-inter">Agregar Evento</DialogTitle>
                    </DialogHeader>
                    <CreateEvent onClose={handleClose} />
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

          <div className="rounded-lg w-full">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">Fecha</TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">
                    Nombre del Evento
                  </TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">Comentario</TableHead>
                  <TableHead className="font-inter text-base text-foreground text-center p-2">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <div className="flex gap-2 justify-start items-center text-sm font-inter py-2 px-2">
                      <Calendar className="w-5 h-5" /> {event.event_datetime}
                    </div>
                    <TableCell className="font-inter text-center py-2 px-2 text-sm">{event.name}</TableCell>
                    <TableCell className="font-inter text-center py-2 px-2 text-sm">{event.comment}</TableCell>
                    <TableCell className="font-inter text-center py-2 px-2 text-sm">
                      <Badge
                        className={`${
                          event.status === "Proximó"
                            ? "text-[#E84747] bg-[#FFA5A54F] hover:bg-[#FFA5A5]"
                            : "text-[#7A37B8] bg-[#7A37B84F] hover:bg-[#7A37B8] hover:text-white"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-inter er py-2 px-2 text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="bg-transparent hover:bg-gray-100">
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

                          {/* Elimar */}
                          <DropdownMenuItem
                            onClick={() => handleClickDelete(event.id)}
                            className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <span>Eliminar</span>
                          </DropdownMenuItem>

                          {/* Detalles opción */}
                          <DropdownMenuItem
                            className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigator(`/eventos/reservas/${event.id}`)}
                          >
                            <span>Detalles</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="max-w-5xl p-6">
            <DialogHeader>
              <DialogTitle className="font-inter">Actualizar Evento</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <UpdateEventPage onClose={handleUpdateClose} event={eventSelected} />
          </DialogContent>
        </Dialog>

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </div>
    </Layout>
  )
}

