import { create } from "zustand";
const usePerchasingStore = create((set) => ({
  products: [],
  setProducts: (newProducts) =>
    set({ products: Array.isArray(newProducts) ? newProducts : [] }),
}));

export default usePerchasingStore;
