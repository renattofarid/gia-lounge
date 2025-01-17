import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { StationCollection } from "./station.interface";

export interface getStationProps {
  page: number;
  environmentId?: number;
}

export const getStation = async ({
  page,
  environmentId,
}: getStationProps): Promise<StationCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      environment_id: environmentId,
    },
  };
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
