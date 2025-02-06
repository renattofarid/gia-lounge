import { api } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { EntryCollection } from "./entry.interface";
import { PER_PAGE } from "@/lib/core.function";

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
      per_page: PER_PAGE,
    },
  };
  const response = await api.get(`/entry`, config);
  return response.data;
};
