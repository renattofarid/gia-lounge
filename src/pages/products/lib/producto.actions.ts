import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { ProductCollection } from "./producto.interface";

export const getProducts = async (): Promise<ProductCollection> => {
  const config: AxiosRequestConfig = {};
  const response = await api.get(`/product`, config);
  return response.data;
};

export const createProduct = async (
  data: FormData
): Promise<ProductCollection> => {
  const response = await api.post(`/product`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: FormData
): Promise<ProductCollection> => {
  const response = await api.post(`/product/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/product/${id}`);
};
