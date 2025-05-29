"use client";

import { useParams } from "react-router-dom";
import { useEntryStore } from "../lib/entry.store";
import { useEffect, useState } from "react";
import Layout from "@/components/layouts/layout";
import {
  // Search,
  // Download,
  // MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
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
// import { useAuthStore } from "@/pages/auth/lib/auth.store";
// import { useHasPermission } from "@/hooks/useHasPermission";

export function EntryPage() {
  const { eventId } = useParams<{ eventId: string }>();
  // const { permisos } = useAuthStore();

  const {
    entries,
    loadEntries,
    // setFilter,
    setStatusPay,
    links,
    meta,
    loading,
  } = useEntryStore();
  const [activeTab, setActiveTab] = useState("todas");
  // const [searchValue, setSearchValue] = useState("");
  const [isTabLoading, setIsTabLoading] = useState(false);

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

  const filteredOptions = options;

  useEffect(() => {
    if (eventId) {
      loadEntries(1, Number.parseInt(eventId));
    }
  }, [eventId, loadEntries]);

  // const handleSearch = (value: string) => {
  //   setSearchValue(value);
  //   setFilter(value);
  //   loadEntries(1, Number.parseInt(eventId || "0"));
  // };

  const handlePageChange = (page: number) => {
    loadEntries(page, Number.parseInt(eventId || "0"));
  };

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    setIsTabLoading(true);

    try {
      if (value === "validas") {
        setStatusPay("Pendiente");
      } else {
        setStatusPay("");
      }

      await loadEntries(1, Number.parseInt(eventId || "0"));
    } finally {
      setIsTabLoading(false);
    }
  };

  const tabs = [
    { value: "todas", label: "Todas las entradas" },
    { value: "validas", label: "Validas entradas" },
    { value: "reporte", label: "Reporte de entradas" },
  ];

  // Filtrar entradas validadas (con estado de pago "Pendiente")
  const validatedEntries = entries.filter(
    (entry) => entry.status_pay === "Pendiente"
  );

  return (
    <Layout options={filteredOptions}>
      {loading && !isTabLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-4 md:px-4">
          <div className="w-full max-w-screen-2xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-inter">Entradas</h1>
                <p className="text-[13px] text-muted-foreground font-inter">
                  Listado de entradas por evento.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center gap-2 w-full">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="flex w-full bg-transparent gap-1 overflow-x-auto transparentScroll overflow-y-hidden py-6 justify-start">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex-1 font-inter text-sm rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-1"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {isTabLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                  </div>
                ) : (
                  <>
                    <TabsContent value="todas">
                      <div className="bg-card rounded-2xl shadow-sm p-2 md:p-6">
                        <div className="flex flex-col gap-4 w-full">
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow className="text-nowrap">
                                <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                  Nombre
                                </TableHead>
                                <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                  Fecha
                                </TableHead>
                                <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                  Estado de pago
                                </TableHead>
                                <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                  Estado de ingreso
                                </TableHead>
                                <TableHead className="py-2 px-1 w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {entries.length === 0 ? (
                                <TableRow className="text-nowrap">
                                  <TableCell
                                    colSpan={5}
                                    className="text-center py-6"
                                  >
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                      <AlertCircle className="h-8 w-8 mb-2" />
                                      <p>No hay entradas disponibles</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                entries.map((entry) => (
                                  <TableRow
                                    key={entry.id}
                                    className="text-nowrap"
                                  >
                                    <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                      {entry.person.names}
                                    </TableCell>
                                    <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                      {new Date(
                                        entry.entry_datetime
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-[13px]
                                          ${
                                            entry.status_pay === "Pendiente"
                                              ? "dark:bg-rose-950 dark:text-rose-200 bg-rose-100 text-rose-700"
                                              : "dark:bg-yellow-950 dark:text-yellow-200 bg-yellow-100 text-yellow-700"
                                          }`}
                                      >
                                        {entry.status_pay}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-[13px]
                                          ${
                                            entry.status_entry === "Ingresado"
                                              ? "dark:bg-green-950 dark:text-green-200 bg-green-100 text-green-700"
                                              : "dark:bg-blue-950 dark:text-blue-200 bg-blue-100 text-blue-700"
                                          }`}
                                      >
                                        {entry.status_entry}
                                      </span>
                                    </TableCell>
                                    {/* <TableCell className="py-2 px-1">
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
                                    </TableCell> */}
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="validas">
                      <div className="bg-card rounded-2xl shadow-sm p-6">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="text-nowrap">
                              <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                Nombre
                              </TableHead>
                              <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                Fecha
                              </TableHead>
                              <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                Estado de pago
                              </TableHead>
                              <TableHead className="font-inter text-[15px] text-center py-2 px-1">
                                Estado de ingreso
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {validatedEntries.length === 0 ? (
                              <TableRow className="text-nowrap">
                                <TableCell
                                  colSpan={4}
                                  className="text-center py-6"
                                >
                                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <AlertCircle className="h-8 w-8 mb-2" />
                                    <p>No hay entradas por validar</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              validatedEntries.map((entry) => (
                                <TableRow key={entry.id} className="text-nowrap">
                                  <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                    {entry.person.names}
                                  </TableCell>
                                  <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                    {new Date(
                                      entry.entry_datetime
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-[13px] ${
                                        entry.status_pay === "Pendiente"
                                          ? "dark:bg-rose-950 dark:text-rose-200 bg-rose-100 text-rose-700"
                                          : "dark:bg-yellow-950 dark:text-yellow-200 bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {entry.status_pay}
                                    </span>
                                  </TableCell>
                                  <TableCell className="py-2 px-1 font-inter text-[13px] text-center">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-[13px] ${
                                        entry.status_entry === "Ingresado"
                                          ? "text-[#2F8F2F] bg-[#78d8784f] dark:bg-green-950 dark:text-green-200"
                                          : "dark:bg-blue-950 dark:text-blue-200 bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {entry.status_entry}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="reporte">
                      <div className="space-y-4">
                        <p className="text-muted-foreground font-poopins">
                          Contenido del reporte de entradas
                        </p>
                      </div>
                    </TabsContent>
                  </>
                )}
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
