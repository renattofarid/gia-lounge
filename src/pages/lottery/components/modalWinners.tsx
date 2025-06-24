"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Search, Loader2, Save, SaveAll } from "lucide-react"
import type { Prize, ParticipantesItem, PrizesWinner } from "../lib/lottery.interface"
import { assignWinners, getRaffleParticipants, type WinnerAssignmentData } from "../lib/lottery.actions"
import { errorToast, successToast } from "@/lib/core.function"

interface ModalWinnersProps {
  isOpen: boolean
  onClose: () => void
  prizes: Prize[]
  prizesWinners: PrizesWinner[]
  raffleName: string
  raffleId: number
}

export default function ModalWinners({
  isOpen,
  onClose,
  prizes,
  prizesWinners,
  raffleName,
  raffleId,
}: ModalWinnersProps) {
  const [winners, setWinners] = useState<WinnerAssignmentData[]>([])
  const [participants, setParticipants] = useState<ParticipantesItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [savingIndividual, setSavingIndividual] = useState<number | null>(null)

  useEffect(() => {
    if (prizes.length > 0) {
      const initialWinners = prizes.map((prize) => {
        const existingWinner = prizesWinners.find((winner) => winner.prize_name === prize.name)
        return {
          prizeId: prize.id,
          ticketCode: existingWinner?.code_correlative || "",
          winnerName: existingWinner?.winner_name || "",
          participantId: undefined,
        }
      })
      setWinners(initialWinners)
    }
  }, [prizes, prizesWinners])

  useEffect(() => {
    if (isOpen && raffleId) {
      loadParticipants()
    }
  }, [isOpen, raffleId])

  const loadParticipants = async () => {
    setLoadingParticipants(true)
    try {
      const response = await getRaffleParticipants(raffleId)
      setParticipants(response.data)
    } catch (error) {
      console.error("Error loading participants:", error)
      errorToast("Error al cargar los participantes")
    } finally {
      setLoadingParticipants(false)
    }
  }

  const findParticipantByTicketCode = (ticketCode: string): ParticipantesItem | null => {
    const inputCode = ticketCode.trim().toLowerCase()
    if (!inputCode) return null

    return (
      participants.find((participant) =>
        participant.tickets.some((ticket) => ticket.ticket_code_correlative.trim().toLowerCase() === inputCode),
      ) || null
    )
  }

  const handleTicketCodeChange = (prizeIndex: number, ticketCode: string) => {
    const updatedWinners = [...winners]
    updatedWinners[prizeIndex].ticketCode = ticketCode

    const participant = findParticipantByTicketCode(ticketCode)
    if (participant) {
      const fullName =
        `${participant.person.names} ${participant.person.father_surname} ${participant.person.mother_surname}`.trim()
      updatedWinners[prizeIndex].winnerName = fullName
      updatedWinners[prizeIndex].participantId = participant.id
    } else {
      if (!updatedWinners[prizeIndex].winnerName) {
        updatedWinners[prizeIndex].winnerName = ""
      }
      updatedWinners[prizeIndex].participantId = undefined
    }

    setWinners(updatedWinners)
  }

  const handleNameChange = (prizeIndex: number, name: string) => {
    const updatedWinners = [...winners]
    updatedWinners[prizeIndex].winnerName = name
    setWinners(updatedWinners)
  }

  const hasExistingWinner = (prizeName: string): boolean => {
    return prizesWinners.some((winner) => winner.prize_name === prizeName && winner.winner_name)
  }

  const isWinnerValid = (winner: WinnerAssignmentData | undefined): boolean => {
    if (!winner) return false
    return winner.ticketCode.trim() !== "" && winner.winnerName.trim() !== ""
  }

  const isFormValid = () => {
    return winners.every((winner) => isWinnerValid(winner))
  }

  const hasDuplicateTickets = () => {
    const ticketCodes = winners.map((w) => w.ticketCode.trim()).filter((code) => code !== "")
    return ticketCodes.length !== new Set(ticketCodes).size
  }

  const isDuplicateTicketForWinner = (winnerIndex: number): boolean => {
    const currentWinner = winners[winnerIndex]
    const currentTicket = currentWinner?.ticketCode?.trim()
    if (!currentTicket) return false

    return winners.some((w, i) => i !== winnerIndex && w?.ticketCode?.trim() === currentTicket)
  }

  const handleSaveIndividualWinner = async (prizeIndex: number) => {
    const winner = winners[prizeIndex]

    if (!isWinnerValid(winner)) {
      errorToast("Por favor, complete todos los campos requeridos para este premio.")
      return
    }

    if (isDuplicateTicketForWinner(prizeIndex)) {
      errorToast("Este código de ticket ya está asignado a otro premio.")
      return
    }

    setSavingIndividual(prizeIndex)
    try {
      const response = await assignWinners(raffleId, [winner])

      if (response.success) {
        successToast(`Ganador del premio "${prizes[prizeIndex].name}" guardado correctamente`)
        // Actualizar el estado local para reflejar que este ganador ya existe
        const updatedPrizesWinners = [...prizesWinners]
        const existingIndex = updatedPrizesWinners.findIndex((pw) => pw.prize_name === prizes[prizeIndex].name)

        if (existingIndex >= 0) {
          updatedPrizesWinners[existingIndex] = {
            ...updatedPrizesWinners[existingIndex],
            code_correlative: winner.ticketCode,
            winner_name: winner.winnerName,
          }
        } else {
          updatedPrizesWinners.push({
            prize_name: prizes[prizeIndex].name,
            code_correlative: winner.ticketCode,
            winner_name: winner.winnerName,
          })
        }
      } else {
        errorToast(response.message || "Error al asignar ganador")
      }
    } catch (error: any) {
      console.error("Error saving individual winner:", error)
      const errorMessage = error.response?.data?.message || "Error al asignar ganador"
      errorToast(errorMessage)
    } finally {
      setSavingIndividual(null)
    }
  }

  const handleSaveAllWinners = async () => {
    if (!isFormValid()) {
      errorToast("Por favor, complete todos los campos requeridos.")
      return
    }

    if (hasDuplicateTickets()) {
      errorToast("No se pueden asignar códigos de ticket duplicados.")
      return
    }

    setLoading(true)
    try {
      const response = await assignWinners(raffleId, winners)

      if (response.success) {
        successToast("Todos los ganadores asignados correctamente")
        onClose()
      } else {
        errorToast(response.message || "Error al asignar ganadores")
      }
    } catch (error: any) {
      console.error("Error saving winners:", error)
      const errorMessage = error.response?.data?.message || "Error al asignar ganadores"
      errorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setWinners([])
    setParticipants([])
    onClose()
  }

  const getUnsavedWinnersCount = () => {
    return winners.filter((winner, index) => {
      if (!winner || index >= prizes.length) return false
      return isWinnerValid(winner) && !hasExistingWinner(prizes[index].name)
    }).length
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto hiddenScroll">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold font-poppins">Ganadores - {raffleName}</DialogTitle>
        </DialogHeader>

        {loadingParticipants ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {prizes.map((prize, index) => {
              const winner = winners[index] // Puede ser undefined
              const participant = winner?.participantId ? participants.find((p) => p.id === winner.participantId) : null
              const hasWinner = hasExistingWinner(prize.name)
              const isDuplicateTicket = isDuplicateTicketForWinner(index)
              const canSaveIndividual = winner && isWinnerValid(winner) && !isDuplicateTicket && !hasWinner

              return (
                <Card key={prize.id} className="bg-secondary p-4 rounded-xl shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold font-poppins">{prize.name}</h4>
                      {hasWinner && (
                        <p className="text-sm text-green-700 font-poopins flex items-center gap-1">
                          ✓ Sorteo realizado
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white text-sm font-poopins flex items-center justify-center font-normal">
                        {index + 1}
                      </div>
                      {canSaveIndividual && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleSaveIndividualWinner(index)}
                          disabled={savingIndividual === index}
                          className="text-xs px-3 py-2 h-7 font-poopins flex items-center gap-1"
                        >
                          {savingIndividual === index ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1 font-poopins" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              Guardar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`ticket-${prize.id}`} className="text-sm font-poopins">
                        Código ticket ganador
                      </Label>
                      <div className="relative">
                        <Input
                          id={`ticket-${prize.id}`}
                          type="text"
                          disabled={hasWinner}
                          placeholder="Ingrese código del ticket"
                          value={winner?.ticketCode || ""}
                          onChange={(e) => handleTicketCodeChange(index, e.target.value)}
                          className={`pr-10 font-inter ${
                            isDuplicateTicket
                              ? "border-red-500 bg-red-50"
                              : participant
                                ? "border-green-500 bg-green-50"
                                : ""
                          }`}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      {isDuplicateTicket && <p className="text-xs text-red-700 font-inter">⚠ Código duplicado</p>}
                      {participant && <p className="text-xs text-green-600 font-inter">✓ Participante encontrado</p>}
                      {winner?.ticketCode && !participant && !isDuplicateTicket && !hasWinner && (
                        <p className="text-xs text-orange-600 font-inter">⚠ Participante no encontrado</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`name-${prize.id}`} className="text-sm font-poopins">
                        Nombre del ganador
                      </Label>
                      <Input
                        id={`name-${prize.id}`}
                        type="text"
                        disabled={hasWinner}
                        placeholder="Nombre completo"
                        value={winner?.winnerName || ""}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        className={`font-inter text-sm ${
                          participant || hasWinner ? "bg-green-50 border-green-200" : ""
                        }`}
                      />
                      {participant && (
                        <p className="text-sm text-gray-500 font-inter">
                          Documento: {participant.person.number_document}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 font-poopins text-sm border-t">
          <div className="text-sm text-gray-600">
            {getUnsavedWinnersCount() > 0 && <span>{getUnsavedWinnersCount()} ganador(es) sin guardar</span>}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading || savingIndividual !== null}
              className="text-secondary bg-foreground hover:bg-foreground/95"
            >
              Cancelar
            </Button>
            {getUnsavedWinnersCount() > 1 && (
              <Button
                onClick={handleSaveAllWinners}
                disabled={
                  !isFormValid() || loading || hasDuplicateTickets() || loadingParticipants || savingIndividual !== null
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Guardando todos...
                  </>
                ) : (
                  <>
                    <SaveAll className="h-4 w-4 mr-2" />
                    Guardar todos ({getUnsavedWinnersCount()})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
