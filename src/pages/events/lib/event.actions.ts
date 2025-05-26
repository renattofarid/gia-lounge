import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EventCollection } from "./event.interface";
import { PER_PAGE } from "@/lib/core.function";

export interface getEventsProps {
  page: number;
  name?: string;
  companyId?: number;
  event_datetime?: string;
}

export const getEvents = async ({
  page,
  name,
  companyId,
  event_datetime,
}: getEventsProps): Promise<EventCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      per_page: PER_PAGE,
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
