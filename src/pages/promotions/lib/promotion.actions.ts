import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { PromotionCollection } from "./promotions.interface";
import { Links, Meta } from "@/lib/global.interface";

export interface getPromotionProps {
  page: number;
  name?: string;
  perPage?: number;
  dateStart?: string

}

export const getPromotions = async ({
  page,
  name,
  dateStart,
  perPage = 3,
}: getPromotionProps): Promise<PromotionCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      date_start: dateStart,
      per_page: perPage,
    },
  };
  const response = await api.get(`/promotion`, config);
  return response.data;
};

export const getPromotionWeek = async (): Promise<PromotionCollection> => {
  const response = await api.get(`/promotion`);
  return response.data;
};
export const getPromotion = async (id: number) => {
  const response = await api.get(`/promotion/${id}`);
  return response.data;
};

export const createPromotion = async (data: FormData) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.post(`/promotion`, data, config);
  return response.data;
};

export const updatePromotion = async (id: number, data: FormData) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.put(`/promotion/${id}`, data, config);
  return response.data;
};

export const deletePromotion = async (id: number) => {
  const response = await api.delete(`/promotion/${id}`);
  return response.data;
};

export const getProducts = async (): Promise<PromotionCollection> => {
  const config: AxiosRequestConfig = {
   
  };
  const response = await api.get(`/product`, config);
  return response.data;
};


export interface ProductCollection {
  data:  Product[];
  links: Links;
  meta:  Meta;
}

export interface Product {
  id:          number;
  name:        string;
  description: string;
  precio:      string;
  status:      string;
  route:       string;
}

