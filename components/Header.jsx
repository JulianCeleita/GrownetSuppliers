"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const currentHash = window.location.hash;
    setActiveLink(currentHash);
  }, []);
  return (
    <div className="flex justify-between items-center bg-primary-blue p-4">
      <div className="mx-5">
        <Link href="#">
          <Image
            src="/logoGrownetBlanco.svg"
            width={150}
            height={150}
            alt="Logo Grownet"
          />
        </Link>
      </div>
      <div className="flex gap-8 mx-10">
        <Link
          href="/orders"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <a className="block" onClick={() => setActiveLink("orders")}>
            Orders
          </a>
          {activeLink === "orders" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        <Link
          href="/products"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <a className="block" onClick={() => setActiveLink("products")}>
            Products
          </a>
          {activeLink === "products" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        <Link
          href="/presentations"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <a className="block" onClick={() => setActiveLink("presentations")}>
            Presentations
          </a>
          {activeLink === "presentations" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        <Link
          href="/categories"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <a className="block" onClick={() => setActiveLink("categories")}>
            Categories
          </a>
          {activeLink === "categories" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        <Link
          href="/suppliers"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <a className="block" onClick={() => setActiveLink("suppliers")}>
            Suppliers
          </a>
          {activeLink === "suppliers" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
      </div>
    </div>
  );
}
export default Header;
