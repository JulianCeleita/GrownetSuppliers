import { create } from "zustand";

const useTokenStore = create((set) => ({
  token: null, // Inicialmente, el token está vacío

  // Acción para actualizar el token
  setToken: (newToken) => set({ token: newToken }),

  
}));
export default useTokenStore;

// Nuevo token
// token: "1846|frQSf3ZxPsiwEUfx5INSMvsjQcJhScLy6L0B1Tna",
// export default useTokenStore;

// TOKEN ORIGINAL
// 1322|D0wbgSlhEIZthyIl9gsH4YSVqw5mowyrkldqHFhF