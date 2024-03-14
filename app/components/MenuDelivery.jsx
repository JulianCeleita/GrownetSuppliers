import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TruckIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { fetchDeliveriesDetails } from "../api/deliveryRequest";
import useTokenStore from "../store/useTokenStore";
import Image from "next/image";

const MenuDelivery = ({ open, setOpen, reference, setIsLoading }) => {
  const { token } = useTokenStore();
  const [deliveryDetails, setDeliveryDetails] = useState({});

  useEffect(() => {
    fetchDeliveriesDetails(token, setDeliveryDetails, setIsLoading, reference);
  }, [token, reference]);
  console.log("deliveryDetails:", deliveryDetails);

  const handleClose = () => {
    setOpen(false);
    setDeliveryDetails({});
  };
  const renderCrateStatus = () => {
    return deliveryDetails?.crates === 1 ? "Yes" : "No";
  };
  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-10"
          onClose={handleClose}
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
              <Dialog.Panel className="pointer-events-auto relative w-screen max-w-[550px] custom:max-w-[750px] max-h-full overflow-y-auto">
                <div className="absolute left-0 top-0 flex pl-2 pt-4  mr-2">
                  <button
                    type="button"
                    className="relative rounded-md focus:outline-none"
                    onClick={handleClose}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <ArrowRightIcon
                      className="h-6 w-6  ml-2"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="flex h-auto custom:h-full flex-col bg-white py-6 font-poppins px-3 items-center">
                  <div className="px-10">
                    <Dialog.Title className="text-base font-semibold leading-6">
                      <h1 className="mt-3 text-center text-xl mb-5 font-bold  flex items-center justify-center">
                        <span className="mr-1 flex items-center text-primary-blue">
                          <TruckIcon className="h-7 w-7 mr-1" />
                          Route {deliveryDetails.route}:
                        </span>
                        {deliveryDetails.accountName}
                      </h1>
                      {deliveryDetails.evidence ? (
                        <Image
                          className="rounded-lg w-[400px] h-[300px]"
                          src={deliveryDetails.evidence}
                          alt="Grownet Logo"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <div className="w-[500px] h-[300px] bg-dark-blue rounded-xl flex flex-col items-center justify-center">
                          <ExclamationCircleIcon className="h-20 w-20 mb-5 text-white" />
                          <p className="text-white font-medium text-center">
                            Without evidence
                          </p>
                        </div>
                      )}
                    </Dialog.Title>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-6 mx-5 text-sm custom:text-base">
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Account
                        Name:
                      </strong>{" "}
                      {deliveryDetails?.accountName}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Invoice
                        Number:
                      </strong>{" "}
                      {reference}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Account
                        Number:
                      </strong>{" "}
                      {deliveryDetails?.accountNumber}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Invoice
                        Date:
                      </strong>{" "}
                      {deliveryDetails?.date_delivery}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Round:
                      </strong>{" "}
                      {deliveryDetails?.route}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Drop:
                      </strong>{" "}
                      {deliveryDetails?.drop}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Driver:
                      </strong>{" "}
                      {deliveryDetails?.driver}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>
                        Delivery time:
                      </strong>{" "}
                      {deliveryDetails?.delivery_time}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Post
                        Code:
                      </strong>{" "}
                      {deliveryDetails?.postCode}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>
                        Address:
                      </strong>{" "}
                      {deliveryDetails?.address}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Crates:
                      </strong>{" "}
                      {renderCrateStatus()}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>Group:
                      </strong>{" "}
                      {deliveryDetails?.group}
                    </p>
                    <p>
                      <strong>
                        <span className="mr-2 text-primary-blue">•</span>
                        Delivery Window:
                      </strong>{" "}
                      {deliveryDetails?.delivery_window}
                    </p>
                  </div>
                  <p className="bg-light-blue p-3 mt-2 rounded-lg w-[90%]">
                    <strong>Special Instructions:</strong>{" "}
                    {deliveryDetails?.specialInstructions}
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
