import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./style.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grownet Suppliers",
  description:
    "The exclusive platform for suppliers that streamlines the management of supply orders with the highest-quality restaurants.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative pb-40 min-h-screen	font-poppins text-dark-blue">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
