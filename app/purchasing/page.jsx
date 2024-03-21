"use client";
import {
  ArrowRightCircleIcon,
  TrashIcon,
  FunnelIcon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { purchasingCreate } from "../../app/config/urls.config";
import useTokenStore from "../../app/store/useTokenStore";
import Layout from "../layoutS";
import Select from "react-select";
import DatePicker from "react-datepicker";
import useWorkDateStore from "../store/useWorkDateStore";
import ModalSuccessfull from "../components/ModalSuccessfull";
import ModalOrderError from "../components/ModalOrderError";
import {
  fetchOrderWholesaler,
  fetchWholesalerList,
} from "../api/purchasingRequest";
import usePerchasingStore from "../store/usePurchasingStore";
import ModalSendPurchasing from "../components/ModalSendPurchasing";

function Purchasing() {
  const { token } = useTokenStore();
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterType, setFilterType] = useState("date");
  const [selectedDate, setSelectedDate] = useState("");
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
  const [modalSendPurchasing, setModalSendPurchasing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showWholesalerFilter, setShowWholesalerFilter] = useState(false);
  const [isCheckedCategories, setIsCheckedCategories] = useState([]);
  const [isCheckedWholesalert, setIsCheckedWholesalert] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleCheckboxChange = (event, category) => {
    const { checked } = event.target;
    setIsCheckedCategories((prevCheckedCategories) => {
      if (checked) {
        return [...prevCheckedCategories, category];
      } else {
        return prevCheckedCategories.filter((item) => item !== category);
      }
    });
  };
  const handleCheckboxWholesalertChange = (event, wholesalert) => {
    const { checked } = event.target;
    setIsCheckedWholesalert((prevCheckedWholesalert) => {
      if (checked) {
        return [...prevCheckedWholesalert, wholesalert];
      } else {
        return prevCheckedWholesalert.filter((item) => item !== wholesalert);
      }
    });
  };
  //Cerrar filtros al oprimir afuera de la pantalla
  const categoriesRef = useRef(null);
  const wholesalerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target) &&
        wholesalerRef.current &&
        !wholesalerRef.current.contains(event.target)
      ) {
        setShowCategories(false);
        setShowWholesalerFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { products, setProducts } = usePerchasingStore();

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
    fetchWholesalerList(token, setWholesalerList);
  }, [endDate, startDate]);

  useEffect(() => {
    const newStartDate = new Date(workDate);
    newStartDate.setDate(newStartDate.getDate() + 1);
    setStartDate(newStartDate);

    const newEndDate = new Date(workDate);
    newEndDate.setDate(newEndDate.getDate() + 1);
    setEndDate(newEndDate);
  }, [workDate]);
  const applyFilters = () => {
    console.log(currentPage);
    // Filtrar por búsqueda
    let filteredOrdersBySearch = searchQuery
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

    // Filtrar por estado
    filteredOrdersBySearch =
      selectedStatus === "short"
        ? filteredOrdersBySearch.filter((order) => order.short > 0)
        : selectedStatus === "available"
          ? filteredOrdersBySearch.filter((order) => order.short === 0)
          : filteredOrdersBySearch;

    // Filtrar por categorías seleccionadas
    if (isCheckedCategories.length > 0) {
      filteredOrdersBySearch = filteredOrdersBySearch.filter((order) =>
        isCheckedCategories.includes(order.category_name)
      );
    }

    // Filtrar por mayoristas seleccionados
    if (isCheckedWholesalert.length > 0) {
      filteredOrdersBySearch = filteredOrdersBySearch.filter((order) =>
        isCheckedWholesalert.includes(order.wholesaler_name)
      );
    }

    // Ordenar los pedidos filtrados
    const sortedOrders = filteredOrdersBySearch.slice().sort((a, b) => {
      if (sortColumn) {
        const valueA =
          typeof a[sortColumn] === "number"
            ? a[sortColumn]
            : a[sortColumn]?.toLowerCase?.();
        const valueB =
          typeof b[sortColumn] === "number"
            ? b[sortColumn]
            : b[sortColumn]?.toLowerCase?.();
        if (sortDirection === "asc") {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      } else {
        return 0;
      }
    });

    const totalPages = Math.ceil(filteredOrdersBySearch.length / itemsPerPage);

    return { sortedOrders, totalPages };
  };

  useEffect(() => {
    const { sortedOrders, totalPages } = applyFilters();
    setFilteredOrdersWholesaler(sortedOrders);
  }, [
    isCheckedWholesalert,
    isCheckedCategories,
    ordersWholesaler,
    selectedStatus,
    searchQuery,
    editableRows,
  ]);
  useEffect(() => {
    setCurrentPage(1);
  }, [
    isCheckedWholesalert,
    isCheckedCategories,
    ordersWholesaler,
    selectedStatus,
    searchQuery,
  ]);

  const checkIfAnyProductHasQuantity = () => {
    return products.some((order) => order.quantity > 0);
  };

  useEffect(() => {
    setIsSendOrderDisabled(!checkIfAnyProductHasQuantity());
  }, [products]);

  useEffect(() => {
    const updatedProducts = products.map((product) => {
      const editableRow = editableRows[product.presentation_code];
      if (editableRow) {
        return { ...product, ...editableRow };
      }

      return product;
    });

    const newProducts = Object.keys(editableRows)
      .filter((productCode) => {
        return !products.some(
          (product) => product.presentation_code === productCode
        );
      })
      .map((productCode) => ({
        presentation_code: productCode,
        ...editableRows[productCode],
      }));

    setProducts([...updatedProducts, ...newProducts]);
  }, [editableRows]);

  const handleEditField = (key, productCode, value) => {
    if (key === "quantity" && isNaN(value)) {
      return;
    }

    setEditableRows((prevEditableRows) => ({
      ...prevEditableRows,
      [productCode]: {
        ...prevEditableRows[productCode],
        [key]: value,
      },
    }));

    const updatedProducts = products.map((product) => {
      if (product.presentation_code === productCode) {
        return { ...product, [key]: value };
      }
      return product;
    });
    setProducts(updatedProducts);
  };
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedOrders = filteredOrdersWholesaler.slice().sort((a, b) => {
    if (sortColumn) {
      const valueA =
        typeof a[sortColumn] === "number"
          ? a[sortColumn]
          : a[sortColumn]?.toLowerCase?.();
      const valueB =
        typeof b[sortColumn] === "number"
          ? b[sortColumn]
          : b[sortColumn]?.toLowerCase?.();
      if (sortDirection === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    } else {
      return 0;
    }
  });
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const uniqueCategories = [
    ...new Set(ordersWholesaler.map((order) => order.category_name)),
  ];

  const sendOrder = async () => {
    try {
      const sendData = {
        orders_wholesaler: products.map((order) => ({
          presentation_code: order.presentation_code,
          wholesaler_id: order.wholesaler,
          date_delivery: workDate,
          note: order.notes,
          cost: order.cost,
          purchasing_qty: order.quantity,
        })),
      };
      console.log("🚀 ~ sendOrder ~ sendData:", sendData);

      const response = await axios.post(purchasingCreate, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      if (response.status === 200) {
        fetchOrderWholesaler(
          startDate,
          endDate,
          token,
          setOrdersWholesaler,
          setIsLoading
        );
        setSelectedWholesalers(
          Array(filteredOrdersWholesaler.length).fill(null)
        );
        setEditableRows({});
        setFilteredOrdersWholesaler([]);
        setShowSuccessModal(true);
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
              className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:scale-110 transition-all"
              type="button"
              //onClick={() => setModalSendPurchasing(true)}
              onClick={sendOrder}
            >
              <ArrowRightCircleIcon className="h-6 w-6 mr-2 font-bold" />
              Send Purchasing
            </button>
          </div>
        </div>
        <div className="flex mx-8 mb-4 items-center justify-between ">
          <div className="flex gap-1">
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
                  setStartDate(date);
                  setEndDate(date);
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
          </div>
          <div className="flex gap-5">
            <div ref={categoriesRef} className="relative ">
              <button
                className={`${!showCategories ? "text-gray-grownet" : "text-primary-blue"
                  } hover:scale-110 hover:text-primary-blue transition-all`}
                onClick={() => {
                  setShowCategories(!showCategories);
                  setShowWholesalerFilter(false);
                }}
              >
                <FunnelIcon className="h-8 w-8" />
              </button>
              {showCategories && (
                <div className="bg-white w-[280px] p-3 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] absolute z-10 -right-16">
                  {uniqueCategories.map((category) => (
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={isCheckedCategories.includes(category)}
                        onChange={(event) =>
                          handleCheckboxChange(event, category)
                        }
                        className="form-checkbox h-4 w-4 text-primary-blue cursor-pointer"
                      />
                      <p key={category} value={category}>
                        {category}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={wholesalerRef} className="relative ">
              <button
                className={`${!showWholesalerFilter
                  ? "text-gray-grownet"
                  : "text-primary-blue"
                  } hover:scale-110 hover:text-primary-blue transition-all`}
                onClick={() => {
                  setShowWholesalerFilter(!showWholesalerFilter);
                  setShowCategories(false);
                }}
              >
                <Bars3BottomRightIcon className="h-8 w-8" />
              </button>
              {showWholesalerFilter && (
                <div className="bg-white p-3 w-[280px] rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] absolute z-10 -right-[15px]">
                  {wholesalerList.map((wholesalert) => (
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={isCheckedWholesalert.includes(
                          wholesalert.name
                        )}
                        onChange={(event) =>
                          handleCheckboxWholesalertChange(
                            event,
                            wholesalert.name
                          )
                        }
                        className="form-checkbox h-4 w-4 text-primary-blue cursor-pointer"
                      />
                      <p key={wholesalert.id}>{wholesalert.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-20 overflow-x-auto">
          <table className="w-[95%] bg-white first-line:bg-white rounded-2xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white text-center shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th
                  className="p-4 rounded-tl-lg cursor-pointer hover:bg-gray-100 transition-all select-none"
                  onClick={() => handleSort("presentation_code")}
                >
                  Code
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all w-[240px] select-none"
                  onClick={() => handleSort("supplier")}
                >
                  Supplier
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all select-none"
                  onClick={() => handleSort("product_name")}
                >
                  Description
                </th>
                {/* <th className="p-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => handleSort("soh")}>
                  SOH
                </th> */}
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all select-none"
                  onClick={() => handleSort("requisitions")}
                >
                  Requisition
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all select-none"
                  onClick={() => handleSort("future_requisitions")}
                >
                  Future Requisition
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all select-none"
                  onClick={() => handleSort("short")}
                >
                  Shorts
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all select-none"
                  onClick={() => handleSort("ordered")}
                >
                  Ordered
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all w-[100px] select-none"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all w-[75px] select-none"
                  onClick={() => handleSort("cost")}
                >
                  Cost
                </th>
                <th
                  className="p-4 cursor-pointer hover:bg-gray-100 transition-all w-[100px] select-none"
                  onClick={() => handleSort("totalCost")}
                >
                  Total Cost
                </th>
                <th
                  className="p-4 rounded-tr-lg cursor-pointer hover:bg-gray-100 transition-all w-[200px] select-none"
                  onClick={() => handleSort("note")}
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdersWholesaler
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((order, index) => {
                  const quantity =
                    editableRows[order.presentation_code]?.quantity ||
                    order.quantity;
                  const cost =
                    editableRows[order.presentation_code]?.cost || order.cost;
                  const totalCost = isNaN(quantity * cost)
                    ? 0
                    : quantity * cost;

                  const wholesalerOptions = wholesalerList?.map(
                    (wholesaler) => ({
                      value: wholesaler.id,
                      label: wholesaler.name,
                    })
                  );
                  return (
                    <tr className="text-dark-blue border-b-2 border-stone-100">
                      <td className="py-4 pl-3">{order.presentation_code}</td>
                      <td className="py-4">
                        <Select
                          value={
                            editableRows[order.presentation_code]?.wholesaler
                              ? wholesalerOptions.find(
                                (option) =>
                                  option.value ===
                                  editableRows[order.presentation_code]
                                    ?.wholesaler
                              )
                              : null
                          }
                          onChange={(selectedOption) => {
                            handleEditField(
                              "wholesaler",
                              order.presentation_code,
                              selectedOption.value
                            );
                          }}
                          options={wholesalerOptions}
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
                      <td className="py-4">
                        {order.product_name} - {order.presentation_name}
                      </td>
                      {/* <td className="py-4">{order.soh}</td> */}
                      <td className="py-4 pl-4">{order.requisitions}</td>
                      <td className="py-4">{order.future_requisitions}</td>
                      <td className="py-4">{order.short}</td>
                      <td className="py-4">{order.ordered}</td>
                      <td className="py-4">
                        <input
                          type="number"
                          value={
                            editableRows[order.presentation_code]?.quantity ||
                            order.quantity ||
                            ""
                          }
                          onChange={(e) =>
                            handleEditField(
                              "quantity",
                              order.presentation_code,
                              e.target.value
                            )
                          }
                          className="pl-2 h-[30px] outline-none w-full hide-number-arrows"
                          style={{
                            WebkitAppearance: "none",
                            MozAppearance: "textfield",
                          }}
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          step="0.01"
                          value={
                            editableRows[order.presentation_code]?.cost ||
                            order.cost ||
                            ""
                          }
                          onChange={(e) =>
                            handleEditField(
                              "cost",
                              order.presentation_code,
                              e.target.value
                            )
                          }
                          className="pl-2 h-[30px] outline-none w-full hide-number-arrows"
                          style={{
                            WebkitAppearance: "none",
                            MozAppearance: "textfield",
                          }}
                        />
                      </td>
                      <td className="py-4">{totalCost}</td>
                      <td className="py-4">
                        <input
                          type="text"
                          value={
                            editableRows[order.presentation_code]?.notes ||
                            order.note ||
                            ""
                          }
                          onChange={(e) =>
                            handleEditField(
                              "notes",
                              order.presentation_code,
                              e.target.value
                            )
                          }
                          className="pl-2 h-[30px] outline-none w-full hide-number-arrows"
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <div>

            </div>
          </table>
          {!isLoading && (
            <div className="flex items-center justify-center my-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 mr-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-md cursor-pointer transition-all hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm font-medium rounded-md cursor-pointer transition-all ${currentPage === totalPages
                      ? 'text-primary-blue bg-light-blue border border-gray-200'
                      : 'text-primary-blue bg-primary-blue-light border border-primary-blue-light hover:bg-primary-blue hover:border-primary-blue-dark hover:text-white focus:outline-none'
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
        {/* <ModalSendPurchasing
          isvisible={modalSendPurchasing}
          onClose={() => setModalSendPurchasing(false)}
          sendOrder={sendOrder}
          selectedWholesalers={selectedWholesalers}
        /> */}
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
