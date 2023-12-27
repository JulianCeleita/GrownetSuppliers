// RootLayout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./style.css";
const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Grownet Suppliers",
  description:
    "La plataforma exclusiva para proveedores que simplifica la gestión de pedidos de suministros con los restaurantes de la más alta calidad.",
};

export const getMetadata = () => {
  return metadata;
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="relative pb-40 min-h-screen font-poppins text-dark-blue">
        {children}
      </body>
    </html>
  );
}
