import { create } from "zustand";

const useTokenStore = create((set) => {
  let storedToken = null;

  if (typeof window !== "undefined") {
    storedToken = localStorage.getItem("token");
  }

  return {
    token: storedToken || null,
    setToken: (newToken) => {
      set({ token: newToken });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken);
      }
    },
    removeToken: () => {
      set({ token: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  };
});

export default useTokenStore;