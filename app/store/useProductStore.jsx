import { create } from "zustand";
const useProductStore = create((set) => ({
  products: [],
  setProducts: (newProducts) =>
    set({ products: Array.isArray(newProducts) ? newProducts : [] }),
}));

export default useProductStore;
