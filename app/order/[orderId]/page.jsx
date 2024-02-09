"use client";
import EditTable from "@/app/components/EditTable";
import {
  customersData,
  orderDetail,
  restaurantsData,
  routesByDate,
} from "@/app/config/urls.config";
import RootLayout from "@/app/layout";
import Layout from "@/app/layoutS";
import { useTableStore } from "@/app/store/useTableStore";
import useTokenStore from "@/app/store/useTokenStore";
import useUserStore from "@/app/store/useUserStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchOrderDetail } from "@/app/api/ordersRequest";
import { CircleProgressBar } from "@/app/components/CircleProgressBar";

const OrderDetailPage = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { token, setToken } = useTokenStore();
  const {
    customers,
    setCustomers,
    totalNetSum,
    totalPriceSum,
    totalTaxSum,
    totalCostSum,
    totalProfit,
    totalProfitPercentage,
    setOrderDetail,
    orderDetail,
  } = useTableStore();

  const [restaurants, setRestaurants] = useState(null);
  const [selectedAccNumber, setSelectedAccNumber] = useState("");
  const [selectedAccName, setSelectedAccName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNameDropdownVisible, setIsNameDropdownVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(getCurrentDate());
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState("");
  const [percentageDetail, setPercentageDetail] = useState(null)
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [accName, setAccName] = useState("");
  const params = useParams();

  let orderId;
  if (params) {
    ({ orderId } = params);
  }

  //Fecha input
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      if (token !== null && orderId !== null) {
        fetchOrderDetail(token, setOrderDetail, setIsLoading, orderId);
      }
    }
  }, [orderId, setOrderDetail, token, setToken]);

  useEffect(() => {
    setHasMounted(true);
    if (orderDetail && orderDetail.date_delivery) {
      setSelectedDate(orderDetail.date_delivery);
    }
  }, [orderDetail]);

  useEffect(() => {
    setAccName(orderDetail ? orderDetail.accountName : "");
  }, [orderDetail]);

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

    fetchData();

    if (selectedAccNumber) {
      fetchDataAccNumber();
    } else if (selectedAccName) {
      fetchDataAccName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

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
      setOrderDetail(updatedCustomers);
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
      setOrderDetail(updatedCustomers);
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

  const getRoutes = async (token, date) => {
    try {
      const { data } = await axios.post(routesByDate, { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      data.routes.forEach((route) => {
        route.accounts.forEach((account) => {
          if (account.orders_reference === Number(orderId)) {
            const percentage = Number(account.percentage_loading).toFixed(0);
            setPercentageDetail(percentage);
          }
        });
      });
    } catch (error) {
      console.log('Error in getRoutes:', error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      getRoutes(token, selectedDate);
    }
  }, [selectedDate])


  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {token ? (
        <Layout>
          <div className="flex p-6 pb-0 bg-primary-blue">
            <Link
              className="flex bg-dark-blue py-3 px-4 rounded-lg text-white font-medium transition-all hover:scale-110 "
              href="/"
            >
              <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" />{" "}
              Orders
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 p-6 shadow-lg bg-primary-blue pb-20">
            {!isLoading && (
              <>
                <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg text-dark-blue">
                  <h3 className="m-3">Account Name:</h3>
                  <div className="relative ml-3">
                    <h3 className="underline decoration-2 decoration-green mt-3">
                      {" "}
                      {orderDetail && orderDetail.accountName
                        ? orderDetail.accountName
                        : ""}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 m-3 gap-2">
                    <h3>Account Number:</h3>
                    <div className="relative">
                      <h3 className="underline decoration-2 decoration-green">
                        {" "}
                        {orderDetail && orderDetail.accountNumber
                          ? orderDetail.accountNumber
                          : ""}
                      </h3>
                    </div>

                    <h3>Post Code:</h3>
                    <h3 className="underline decoration-2 decoration-green">
                      {customers && customers.postCode
                        ? customers.postCode
                        : ""}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 m-3 gap-2">
                    <h3>Address:</h3>
                    <h3 className="underline decoration-2 decoration-green">
                      {orderDetail && orderDetail.address_delivery
                        ? orderDetail.address_delivery
                        : ""}
                    </h3>
                    <h3>Telephone:</h3>
                    <h3 className="underline decoration-2 decoration-green">
                      {" "}
                      {orderDetail && orderDetail.telephone_customer
                        ? orderDetail.telephone_customer
                        : ""}
                    </h3>
                  </div>
                  <h3 className="ml-3">Contact:</h3>
                  <h3 className="underline decoration-2 decoration-green ml-3">
                    {orderDetail && orderDetail.email ? orderDetail.email : ""}
                  </h3>
                </div>
                <div className="bg-white p-2 pr-9 pl-9 rounded-lg flex flex-col justify-center">
                  <div className="flex items-center mb-3">
                    <label>Date: </label>
                    <input
                      type="date"
                      className="border ml-2 p-1.5 rounded-md w-[100%] "
                      value={selectedDate}
                      onChange={handleDateChange}
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
                    <h4 className="font-bold mb-2 text-dark-blue">
                      Show/Hide Columns
                    </h4>
                    {columnsTotal.map((column) => (
                      <div
                        key={column.name}
                        className="flex items-center text-dark-blue"
                      >
                        <input
                          type="checkbox"
                          id={column.name}
                          checked={initialTotalRows.includes(column.name)}
                          onChange={() =>
                            handleCheckboxChangeTotal(column.name)
                          }
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
              </>
            )}
          </div>
          <div className="-mt-20">
            {isLoading ? (
              <div className="flex justify-center items-center mt-24">
                <div className="loader"></div>
              </div>
            ) : (
              orderId && (
                <>
                  <section className="fixed top-0 right-10 mt-8">
                    <div className="flex gap-4">
                      <div className="grid grid-cols-2 py-3 px-4 shadow-sm rounded-3xl shadow-slate-400 bg-white">
                        <div className="flex flex-col col-span-1 pr-2 items-center justify-center">
                          <h1 className="text-xl font-bold text-primary-blue">
                            Status
                          </h1>
                          <h2 className="text-sm text-black px-1 font-semibold">
                            Loading
                          </h2>
                        </div>
                        {/* TODO AGREGAR EN ESTE DIV EL PORCENTAJE DE LOADING PARA RUTA SELECCIONADA */}
                        <div className="flex col-span-1 items-center justify-center">

                          {!percentageDetail ? (
                            <div className="flex items-center justify-center bg-primary-blue rounded-full w-16 h-16">
                              <img
                                src="/loadingBlanco.png"
                                alt=""
                                className="w-10 h-7"
                              />
                            </div>
                          ) : (
                            <CircleProgressBar percentage={percentageDetail} />
                          )}

                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 px-3 py-3 items-center justify-center shadow-sm rounded-3xl bg-white shadow-slate-400">
                        <div>
                          <h1 className="flex text-lg font-semibold items-center justify-center text-black">
                            Net Invoice
                          </h1>
                          <div className="flex justify-center text-center">
                            <div className="flex items-center">
                              <h2 className="text-2xl font-bold text-primary-blue">
                                £8,000
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="border-l border-gray-400">
                          <h2 className="flex text-xl font-semibold items-center justify-center text-black">
                            Profit
                          </h2>
                          <div className="flex justify-center text-center">
                            <div className="grid grid-cols-1 text-center">
                              <div>
                                <p className="text-2xl font-bold text-primary-blue">
                                  97.2%
                                </p>
                              </div>
                              <h2 className="flex items-center justify-center text-green-500 rounded-full text-sm bg-light-green text-dark-green">
                                £1,476
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <EditTable orderId={orderId} dateDelivery={selectedDate} />
                </>
              )
            )}
          </div>
        </Layout>
      ) : (
        <RootLayout></RootLayout>
      )}
    </>
  );
};
export default OrderDetailPage;
