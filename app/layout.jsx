import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
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
  return (
    <html lang="es">
      <body className="relative pb-40 min-h-screen font-poppins text-dark-blue">
        {children}
      </body>
    </html>
  );
}
