import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import {
  PermissionResource,
  RolCollection,
  SetAccessRol,
} from "./rol.interface";

export interface getRolesProps {
  page: number;
  per_page?: number;
  name?: string;
}

export const getRoles = async ({
  page,
  per_page,
  name,
}: getRolesProps): Promise<RolCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      per_page,
      name,
    },
  };
  const response = await api.get(`/rol`, config);
  return response.data;
};

export const getPermissions = async (): Promise<PermissionResource[]> => {
  const config: AxiosRequestConfig = {
    params: {
      all: true,
    },
  };
  const response = await api.get(`/permission`, config);
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

export const setAccessRol = async (id: number, data: SetAccessRol) => {
  const response = await api.put(`/rol/${id}/setaccess`, data);
  return response.data;
};
