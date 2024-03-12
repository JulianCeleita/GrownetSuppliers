import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TruckIcon } from "@heroicons/react/24/solid";
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
            <div className="fixed inset-y-0 right-0 flex max-w-full text-dark-blue">
              <Dialog.Panel className="pointer-events-auto relative w-screen max-w-[750px] max-h-full">
                <div className="absolute left-0 top-0 flex pl-2 pt-4  mr-2">
                  <button
                    type="button"
                    className="relative rounded-md focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <ArrowRightIcon
                      className="h-6 w-6  ml-2"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="flex h-full flex-col bg-white py-6 font-poppins px-3 items-center">
                  <div className="px-10">
                    <Dialog.Title className="text-base font-semibold leading-6">
                      <h1 className="mt-3 text-center text-xl mb-5 font-bold  flex items-center justify-center">
                        <span className="mr-1 flex items-center text-primary-blue">
                          <TruckIcon className="h-7 w-7 mr-1" />
                          Route 0:
                        </span>
                        Field to Fork
                      </h1>
                      <img
                        className="rounded-lg h-[310px]"
                        src="https://images.pexels.com/photos/442969/pexels-photo-442969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Grownet Logo"
                      />
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-6 mx-10">
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Account
                        Name:
                      </strong>{" "}
                      Boba
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Invoice
                        Number:
                      </strong>{" "}
                      1111
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Account
                        Number:
                      </strong>{" "}
                      REST100
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Invoice
                        Date:
                      </strong>{" "}
                      111111
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Round:
                      </strong>{" "}
                      500
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Drop:
                      </strong>{" "}
                      3
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Driver:
                      </strong>{" "}
                      Test
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>
                        Delivery time:
                      </strong>{" "}
                      05:00:00
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Post
                        Code:
                      </strong>{" "}
                      Test
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>
                        Address:
                      </strong>{" "}
                      Cl test avenue
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Crates:
                      </strong>{" "}
                      Yes
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Group:
                      </strong>{" "}
                      UFC
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>
                        Delivery Window:
                      </strong>{" "}
                      12:00:00 - 13:00:00
                    </p>
                  </div>
                  <p className="bg-light-blue p-3 mt-2 rounded-lg w-[90%]">
                    <strong>Special Instructions:</strong> Special Instructions
                    for the order to grownet
                  </p>
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
