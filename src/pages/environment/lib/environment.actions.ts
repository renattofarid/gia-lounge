import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EnvironmentCollection } from "./environment.interface";

export interface getEnvironmentProps {
  page: number;
  companyId?: number;
}

export const getEnvironment = async ({
  page,
  companyId,
}: getEnvironmentProps): Promise<EnvironmentCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      company_id: companyId,
    },
  };
  const response = await api.get(`/environment`, config);
  return response.data;
};

export const getByEnvironment = async (id: number) => {
  const response = await api.get(`/environment/${id}`);
  return response.data;
};

export const createEnvironment = async (data: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.post(`/environment`, data, config);
  return response.data;
};

export const updateEnvironment = async (id: number, data: any) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.post(`/environment/${id}`, data, config);
  return response.data;
};

export const deleteEnvironment = async (id: number) => {
  const response = await api.delete(`/environment/${id}`);
  return response.data;
};
