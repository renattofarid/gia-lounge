import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EnvironmentCollection } from "./environment.interface";


export interface getEnvironmentProps {
  page: number;
}

export const getEnvironment = async ({
  page,
}: getEnvironmentProps): Promise<EnvironmentCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
    },
  };
  const response = await api.get(`/environment`, config);
  return response.data;
};

export const getByEnvironment = async (id: number) => {
  const response = await api.get(`/environment/${id}`);
  return response.data;
};

export const createEnnvironment = async (data: any) => {
  const response = await api.post(`/environment`, data);
  return response.data;
};

export const updateEnvironment = async (id: number, data: any) => {
  const response = await api.put(`/environment/${id}`, data);
  return response.data;
};

export const deleteEnvironment = async (id: number) => {
  const response = await api.delete(`/environment/${id}`);
  return response.data;
};

