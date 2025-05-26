import { create } from "zustand";
import type { Links, Meta } from "@/lib/global.interface";
import { GalleryCollection, GalleryItem } from "./gallery.interface";
import { getGallery } from "./gallery.actions";
import { PER_PAGE } from "@/lib/core.function";

interface GalleryStore {
  gallery: GalleryItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  loadGallerys: (page: number, company_id?: number) => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  gallery: [],
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
  meta: {
    current_page: 0,
    from: 0,
    last_page: 0,
    links: [],
    path: "",
    per_page: 0,
    to: 0,
    total: 0,
  },
  loading: true,

  loadGallerys: async (page: number, company_id?: number) => {
    set(() => ({ loading: true }));
    try {
      const response: GalleryCollection = await getGallery({
        page,
        perPage: PER_PAGE,
        company_id,
      });

      set(() => ({
        gallery: response.data,
        links: response.links,
        meta: response.meta,
        loading: false,
      }));
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
      set(() => ({ loading: false }));
    }
  },
}));
