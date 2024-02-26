import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useLayoutEffect, useState } from "react";
import useUserStore from "../store/useUserStore";
import { Dialog, Transition } from "@headlessui/react";
import useTokenStore from "../store/useTokenStore";
import grownetLogo from "../img/grownet-logo.png";
import Image from "next/image";

const SideBar = () => {
  const { removeToken, setToken } = useTokenStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const { user, removeUser, setUser } = useUserStore();

  const handleLogout = () => {
    router.push("/");
    removeToken();
    removeUser();
  };
  const handleButtonOpen = async () => {
    try {
      const currentDate = formatDate(selectedDate);

      const data = {
        supplier: user.id_supplier,
        day: currentDate,
      };

      const response = await axios.post(openDay, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error("Error al enviar la solicitud POST:", error);
    }
  };

  const handleButtonClose = async () => {
    try {
      const currentDate = formatDate(selectedDate);

      const data = {
        supplier: user.id_supplier,
        day: currentDate,
      };

      const response = await axios.post(closeDay, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al enviar la solicitud POST:", error);
    }
  };

  return (
    <div>
      <button className="ml-4" onClick={() => setOpen(true)}>
        <Bars3Icon className="h-10 w-10 mr-6 text-white font-bold" />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-10"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform ease-in-out duration-500"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="absolute inset-y-0 left-0 flex max-w-full pr-10">
              <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md ">
                <div className="absolute right-0 top-0 flex pl-2 pt-4  mr-2">
                  <button
                    type="button"
                    className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex h-full flex-col bg-dark-blue py-6">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-base font-semibold leading-6 text-white">
                      <div className="bg-[#046373] py-3 px-5 rounded-2xl flex items-center mt-8">
                        <Image
                          src={grownetLogo}
                          alt="Grownet Logo"
                          width={80}
                          height={80}
                        />
                        <div className="ml-5">
                          <h1 className="font-semibold text-lg">Hi, 📦🚀✨</h1>
                          <p className="font-normal text-[15px]">
                            Welcome to suppliers
                          </p>
                        </div>
                      </div>
                    </Dialog.Title>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="pl-4">
                      <Link
                        href="/users"
                        className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
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
                        className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
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

                      <Link
                        href="/calendar"
                        className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
                      >
                        <div
                          className={activeLink === "calendar" ? "active" : ""}
                          onClick={() => setActiveLink("calendar")}
                        >
                          Calendar
                        </div>
                        {activeLink === "calendar" ? (
                          <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                        ) : (
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                        )}
                      </Link>

                      {user && user.rol_name === "AdminGrownet" && (
                        <Link
                          href="/products"
                          className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
                        >
                          <h3
                            className={
                              activeLink === "products" ? "active" : ""
                            }
                            onClick={() => setActiveLink("products")}
                          >
                            Products
                          </h3>

                          {activeLink === "products" && (
                            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                          )}

                          {activeLink !== "products" && (
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                          )}
                        </Link>
                      )}

                      {user && user.rol_name === "AdminGrownet" && (
                        <Link
                          href="/categories"
                          className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
                        >
                          <h3
                            className={
                              activeLink === "categories" ? "active" : ""
                            }
                            onClick={() => setActiveLink("categories")}
                          >
                            Categories
                          </h3>

                          {activeLink === "categories" && (
                            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                          )}

                          {activeLink !== "categories" && (
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                          )}
                        </Link>
                      )}

                      {user && user.rol_name === "AdminGrownet" && (
                        <Link
                          href="/suppliers"
                          className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
                        >
                          <h3
                            className={
                              activeLink === "suppliers" ? "active" : ""
                            }
                            onClick={() => setActiveLink("suppliers")}
                          >
                            Suppliers
                          </h3>

                          {activeLink === "suppliers" && (
                            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                          )}

                          {activeLink !== "suppliers" && (
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                          )}
                        </Link>
                      )}

                      {user && user.rol_name === "Administrador" && (
                        <Link
                          href="/customers"
                          className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
                        >
                          <h3
                            className={
                              activeLink === "customers" ? "active" : ""
                            }
                            onClick={() => setActiveLink("customers")}
                          >
                            Customers
                          </h3>

                          {activeLink === "customers" && (
                            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                          )}

                          {activeLink !== "customers" && (
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                          )}
                        </Link>
                      )}
                      {user && user.rol_name === "Administrador" && (
                        <Link
                          href="/presentations"
                          className="relative group text-white rounded m-2 py-2 transition-all hover:text-light-green hover:scale-110"
                        >
                          <h3
                            className={
                              activeLink === "catalogs" ? "active" : ""
                            }
                            onClick={() => setActiveLink("presentations")}
                          >
                            Catalogue
                          </h3>

                          {activeLink === "presentations" && (
                            <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                          )}

                          {activeLink !== "presentations" && (
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                          )}
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center absolute bottom-0  gap 2 justify-between w-full right-0 px-5">
                      <button
                        className="flex bg-white p-3 text-dark-blue hover:scale-105 transition-all font-medium rounded-full"
                        onClick={handleLogout}
                      >
                        <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-2" />
                        Log out
                      </button>
                      <button
                        className="flex bg-white p-3 text-dark-blue hover:scale-105 transition-all font-medium rounded-full"
                        onClick={handleButtonClose}
                      >
                        <MoonIcon className="h-6 w-6 text-dark-blue mr-2" />
                        Close Day
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default SideBar;
