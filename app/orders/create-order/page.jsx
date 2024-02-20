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
  const [customerDate, setCustomerDate] = useState();
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
        console.log(
          "🚀 ~ fetchData ~ responseRestaurants:",
          responseRestaurants
        );

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
  console.log("customerDate", customerDate);

  useEffect(() => {
    fetchCustomersDate(token, orderDate, selectedAccNumber2, setCustomerDate);
  }, [orderDate, selectedAccNumber2]);

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
      <div className="max-w-[650px] -mt-[110px] ml-[115px]">
        <div className="flex mt-1 items-center">
          <h3 className="w-[42%] text-white">Account name:</h3>
          <div className="relative mb-2 w-[100%]">
            <Select
              instanceId
              options={restaurantList.map((restaurant) => ({
                value: restaurant.accountName,
                label: restaurant.accountName,
                accNumber: restaurant.accountNumber,
              }))}
              onChange={(selectedOption) => {
                setSelectedAccName(selectedOption.value);
                setIsDropdownVisible(false);
                setSelectedAccNumber2(selectedOption.accNumber);
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
          <h3 className="w-[42%] text-white">Account number:</h3>
          <div className="relative mb-2 w-[100%]">
            <Select
              instanceId
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
                  customers && customers[0].accountNumber
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
                      <h1 className="flex text-xl font-bold">Net invoice</h1>
                      <p className="text-[28px] font-bold text-primary-blue">
                        {column.price}
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
      <div className="flex items-center ml-10 mt-10 w-[70%] px-2 py-1 rounded-md">
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
          value="Inv. #"
          readOnly
          className="border ml-2 p-1.5 rounded-md w-20"
        />
        <label className="mx-3 text-lg">Customer Ref: </label>
        <input type="text" className="border p-2 rounded-md w-20" />

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
        <div className="bg-light-blue flex flex-wrap items-center justify-around mx-10 mt-2 px-2 py-1 rounded-md">
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Post Code:</h3>
            <h3>
              {customers && customers[0].postCode ? customers[0].postCode : ""}
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Telephone:</h3>
            <h3>
              {customers && customers[0].telephone
                ? customers[0].telephone
                : "-"}
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Address:</h3>
            <h3>
              {customers && customers[0].address ? customers[0].address : ""}
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-medium">Contact:</h3>
            <h3>
              {customers && customers[0].email ? customers[0].email : "-"}
            </h3>
          </div>
          {customerDate && (
            <>
              <div className="flex flex-col items-start">
                <h3 className="font-medium">Route:</h3>
                <h3>{customerDate[0]?.nameRoute}</h3>
              </div>
              <div className="flex flex-col items-start">
                <h3 className="font-medium">Drop:</h3>
                <h3>{customerDate[0]?.drop}</h3>
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
      <div className="">
        <Table
          orderDate={orderDate}
          confirmCreateOrder={confirmCreateOrder}
          setConfirmCreateOrder={setConfirmCreateOrder}
          specialRequirements={specialRequirements}
          setSpecialRequirements={setSpecialRequirements}
        />
      </div>
    </Layout>
  );
};
export default CreateOrderView;
