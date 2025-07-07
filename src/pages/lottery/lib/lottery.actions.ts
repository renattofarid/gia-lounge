import type { AxiosRequestConfig } from "axios"
import type { LotteryCollection, ParticipantesCollection } from "./lottery.interface"
import { api } from "@/lib/config"

export interface getLotteryProps {
  page: number
  name?: string
  eventId?: number
  companyId?: number
}

export const getRaffles = async ({
  page,
  name,
  eventId,
  companyId,
}: getLotteryProps): Promise<LotteryCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      event_id: eventId,
      company_id: companyId,
    },
  }
  const response = await api.get(`/lottery`, config)
  return response.data
}

export const createRaffle = async (data: FormData): Promise<LotteryCollection> => {
  const response = await api.post(`/lottery`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// api ara eidtar 
export const updateRaffle = async (
  raffleId: number,
  data: FormData
): Promise<LotteryCollection> => {
  const response = await api.post(`/lottery/${raffleId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const getRaffleParticipants = async (
  raffleId: number
): Promise<ParticipantesCollection> => {
  const response = await api.get(`/lottery/${raffleId}/participants`)
  return response.data
}

export const deleteLottery = async (id: number) => {
  const response = await api.delete(`/lottery/${id}`)
  return response.data
}



// Ruta para exportar los ganadores a Excel

export const exportLotteryToExcel = async (lotteryId: number): Promise<void> => {
  const response = await api.post(`/lottery/${lotteryId}/export_excel`, null, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  const fileName = `Sorteo_${lotteryId}_tickets.xlsx`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};



// Interfaz actualizada para incluir el ID real del ticket
export interface WinnerAssignmentData {
  prizeId: number
  ticketCode: string
  winnerName: string
  ticketId?: number
}

export interface Assignment {
  prize_id: number
  lottery_ticket_id: number
}

export interface AssignmentsRequest {
  assignments: Assignment[]
}

export interface AssignWinnersResponse {
  success: boolean
  message: string
  data?: any
}

export const assignWinners = async (
  lotteryId: number,
  winnersData: WinnerAssignmentData[]
): Promise<AssignWinnersResponse> => {
  const assignments: Assignment[] = winnersData
    .filter((w) => w.ticketId !== undefined)
    .map((w) => ({
      prize_id: w.prizeId,
      lottery_ticket_id: w.ticketId!,
    }))

  const response = await api.post(`/lottery/${lotteryId}/assignWinners`, { assignments }, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  return response.data
}
