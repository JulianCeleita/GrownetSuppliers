"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";
import Home from "./page";
import useTokenStore from "./store/useTokenStore";
import "./style.css";
import { base64ToArrayBuffer, decryptData, getKey } from "./utils/cryptoUtils";

const metadata = {
  title: "Grownet Suppliers",
  description:
    "The exclusive platform for suppliers that streamlines the management of supply orders with the highest-quality restaurants.",
};

export const getMetadata = () => {
  return metadata;
};

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { token } = useTokenStore();
  const updateToken = useTokenStore((state) => state.updateToken);

  useEffect(() => {
    async function loadToken() {
      const base64Token = localStorage.getItem("encryptedToken");
      const base64Iv = localStorage.getItem("ivToken");
      if (base64Token && base64Iv) {
        const encryptedToken = base64ToArrayBuffer(base64Token);
        const iv = base64ToArrayBuffer(base64Iv);
        const key = await getKey();
        const token = await decryptData(encryptedToken, iv, key);
        updateToken(token);
      }
    }

    loadToken();
  }, [updateToken]);

  useEffect(() => {
    const handleRouter = async () => {
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    setTimeout(() => {
      if (typeof window !== "undefined") {
        handleRouter();
      }
    }, 50);
  }, [token]);

  return (
    <html lang="es">
      <body className="min-h-screen font-poppins text-dark-blue">
        {isLoggedIn ? children : <Home />}
      </body>
    </html>
  );
}
