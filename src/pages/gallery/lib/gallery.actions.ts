import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { GalleryCollection } from "./gallery.interface";

export interface getPromotionProps {
  page: number;
  perPage?: number;
  company_id?: number;

}

export const getGallery = async ({
  page,
  perPage = 6,
  company_id,
}: getPromotionProps): Promise<GalleryCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      per_page: perPage,
      company_id,
    },
  };
  const response = await api.get(`/gallery`, config);
  return response.data;
};

export const createGallery = async (data: FormData) => {
    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };
    const response = await api.post(`/gallery`, data, config);
    return response.data;
};
export const updateGallery = async (id: number, data: FormData) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.put(`/gallery/${id}`, data, config);
  return response.data;
};

export const deleteGallery = async (id: number) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};



// export async function getGalleries(page = 1, companyId?: number): Promise<any> {
//   const params = new URLSearchParams()
//   params.append("page", page.toString())

//   if (companyId) {
//     params.append("company_id", companyId.toString())
//   }

//   const response = await api.get(`/galleries?${params.toString()}`)
//   return response.data
// }
