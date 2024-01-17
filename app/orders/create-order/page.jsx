"use client";
import Table from "@/app/components/Table";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { customersData, customerSupplier, restaurantsData } from "../../config/urls.config";
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
        const responseRestaurants = await axios.get(`${customerSupplier}${user.id_supplier}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedRestaurants = responseRestaurants.data.customers.sort(
          (a, b) => a.accountName.localeCompare(b.accountName)
        );

        setRestaurants(sortedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants data by supplier", error);
      }
    };

    if (user.rol_name !== "AdminGrownet") {
      fetchDataBySupplier();
    } else {
      fetchData();
    }

    if (selectedAccNumber) {
      fetchDataAccNumber();
    } else if (selectedAccName) {
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

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <div className="flex p-6 pb-0 bg-primary-blue">
        <Link
          className="flex bg-dark-blue py-3 px-4 rounded-lg text-white font-medium transition-all hover:scale-110 "
          href="/orders"
        >
          <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" /> Orders
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4 p-5 shadow-lg bg-primary-blue pb-20">
        <div className="bg-white p-4 rounded-lg shadow-lg text-dark-blue">
          <div className="flex">
            <h3 className="w-[40%]">Account Name:</h3>
            <div className="relative mb-2 w-[60%]">
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
                    customers && customers.accountName
                      ? customers.accountName
                      : "Search...",
                }}
                isSearchable
              />
            </div>
          </div>
          <div className="flex">
            <h3 className="w-[40%]">Account Number:</h3>
            <div className="relative mb-2 w-[60%]">
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
                    customers && customers.accountNumber
                      ? customers.accountNumber
                      : "Search...",
                }}
                isSearchable
              />
            </div>
          </div>
          <div className="grid grid-cols-2 mb-2">
            <div className="grid grid-cols-2">
              <h3>Post Code:</h3>
              <h3 className="underline decoration-2 decoration-green">
                {customers && customers.postCode ? customers.postCode : ""}
              </h3>
            </div>
            <div className="grid grid-cols-2">
              <h3>Telephone:</h3>
              <h3 className="underline decoration-2 decoration-green">
                {" "}
                {customers && customers.telephone ? customers.telephone : ""}
              </h3>
            </div>
          </div>
          <div className="flex mb-2">
            <h3 className="w-[20%]">Address:</h3>
            <h3 className="underline decoration-2 decoration-green w-[80%]">
              {customers && customers.address ? customers.address : ""}
            </h3>
          </div>
          <div className="flex mb-2">
            <h3 className="w-[20%]">Contact:</h3>
            <h3 className="underline decoration-2 decoration-green w-[80%]">
              {customers && customers.email ? customers.email : ""}
            </h3>
          </div>
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
              value="Order"
              readOnly
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
      </div>
      <div className="-mt-20">
        <Table />
      </div>
    </Layout>
  );
};
export default CreateOrderView;
