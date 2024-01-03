"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

function Header() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = pathname;
      setActiveLink(
        currentPath === "/" ? "orders" : currentPath.replace(/\//g, "")
      );
    };

    handleRouteChange();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center bg-primary-blue p-4">
      <div className="mx-5">
        <Link href="#">
          <Image
            src="/logoGrownetBlanco.svg"
            width={180}
            height={180}
            alt="Logo Grownet"
            priority={true}
          />
        </Link>
      </div>
      <div className="flex gap-8 mx-10">
        <Link
          href="/users"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <h3
            className={activeLink === "users" ? "active" : ""}
            onClick={() => setActiveLink("users")}
          >
            Users
          </h3>

          {activeLink === "users" && (
            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          )}

          {activeLink !== "users" && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        <Link
          href="/orders"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <h3
            className={activeLink === "orders" ? "active" : ""}
            onClick={() => setActiveLink("orders")}
          >
            Orders
          </h3>

          {activeLink === "orders" && (
            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          )}

          {activeLink !== "orders" && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        {/* <Link
          href="/products"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <div
            className={activeLink === "products" ? "active" : ""}
            onClick={() => setActiveLink("products")}
          >
            Products
          </div>

          {activeLink === "products" && (
            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          )}

          {activeLink !== "products" && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link> */}
        <Link
          href="/presentations"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <div
            className={activeLink === "presentations" ? "active" : ""}
            onClick={() => setActiveLink("presentations")}
          >
            Presentations
          </div>
          {activeLink === "presentations" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link>
        {/* <Link
          href="/categories"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <div
            className={activeLink === "categories" ? "active" : ""}
            onClick={() => setActiveLink("categories")}
          >
            Categories
          </div>
          {activeLink === "categories" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link> */}
        {/* <Link
          href="/suppliers"
          className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
        >
          <div
            className={activeLink === "suppliers" ? "active" : ""}
            onClick={() => setActiveLink("suppliers")}
          >
            Suppliers
          </div>
          {activeLink === "suppliers" ? (
            <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
          ) : (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          )}
        </Link> */}
        <button
          className="text-white flex bg-dark-blue rounded-lg m-2 p-2 transition-all hover:bg-black hover:scale-110"
          onClick={handleLogout}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          Log out
        </button>
      </div>
    </div>
  );
}
export default Header;
