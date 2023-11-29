import { create } from "zustand";
const useCategoryStore = create((set) => ({
  categories: [],
  setCategories: (newCategories) =>
    set({ categories: Array.isArray(newCategories) ? newCategories : [] }),
}));

export default useCategoryStore;
