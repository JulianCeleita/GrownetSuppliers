"use client";
import React, { useEffect, useState } from "react";
import Table from "@/app/components/Table";
import { AccName, AccNumber, Restaurants } from "../config/urls.config";
import axios from "axios";
import useTokenStore from "../store/useTokenStore";
import Select from "react-select";

const OrderView = () => {
  const { token } = useTokenStore();
  const [customers, setCustomers] = useState(null);

  const [restaurants, setRestaurants] = useState(null);
  const [selectedAccNumber, setSelectedAccNumber] = useState("");
  const [selectedAccName, setSelectedAccName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNameDropdownVisible, setIsNameDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRestaurants = await axios.get(Restaurants, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurants(responseRestaurants.data.customersChef);
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
  }, [token, selectedAccNumber, selectedAccName]);

  //click en la pantalla
  useEffect(() => {
    console.log("AccNumber:", customers);

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

      setCustomers(responseAccNumber.data.data);
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

      setCustomers(responseAccNumber.data.data);
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
      <div className="grid grid-cols-2 gap-4 p-6 shadow-lg bg-primary-blue pb-20">
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg text-dark-blue">
          <div className="grid grid-cols-2 m-4 gap-2">
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
                    customers && customers.length > 0
                      ? customers[0].accountNumber
                      : "Search...",
                }}
                isSearchable
              />
            </div>

            <h3>Post Code:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {customers && customers.length > 0 ? customers[0].postCode : ""}
            </h3>
            <h3>Telephone:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {" "}
              {customers && customers.length > 0 ? customers[0].telephone : ""}
            </h3>
            <h3>Round:</h3>
            <h3 className="underline decoration-2 decoration-green">{""}</h3>
          </div>
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Account Name:</h3>
            <div className="relative">
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
                    customers && customers.length > 0
                      ? customers[0].accountName
                      : "Search...",
                }}
                isSearchable
              />
            </div>
            <h3>Address:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {customers && customers.length > 0 ? customers[0].address : ""}
            </h3>
            <h3>Contact:</h3>
            <h3 className="underline decoration-2 decoration-green">
              {customers && customers.length > 0 ? customers[0].email : ""}
            </h3>
            <h3>Drop:</h3>
            <h3 className="underline decoration-2 decoration-green">{""}</h3>
          </div>
        </div>
        <div className="bg-white p-5 pr-9 pl-9 rounded-lg">
          <div className="flex">
            <div className="flex flex-col w-[50%]">
              <label>Date: </label>
              <input type="date" className="border p-1.5 rounded-md mr-2" />
              <label className="mt-2">A/C: </label>
              <input type="text" className="border p-1.5 rounded-md mr-2" />
            </div>
            <div className="flex flex-col w-[50%]">
              <label>Inv. No.: </label>
              <input type="text" className="border p-1.5 rounded-md mr-2" />
              <label className="mt-2">Order No.: </label>
              <input type="text" className="border p-1.5 rounded-md mr-2" />
            </div>
          </div>
          <label>Customer: </label>
          <input type="text" className="border p-3 rounded-md mt-3 w-full" />
        </div>
      </div>
      <div className="-mt-20">
        <Table/>
      </div>
    </>
  );
};
export default OrderView;
