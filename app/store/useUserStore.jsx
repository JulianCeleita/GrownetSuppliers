import { create } from "zustand";
import { arrayBufferToBase64, base64ToArrayBuffer, decryptData, encryptData, getKey } from "../utils/cryptoUtils";

const useUserStore = create((set) => {
  let storedUser = null;

  if (typeof window !== "undefined") {
    const base64User = localStorage.getItem("encryptedUser");
    const base64Iv = localStorage.getItem("ivUser");
    const encryptedUser = base64User && base64ToArrayBuffer(base64User);
    const iv = base64Iv && base64ToArrayBuffer(base64Iv);
    getKey().then((key) => {
      if (encryptedUser && iv && key) {
        decryptData(encryptedUser, iv, key).then((user) => {
          storedUser = user;
          console.log("Stored user:  ", user)
        });
      }
    });

    
    // storedUser = localStorage.getItem("user");
  }

  return {
    user: storedUser || null,
    updateUser: (user) => set({ user }),
    setUser: async (newUser) => {
      set({ token: newUser });
      if (typeof window !== "undefined") {
        const key = await getKey();
        const { encrypted, iv } = await encryptData(newUser, key);
        const base64EncryptedUser = arrayBufferToBase64(encrypted);
        const base64Iv = arrayBufferToBase64(iv);
        localStorage.setItem("encryptedUser", base64EncryptedUser);
        localStorage.setItem("ivUser", base64Iv);
        set({ user: newUser });
      }
    },
    removeUser: () => {
      set({ user: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem("encryptedUser");
        localStorage.removeItem("ivUser");
      }
    },
  };
});

export default useUserStore;
