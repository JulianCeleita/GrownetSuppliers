import { create } from "zustand";

const useSupplierIdStore = create((set) => ({
  supplierId: null,

  setSupplierId: (newSupplierId) => set({ supplierId: newSupplierId }),

  
}));
export default useSupplierIdStore;
