"use client";
import { TruckIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import useWorkDateStore from "../store/useWorkDateStore";
import ModalOrderError from "../components/ModalOrderError";
import MenuDelivery from "../components/MenuDelivery";
import { fetchDeliveries } from "../api/deliveryRequest";

export const customStyles = {
  placeholder: (provided) => ({
    ...provided,
    color: "dark-blue",
  }),
  control: (base) => ({
    ...base,
    border: 0,
    boxShadow: "none",
    "&:hover": {
      border: 0,
    },
  }),
};

const DeliveryView = () => {
  const { token } = useTokenStore();
  const { workDate } = useWorkDateStore();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  const [dateFilter, setDateFilter] = useState("today");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startDateByNet, setStartDateByNet] = useState("");
  const [endDateByNet, setEndDateByNet] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showErrorCsv, setShowErrorCsv] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMenuDelivery, setShowMenuDelivery] = useState(false);
  const [deliveries, setDeliveries] = useState(null);
  const [reference, setReference] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  let noDeliveriesFound = false;

  const formatDateToShow = (dateString) => {
    if (!dateString) return "Loading...";

    const parts = dateString.split("-").map((part) => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

    const day = String(utcDate.getUTCDate()).padStart(2, "0");
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
    const year = String(utcDate.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatDateToTransform = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showDatePicker && !e.target.closest(".react-datepicker")) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [user, token, showDatePicker]);

  useEffect(() => {
    // fetchOrdersDateByWorkDate(token, workDate, setOrdersWorkDate);
    fetchDeliveries(
      token,
      setDeliveries,
      setIsLoading,
      selectedDate,
      setDataLoaded
    );
  }, [selectedDate]);

  useEffect(() => {
    if (workDate) {
      const [year, month, day] = workDate.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [workDate]);

  const handleCLickModal = (customer) => {
    setReference(customer);
    setShowMenuDelivery(true);
  };
  const filteredDeliveries = selectedRoute
    ? deliveries?.filter((delivery) => delivery.route === selectedRoute)
    : deliveries;

  const sortedDeliveries = filteredDeliveries?.sort((a, b) => {
    const routeA = parseInt(a.route.slice(1));
    const routeB = parseInt(b.route.slice(1));
    return routeA - routeB;
  });

  const uniqueRoutes = [
    ...new Set(deliveries?.map((delivery) => delivery.route)),
  ];
  let foundMatchingCustomer = false;
  return (
    <Layout>
      <div className="-mt-24">
        <div className="flex gap-6 p-8">
          <h1 className="text-2xl text-light-green font-semibold mt-1 ml-24">
            Deliveries <span className="text-white">history</span>
          </h1>
          <div className="flex items-center space-x-4"></div>
        </div>

        <div className={`flex ml-10 mt-4 mb-0 items-center space-x-2 `}>
          <div className="border border-gray-300 rounded-md py-3 px-2 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="placeholder-[#04444F] outline-none"
            />
            {searchQuery != "" && (
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                <TrashIcon className="h-6 w-6 text-danger" />
              </button>
            )}
          </div>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setStartDateByNet(formatDateToTransform(date));
              setEndDateByNet(formatDateToTransform(date));
              setDateFilter("date");
            }}
            className="form-input px-4 py-3 w-[125px] rounded-md border border-gray-300 text-dark-blue placeholder-dark-blue"
            dateFormat="dd/MM/yyyy"
            placeholderText={formatDateToShow(workDate)}
          />
          <div className="border border-gray-300 rounded-md py-3 px-2 flex items-center">
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
            >
              <option value="">Filter by route</option>
              <option value="">All</option>
              {uniqueRoutes.map((route, index) => (
                <option key={index} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col mb-20 mt-4 p-2 px-10 text-dark-blue">
          {isLoading || !dataLoaded ? (
            <div className="flex justify-center items-center mb-20 -mt-20">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {sortedDeliveries?.length > 0 ? (
                sortedDeliveries?.map((delivery, index) => {
                  const filteredCustomers = delivery.customers.filter(
                    (customer) => {
                      const matchCustomerName = customer.accountName
                        .toLowerCase()
                        .includes(searchQuery.trim().toLowerCase());
                      const matchRoute = delivery.route
                        .toLowerCase()
                        .includes(searchQuery.trim().toLowerCase());
                      return (
                        searchQuery.trim() === "" ||
                        matchCustomerName ||
                        matchRoute
                      );
                    }
                  );

                  if (filteredCustomers.length > 0) {
                    foundMatchingCustomer = true;
                    return (
                      <>
                        <h1 className="text-left my-2 font-semibold">
                          {delivery.route}
                        </h1>
                        <div className="flex flex-wrap">
                          {filteredCustomers.map((customer, customerIndex) => {
                            // const isNextToBeHighlighted =
                            //   customerIndex < filteredCustomers.length - 1 &&
                            //   customer.state !== "Delivered" &&
                            //   customer.drop >= 0 &&
                            //   filteredCustomers[customerIndex + 1].state !==
                            //     "Delivered";
                            return (
                              <div
                                key={customerIndex}
                                onClick={() =>
                                  handleCLickModal(customer.reference)
                                }
                                className="flex cursor-pointer items-center py-4 px-5 mb-3 rounded-xl mr-3 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] w-auto hover:scale-105 transition-all"
                              >
                                <TruckIcon
                                  className={`min-w-[30px] min-h-[30px] w-[30px] h-[30px] mr-2 ${
                                    // isNextToBeHighlighted
                                    // ? "text-primary-blue"
                                    customer.state === "Delivered"
                                      ? "text-green"
                                      : "text-gray-500"
                                  }`}
                                />
                                <div>
                                  <h1>
                                    {customer.accountName + customer.state}
                                  </h1>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  }
                })
              ) : (
                <div>
                  {!isLoading && !dataLoaded && (
                    <p className="flex items-center justify-center text-gray my-10">
                      <ExclamationCircleIcon className="h-12 w-12 mr-5 text-gray" />
                      No deliveries were found for this date. Please try
                      searching for deliveries on a different date.
                    </p>
                  )}
                </div>
              )}
              {!foundMatchingCustomer && (
                <div>
                  <p className="flex items-center justify-center text-gray my-10">
                    <ExclamationCircleIcon className="h-12 w-12 mr-5 text-gray" />
                    No deliveries found, please search again.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {noDeliveriesFound && (
        <p className="flex items-center justify-center text-gray my-10">
          <ExclamationCircleIcon className="h-12 w-12 mr-5 text-gray" />
          No deliveries found, please search again.
        </p>
      )}
      <MenuDelivery
        open={showMenuDelivery}
        setOpen={setShowMenuDelivery}
        reference={reference}
        setIsLoading={setIsLoading}
      />
      <ModalOrderError
        isvisible={showErrorCsv}
        onClose={() => setShowErrorCsv(false)}
        title={"Error downloading csv"}
        message={errorMessage}
      />
    </Layout>
  );
};

export default DeliveryView;
