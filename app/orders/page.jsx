"use client";
import React, { useEffect, useState } from "react";
import Table from "@/app/components/Table";
import { AccName, AccNumber, Restaurants } from "../config/urls.config";
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
        `${AccNumber}${selectedAccNumber}`,
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
        `${AccName}${selectedAccName}`,
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
  console.log("restaurants:", restaurants);
  const restaurantList = Array.isArray(restaurants) ? restaurants : [];
  console.log("selectedAccName:", selectedAccName);
  console.log("selectedAccNumber:", selectedAccNumber);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-6 shadow-lg bg-primary-blue pb-20">
        <div className="grid grid-cols-2 bg-white p-5 rounded-lg shadow-lg text-dark-blue">
          <h3>Account Number:</h3>
          <div className="relative mb-2">
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
          <h3>Address:</h3>
          <h3 className="underline decoration-2 decoration-green mb-2">
            {customers && customers.address ? customers.address : ""}
          </h3>
          <h3>Post Code:</h3>
          <h3 className="underline decoration-2 decoration-green">
            {customers && customers.postCode ? customers.postCode : ""}
          </h3>
        </div>
        <div className="grid grid-cols-2 bg-white p-5 rounded-lg shadow-lg text-dark-blue">
          <h3>Account Name:</h3>
          <div className="relative mb-2">
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

          <h3>Contact:</h3>
          <h3 className="underline decoration-2 decoration-green mb-2">
            {customers && customers.email ? customers.email : ""}
          </h3>
          <h3>Telephone:</h3>
          <h3 className="underline decoration-2 decoration-green">
            {" "}
            {customers && customers.telephone ? customers.telephone : ""}
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
      </div>
      <div className="-mt-20">
        <Table />
      </div>
    </>
  );
};
export default OrderView;
