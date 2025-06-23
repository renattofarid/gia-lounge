"use client";

import Layout from "@/components/layouts/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Loader2,
  QrCode,
  BarChart3,
  User,
  Search,
  ChevronLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLotteryTicketStore } from "../lib/ticket.store";
import { format } from "date-fns";
import { useLotteryStore } from "@/pages/lottery/lib/lottery.store";
import CreateTicketForm from "./addTicket";
import { Pagination } from "@/components/pagination";

interface Lottery {
  id: number;
  lottery_name: string;
  code_serie: string;
  lottery_date: string;
  lottery_description: string;
  status: string;
  event_name: string;
}

export default function TicketsPage() {
  const { lotteryId } = useParams();
  const id = Number(lotteryId);
  const { tickets, loadTickets, loading, filter, setFilter, meta, links } =
    useLotteryTicketStore();
  const { raffles, loadRaffles } = useLotteryStore();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [currentLottery, setCurrentLottery] = useState<Lottery | null>(null);

  useEffect(() => {
    if (!isNaN(id)) {
      loadTickets(id, 1);
      loadRaffles(1);
    }
  }, [id, loadTickets, loadRaffles]);

  useEffect(() => {
    if (raffles && Array.isArray(raffles) && raffles.length > 0) {
      const lottery = raffles.find((raffle: any) => raffle.id === id);
      if (lottery) {
        setCurrentLottery({
          ...lottery,
          lottery_date:
            typeof lottery.lottery_date === "string"
              ? lottery.lottery_date
              : lottery.lottery_date.toISOString(),
        });
      } else {
        setCurrentLottery(null);
      }
    } else {
      setCurrentLottery(null);
    }
  }, [raffles, id]);

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

  const handleClose = () => {
    setIsDialogOpen(false);
    setReasonFilter("all");
    setFilter(""); // limpia el texto de búsqueda
    loadTickets(id, 1, true); // tercer parámetro fuerza ignoreFilter = true
  };

  const handlePageChange = (page: number) => {
    loadTickets(id, page);
  };

  const handleSearch = () => {
    loadTickets(id, 1);
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case "admin":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "compra ticket":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "regalo_por_consumo":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Ganador":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Perdedor":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (reasonFilter === "all") return true;
    return ticket.reason === reasonFilter;
  });

  // const lotteryInfo = currentLottery || (tickets.length > 0 ? tickets[0] : null)

  const ticketStats = [
    {
      name: "Total Tickets",
      count: tickets.length,
      status: "TOTAL CREADOS",
    },
    {
      name: "Con Usuario",
      count: tickets.filter((t) => t.user_owner_id !== null).length,
      status: "ASIGNADOS",
    },
  ];

  const canCreateTicket = true;

  return (
    <Layout options={options}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          {/* Header con botón de regreso */}
          <div className="w-full flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex flex-col flex-1">
              <h1 className="text-xl font-bold font-poppins">
                Lista de Tickets del sorteo:{" "}
                {currentLottery?.lottery_name || `#${isNaN(id) ? "N/A" : id}`}
              </h1>
              <p className="text-gray-500 text-base font-inter">
                Gestionar los tickets del sorteo seleccionado.
              </p>
            </div>

            {/* Botón agregar */}
            {canCreateTicket && currentLottery && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-violet-500 hover:bg-violet-600 font-inter"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-poopins">
                      Crear Ticket
                    </DialogTitle>
                  </DialogHeader>
                  <CreateTicketForm
                    onClose={handleClose}
                    lottery={currentLottery}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Cards de estadísticas */}
          <div className="w-full flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {ticketStats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-4 bg-white rounded-3xl shadow-sm max-w-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-16 h-16 ${
                        index === 0 ? "bg-[#DCFAF8]" : "bg-[#E8F4FD]"
                      } rounded-full flex items-center justify-center`}
                    >
                      {index === 0 ? (
                        <BarChart3 className="w-8 h-8 text-[#25877F]" />
                      ) : (
                        <User className="w-8 h-8 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-poppins text-foreground font-bold">
                        {stat.name}
                      </span>
                      <span className="text-2xl font-poppins font-bold text-violet-600">
                        {stat.count}
                      </span>
                      <span
                        className={`text-xs font-inter ${
                          index === 0 ? "text-[#25877F]" : "text-[#2563EB]"
                        }`}
                      >
                        {stat.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Header con filtros */}
          <div className="w-full flex flex-col sm:flex-row justify-end items-end sm:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar tickets..."
                  className="w-[200px] font-inter text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-black"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 text-white font-semibold" />
                </Button>
                <Select value={reasonFilter} onValueChange={setReasonFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="compra ticket">Compra</SelectItem>
                    <SelectItem value="regalo_por_consumo">Regalo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabla de tickets */}
          <div className="w-full flex relative flex-col rounded-lg pt-2 h-[39vh] bg-gradient-to-t from-muted via-transparent via-10% overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Código
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Usuario
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Motivo
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Estado
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Códigos
                  </TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="text-center">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {ticket.code_correlative}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        {ticket.user_owner_name ? (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {ticket.user_owner_name}
                            </span>
                            {/* <span className="text-xs text-muted-foreground">
                              ID: {ticket.user_owner_id}
                            </span> */}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">
                            Sin asignar
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={`rounded-full px-3 py-1 font-normal ${getReasonBadgeColor(
                            ticket.reason
                          )}`}
                        >
                          {ticket.reason.charAt(0).toUpperCase() +
                            ticket.reason.slice(1)}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={`rounded-full px-3 py-1 font-normal ${getStatusBadgeColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        {ticket.code ? (
                          <div className="flex justify-center gap-2">
                            {ticket.code.barcode_path && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  window.open(
                                    ticket.code!.barcode_path,
                                    "_blank"
                                  )
                                }
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <BarChart3 className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            {ticket.code.qrcode_path && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  window.open(
                                    ticket.code!.qrcode_path!,
                                    "_blank"
                                  )
                                }
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <QrCode className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">
                            Sin código
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        {format(
                          new Date(ticket.created_at),
                          "dd-MM-yyyy 'a las' HH:mm"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No hay tickets disponibles para este sorteo.
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
        </div>
      )}
    </Layout>
  );
}
