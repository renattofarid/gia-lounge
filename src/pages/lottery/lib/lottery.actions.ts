import { AxiosRequestConfig } from "axios";
import { LotteryCollection } from "./lottery.interface";
import { api } from "@/lib/config";

export interface getLotteryProps {
  page: number;
  name?: string;
  eventId?: number;
}

export const getRaffles = async ({
  page,
  name,
  eventId,
}: getLotteryProps): Promise<LotteryCollection> => {
  const config: AxiosRequestConfig = {
    params: {
      page,
      name,
      event_id: eventId,

    },
  };
  const response = await api.get(`/lottery`, config);
  return response.data;
};