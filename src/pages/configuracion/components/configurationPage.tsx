"use client"

import Layout from "@/components/layouts/layout"
import { useEffect, useState } from "react"
import { useSettingStore } from "../lib/configuration.store"
import { Loader2, MoreVertical } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { Settings } from "../lib/configuration.interface"
import { UpdateSettingModal } from "./updateDialog"

export default function ConfigurationPage() {
  const options = [{ name: "Configuración", link: "/configutacion" }]
  const canUpdateStation = true
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<Settings | null>(null)

  const { setting, loadSettings, loading, links, meta } = useSettingStore()

  useEffect(() => {
    loadSettings(1)
  }, [loadSettings])

  const handlePageChange = (page: number) => {
    loadSettings(page)
  }

  const handleCloseModal = () => {
    setIsUpdateDialogOpen(false)
    setSelectedSetting(null) // Limpiar el setting seleccionado al cerrar el modal
    loadSettings(1) 
    
  }

  return (
    <Layout options={options}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          <div className="flex w-full justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold font-inter">Configuración</h1>
              <p className="text-gray-500 text-base font-inter">Gestión de la configuración de la empresa</p>
            </div>
          </div>

          <div className="w-full flex flex-col rounded-lg pt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">Nombre</TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">Descripcion</TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">Valor</TableHead>
                  <TableHead className="font-inter text-[15px] text-foreground text-center p-2">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {setting.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-inter text-center py-2 px-2 text-[13px]">{item.name}</TableCell>
                    <TableCell className="font-inter text-center py-2 px-2 text-[13px]">{item.description}</TableCell>
                    <TableCell className="font-inter text-center py-2 px-2 text-[13px]">{item.amount}</TableCell>

                    <TableCell className="font-inter text-center py-2 px-2 text-[13px]">
                      {canUpdateStation && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSetting(item)
                                setIsUpdateDialogOpen(true)
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6">
              <Pagination links={links} meta={meta} onPageChange={handlePageChange} />
            </div>
          </div>

          {/* Siempre renderizamos el modal, pero solo está abierto cuando isUpdateDialogOpen es true */}
          {selectedSetting && (
            <UpdateSettingModal station={selectedSetting} open={isUpdateDialogOpen} onClose={handleCloseModal} />
          )}
        </div>
      )}
    </Layout>
  )
}
