"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";
import Home from "./page";
import useTokenStore from "./store/useTokenStore";
import useUserStore from "./store/useUserStore";
import "./style.css";

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