import { create } from "zustand";
import { arrayBufferToBase64, base64ToArrayBuffer, decryptData, encryptData, getKey } from "../utils/cryptoUtils";

const useTokenStore = create((set) => {
  let storedToken = null;

  if (typeof window !== "undefined") {
    const base64Token = localStorage.getItem("encryptedToken");
    const base64Iv = localStorage.getItem("ivToken");
    const encryptedToken = base64Token && base64ToArrayBuffer(base64Token);
    const iv = base64Iv && base64ToArrayBuffer(base64Iv);
    getKey().then((key) => {
      if (encryptedToken && iv && key) {
        decryptData(encryptedToken, iv, key).then((token) => {
          storedToken = token;
          console.log("Stored token:  ", storedToken)
        });
      }
    });

    // storedToken = localStorage.getItem("token");
  }

  return {
    token: storedToken || null,
    updateToken: (token) => set({ token }),
    setToken: async (newToken) => {
      set({ token: newToken });
      if (typeof window !== "undefined") {
        const key = await getKey();
        const { encrypted, iv } = await encryptData(newToken, key);
        const base64EncryptedToken = arrayBufferToBase64(encrypted);
        const base64Iv = arrayBufferToBase64(iv);
        localStorage.setItem("encryptedToken", base64EncryptedToken);
        localStorage.setItem("ivToken", base64Iv);
        set({ token: newToken });
      }
    },
    removeToken: () => {
      set({ token: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem("encryptedToken");
        localStorage.removeItem("ivToken");
      }
    },
  };
});

export default useTokenStore;
