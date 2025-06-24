// src/lib/ticket.actions.ts
import { api } from "@/lib/config";
import type { AxiosRequestConfig } from "axios";
import type { TicketCollection } from "./ticket.interface";

export interface GetTicketsProps {
  page?: number;
  lottery_id: number;
  search?: string;
  per_page?: number;
}

export const getTickets = async ({
  page = 1,
  lottery_id,
  search = "",
  per_page = 10,
}: GetTicketsProps): Promise<TicketCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      lottery_id,
      per_page,
      ...(search.trim() ? { search: search.trim() } : {}),
    },
  };
  const response = await api.get(`/lottery_ticket`, config);
  return response.data;
};

export interface CreateTicketData {
  lottery_id: number;
  user_owner_id: number;
  quantity?: number;
}

export const createTicket = async (data: CreateTicketData) => {
  const response = await api.post(`/lottery_ticket_admin`, data);
  return response.data;
};
