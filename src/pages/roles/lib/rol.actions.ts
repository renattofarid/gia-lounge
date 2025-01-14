import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { RolCollection } from "./rol.interface";

export interface getRolesProps {
  page: number;
  per_page?: number;
}

export const getRoles = async ({
  page,
  per_page,
}: getRolesProps): Promise<RolCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      per_page,
    },
  };
  const response = await api.get(`/rol`, config);
  return response.data;
};

export const getRol = async (id: number) => {
  const response = await api.get(`/rol/${id}`);
  return response.data;
};

export const createRol = async (data: any) => {
  const response = await api.post(`/rol`, data);
  return response.data;
};

export const updateRol = async (id: number, data: any) => {
  const response = await api.put(`/rol/${id}`, data);
  return response.data;
};

export const deleteRol = async (id: number) => {
  const response = await api.delete(`/rol/${id}`);
  return response.data;
};
