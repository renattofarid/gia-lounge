"use client";

import { useParams } from "react-router-dom";
import { useEntryStore } from "../lib/entry.store";
import { useEffect } from "react";
import Layout from "@/components/layouts/layout";
import { Search, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";

export function EntryPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { entries, loadEntries, setFilter, links, meta } = useEntryStore();

  const options = [
    { name: "Reservas", link: `/eventos/reservas/${eventId}` },
    { name: "Entradas", link: `/eventos/entradas/${eventId}` },
  ];

  useEffect(() => {
    if (eventId) {
      loadEntries(1, Number.parseInt(eventId));
    }
  }, [eventId, loadEntries]);

  const handleSearch = (value: string) => {
    setFilter(value);
    loadEntries(1, Number.parseInt(eventId || "0"));
  };

  return (
    <Layout options={options}>
      <div className="flex flex-col items-center w-full py-6 px-4">
        <div className="w-full max-w-screen-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold font-inter">Entradas</h1>
            <p className="text-sm text-muted-foreground font-inter">
              Listado de entradas por evento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full">
            <div className="flex gap-2">
              <Input
                placeholder="Búsqueda..."
                onChange={(e) => handleSearch(e.target.value)}
                className="sm:w-[300px] font-poopins text-sm"
              />
              <Button
                size="icon"
                className="bg-foreground hover:bg-gray-800 text-secondary min-w-9 h-9"
                // onClick={handleSearch}
              >
                <Search className="min-w-4 min-h-4 text-secondary" />
              </Button>
            </div>
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pendientes">Pendiente</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select> */}
            {/* <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccione evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event1">Evento 1</SelectItem>
                      <SelectItem value="event2">Evento 2</SelectItem>
                    </SelectContent>
                  </Select> */}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full">
            <Tabs defaultValue="todas" className="w-full">
              <TabsList className="flex w-full p-1 bg-transparent border-b gap-1">
                <TabsTrigger
                  value="todas"
                  className="flex-1 font-poopins text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Todas las entradas
                </TabsTrigger>
                <TabsTrigger
                  value="validas"
                  className="flex-1 font-poopins text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Validas entradas
                </TabsTrigger>
                <TabsTrigger
                  value="reporte"
                  className="flex-1 font-poopins text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Reporte de entradas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="todas">
                {/* Table */}
                <div className="rounded-lg pt-2">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-b bg-muted/50">
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Nombre
                        </TableHead>
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Fecha
                        </TableHead>
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Estado de pago
                        </TableHead>
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Estado de ingreso
                        </TableHead>
                        <TableHead className="p-4 w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="p-4 font-inter text-sm text-center">
                            {entry.person.names}
                          </TableCell>
                          <TableCell className="p-4 font-inter text-sm text-center">
                            {new Date(
                              entry.entry_datetime
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="p-4 font-inter text-sm text-center">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-sm
                              ${
                                entry.status_pay === "Pendiente"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {entry.status_pay}
                            </span>
                          </TableCell>
                          <TableCell className="p-4 font-inter text-sm text-center">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-sm
                              ${
                                entry.status_entry === "Ingresado"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {entry.status_entry}
                            </span>
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Descargar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="validas">
                <div className="rounded-lg pt-2">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-b bg-muted/50">
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Nombre
                        </TableHead>
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Fecha
                        </TableHead>
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Estado de pago
                        </TableHead>
                        <TableHead className="font-inter text-sm text-foreground text-center p-2">
                          Estado de ingreso
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status_pay === "Pendiente") // Filtrado
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="p-4 font-inter text-sm text-center">
                              {entry.person.names}
                            </TableCell>
                            <TableCell className="p-4 font-inter text-sm text-center">
                              {new Date(
                                entry.entry_datetime
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="p-4 font-inter text-sm text-center">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                                  entry.status_pay === "Pendiente"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {entry.status_pay}
                              </span>
                            </TableCell>
                            <TableCell className="p-4 font-inter text-sm text-center">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                                  entry.status_entry === "Ingresado"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {entry.status_entry}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    links={links}
                    meta={meta}
                    onPageChange={(page) =>
                      loadEntries(page, Number.parseInt(eventId || "0"))
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="reporte">
                <div className="space-y-4">
                  {/* Add content for report tab */}
                  <p className="text-muted-foreground">
                    Contenido del reporte de entradas
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div></div>
      </div>
    </Layout>
  );
}
