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
  const [selectedAccName, setSelectedAccName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNameDropdownVisible, setIsNameDropdownVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(getCurrentDate());
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const { user, setUser } = useUserStore();
  //Fecha input
  function getCurrentDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
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
          (a, b) => a.accountName.localeCompare(b.accountName)
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

  const restaurantList = Array.isArray(restaurants) ? restaurants : [];

  //VENTANA TOTAL
  const [showCheckboxColumnTotal, setShowCheckboxColumnTotal] = useState(false);
  const menuRefTotal = useRef(null);
  const { initialTotalRows, toggleTotalRowVisibility } = useTableStore();
  const columnsTotal = [
    { name: "Net Invoice", price: "£ " + totalNetSum },
    { name: "Total VAT", price: "£ " + totalTaxSum },
    { name: "Total Invoice", price: "£ " + totalPriceSum },
    { name: "Profit (£)", price: "£ " + totalProfit },
    { name: "Profit (%)", price: totalProfitPercentage + "%" },
  ];

  const handleContextMenuTotal = (e) => {
    e.preventDefault();
    setShowCheckboxColumnTotal(!showCheckboxColumnTotal);
    setMouseCoords({ x: e.clientX, y: e.clientY });
  };
  const handleCheckboxChangeTotal = (columnName) => {
    toggleTotalRowVisibility(columnName);
  };
  const handleClickOutsideTotal = (e) => {
    if (menuRefTotal.current && !menuRefTotal.current.contains(e.target)) {
      setShowCheckboxColumnTotal(false);
    }
  };

  const handleDateChange = (e) => {
    setOrderDate(e.target.value);
  };

  const resetStates = () => {
    setCustomers("");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="max-w-[400px] -mt-[110px] ml-[115px]">
        <div className="flex mt-1 items-center">
          <h3 className="w-[38%] text-white">Account Name:</h3>
          <div className="relative mb-2 w-[62%]">
            <Select
              instanceId
              options={restaurantList.map((restaurant) => ({
                value: restaurant.accountName,
                label: restaurant.accountName,
              }))}
              onChange={(selectedOption) => {
                setSelectedAccName(selectedOption.value);
                setIsDropdownVisible(false);
              }}
              value={{
                value: selectedAccNumber,
                label:
                  customers && customers[0].accountName
                    ? customers[0].accountName
                    : "Search...",
              }}
              isSearchable
            />
          </div>
        </div>

        <div className="flex items-center">
          <h3 className="w-[38%] text-white">Account Number:</h3>
          <div className="relative mb-2 w-[62%]">
            <Select
              instanceId
              options={restaurantList.map((restaurant) => ({
                value: restaurant.accountNumber,
                label: restaurant.accountNumber,
              }))}
              onChange={(selectedOption) => {
                setSelectedAccNumber(selectedOption.value);
                setIsDropdownVisible(false);
              }}
              value={{
                value: selectedAccNumber,
                label:
                  customers && customers[0].accountNumber
                    ? customers[0].accountNumber
                    : "Search...",
              }}
              isSearchable
            />
          </div>
        </div>
      </div>
      {/* <Link
        onClick={resetStates}
        className="flex w-[120px] items-center bg-dark-blue py-2.5 px-3 rounded-lg text-white font-medium transition-all hover:scale-110 "
        href="/orders"
      >
        <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-2 inline-block" /> Go back
      </Link> */}

      {/* <div className="grid grid-cols-3 gap-4 p-5 shadow-lg bg-primary-blue pb-20">
        <div
          className="bg-white p-2 pr-9 pl-9 rounded-lg flex flex-col justify-center"
          onContextMenu={(e) => handleContextMenuTotal(e)}
        >
          <h1 className="text-lg text-primary-blue font-semibold ml-5">
            Payment details
          </h1>
          {columnsTotal.map(
            (column, index) =>
              initialTotalRows.includes(column.name) && (
                <div className=" flex items-center" key={column.name}>
                  <h1 className="text-lg text-dark-blue font-semibold w-[60%] ml-5">
                    {column.name}
                  </h1>
                  <p className="text-dark-blue text-lg w-[40%]">
                    {column.price}
                  </p>
                </div>
              )
          )}
        </div> 
        {showCheckboxColumnTotal === true && (
          <div
            ref={menuRefTotal}
            className="absolute w-[40%] bg-white p-3 border rounded-xl"
            style={{
              top: `${mouseCoords.y}px`,
              left: `${mouseCoords.x}px`,
            }}
          >
            <h4 className="font-bold mb-2 text-dark-blue">Show/Hide Columns</h4>
            {columnsTotal.map((column) => (
              <div
                key={column.name}
                className="flex items-center text-dark-blue"
              >
                <input
                  type="checkbox"
                  id={column.name}
                  checked={initialTotalRows.includes(column.name)}
                  onChange={() => handleCheckboxChangeTotal(column.name)}
                />
                <label htmlFor={column.name} className="ml-2">
                  {column.name}
                </label>
              </div>
            ))}
            <button
              className="mt-2 text-danger"
              onClick={() => setShowCheckboxColumnTotal(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>*/}
      <div className="flex items-center ml-10 mt-5 w-[70%] px-2 py-1 rounded-md">
        <label className="text-dark-blue">Date: </label>
        <input
          type="date"
          className="border ml-2 p-1.5 rounded-md text-dark-blue"
          min={getCurrentDate()}
          onChange={handleDateChange}
          value={orderDate}
        />
        <label className="ml-3">Inv. number: </label>
        <input
          type="text"
          value="Invoice Number."
          readOnly
          className="border ml-2 p-1.5 rounded-md"
        />
        <label className="mx-3">Order Number: </label>
        <input type="text" className="border p-2 rounded-md" />

        {details ? (
          <button
            className="bg-dark-blue rounded-md ml-3 transition-all hover:scale-110"
            onClick={() => setDetails(false)}
          >
            <ChevronUpIcon className="h-7 w-7 text-white p-1" />
          </button>
        ) : (
          <button
            className="bg-dark-blue rounded-md ml-3 transition-all hover:scale-110"
            onClick={() => setDetails(true)}
          >
            <ChevronDownIcon className="h-7 w-7 text-white p-1" />
          </button>
        )}
      </div>
      {details && (
        <div className="bg-light-blue flex items-center justify-around mx-10 mt-2 px-2 py-1 rounded-md">
          <h3>Post Code:</h3>
          <h3 className="underline decoration-2 decoration-green">
            {customers && customers[0].postCode ? customers[0].postCode : ""}
          </h3>
          <h3>Telephone:</h3>
          <h3 className="underline decoration-2 decoration-green">
            {customers && customers[0].telephone ? customers[0].telephone : ""}
          </h3>
          <h3 className="">Address:</h3>
          <h3 className="underline decoration-2 decoration-green ">
            {customers && customers[0].address ? customers[0].address : ""}
          </h3>
          <h3 className="">Contact:</h3>
          <h3 className="underline decoration-2 decoration-green ">
            {customers && customers[0].email ? customers[0].email : ""}
          </h3>
        </div>
      )}
      <div className="">
        <Table />
      </div>
    </Layout>
  );
};
export default CreateOrderView;
