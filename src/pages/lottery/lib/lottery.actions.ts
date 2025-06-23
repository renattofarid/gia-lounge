import { AxiosRequestConfig } from "axios";
import { LotteryCollection, ParticipantesCollection } from "./lottery.interface";
import { api } from "@/lib/config";

export interface getLotteryProps {
  page: number;
  name?: string;
  eventId?: number;
  companyId?: number; 
}

export const getRaffles = async ({
  page,
  name,
  eventId,
  companyId 
}: getLotteryProps): Promise<LotteryCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      event_id: eventId,
      company_id: companyId

    },
  };
  const response = await api.get(`/lottery`, config);
  return response.data;
};

export const createRaffle = async (data: FormData): Promise<LotteryCollection> => {
  const response = await api.post(`/lottery`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// API para obtener los participantes del sorteo
export const getRaffleParticipants = async (
  raffleId: number
): Promise<ParticipantesCollection> => {
  const response = await api.get(`/lottery/${raffleId}/participants`);
  return response.data;
};

// API para eliminar un sorteo
export const deleteLottery = async (id: number) => {
  const response = await api.delete(`/lottery/${id}`);
  return response.data;
};

