import { create } from "zustand";

const useUserStore = create((set) => {
  let storedUser = null;

  if (typeof window !== "undefined") {
    storedUser = localStorage.getItem("user");
  }

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    setUser: (newUser) => {
      set({ user: newUser });
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    },
    removeUser: () => {
      set({ user: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  };
});

export default useUserStore;
