import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EventCollection } from "./event.interface";


export interface getEventsProps {
  page: number;
  name?: string;
  companyId: number;
}

export const getEvents = async ({
  page,
  name,
  companyId,  
}: getEventsProps): Promise<EventCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      company_id : companyId
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


