"use client";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <div className="flex justify-between items-center bg-primary-blue rounded-b-3xl border-red-700 p-4">
      <div className="flex mx-5">
        <SideBar />
      </div>
    </div>

  );
}
export default Header;
