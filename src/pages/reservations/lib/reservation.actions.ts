import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { ReservationCollection } from "./reservation.interface";
// import { PER_PAGE } from "@/lib/core.function";

export interface getReservationProps {
  page: number;
  name?: string;
  eventId?: number;
}

export const getReservations = async ({
  page,
  name,
  eventId,
}: getReservationProps): Promise<ReservationCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      // per_page: PER_PAGE,

      name,
      event_id: eventId,
    },
  };
  const response = await api.get(`/reservation`, config);
  return response.data;
};

export const getReservation = async (id: number) => {
  const response = await api.get(`/reservation/${id}`);
  return response.data;
};

export const createReservation = async (data: any) => {
  const response = await api.post(`/reservation`, data);
  return response.data;
};

export const updateReservation = async (id: number, data: any) => {
  const response = await api.put(`/reservation/${id}`, data);
  return response.data;
};

export const deleteReservation = async (id: number) => {
  const response = await api.delete(`/reservation/${id}`);
  return response.data;
};
