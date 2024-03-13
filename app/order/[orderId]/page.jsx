"use client";
import EditTable from "@/app/components/EditTable";
import {
  customersData,
  deleteOrder,
  orderDetail,
  restaurantsData,
  routesByDate,
} from "@/app/config/urls.config";
import RootLayout from "@/app/layout";
import Layout from "@/app/layoutS";
import { useTableStore } from "@/app/store/useTableStore";
import useTokenStore from "@/app/store/useTokenStore";
import useUserStore from "@/app/store/useUserStore";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCustomersDate, fetchOrderDetail } from "@/app/api/ordersRequest";
import { CircleProgressBar } from "@/app/components/CircleProgressBar";
import Select from "react-select";
import { getPercentageOrder } from "../../api/percentageOrderRequest";
import ModalDelete from "@/app/components/ModalDelete";
import ModalOrderDelete from "@/app/components/ModalDeleteOrder";

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
  const [selectedAccNumber2, setSelectedAccNumber2] = useState("");
  const [selectedAccName, setSelectedAccName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNameDropdownVisible, setIsNameDropdownVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(getCurrentDate());
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState("");
  const [percentageDetail, setPercentageDetail] = useState(null);
  const [details, setDetails] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [accName, setAccName] = useState("");
  const params = useParams();
  const [confirmCreateOrder, setConfirmCreateOrder] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postCode, setPostCode] = useState("-");
  const [messageDelete, setMessageDelete] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState(
    orderDetail?.observation ? orderDetail.observation : ""
  );
  const [customerDate, setCustomerDate] = useState();
  const [customersRef, setCustomersRef] = useState(
    orderDetail?.customers_ref ? orderDetail.customers_ref : ""
  );

  let accountNumberCustomer = orderDetail?.accountName;

  if (selectedAccName) {
    accountNumberCustomer = selectedAccNumber;
  } else {
    accountNumberCustomer = orderDetail?.accountNumber;
  }
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
    setSelectedAccName(orderDetail ? orderDetail.accountName : "");
    setSelectedAccNumber(orderDetail?.accountNumber);
    setSelectedAccNumber2(orderDetail?.accountNumber);
    setCustomersRef(orderDetail ? orderDetail.customers_ref : "");
    setPostCode(orderDetail ? orderDetail.postCode : "");
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
          (a, b) => a?.accountName?.localeCompare(b.accountName)
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

  useEffect(() => {
    if (selectedAccNumber || selectedAccName) {
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
      fetchDataBySupplier();

      if (selectedAccNumber) {
        setSelectedAccName(null);
        fetchDataAccNumber();
      }
      if (selectedAccName) {
        setSelectedAccNumber(null);
        fetchDataAccName();
      }
    }
  }, [selectedAccNumber, selectedAccName]);

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
    setOrderDate(e.target.value);
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
      // setOrderDetail(updatedCustomers);
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
      // setOrderDetail(updatedCustomers);
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

  useEffect(() => {
    if (selectedDate) {
      getPercentageOrder(
        token,
        selectedDate,
        orderId,
        setPercentageDetail,
        setDataLoaded
      );
    }
  }, [selectedDate]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchCustomersDate(token, orderDate, selectedAccNumber2, setCustomerDate);
  }, [orderDate, selectedAccNumber2]);

  useEffect(() => {
    if (showDeleteModal) {
      if (
        orderDetail.state_name === "Received" ||
        orderDetail.state_name === "Generated"
      ) {
        setMessageDelete("You won't be able to revert this");
      } else {
        setMessageDelete(
          "This order is already being processed, are you sure you want to delete it?"
        );
      }
    }
  }, [showDeleteModal]);

  //RUN BUTTON WITH CRT + ENTER
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      setConfirmCreateOrder(true);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDeleteOrder = (orderId) => {
    axios
      .post(`${deleteOrder}${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        router.push("/orders");
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
      });
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedAccName(selectedOption.value);
    setIsDropdownVisible(false);
    setSelectedAccNumber2(selectedOption.accNumber);
  };

  if (!hasMounted) {
    return null;
  }
  return (
    <Layout>
      <div className="max-w-[650px] -mt-[110px] ml-[115px]">
        <div className="flex mt-1 items-center">
          <h3 className="w-[42%] text-white">Account name:</h3>
          <div className="relative mb-2 w-[100%]">
            <Select
              options={restaurantList.map((restaurant) => ({
                value: restaurant.accountName,
                label: restaurant.accountName,
                accNumber: restaurant.accountNumber,
              }))}
              onChange={handleSelectChange}
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
            Save changes
          </button>
          <Link
            className="flex w-[120px] mb-3 items-center bg-dark-blue py-2.5 px-3 rounded-lg text-white font-medium transition-all hover:scale-110 "
            href="/"
          >
            <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-2 inline-block" /> Go
            back
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-4 rounded-3xl flex items-center justify-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex flex-col col-span-1 pr-2 items-center justify-center">
              <h1 className="text-xl font-bold text-primary-blue">Status</h1>
              <h2 className="text-sm px-1 font-semibold">
                {orderDetail?.state_name}
              </h2>
              <p className="text-green font-semibold py-1 px-2 rounded-lg text-[15px] bg-background-green text-center">
                Items:{" "}
                <span>
                  {orderDetail && orderDetail.products
                    ? orderDetail.products.length
                    : 0}
                </span>
              </p>
            </div>
            {/* TODO AGREGAR EN ESTE DIV EL PORCENTAJE DE LOADING PARA RUTA SELECCIONADA */}
            <div className="flex col-span-1 items-center justify-center">
              {!percentageDetail ? (
                <div className="flex items-center justify-center bg-primary-blue rounded-full w-16 h-16">
                  <img src="/loadingBlanco.png" alt="" className="w-10 h-7" />
                </div>
              ) : (
                <CircleProgressBar percentage={percentageDetail} />
              )}
            </div>
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
        </div>
      </section>
      <div className="flex items-center ml-10 mt-10 w-[70%] px-2 py-1 rounded-md">
        <label className="text-dark-blue">Date: </label>
        <input
          type="date"
          className="border ml-2 p-1.5 rounded-md text-dark-blue"
          value={selectedDate}
          onChange={handleDateChange}
          min={getCurrentDate()}
        />
        <label className="ml-3">Inv. number: </label>
        <input
          type="text"
          value={
            orderDetail && orderDetail.reference ? orderDetail.reference : ""
          }
          readOnly
          className="border ml-2 p-1.5 rounded-md w-20"
        />
        <label className="mx-3 text-lg">Customer Ref: </label>
        <input
          type="text"
          value={customersRef}
          onChange={(e) => setCustomersRef(e.target.value)}
          className="border p-2 rounded-md min-w-[150px]"
        />
        <button
          className="bg-dark-blue rounded-md ml-3 transition-all hover:scale-110 focus:outline-none flex text-white px-2 py-1 items-center align-middle"
          onClick={() => setDetails(!details)}
        >
          Details
          <ChevronDownIcon
            className={`h-5 w-5 ml-1 text-white transform transition duration-500 ${details ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>
        <button
          className="bg-danger rounded-md ml-3 transition-all hover:scale-110 focus:outline-none flex text-white px-2 py-1 items-center align-middle"
          onClick={() => setShowDeleteModal(true)}
        >
          <TrashIcon className={`h-[25px] w-[25px] text-white`} />
        </button>
      </div>
      <div
        className={`transition-opacity duration-500 ease-out ${details ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          } transform`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {details && (
          <div className="bg-light-blue grid grid-cols-6 gap-4 mx-10 mt-2 px-2 py-1 rounded-md">
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Post Code:</h3>
              <h3>
                {customers && customers[0].postCode
                  ? customers[0].postCode
                  : orderDetail && orderDetail.postCode
                    ? orderDetail.postCode
                    : "-"}
              </h3>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Telephone:</h3>
              {customers && customers[0].telephone
                ? customers[0].telephone
                : orderDetail && orderDetail.telephone_customer
                  ? orderDetail.telephone_customer
                  : "-"}
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Address:</h3>
              <h3>
                {customers && customers[0].address
                  ? customers[0].address
                  : orderDetail.address_delivery}
              </h3>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Contact:</h3>
              <h3>
                {customers && customers[0].email
                  ? customers[0].email
                  : orderDetail && orderDetail.email
                    ? orderDetail.email
                    : "-"}
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
              <h3 className="font-medium">Driver:</h3>
              <h3>{orderDetail && orderDetail.name ? orderDetail.name : "-"}</h3>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-medium">Delivery time:</h3>
              <h3>
                {orderDetail && orderDetail.end ? orderDetail.end : "-"}
              </h3>
            </div>

            <div className="flex flex-col items-start">
              <h3 className="font-medium">Delivery evidence:</h3>
              {orderDetail.evidences != null ? (
                <a
                  href={orderDetail.evidences}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue font-medium hover:scale-105 hover:text-green transition-all"
                >
                  View image
                </a>
              ) : (
                <p className="text-gray-input">Without evidence</p>
              )}
            </div>
            <div className="flex flex-col items-start min-w-[280px]">
              <h3 className="font-medium">Special requirements:</h3>
              <input
                type="text"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                className="p-2 border border-dark-blue rounded-lg m-1 w-full"
                placeholder="Write your comments here"
              />
            </div>
          </div>
        )
        }
      </div >
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center mt-24">
            <div className="loader"></div>
          </div>
        ) : (
          orderId && (
            <>
              <EditTable
                orderId={orderId}
                dateDelivery={selectedDate}
                confirmCreateOrder={confirmCreateOrder}
                setConfirmCreateOrder={setConfirmCreateOrder}
                specialRequirements={specialRequirements}
                setSpecialRequirements={setSpecialRequirements}
                percentageDetail={percentageDetail}
                dataLoaded={dataLoaded}
                customersRef={customersRef}
                selectedAccNumber={accountNumberCustomer}
                deliveryCustomer={orderDetail.address_delivery}
              />
            </>
          )
        )}
      </div>
      <ModalOrderDelete
        isvisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteOrder(orderId)}
        message={messageDelete}
      />
    </Layout >
  );
};
export default OrderDetailPage;
