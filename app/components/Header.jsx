"use client";
import { ArrowLeftOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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

        <SideBar />
      </div>
    </div>
  );
}
export default Header;
