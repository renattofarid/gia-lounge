import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { UserCollection } from "./user.interface";

export interface getUsersProps {
  page: number;
}

export const getUsers = async ({
  page,
}: getUsersProps): Promise<UserCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
    },
  };
  const response = await api.get(`/user?page=${page}`, config);
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
