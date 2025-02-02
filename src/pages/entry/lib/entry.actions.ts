import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EntryCollection } from "./entry.interface";

export interface getEntryProps {
  page: number;
  name?: string;
  eventId?: number;
  // companyId: number;
}

export const getEntries = async ({
  page,
  eventId,
  // companyId,
  name,
}: getEntryProps): Promise<EntryCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      eventId,
      // company_id: companyId,
      name,
    },
  };
  const response = await api.get(`/entry`, config);
  return response.data;
};
