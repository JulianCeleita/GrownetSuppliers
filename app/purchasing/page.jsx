"use client";
import {
  ArrowRightCircleIcon,
  MinusCircleIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import EditPresentation from "../../app/components/EditPresentation";
import {
  deletePresentationUrl, purchasingCreate,
  purchasingUrl,
  wholesalersUrl,
} from "../../app/config/urls.config";
import useTokenStore from "../../app/store/useTokenStore";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";
import useUserStore from "../store/useUserStore";
import Select, { menuPortalTarget } from "react-select";
import CreateProduct from "../components/CreateProduct";
import AutomaticShort from "../components/AutomaticShort";
import DatePicker from "react-datepicker";
import useWorkDateStore from "../store/useWorkDateStore";
import ModalSuccessfull from "../components/ModalSuccessfull";
import ModalOrderError from "../components/ModalOrderError";
import {
  fetchOrderWholesaler,
  fetchWholesalerList,
} from "../api/purchasingRequest";

function Purchasing() {
  const { token } = useTokenStore();
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [filterType, setFilterType] = useState("date");
  const [selectedDate, setSelectedDate] = useState("");
  const { user, setUser } = useUserStore();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editableRows, setEditableRows] = useState({});
  const [dateFilter, setDateFilter] = useState("today");
  const [filteredOrdersWholesaler, setFilteredOrdersWholesaler] = useState([]);
  const [wholesalerList, setWholesalerList] = useState([]);
  const [selectedWholesalers, setSelectedWholesalers] = useState(
    Array(filteredOrdersWholesaler.length).fill(null)
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [isSendOrderDisabled, setIsSendOrderDisabled] = useState(true);

  const defaultDate = new Date();
  const [startDate, setStartDate] = useState(workDate || defaultDate);
  const [endDate, setEndDate] = useState(workDate || defaultDate);
  const [searchQuery, setSearchQuery] = useState("");

  const formatDateToShow = (dateString) => {
    if (!dateString) return "Loading...";

    const parts = dateString.split("-").map((part) => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

    const day = String(utcDate.getUTCDate()).padStart(2, "0");
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
    const year = String(utcDate.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  //Api
  const [ordersWholesaler, setOrdersWholesaler] = useState([]);

  useEffect(() => {
    fetchOrderWholesaler(
      startDate,
      endDate,
      token,
      setOrdersWholesaler,
      setIsLoading
    );
  }, [workDate, token, endDate, startDate]);

  useEffect(() => {
    setStartDate(workDate);
    setEndDate(workDate);
  }, [workDate]);

  useEffect(() => {
    fetchWholesalerList(token, setWholesalerList);
  }, []);

  useEffect(() => {
    // Filter by search
    const filteredOrdersBySearch = searchQuery
      ? ordersWholesaler.filter(
          (order) =>
            order.product_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.presentation_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.presentation_code
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : ordersWholesaler;

    // Filter by state
    const filteredOrdersByShort =
      selectedStatus === "short"
        ? filteredOrdersBySearch.filter((order) => order.short > 0)
        : selectedStatus === "available"
        ? filteredOrdersBySearch.filter((order) => order.short === 0)
        : filteredOrdersBySearch;

    // Filter by category
    const filteredOrdersByCategory =
      selectedCategory === ""
        ? filteredOrdersByShort
        : filteredOrdersByShort.filter(
            (order) => order.category_name === selectedCategory
          );

    setFilteredOrdersWholesaler(filteredOrdersByCategory);
  }, [ordersWholesaler, selectedStatus, selectedCategory, searchQuery]);

  useEffect(() => {
    const updatedOrders = ordersWholesaler.map((order, index) => ({
      ...order,
      wholesaler_id: selectedWholesalers[index]?.value || order.wholesaler_id,
      quantity: editableRows[index]?.quantity || order.quantity,
      cost: editableRows[index]?.cost || order.cost,
      note: editableRows[index]?.notes || order.note,
    }));
    setFilteredOrdersWholesaler(updatedOrders);
  }, [ordersWholesaler, editableRows]);

  const checkIfAnyProductHasQuantity = () => {
    return filteredOrdersWholesaler.some(order => order.quantity > 0);
  };

  useEffect(() => {
    setIsSendOrderDisabled(!checkIfAnyProductHasQuantity());
  }, [filteredOrdersWholesaler]);



  const handleEditField = (key, rowIndex, e) => {
    const value = e.target.value;
    const updatedRows = { ...editableRows };
    if (!updatedRows[rowIndex]) {
      updatedRows[rowIndex] = {};
    }
    updatedRows[rowIndex][key] = value;
    setEditableRows(updatedRows);
    console.log("Editable Rows:", updatedRows);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const uniqueCategories = [...new Set(ordersWholesaler.map(order => order.category_name))];

  const sendOrder = async () => {
    try {
      const ordersToSend = filteredOrdersWholesaler.filter(order => order.quantity > 0);
      console.log("🚀 ~ sendOrder ~ ordersToSend:", ordersToSend)

      const sendData = {
        orders_wholesaler: ordersToSend.map((order, index) => ({
          presentation_code: order.presentation_code,
          wholesaler_id: selectedWholesalers[index] ? selectedWholesalers[index].value : null,
          date_delivery: workDate,
          note: order.note,
          cost: order.cost,
          purchasing_qty: order.quantity
        }))
      };
      console.log("🚀 ~ sendOrder ~ sendData:", sendData)

      const response = await axios.post(purchasingCreate, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)

      if (response.status === 200) {
        fetchOrderWholesaler(startDate, endDate, token, setOrdersWholesaler, setIsLoading)
        setSelectedWholesalers(Array(filteredOrdersWholesaler.length).fill(null));
        setEditableRows({});
        setFilteredOrdersWholesaler([]);
        setShowSuccessModal(true)
      }

    } catch (error) {
      setMessageError(error.response.data.message);
      setShowErrorModal(true);
      console.error(error);
    }
  };


  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 -mt-24 overflow">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            <span className="text-light-green">Purchasing </span> list
          </h1>

          <div className="flex gap-4">
            <button
              className={`flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:scale-110 transition-all ${isSendOrderDisabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              type="button"
              onClick={sendOrder}
              disabled={isSendOrderDisabled}
            >
              <ArrowRightCircleIcon className="h-6 w-6 mr-2 font-bold" />
              Send Purchasing
            </button>
          </div>
        </div>
        <div className="flex ml-5 mb-4 gap-2">
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
                className="form-input px-3 py-3 rounded-md border border-gray-300 w-[120px] text-sm custom:text-base"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
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
                className="form-input px-3 py-3 w-[120px] rounded-md border border-gray-300 text-sm custom:text-base"
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
                setDateFilter("date");
              }}
              className="form-input px-3 py-3 w-[95px] rounded-md border border-gray-300 text-dark-blue placeholder-dark-blue text-sm custom:text-base"
              dateFormat="dd/MM/yyyy"
              placeholderText={formatDateToShow(workDate)}
            />
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select px-2 py-3 rounded-md border border-gray-300 text-sm custom:text-base w-[155px]"
          >
            <option value="" disabled selected>
              Select status:
            </option>
            <option value="all">All</option>
            <option value="short">Short</option>
            <option value="available">Availables</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select px-2 py-3 rounded-md border border-gray-300 text-sm custom:text-base w-[155px]"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center mb-20 overflow-x-auto">
          <table className="w-[95%] bg-white first-line:bg-white rounded-2xl text-left shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th
                  className="p-4 rounded-tl-lg cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("code")}
                >
                  Code
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("supplier")}
                >
                  Supplier
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("description")}
                >
                  Description
                </th>
                {/* <th className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("soh")}>
                  SOH
                </th> */}
                <th className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("requisition")}>
                  Requisition
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("futureRequisition")}
                >
                  Future Requisition
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("shorts")}
                >
                  Shorts
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("ordered")}
                >
                  Ordered
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("cost")}
                >
                  Cost
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("totalCost")}
                >
                  Total Cost
                </th>
                <th
                  className="p-4 rounded-tr-lg cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("notes")}
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdersWholesaler?.map((order, index) => {
                const quantity = editableRows[index]?.quantity || order.quantity;
                const cost = editableRows[index]?.cost || order.cost;
                const totalCost = isNaN(quantity * cost) ? 0 : quantity * cost;
                return (
                  <tr className="text-dark-blue border-b-2 border-stone-100">
                    <td className="py-4 pl-3">{order.presentation_code}</td>
                    <td className="py-4">
                      <Select
                        value={selectedWholesalers[index]}
                        onChange={(selectedOption) => {
                          const newSelectedWholesalers = [...selectedWholesalers];
                          newSelectedWholesalers[index] = selectedOption;
                          setSelectedWholesalers(newSelectedWholesalers);
                        }}
                        options={wholesalerList?.map(wholesaler => ({
                          value: wholesaler.id,
                          label: wholesaler.name
                        }))}
                        menuPortalTarget={document.body}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "none",
                            boxShadow: "none",
                            backgroundColor: "transparent",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            width: "33em",
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            color: "#04444F",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            display: "none",
                          }),
                          indicatorSeparator: (provided) => ({
                            ...provided,
                            display: "none",
                          }),
                        }}
                      />
                    </td>
                    <td className="py-4">{order.product_name} - {order.presentation_name}</td>
                    {/* <td className="py-4">{order.soh}</td> */}
                    <td className="py-4">{order.requisitions}</td>
                    <td className="py-4">{order.future_requisitions}</td>
                    <td className="py-4">{order.short}</td>
                    <td className="py-4">{order.ordered}</td>
                    <td className="py-4">
                      <input
                        type="number"
                        value={editableRows[index]?.quantity || order.quantity}
                        onChange={(e) => handleEditField("quantity", index, e)}
                        className="w-16 px-2 py-1 rounded-md border-none text-sm"
                        style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="number"
                        step="0.01"
                        value={editableRows[index]?.cost || order.cost}
                        onChange={(e) => handleEditField("cost", index, e)}
                        className="w-16 px-2 py-1 rounded-md border-none text-sm"
                        style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                      />
                    </td>
                    <td className="py-4">{totalCost}</td>
                    <td className="py-4">
                      <input
                        type="text"
                        value={editableRows[index]?.notes || order.note}
                        onChange={(e) => handleEditField("notes", index, e)}
                        className="w-32 px-2 py-1 rounded-md border-none text-sm"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
        <ModalSuccessfull
          isvisible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Congratulations"
          text="Order sended successfully"
          button=" Close"
        />
        <ModalOrderError
          isvisible={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          error={messageError}
          title={"Error sending order"}
        />
      </div>
    </Layout>
  );
}
export default Purchasing;
