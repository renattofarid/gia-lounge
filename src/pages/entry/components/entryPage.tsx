"use client";

import { useParams } from "react-router-dom";
import { useEntryStore } from "../lib/entry.store";
import { useEffect } from "react";
import Layout from "@/components/layouts/layout";
import { Search, Download, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/pages/auth/lib/auth.store";
// import { useHasPermission } from "@/hooks/useHasPermission";

export function EntryPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { permisos } = useAuthStore();

  const {
    entries,
    loadEntries,
    setFilter,
    setStatusPay,
    links,
    meta,
    loading,
  } = useEntryStore();

  const options = [
    {
      name: "Reservas",
      link: `/eventos/reservas/${eventId}`,
      permission: { name: "Leer", type: "Reserva" },
    },
    {
      name: "Entradas",
      link: `/eventos/entradas/${eventId}`,
      permission: { name: "Leer", type: "Entrada" },
    },
  ];

  const filteredOptions = options.filter((option) =>
    permisos.some(
      (p) =>
        p.name === option.permission.name && p.type === option.permission.type
    )
  );

  // const canCreateEntry = useHasPermission("Crear", "Entrada");
  // const canUpdateEntry = useHasPermission("Actualizar", "Entrada");
  // const canDeleteEntry = useHasPermission("Eliminar", "Entrada");

  useEffect(() => {
    if (eventId) {
      loadEntries(1, Number.parseInt(eventId));
    }
  }, [eventId, loadEntries]);

  const handleSearch = (value: string) => {
    setFilter(value);
    loadEntries(1, Number.parseInt(eventId || "0"));
  };

  const handlePageChange = (page: number) => {
    loadEntries(page, Number.parseInt(eventId || "0"));
  };

  const handleStatusPay = (status_pay: string) => {
    setStatusPay(status_pay);
    loadEntries(1, Number.parseInt(eventId || "0"));
  };

  return (
    <Layout options={filteredOptions}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
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
                  className="bg-foreground hover:bg-foreground/90 text-background min-w-9 h-9"
                >
                  <Search className="min-w-4 min-h-4" />
                </Button>
              </div>
            </div>

            <div className="flex sm:flex-col flex-row justify-between items-center gap-2 w-full">
              <Tabs defaultValue="todas" className="w-full">
                <TabsList className="flex w-full bg-transparent border-b gap-1">
                  <TabsTrigger
                    value="todas"
                    className="flex-1 font-poopins text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    onClick={() => handleStatusPay("")}
                  >
                    Todas las entradas
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => handleStatusPay("Pendiente")}
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
                  <div className="bg-card rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col gap-4 w-full">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-inter text-base text-center p-2">
                              Nombre
                            </TableHead>
                            <TableHead className="font-inter text-base text-center p-2">
                              Fecha
                            </TableHead>
                            <TableHead className="font-inter text-base text-center p-2">
                              Estado de pago
                            </TableHead>
                            <TableHead className="font-inter text-base text-center p-2">
                              Estado de ingreso
                            </TableHead>
                            <TableHead className="p-2 w-[100px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading
                            ? Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell className="p-2">
                                    <Skeleton className="h-6 w-24 mx-auto" />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Skeleton className="h-6 w-24 mx-auto" />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Skeleton className="h-6 w-32 mx-auto" />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Skeleton className="h-6 w-32 mx-auto" />
                                  </TableCell>
                                  <TableCell className="p-2">
                                    <Skeleton className="h-6 w-10 mx-auto" />
                                  </TableCell>
                                </TableRow>
                              ))
                            : entries.map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell className="p-2 font-inter text-sm text-center">
                                    {entry.person.names}
                                  </TableCell>
                                  <TableCell className="p-2 font-inter text-sm text-center">
                                    {new Date(
                                      entry.entry_datetime
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="p-2 font-inter text-sm text-center">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm
                                      ${
                                        entry.status_pay === "Pendiente"
                                          ? "dark:bg-rose-950 dark:text-rose-200 bg-rose-100 text-rose-700"
                                          : "dark:bg-yellow-950 dark:text-yellow-200 bg-yellow-100 text-yellow-700"
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
                                          ? "dark:bg-green-950 dark:text-green-200 bg-green-100 text-green-700"
                                          : "dark:bg-blue-950 dark:text-blue-200 bg-blue-100 text-blue-700"
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
                                          <DropdownMenuItem>
                                            Descargar
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
                  </div>
                </TabsContent>

                <TabsContent value="validas">
                  <div className="bg-card rounded-2xl shadow-sm p-6">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-inter text-base text-center p-2">
                            Nombre
                          </TableHead>
                          <TableHead className="font-inter text-base text-center p-2">
                            Fecha
                          </TableHead>
                          <TableHead className="font-inter text-base text-center p-2">
                            Estado de pago
                          </TableHead>
                          <TableHead className="font-inter text-base text-center p-2">
                            Estado de ingreso
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading
                          ? Array.from({ length: 5 }).map((_, index) => (
                              <TableRow key={index}>
                                <TableCell className="p-2">
                                  <Skeleton className="h-6 w-24 mx-auto" />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Skeleton className="h-6 w-24 mx-auto" />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Skeleton className="h-6 w-32 mx-auto" />
                                </TableCell>
                                <TableCell className="p-2">
                                  <Skeleton className="h-6 w-32 mx-auto" />
                                </TableCell>
                              </TableRow>
                            ))
                          : entries
                              .filter(
                                (entry) => entry.status_pay === "Pendiente"
                              )
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
                                          ? "dark:bg-rose-950 dark:text-rose-200 bg-rose-100 text-rose-700"
                                          : "dark:bg-yellow-950 dark:text-yellow-200 bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {entry.status_pay}
                                    </span>
                                  </TableCell>
                                  <TableCell className="p-4 font-inter text-sm text-center">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                                        entry.status_entry === "Ingresado"
                                          ? "dark:bg-green-950 dark:text-green-200 bg-green-100 text-green-700"
                                          : "dark:bg-blue-950 dark:text-blue-200 bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {entry.status_entry}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="reporte">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Contenido del reporte de entradas
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Pagination
                links={links}
                meta={meta}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
