"use client"

import Layout from "@/components/layouts/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gift, Loader2, MoreVertical } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

import CreateLotteryForm from "./addLottery"
import { useLotteryStore } from "../lib/lottery.store"
import type { Prize, LotteryItem } from "../lib/lottery.interface"
import ModalPremios from "./modalPrizes"
import { useComapanyStore } from "@/pages/company/lib/company.store"
import { Card } from "@/components/ui/card"
import DeleteDialog from "@/components/delete-dialog"
import { errorToast, successToast } from "@/lib/core.function"
import { deleteLottery } from "../lib/lottery.actions"
import { Pagination } from "@/components/pagination"
import ModalWinners from "./modalWinners"
import ModalParticipants from "./ModalParticipants"

export default function LotteryPage() {
  const navigate = useNavigate()
  const { companyId } = useComapanyStore()

  const { raffles, loadRaffles, loading, meta, links } = useLotteryStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const [isPrizesOpen, setIsPrizesOpen] = useState(false)
  const [isWinnersOpen, setIsWinnersOpen] = useState(false)
  const [selectedRaffleId, setSelectedRaffleId] = useState<number>(0)
  const [selectedRaffleName, setSelectedRaffleName] = useState<string>("")
  const [selectedPrizes, setSelectedPrizes] = useState<Prize[]>([])
  const [selectedLottery, setSelectedLottery] = useState<LotteryItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [idSelected, setIdSelected] = useState(0)

  useEffect(() => {
    if (!companyId || companyId === 0) {
      navigate("/empresas")
    } else {
      loadRaffles(companyId)
    }
  }, [companyId, loadRaffles, navigate])

  const handlePageChange = (page: number) => {
    loadRaffles(companyId, page)
  }

  const handleClose = () => {
    setIsAddDialogOpen(false)
    loadRaffles(companyId)
  }

  const handleViewParticipants = (raffleId: number, raffleName: string) => {
    setSelectedRaffleId(raffleId)
    setSelectedRaffleName(raffleName)
    setIsParticipantsOpen(true)
  }

  const handleViewPrizes = (prizes: Prize[], raffleName: string) => {
    setSelectedPrizes(prizes)
    setSelectedRaffleName(raffleName)
    setIsPrizesOpen(true)
  }

  const handleViewWinners = (lottery: LotteryItem) => {
    setSelectedLottery(lottery)
    setSelectedRaffleName(lottery.lottery_name)
    setIsWinnersOpen(true)
  }

  const handleCloseParticipants = () => {
    setIsParticipantsOpen(false)
    setSelectedRaffleId(0)
    setSelectedRaffleName("")
  }

  const handleClosePrizes = () => {
    setIsPrizesOpen(false)
    setSelectedPrizes([])
    setSelectedRaffleName("")
  }

  const handleCloseWinners = () => {
    setIsWinnersOpen(false)
    setSelectedLottery(null)
    setSelectedRaffleName("")
    // Reload raffles to get updated winner information
    loadRaffles(companyId)
  }

  const handleClickDelete = (id: number) => {
    setIsDeleteDialogOpen(true)
    setIdSelected(id)
  }

  const handleDelete = async () => {
    try {
      await deleteLottery(idSelected).then(() => {
        setIsDeleteDialogOpen(false)
        successToast("Sorteo eliminado correctamente")
        loadRaffles(companyId)
      })
    } catch (error: any) {
      errorToast("Error al eliminar el sorteo")
    }
  }

  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  const canCreateLottery = true
  const canDeleteLottery = true

  const activeLotteries = [
    {
      name: "Sorteo nombre",
      date: "23-12-2024",
      status: "SORTEO ACTIVO",
    },
    {
      name: "Sorteo nombre",
      date: "30-12-2024",
      status: "SORTEO PRÓXIMO",
    },
  ]

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
  ]

  return (
    <Layout options={options}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full py-6 px-4 max-w-screen-2xl">
          <div className="w-full flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {activeLotteries.map((lottery, index) => (
                <Card key={index} className="p-4 bg-white rounded-3xl shadow-sm max-w-md">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-16 h-16 ${
                        index === 0 ? "bg-[#DCFAF8]" : "bg-[#DCFAF8]"
                      } rounded-full flex items-center justify-center`}
                    >
                      <img src="/money-icono.png" className="w-8 h-8 object-contain" alt="Lottery icon" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-poopins text-foreground font-bold">{lottery.name}</span>
                      <span className="text-sm font-poopins font-medium">{lottery.date}</span>
                      <span className={`text-xs font-inter ${index === 0 ? "text-[#E84747]" : "text-[#25877F]"}`}>
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
              <p className="text-gray-500 text-base font-inter">Gestionar los sorteos de la empresa seleccionada.</p>
            </div>
            {canCreateLottery && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-violet-500 hover:bg-violet-600 font-inter"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Agregar Sorteo
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6 max-w-screen-xl">
                  <DialogHeader>
                    <DialogTitle className="font-inter">Crear Sorteo</DialogTitle>
                  </DialogHeader>
                  <CreateLotteryForm onClose={handleClose} companyId={companyId} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="w-full flex relative flex-col rounded-lg pt-2 h-[39vh] bg-gradient-to-t from-muted via-transparent via-10% overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Código</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Nombre</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Fecha</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Descripción</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Premios</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Evento</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center">Estado</TableHead>
                  <TableHead className="font-inter text-sm text-foreground p-2 text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {raffles.length > 0 ? (
                  raffles.map((lottery) => (
                    <TableRow key={lottery.id}>
                      <TableCell className="text-center">{lottery.code_serie}</TableCell>
                      <TableCell className="text-center">{lottery.lottery_name}</TableCell>
                      <TableCell className="text-center">
                        {lottery.lottery_date ? format(new Date(lottery.lottery_date), "dd/MM/yyyy HH:mm") : ""}
                      </TableCell>
                      <TableCell className="text-center max-w-xs">
                        <div className="truncate" title={stripHtmlTags(lottery.lottery_description)}>
                          {stripHtmlTags(lottery.lottery_description)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPrizes(lottery.prizes, lottery.lottery_name)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Gift className="h-5 w-5 text-primary" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">{lottery.event_name}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`${
                            lottery.status === "Pendiente"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800"
                          } rounded-full px-3 py-1 font-normal`}
                        >
                          {lottery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {/* <DropdownMenuItem>Editar</DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => handleViewParticipants(lottery.id, lottery.lottery_name)}>
                              Participantes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/sorteos/${lottery.id}/tickets`)}>
                              Ver tickets
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewWinners(lottery)}>
                              Ganadores
                            </DropdownMenuItem>
                            {canDeleteLottery && (
                              <DropdownMenuItem onClick={() => handleClickDelete(lottery.id)}>
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No hay sorteos disponibles para esta empresa.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 justify-between w-full flex ">
            <Pagination links={links} meta={meta} onPageChange={handlePageChange} />
          </div>

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />

          <ModalParticipants
            isOpen={isParticipantsOpen}
            onClose={handleCloseParticipants}
            raffleId={selectedRaffleId}
            raffleName={selectedRaffleName}
          />

          <ModalPremios
            isOpen={isPrizesOpen}
            onClose={handleClosePrizes}
            prizes={selectedPrizes}
            raffleName={selectedRaffleName}
          />

          {selectedLottery && (
            <ModalWinners
              isOpen={isWinnersOpen}
              onClose={handleCloseWinners}
              prizes={selectedLottery.prizes}
              prizesWinners={selectedLottery.prizes_winners} // Pasamos los ganadores existentes
              raffleName={selectedRaffleName}
              raffleId={selectedLottery.id}
            />
          )}
        </div>
      )}
    </Layout>
  )
}
