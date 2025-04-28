import { Links, Meta } from "@/lib/global.interface";

export interface LotteryCollection {
  data: LotteryItem[];
  links: Links;
  meta: Meta;
}

export interface LotteryItem {
    id: number;
    name: string;
    description: string;
    date: string;
    status: boolean;
    // file: string;
    // fileAwards: string;
    }
