"use client"

import Layout from "@/components/layouts/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gift, Loader2, MoreVertical } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import CreateLotteryForm from "./addLottery"
import { useLotteryStore } from "../lib/lottery.store"
import type { Prize } from "../lib/lottery.interface"
import ModalPremios from "./modalPrizes"
import ModalParticipantes from "./ModalParticipants"

export default function LotteryPage() {
  const options = [
    { name: "Empresas", link: "/empresas" },
    { name: "Salones", link: "/empresas/salones" },
    { name: "Mesas/Box", link: "/empresas/mesas" },
    { name: "Eventos", link: "/empresas/eventos" },
    { name: "Sorteos", link: "/empresas/sorteos" },
  ]

  const canCreateLottery = true

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const [isPrizesOpen, setIsPrizesOpen] = useState(false)
  const [selectedRaffleId, setSelectedRaffleId] = useState<number>(0)
  const [selectedRaffleName, setSelectedRaffleName] = useState<string>("")
  const [selectedPrizes, setSelectedPrizes] = useState<Prize[]>([])

  const { raffles, loadRaffles, loading } = useLotteryStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    loadRaffles(1)
  }, [loadRaffles])

  // Active lotteries for the cards at the top
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

  const handleClose = () => {
    setIsAddDialogOpen(false)
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

  // Function to strip HTML tags and render clean text
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  const filteredOptions = options

  return (
    <Layout options={filteredOptions}>
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
              <p className="text-gray-500 text-base font-inter">Gestionar los sorteos del mes</p>
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
                  <CreateLotteryForm onClose={handleClose} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="w-full flex relative flex-col rounded-lg pt-2 h-[39vh] bg-gradient-to-t from-muted via-transparent via-10% overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">Codigo</TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">Nombre</TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">Fecha</TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">Descripción</TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">Premios</TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">
                    Evento asociado
                  </TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center">Estado</TableHead>
                  <TableHead className="font-inter text-base text-foreground p-2 text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {raffles.length > 0 ? (
                  raffles.map((lottery) => (
                    <TableRow key={lottery.id}>
                      <TableCell className="font-inter py-2 px-2 text-sm text-center">{lottery.code_serie}</TableCell>
                      <TableCell className="font-inter py-2 px-2 text-sm text-center">{lottery.lottery_name}</TableCell>
                      <TableCell className="font-inter py-2 px-2 text-sm text-center">
                        {lottery.lottery_date
                          ? format(
                              typeof lottery.lottery_date === "string"
                                ? new Date(lottery.lottery_date)
                                : lottery.lottery_date,
                              "dd/MM/yyyy HH:mm",
                            )
                          : ""}
                      </TableCell>
                      <TableCell className="font-inter py-2 px-2 text-sm text-center max-w-xs">
                        <div className="truncate" title={stripHtmlTags(lottery.lottery_description)}>
                          {stripHtmlTags(lottery.lottery_description)}
                        </div>
                      </TableCell>
                        <TableCell className="font-inter py-2 px-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPrizes(lottery.prizes, lottery.lottery_name)}
                            className="bg-transparent hover:bg-primary/10 hover:text-primary"
                          >
                            <Gift className="h-14 w-14 text-primary" />
                          </Button>
                        </TableCell>
                      <TableCell className="font-inter py-2 px-2 text-sm text-center">{lottery.event_name}</TableCell>
                      <TableCell className="font-inter py-2 px-2 text-sm text-center">
                        <Badge
                          className={`${
                            lottery.status === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          } rounded-full px-3 py-1 font-normal`}
                        >
                          {lottery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-inter py-4 px-4 text-sm">
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
                            <DropdownMenuItem
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleViewParticipants(lottery.id, lottery.lottery_name)}
                            >
                              <span className="font-inter">Participantes</span>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleViewPrizes(lottery.prizes, lottery.lottery_name)}
                            >
                              <span className="font-inter">Premios</span>
                            </DropdownMenuItem> */}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm py-4">
                      No hay sorteos disponibles.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal de Participantes */}
      <ModalParticipantes
        isOpen={isParticipantsOpen}
        onClose={handleCloseParticipants}
        raffleId={selectedRaffleId}
        raffleName={selectedRaffleName}
      />

      {/* Modal de Premios */}
      <ModalPremios
        isOpen={isPrizesOpen}
        onClose={handleClosePrizes}
        prizes={selectedPrizes}
        raffleName={selectedRaffleName}
      />
    </Layout>
  )
}
