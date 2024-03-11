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
  TruckIcon,
  ArrowRightIcon,
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


const MenuDelivery = ({ open, setOpen }) => {
  const pathname = usePathname();

  return (
    <div>
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
            <div className="fixed inset-0 bg-dark-blue bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform ease-in-out duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="fixed inset-y-0 right-0 flex max-w-full">
              <Dialog.Panel className="pointer-events-auto relative w-screen max-w-[850px] max-h-full">
                <div className="absolute left-0 top-0 flex pl-2 pt-4  mr-2">
                  <button
                    type="button"
                    className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <ArrowRightIcon className="h-6 w-6 text-black ml-2" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex h-full flex-col bg-white py-6 font-poppins">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-base font-semibold leading-6 text-white">
                      <h1 className="mt-8 text-center text-black text-xl mb-1"><strong>Detail Delivery</strong></h1>
                      <p className="text-black"><strong>Evidence:</strong></p>
                      <div className="bg-gray-500 py-3 px-5 rounded-2xl flex items-center">
                        <Image
                          src={grownetLogo}
                          alt="Grownet Logo"
                          width={250}
                          height={250}
                        />
                      </div>
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center text-start mt-5 mx-10">
                    <p className="text-black"><strong>Account Name:</strong> Boba</p>
                    <p className="text-black"><strong>Invoice Number:</strong> 1111</p>
                    <p className="text-black"><strong>Account Number:</strong> REST100</p>
                    <p className="text-black"><strong>Invoice Date:</strong> 111111</p>
                    <p className="text-black"><strong>Round:</strong> 500</p>
                    <p className="text-black"><strong>Drop:</strong> 3</p>
                    <p className="text-black"><strong>Driver:</strong> Test</p>
                    <p className="text-black"><strong>Delivery time:</strong> 05:00:00</p>
                    <p className="text-black"><strong>Post Code:</strong> Test</p>
                    <p className="text-black"><strong>Address:</strong> Cl test avenue</p>
                    <p className="text-black"><strong>Crates:</strong> Yes</p>
                    <p className="text-black"><strong>Vip:</strong> Yes</p>
                    <p className="text-black"><strong>Group:</strong> UFC</p>
                    <p className="text-black"><strong>Delivery Window:</strong> 12:00:00 - 13:00:00</p>
                    <p className="text-black"><strong>Special Instructions:</strong> No special instructuions</p>
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

export default MenuDelivery;
