import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { PersonDNI, PersonRUC, UserCollection } from "./user.interface";

export interface getUsersProps {
  page: number;
  name?: string;
  per_page?: number;
}

export const getUsers = async ({
  page,
  name,
  per_page = 4,
}: getUsersProps): Promise<UserCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      per_page,
    },
  };
  const response = await api.get(`/user`, config);
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const createUser = async (data: any) => {
  const response = await api.post(`/user`, data);
  return response.data;
};

export const updateUser = async (id: number, data: any) => {
  const response = await api.put(`/user/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};

export const searchPersonByDNI = async (dni: string): Promise<PersonDNI> => {
  const response = await api.get(`/searchByDni/${dni}`);
  return response.data[0];
};

export const searchPersonByRUC = async (ruc: string): Promise<PersonRUC> => {
  const response = await api.get(`/searchByRuc/${ruc}`);
  return response.data[0];
};
