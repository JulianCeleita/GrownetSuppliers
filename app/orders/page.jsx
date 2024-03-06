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
    const postDataCSV = {
      route_id: selectedRouteId,
      date: workDate,
    };
    console.log("🚀 ~ downloadCSV ~ postDataCSV:", postDataCSV);

    axios
      .post(orderCSV, postDataCSV, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // responseType: "blob",
      })
      .then((response) => {
        console.log("🚀 ~ .then ~ response.data.message:", response.data);
        if (response.data.status === 400) {
        } else {
          console.log("🚀 ~ .then ~ response:", response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "orders.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((error) => {
        console.log("🚀 ~ downloadCSV ~ error:", error.response.data.msg);
        setShowErrorCsv(true);
        setErrorMessage(error.response.data.msg);
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
            Orders <span className="text-white">list</span>
          </h1>
          <Link
            className="flex bg-green py-3 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
            href="/orders/create-order"
          >
            <PlusCircleIcon className="h-6 w-6 mr-1" /> New Order
          </Link>
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
                  setSelectedRoute("");
                  setSelectedGroup("");
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
          <select
            value={JSON.stringify({
              route_id: selectedRouteId,
              route_name: selectedRoute,
            })}
            onChange={handleRouteChange}
            className="form-select px-4 py-3 rounded-md border border-gray-300"
          >
            <option value="">All routes</option>
            {uniqueRoutesArray.map((route) => (
              <option
                key={route.route_id}
                value={JSON.stringify({
                  route_id: route.route_id,
                  route_name: route.route_name,
                })}
              >
                {route.route_name}
              </option>
            ))}
          </select>
          <select
            value={selectedGroup}
            onChange={handleGroupChange}
            className="orm-select px-4 py-3 rounded-md border border-gray-300"
          >
            <option value="">All groups</option>
            {[
              ...new Set(
                orders.map((order) =>
                  order.group_name !== null ? order.group_name : "No group"
                )
              ),
            ].map((uniqueGroup) => (
              <option key={uniqueGroup} className="text-black">
                {uniqueGroup}
              </option>
            ))}
          </select>
          <button
            disabled={!selectedRoute}
            className={`flex ${
              selectedRoute
                ? "bg-green text-white hover:bg-dark-blue"
                : "bg-gray-grownet text-white cursor-not-allowed"
            } py-3 px-4 rounded-lg font-medium transition-all`}
            onClick={() => downloadCSV()}
          >
            <TableCellsIcon className="h-6" />
          </button>
          <button
            className="flex bg-primary-blue text-white py-3 px-4 rounded-lg font-medium transition-all cursor-pointer hover:bg-dark-blue hover:scale-110"
            onClick={() => printOrders()}
          >
            <PrinterIcon className="h-6 w-6" />
          </button>
        </div>
        <section className="absolute top-0 right-5 mt-5 w-[30%] 2xl:w-auto ">
          <div className="flex gap-2">
            {filterType !== "range" &&
              formatDateToShow(workDate) === formattedDate && (
                <div className="px-4 py-4 rounded-3xl flex items-center justify-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <div>
                    <h1 className=" text-lg 2xl:text-xl font-bold text-dark-blue">
                      Today
                    </h1>
                    <div className="flex items-center justify-center text-center">
                      <div className="pr-1">
                        <p className="text-4xl  2xl:text-5xl font-bold text-primary-blue">
                          {ordersWorkDate}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 text-left">
                        <h2 className="text-sm text-dark-blue px-1 font-medium">
                          Orders
                        </h2>
                        <div className="flex items-center text-center justify-center py-1 px-2 w-[80px] 2xl:w-[95px] rounded-lg text-sm bg-background-green">
                          <CalendarIcon className="h-4 w-4 text-green" />
                          <h2 className="ml-1 text-green">
                            {formatDateToShow(workDate)}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* TODO AGREGAR EN ESTE DIV EL PORCENTAJE DE LOADING PARA RUTA SELECCIONADA */}
                  <div className="flex col-span-1 items-center justify-center">
                    {showPercentage === null ? (
                      <div className="flex items-center justify-center bg-primary-blue rounded-full w-8 h-8 2xl:w-16 2xl:h-16">
                        <Image
                          src="/loadingBlanco.png"
                          alt="Percent"
                          width={200}
                          height={200}
                          className="w-6 h-4 2xl:w-10 2xl:h-7"
                        />
                      </div>
                    ) : (
                      <CircleProgressBar percentage={showPercentage} />
                    )}
                  </div>
                </div>
              )}

            <div className="flex gap-3 px-4 py-4 items-center justify-center rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div>
                <h1 className="flex text-lg 2xl:text-xl font-bold items-center justify-center">
                  Total net
                </h1>
                <div className="flex justify-center text-center">
                  <p className="text-lg 2xl:text-[25px] font-bold text-primary-blue p-0 m-0">
                    £
                    {totalNet.total_net
                      ? parseFloat(totalNet.total_net).toFixed(2)
                      : "0"}
                  </p>
                </div>
              </div>
              <div className="border-l border-green border-dashed">
                <h1 className="flex text-lg 2xl:text-xl font-bold items-center justify-center">
                  Profit
                </h1>
                <div className="flex justify-center text-center">
                  <div>
                    <p className="text-lg 2xl:text-[25px] font-bold text-primary-blue pl-2">
                      {totalNet.profit
                        ? parseFloat(totalNet.profit).toFixed(2)
                        : "0"}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center mb-20 mt-4  p-2">
          <table className="w-[95%] bg-white first-line:bg-white rounded-2xl text-left shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="relative top-0 text-center shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="  text-dark-blue">
                <th className="py-4 flex items-center justify-center rounded-tl-lg">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500"
                      onChange={(e) => selectAll(e.target.checked)}
                    />
                  </label>
                </th>
                <th className="py-4"># Invoice</th>
                <th className="py-4">Acc number</th>
                <th className="py-4">Customer</th>
                <th className="py-4">Amount</th>
                <th className="py-4">Profit %</th>
                <th className="py-4">Route</th>
                <th className="py-4">Drop</th>
                <th className="py-4"># Products</th>
                {/* <th className="py-4">Responsable</th> */}
                <th className="py-4">Delivery date</th>
                <th className="py-4 rounded-tr-lg">
                  Status{" "}
                  <select
                    onChange={handleStatusChange}
                    className="w-[15px] ml-[2px]"
                  >
                    <option value="">All</option>
                    {uniqueStatuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </th>
              </tr>
            </thead>

            <tbody>
              {!isLoading &&
                (filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="text-dark-blue border-b-[1.5px] cursor-pointer hover:bg-[#F6F6F6]"
                    >
                      <td className="py-4 pl-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-500"
                            checked={!!selectedOrders[order.reference]}
                            onChange={(e) => {
                              handleOrderSelect(order, e.target.checked);
                              if (e.target.checked) {
                                setRouteId(order.route_id);
                              }
                            }}
                          />
                        </label>
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.reference}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.accountNumber}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.accountName}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.net}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.profitOrder ? order.profitOrder.toFixed(2) : ""}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.route}
                      </td>
                      {/* <td className="py-4 pl-4">{order.created_by}</td> */}
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.drop}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.quantity_products}
                      </td>
                      <td
                        className="py-4 pl-4"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        {order.date_delivery}
                      </td>
                      <td
                        className="py-4 pl-4 flex gap-2 justify-center"
                        onClick={(e) => goToOrder(e, order)}
                      >
                        <div
                          className={`inline-block mt-1 rounded-full text-white ${statusColorClass(
                            order.status_order
                          )} w-3 h-3 flex items-center justify-center`}
                        ></div>
                        {order.status_order}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-4 text-center text-dark-blue">
                      <p className="flex items-center justify-center text-gray my-10">
                        <ExclamationCircleIcon class="h-12 w-12 mr-10 text-gray" />
                        Results not found. Try a different search!
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
