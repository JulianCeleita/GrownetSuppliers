"use client";
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
import { saveAs } from 'file-saver';

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

const OrderView = () => {
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
      console.log("🚀 ~ useEffect ~ routePercentages:", routePercentages);
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

  const goToOrder = (e, order) => {
    e.preventDefault();
    router.push(`/order/${order.reference}`, undefined, {
      shallow: true,
    });
  };

  const handleOrderSelect = (order, checked) => {
    setSelectedOrders((prevState) => ({
      ...prevState,
      [order.reference]: checked,
    }));
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const selectAll = (checked) => {
    const newSelectedOrders = {};
    filteredOrders.forEach((order) => {
      newSelectedOrders[order.reference] = checked;
    });
    setSelectedOrders(newSelectedOrders);
    setShowPercentage(null);
  };

  const objectToArray = (object) => {
    return Object.entries(object)
      .filter(([reference, checked]) => checked)
      .map(([reference]) => reference);
  };

  const downloadCSV = () => {
    let date;

    if (selectedDate) {
      date = new Date(selectedDate);

      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      var postDataCSV = {
        route_id: selectedRouteId,
        date: formattedDate,
      };

      console.log("🚀 ~ downloadCSV ~ postDataCSV:", postDataCSV);
    } else {
      date = workDate;

      var postDataCSV = {
        route_id: selectedRouteId,
        date: date,
      };

      console.log("🚀 ~ downloadCSV ~ postDataCSV:", postDataCSV);
    }
    axios
      .post(orderCSV, postDataCSV, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // responseType: "blob",
      })
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // const link = document.createElement("a");
        // link.href = url;
        // link.setAttribute("download", "orders.csv");
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // window.URL.revokeObjectURL(url);
        saveAs(new Blob([response.data], { type: 'text/csv' }), 'orders.csv');
      })
      .catch((error) => {
        console.log("🚀 ~ downloadCSV ~ error:", error);
        setShowErrorCsv(true);
        setErrorMessage(error?.response?.data?.msg);
        console.error("Error al descargar csv: ", error);
      });
  };
  const printOrders = () => {
    const ordersToPrint = objectToArray(selectedOrders);

    const postDataPrint = {
      references: ordersToPrint,
    };

    axios
      .post(printInvoices, postDataPrint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        // const downloadUrl = URL.createObjectURL(blob);
        // const link = document.createElement("a");
        // link.href = downloadUrl;
        // link.setAttribute("download", "invoice.pdf");
        // link.style.display = "none";
        // document.body.appendChild(link);
        // link.click();
        // if (document.body.contains(link)) {
        //   console.log("entro aqui en removeChild");
        //   document.body.removeChild(link);
        // }
        // URL.revokeObjectURL(downloadUrl);

        // Para abrir automáticamente el archivo
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      })
      .catch((error) => {
        console.error("Error al imprimir invoice: ", error);
      });
  };

  const sortedOrders = orders
    .filter((order) => filterOrdersByDate(order))
    .sort((a, b) => {
      const dateA = new Date(a.date_delivery);
      const dateB = new Date(b.date_delivery);
      return dateA - dateB;
    });
  console.log("🚀 ~ OrderView ~ sortedOrders:", sortedOrders);

  const uniqueRoutesSet = new Set(
    sortedOrders.map((order) => order.route_id + "_" + order.route)
  );

  // Ahora convertimos el Set nuevamente en un array, pero esta vez, cada elemento será un objeto con route_id y route_name.
  const uniqueRoutesArray = Array.from(uniqueRoutesSet).map((route) => {
    const [routeId, routeName] = route.split("_");
    return {
      route_id: parseInt(routeId, 10), // Convertimos el route_id de string a número
      route_name: routeName,
    };
  });
  console.log("🚀 ~ OrderView ~ uniqueRoutesArray:", uniqueRoutesArray);

  const getPercentages = async (value) => {
    if (value !== "" || value !== null || value !== undefined) {
      await setFetchRoutePercentages(token, workDate);
    }
  };

  const handleRouteChange = (event) => {
    if (event.target.value) {
      const selectedOption = JSON?.parse(event.target.value);
      setSelectedRoute(selectedOption.route_name);
      setSelectedRouteId(selectedOption.route_id);
    } else {
      setSelectedRoute("");
      setSelectedRouteId("");
    }
  };

  const filteredOrders = sortedOrders
    .filter((order) => {
      const isRouteMatch = selectedRoute
        ? order.route.toLowerCase() === selectedRoute.toLowerCase()
        : true;
      const isGroupMatch = selectedGroup
        ? order.group_name.toLowerCase() === selectedGroup.toLowerCase()
        : true;

      const isSearchQueryMatch =
        order.reference
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.accountName.toLowerCase().includes(searchQuery.toLowerCase());

      const isStatusMatch = selectedStatus
        ? order.status_order.toLowerCase() === selectedStatus.toLowerCase()
        : true;

      return (
        isRouteMatch && isGroupMatch && isSearchQueryMatch && isStatusMatch
      );
    })
    .sort((a, b) => b.reference - a.reference);

  const uniqueStatuses = [
    ...new Set(sortedOrders.map((order) => order.status_order)),
  ];
  const handleStatusChange = (e) => {
    const newSelectedStatus = e.target.value;
    setSelectedStatus(newSelectedStatus);
  };

  // console.log("filteredOrders", filteredOrders);

  const statusColorClass = (status) => {
    switch (status) {
      case "Delivered":
      case "Solved":
      case "Loaded":
      case "Printed":
        return "bg-green";
      case "Dispute":
        return "bg-danger";
      case "Generated":
      case "Received":
      case "Preparing":
      case "Sent":
        return "bg-primary-blue";
      case "Packed":
        return "bg-orange-grownet";
      default:
        return "bg-primary-blue";
    }
  };

  return (
    <Layout>
      <div className="-mt-24">
        <div className="flex gap-6 p-8">
          <h1 className="text-2xl text-light-green font-semibold mt-1 ml-24">
            Deliveries <span className="text-white">list</span>
          </h1>
        </div>
        <div
          className={`flex ml-10 mb-0 items-center space-x-2 mt-${
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

        <div className="flex items-center justify-center mb-20 mt-4  p-2">
          {/* TODO: Agregar la logica para mostrar los deliveries */}
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20 -mt-20">
            <div className="loader"></div>
          </div>
        )}
      </div>
      <ModalOrderError
        isvisible={showErrorCsv}
        onClose={() => setShowErrorCsv(false)}
        title={"Error downloading csv"}
        message={errorMessage}
      />
    </Layout>
  );
};

export default OrderView;
