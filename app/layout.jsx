"use client";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";
import Home from "./page";
import useTokenStore from "./store/useTokenStore";
import "./style.css";
const inter = Inter({ subsets: ["latin"] });

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
  const { token, setToken } = useTokenStore();

  // const router = useRouter();
  const router = useRouter();
  useEffect(() => {
    const handleRouter = async () => {
      const localStorageToken = localStorage.getItem("token");

      setToken(localStorageToken);

      if (localStorageToken || token) {
        setIsLoggedIn(true);
      } else if (!token) {
        setIsLoggedIn(false);
      }
    };

    setTimeout(() => {
      if (typeof window !== "undefined") {
        handleRouter();
      }
    }, 50);
  }, [token, setToken, isLoggedIn]);

  return (
    <html lang="es">
      <body className="relative pb-40 min-h-screen font-poppins text-dark-blue">
        {isLoggedIn ? children : <Home />}
      </body>
    </html>
  );
}
