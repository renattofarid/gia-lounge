// import { create } from "zustand";
// import { Links, Meta } from "@/lib/global.interface";
// import { Product } from "@/pages/products/lib/producto.interface";

// interface ProductStore {
//   products: Product[];
//   links: Links;
//   loading: boolean;
//   filter: string;
//   meta: Meta;
//   loadProducts: (page: number) => void;
// }

// export const useProductStore = create<ProductStore>((set) => ({
//   products: [],
//   links: {
//     first: "",
//     last: "",
//     prev: null,
//     next: null,
//   },
//   meta: {
//     current_page: 0,
//     from: 0,
//     last_page: 0,
//     links: [],
//     path: "",
//     per_page: 0,
//     to: 0,
//     total: 0,
//   },
//   loading: false,
//   filter: "",
//   setFilter: (filter: string) => set({ filter }),
//   loadProducts: async () => {
//     set(() => ({ loading: true }));
//     // const filter = get().filter;
//     const response: ProductCollection = await getProducts();
//     set(() => ({
//       products: response.data,
//       loading: false,
//       links: response.links,
//       meta: response.meta,
//     }));
//   },
// }));
