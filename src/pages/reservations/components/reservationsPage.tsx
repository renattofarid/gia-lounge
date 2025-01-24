"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { MoreVertical, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Layout from "@/components/layouts/layout";

// Mock data for reservations
const mockReservations = [
  {
    id: 1212,
    name: "Maria Mendoza",
    date: "23-12-2024",
    tableNumber: "08",
    box: "001",
    status: "Reservado",
  },
  {
    id: 1213,
    name: "Mario Rodriguez",
    date: "23-12-2024",
    tableNumber: "09",
    box: "001",
    status: "Reservado",
  },
];

// Mock stats data
const statsData = [
  { label: "Mesas ocupadas", value: "80" },
  { label: "Mesas reservadas", value: "60" },
  { label: "Mesas disponibles", value: "20" },
  { label: "Disponibilidad", value: "50" },
];

export default function ReservationsPage() {
  const [filter, setFilter] = useState("");

  const filteredReservations = mockReservations.filter((reservation) =>
    reservation.name.toLowerCase().includes(filter.toLowerCase())
  );

  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
    { name: "Reservas", link: "empresas/reservas" },
  ];
  return (
    <Layout options={options}>
      <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
        {/* Stats Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-screen-xl">
          {statsData.map((stat, index) => (
            <Card key={index} className="p-4 bg-white/30 border-none rounded-2xl">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-20 h-20 relative">
                    <img src="/icono.png" className="object-contain" />
                  </div>
                  <span className="text-lg font-poppins text-black">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-poppins font-bold text-black">
                    {stat.value}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold font-inter">Reservas</h1>
            <p className="text-gray-500 text-base font-inter">
              Gestione las reservas del establecimiento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Búsqueda por nombre..."
                className="sm:w-[300px] font-poppins text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Button
                size="icon"
                className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
              >
                <Search className="min-w-4 min-h-4 text-secondary" />
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                  Nueva Reserva
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Nueva Reserva</DialogTitle>
                  <DialogDescription>
                    Complete los datos para crear una nueva reserva.
                  </DialogDescription>
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
              <TableHead className="font-inter text-base text-foreground p-2">
                Cod.
              </TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">
                Nombre
              </TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">
                Fecha y hora de reserva
              </TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">
                N° mesa
              </TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">
                Box
              </TableHead>
              <TableHead className="font-inter text-base text-foreground p-2">
                Estado
              </TableHead>
              <TableHead className="font-inter text-base text-foreground text-center p-2">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  {reservation.id}
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  {reservation.name}
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  {reservation.date}
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  {reservation.tableNumber}
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  {reservation.box}
                </TableCell>
                <TableCell className="font-inter py-2 px-2 text-sm">
                  <Badge
                    className={
                      reservation.status === "Reservado"
                        ? "text-[#FC6C28] bg-[#FFC8AE8F] hover:bg-[#FFC8AE]"
                        : "text-[#96C451] bg-[#E5FFBD99] hover:bg-[#E5FFBD]"
                    }
                  >
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-inter text-center py-2 px-2 text-sm">
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
                      <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                        <span className="font-inter">Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                        <span className="font-inter">Eliminar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                        <span className="font-inter">Descargar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
