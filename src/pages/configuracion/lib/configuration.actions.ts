import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { SettingsCollection } from "./configuration.interface";

export interface getConfigurationProps {
  page: number;
  name?: string;
}

export const getSetting = async ({
  page,
}: getConfigurationProps): Promise<SettingsCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
    },
  };
  const response = await api.get(`/setting`, config);
  return response.data;
};

export const editSettingPercent = async (data: any) => {
  const response = await api.put(`/update-descount-percent`, data);
  return response.data;
};
export const editSettingTime = async (data: any) => {
  const response = await api.put(`/update-time-reservation`, data);
  return response.data;
};


