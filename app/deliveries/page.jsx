"use client";
import { TruckIcon } from "@heroicons/react/24/solid";
import {
  CalendarIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  PrinterIcon,
  TableCellsIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  fetchOrdersDate,
  fetchOrdersDateByWorkDate,
} from "../api/ordersRequest";
import { CircleProgressBar } from "../components/CircleProgressBar";
import { orderCSV, printInvoices } from "../config/urls.config";
import Layout from "../layoutS";
import usePercentageStore from "../store/usePercentageStore";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import useWorkDateStore from "../store/useWorkDateStore";
import Image from "next/image";
import ModalOrderError from "../components/ModalOrderError";
import { saveAs } from "file-saver";
import MenuDelivery from "../components/MenuDelivery";
import { ModalRouteAssignment } from "../components/ModalRouteAssignment";

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
  const router = useRouter();
  const { token } = useTokenStore();
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [ordersWorkDate, setOrdersWorkDate] = useState(0);
  const { routePercentages, setFetchRoutePercentages } = usePercentageStore();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { user } = useUserStore();
  const [dateFilter, setDateFilter] = useState("today");
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateByNet, setStartDateByNet] = useState("");
  const [endDateByNet, setEndDateByNet] = useState("");
  const [selectedOrders, setSelectedOrders] = useState({ route: "" });
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [filterType, setFilterType] = useState("date");
  const [showPercentage, setShowPercentage] = useState(null);
  const [totalNet, setTotalNet] = useState("");
  const [routeId, setRouteId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showErrorCsv, setShowErrorCsv] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMenuDelivery, setShowMenuDelivery] = useState(false);
  const [routeDetailsVisible, setRouteDetailsVisible] = useState({});
  const [showModalAssignment, setShowModalAssignment] = useState(false);

  const onCloseModalAssignment = () => {
    setShowModalAssignment(false);
  };

  const formatDateToShow = (dateString) => {
    if (!dateString) return "Loading...";

    const parts = dateString.split("-").map((part) => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

    const day = String(utcDate.getUTCDate()).padStart(2, "0");
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
    const year = String(utcDate.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : formatDateToShow(workDate);
  const formatDateToTransform = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    // if (user && user.rol_name === "AdminGrownet") {
    //   fetchOrders(token, setOrders, setIsLoading);
    // } else {
    //   fetchOrdersSupplier(token, user, setOrders, setIsLoading);
    // }

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
    const fetchData = async () => {
      try {
        setFetchWorkDate(
          token,
          user.id_supplier,
          setStartDateByNet,
          setEndDateByNet
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [user, token]);

  useEffect(() => {
    fetchOrdersDateByWorkDate(token, workDate, setOrdersWorkDate);
  }, [workDate]);

  useEffect(() => {
    fetchOrdersDate(
      token,
      endDateByNet,
      startDateByNet,
      routeId,
      setTotalNet,
      setOrders,
      setIsLoading
    );
  }, [endDateByNet, startDateByNet, routeId]);

  useEffect(() => {
    if (routePercentages) {
      const result = routePercentages.find(
        (item) => item.nameRoute === selectedRoute
      );

      if (result) {
        setShowPercentage(result.percentage_loading);
      } else {
        setShowPercentage(null);
      }
    }
  }, [routePercentages]);

  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  function convertUTCtoTimeZone(dateUTC, timeZone) {
    let offset = new Date().getTimezoneOffset();
    let tzOffset = new Date(dateUTC).getTimezoneOffset();
    if (timeZone === "America/Bogota") {
      offset -= 300; // Bogotá está GMT-5
    } else if (timeZone === "Europe/London") {
      offset += 60; // Londres está GMT+0 o BST+1
    }
    const adjustedDate = new Date(
      dateUTC.getTime() + (offset - tzOffset) * 60000
    );
    return adjustedDate;
  }

  const filterOrdersByDate = (order) => {
    if (showAllOrders) {
      return true;
    }

    const deliveryDate = convertUTCtoTimeZone(
      new Date(order.date_delivery),
      "America/Bogota"
    );

    deliveryDate.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      return order.date_delivery === workDate;
    }
    if (dateFilter === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const startFormatted = subtractDays(start, 1);
      startFormatted.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      const endFormatted = subtractDays(end, 1);
      endFormatted.setHours(23, 59, 59, 999);
      return deliveryDate >= startFormatted && deliveryDate <= endFormatted;
    }
    if (dateFilter === "date" && selectedDate) {
      const selectDa = formatDateToTransform(selectedDate);
      return order.date_delivery === selectDa;
    }

    return false;
  };

  const objectToArray = (object) => {
    return Object.entries(object)
      .filter(([reference, checked]) => checked)
      .map(([reference]) => reference);
  };

  const sortedOrders = orders
    ?.filter((order) => filterOrdersByDate(order))
    .sort((a, b) => {
      const dateA = new Date(a.date_delivery);
      const dateB = new Date(b.date_delivery);
      return dateA - dateB;
    });

  const uniqueRoutesSet = new Set(
    sortedOrders?.map((order) => order.route_id + "_" + order.route)
  );

  // Ahora convertimos el Set nuevamente en un array, pero esta vez, cada elemento será un objeto con route_id y route_name.
  const uniqueRoutesArray = Array.from(uniqueRoutesSet).map((route) => {
    const [routeId, routeName] = route.split("_");
    return {
      route_id: parseInt(routeId, 10), // Convertimos el route_id de string a número
      route_name: routeName,
    };
  });

  const toggleRouteDetails = (routeId) => {
    setRouteDetailsVisible((prevVisible) => ({
      ...prevVisible,
      [routeId]: !prevVisible[routeId],
    }));
  };

  return (
    <Layout>
      <div className="-mt-24">
        <div className="flex gap-6 p-8">
          <h1 className="text-2xl text-light-green font-semibold mt-1 ml-24">
            Deliveries <span className="text-white">list</span>
          </h1>
          <div className="flex items-center space-x-4">
            {/* TO DO: Modal y botón routes 
            <button
              onClick={() => setShowModalAssignment(true)}
              className="flex items-center space-x-2 py-2 px-4 rounded-md bg-green text-white font-semibold"
            >
              <h1>Route assignments</h1>
            </button> */}
          </div>
        </div>
        <div
          className={`flex ml-10 mt-4 mb-0 items-center space-x-2 mt-${
            filterType === "range" && window.innerWidth < 1500
              ? "[45px]"
              : filterType === "date" && window.innerWidth < 1300
              ? "[50px]"
              : "[20px]"
          }
          `}
        >
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select px-4 py-3 rounded-md border border-gray-300"
          >
            <option value="range">Filter by range</option>
            <option value="date">Filter by date</option>
          </select>
          {filterType === "range" && (
            <>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setStartDateByNet(formatDateToTransform(date));
                  setEndDate((currentEndDate) => {
                    if (date && currentEndDate) {
                      setDateFilter("range");
                    }
                    return currentEndDate;
                  });
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-input px-4 py-3 rounded-md border border-gray-300 w-[150px]"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setEndDateByNet(formatDateToTransform(date));
                  setStartDate((currentStartDate) => {
                    if (currentStartDate && date) {
                      setDateFilter("range");
                    }
                    return currentStartDate;
                  });
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-input px-4 py-3 w-[150px] rounded-md border border-gray-300"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
              />
            </>
          )}

          {filterType === "date" && (
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
          )}
        </div>

        <div className="flex flex-col mb-20 mt-4 p-2 px-10 text-dark-blue">
          <h1 className="text-left mb-4 font-semibold">Route 0</h1>
          <div className="grid grid-cols-7 gap-2">
            <div
              onClick={() => setShowMenuDelivery(true)}
              className="flex cursor-pointer hover:bg-gray-200 transition-all items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center bg-white py-4 px-5 rounded-xl mr-4 shadow-[0_0px_40px_rgba(4,_68,_79,_0.4)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-gray-input" />
              <h1>Field to fork</h1>
            </div>
            <div className="flex items-center py-4 px-5 rounded-xl mr-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <TruckIcon className="h-10 w-10 pr-2 text-green" />
              <h1>Field to fork</h1>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20 -mt-20">
            <div className="loader"></div>
          </div>
        )}
      </div>

      <MenuDelivery open={showMenuDelivery} setOpen={setShowMenuDelivery} />
      <ModalOrderError
        isvisible={showErrorCsv}
        onClose={() => setShowErrorCsv(false)}
        title={"Error downloading csv"}
        message={errorMessage}
      />
      {/*TO DO: Modal y botón routes 
      <ModalRouteAssignment
        show={showModalAssignment}
        onClose={onCloseModalAssignment}
      /> */}
    </Layout>
  );
};

export default DeliveryView;
