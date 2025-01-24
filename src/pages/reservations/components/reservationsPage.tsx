"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Layout from "@/components/layouts/layout"

// Mock data for reservations
const mockReservations = [
  {
    id: 1212,
    name: "Noely Maccof Montestrique",
    date: "22-12-2024",
    people: "06",
    hasMesa: true,
    hasBox: false,
    box: "#01",
    status: "Reservado",
  },
  {
    id: 1213,
    name: "Marilyn Montestrique",
    date: "22-12-2024",
    people: "08",
    hasMesa: false,
    hasBox: true,
    box: "#01",
    status: "Reservado",
  },
]

// Mock stats data
const statsData = [
  { label: "Mesas ocupadas", value: "80" },
  { label: "Mesas reservadas", value: "60" },
  { label: "Mesas disponibles", value: "20" },
  { label: "Disponibilidad", value: "50" },
]

export default function ReservationsPage() {
  const options = [
    { name: "Reservas", link: "/eventos/reservas" },
    { name: "Entradas", link: "/eventos/entradas" },
  ]
  return (
    <Layout options={options}>
      <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-screen-xl">
          {statsData.map((stat, index) => (
            <Card key={index} className="p-4 bg-white rounded-3xl ">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <img src="/icono.png" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-inter text-gray-900">{stat.label}</span>
                  <span className="text-xl font-inter font-bold">{stat.value}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold font-inter">Reservas</h1>
            <p className="text-gray-500 text-base font-inter">Gestione las reservas por evento.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Búsqueda por nombre..."
                className="sm:w-[300px] font-poppins text-sm"
                // value={filter}
                // onChange={(e) => setFilter(e.target.value)}
              />
              <Button size="icon" className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9">
                <Search className="min-w-4 min-h-4 text-secondary" />
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-violet-500 hover:bg-violet-600 font-inter">Agregar reserva</Button>
              </DialogTrigger>
              <DialogContent className="p-6 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Nueva Reserva</DialogTitle>
                  <DialogDescription>Complete los datos para crear una nueva reserva.</DialogDescription>
                </DialogHeader>
                {/* Add reservation form component here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Reservations Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-inter text-base text-foreground p-2">Cod.</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">Nombre</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">Fecha y hora de reserva</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">N° personas</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">Mesa</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">Box</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">N° mesa & box</TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">Estado</TableHead>
              <TableHead className="font-inter text-base text-foreground text-right p-2">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-inter py-2 px-2 text-sm">{reservation.id}</TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">{reservation.name}</TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">{reservation.date}</TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">{reservation.people}</TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" checked={reservation.hasMesa} readOnly />
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" checked={reservation.hasBox} readOnly />
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">{reservation.box}</TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  <Badge className="text-[#FC6C28] bg-[#FFC8AE8F] hover:bg-[#FFC8AE]">{reservation.status}</Badge>
                </TableCell>
                <TableCell className="font-inter text-right py-2 px-2 text-sm">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="bg-transparent hover:bg-gray-100">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-transparent hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                          <span className="font-inter">Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                          <span className="font-inter">Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

