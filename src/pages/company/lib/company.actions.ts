import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { CompanyCollection, CompanyItem } from "./company.interfaz";


export interface getCompanysProps {
  page: number;
}

export const getCompanys = async ({
  page,
}: getCompanysProps): Promise<CompanyCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
    },
  };
  const response = await api.get(`/company`, config);
  return response.data;
};

export const getCompany = async (id: number) => {
  const response = await api.get(`/company/${id}`);
  return response.data;
};

export const createCompany = async (data: any) => {
  const response = await api.post(`/company`, data);
  return response.data;
};

export const updateCompany = async (id: number, data: any) => {
  const response = await api.put(`/company/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id: number) => {
  const response = await api.delete(`/company/${id}`);
  return response.data;
};

export const searchPersonByRUC = async (ruc: string): Promise<CompanyItem> => {
  const response = await api.get(`/searchByRuc/${ruc}`);
  return response.data[0];
};