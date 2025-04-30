import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EventCollection } from "./event.interface";

export interface getEventsProps {
  page: number;
  name?: string;
  perPage?: number;
  companyId?: number;
  event_datetime?: string;
}

export const getEvents = async ({
  page,
  name,
  perPage = 3,
  companyId,
  event_datetime,
}: getEventsProps): Promise<EventCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      per_page: perPage === 0 ? undefined : perPage,
      company_id: companyId,
      event_datetime,
    },
  };
  const response = await api.get(`/event`, config);
  return response.data;
};

export const getEvent = async (id: number) => {
  const response = await api.get(`/event/${id}`);
  return response.data;
};

export const createEvent = async (data: any) => {
  const response = await api.post(`/event`, data);
  return response.data;
};

export const updateEvent = async (id: number, data: any) => {
  const response = await api.post(`/event/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await api.delete(`/event/${id}`);
  return response.data;
};
