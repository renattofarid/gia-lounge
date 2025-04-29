"use client";

import Layout from "@/components/layouts/layout";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function LotteryPage() {
  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
    { name: "Eventos", link: "/empresas/eventos" },
    { name: "Sorteos", link: "/empresas/sorteos" },
  ];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Sample lottery data
  const lotteries = [
    {
      id: "001",
      name: "Sorteo 01",
      date: "22-12-2024",
      description: "Pequeña descripción",
      event: "Código o nombre",
      status: "Activo",
    },
    {
      id: "002",
      name: "Sorteo 02",
      date: "22-12-2024",
      description: "Pequeña descripción",
      event: "Código o nombre",
      status: "Cerrado",
    },
  ];

  // Active lotteries for the cards at the top
  const activeLotteries = [
    {
      name: "Sorteo nombre", //Fixed undeclared variable
      date: "23-12-2024",
      status: "SORTEO ACTIVO",
    },
    {
      name: "Sorteo nombre", //Fixed undeclared variable
      date: "30-12-2024",
      status: "SORTEO PRÓXIMO",
    },
  ];

  return (
    <Layout options={options}>
      <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
        <div className="w-full flex justify-center mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {activeLotteries.map((lottery, index) => (
              <Card
                key={index}
                className="p-4 bg-white rounded-3xl shadow-sm max-w-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-16 h-16 ${
                      index === 0 ? "bg-[#DCFAF8]" : "bg-[#DCFAF8]"
                    } rounded-full flex items-center justify-center`}
                  >
                    <img
                      src="/money-icono.png"
                      className="w-8 h-8 object-contain"
                      alt="Lottery icon"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-poopins text-foreground font-bold">
                      {lottery.name}
                    </span>
                    <span className="text-sm font-poopins font-medium">
                      {lottery.date}
                    </span>
                    <span
                      className={`text-xs font-inter ${
                        index === 0 ? "text-[#E84747]" : "text-[#25877F]"
                      }`}
                    >
                      {lottery.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold font-inter">Sorteos</h1>
            <p className="text-gray-500 text-base font-inter">
              Gestionar los sorteos del mes
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-500 hover:bg-violet-600 font-inter">
                Agregar sorteo
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-3xl">
              <AlertDialogHeader>
                <DialogTitle>Agregar Sorteo</DialogTitle>
                <DialogDescription>Crear Sorteo.</DialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Nombre del sorteo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    placeholder="Descripción del sorteo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event">Evento Asociado</Label>
                  <Input id="event" placeholder="Seleccionar evento" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="bg-violet-500 hover:bg-violet-600">
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="dark:bg-card dark:rounded-3xl w-full dark:p-6 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter text-base text-foreground p-2 text-center">
                  Codigo
                </TableHead>
                <TableHead className="font-inter text-base text-foreground p-2 text-center">
                  Nombre
                </TableHead>
                <TableHead className="font-inter text-base text-foreground p-2 text-center">
                  Fecha
                </TableHead>
                <TableHead className="font-inter text-base text-foreground p-2 text-center">
                  Descripción
                </TableHead>
                <TableHead className="font-inter text-base text-foreground p-2 text-center">
                  Evento asociado
                </TableHead>
                <TableHead className="font-inter text-base text-foreground p-2 text-center">
                  Estado
                </TableHead>
                <TableHead className="font-inter text-base text-foreground p-2 text-center"></TableHead>{" "}
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotteries.map((lottery) => (
                <TableRow key={lottery.id} className="border-b">
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    {lottery.id}
                  </TableCell>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    {lottery.name}
                  </TableCell>
                  <TableCell className="font-inter p2-4 px-2 text-sm">
                    {lottery.date}
                  </TableCell>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    {lottery.description}
                  </TableCell>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    {lottery.event}
                  </TableCell>
                  <TableCell className="font-inter py-2 px-2 text-sm">
                    <Badge
                      className={`${
                        lottery.status === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } rounded-full px-3 py-1 font-normal`}
                    >
                      {lottery.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-inter py-4 px-4 text-sm">
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
                          <span className="font-inter">Participantes</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                          <span className="font-inter">Ganadores</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer">
                          <span>Eliminar</span>
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
    </Layout>
  );
}
