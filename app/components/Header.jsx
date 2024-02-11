"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUserStore from "../store/useUserStore";
import SideBar from "./SideBar";

function Header() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUserStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = pathname;
      if (router.isReady) {
        setActiveLink(
          currentPath === "/" ? "orders" : currentPath.replace(/\//g, "")
        );
      }
    };

    handleRouteChange();
  }, [pathname, router]);
  const headerHeight =
    pathname === "/orders/create-order" || pathname.startsWith("/order/")
      ? "h-[120px]"
      : "h-auto";
  return (
    <div
      className={`flex justify-between items-center bg-primary-blue rounded-b-3xl p-4 ${headerHeight}`}
    >
      <div className="flex mx-5">
        <SideBar />
      </div>
    </div>
  );
}
export default Header;
