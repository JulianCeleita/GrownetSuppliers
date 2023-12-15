"use client";
import React, { useEffect, useState, useRef } from "react";
import Table from "@/app/components/Table";
import { Restaurants, customersData } from "../config/urls.config";
import axios from "axios";
import useTokenStore from "../store/useTokenStore";
import Select from "react-select";
import { useTableStore } from "../store/useTableStore";

const OrderView = () => {
  const { token } = useTokenStore();
  const { customers, setCustomers } = useTableStore();

  const [restaurants, setRestaurants] = useState(null);
  const [selectedAccNumber, setSelectedAccNumber] = useState("");
  const [selectedAccName, setSelectedAccName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNameDropdownVisible, setIsNameDropdownVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(getCurrentDate());

  //Fecha input
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [totalPriceSum, setTotalPriceSum] = useState(0);
  const [totalTaxSum, setTotalTaxSum] = useState(0);
  const [totalNetSum, setTotalNetSum] = useState(0);

  //SUMA NET INVOICE
  const updateTotalPriceSum = (sum) => {
    setTotalPriceSum(sum);
  };

  //SUMA TOTAL VAT
  const updateTotalTaxSum = (sum) => {
    setTotalTaxSum(sum);
  };

  //SUMA TOTAL VAT
  const updateTotalNetSum = (sum) => {
    setTotalNetSum(sum);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRestaurants = await axios.get(Restaurants, {
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

    fetchData();

    if (selectedAccNumber) {
      fetchDataAccNumber();
    } else if (selectedAccName) {
      fetchDataAccName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedAccNumber, selectedAccName]);

  // Click en la pantalla
  useEffect(() => {
    console.log("customers:", customers);

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
      console.log("responseAccNumber", responseAccNumber);
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
      console.log("se ejecuto AccName:");
    } catch (error) {
      console.error("Error fetching AccNumber data", error);
    }
  };

  console.log("customers:", customers);

  const restaurantList = Array.isArray(restaurants) ? restaurants : [];
  console.log("selectedAccName:", selectedAccName);
  console.log("selectedAccNumber:", selectedAccNumber);

  //VENTANA TOTAL
  const [showCheckboxColumnTotal, setShowCheckboxColumnTotal] = useState(false);
  const menuRefTotal = useRef(null);
  const { initialTotalRows, toggleTotalRowVisibility } = useTableStore();
  const columnsTotal = [
    { name: "Net Invoice", price: "£ " + totalNetSum },
    { name: "Total VAT", price: "£ " + totalTaxSum },
    { name: "Total Invoice", price: "£ " + totalPriceSum },
    { name: "Profit (£)", price: "£ 100" },
    { name: "Profit (%)", price: "10.60%" },
  ];
  const handleContextMenuTotal = (e) => {
    e.preventDefault();
    setShowCheckboxColumnTotal(!showCheckboxColumnTotal);
  };
  const handleCheckboxChangeTotal = (columnName) => {
    toggleTotalRowVisibility(columnName);
  };
  const handleClickOutsideTotal = (e) => {
    if (menuRefTotal.current && !menuRefTotal.current.contains(e.target)) {
      setShowCheckboxColumnTotal(false);
    }
  };
  console.log("initialTotalsi:", initialTotalRows);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-6 shadow-lg bg-primary-blue pb-20">
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg text-dark-blue">
          <h3 className="m-3">Account Name:</h3>
          <div className="relative ml-3">
            <Select
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
                  customers && customers.accountName
                    ? customers.accountName
                    : "Search...",
              }}
              isSearchable
            />
          </div>

          <div className="grid grid-cols-2 m-3 gap-2">
            <h3>Account Number:</h3>
            <div className="relative">
              <Select
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
                    customers && customers.accountNumber
                      ? customers.accountNumber
                      : "Search...",
                }}
                isSearchable
              />
            </div>

            <h3>Post Code:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {customers && customers.postCode ? customers.postCode : ""}
            </h3>
          </div>
          <div className="grid grid-cols-2 m-3 gap-2">
            <h3>Address:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {customers && customers.address ? customers.address : ""}
            </h3>
            <h3>Telephone:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {" "}
              {customers && customers.telephone ? customers.telephone : ""}
            </h3>
          </div>
          <h3 className="ml-3">Contact:</h3>
          <h3 className="underline decoration-2 decoration-green ml-3">
            {customers && customers.email ? customers.email : ""}
          </h3>
        </div>
        <div className="bg-white p-2 pr-9 pl-9 rounded-lg flex flex-col justify-center">
          <div className="flex items-center mb-3">
            <label>Date: </label>
            <input
              type="date"
              className="border ml-2 p-1.5 rounded-md w-[100%] "
              min={getCurrentDate()}
            />
            <label className="ml-3">Inv. No.: </label>
            <input
              type="text"
              className="border ml-2 p-1.5 rounded-md w-[100%]"
            />
          </div>
          <div className="grid grid-cols-2">
            <label>Order No.: </label>
            <input type="text" className="border p-2 rounded-md mb-2" />

            <h3>Round:</h3>
            <h3 className="underline decoration-2 decoration-green mb-2">
              1056
            </h3>
            {/*<h3>Drop:</h3>
          <h3 className="underline decoration-2 decoration-green">{""}</h3>*/}
          </div>
        </div>
        <div
          className="bg-white p-2 pr-9 pl-9 rounded-lg flex flex-col justify-center"
          onContextMenu={(e) => handleContextMenuTotal(e)}
        >
          <h1 className="text-lg text-primary-blue font-semibold w-[80%] ml-5">
            Payment details
          </h1>
          {columnsTotal.map(
            (column, index) =>
              initialTotalRows.includes(column.name) && (
                <div className=" flex items-center" key={column.name}>
                  <h1 className="text-lg text-dark-blue font-semibold w-[80%] ml-5">
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
            className="w-[40%] bg-white p-3 border rounded-xl"
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
      </div>
      <div className="-mt-20">
        <Table
          updateTotalPriceSum={updateTotalPriceSum}
          updateTotalTaxSum={updateTotalTaxSum}
          updateTotalNetSum={updateTotalNetSum}
        />
      </div>
    </>
  );
};
export default OrderView;
