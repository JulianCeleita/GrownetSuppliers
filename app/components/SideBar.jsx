import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  CircleStackIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  ShoppingCartIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  ClipboardIcon,
  SunIcon,
  CubeIcon,
  TruckIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Fragment, useLayoutEffect, useState, useEffect } from "react";
import useUserStore from "../store/useUserStore";
import { Dialog, Transition } from "@headlessui/react";
import useTokenStore from "../store/useTokenStore";
import grownetLogo from "../img/grownet-logo.png";
import Image from "next/image";
import axios from "axios";
import { closeDay, openDay } from "../config/urls.config";
import useWorkDateStore from "../store/useWorkDateStore";
import Swal from "sweetalert2";
import ModalSuccessfull from "./ModalSuccessfull";
import ModalOrderError from "./ModalOrderError";

const SideBar = () => {
  const { removeToken, setToken } = useTokenStore();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMenuTransport, setOpenMenuTransport] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, removeUser, setUser } = useUserStore();
  const { token } = useTokenStore();
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [startDateByNet, setStartDateByNet] = useState("");
  const [endDateByNet, setEndDateByNet] = useState("");
  const [showSuccessfullClose, setShowSuccessfullClose] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleLogout = () => {
    router.push("/");
    removeToken();
    removeUser();
  };

  const handleButtonOpen = async () => {
    await setFetchWorkDate(
      token,
      user.id_supplier,
      setEndDateByNet,
      setStartDateByNet
    );

    try {
      const data = {
        supplier: user.id_supplier,
        day: workDate,
      };
      "🚀 ~ handleButtonOpen ~ data:", data;

      const response = await axios.post(openDay, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error(
        "Error al enviar la solicitud POST:",
        error.response.data.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
    }
  };

  const handleButtonClose = async () => {
    try {
      const data = {
        supplier: user.id_supplier,
        day: workDate,
      };

      const response = await axios.post(closeDay, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 500) {
        setShowModalError(true);
        setMessageError(response.data.msg);
      } else {
        setShowSuccessfullClose(true);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud POST:", error);
      setShowModalError(true);
      setMessageError(
        error.response.data.response_start_operation.message_start_operation
      );
    }
  };
  useEffect(() => {
    if (
      pathname === "/products" ||
      pathname === "/suppliers" ||
      pathname === "/categories"
    ) {
      setOpenMenu(true);
    }
  }, [pathname]);

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
                <div className="flex h-full flex-col bg-dark-blue py-6 font-poppins">
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
                          <h1 className="font-semibold text-lg">
                            Hi, {user?.name} 📦🚀
                          </h1>
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
                        className={`flex gap-2 py-3 transition-all ${
                          pathname === "/users"
                            ? "text-light-green"
                            : "text-white"
                        } hover:text-light-green`}
                      >
                        <UserIcon className="h-6 w-6" />
                        <h3>Users</h3>
                      </Link>

                      <Link
                        href="/orders"
                        className={`flex gap-2 py-3 transition-all ${
                          pathname === "/orders"
                            ? "text-light-green"
                            : "text-white"
                        } hover:text-light-green`}
                      >
                        <ShoppingCartIcon className="h-6 w-6" />
                        <h3>Orders</h3>
                      </Link>
                      <Link
                        href="/productstate"
                        className={`flex gap-2 py-3 transition-all ${
                          pathname === "/productstate"
                            ? "text-light-green"
                            : "text-white"
                        } hover:text-light-green`}
                      >
                        <CubeIcon className="h-6 w-6" />
                        <h3>Products State</h3>
                      </Link>

                      <Link
                        href="/calendar"
                        className={`flex gap-2 py-3 transition-all ${
                          pathname === "/calendar"
                            ? "text-light-green"
                            : "text-white"
                        } hover:text-light-green`}
                      >
                        <CalendarIcon className="h-6 w-6" />
                        <div>Calendar</div>
                      </Link>

                      <div className="relative py-3">
                        <button
                          className={`flex justify-between w-full ${
                            openMenu === true
                              ? "text-light-green"
                              : "text-white"
                          } hover:text-light-green`}
                          onClick={() =>
                            setOpenMenuTransport(!openMenuTransport)
                          }
                        >
                          <div className="flex gap-2">
                            <TruckIcon className="h-6 w-6" />
                            <h3>Transport</h3>
                          </div>

                          {openMenuTransport === false ? (
                            <ChevronDownIcon className="h-6 w-6" />
                          ) : (
                            <ChevronUpIcon className="h-6 w-6" />
                          )}
                        </button>
                        {openMenuTransport && (
                          <div className="mt-3 border-l-[1px] border-light-green pl-5">
                            <Link href="/deliveries" className="text-white">
                              <h3
                                className={`hover:bg-[#046373] px-2 py-2 pl-4 rounded-xl w-[360px] mb-2 ${
                                  pathname === "/products"
                                    ? "bg-[#046373]"
                                    : null
                                }`}
                              >
                                Deliveries
                              </h3>
                            </Link>
                          </div>
                        )}
                      </div>

                      {user && user.rol_name === "AdminGrownet" && (
                        <div className="relative py-3">
                          <button
                            className={`flex justify-between w-full ${
                              openMenu === true
                                ? "text-light-green"
                                : "text-white"
                            } hover:text-light-green`}
                            onClick={() => setOpenMenu(!openMenu)}
                          >
                            <div className="flex gap-2">
                              <CircleStackIcon className="h-6 w-6" />
                              <h3>Database</h3>
                            </div>

                            {openMenu === false ? (
                              <ChevronDownIcon className="h-6 w-6" />
                            ) : (
                              <ChevronUpIcon className="h-6 w-6" />
                            )}
                          </button>
                          {openMenu && (
                            <div className="mt-3 border-l-[1px] border-light-green pl-5">
                              <Link href="/suppliers" className="text-white">
                                <h3
                                  className={`hover:bg-[#046373] px-2 py-2 pl-4 rounded-xl w-[360px] mb-2 ${
                                    pathname === "/suppliers"
                                      ? "bg-[#046373]"
                                      : null
                                  }`}
                                >
                                  Suppliers
                                </h3>
                              </Link>
                              <Link href="/products" className="text-white">
                                <h3
                                  className={`hover:bg-[#046373] px-2 py-2 pl-4 rounded-xl w-[360px] mb-2 ${
                                    pathname === "/products"
                                      ? "bg-[#046373]"
                                      : null
                                  }`}
                                >
                                  Products
                                </h3>
                              </Link>
                              <Link href="/categories" className="text-white">
                                <h3
                                  className={`hover:bg-[#046373] px-2 py-2 pl-4 rounded-xl w-[360px] mb-2 ${
                                    pathname === "/categories"
                                      ? "bg-[#046373]"
                                      : null
                                  }`}
                                >
                                  Categories
                                </h3>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                      {user &&
                        (user.rol_name === "Administrador" ||
                          user.rol_name === "AdminGrownet") && (
                          <Link
                            href="/customers"
                            className={`flex gap-2 py-3 transition-all ${
                              pathname === "/customers"
                                ? "text-light-green"
                                : "text-white"
                            } hover:text-light-green`}
                          >
                            <BuildingStorefrontIcon className="h-6 w-6" />
                            <h3>Customers</h3>
                          </Link>
                        )}
                      {user &&
                        (user.rol_name === "Administrador" ||
                          user.rol_name === "AdminGrownet") && (
                          <Link
                            href="/presentations"
                            className={`flex gap-2 py-3 transition-all ${
                              pathname === "/presentations"
                                ? "text-light-green"
                                : "text-white"
                            } hover:text-light-green`}
                          >
                            <ClipboardIcon className="h-6 w-6" />
                            <h3>Catalogue</h3>
                          </Link>
                        )}
                      {user &&
                        (user.rol_name === "Administrador" ||
                          user.rol_name === "AdminGrownet") && (
                          <Link
                            href="/purchasing"
                            className={`flex gap-2 py-3 transition-all ${
                              pathname === "/purchasing"
                                ? "text-light-green"
                                : "text-white"
                            } hover:text-light-green`}
                          >
                            <CurrencyEuroIcon className="h-6 w-6" />
                            <h3>Purchasing</h3>
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
                      <div className="flex flex-col">
                        {/* <button
                          className="flex bg-white p-3 text-dark-blue hover:scale-105 transition-all font-medium rounded-full"
                          onClick={handleButtonOpen}
                        >
                          <SunIcon className="h-6 w-6 text-dark-blue mr-2" />
                          Open Day
                        </button> */}
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
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <ModalSuccessfull
        isvisible={showSuccessfullClose}
        onClose={() => setShowSuccessfullClose(false)}
        title="Congratulations"
        text="Day closed correctly!"
        button=" Close"
        confirmed={true}
      />
      <ModalOrderError
        isvisible={showModalError}
        onClose={() => setShowModalError(false)}
        title={"Error closing the day"}
        message={messageError}
      />
    </div>
  );
};

export default SideBar;
