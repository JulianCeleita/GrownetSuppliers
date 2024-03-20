import { create } from "zustand";
const usePerchasingStore = create((set) => ({
  products: [],
  setProducts: (newProducts) => set({ products: newProducts }),
}));

export default usePerchasingStore;
