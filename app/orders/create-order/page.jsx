"use client";
import Table from "@/app/components/Table";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  customersData,
  customerSupplier,
  restaurantsData,
} from "../../config/urls.config";
import Layout from "../../layoutS";
import { useTableStore } from "../../store/useTableStore";
import useTokenStore from "../../store/useTokenStore";
import useUserStore from "../../store/useUserStore";
import { fetchCustomersDate } from "@/app/api/ordersRequest";
import ModalOrderError from "@/app/components/ModalOrderError";
const CreateOrderView = () => {
  const { token } = useTokenStore();
  const {
    customers,
    setCustomers,
    totalNetSum,
    totalPriceSum,
    totalTaxSum,
    totalCostSum,
    totalProfit,
    totalProfitPercentage,
  } = useTableStore();
  const [details, setDetails] = useState(false);
  const [restaurants, setRestaurants] = useState(null);
  const [selectedAccNumber, setSelectedAccNumber] = useState("");
  const [selectedAccNumber2, setSelectedAccNumber2] = useState("");
  const [selectedAccName, setSelectedAccName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNameDropdownVisible, setIsNameDropdownVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(getCurrentDate());
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [confirmCreateOrder, setConfirmCreateOrder] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState("");
  const { user, setUser } = useUserStore();
  const [customerDate, setCustomerDate] = useState("");
  const [customerRef, setCustomerRef] = useState("");
  const [isDateInputActive, setIsDateInputActive] = useState(false);
  const dateInputRef = useRef(null);
  const accountInputRef = useRef(null);
  const customerInputRef = useRef(null);
  const [shouldFocusCode, setShouldFocusCode] = useState(false);
  const [sendData, setSendData] = useState(false);
  const [filledRowCount, setFilledRowCount] = useState(0);
  const [showErrorRoutes, setShowErrorRoutes] = useState(false);
  const [arrows, setArrows] = useState(false);
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    setCustomers([])
  }, [])
  
  
  //Fecha input
  function getCurrentDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getCurrentDateMin() {
    const today = new Date();
    today.setDate(today.getDate());
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRestaurants = await axios.get(restaurantsData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedRestaurants = responseRestaurants.data.customers.sort(
          (a, b) => a.accountName.localeCompare(b.accountName)
        );
        setRestaurants(sortedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants data", error);
      }
    };
    const fetchDataBySupplier = async () => {
      try {
        const responseRestaurants = await axios.get(
          `${customerSupplier}${user.id_supplier}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedRestaurants = responseRestaurants.data.customers.sort(
          (a, b) => a?.accountName?.localeCompare(b.accountName)
        );
        setRestaurants(sortedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants data by supplier", error);
      }
    };
    if (user?.ron_name !== "AdminGrownet") {
      fetchDataBySupplier();
    } else {
      fetchData();
    }
    if (selectedAccNumber) {
      setSelectedAccName(null);
      fetchDataAccNumber();
    }
    if (selectedAccName) {
      setSelectedAccNumber(null);
      fetchDataAccName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedAccNumber, selectedAccName]);
  useEffect(() => {
    if (accountInputRef.current) {
      accountInputRef.current.focus();
    }
  }, []);
  // Click en la pantalla
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownVisible(false);
      setIsNameDropdownVisible(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible, isNameDropdownVisible, customers]);
  const fetchDataAccNumber = async () => {
    try {
      const responseAccNumber = await axios.get(
        `${customersData}${selectedAccNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedCustomers = {
        ...responseAccNumber.data.customer,
        orderDate: orderDate,
      };
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error fetching AccNumber data", error);
    }
  };
  const fetchDataAccName = async () => {
    try {
      const responseAccNumber = await axios.get(
        `${customersData}${selectedAccName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedCustomers = {
        ...responseAccNumber.data.customer,
        orderDate: orderDate,
      };
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error fetching AccNumber data", error);
    }
  };
  useEffect(() => {
    fetchCustomersDate(token, orderDate, selectedAccNumber2, setCustomerDate);
  }, [orderDate, selectedAccNumber2, arrows]);

  useEffect(() => {
    if (!accept) {
      if (customerDate && customerDate[0].nameRoute === "R100") {
        setShowErrorRoutes(true);
      }
    }
  }, [customerDate, accept]);

  const restaurantList = Array.isArray(restaurants) ? restaurants : [];
  //VENTANA TOTAL
  const [showCheckboxColumnTotal, setShowCheckboxColumnTotal] = useState(false);
  const menuRefTotal = useRef(null);
  const { initialTotalRows, toggleTotalRowVisibility } = useTableStore();
  const columnsTotal = [
    { name: "Net Invoice", price: "£ " + totalNetSum },
    { name: "Total VAT", price: "£ " + totalTaxSum },
    { name: "Total Invoice", price: "£ " + totalPriceSum },
    {
      name: "Profit (£)",
      price: "£ " + totalProfit,
      percentage: totalProfitPercentage + "%",
    },
    { name: "Profit (%)", price: totalProfitPercentage + "%" },
  ];
  // const handleContextMenuTotal = (e) => {
  //   e.preventDefault();
  //   setShowCheckboxColumnTotal(!showCheckboxColumnTotal);
  //   setMouseCoords({ x: e.clientX, y: e.clientY });
  // };
  // const handleCheckboxChangeTotal = (columnName) => {
  //   toggleTotalRowVisibility(columnName);
  // };
  const handleClickOutsideTotal = (e) => {
    if (menuRefTotal.current && !menuRefTotal.current.contains(e.target)) {
      setShowCheckboxColumnTotal(false);
    }
  };
  const handleSelectChange = (selectedOption) => {
    setSelectedAccName(selectedOption.value);
    setIsDropdownVisible(false);
    setSelectedAccNumber2(selectedOption.accNumber);
    if (customerInputRef.current) {
      customerInputRef.current.focus();
    }
  };
  const handleDateChange = (e) => {
    setOrderDate(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (customerInputRef.current) {
      customerInputRef.current.focus();
    }
  };
  const handleDateRef = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus();
    }
  };
  const resetStates = () => {
    setCustomers("");
    setSelectedAccName("");
    setSelectedAccNumber2("");
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //RUN BUTTON WITH CRT + ENTER
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      setConfirmCreateOrder(true);
    }
  };
  const handleCustomerRefKeyDown = (event) => {
    if (event.key === "Enter") {
      setShouldFocusCode(true);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleOnBlur = () => {
    setArrows(false);
  };
  const handleOnBlurDate = () => {
    setAccept(false);
    setArrows(true);
  };
  return (
    <Layout>
      <div className="max-w-[650px] -mt-[110px] ml-[115px]">
        <div className="flex mt-1 items-center">
          <h3 className="w-[42%] text-white">Account name:</h3>
          <div className="relative mb-2 w-[100%]">
            <Select
              ref={accountInputRef}
              options={restaurantList.map((restaurant) => ({
                value: restaurant.accountName,
                label: restaurant.accountName,
                accNumber: restaurant.accountNumber,
              }))}
              onChange={handleSelectChange}
              value={{
                value: selectedAccNumber,
                label:
                  customers && customers[0]?.accountName
                    ? customers[0].accountName
                    : "Search...",
              }}
              isSearchable
            />
          </div>
        </div>
        <div className="flex items-center">
          <h3 className="w-[42%] text-white">Account number:</h3>
          <div className="relative mb-2 w-[100%]">
            <Select
              options={restaurantList.map((restaurant) => ({
                value: restaurant.accountNumber,
                label: restaurant.accountNumber,
              }))}
              onChange={(selectedOption) => {
                setSelectedAccNumber(selectedOption.value);
                setIsDropdownVisible(false);
                setSelectedAccNumber2(selectedOption.value);
              }}
              value={{
                value: selectedAccNumber,
                label:
                  customers && customers[0]?.accountNumber
                    ? customers[0].accountNumber
                    : "Search...",
              }}
              isSearchable
            />
          </div>
        </div>
      </div>
      <section className="absolute top-0 right-10 mt-4">
        <div className="flex justify-end">
          <button
            onClick={() => setConfirmCreateOrder(true)}
            className="mb-3 mr-5 bg-green py-2.5 px-3 rounded-lg text-white font-medium transition-all hover:scale-110 hover:bg-dark-blue"
          >
            Send order
          </button>
          <Link
            onClick={resetStates}
            className="flex w-[120px] mb-3 items-center bg-dark-blue py-2.5 px-3 rounded-lg text-white font-medium transition-all hover:scale-110 "
            href="/orders"
          >
            <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-2 inline-block" /> Go
            back
          </Link>
        </div>
        <div className="px-4 py-4 rounded-3xl flex items-center justify-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {columnsTotal.map(
            (column, index) =>
              initialTotalRows.includes(column.name) && (
                <div key={column.name}>
                  {column.name === "Net Invoice" && (
                    <div className="pr-2">
                      <h1 className="text-xl font-bold">Net invoice</h1>
                      <p className="text-[25px] font-bold text-primary-blue -mt-2">
                        {column.price}
                      </p>
                      <p className="ml-1 text-green font-semibold py-1 px-2 rounded-lg text-[15px] bg-background-green text-center -mt-1">
                        Items: {filledRowCount}
                      </p>
                    </div>
                  )}
                  {column.name === "Profit (£)" && (
                    <div className="border-l border-green border-dashed pl-3">
                      <h1 className=" text-xl font-bold">Profit</h1>
                      <p className="text-[25px] font-bold text-primary-blue -mt-2">
                        {column.percentage}
                      </p>
                      <h2 className="ml-1 text-green font-semibold py-1 px-2 rounded-lg text-[15px] bg-background-green text-center -mt-1">
                        {column.price}
                      </h2>
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </section>
      <div className="flex items-center ml-10 mt-10 w-[70%] px-2 py-1 rounded-md">
        <label className="text-dark-blue">Date: </label>
        <input
          ref={dateInputRef}
          type="date"
          className="border ml-2 p-1.5 rounded-md text-dark-blue"
          min={getCurrentDateMin()}
          onChange={handleDateChange}
          onKeyDown={handleKeyPress}
          value={orderDate}
          onBlur={handleOnBlurDate}
        />
        <label className="ml-3">Inv. number: </label>
        <input
          type="text"
          value="Inv. #"
          readOnly
          className="border ml-2 p-1.5 rounded-md w-20"
        />
        <label className="mx-3 text-lg">Customer Ref: </label>
        <input
          ref={customerInputRef}
          type="text"
          value={customerRef}
          onChange={(e) => setCustomerRef(e.target.value)}
          onKeyDown={handleCustomerRefKeyDown}
          className="border p-2 rounded-md min-w-[150px]"
          onBlur={handleOnBlur}
        />
        <button
          className="bg-dark-blue rounded-md ml-3 hover:scale-110 focus:outline-none flex text-white px-2 py-1 items-center align-middle"
          onClick={() => setDetails(!details)}
        >
          Details
          <ChevronDownIcon
            className={`h-5 w-5 ml-1 text-white transform transition duration-500 ${
              details ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
      <div
        className={`transition-opacity duration-500 ease-out ${
          details ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        } transform`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {details && (
          <div className="bg-light-blue flex flex-wrap items-center justify-around mx-10 mt-2 px-2 py-1 rounded-md">
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Post Code:</h3>
              <h3>
                {customers && customers[0]?.postCode
                  ? customers[0]?.postCode
                  : "-"}
              </h3>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Telephone:</h3>
              <h3>
                {customers && customers[0]?.telephone
                  ? customers[0]?.telephone
                  : "-"}
              </h3>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Address:</h3>
              <h3>
                  {customers && customers[0]?.address ? customers[0]?.address : "-"}
              </h3>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Contact:</h3>
              <h3>
                {customers && customers[0]?.email ? customers[0]?.email : "-"}
              </h3>
            </div>
            {customerDate && (
              <>
                <div className="flex flex-col items-start">
                  <h3 className="font-medium">Route:</h3>
                  <h3>{customerDate[0].nameRoute}</h3>
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="font-medium">Drop:</h3>
                  <h3>{customerDate[0].drop}</h3>
                </div>
              </>
            )}
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Special requirements:</h3>
              <input
                type="text"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                className="p-2 border border-dark-blue rounded-lg m-1 w-[300px]"
                placeholder="Write your comments here"
              />
            </div>
          </div>
        )}
      </div>
      <div className="">
        <Table
          orderDate={orderDate}
          confirmCreateOrder={confirmCreateOrder}
          setConfirmCreateOrder={setConfirmCreateOrder}
          specialRequirements={specialRequirements}
          setSpecialRequirements={setSpecialRequirements}
          customerDate={customerDate}
          customerRef={customerRef}
          shouldFocusCode={shouldFocusCode}
          setShouldFocusCode={setShouldFocusCode}
          setFilledRowCount={setFilledRowCount}
        />
      </div>
      <ModalOrderError
        isvisible={showErrorRoutes}
        onClose={() => setShowErrorRoutes(false)}
        title={"This client does not have an assigned route"}
        message={"Are you sure you want to assign this order to Route 100?"}
        setCustomerDate={setCustomerDate}
        handleKeyPress={handleKeyPress}
        handleDateRef={handleDateRef}
        setAccept={setAccept}
        errorList
      />
    </Layout>
  );
};
export default CreateOrderView;
