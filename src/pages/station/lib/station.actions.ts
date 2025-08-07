import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { StationCollection } from "./station.interface";
import { PER_PAGE } from "@/lib/core.function";

export interface getStationProps {
  page: number;
  environmentId?: number;
  date_reservation?: string;
  event_id?: string;
  search?: string;
   companyId?: number;
}

export const getStation = async ({
  page,
  environmentId,
  date_reservation,
  event_id,
  search,
  companyId,
}: getStationProps): Promise<StationCollection> => {
  const params: Record<string, any> = {
    page,
    per_page: PER_PAGE,
  };

  if (environmentId) {
    params.environment_id = environmentId;
  } else if (companyId) {
    params["environment$company_id"] = companyId;
  }

  if (date_reservation) params.station_datetime = date_reservation;
  if (event_id) params.event_id = event_id;
  if (search) params.search = search;

  const config: AxiosRequestConfig = { params };
  const response = await api.get(`/station`, config);
  return response.data;
};

export const getByStation = async (id: number) => {
  const response = await api.get(`/station/${id}`);
  return response.data;
};

export const createStation = async (data: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.post(`/station`, data, config);
  return response.data;
};

export const updateStation = async (id: number, data: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.post(`/station/${id}`, data, config);
  return response.data;
};

export const deleteStation = async (id: number) => {
  const response = await api.delete(`/station/${id}`);
  return response.data;
};
