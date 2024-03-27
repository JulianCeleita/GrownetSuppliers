"use client";
import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../layoutS";
import useTokenStore from "../../store/useTokenStore";
import useUserStore from "../../store/useUserStore";
import useWorkDateStore from "../../store/useWorkDateStore";
import ModalOrderError from "../../components/ModalOrderError";
import ModalSuccessfull from "../../components/ModalSuccessfull";
import { fetchOrdersHistory } from "@/app/api/orderHistoryRequest";

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

const OrderHistory = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const { workDate } = useWorkDateStore();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  const [dateFilter, setDateFilter] = useState("today");
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateByNet, setStartDateByNet] = useState("");
  const [endDateByNet, setEndDateByNet] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [filterType, setFilterType] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWholesaler, setSelectedWholesaler] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showErrorCsv, setShowErrorCsv] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModalSuccessfull, setShowModalSuccessfull] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [errorCsvMessage, setErrorCsvMessage] = useState("");
  const [sortList, setSortList] = useState("po_number");
  const [sortType, setSortType] = useState(false);
  const [ordersHistory, setOrdersHistory] = useState([]);

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
    fetchOrdersHistory(
      workDate,
      startDateByNet,
      endDateByNet,
      token,
      setOrdersHistory,
      setIsLoading
    );
  }, [endDateByNet, startDateByNet, workDate]);

  console.log("setOrdersHistory:", ordersHistory);

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

  const handleGroupChange = (e) => {
    setSelectedWholesaler(e.target.value);
  };

  const sortedOrders = ordersHistory
    ?.filter((order) => filterOrdersByDate(order))
    .sort((a, b) => {
      const dateA = new Date(a.date_delivery);
      const dateB = new Date(b.date_delivery);
      return dateA - dateB;
    });

  const filteredOrders = sortedOrders
    ?.filter((order) => {
      const isWholesalerMatch = selectedWholesaler
        ? order.wholesaler_name.toLowerCase() ===
          selectedWholesaler.toLowerCase()
        : true;

      const isSearchQueryMatch =
        order.ordered
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.product_name.toLowerCase().includes(searchQuery.toLowerCase());

      const isStatusMatch = selectedStatus
        ? order.status_order.toLowerCase() === selectedStatus.toLowerCase()
        : true;

      return isWholesalerMatch && isSearchQueryMatch && isStatusMatch;
    })
    .sort((a, b) => {
      if (sortList === "po_number") {
        if (!sortType) {
          return a.po_number
            .toLowerCase()
            .localeCompare(b.po_number.toLowerCase());
        } else {
          return b.po_number
            .toLowerCase()
            .localeCompare(a.po_number.toLowerCase());
        }
      } else if (sortList === "wholesaler") {
        if (!sortType) {
          return a.wholesaler_name
            .toLowerCase()
            .localeCompare(b.wholesaler_name.toLowerCase());
        } else {
          return b.wholesaler_name
            .toLowerCase()
            .localeCompare(a.wholesaler_name.toLowerCase());
        }
      } else if (sortList === "category") {
        if (!sortType) {
          return a.category_name
            .toLowerCase()
            .localeCompare(b.category_name.toLowerCase());
        } else {
          return b.category_name
            .toLowerCase()
            .localeCompare(a.category_name.toLowerCase());
        }
      } else if (sortList === "code") {
        if (!sortType) {
          return a.presentation_code
            .toLowerCase()
            .localeCompare(b.presentation_code.toLowerCase());
        } else {
          return b.presentation_code
            .toLowerCase()
            .localeCompare(a.presentation_code.toLowerCase());
        }
      }
    });
  console.log("setSortList", sortList);
  const handleClickPoNumber = () => {
    setSortList("po_number");
    setSortType((prevSortType) => !prevSortType);
  };
  const handleClickWholesaler = () => {
    setSortList("wholesaler");
    setSortType((prevSortType) => !prevSortType);
  };
  const handleClickCategory = () => {
    setSortList("category");
    setSortType((prevSortType) => !prevSortType);
  };
  const handleClickCode = () => {
    setSortList("code");
    setSortType((prevSortType) => !prevSortType);
  };
  // const uniqueStatuses = [
  //   ...new Set(sortedOrders?.map((order) => order.status_order)),
  // ];

  // const handleStatusChange = (e) => {
  //   const newSelectedStatus = e.target.value;
  //   setSelectedStatus(newSelectedStatus);
  // };

  // const statusColorClass = (status) => {
  //   switch (status) {
  //     case "Delivered":
  //       return "bg-dark-blue";
  //     case "Solved":
  //     case "Loaded":
  //     case "Printed":
  //       return "bg-green";
  //     case "Dispute":
  //       return "bg-danger";
  //     case "Generated":
  //     case "Received":
  //     case "Preparing":
  //     case "Sent":
  //       return "bg-primary-blue";
  //     case "Packed":
  //       return "bg-orange-grownet";
  //     default:
  //       return "bg-primary-blue";
  //   }
  // };

  return (
    <Layout>
      <div className="-mt-24">
        <div className="flex gap-6 p-8">
          <h1 className="text-2xl text-light-green font-semibold mt-1 ml-24">
            Orders <span className="text-white">history</span>
          </h1>
        </div>
        <div
          className={`flex ml-7 mb-0 items-center space-x-2 ${
            window.innerWidth <= 1300 && filterType === "date"
              ? "mt-[70px]"
              : "mt-[8px]"
          }`}
        >
          <div className="border border-gray-300  rounded-md py-3 px-2 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="placeholder-[#04444F] outline-none text-sm custom:text-base w-[170px]"
            />
            {searchQuery != "" && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRoute("");
                  setSelectedWholesaler("");
                }}
              >
                <TrashIcon className="h-6 w-6 text-danger" />
              </button>
            )}
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select px-2 py-3 rounded-md border border-gray-300 text-sm custom:text-base w-[155px]"
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
                className="form-input px-3 py-3 rounded-md border border-gray-300 w-[130px] text-sm custom:text-base"
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
                className="form-input px-3 py-3 w-[130px] rounded-md border border-gray-300 text-sm custom:text-base"
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
              className="form-input px-3 py-3 w-[130px] rounded-md border border-gray-300 text-dark-blue placeholder-dark-blue text-sm custom:text-base"
              dateFormat="dd/MM/yyyy"
              placeholderText={formatDateToShow(workDate)}
            />
          )}

          <select
            value={selectedWholesaler}
            onChange={handleGroupChange}
            className="orm-select px-3 py-3 rounded-md border border-gray-300 text-sm custom:text-base"
          >
            <option value="">All Wholesalers</option>
            {[
              ...new Set(
                ordersHistory?.map((order) =>
                  order.wholesaler_name !== null ? order.wholesaler_name : "-"
                )
              ),
            ].map((uniqueGroup) => (
              <option key={uniqueGroup} className="text-black">
                {uniqueGroup}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center mb-20 mt-4  p-2">
          <table className="w-[95%] bg-white first-line:bg-white rounded-2xl text-left shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="relative top-0 text-center shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className=" text-dark-blue">
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all rounded-tl-lg"
                  onClick={handleClickPoNumber}
                >
                  PO Number
                </th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={handleClickWholesaler}
                >
                  Wholesaler
                </th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={handleClickCategory}
                >
                  Category
                </th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={handleClickCode}
                >
                  Code
                </th>
                <th className="py-4">Description</th>
                <th className="py-4">UOM</th>
                <th className="py-4">Orderd</th>
                <th className="py-4">Cost</th>
                <th className="py-4">Total cost</th>
                <th className="py-4 rounded-tr-lg">
                  Notes
                  {/* <select
                    onChange={handleStatusChange}
                    className="w-[15px] ml-[2px]"
                  >
                    <option value="">All</option>
                    {uniqueStatuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select> */}
                </th>
              </tr>
            </thead>

            <tbody>
              {!isLoading &&
                (filteredOrders?.length > 0 ? (
                  filteredOrders?.map((order, index) => (
                    <tr
                      key={index}
                      className="text-dark-blue border-b-[1.5px] cursor-pointer hover:bg-[#F6F6F6]"
                    >
                      <td
                        className="py-1 pl-5"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.po_number}
                      </td>
                      <td
                        className="py-1 pl-5"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.wholesaler_name}
                      </td>
                      <td
                        className="py-1 pl-4"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.category_name}
                      </td>
                      <td
                        className="py-1 text-center"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.presentation_code}
                      </td>
                      <td
                        className="py-1 text-left pl-5"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.product_name + " " + order.presentation_name}
                      </td>
                      <td
                        className="py-1 text-center"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.uom_name}
                      </td>

                      <td
                        className="py-1 text-center"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.ordered}
                      </td>
                      <td
                        className="py-1 text-center"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.cost}
                      </td>
                      <td
                        className="py-1 text-center"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.cost * order.ordered}
                      </td>
                      <td
                        className="py-1 text-left px-5"
                        //onClick={(e) => goToOrder(e, order)}
                      >
                        {order.note}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-4 text-center text-dark-blue">
                      <p className="flex items-center justify-center text-gray my-10">
                        <ExclamationCircleIcon className="h-12 w-12 mr-10 text-gray" />
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
      <ModalSuccessfull
        isvisible={showModalSuccessfull}
        onClose={() => setShowModalSuccessfull(false)}
        title="Congratulations"
        text="The csv was uploaded successfully, thank you for using"
        textGrownet="Grownet"
        button=" Close"
        confirmed={true}
      />
      <ModalOrderError
        isvisible={showModalError}
        onClose={() => setShowModalError(false)}
        title={"Error in CSV"}
        message={errorCsvMessage}
      />
    </Layout>
  );
};

export default OrderHistory;
